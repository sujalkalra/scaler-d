import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Sparkles, RotateCcw, Trophy, ClipboardCheck } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { roadmapData } from "@/components/roadmap/roadmapData"
import { SENTINEL_BADGE } from "@/lib/badges"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Question {
  question: string
  options: string[]
  correctIndex: number
}

interface RoadmapQuizProps {
  nodeId: number
  slug: string
  title: string
  content: string
  userId: string | null
  isComplete: boolean
  onPass: () => void
}

const PASS_PERCENT = 80

export function RoadmapQuiz({ nodeId, slug, title, content, userId, isComplete, onPass }: RoadmapQuizProps) {
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState<{ score: number; passed: boolean } | null>(null)
  const [started, setStarted] = useState(false)

  // Try to load existing quiz from DB
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      const { data } = await supabase
        .from("roadmap_quizzes" as any)
        .select("questions")
        .eq("node_id", nodeId)
        .maybeSingle()
      if (cancelled) return
      if (data && (data as any).questions) {
        setQuestions((data as any).questions as Question[])
      } else {
        setQuestions(null)
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [nodeId])

  // Reset on nav
  useEffect(() => {
    setAnswers({})
    setSubmitted(null)
    setStarted(false)
  }, [slug])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: { nodeId, title, content },
      })
      if (error) throw error
      if (data?.error) throw new Error(data.error)
      setQuestions(data.questions as Question[])
      toast.success("Quiz ready!")
    } catch (err: any) {
      toast.error(err.message || "Failed to generate quiz")
    } finally {
      setGenerating(false)
    }
  }

  const handleSubmit = async () => {
    if (!questions) return
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer every question first")
      return
    }
    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++
    })
    const percent = Math.round((correct / questions.length) * 100)
    const passed = percent >= PASS_PERCENT
    setSubmitted({ score: correct, passed })

    if (userId) {
      await supabase.from("quiz_attempts" as any).insert({
        user_id: userId,
        node_id: nodeId,
        score: correct,
        total: questions.length,
        passed,
      } as any)
    }

    if (passed) {
      onPass()
      toast.success(`Passed! ${correct}/${questions.length} (${percent}%)`)
      // Check for badge eligibility
      if (userId) {
        const { data: progress } = await supabase
          .from("roadmap_progress")
          .select("node_id, completed")
          .eq("user_id", userId)
          .eq("completed", true)
        const completedIds = new Set<number>((progress || []).map((r: any) => r.node_id))
        // Include this node (just passed) since the parent will upsert async
        completedIds.add(nodeId)
        if (completedIds.size >= roadmapData.length) {
          const { error: badgeErr } = await supabase
            .from("user_badges" as any)
            .insert({
              user_id: userId,
              badge_slug: SENTINEL_BADGE.slug,
              badge_name: SENTINEL_BADGE.name,
              badge_description: SENTINEL_BADGE.description,
            } as any)
          if (!badgeErr) {
            toast.success(`🛡️ Badge unlocked: ${SENTINEL_BADGE.name}!`, { duration: 6000 })
          }
        }
      }
    } else {
      toast.error(`Need 80% to pass. You got ${percent}%`)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(null)
  }

  // Initial state — show CTA section
  if (loading) {
    return (
      <Card className="mt-12 p-6">
        <p className="text-sm text-muted-foreground">Loading knowledge check…</p>
      </Card>
    )
  }

  return (
    <Card className="mt-12 p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-full bg-primary/15">
          <ClipboardCheck className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-bold">Knowledge Check</h3>
            {isComplete && (
              <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Passed
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            10 questions · Score 80% or higher to mark this topic as complete.
          </p>
        </div>
      </div>

      {!questions && (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-4">
            No quiz exists yet. Generate it now to test what you learned.
          </p>
          <Button onClick={handleGenerate} disabled={generating} className="gap-2">
            <Sparkles className="w-4 h-4" />
            {generating ? "Generating quiz…" : "Generate Quiz"}
          </Button>
        </div>
      )}

      {questions && !started && !submitted && (
        <div className="text-center py-4">
          <Button onClick={() => setStarted(true)} size="lg" className="gap-2">
            Start Knowledge Check
          </Button>
        </div>
      )}

      {questions && (started || submitted) && (
        <div className="space-y-6 mt-4">
          {questions.map((q, qi) => {
            const userAns = answers[qi]
            const isCorrect = submitted && userAns === q.correctIndex
            return (
              <div key={qi} className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold text-muted-foreground mt-0.5">{qi + 1}.</span>
                  <p className="font-medium flex-1">{q.question}</p>
                </div>
                <div className="grid gap-2 pl-6">
                  {q.options.map((opt, oi) => {
                    const selected = userAns === oi
                    const showCorrect = submitted && oi === q.correctIndex
                    const showWrong = submitted && selected && oi !== q.correctIndex
                    return (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => !submitted && setAnswers((a) => ({ ...a, [qi]: oi }))}
                        disabled={!!submitted}
                        className={cn(
                          "text-left px-3 py-2 rounded-lg border text-sm transition-colors flex items-center gap-2",
                          selected && !submitted && "border-primary bg-primary/10",
                          !selected && !submitted && "border-border hover:bg-muted",
                          showCorrect && "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400",
                          showWrong && "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400",
                        )}
                      >
                        {showCorrect && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                        {showWrong && <XCircle className="w-4 h-4 shrink-0" />}
                        <span>{opt}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {!submitted ? (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                {Object.keys(answers).length}/{questions.length} answered
              </span>
              <Button onClick={handleSubmit} size="lg">
                Submit Answers
              </Button>
            </div>
          ) : (
            <div className="pt-4 border-t border-border space-y-3">
              <Progress value={(submitted.score / questions.length) * 100} className="h-2" />
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  {submitted.passed ? (
                    <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <span className="font-semibold">
                    {submitted.score}/{questions.length} —{" "}
                    {submitted.passed ? "Passed!" : "Need 80% to pass"}
                  </span>
                </div>
                {!submitted.passed && (
                  <Button onClick={handleRetry} variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" /> Try Again
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

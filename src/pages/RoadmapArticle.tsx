import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { getArticleBySlug, roadmapArticles, RoadmapArticle as RoadmapArticleType } from "@/content/roadmap-articles"
import { roadmapData } from "@/components/roadmap/roadmapData"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  ArrowRight,
  Clock, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  List,
  BookOpen,
  Pencil,
  Sparkles
} from "lucide-react"
import { MarkdownRenderer } from "@/components/roadmap/MarkdownRenderer"
import { MarkdownEditor } from "@/components/editor/MarkdownEditor"
import { PasswordGate } from "@/components/editor/PasswordGate"
import { AskSujal } from "@/components/roadmap/AskSujal"
import { RoadmapQuiz } from "@/components/roadmap/RoadmapQuiz"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export default function RoadmapArticle() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const localArticle = slug ? getArticleBySlug(slug) : undefined
  
  const [isComplete, setIsComplete] = useState(false)
  const [showMiniRoadmap, setShowMiniRoadmap] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showPasswordGate, setShowPasswordGate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dbContent, setDbContent] = useState<string | null>(null)
  const [showAskSujal, setShowAskSujal] = useState(false)
  const [sujalWidth, setSujalWidth] = useState(440)

  // Reset state and scroll to top when slug changes
  useEffect(() => {
    setDbContent(null)
    setIsComplete(false)
    setEditing(false)
    setShowPasswordGate(false)
    // Use setTimeout to ensure scroll happens after React re-render
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }), 0)
  }, [slug])

  // Fetch Supabase override content
  useEffect(() => {
    if (!slug) return
    const fetchDbContent = async () => {
      const { data } = await supabase
        .from('roadmap_articles')
        .select('content')
        .eq('slug', slug)
        .maybeSingle()
      if (data?.content) {
        setDbContent(data.content)
      }
    }
    fetchDbContent()
  }, [slug])

  // Merged article: DB content overrides local
  const article = useMemo(() => {
    if (!localArticle) return undefined
    if (dbContent) {
      return { ...localArticle, content: dbContent }
    }
    return localArticle
  }, [localArticle, dbContent])

  // Get current position and navigation
  const { currentIndex, prevArticle, nextArticle, currentNode } = useMemo(() => {
    const index = roadmapData.findIndex(n => n.slug === slug)
    return {
      currentIndex: index,
      currentNode: roadmapData[index],
      prevArticle: index > 0 ? roadmapData[index - 1] : null,
      nextArticle: index < roadmapData.length - 1 ? roadmapData[index + 1] : null,
    }
  }, [slug])

  // Fetch completion status
  useEffect(() => {
    const fetchStatus = async () => {
      if (!currentNode) return
      if (user) {
        const { data } = await supabase
          .from("roadmap_progress")
          .select("completed")
          .eq("user_id", user.id)
          .eq("node_id", currentNode.id)
          .single()
        setIsComplete(data?.completed || false)
      } else {
        const saved = localStorage.getItem("roadmap-progress")
        if (saved) {
          const completed = new Set(JSON.parse(saved))
          setIsComplete(completed.has(currentNode.id))
        }
      }
    }
    fetchStatus()
  }, [user, currentNode])

  const handleQuizPass = async () => {
    if (!currentNode) return
    setIsComplete(true)
    if (user) {
      await supabase
        .from("roadmap_progress")
        .upsert({
          user_id: user.id,
          node_id: currentNode.id,
          completed: true,
        }, { onConflict: "user_id,node_id" })
    } else {
      const saved = localStorage.getItem("roadmap-progress")
      const completed = saved ? new Set(JSON.parse(saved)) : new Set()
      completed.add(currentNode.id)
      localStorage.setItem("roadmap-progress", JSON.stringify([...completed]))
    }
  }

  const handleEditClick = () => {
    setShowPasswordGate(true)
  }

  const handlePasswordSuccess = () => {
    setShowPasswordGate(false)
    setEditing(true)
  }

  const handleSave = async (newContent: string) => {
    if (!slug || !localArticle) return
    setSaving(true)
    try {
      // Upsert into roadmap_articles
      const { error } = await supabase
        .from('roadmap_articles')
        .upsert({
          slug,
          title: localArticle.title,
          content: newContent,
          excerpt: localArticle.excerpt,
          difficulty: localArticle.difficulty,
          read_time: localArticle.readTime,
          category: localArticle.category,
          tags: localArticle.tags,
          source_url: localArticle.sourceUrl || null,
        }, { onConflict: 'slug' })

      if (error) throw error
      setDbContent(newContent)
      setEditing(false)
      toast.success("Article saved successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to save. Are you an admin?")
    } finally {
      setSaving(false)
    }
  }

  if (!article) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist yet.</p>
          <Button asChild><Link to="/roadmap">Back to Roadmap</Link></Button>
        </div>
      </AppLayout>
    )
  }

  const difficultyColors = {
    Beginner: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    Intermediate: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    Advanced: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  }

  const progressPercent = ((currentIndex + 1) / roadmapData.length) * 100

  return (
    <AppLayout>
      <div
        className="min-h-screen transition-[padding] duration-300"
        style={{ paddingRight: showAskSujal ? `min(100vw, ${sujalWidth}px)` : undefined }}
      >
        {/* Top Progress Bar */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              <Link 
                to="/roadmap" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Roadmap</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAskSujal(true)}
                  className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Ask SUJAL</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditClick}
                  className="gap-2 text-muted-foreground hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>

                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{currentIndex + 1} / {roadmapData.length}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMiniRoadmap(!showMiniRoadmap)}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Topics</span>
                </Button>
              </div>
            </div>
            
            <Progress value={progressPercent} className="h-1 -mb-px" />
          </div>
        </div>

        {/* Password Gate Dialog */}
        <PasswordGate 
          open={showPasswordGate} 
          onClose={() => setShowPasswordGate(false)} 
          onSuccess={handlePasswordSuccess} 
        />

        {/* Mini Roadmap Sidebar */}
        {showMiniRoadmap && (
          <div className="fixed right-0 top-[8.5rem] bottom-0 w-80 bg-card border-l border-border z-30 overflow-y-auto p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">All Topics</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowMiniRoadmap(false)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {roadmapData.map((node, idx) => (
                <Link
                  key={node.id}
                  to={`/roadmap/${node.slug}`}
                  onClick={() => setShowMiniRoadmap(false)}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg text-sm transition-colors",
                    node.slug === slug 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{node.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <article className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Header */}
          <header className="mb-10" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className="font-normal text-xs">
                Step {currentIndex + 1}
              </Badge>
              <Badge variant="outline" className={difficultyColors[article.difficulty]}>
                {article.difficulty}
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {article.readTime} min read
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
              {article.title}
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
          </header>

          {/* Editor or Content */}
          {editing ? (
            <MarkdownEditor
              initialContent={article.content}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
              saving={saving}
            />
          ) : (
            <div className="mt-2">
              <MarkdownRenderer content={article.content} />
            </div>
          )}

          {/* Source Citation */}
          {!editing && article.sourceUrl && (
            <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                📖 Original article:{" "}
                <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {article.sourceUrl}
                </a>
              </p>
            </div>
          )}

          {/* Knowledge Check Quiz */}
          {!editing && currentNode && (
            <RoadmapQuiz
              nodeId={currentNode.id}
              slug={slug!}
              title={article.title}
              content={article.content}
              userId={user?.id ?? null}
              isComplete={isComplete}
              onPass={handleQuizPass}
            />
          )}

          {/* Navigation */}
          {!editing && (
            <nav className="mt-8 grid grid-cols-2 gap-4">
              {prevArticle ? (
                <Link to={`/roadmap/${prevArticle.slug}`} className="group p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Previous
                  </div>
                  <div className="font-medium group-hover:text-primary transition-colors line-clamp-1">{prevArticle.title}</div>
                </Link>
              ) : <div />}
              {nextArticle ? (
                <Link to={`/roadmap/${nextArticle.slug}`} className="group p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all text-right">
                  <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                    Next
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="font-medium group-hover:text-primary transition-colors line-clamp-1">{nextArticle.title}</div>
                </Link>
              ) : (
                <Link to="/roadmap" className="group p-4 rounded-xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-all text-right">
                  <div className="flex items-center justify-end gap-2 text-sm text-green-600 dark:text-green-400 mb-2">
                    Finish
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="font-medium text-green-700 dark:text-green-300">Complete Roadmap!</div>
                </Link>
              )}
            </nav>
          )}
        </article>

        {/* Ask SUJAL AI Sidebar */}
        <AskSujal
          open={showAskSujal}
          onClose={() => setShowAskSujal(false)}
          articleTitle={article.title}
          articleExcerpt={article.excerpt}
          width={sujalWidth}
          onWidthChange={setSujalWidth}
        />
      </div>
    </AppLayout>
  )
}

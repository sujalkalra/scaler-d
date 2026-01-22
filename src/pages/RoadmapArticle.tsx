import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { getArticleBySlug, roadmapArticles } from "@/content/roadmap-articles"
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
  BookOpen
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export default function RoadmapArticle() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const article = slug ? getArticleBySlug(slug) : undefined
  
  const [isComplete, setIsComplete] = useState(false)
  const [showMiniRoadmap, setShowMiniRoadmap] = useState(false)

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

  const handleMarkComplete = async () => {
    if (!currentNode) return
    
    const newStatus = !isComplete
    setIsComplete(newStatus)
    
    if (user) {
      const { error } = await supabase
        .from("roadmap_progress")
        .upsert({
          user_id: user.id,
          node_id: currentNode.id,
          completed: newStatus
        }, { onConflict: "user_id,node_id" })
      
      if (error) {
        toast.error("Failed to save progress")
        setIsComplete(!newStatus)
        return
      }
    } else {
      const saved = localStorage.getItem("roadmap-progress")
      const completed = saved ? new Set(JSON.parse(saved)) : new Set()
      if (newStatus) {
        completed.add(currentNode.id)
      } else {
        completed.delete(currentNode.id)
      }
      localStorage.setItem("roadmap-progress", JSON.stringify([...completed]))
    }
    
    toast.success(newStatus ? "Marked as complete!" : "Marked as incomplete")
    
    // Auto-navigate to next if completing
    if (newStatus && nextArticle) {
      setTimeout(() => {
        navigate(`/roadmap/${nextArticle.slug}`)
      }, 1000)
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
      <div className="min-h-screen">
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
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className="font-normal">
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
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-relaxed prose-p:text-foreground/80
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl
            prose-table:border prose-table:rounded-lg prose-th:border prose-th:p-3 prose-th:bg-muted prose-td:border prose-td:p-3
            prose-img:rounded-xl prose-img:border prose-img:border-border
            prose-strong:text-foreground prose-strong:font-semibold
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
            prose-ul:my-4 prose-li:my-1
            prose-hr:border-border prose-hr:my-8
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
          </div>

          {/* Mark Complete CTA */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-full",
                  isComplete ? "bg-green-500/20" : "bg-primary/20"
                )}>
                  {isComplete ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {isComplete ? "Topic Completed!" : "Finished reading?"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isComplete 
                      ? "Great job! Move on to the next topic." 
                      : "Mark this topic as complete to track your progress."
                    }
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleMarkComplete}
                variant={isComplete ? "outline" : "default"}
                className="shrink-0 gap-2"
              >
                {isComplete ? (
                  <>Undo Complete</>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Complete
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 grid grid-cols-2 gap-4">
            {prevArticle ? (
              <Link 
                to={`/roadmap/${prevArticle.slug}`}
                className="group p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Previous
                </div>
                <div className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                  {prevArticle.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
            
            {nextArticle ? (
              <Link 
                to={`/roadmap/${nextArticle.slug}`}
                className="group p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all text-right"
              >
                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                  Next
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                  {nextArticle.title}
                </div>
              </Link>
            ) : (
              <Link 
                to="/roadmap"
                className="group p-4 rounded-xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-all text-right"
              >
                <div className="flex items-center justify-end gap-2 text-sm text-green-600 dark:text-green-400 mb-2">
                  Finish
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="font-medium text-green-700 dark:text-green-300">
                  Complete Roadmap!
                </div>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </AppLayout>
  )
}

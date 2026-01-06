import { useParams, Link } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { getArticleBySlug } from "@/content/roadmap-articles"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Calendar, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function RoadmapArticle() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticleBySlug(slug) : undefined

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
    Intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    Advanced: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  }

  return (
    <AppLayout>
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Link to="/roadmap" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Roadmap
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{article.category}</Badge>
            <Badge variant="outline" className={difficultyColors[article.difficulty]}>{article.difficulty}</Badge>
            {article.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{article.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-b py-4">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{article.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{article.readTime} min read</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:leading-relaxed prose-p:text-muted-foreground
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg
          prose-table:border prose-th:border prose-th:p-3 prose-th:bg-muted prose-td:border prose-td:p-3
          prose-img:rounded-lg prose-img:border
          prose-strong:text-foreground
          prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:rounded-r
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t">
          <Button asChild variant="outline" size="lg">
            <Link to="/roadmap" className="gap-2"><ArrowLeft className="w-4 h-4" />Back to Roadmap</Link>
          </Button>
        </footer>
      </article>
    </AppLayout>
  )
}

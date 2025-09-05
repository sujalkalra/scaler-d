import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Clock, Building2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AppLayout } from "@/components/layout/AppLayout"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"

interface Article {
  id: string
  title: string
  content: string
  excerpt: string | null
  company: string | null
  company_image: string | null
  read_time: number | null
  created_at: string
  upvotes: number | null
  views: number | null
  tags: string[] | null
  difficulty: string | null
  is_featured: boolean
}

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: {
    username: string | null
    full_name: string | null
  } | null
}

export default function ArticleDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [article, setArticle] = useState<Article | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    if (id) {
      fetchArticle()
      fetchComments()
      if (user) {
        checkUserVotes()
      }
    }
  }, [id, user])

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single()

      if (error) throw error
      setArticle(data)

      // Increment view count
      await supabase
        .from('articles')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load article.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles(username, full_name)
        `)
        .eq('article_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments((data || []) as any)
    } catch (error: any) {
      console.error('Error fetching comments:', error)
    }
  }

  const checkUserVotes = async () => {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('article_id', id)
        .eq('user_id', user?.id)

      if (error) throw error
      
      const votes = data || []
      setLiked(votes.some(v => v.vote_type === 'like'))
      setSaved(votes.some(v => v.vote_type === 'save'))
    } catch (error: any) {
      console.error('Error checking votes:', error)
    }
  }

  const handleVote = async (voteType: 'like' | 'save') => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to interact with articles.",
        variant: "destructive",
      })
      return
    }

    try {
      const isCurrentlyVoted = voteType === 'like' ? liked : saved
      
      if (isCurrentlyVoted) {
        // Remove vote
        await supabase
          .from('votes')
          .delete()
          .eq('article_id', id)
          .eq('user_id', user.id)
          .eq('vote_type', voteType)
      } else {
        // Add vote
        await supabase
          .from('votes')
          .insert({
            article_id: id,
            user_id: user.id,
            vote_type: voteType
          })
      }

      if (voteType === 'like') {
        setLiked(!isCurrentlyVoted)
        toast({
          title: isCurrentlyVoted ? "Unliked" : "Liked",
          description: `Article ${isCurrentlyVoted ? 'removed from' : 'added to'} your likes.`,
        })
      } else {
        setSaved(!isCurrentlyVoted)
        toast({
          title: isCurrentlyVoted ? "Unsaved" : "Saved",
          description: `Article ${isCurrentlyVoted ? 'removed from' : 'added to'} your saved articles.`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment.",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) return

    setSubmittingComment(true)
    try {
      await supabase
        .from('comments')
        .insert({
          article_id: id,
          user_id: user.id,
          content: newComment.trim()
        })

      setNewComment("")
      fetchComments()
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Share",
        description: "Share this article with others",
      })
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner": return "bg-success-light text-success"
      case "intermediate": return "bg-warning-light text-warning"
      case "advanced": return "bg-secondary-light text-secondary"
      case "expert": return "bg-destructive-light text-destructive"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!article) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-8 max-w-4xl text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link to="/articles">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Back Button */}
        <Link to="/articles" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {article.difficulty && (
              <Badge className={getDifficultyColor(article.difficulty)}>
                {article.difficulty}
              </Badge>
            )}
            {article.company && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">{article.company}</span>
              </div>
            )}
            {article.read_time && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-sm">{article.read_time} min read</span>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          {article.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Article Actions */}
          <div className="flex items-center justify-between border-y border-border py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`${liked ? 'text-destructive' : 'text-muted-foreground'} hover:text-foreground`}
                onClick={() => handleVote('like')}
              >
                <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                {article.upvotes || 0}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {comments.length}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`${saved ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`}
              onClick={() => handleVote('save')}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="whitespace-pre-wrap">{article.content}</div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

          {/* Add Comment */}
          {user ? (
            <Card className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts on this article..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleSubmitComment} 
                  disabled={!newComment.trim() || submittingComment}
                >
                  {submittingComment ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">Sign in to join the discussion</p>
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            </Card>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {comment.profiles?.full_name?.[0] || comment.profiles?.username?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">
                        {comment.profiles?.full_name || comment.profiles?.username || 'Anonymous'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {getTimeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              </Card>
            ))}
            
            {comments.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
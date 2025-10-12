import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Calendar, Edit3, Save, BookOpen, Palette, Heart } from "lucide-react"
import { AvatarUpload } from "@/components/profile/AvatarUpload"

interface Profile {
  id: string
  user_id: string
  username: string | null
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

function ProfileContent() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [savedArticles, setSavedArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchSavedArticles()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle()

      if (error) throw error
      
      if (data) {
        setProfile(data)
        setFormData({
          username: data.username || "",
          full_name: data.full_name || "",
          bio: data.bio || ""
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedArticles = async () => {
    try {
      console.log('Fetching saved articles for user:', user?.id)
      
      // Get all vote records for saved articles
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('article_id')
        .eq('user_id', user?.id)
        .eq('vote_type', 'save')

      console.log('Votes data:', votesData, 'Error:', votesError)

      if (votesError) throw votesError

      if (!votesData || votesData.length === 0) {
        console.log('No saved articles found')
        setSavedArticles([])
        return
      }

      // Get the actual articles
      const articleIds = votesData.map(v => v.article_id)
      console.log('Article IDs to fetch:', articleIds)
      
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('id, title, excerpt, company, read_time, tags, difficulty, created_at')
        .in('id', articleIds)
        .order('created_at', { ascending: false })

      console.log('Articles data:', articlesData, 'Error:', articlesError)

      if (articlesError) throw articlesError
      setSavedArticles(articlesData || [])
    } catch (error: any) {
      console.error('Error fetching saved articles:', error)
    }
  }

  const handleSave = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          full_name: formData.full_name,
          bio: formData.bio
        })
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      setEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleAvatarUpdate = (newUrl: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: newUrl || null } : null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="card-gradient">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {editing ? (
                  <AvatarUpload
                    currentAvatarUrl={profile?.avatar_url}
                    userId={user?.id || ""}
                    onAvatarUpdate={handleAvatarUpdate}
                    userInitials={profile?.full_name?.split(" ").map(n => n[0]).join("") || "U"}
                  />
                ) : (
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-lg">
                      {profile?.full_name?.split(" ").map(n => n[0]).join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h1 className="text-2xl font-bold">{profile?.full_name || "Unnamed User"}</h1>
                  <p className="text-muted-foreground">@{profile?.username || "no-username"}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(profile?.created_at || "").toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Button
                variant={editing ? "default" : "outline"}
                size="sm"
                onClick={() => editing ? handleSave() : setEditing(true)}
              >
                {editing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-foreground">
                  {profile?.bio || "No bio provided yet."}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Articles Written</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Palette className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Designs Created</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Heart className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Total Upvotes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Articles */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Saved Articles ({savedArticles.length})</CardTitle>
            <CardDescription>Articles you've bookmarked for later reading</CardDescription>
          </CardHeader>
          <CardContent>
            {savedArticles.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No saved articles yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Save articles to read them later!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedArticles.slice(0, 5).map((article: any) => (
                  <div key={article.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{article.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{article.company} • {article.read_time} min read</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {article.difficulty}
                    </Badge>
                  </div>
                ))}
                {savedArticles.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    And {savedArticles.length - 5} more...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ProfileContent />
      </AppLayout>
    </ProtectedRoute>
  )
}
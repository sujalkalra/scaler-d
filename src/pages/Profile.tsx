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
import { useToast } from "@/hooks/use-toast"
import { Mail, Calendar, Edit3, Save, Map, Trophy, Award, ShieldCheck } from "lucide-react"
import { AvatarUpload } from "@/components/profile/AvatarUpload"
import { roadmapData } from "@/components/roadmap/roadmapData"
import { SENTINEL_BADGE } from "@/lib/badges"
import { Progress } from "@/components/ui/progress"
import { z } from "zod"

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

interface UserBadge {
  id: string
  badge_slug: string
  badge_name: string
  badge_description: string | null
  earned_at: string
}

function ProfileContent() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ username: "", full_name: "", bio: "" })
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchProgress()
      fetchBadges()
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
          bio: data.bio || "",
        })
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async () => {
    const { data } = await supabase
      .from("roadmap_progress")
      .select("node_id")
      .eq("user_id", user?.id)
      .eq("completed", true)
    setCompletedCount(data?.length || 0)
  }

  const fetchBadges = async () => {
    const { data } = await supabase
      .from("user_badges" as any)
      .select("id, badge_slug, badge_name, badge_description, earned_at")
      .eq("user_id", user?.id)
      .order("earned_at", { ascending: false })
    setBadges((data as any) || [])
  }

  const handleSave = async () => {
    if (!user) return
    const profileSchema = z.object({
      username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be less than 30 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Letters, numbers, _ and - only"),
      full_name: z.string().trim().max(100),
      bio: z.string().trim().max(500),
    })
    try {
      const validated = profileSchema.parse(formData)
      const { data, error } = await supabase
        .from("profiles")
        .update({
          username: validated.username,
          full_name: validated.full_name,
          bio: validated.bio,
        })
        .eq("user_id", user.id)
        .select()
        .single()
      if (error) throw error
      setProfile(data)
      setEditing(false)
      toast({ title: "Profile updated" })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation Error", description: error.errors[0].message, variant: "destructive" })
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" })
      }
    }
  }

  const handleAvatarUpdate = (newUrl: string) => {
    setProfile((prev) => (prev ? { ...prev, avatar_url: newUrl || null } : null))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const totalNodes = roadmapData.length
  const progressPct = totalNodes ? Math.round((completedCount / totalNodes) * 100) : 0
  const isSentinel = badges.some((b) => b.badge_slug === SENTINEL_BADGE.slug)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className={isSentinel ? "card-gradient ring-2 ring-amber-400/40" : "card-gradient"}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {editing ? (
                  <AvatarUpload
                    currentAvatarUrl={profile?.avatar_url}
                    userId={user?.id || ""}
                    onAvatarUpdate={handleAvatarUpdate}
                    userInitials={profile?.full_name?.split(" ").map((n) => n[0]).join("") || "U"}
                  />
                ) : (
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-lg">
                      {profile?.full_name?.split(" ").map((n) => n[0]).join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold">{profile?.full_name || "Unnamed User"}</h1>
                    {isSentinel && (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        {SENTINEL_BADGE.name}
                      </Badge>
                    )}
                  </div>
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
                onClick={() => (editing ? handleSave() : setEditing(true))}
              >
                {editing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" /> Edit
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
                    <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" value={formData.username} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={3} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-foreground">{profile?.bio || "No bio provided yet."}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Roadmap progress */}
        <Card className="card-gradient">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Map className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Roadmap Progress</CardTitle>
                  <CardDescription>
                    {completedCount} of {totalNodes} topics completed
                  </CardDescription>
                </div>
              </div>
              <span className="text-2xl font-bold text-primary">{progressPct}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPct} className="h-2" />
            <p className="text-sm text-muted-foreground mt-3">
              Pass each topic's knowledge check (80%+) to advance. Complete all topics to earn the{" "}
              <span className="font-medium text-foreground">{SENTINEL_BADGE.name}</span> badge.
            </p>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Badges ({badges.length})
            </CardTitle>
            <CardDescription>Achievements earned on your journey</CardDescription>
          </CardHeader>
          <CardContent>
            {badges.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No badges yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete the full roadmap to unlock the {SENTINEL_BADGE.name}.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent"
                  >
                    <div className="text-3xl">{SENTINEL_BADGE.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{b.badge_name}</div>
                      <p className="text-xs text-muted-foreground mt-1">{b.badge_description}</p>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Earned {new Date(b.earned_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
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

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  userId: string
  onAvatarUpdate: (newUrl: string) => void
  userInitials: string
}

export function AvatarUpload({ currentAvatarUrl, userId, onAvatarUpdate, userInitials }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, or WebP image.",
        variant: "destructive",
      })
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadAvatar(file)
  }

  const uploadAvatar = async (file: File) => {
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/avatar.${fileExt}`

      // Delete existing avatar if any
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/').pop()
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${oldPath}`])
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', userId)

      if (updateError) throw updateError

      onAvatarUpdate(data.publicUrl)
      setPreview(null)
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeAvatar = async () => {
    if (!currentAvatarUrl) return

    setUploading(true)
    try {
      // Remove from storage
      const fileName = currentAvatarUrl.split('/').pop()
      if (fileName) {
        await supabase.storage
          .from('avatars')
          .remove([`${userId}/${fileName}`])
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', userId)

      if (error) throw error

      onAvatarUpdate('')
      toast({
        title: "Avatar removed",
        description: "Your profile picture has been removed.",
      })
    } catch (error: any) {
      toast({
        title: "Remove failed",
        description: error.message || "Failed to remove avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="w-20 h-20">
          <AvatarImage src={preview || currentAvatarUrl || ""} />
          <AvatarFallback className="text-lg">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        
        {(currentAvatarUrl || preview) && (
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            onClick={removeAvatar}
            disabled={uploading}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Change Avatar
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Max 2MB • JPEG, PNG, WebP
        </p>
      </div>
    </div>
  )
}
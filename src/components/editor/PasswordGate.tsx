import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface PasswordGateProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const EDIT_CODE = "sysdesign2024"

export function PasswordGate({ open, onClose, onSuccess }: PasswordGateProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === EDIT_CODE) {
      setError(false)
      setCode("")
      onSuccess()
    } else {
      setError(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Enter Edit Code
          </DialogTitle>
          <DialogDescription>
            Enter the developer access code to enable editing mode.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            type="password"
            placeholder="Access code..."
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false) }}
            autoFocus
          />
          {error && (
            <p className="text-sm text-destructive">Invalid code. Try again.</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Unlock</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

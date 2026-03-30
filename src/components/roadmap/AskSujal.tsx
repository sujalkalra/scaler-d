import { useState, useRef, useEffect } from "react"
import { X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AskSujalProps {
  open: boolean
  onClose: () => void
  articleTitle: string
  articleExcerpt: string
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-sujal`

export function AskSujal({ open, onClose, articleTitle, articleExcerpt }: AskSujalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  // Reset messages when article changes
  useEffect(() => {
    setMessages([])
    setInput("")
  }, [articleTitle])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMsg: Message = { role: "user", content: trimmed }
    const allMessages = [...messages, userMsg]
    setMessages(allMessages)
    setInput("")
    setIsLoading(true)

    let assistantSoFar = ""

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk
      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m))
        }
        return [...prev, { role: "assistant", content: assistantSoFar }]
      })
    }

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          articleTitle,
          articleExcerpt,
        }),
      })

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}))
        throw new Error(errData.error || "Failed to connect")
      }

      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let textBuffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        textBuffer += decoder.decode(value, { stream: true })

        let newlineIndex: number
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex)
          textBuffer = textBuffer.slice(newlineIndex + 1)

          if (line.endsWith("\r")) line = line.slice(0, -1)
          if (line.startsWith(":") || line.trim() === "") continue
          if (!line.startsWith("data: ")) continue

          const jsonStr = line.slice(6).trim()
          if (jsonStr === "[DONE]") break

          try {
            const parsed = JSON.parse(jsonStr)
            const content = parsed.choices?.[0]?.delta?.content as string | undefined
            if (content) upsertAssistant(content)
          } catch {
            textBuffer = line + "\n" + textBuffer
            break
          }
        }
      }
    } catch (e: any) {
      upsertAssistant(`⚠️ ${e.message || "Something went wrong. Please try again."}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 bg-card border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground" style={{ fontFamily: "'Roboto Mono', monospace" }}>Ask SUJAL</h3>
            <p className="text-xs text-muted-foreground truncate max-w-[240px]">{articleTitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Hi! I'm SUJAL 👋</h4>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                Ask me anything about <span className="text-primary font-medium">{articleTitle}</span>. I'll help you understand the concepts better.
              </p>
            </div>
            <div className="grid gap-2 w-full mt-2">
              {[
                `Explain ${articleTitle} in simple terms`,
                "What are the real-world use cases?",
                "What are the common mistakes?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 0) }}
                  className="text-left text-xs px-3 py-2 rounded-lg border border-border bg-muted/50 text-foreground/70 hover:border-primary/30 hover:text-foreground transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              )}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_code]:bg-background/30 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_strong]:text-primary [&_ul]:my-1 [&_li]:text-sm">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this topic..."
            rows={1}
            className="flex-1 resize-none bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 max-h-32"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 rounded-xl shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

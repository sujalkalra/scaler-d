import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import type { Components } from "react-markdown"

interface MarkdownRendererProps {
  content: string
}

const components: Components = {
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-12 mb-4 pb-3 border-b border-border flex items-center gap-3 tracking-tight" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <span className="w-1 h-7 rounded-full bg-primary inline-block shrink-0" />
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold mt-8 mb-3 text-foreground tracking-tight" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="leading-relaxed text-foreground/80 mb-4 text-[15px]" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-primary">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a 
      href={href} 
      className="text-primary hover:underline underline-offset-4 decoration-primary/40 transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-4 space-y-2 ml-1" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 space-y-2 ml-1 list-decimal list-inside" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-foreground/80 text-[15px] flex items-start gap-2">
      <span className="text-primary mt-2 shrink-0">•</span>
      <span>{children}</span>
    </li>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono border border-primary/20">
          {children}
        </code>
      )
    }
    const language = className?.replace("language-", "") || ""
    const codeString = String(children).replace(/\n$/, "")
    return (
      <div className="my-6 rounded-xl overflow-hidden border border-[hsl(210,5%,22%)] shadow-lg">
        {language && (
          <div className="flex items-center justify-between px-4 py-2 bg-[hsl(210,5%,15%)] border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-destructive/60" />
                <span className="w-3 h-3 rounded-full bg-warning/60" />
                <span className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2 uppercase tracking-wider">{language}</span>
            </div>
          </div>
        )}
        <SyntaxHighlighter
          language={language || "text"}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "hsl(210, 5%, 13%)",
            fontSize: "0.875rem",
            borderRadius: 0,
          }}
          className="code-scrollbar"
          showLineNumbers={codeString.split("\n").length > 3}
          lineNumberStyle={{ color: "hsl(210, 4%, 30%)", minWidth: "2.5em" }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    )
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => (
    <div className="my-6 rounded-xl overflow-hidden border border-border shadow-sm">
      <table className="w-full text-sm" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-primary/10 text-primary">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-semibold text-sm border-b border-border">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-foreground/80 border-b border-border/50 text-sm">
      {children}
    </td>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-muted/50 transition-colors">
      {children}
    </tr>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-primary bg-primary/5 rounded-r-xl py-3 px-5 text-foreground/80" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="my-10 border-none h-px bg-gradient-to-r from-transparent via-border to-transparent" />
  ),
  img: ({ src, alt }) => (
    <figure className="my-6">
      <img 
        src={src} 
        alt={alt || ""} 
        className="rounded-xl border border-border shadow-md w-full"
        loading="lazy"
      />
      {alt && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="roadmap-article-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

import { useState } from "react"
import { Zap, Sparkles, Download, Copy, RefreshCw, Wand2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AppLayout } from "@/components/layout/AppLayout"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

const popularPrompts = [
  "Design a scalable video streaming platform like Netflix",
  "Build a real-time chat application like WhatsApp", 
  "Create a ride-sharing system like Uber",
  "Design a social media feed like Instagram",
  "Build an e-commerce platform like Amazon",
  "Create a music streaming service like Spotify"
]

const exampleGeneration = {
  company: "Netflix",
  architecture: `# Netflix System Design

## Overview
Netflix serves 15+ billion hours of content monthly to 230+ million subscribers globally.

## Key Components

### 1. Content Delivery Network (CDN)
- **Open Connect**: Netflix's custom CDN with 15,000+ servers globally
- **Edge Locations**: Positioned close to ISPs for minimal latency
- **Content Caching**: Popular content cached at edge locations

### 2. Microservices Architecture
- **300+ microservices** handling different functionalities
- **API Gateway**: Routes requests to appropriate services
- **Service Discovery**: Eureka for service registration and discovery

### 3. Data Infrastructure
- **Cassandra**: Primary database for user data and metadata
- **MySQL**: For billing and subscription data
- **ElasticSearch**: For search and discovery features

### 4. Recommendation Engine
- **Machine Learning**: Collaborative filtering and content-based filtering
- **Real-time Processing**: Apache Kafka for event streaming
- **A/B Testing**: Continuous experimentation platform`,
  
  logo: null, // Logo image URL
  diagram: null // HLD diagram URL
}

export default function AIGenerator() {
  const [prompt, setPrompt] = useState("")
  const [company, setCompany] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [generated, setGenerated] = useState<typeof exampleGeneration | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-system-design', {
        body: { 
          title: prompt,
          company: company.trim() || undefined
        }
      })

      if (error) throw error

      if (data) {
        setGenerated(data)
        toast({
          title: "Success",
          description: "System design generated successfully!",
        })
      }
    } catch (error: any) {
      console.error('Generation error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate system design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePostArticle = async () => {
    if (!generated) return

    setIsPosting(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to post articles.",
          variant: "destructive",
        })
        return
      }

      // Embed the diagram image in the markdown content
      let contentWithImage = generated.architecture
      if (generated.diagram) {
        // Add the HLD diagram at the beginning after any initial heading
        const lines = generated.architecture.split('\n')
        const firstHeadingIndex = lines.findIndex(line => line.startsWith('#'))
        
        if (firstHeadingIndex !== -1) {
          // Insert diagram after the first heading
          lines.splice(
            firstHeadingIndex + 1, 
            0, 
            '',
            '## High-Level Design Architecture',
            '',
            `![${generated.company} High-Level System Architecture](${generated.diagram})`,
            ''
          )
          contentWithImage = lines.join('\n')
        } else {
          // No heading found, add at the beginning
          contentWithImage = `## High-Level Design Architecture\n\n![${generated.company} System Architecture](${generated.diagram})\n\n${generated.architecture}`
        }
      }

      const { data: article, error } = await supabase
        .from('articles')
        .insert({
          title: `${generated.company} System Design`,
          content: contentWithImage,
          excerpt: `Learn how ${generated.company} scales to millions of users with this comprehensive system design breakdown.`,
          company: generated.company,
          company_image: generated.logo, // Use logo for the card image only
          difficulty: 'intermediate',
          tags: ['system design', 'architecture', generated.company.toLowerCase()],
          author_id: user.id,
          published: true,
          read_time: Math.ceil(generated.architecture.split(' ').length / 200)
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Article posted!",
        description: "Your system design article has been published successfully.",
      })

      navigate(`/articles/${article.id}`)
    } catch (error: any) {
      console.error('Post error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to post article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient">AI System Design Generator</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Generate comprehensive system designs and architecture explanations for any company or use case using advanced AI.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Describe the system you want to design
                </label>
                <Textarea
                  placeholder="e.g., Design a scalable video streaming platform like Netflix that can handle millions of concurrent users..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 focus-ring"
                />
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Company name (optional)"
                  className="focus-ring"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="px-8"
                  variant="hero"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Popular Prompts */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-primary" />
              Popular Prompts
            </h3>
            <div className="space-y-2">
              {popularPrompts.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 whitespace-normal"
                  onClick={() => setPrompt(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {generated ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Generated System Design</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { if (generated) { navigator.clipboard.writeText(generated.architecture); } }}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { if (generated) { const blob = new Blob([generated.architecture], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${generated.company}-design.txt`; a.click(); URL.revokeObjectURL(url); } }}>
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Architecture Explanation */}
                <div>
                  <h4 className="font-medium mb-2">Architecture Explanation</h4>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg overflow-x-auto">
                      {generated.architecture}
                    </pre>
                  </div>
                </div>

                {/* System Diagram */}
                {generated.diagram && (
                  <div>
                    <h4 className="font-medium mb-2">High-Level Design Diagram</h4>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <img 
                        src={generated.diagram} 
                        alt="System Architecture Diagram" 
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Logo */}
                {generated.logo && (
                  <div>
                    <h4 className="font-medium mb-2">Company Logo</h4>
                    <div className="bg-muted/50 rounded-lg p-4 flex justify-center">
                      <img 
                        src={generated.logo} 
                        alt="Company Logo" 
                        className="w-32 h-32 rounded-lg object-contain"
                      />
                    </div>
                  </div>
                )}

                {!generated.diagram && !generated.logo && (
                  <div className="w-full h-64 bg-gradient-card rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    <div className="text-center">
                      <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Images generation in progress...</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="hero" 
                    className="flex-1" 
                    onClick={handlePostArticle}
                    disabled={isPosting}
                  >
                    {isPosting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Post as Article
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setGenerated(null)}>
                    Generate Another
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                  <p className="text-muted-foreground">
                    Enter a description of the system you want to design and let AI create a comprehensive architecture explanation and diagram.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold mb-2">Instant Generation</h4>
          <p className="text-sm text-muted-foreground">
            Get comprehensive system designs in seconds, not hours
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-secondary-light rounded-lg flex items-center justify-center mx-auto mb-4">
            <Wand2 className="w-6 h-6 text-secondary" />
          </div>
          <h4 className="font-semibold mb-2">Smart Diagrams</h4>
          <p className="text-sm text-muted-foreground">
            AI-generated architecture diagrams with proper component relationships
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-success-light rounded-lg flex items-center justify-center mx-auto mb-4">
            <Download className="w-6 h-6 text-success" />
          </div>
          <h4 className="font-semibold mb-2">Export & Share</h4>
          <p className="text-sm text-muted-foreground">
            Download designs as images or share with your team instantly
          </p>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
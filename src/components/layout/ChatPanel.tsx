import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/useAuth"
import { supabase, type Message as DBMessage } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { 
  Paperclip, 
  Send, 
  Zap,
  ChevronDown,
  User,
  Loader2,
  Image,
  FileText,
  X
} from "lucide-react"

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
  attachments?: Attachment[]
}

interface Attachment {
  id: string
  name: string
  type: 'image' | 'file'
  url: string
  size: number
}

export function ChatPanel() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadMessages = useCallback(async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      const formattedMessages: Message[] = data.map((msg: DBMessage) => ({
        id: msg.id,
        type: msg.type as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at),
        attachments: msg.attachments as Attachment[] || [],
        isStreaming: msg.is_streaming || false
      }))

      setMessages(formattedMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
      toast({
        title: 'Error',
        description: 'Failed to load chat history',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [user, toast])

  // Load messages from Supabase
  useEffect(() => {
    if (user) {
      loadMessages()
    }
  }, [user, loadMessages])

  // Add welcome message for new users
  useEffect(() => {
    if (user && messages.length === 0 && !loading) {
      const welcomeMessage = async () => {
        const welcomeData = {
          type: 'assistant' as const,
          content: "👋 Welcome to your Blink Clone project! I'm here to help you build amazing apps.\n\nI can help you:\n• Create beautiful UI components\n• Set up database structures\n• Add authentication features\n• Make your app responsive\n• Deploy to production\n\nWhat would you like to build today?",
          isStreaming: false
        }
        
        const savedWelcome = await saveMessage(welcomeData)
        if (savedWelcome) {
          const newMessage: Message = {
            id: savedWelcome.id,
            type: 'assistant',
            content: welcomeData.content,
            timestamp: new Date(savedWelcome.created_at),
            isStreaming: false
          }
          setMessages([newMessage])
        }
      }
      
      setTimeout(welcomeMessage, 500)
    }
  }, [user, messages.length, loading, saveMessage])

  const saveMessage = useCallback(async (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          content: messageData.content,
          type: messageData.type,
          attachments: messageData.attachments || [],
          is_streaming: messageData.isStreaming || false
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving message:', error)
      toast({
        title: 'Error',
        description: 'Failed to save message',
        variant: 'destructive'
      })
      return null
    }
  }, [user, toast])

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return
    if (!user) return
    
    const userMessageData = {
      type: 'user' as const,
      content: message,
      attachments: attachments.length > 0 ? [...attachments] : undefined
    }
    
    // Save user message to database
    const savedUserMessage = await saveMessage(userMessageData)
    if (savedUserMessage) {
      const newMessage: Message = {
        id: savedUserMessage.id,
        type: 'user',
        content: message,
        timestamp: new Date(savedUserMessage.created_at),
        attachments: attachments.length > 0 ? [...attachments] : undefined
      }
      setMessages(prev => [...prev, newMessage])
    }
    
    const currentMessage = message
    setMessage("")
    setAttachments([])
    
    // Generate more contextual AI responses
    setIsTyping(true)
    setTimeout(async () => {
      let aiResponseContent = 'I understand your request. Let me work on that for you...'
      
      // Generate contextual responses based on user input
      if (currentMessage.toLowerCase().includes('color') || currentMessage.toLowerCase().includes('theme')) {
        aiResponseContent = "I'll help you update the color scheme! Let me modify the theme colors to make it more visually appealing."
      } else if (currentMessage.toLowerCase().includes('component') || currentMessage.toLowerCase().includes('ui')) {
        aiResponseContent = "Great! I'll create that UI component for you. Let me build it with modern design patterns and smooth animations."
      } else if (currentMessage.toLowerCase().includes('database') || currentMessage.toLowerCase().includes('data')) {
        aiResponseContent = "I'll set up the database structure for you. Creating the necessary tables and relationships..."
      } else if (currentMessage.toLowerCase().includes('auth') || currentMessage.toLowerCase().includes('login')) {
        aiResponseContent = "I'll enhance the authentication system with better user experience and security features."
      } else if (currentMessage.toLowerCase().includes('responsive') || currentMessage.toLowerCase().includes('mobile')) {
        aiResponseContent = "I'll make sure the design is fully responsive and works beautifully on all devices!"
      } else if (currentMessage.toLowerCase().includes('deploy') || currentMessage.toLowerCase().includes('publish')) {
        aiResponseContent = "I'll prepare your app for deployment with optimized builds and proper configuration."
      } else if (currentMessage.toLowerCase().includes('animation') || currentMessage.toLowerCase().includes('transition')) {
        aiResponseContent = "I'll add smooth animations and transitions to make the user experience more delightful!"
      } else if (currentMessage.toLowerCase().includes('help') || currentMessage.toLowerCase().includes('how')) {
        aiResponseContent = "I'm here to help! I can build components, modify designs, set up databases, add features, and deploy your app. What would you like to create?"
      }
      
      const aiResponseData = {
        type: 'assistant' as const,
        content: aiResponseContent,
        isStreaming: true
      }
      
      // Save AI response to database
      const savedAIMessage = await saveMessage(aiResponseData)
      if (savedAIMessage) {
        const aiResponse: Message = {
          id: savedAIMessage.id,
          type: 'assistant',
          content: aiResponseContent,
          timestamp: new Date(savedAIMessage.created_at),
          isStreaming: true
        }
        setMessages(prev => [...prev, aiResponse])
      }
      setIsTyping(false)
      
      // Simulate streaming completion
      setTimeout(async () => {
        if (savedAIMessage) {
          // Update message in database to mark as not streaming
          await supabase
            .from('messages')
            .update({ is_streaming: false })
            .eq('id', savedAIMessage.id)
          
          setMessages(prev => prev.map(msg => 
            msg.id === savedAIMessage.id ? { ...msg, isStreaming: false } : msg
          ))
        }
      }, 2000)
    }, 1000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const attachment: Attachment = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        size: file.size
      }
      setAttachments(prev => [...prev, attachment])
    })
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-96 blink-panel border-r flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-medium">Blink AI</h2>
            <p className="text-xs text-muted-foreground">Building your app...</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Loading chat history...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-medium mb-1">Welcome to Blink Clone</h3>
                <p className="text-xs text-muted-foreground">Start a conversation with your AI assistant</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="text-xs bg-muted">
                      {msg.type === 'user' ? <User className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {msg.type === 'user' ? 'You' : 'Blink'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                      {msg.isStreaming && (
                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                      )}
                    </div>
                    
                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mb-2 space-y-1">
                        {msg.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center gap-2 p-2 bg-muted rounded-md text-xs">
                            {attachment.type === 'image' ? (
                              <Image className="w-4 h-4 text-blue-500" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="flex-1 truncate">{attachment.name}</span>
                            <span className="text-muted-foreground">
                              {(attachment.size / 1024).toFixed(1)}KB
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-sm text-foreground whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-muted">
                    <Zap className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Blink</span>
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Thinking...
                  </div>
                </div>
              </div>
            )}
          
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t border-border">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="mb-3 space-y-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center gap-2 p-2 bg-muted rounded-md text-xs">
                {attachment.type === 'image' ? (
                  <Image className="w-4 h-4 text-blue-500" />
                ) : (
                  <FileText className="w-4 h-4 text-gray-500" />
                )}
                <span className="flex-1 truncate">{attachment.name}</span>
                <span className="text-muted-foreground">
                  {(attachment.size / 1024).toFixed(1)}KB
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeAttachment(attachment.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message Blink..."
            className="min-h-[80px] pr-20 resize-none bg-background border-border"
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx,.txt,.json,.js,.ts,.tsx,.jsx,.css,.html"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button 
              onClick={handleSend}
              size="sm" 
              className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
              disabled={!message.trim() && attachments.length === 0}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Bottom controls */}
        <div className="flex items-center justify-between mt-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground h-7"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-3 h-3 mr-1" />
            Attach
          </Button>
          
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
            Auto
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
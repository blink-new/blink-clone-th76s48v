import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Share, 
  Globe,
  ChevronDown,
  Zap,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react"

export function TopNavigation() {
  const [projectStatus, setProjectStatus] = useState<'ready' | 'building' | 'error' | 'deploying'>('ready')
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = () => {
    setIsPublishing(true)
    setProjectStatus('deploying')
    
    // Simulate publishing process
    setTimeout(() => {
      setIsPublishing(false)
      setProjectStatus('ready')
    }, 3000)
  }

  const getStatusIcon = () => {
    switch (projectStatus) {
      case 'building':
        return <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
      case 'deploying':
        return <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />
      case 'ready':
      default:
        return <CheckCircle className="w-3 h-3 text-green-500" />
    }
  }

  const getStatusText = () => {
    switch (projectStatus) {
      case 'building':
        return 'Building'
      case 'deploying':
        return 'Deploying'
      case 'error':
        return 'Error'
      case 'ready':
      default:
        return 'Ready'
    }
  }

  return (
    <div className="h-14 blink-panel border-b flex items-center justify-between px-4">
      {/* Left side - Project info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-medium text-foreground">Blink Clone</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {getStatusIcon()}
                <span className="ml-1">{getStatusText()}</span>
              </Badge>
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                <Clock className="w-3 h-3 mr-1" />
                v1.2.3
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground blink-hover"
          disabled={projectStatus === 'building' || projectStatus === 'deploying'}
        >
          <Settings className="w-4 h-4 mr-2" />
          Supabase
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground blink-hover"
          disabled={projectStatus === 'building' || projectStatus === 'deploying'}
        >
          <Share className="w-4 h-4 mr-2" />
          Stripe
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handlePublish}
          disabled={isPublishing || projectStatus === 'building' || projectStatus === 'error'}
        >
          {isPublishing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Globe className="w-4 h-4 mr-2" />
          )}
          {isPublishing ? 'Publishing...' : 'Publish'}
        </Button>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <Button variant="ghost" size="sm" className="p-1">
          <Avatar className="w-7 h-7">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback className="text-xs bg-muted">U</AvatarFallback>
          </Avatar>
          <ChevronDown className="w-3 h-3 ml-1 text-muted-foreground" />
        </Button>
      </div>
    </div>
  )
}
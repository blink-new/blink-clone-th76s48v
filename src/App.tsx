import AuthProvider from "./contexts/AuthProvider"
import { useAuth } from "./hooks/useAuth"
import { TopNavigation } from "./components/layout/TopNavigation"
import { ChatPanel } from "./components/layout/ChatPanel"
import { RightPanel } from "./components/layout/RightPanel"
import { LoginForm } from "./components/LoginForm"
import { Toaster } from "./components/ui/toaster"

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[hsl(var(--blink-bg))]">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="h-screen flex flex-col bg-[hsl(var(--blink-bg))]">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Chat Panel */}
        <ChatPanel />
        
        {/* Right Panel (Preview/Code/Database/Workspace) */}
        <RightPanel />
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  )
}

export default App
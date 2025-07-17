import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { 
  Eye, 
  Code, 
  Database, 
  Settings,
  Smartphone,
  Monitor,
  ExternalLink,
  Play,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Trash2,
  Copy,
  Download,
  RefreshCw
} from "lucide-react"

export function RightPanel() {
  const [activeTab, setActiveTab] = useState("preview")
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")

  return (
    <div className="flex-1 blink-panel flex flex-col">
      {/* Tab navigation */}
      <div className="border-b border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between px-4 py-2">
            <TabsList className="bg-background border border-border">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Code
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Database
              </TabsTrigger>
              <TabsTrigger value="workspace" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Workspace
              </TabsTrigger>
            </TabsList>

            {activeTab === "preview" && (
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant={viewMode === "desktop" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setViewMode("desktop")}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "mobile" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setViewMode("mobile")}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-3"
                  onClick={() => window.open("https://3000-iwz6614tls286fnafxqzs-5042addd.preview-blink.com", "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="preview" className="m-0 flex-1">
            <PreviewContent viewMode={viewMode} />
          </TabsContent>
          
          <TabsContent value="code" className="m-0 flex-1">
            <CodeContent />
          </TabsContent>
          
          <TabsContent value="database" className="m-0 flex-1">
            <DatabaseContent />
          </TabsContent>
          
          <TabsContent value="workspace" className="m-0 flex-1">
            <WorkspaceContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function PreviewContent({ viewMode }: { viewMode: "desktop" | "mobile" }) {
  const [previewUrl, setPreviewUrl] = useState("https://3000-iwz6614tls286fnafxqzs-5042addd.preview-blink.com")
  const [isLoading, setIsLoading] = useState(true)
  
  const handleIframeLoad = () => {
    setIsLoading(false)
  }
  
  return (
    <div className="flex-1 bg-background p-4">
      <div className="h-full flex items-center justify-center">
        <div 
          className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden ${
            viewMode === "mobile" ? "w-80 h-[600px]" : "w-full h-full max-w-4xl"
          }`}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10 rounded-lg">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-gray-700">Loading Preview</h3>
                <p className="text-sm text-gray-500">Your app is loading...</p>
              </div>
            </div>
          )}
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="App Preview"
            onLoad={handleIframeLoad}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
          />
        </div>
      </div>
    </div>
  )
}

function CodeContent() {
  const [selectedFile, setSelectedFile] = useState("src/App.tsx")
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["src", "src/components"])
  
  const fileTree = [
    { name: "src", type: "folder", children: [
      { name: "App.tsx", type: "file", language: "typescript" },
      { name: "main.tsx", type: "file", language: "typescript" },
      { name: "index.css", type: "file", language: "css" },
      { name: "components", type: "folder", children: [
        { name: "layout", type: "folder", children: [
          { name: "ChatPanel.tsx", type: "file", language: "typescript" },
          { name: "RightPanel.tsx", type: "file", language: "typescript" },
          { name: "TopNavigation.tsx", type: "file", language: "typescript" }
        ]},
        { name: "ui", type: "folder", children: [
          { name: "button.tsx", type: "file", language: "typescript" },
          { name: "input.tsx", type: "file", language: "typescript" },
          { name: "tabs.tsx", type: "file", language: "typescript" }
        ]}
      ]}
    ]},
    { name: "package.json", type: "file", language: "json" },
    { name: "tailwind.config.cjs", type: "file", language: "javascript" },
    { name: "vite.config.ts", type: "file", language: "typescript" }
  ]

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    )
  }

  const renderFileTree = (items: any[], path = "") => {
    return items.map((item) => {
      const fullPath = path ? `${path}/${item.name}` : item.name
      const isExpanded = expandedFolders.includes(fullPath)
      
      if (item.type === "folder") {
        return (
          <div key={fullPath}>
            <div 
              className="flex items-center gap-1 py-1 px-2 hover:bg-muted cursor-pointer text-sm"
              onClick={() => toggleFolder(fullPath)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <Folder className="w-4 h-4 text-blue-500" />
              <span>{item.name}</span>
            </div>
            {isExpanded && item.children && (
              <div className="ml-4">
                {renderFileTree(item.children, fullPath)}
              </div>
            )}
          </div>
        )
      } else {
        return (
          <div 
            key={fullPath}
            className={`flex items-center gap-1 py-1 px-2 hover:bg-muted cursor-pointer text-sm ml-4 ${
              selectedFile === fullPath ? 'bg-primary/20 text-primary' : ''
            }`}
            onClick={() => setSelectedFile(fullPath)}
          >
            <File className="w-4 h-4 text-gray-500" />
            <span>{item.name}</span>
          </div>
        )
      }
    })
  }

  return (
    <div className="flex-1 flex">
      {/* File Explorer */}
      <div className="w-64 border-r border-border bg-background">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Files</h3>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input 
              placeholder="Search files..." 
              className="pl-7 h-7 text-xs"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {renderFileTree(fileTree)}
          </div>
        </ScrollArea>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">{selectedFile}</span>
              <Badge variant="secondary" className="text-xs">TypeScript</Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Copy className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 font-mono text-sm bg-background">
            <div className="space-y-1">
              <div className="flex">
                <span className="w-8 text-muted-foreground text-right mr-4">1</span>
                <span className="text-muted-foreground">
                  <span className="text-blue-400">import</span> {`{ TopNavigation }`} <span className="text-blue-400">from</span> <span className="text-green-400">"./components/layout/TopNavigation"</span>
                </span>
              </div>
              <div className="flex">
                <span className="w-8 text-muted-foreground text-right mr-4">2</span>
                <span className="text-muted-foreground">
                  <span className="text-blue-400">import</span> {`{ ChatPanel }`} <span className="text-blue-400">from</span> <span className="text-green-400">"./components/layout/ChatPanel"</span>
                </span>
              </div>
              <div className="flex">
                <span className="w-8 text-muted-foreground text-right mr-4">3</span>
                <span className="text-muted-foreground">
                  <span className="text-blue-400">import</span> {`{ RightPanel }`} <span className="text-blue-400">from</span> <span className="text-green-400">"./components/layout/RightPanel"</span>
                </span>
              </div>
              <div className="flex">
                <span className="w-8 text-muted-foreground text-right mr-4">4</span>
                <span></span>
              </div>
              <div className="flex">
                <span className="w-8 text-muted-foreground text-right mr-4">5</span>
                <span className="text-muted-foreground">
                  <span className="text-blue-400">function</span> <span className="text-yellow-400">App</span>() {`{`}
                </span>
              </div>
              <div className="flex">
                <span className="w-8 text-muted-foreground text-right mr-4">6</span>
                <span className="text-muted-foreground ml-4">
                  <span className="text-blue-400">return</span> (
                </span>
              </div>
              <div className="flex">
                <span className="w-8 text-muted-foreground text-right mr-4">7</span>
                <span className="text-muted-foreground ml-8">
                  &lt;<span className="text-red-400">div</span> <span className="text-green-400">className</span>=<span className="text-green-400">"h-screen flex flex-col bg-[hsl(var(--blink-bg))]"</span>&gt;
                </span>
              </div>
              <div className="flex">
                <span className="w-8 text-muted-foreground text-right mr-4">8</span>
                <span className="text-muted-foreground ml-12">
                  {`{/* Top Navigation */}`}
                </span>
              </div>
              <div className="flex">
                <span className="w-8 text-muted-foreground text-right mr-4">9</span>
                <span className="text-muted-foreground ml-12">
                  &lt;<span className="text-red-400">TopNavigation</span> /&gt;
                </span>
              </div>
              <div className="flex">
                <span className="w-8 text-muted-foreground text-right mr-4">10</span>
                <span className="text-muted-foreground ml-8">
                  &lt;/<span className="text-red-400">div</span>&gt;
                </span>
              </div>
              <div className="flex">
                <span className="w-8 text-muted-foreground text-right mr-4">11</span>
                <span className="text-muted-foreground ml-4">)</span>
              </div>
              <div className="flex">
                <span className="w-8 text-muted-foreground text-right mr-4">12</span>
                <span className="text-muted-foreground">{`}`}</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

function DatabaseContent() {
  const [selectedTable, setSelectedTable] = useState("users")
  
  const tables = [
    { name: "users", rows: 1247, columns: 6 },
    { name: "projects", rows: 89, columns: 8 },
    { name: "messages", rows: 5632, columns: 5 },
    { name: "files", rows: 234, columns: 7 }
  ]
  
  const sampleData = [
    { id: "1", email: "user@example.com", name: "John Doe", created_at: "2024-01-15", status: "active" },
    { id: "2", email: "jane@example.com", name: "Jane Smith", created_at: "2024-01-16", status: "active" },
    { id: "3", email: "bob@example.com", name: "Bob Johnson", created_at: "2024-01-17", status: "inactive" }
  ]

  return (
    <div className="flex-1 flex">
      {/* Tables sidebar */}
      <div className="w-64 border-r border-border bg-background">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Tables</h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input 
              placeholder="Search tables..." 
              className="pl-7 h-7 text-xs"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {tables.map((table) => (
              <div
                key={table.name}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm hover:bg-muted ${
                  selectedTable === table.name ? 'bg-primary/20 text-primary' : ''
                }`}
                onClick={() => setSelectedTable(table.name)}
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>{table.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {table.rows}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Table content */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedTable}</span>
              <Badge variant="secondary" className="text-xs">
                {tables.find(t => t.name === selectedTable)?.rows} rows
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <RefreshCw className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">ID</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">EMAIL</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">NAME</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">CREATED_AT</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">STATUS</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.map((row, index) => (
                    <tr key={row.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                      <td className="p-3 text-sm font-mono">{row.id}</td>
                      <td className="p-3 text-sm">{row.email}</td>
                      <td className="p-3 text-sm">{row.name}</td>
                      <td className="p-3 text-sm font-mono">{row.created_at}</td>
                      <td className="p-3 text-sm">
                        <Badge variant={row.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {row.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

function WorkspaceContent() {
  return (
    <div className="flex-1 p-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Project Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <h4 className="text-sm font-medium">Project Name</h4>
                <p className="text-xs text-muted-foreground">Blink Clone</p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <h4 className="text-sm font-medium">Tech Stack</h4>
                <p className="text-xs text-muted-foreground">Vite + React + TypeScript</p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <h4 className="text-sm font-medium">Deployment</h4>
                <p className="text-xs text-muted-foreground">blink-clone-th76s48v.live.blink.new</p>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
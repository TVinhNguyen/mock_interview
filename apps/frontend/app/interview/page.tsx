import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AIVisualizer } from "@/components/ai-visualizer"
import { CodeEditor } from "@/components/code-editor"
import { ChatLog } from "@/components/chat-log"
import { Sparkles, Mic, Video, Settings, X, Clock } from "lucide-react"
import Link from "next/link"

export default function InterviewPage() {
  return (
    <div className="flex h-screen flex-col bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent/15 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="glass px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                <X className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Python Backend Engineer</h1>
                <p className="text-xs text-muted-foreground">Question 3 of 8</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-sm font-mono text-foreground">45:23</span>
            </div>

            <Badge className="gap-2 bg-success/20 text-success border-0 rounded-full px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Recording
            </Badge>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent border-border hover:bg-secondary"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent border-border hover:bg-secondary"
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent border-border hover:bg-secondary"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <Link href="/scorecard">
              <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full">
                End Interview
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Split Screen Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side - AI Communication Area */}
        <div className="flex w-1/2 flex-col border-r border-border">
          {/* AI Visualizer */}
          <div className="flex-1 p-6">
            <Card className="h-full glass border-0 flex flex-col overflow-hidden">
              <div className="flex-1 flex items-center justify-center bg-background/30 rounded-t-xl">
                <AIVisualizer isActive={true} />
              </div>
              <div className="p-6 glass-strong rounded-b-xl">
                <div className="mb-3 flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary border-0 text-xs">Current Question</Badge>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  Can you implement a function that finds the longest palindromic substring? Please explain your
                  approach first, then write the code.
                </p>
              </div>
            </Card>
          </div>

          {/* Chat Log */}
          <div className="h-1/3 border-t border-border">
            <ChatLog />
          </div>
        </div>

        {/* Right Side - Code Editor Area */}
        <div className="flex w-1/2 flex-col bg-[#0d1117]">
          <CodeEditor />
        </div>
      </div>
    </div>
  )
}

"use client"

import { MessageSquare } from "lucide-react"

export function ChatLog() {
  const messages = [
    {
      id: 1,
      sender: "AI",
      content: "Hello! Let's start with a warm-up question. Can you explain what a palindrome is?",
      time: "10:00",
    },
    {
      id: 2,
      sender: "You",
      content: 'A palindrome is a string that reads the same forwards and backwards, like "racecar" or "level".',
      time: "10:01",
    },
    {
      id: 3,
      sender: "AI",
      content: "Excellent! Now, can you implement a function that finds the longest palindromic substring?",
      time: "10:02",
    },
    {
      id: 4,
      sender: "You",
      content: "I'll use the expand-around-center approach. Let me code it now...",
      time: "10:03",
    },
  ]

  return (
    <div className="flex h-full flex-col glass">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">Conversation</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === "You" ? "flex-row-reverse" : ""} animate-fade-up`}
          >
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                message.sender === "AI" ? "bg-gradient-to-br from-primary to-accent" : "glass-strong"
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  message.sender === "AI" ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {message.sender === "AI" ? "AI" : "YO"}
              </span>
            </div>
            <div className={`flex-1 max-w-[80%] ${message.sender === "You" ? "text-right" : ""}`}>
              <div
                className={`inline-block rounded-2xl px-4 py-2.5 ${
                  message.sender === "AI"
                    ? "glass-strong text-foreground"
                    : "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground px-1">{message.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-4 glass-strong">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          AI is listening...
        </div>
      </div>
    </div>
  )
}

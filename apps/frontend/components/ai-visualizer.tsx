"use client"

import { useState, useEffect } from "react"

export function AIVisualizer({ isActive }: { isActive: boolean }) {
  const [mounted, setMounted] = useState(false)
  const [heights, setHeights] = useState<number[]>([])

  useEffect(() => {
    setMounted(true)
    // Generate random heights only on client side
    setHeights(Array.from({ length: 16 }, () => Math.random() * 30 + 10))
  }, [])

  return (
    <div className="relative flex h-full w-full items-center justify-center p-12">
      {/* Outer glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-80 w-80 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl animate-glow-pulse" />
      </div>

      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-52 w-52 rounded-full border border-accent/20 animate-[spin_15s_linear_infinite_reverse]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-40 w-40 rounded-full border border-primary/30 animate-[spin_10s_linear_infinite]" />
      </div>

      {/* Orbiting particles */}
      {isActive && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-orbit" style={{ animationDuration: "8s" }}>
              <div className="h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-orbit" style={{ animationDuration: "12s", animationDelay: "2s" }}>
              <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-orbit" style={{ animationDuration: "6s", animationDelay: "4s" }}>
              <div className="h-2.5 w-2.5 rounded-full bg-success shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
            </div>
          </div>
        </>
      )}

      {/* Central orb */}
      <div className="relative">
        {/* Main sphere */}
        <div
          className={`h-32 w-32 rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent shadow-2xl ${isActive ? "animate-pulse" : ""}`}
        >
          {/* Inner highlight */}
          <div className="absolute top-3 left-5 h-8 w-8 rounded-full bg-white/30 blur-sm" />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 h-32 w-32 rounded-full bg-gradient-to-br from-primary to-accent opacity-50 blur-2xl" />
      </div>

      {/* Audio wave visualizer */}
      {isActive && mounted && (
        <div className="absolute bottom-16 flex items-end gap-1">
          {heights.map((height, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-primary to-accent animate-wave"
              style={{
                height: `${height}px`,
                animationDelay: `${i * 0.05}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

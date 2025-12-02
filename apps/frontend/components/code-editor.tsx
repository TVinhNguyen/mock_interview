"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw } from "lucide-react"

export function CodeEditor() {
  const sampleCode = `def longest_palindrome(s: str) -> str:
    """
    Find the longest palindromic substring
    Time Complexity: O(n^2)
    Space Complexity: O(1)
    """
    if not s:
        return ""
    
    def expand_around_center(left: int, right: int) -> str:
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]
    
    longest = ""
    for i in range(len(s)):
        # Check for odd-length palindromes
        odd_palindrome = expand_around_center(i, i)
        if len(odd_palindrome) > len(longest):
            longest = odd_palindrome
        
        # Check for even-length palindromes
        even_palindrome = expand_around_center(i, i + 1)
        if len(even_palindrome) > len(longest):
            longest = even_palindrome
    
    return longest


# Test cases
print(longest_palindrome("babad"))  # Output: "bab" or "aba"
print(longest_palindrome("cbbd"))   # Output: "bb"`

  return (
    <div className="flex h-full flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#0d1117] px-4 py-3">
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/20 text-primary border-0 backdrop-blur-sm">Python 3.11</Badge>
          <span className="text-sm text-gray-400">solution.py</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-success to-accent text-white hover:opacity-90 rounded-lg">
            <Play className="h-4 w-4 mr-2" />
            Run Code
          </Button>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto bg-[#0d1117] p-6 font-mono text-sm">
        <pre className="text-gray-300">
          <code>
            {sampleCode.split("\n").map((line, i) => (
              <div key={i} className="flex hover:bg-white/5 transition-colors">
                <span className="mr-6 w-8 text-right text-gray-600 select-none">{i + 1}</span>
                <span className="flex-1">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Output Console */}
      <div className="border-t border-white/5 bg-[#161b22] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Output</span>
          <Badge className="bg-success/20 text-success text-xs border-0 backdrop-blur-sm">Tests Passed: 2/2</Badge>
        </div>
        <div className="rounded-xl bg-[#0d1117] p-4 font-mono text-sm border border-white/5">
          <div className="flex items-center gap-2 text-success">
            <span className="text-lg">✓</span>
            <span>Test case 1: "babad" → "bab"</span>
          </div>
          <div className="flex items-center gap-2 text-success mt-1">
            <span className="text-lg">✓</span>
            <span>Test case 2: "cbbd" → "bb"</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 text-gray-400 text-xs">Execution time: 0.003s</div>
        </div>
      </div>
    </div>
  )
}

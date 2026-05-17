"use client"

import { useEffect, useState } from "react"

interface STCLoadingProps {
  message?: string
  progress?: number
}

export default function STCLoading({ message = "جاري المعالجة...", progress = 0 }: STCLoadingProps) {
  const [currentProgress, setCurrentProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProgress((prev) => {
        if (prev >= progress) return progress
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [progress])

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border max-w-sm w-full mx-4">
        {/* STC Card Design */}
        <div className="relative bg-gradient-to-r from-[#8736c4] to-pink-800 rounded-xl p-6 mb-6 overflow-hidden">
          <div className="flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold tracking-wide">
            <img src="/next.svg" width={50}/>
              
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-pink-100 to-red-100 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${currentProgress}%` }}
            />
            <div
              className="absolute top-0 w-3 h-2 bg-white rounded-sm transition-all duration-300 ease-out"
              style={{ left: `calc(${currentProgress}% - 6px)` }}
            />
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center">
          <p className="text-foreground font-semibold text-lg mb-2">{message}</p>
          <p className="text-muted-foreground text-sm">يرجى الانتظار...</p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mt-4">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

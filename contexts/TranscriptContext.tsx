"use client"

import type React from "react"

import { createContext, useContext } from "react"

interface TranscriptContextType {
  videoId: string | null
  transcript: string
  isPending: boolean
  error: any
}

const TranscriptContext = createContext<TranscriptContextType | undefined>(undefined)

export function TranscriptProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: TranscriptContextType
}) {
  return <TranscriptContext.Provider value={value}>{children}</TranscriptContext.Provider>
}

export function useTranscript() {
  const context = useContext(TranscriptContext)
  if (context === undefined) {
    throw new Error("useTranscript must be used within a TranscriptProvider")
  }
  return context
}

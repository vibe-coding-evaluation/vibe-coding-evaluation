"use client"

import type React from "react"

import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface VintageInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  monospace?: boolean
}

export const VintageInput = forwardRef<HTMLInputElement, VintageInputProps>(
  ({ className, monospace, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          "bg-white border-gray-400 border-2 shadow-sm rounded-none",
          "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          "text-sm px-2 py-1",
          monospace && "font-mono",
          className,
        )}
        {...props}
      />
    )
  },
)
VintageInput.displayName = "VintageInput"

interface VintageTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  monospace?: boolean
}

export const VintageTextarea = forwardRef<HTMLTextAreaElement, VintageTextareaProps>(
  ({ className, monospace, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        className={cn(
          "bg-white border-gray-400 border-2 shadow-sm rounded-none",
          "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          "text-sm px-2 py-1 resize-vertical",
          monospace && "font-mono",
          className,
        )}
        {...props}
      />
    )
  },
)
VintageTextarea.displayName = "VintageTextarea"

interface VintageSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  className?: string
}

export function VintageSelect({ value, onValueChange, placeholder, children, className }: VintageSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "bg-white border-gray-400 border-2 shadow-sm rounded-none",
          "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          "text-sm px-2 py-1 h-auto min-h-[32px]",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="border-gray-400 border-2 rounded-none shadow-lg">{children}</SelectContent>
    </Select>
  )
}

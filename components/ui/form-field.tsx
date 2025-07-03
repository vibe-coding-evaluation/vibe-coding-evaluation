import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
  className?: string
  labelClassName?: string
}

export function FormField({ label, required, error, children, className, labelClassName }: FormFieldProps) {
  return (
    <div className={cn("flex items-start gap-3 mb-3", className)}>
      <Label
        className={cn(
          "w-32 text-blue-600 font-normal text-right mt-2 shrink-0 text-sm",
          "hover:underline cursor-pointer leading-tight",
          labelClassName,
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}:
      </Label>
      <div className="flex-1 min-w-0">
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  )
}

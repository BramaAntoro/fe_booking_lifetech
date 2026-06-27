import * as React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

function FieldGroup({ className, ...props }) {
  return (
    <div
      data-slot="field-group"
      className={cn("grid gap-4", className)}
      {...props}
    />
  )
}

function Field({ className, ...props }) {
  return (
    <div
      data-slot="field"
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }) {
  return (
    <Label
      data-slot="field-label"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({ className, ...props }) {
  return (
    <p
      data-slot="field-error"
      className={cn("text-sm text-destructive", className)}
      {...props}
    />
  )
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel }

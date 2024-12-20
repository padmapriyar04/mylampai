"use client"

import * as React from "react"
import { X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

interface TagInputProps {
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export function TagInput({ value = [], onChange, placeholder = "Add item..." }: TagInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState("")
  const [open, setOpen] = React.useState(false)

  const handleUnselect = React.useCallback((skill: string) => {
    onChange(value.filter((s) => s !== skill))
  }, [value, onChange])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && value.length > 0) {
          handleUnselect(value[value.length - 1])
        }
      }
      if (e.key === "Enter" && input.value !== "") {
        e.preventDefault()
        if (!value.includes(input.value)) {
          onChange([...value, input.value])
          setInputValue("")
        }
      }
    }
  }, [value, onChange, handleUnselect])

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {value.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
              <button
                type="button"
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(skill)
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleUnselect(skill)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && inputValue.length > 0 && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              <CommandItem
                onSelect={() => {
                  onChange([...value, inputValue])
                  setInputValue("")
                }}
              >
                Add "{inputValue}"
              </CommandItem>
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
}


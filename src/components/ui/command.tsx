"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CommandContextValue {
  query: string
  setQuery: (query: string) => void
  registerItem: (id: string, visible: boolean) => void
  unregisterItem: (id: string) => void
  visibleItemCount: number
  registeredItemCount: number
}

const CommandContext = React.createContext<CommandContextValue | null>(null)

function useCommandContext(componentName: string) {
  const context = React.useContext(CommandContext)

  if (!context) {
    throw new Error(`${componentName} must be used within Command`)
  }

  return context
}

function Command({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const [query, setQuery] = React.useState("")
  const [itemVisibility, setItemVisibility] = React.useState<Record<string, boolean>>({})

  const registerItem = (id: string, visible: boolean) => {
    setItemVisibility((current) => {
      if (current[id] === visible) {
        return current
      }

      return {
        ...current,
        [id]: visible,
      }
    })
  }

  const unregisterItem = (id: string) => {
    setItemVisibility((current) => {
      if (!(id in current)) {
        return current
      }

      const next = { ...current }
      delete next[id]
      return next
    })
  }

  const visibleItemCount = Object.values(itemVisibility).filter(Boolean).length
  const registeredItemCount = Object.keys(itemVisibility).length

  return (
    <CommandContext.Provider
      value={{
        query,
        setQuery,
        registerItem,
        unregisterItem,
        visibleItemCount,
        registeredItemCount,
      }}
    >
      <div
        data-slot="command"
        className={cn(
          "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden p-0", className)}
        showCloseButton={showCloseButton}
      >
        <Command className="[&_[data-slot=command-group-heading]]:text-muted-foreground [&_[data-slot=command-group-heading]]:px-2 [&_[data-slot=command-group-heading]]:font-medium [&_[data-slot=command-group]]:px-2 [&_[data-slot=command-group]+[data-slot=command-group]]:pt-0 [&_[data-slot=command-input-wrapper]_svg]:h-5 [&_[data-slot=command-input-wrapper]_svg]:w-5 [&_[data-slot=command-input]]:h-12 [&_[data-slot=command-item]]:px-2 [&_[data-slot=command-item]]:py-3 [&_[data-slot=command-item]_svg]:h-5 [&_[data-slot=command-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  onChange,
  wrapperClassName: _wrapperClassName,
  ...props
}: React.ComponentProps<"input"> & {
  wrapperClassName?: string
}) {
  const { query, setQuery } = useCommandContext("CommandInput")

  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          onChange?.(event)
        }}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { query, registeredItemCount, visibleItemCount } = useCommandContext("CommandEmpty")

  if (visibleItemCount > 0) {
    return null
  }

  if (registeredItemCount === 0 && query.trim() === "") {
    return null
  }

  return (
    <div
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  heading,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  heading?: React.ReactNode
}) {
  return (
    <div
      data-slot="command-group"
      className={cn("overflow-hidden p-1", className)}
      {...props}
    >
      {heading ? (
        <div
          data-slot="command-group-heading"
          className="text-muted-foreground px-2 py-1.5 text-xs font-medium"
        >
          {heading}
        </div>
      ) : null}
      <div className="text-foreground">{children}</div>
    </div>
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  value = "",
  onClick,
  onKeyDown,
  onSelect,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  value?: string
  onSelect?: (value: string) => void
}) {
  const itemId = React.useId()
  const { query, registerItem, unregisterItem } = useCommandContext("CommandItem")
  const isVisible =
    query.trim() === "" || value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())

  React.useEffect(() => {
    registerItem(itemId, isVisible)
    return () => unregisterItem(itemId)
  }, [isVisible, itemId, registerItem, unregisterItem])

  if (!isVisible) {
    return null
  }

  return (
    <div
      data-slot="command-item"
      role="option"
      tabIndex={0}
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        onSelect?.(value)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (event.defaultPrevented) {
          return
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect?.(value)
        }
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}

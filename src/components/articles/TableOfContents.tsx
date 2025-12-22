"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: Heading[],
  otpTitle: string
}

export function TableOfContents({ headings, otpTitle }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
            }
          })
        },
        { rootMargin: "-20% 0px -35% 0px" },
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  return (
      <nav className="space-y-1">
        <p className="text-sm font-semibold text-foreground mb-4">{otpTitle}</p>
        <ul className="space-y-2.5 text-sm border-l-2 border-border pl-4">
          {headings.map((heading) => (
              <li key={heading.id} className={cn("transition-colors", heading.level === 3 && "ml-3")}>
                <a
                    href={`#${heading.id}`}
                    className={cn(
                        "block text-muted-foreground hover:text-foreground transition-colors leading-snug",
                        activeId === heading.id && "text-primary font-medium",
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(heading.id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }}
                >
                  {heading.text}
                </a>
              </li>
          ))}
        </ul>
      </nav>
  )
}

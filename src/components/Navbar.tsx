"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import {
  X,
  Newspaper,
  SparklesIcon, Sun01Icon, CodeFolderIcon, Moon02Icon, Menu01Icon
} from "@hugeicons/core-free-icons"

import { League_Spartan } from "next/font/google"

import { cn } from "@/lib/utils"
import {Button, buttonVariants} from "@/components/ui/button"
import {useTranslation} from "react-i18next";
import {cookieName, navLanguages} from "@/i18n/settings";
import {
  DropdownMenu, DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {HugeiconsIcon} from "@hugeicons/react";
import {Languages} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
      <svg
          role="img"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={className}
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
  )
}

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["600"],
})

function useTheme() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const stored = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const dark = stored ? stored === "dark" : prefersDark
    setIsDark(dark)
    document.documentElement.classList.toggle("dark", dark)
  }, [])

  const toggle = React.useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("dark", next)
      localStorage.setItem("theme", next ? "dark" : "light")
      return next
    })
  }, [])

  return { isDark, toggle }
}

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const { t, i18n } = useTranslation("common");
  const { isDark, toggle } = useTheme()

  const navItems = [
    {
      title: t("navbar.items.articles"),
      href: `/articles`,
      icon: <HugeiconsIcon icon={Newspaper} className={"size-5"} />
    },
    {
      title: t("navbar.items.projects"),
      href: "/projects",
      icon: <HugeiconsIcon icon={CodeFolderIcon} className={"size-5"} />
    },
    {
      title: t("navbar.items.about"),
      href: "/about",
      icon: <HugeiconsIcon icon={SparklesIcon} className={"size-5"} />
    },
  ];

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  const handleLanguageChange = (langCode: string) => i18n.changeLanguage(langCode, () => {
    document.cookie = `${cookieName}=${langCode}; path=/`;
  })

  return (
      <>
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-x-0 top-3 z-50 px-4 sm:top-4 sm:px-6"
        >
          <nav
              className={cn(
                  "mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 rounded-3xl border border-border px-3 pl-5 transition-all duration-300",
                  scrolled
                      ? "bg-background/70 shadow-lg shadow-black/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
                      : "bg-background/80 backdrop-blur-md",
              )}
          >
            <Link href="/" className="flex items-center transition-transform hover:scale-[1.03]">
            <span
                className={cn(
                    "text-2xl leading-none text-foreground",
                    leagueSpartan.className,
                )}
            >
              mamii<span className="text-primary">.</span>
            </span>
            </Link>

            <ul className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                    <li key={item.href} className="relative">
                      <Link
                          href={item.href}
                          className={cn(
                              "relative flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
                              isActive
                                  ? "text-foreground"
                                  : "text-muted-foreground hover:text-foreground",
                          )}
                      >
                        {isActive && (
                            <motion.span
                                layoutId="nav-pill"
                                className="absolute inset-0 rounded-full bg-muted"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{item.title}</span>
                      </Link>
                    </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-1">
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                      size="icon-sm"
                      variant="ghost"
                      className="rounded-full"
                      aria-label="Toggle language"
                  >
                    <Languages className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{t("navbar.changeLang")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {navLanguages.map((lang) => {
                      return (<DropdownMenuCheckboxItem
                          key={lang.code}
                          checked={i18n.language === lang.code}
                          onCheckedChange={() => handleLanguageChange(lang.code)}
                      >
                        {lang.flagSvg}
                        {lang.name}
                      </DropdownMenuCheckboxItem>)
                    })}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                  size="icon-sm"
                  variant="ghost"
                  className="rounded-full"
                  aria-label="Toggle theme"
                  onClick={toggle}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                      key={isDark ? "moon" : "sun"}
                      initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="flex"
                  >
                    {isDark ? <HugeiconsIcon icon={Moon02Icon} className={"size-4"} /> : <HugeiconsIcon icon={Sun01Icon} className={"size-4"} />}
                  </motion.span>
                </AnimatePresence>
              </Button>

              <a
                  href="https://github.com/mamiiblt"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={cn(
                      buttonVariants({ size: "icon-sm", variant: "ghost" }),
                      "hidden rounded-full md:inline-flex",
                  )}
              >
                <GithubIcon className="size-4" />
              </a>

              <Button
                  size="icon-sm"
                  variant="ghost"
                  className="rounded-full md:hidden"
                  aria-label="Toggle menu"
                  aria-expanded={open}
                  onClick={() => setOpen((o) => !o)}
              >
                {open ? <HugeiconsIcon icon={X} className={"size-5"} /> : <HugeiconsIcon icon={Menu01Icon} className={"size-5"} />}
              </Button>
            </div>
          </nav>
        </motion.header>

        <div aria-hidden="true" className="h-[4.25rem] sm:h-[4.5rem]" />

        <AnimatePresence>
          {(open || dropdownOpen) && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm"
                  onClick={() => {
                    setOpen(false)
                    setDropdownOpen(false)
                  }}
                  aria-hidden="true"
              />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
              <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="fixed inset-x-4 top-20 z-50 rounded-3xl border border-border bg-background/95 p-3 shadow-xl shadow-black/10 backdrop-blur-xl md:hidden"
              >
                <nav className="flex flex-col gap-1">
                  {navItems.map((item, index) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                          <Link
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
                                  isActive
                                      ? "bg-muted text-foreground"
                                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                              )}
                          >
                        <span
                            className={cn(
                                "flex size-9 items-center justify-center rounded-full transition-colors",
                                isActive ? "bg-primary text-primary-foreground" : "bg-muted",
                            )}
                        >
                          {item.icon}
                        </span>
                            {item.title}
                          </Link>
                        </motion.div>
                    )
                  })}
                </nav>
              </motion.div>
          )}
        </AnimatePresence>
      </>
  )
}

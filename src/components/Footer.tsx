"use client";

import React, {ReactNode, Suspense} from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import { FooterLoading } from "./loading";

import {
  CopyrightFreeIcons,
  GithubIcon,
  Mail02Icon,
  TelegramIcon, UserArrowLeftRightIcon,
} from "@hugeicons/core-free-icons";

function SocialButton({ href, label, children }: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
      <motion.a
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex size-8 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground backdrop-blur-md transition-colors hover:bg-muted hover:text-foreground"
      >
        {children}
      </motion.a>
  );
}
export default function Footer() {

  const { t } = useTranslation("common");

  return (
      <Suspense fallback={null}>
        <footer className="px-4 pb-6 sm:px-4">
          <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-border bg-card/60 shadow-lg shadow-black/5 backdrop-blur-xl supports-[backdrop-filter]:bg-card/40"
          >
            <div className="px-6 py-5 sm:px-8">
              <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
                <div className="flex justify-center items-center gap-1 text-muted-foreground">
                  <HugeiconsIcon icon={CopyrightFreeIcons} size={15} />
                  <p className="text-sm text-muted-foreground">
                    {t("footer.copyright")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <SocialButton href="/about" label="About Developer">
                    <HugeiconsIcon icon={UserArrowLeftRightIcon} className="size-4" />
                  </SocialButton>
                  <SocialButton href="https://github.com/mamiiblt" label="GitHub">
                    <HugeiconsIcon icon={GithubIcon} className="size-4" />
                  </SocialButton>
                  <SocialButton href="https://t.me/mamiiblt" label="Telegram">
                    <HugeiconsIcon icon={TelegramIcon} className="size-4" />
                  </SocialButton>
                  <SocialButton href="mailto:mamii@mamii.dev" label="Mail">
                    <HugeiconsIcon icon={Mail02Icon} className="size-4" />
                  </SocialButton>
                </div>
              </div>
            </div>
          </motion.div>
        </footer>
      </Suspense>
  );
}
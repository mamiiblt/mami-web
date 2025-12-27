"use client"

import React, {useState} from "react"
import {LinkIcon, ThumbsUp} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";

export interface ShareButtonProps {
    className?: string;
}

export function ShareButton({ className }: ShareButtonProps) {
    const { t } = useTranslation("articles")
    const [textState, setTextState] = useState<boolean>(true)
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)

            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error(t("share.error"))
        }
    }

    return (
        <Button
            onClick={copyToClipboard}
            size="lg"
            variant={copied ? "default" : "outline"}
            className={className}
        >
            <LinkIcon className="h-5 w-5 transition-all" />
            <span className="font-semibold">
                {copied ? t("share.state2") : t("share.state1")}
            </span>
        </Button>
    )
}

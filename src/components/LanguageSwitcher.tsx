/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

"use client";

import {Globe} from "lucide-react";
import {Button} from "./ui/button";
import Link from "next/link";

export default function LanguageSwitcher() {
    return (
        <Link href="/switch_lang">
            <Button
                variant={"ghost"}
                size="icon"
                className="relative"
            >
                <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " />
            </Button>
        </Link>
    );
}
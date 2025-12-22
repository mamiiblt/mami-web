import React from "react";
import { Metadata } from "next";
import { defaultMetadata } from "@/config/metadata";

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-primary-foreground dark:bg-primary-background">
      {children}
    </div>
  );
}

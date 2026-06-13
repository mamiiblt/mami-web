/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

import { Metadata } from "next";
import { defaultMetadata } from "@/config/metadata";
import {ReactNode} from "react";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `MAdmin Dashboard`,
  description: "Admin Dashboard",
};

export default function AdminLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-primary-foreground dark:bg-primary-background">
      {children}
    </div>
  );
}

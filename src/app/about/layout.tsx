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
  title: `About`,
  description: "You can learn more about me here.",
};

export default function AboutLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <div className="bg-background">
        {children}
      </div>
    </div>
  );
}

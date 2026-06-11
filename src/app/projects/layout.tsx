import { Metadata } from "next";
import { defaultMetadata } from "@/config/metadata";
import {ReactNode} from "react";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `Projects`,
  description: "You can learn more about my projects here.",
};

export default function ProjectsLayout({
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

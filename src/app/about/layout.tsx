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

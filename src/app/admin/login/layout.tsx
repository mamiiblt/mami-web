import { Metadata } from "next";
import { defaultMetadata } from "@/config/metadata";
import {ReactNode} from "react";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `Login | MAdmin`,
  description: "Login into MAdmin Dashboard",
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

import {Metadata} from "next";
import {defaultMetadata} from "@/config/metadata";
import {ReactNode} from "react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: `Switch Language`,
    description: "Switch language of website",
};

export default function AboutLayout({
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
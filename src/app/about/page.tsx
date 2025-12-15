"use client";

import { useState, useEffect, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CodeIcon,
  DatabaseIcon,
  StarIcon,
  FireIcon,
  UserGroupIcon,
  CodeFolderIcon, GithubIcon, TelegramIcon, Linkedin02Icon, SpotifyIcon, NewTwitterIcon, InstagramIcon, Coffee01Icon,
  DartIcon,
} from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";
import {
  AboutCard_AboutMe, AboutCard_Contact,
  AboutCard_ContGraph,
  AboutCard_Skills,
  AboutCard_Statistics
} from "@/components/about/ContentCards";
import {containerVariants} from "@/components/about/MotionSpecs";
import {ProfileCard} from "@/components/about/ProfileCard";
import {DiJava} from "react-icons/di";
import {
  AmazonwebservicesOriginalWordmark,
  AndroidOriginal,
  AndroidstudioOriginal, ArchlinuxOriginal, AzureOriginal, BootstrapOriginal, DartOriginal,
  DockerOriginal, ElectronOriginal, EslintOriginal, ExpressOriginal, FedoraPlain, FirebaseOriginal,
  FlutterOriginal, GitpodOriginal, GooglecloudOriginal, IntellijOriginal,
  JavaOriginal, JetpackcomposeOriginal,
  KotlinOriginal, MongodbOriginal, NextjsOriginal, NodejsOriginal, NuxtjsOriginal, PostgresqlOriginal, PostmanOriginal,
  ReactnativeOriginal,
  ReactOriginal, SupabaseOriginal, VercelLine, VercelOriginal, VisualstudioOriginal, VscodeOriginal,
  VuejsOriginal, WebstormOriginal
} from "devicons-react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const {t} = useTranslation("about");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // @ts-ignore
  return (
      <Suspense>
        <motion.div
            className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
          <motion.div
              className="container mx-auto flex max-w-4xl flex-col items-center px-4 pt-16 pb-4 text-center"
              variants={containerVariants}
          >
            <ProfileCard t={t} socialLinks={[
              {
                icon: <HugeiconsIcon icon={GithubIcon} className="h-4 w-4" />,
                url: "https://github.com/mamiiblt",
              },
              {
                icon: <HugeiconsIcon icon={TelegramIcon} className="h-4 w-4" />,
                url: "https://t.me/mamiiblt",
              },
              {
                icon: <HugeiconsIcon icon={Linkedin02Icon} className="h-4 w-4" />,
                url: "https://www.linkedin.com/in/muhammed-ali-bulut-1a7b00364",
              },
              {
                icon: <HugeiconsIcon icon={InstagramIcon} className="h-4 w-4" />,
                url: "https://instagram.com/mamiiblt",
              },
              {
                icon: <HugeiconsIcon icon={SpotifyIcon} className="h-4 w-4" />,
                url: "https://open.spotify.com/user/qpg4rzp2n15covoviu0tkyj69?si=AkiQulRPRdO6ENBCAT7SHw",
              },
              {
                icon: <HugeiconsIcon icon={NewTwitterIcon} className="h-4 w-4" />,
                url: "https://x.com/mamiiblt",
              },
              {
                icon: <HugeiconsIcon icon={Coffee01Icon} className="h-4 w-4" />,
                url: "https://buymeacoffee.com/mamiiblt",
              },
            ]} />

            <AboutCard_AboutMe t={t} classNameVal="mb-4 w-full max-w-2xl"/>
            <AboutCard_Statistics t={t} classNameVal="mb-4 w-full max-w-2xl" stats={[
              {
                label: t("stats.stars"),
                value: "700+",
                icon: <HugeiconsIcon icon={StarIcon} className="h-4 w-4"/>,
              },
              {
                label: t("stats.cont"),
                value: "4.1k",
                icon: <HugeiconsIcon icon={FireIcon} className="h-4 w-4"/>,
              },
              {
                label: t("stats.repo"),
                value: "12+",
                icon: <HugeiconsIcon icon={CodeFolderIcon} className="h-4 w-4"/>,
              },
              {
                label: t("stats.com"),
                value: t("stats.act", {count: 2}),
                icon: <HugeiconsIcon icon={UserGroupIcon} className="h-4 w-4"/>,
              },
            ]}/>
            <AboutCard_Skills t={t} classNameVal="mb-4 w-full max-w-2xl" skills={[
                // Software Languages & Frameworks
              { name: "Java", icon: JavaOriginal },
              { name: "Kotlin", icon: KotlinOriginal },
              { name: "Android", icon: AndroidOriginal },
              { name: "React", icon: ReactOriginal },
              { name: "Dart", icon: DartOriginal },
              { name: "Flutter", icon: FlutterOriginal },
              { name: "Compose", icon: JetpackcomposeOriginal },
              { name: "IntelliJ", icon: IntellijOriginal },
              { name: "Webstorm", icon: WebstormOriginal },
              { name: "VS Studio", icon: VisualstudioOriginal },
              { name: "VS Code", icon: VscodeOriginal },
              { name: "Gitpod", icon: GitpodOriginal },
              // JS furyası
              { name: "Node.js", icon: NodejsOriginal },
              { name: "Vue.js", icon: VuejsOriginal },
              { name: "Nuxt.js", icon: NuxtjsOriginal },
              { name: "Electron.js", icon: ElectronOriginal },
                // Database / Hostimh
              { name: "Supabase", icon: SupabaseOriginal },
              { name: "Firebase", icon: FirebaseOriginal },
              { name: "Postgres", icon: PostgresqlOriginal },
              { name: "MongoDB", icon: MongodbOriginal },
              { name: "AWS", icon: AmazonwebservicesOriginalWordmark },
              { name: "GCloud", icon: GooglecloudOriginal },
              { name: "Azure", icon: AzureOriginal },
                // Diğer ürünler / yan araçlar
              { name: "Arch Linux", icon: ArchlinuxOriginal },
              { name: "Bootstrap", icon: BootstrapOriginal },
              { name: "Docker", icon: DockerOriginal },
              { name: "ESLint", icon: EslintOriginal },
              { name: "Postman", icon: PostmanOriginal },
            ]}/>
            <AboutCard_ContGraph t={t} classNameVal="mb-4 w-full max-w-2xl"/>
            <AboutCard_Contact t={t} classNameVal="mb-4 grid w-full max-w-2xl gap-4 md:grid-cols-2"/>
          </motion.div>
        </motion.div>
      </Suspense>
  );
}

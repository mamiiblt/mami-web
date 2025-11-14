import {Card, CardContent} from "@/components/ui/card";
import {HugeiconsIcon} from "@hugeicons/react";
import {
    Analytics01Icon,
    ComputerProgrammingIcon,
    FireIcon, HeartCheckIcon, LinkSquareIcon, Mail02Icon,
    SourceCodeIcon, TelegramIcon,
    UserArrowLeftRightIcon
} from "@hugeicons/core-free-icons";
import {motion} from "framer-motion";
import {buttonVariants, cardVariants, containerVariants, itemVariants} from "@/components/about/MotionSpecs";
import {TFunction} from "i18next";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import GithubCalendar from "react-github-calendar";
import Link from "next/link";

const MotionButton = motion.create(Button);
const MotionCard = motion.create(Card);

export function AnimatedContactButton({href, icon, label}: { href: string; icon: any; label: string; }) {
    return (
        <motion.div variants={itemVariants}>
            <MotionButton
                variant="outline"
                className="w-full hover:bg-accent hover:text-accent-foreground"
                asChild
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
            >
                <Link href={href} className="flex items-center justify-center gap-2">
                    <HugeiconsIcon icon={icon} className="h-4 w-4"/>
                    <span>{label}</span>
                </Link>
            </MotionButton>
        </motion.div>
    );
}


export function AboutCard_Contact({classNameVal, t, }: { classNameVal?: string; t: TFunction; }) {
    return (
        <motion.div
            className={classNameVal}
            variants={containerVariants}
        >
            <AnimatedContactButton href={"/projects"} icon={SourceCodeIcon} label={t("nav.projects")}/>
            <AnimatedContactButton href={"/articles"} icon={LinkSquareIcon} label={t("nav.articles")}/>
            <AnimatedContactButton href={"https://github.com/sponsors/mamiiblt"} icon={HeartCheckIcon}
                                   label={t("nav.support")}/>
            <AnimatedContactButton href={"mailto:mami@mamii.me"} icon={Mail02Icon} label={t("nav.mail")}/>

            <motion.div variants={itemVariants} className="md:col-span-2">
                <MotionButton
                    variant="default"
                    className="w-full"
                    asChild
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                >
                    <Link
                        href="https://t.me/mamiiblt"
                        className="flex items-center justify-center gap-2"
                    >
                        <HugeiconsIcon icon={TelegramIcon} className="h-4 w-4"/>
                        <span>{t("nav.contactme")}</span>
                    </Link>
                </MotionButton>
            </motion.div>
        </motion.div>
    )
}

export function AboutCard_ContGraph({classNameVal,t,
                                    }: {
    classNameVal?: string;
    t: TFunction;
}) {
    return (
        <motion.div className={classNameVal} variants={itemVariants}>
            <Card className="p-6">
                <CardContent className="p-0">
                    <div className="mb-3 flex items-start justify-between">
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                            <HugeiconsIcon icon={FireIcon} className="h-5 w-5"/>
                            {t("stats.contgraph")}
                        </h4>
                    </div>
                    <GithubCalendar username="mamiiblt"/>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export function AboutCard_Skills({
                                     classNameVal,
                                     t,
                                     skills
                                 }: {
    classNameVal?: string;
    t: TFunction;
    skills: any;
}) {
    return (
        <motion.div className={classNameVal} variants={itemVariants}>
            <Card className="p-6">
                <CardContent className="p-0">
                    <div className="mb-3 flex items-start justify-between">
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                            <HugeiconsIcon
                                icon={ComputerProgrammingIcon}
                                className="h-5 w-5"
                            />
                            {t("tool-tech")}
                        </h4>
                    </div>
                    <motion.div
                        className="w-full max-w-2xl"
                        variants={itemVariants}
                    >
                        <div className="flex flex-wrap justify-center gap-2">
                            {skills.map((skill, index) => (
                                <motion.div
                                    key={index}
                                    initial={{opacity: 0, scale: 0.8}}
                                    animate={{opacity: 1, scale: 1}}
                                    transition={{delay: 0.1 * index}}
                                >
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1 px-3 py-1"
                                    >
                                        {skill.icon}
                                        <span>{skill.name}</span>
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export function AboutCard_Statistics({
                                         classNameVal,
                                         t,
    stats
                                     }: {
    classNameVal?: string;
    t: TFunction;
    stats: any;
}) {
    return (
        <motion.div className={classNameVal} variants={itemVariants}>
            <Card className="p-6">
                <CardContent className="p-0">
                    <div className="mb-3 flex items-start justify-between">
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                            <HugeiconsIcon icon={Analytics01Icon} className="h-5 w-5"/>
                            {t("stats.stats")}
                        </h4>
                    </div>
                    <motion.div
                        className="grid w-full max-w-2xl grid-cols-2 gap-4 md:grid-cols-4"
                        variants={containerVariants}
                    >
                        {stats.map((stat, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <MotionCard
                                    className="p-4 text-center"
                                    variants={cardVariants}
                                    whileHover="hover"
                                >
                                    <CardContent className="p-0">
                                        <div className="mb-2 flex justify-center text-primary">
                                            {stat.icon}
                                        </div>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {stat.label}
                                        </div>
                                    </CardContent>
                                </MotionCard>
                            </motion.div>
                        ))}
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export function AboutCard_AboutMe({
                                      classNameVal,
                                      t,
                                  }: {
    classNameVal?: string;
    t: TFunction;
}) {
    return (
        <motion.div className={classNameVal} variants={itemVariants}>
            <Card className="p-6">
                <CardContent className="p-0">

                    <motion.div
                        className="space-y-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.p
                            className="text-sm leading-[1.65] font-medium text-foreground/80"
                            variants={itemVariants}
                        >
                            {t("about")}
                        </motion.p>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
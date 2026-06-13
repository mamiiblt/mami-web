/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
};

export const profileVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 300, damping: 20, delay: 0.2 },
    },
    hover: {
        scale: 1.05,
        transition: { type: "spring" as const, stiffness: 300, damping: 10 },
    },
};

export const buttonVariants = {
    initial: { scale: 1 },
    hover: {
        scale: 1.03,
        boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
        transition: { type: "spring" as const, stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.97 },
};

export const socialButtonVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
        scale: 1.1,
        rotate: [0, -10, 10, -5, 5, 0],
        transition: {
            type: "tween" as const,
            ease: "easeInOut" as const,
            duration: 0.6,
        },
    },
    tap: { scale: 0.9 },
};

export const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
    hover: {
        y: -5,
        boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
        transition: { type: "spring" as const, stiffness: 400, damping: 10 },
    },
};

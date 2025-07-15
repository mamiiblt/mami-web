---
author: mamiiblt
title: "Instafel Updater Guide"
description: "An article on how to install and use Instafel Updater"
date: "4 Jan 2025"
tags: ["instafel", "instafel-updater"]
image: "/pbanners/instafel-updater.png"
---

# About Instafel Updater

Instafel Updater is actually designed to eliminate the hassle of automatic updates **for root users**. It does this by checking for Instafel updates at certain intervals in the background with **WorkManager** and **Foreground Service** and installing them silently with Shizuku. This guide covers how you can use Instafel Updater.

## Download and Setup Shizuku

Instafel Updater gets help from Android's Session Installer to install APKs without user approval. To add this support to the application, it will be enough to install and start [Shizuku](https://shizuku.rikka.app/guide/setup/).

**Steps**

1. You can download Shizuku from [Google Play](https://play.google.com/store/apps/details?id=moe.shizuku.privileged.api)
2. You can start Shizuku via **ADB** or **ROOT** mode. It is recommended to start it via ROOT mode for an uninterrupted experience.
3. Select **Authorized applications** and authorize **Instafel Updater** (me.mamiiblt.instafel.updater)

You can find detailed guile in [Shizuku's User Manual](https://shizuku.rikka.app/guide/setup/)

## Download and Install Instafel Updater

1. Download latest Instafel Updater APK from [GitHub Releases](https://github.com/mamiiblt/instafel-updater/releases/latest)
2. Install downloaded APK

## Setup Instafel Updater

1. You need to select an architecture and installation type for update checker.
2. Then you need to give Notification and Shizuku permission
3. Then be sure Shizuku Status, Battery Restiriction Status is okay
4. And Start Updater!

Also you can review daily logs from **Log** menu. Don't forget you can customize updater behavior from Instafel Updater settings (and start [repo on github](https://github.com/mamiiblt/instafel-updater) :))

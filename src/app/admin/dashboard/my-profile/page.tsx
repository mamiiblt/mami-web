"use client";

import {DashboardLayout} from "@/components/admin/DashboardLayout";
import {CircleUserRoundIcon, Eye, EyeOff, LockIcon} from "lucide-react";
import React, {useEffect, useState} from "react";
import {ResponseStatus, sendAdminRequest} from "@/lib/adminUtils";
import {usePathname, useRouter} from "next/navigation";
import {CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {toast} from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

interface AdminInfo {
    id: number
    fullname: string
    username: string
    pp_url: string
    user_tag: string
    telegram_id: string
    permissions_allow_list: { [k: string]: boolean; }
}

export default function DashboardPage() {
    const pathname = usePathname()
    const router = useRouter()
    const [adminInfo, setAdminInfo] = useState<AdminInfo | undefined>(undefined)
    const [fullName, setFullName] = useState<string>("")
    const [telegramId, setTelegramId] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUpdatingPass, setIsUpdatingPass] = useState(false)

    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [oldPassword, setOldPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [newPasswordAgain, setNewPasswordAgain] = useState<string>("")

    useEffect(() => {
        async function sendRequest() {
            await sendAdminRequest({
                router, pathname,
                redirectToLogin: true,
                method: "GET",
                path: "content/admin_full_info",
                onResponse: (response, status, data) => {
                    setAdminInfo(data.content)
                    setFullName(data.content.fullname)
                    setTelegramId(data.content.telegram_id)
                    setIsLoading(false)
                }
            })
        }

        sendRequest()
    }, []);

    const handlePassUpdate = async () => {
        setIsUpdatingPass(true);

        try {
            if (newPassword !== newPasswordAgain) {
                toast.error("Hey!", { description: "New passwords don't match!"})
                return;
            }

            await sendAdminRequest({
                router, pathname,
                redirectToLogin: false,
                method: "POST",
                path: "content/update_pass",
                body: JSON.stringify({
                    old_pass: oldPassword,
                    new_pass: newPassword
                }),
                onResponse: (response, status, data) => {
                    const toastType = status == ResponseStatus.SUCCESS ? toast.success : toast.error
                    toastType(status, {description: data.msg });

                    if (status === ResponseStatus.SUCCESS) {
                        setIsPasswordDialogOpen(false)
                        setShowOldPassword(false)
                        setShowNewPassword(false)
                        setShowConfirmPassword(false)
                        setOldPassword("")
                        setNewPassword("")
                        setNewPasswordAgain("")
                    }
                }
            });
        } catch (err) {
            toast.error("Error", {description: "Something went wrong updating password."});
        } finally {
            setIsUpdatingPass(false);
        }
    };

    const handleSaveChanges = () => {
        try {
            async function sendRequest() {
                setIsSaving(true)

                await sendAdminRequest({
                    router, pathname,
                    redirectToLogin: false,
                    method: "POST",
                    path: "content/update_profile",
                    body: JSON.stringify({
                        new_fullName: fullName,
                        new_telegramId: telegramId
                    }),
                    onResponse: (response, status, data) => {
                        const toastType = status == ResponseStatus.SUCCESS ? toast.success : toast.error
                        toastType(status, { description: data.msg })

                        if (status == ResponseStatus.FAILURE) {
                            setFullName(adminInfo.fullname)
                            setTelegramId(adminInfo.telegram_id)
                        }
                    }
                })

                setIsSaving(false)
            }

            sendRequest()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <DashboardLayout
            pageIcon={CircleUserRoundIcon} title={"My Profile"}
            description={"View and edit your profile information"}
            loadingState={isLoading}
        >
            {!isLoading &&             <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Your account information and profile picture</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="size-20">
                                <AvatarImage src={adminInfo.pp_url || "/placeholder.svg"}
                                             alt={adminInfo.fullname}/>
                                <AvatarFallback className="text-2xl font-bold">
                                    {adminInfo.fullname
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">Profile Picture</p>
                                <p className="text-xs text-muted-foreground">Profile picture cannot be
                                    changed</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input id="fullname"
                                   value={fullName}
                                   onChange={(e) => setFullName(e.target.value)}
                                   placeholder="Enter your full name"/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telegram_id">Telegram User ID</Label>
                            <Input
                                id="telegram_id"
                                value={telegramId}
                                onChange={(e) => setTelegramId(e.target.value)}
                                placeholder="Enter your full name"/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="username"
                                    value={adminInfo.username}
                                    readOnly
                                    disabled
                                    className="bg-muted cursor-not-allowed flex-1"
                                />
                                <Badge variant="secondary" className="text-xs shrink-0">
                                    {adminInfo.user_tag}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Username cannot be changed</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                onClick={handleSaveChanges}
                                disabled={isSaving}>
                                {isSaving ?
                                    <span className="flex items-center gap-2">
                                                <span
                                                    className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/>
                                                Saving...
                                            </span> :
                                    "Save Changes"
                                }
                            </Button>

                            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                                        <LockIcon className="size-4 mr-2"/>
                                        Change My Password
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Update Password</DialogTitle>
                                        <DialogDescription>Please fill this form for update your
                                            password</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="old-password">Old Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="old-password"
                                                    type={showOldPassword ? "text" : "password"}
                                                    placeholder="Enter your current password"
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.currentTarget.value)}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                                >
                                                    {showOldPassword ? (
                                                        <EyeOff className="size-4 text-muted-foreground"/>
                                                    ) : (
                                                        <Eye className="size-4 text-muted-foreground"/>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="new-password"
                                                    type={showNewPassword ? "text" : "password"}
                                                    placeholder="Enter your current password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.currentTarget.value)}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="size-4 text-muted-foreground"/>
                                                    ) : (
                                                        <Eye className="size-4 text-muted-foreground"/>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">New Password (Again)</Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirm-password"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={newPasswordAgain}
                                                    onChange={(e) => setNewPasswordAgain(e.currentTarget.value)}
                                                    placeholder="Enter your current password again"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="size-4 text-muted-foreground"/>
                                                    ) : (
                                                        <Eye className="size-4 text-muted-foreground"/>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter className="flex gap-2">
                                        <Button type="button" variant="outline"
                                                onClick={() => setIsPasswordDialogOpen(false)}
                                                disabled={isUpdatingPass}>
                                            Cancel
                                        </Button>
                                        <Button type="button" onClick={handlePassUpdate}
                                                disabled={isUpdatingPass}>
                                            {isUpdatingPass ?
                                                <span className="flex items-center gap-2">
                                                            <span
                                                                className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/>
                                                            Updating...
                                                        </span> :
                                                "Update Password"
                                            }
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Permissions</CardTitle>
                        <CardDescription>Your administrator account permissions and access
                            rights</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {Object.entries(adminInfo.permissions_allow_list).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <span className="text-sm font-mono">{key}</span>
                                    <Badge
                                        variant={value ? "default" : "secondary"}>{value ? "true" : "false"}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            }
        </DashboardLayout>
    )
}
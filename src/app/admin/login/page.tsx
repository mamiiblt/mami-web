"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {UserIcon, KeyIcon, ShieldUserIcon, EyeOff, Eye} from "lucide-react"
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {bayon} from "@/components/admin/DashboardLayout";

export default function AdminLoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const response = await fetch(`${process.env.API_BASE}/madmin/auth/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username: username.trim(), password: password.trim() })
        });

        const data: {
            code: string
            msg: string
            token?: string
            expiresAt?: string
        } = await response.json()


        const toastStatus = data.code == "LOGIN_SUCCESS" ? toast.success : toast.error
        toastStatus(data.code == "LOGIN_SUCCESS" ? "Logged" : "Failure", {
            description: data.msg
        })

        if (data.code == "LOGIN_SUCCESS") {
            const expiresAt = new Date(data.expiresAt)
            const maxAgeSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000)
            document.cookie = `sessionToken=${data.token}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Strict`
            document.cookie = `sessionToken_expires=${data.expiresAt}; Max-Age=3600; Path=/; SameSite=Strict`
            router.push("/admin/dashboard")
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <Card className="border-border/50 shadow-2xl">
                    <CardHeader className="space-y-3 text-center pb-8">
                        <div className="flex justify-center mb-2">
                            <ShieldUserIcon className="w-10 h-10 text-primary mb-2 mt-2" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-balance"><a className={bayon.className}>MAdmin</a> Login</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            Login for access to MAdmin Dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        type="username"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-primary"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-primary"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowPassword(prevState => !prevState)}
                                    >
                                        {showPassword ? (
                                            <Eye className="size-4 text-muted-foreground mr-1"/>
                                        ) : (
                                            <EyeOff className="size-4 text-muted-foreground mr-1"/>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Logging...
              </span>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

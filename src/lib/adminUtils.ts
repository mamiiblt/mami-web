import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export function getSavedSessionToken(router: AppRouterInstance) {
    console.log(document.cookie)
    const sessionToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("sessionToken="))
        ?.split("=")[1] || null

    if (sessionToken == null) {
        router.push("/admin/login")
    } else {
        return sessionToken
    }
}

export function logoutUser(router: AppRouterInstance) {
    document.cookie = `sessionToken=; Max-Age=0; Path=/; SameSite=Strict`
    router.push("/admin/login")
}
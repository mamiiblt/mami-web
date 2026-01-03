import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {permissionsManager} from "@/lib/permissionsManager";
import {toast} from "sonner";

export const ResponseStatus = {
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
    AUTH_FAILED: "AUTH_FAILED",
    INVALID_PERMISSION: "INVALID_PERMISSION"
}

export interface AdminResponse {
    status: "SUCCESS" | "FAILURE" | "AUTH_FAILED" | "INVALID_PERMISSION",
    data: {
        msg: string;
        [key: string]: any;
    }
}

export function getSessionExpireDate() {
    const sessionTokenExpireDate = document.cookie
        .split("; ")
        .find(row => row.startsWith("sessionToken_expires="))
        ?.split("=")[1] || null

    if (sessionTokenExpireDate == null) {
        return null
    } else {
        return new Date(sessionTokenExpireDate)
    }
}

export function getSavedSessionToken(router: AppRouterInstance) {
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
    toast.success("Logout successfully")
    router.push("/admin/login")
    setTimeout(() => {
        document.cookie = `sessionToken=; Max-Age=0; Path=/; SameSite=Strict`
        document.cookie = `sessionToken_expires=; Max-Age=0; Path=/; SameSite=Strict`
    }, 2000)
}

interface AdminRequestConfig<T = any> {
    path: string,
    method: "POST" | "GET",
    body?: object,
    onResponse?: (response: Response, status: string, data: any) => T
}

export async function sendAdminRequest(
    sessionToken: string,
    config: AdminRequestConfig
) {
    const requestUrl = `${process.env.API_BASE}/madmin/${config.path}`

    let response: Response | undefined = undefined

    if (config.method === "POST") {
        response = await fetch(requestUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${sessionToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(config.body) || ""
            }
        )
    } else {
        response = await fetch(requestUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Token ${sessionToken}`,
                }
            }
        )
    }

    const data: AdminResponse = await response.json()

    if (config.onResponse) {

        if (data.status == ResponseStatus.INVALID_PERMISSION) {
            permissionsManager.showInsufficientPermissions(
                data.data.missing
            )
            console.log(data.data.missing)
        } else {
            return config.onResponse(response, data.status, data.data)
        }
    }
}
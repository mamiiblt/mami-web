import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

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
    document.cookie = `sessionToken=; Max-Age=0; Path=/; SameSite=Strict`
    router.push("/admin/login")
}

interface AdminRequestConfig {
    path: string,
    method: "POST" | "GET",
    body?: object
}

export async function sendAdminRequest(sessionToken: string, config: AdminRequestConfig): Promise<any> {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 10000);
    const requestUrl = `${process.env.API_BASE}/madmin/${config.path}`
    if (config.method === "POST") {
        const response = await fetch(requestUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${sessionToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(config.body) || "",
                signal: controller.signal
            }
        )
        return await response.json()
    } else {
        const response = await fetch(requestUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Token ${sessionToken}`,
                },
                signal: controller.signal
            }
        )
        return await response.json()
    }
}
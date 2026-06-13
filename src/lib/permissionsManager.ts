/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

type PermissionCallback = (permissions: string[]) => void

class PermissionsManager {
    private listeners: PermissionCallback[] = []

    subscribe(callback: PermissionCallback) {
        this.listeners.push(callback)
        return () => {
            this.listeners = this.listeners.filter((l) => l !== callback)
        }
    }

    showInsufficientPermissions(permissions: string[]) {
        this.listeners.forEach((listener) => listener(permissions))
    }
}

export const permissionsManager = new PermissionsManager()

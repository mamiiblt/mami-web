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

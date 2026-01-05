"use client";

import {DashboardLayout} from "@/components/admin/DashboardLayout";
import {ChevronDown, UserCogIcon} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Pencil, Trash2, Eye, EyeOff, UserPlus} from "lucide-react"
import {getSavedSessionToken, ResponseStatus, sendAdminRequest} from "@/lib/adminUtils";
import {LoadingBar} from "@/components/ifl";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Checkbox} from "@/components/ui/checkbox";
import {toast} from "sonner";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";

interface MemberInfo {
    id?: number;
    fullName: string;
    userName: string;
    ppUrl: string;
    telegramId: string;
    password?: string;
    permissions: string[];
}

const newUserDefault = {
    fullName: "",
    userName: "",
    password: "",
    ppUrl: "",
    telegramId: "",
    permissions: [
        "CAN_EDIT_PROFILE",
    ] // add default user permissions there
} as MemberInfo

export default function DashboardPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [memberList, setMemberList] = useState<MemberInfo[] | undefined>(undefined)
    const [permissionsList, setPermissionsList] = useState<Record<number, string> | undefined>(undefined)
    const [permissionsListArr, setPermissionsListArr] = useState<string[]>([])
    const [editingMember, setEditingMember] = useState<MemberInfo | null>(null)
    const [newMember, setNewMember] = useState<MemberInfo | null>(newUserDefault)
    const [showPassword, setShowPassword] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleMemberEdit = async () => {
        console.log(editingMember)

        try {
            await sendAdminRequest(getSavedSessionToken(router), {
                method: "POST",
                path: "content/edit_member",
                body: {
                    member: editingMember
                },
                onResponse: (response, status, data) => {

                    const toastType = status == ResponseStatus.SUCCESS ? toast.success : toast.error
                    toastType(status.toUpperCase(), {
                        description: data.msg
                    })

                    if (status == ResponseStatus.SUCCESS) {
                        setMemberList(prev => prev.map(user =>
                            user.id === data.memberNewData.id
                                ? {...user, ...data.memberNewData}
                                : user
                        ))
                        setEditingMember(null)
                        setShowPassword(false)
                    }
                }
            })
        } catch (e) {
            console.error(e)
            toast.error("Error", {description: "Something went wrong when editing user."});
        }
    }

    const createNewMember = async () => {
        try {
            await sendAdminRequest(getSavedSessionToken(router), {
                method: "POST",
                path: "content/create_member",
                body: {
                    fullname: newMember.fullName,
                    username: newMember.userName,
                    password: newMember.password,
                    pp_url: newMember.ppUrl,
                    telegram_id: newMember.telegramId,
                    permissions: newMember.permissions
                },
                onResponse: (response, status, data) => {
                    const toastType = status == ResponseStatus.SUCCESS ? toast.success : toast.error
                    toastType(status.toUpperCase(), {
                        description: data.msg
                    })

                    if (status == ResponseStatus.SUCCESS) {
                        const createdMemberData = data.createdMemberData as MemberInfo
                        setMemberList(prev => [...prev, createdMemberData])
                        setNewMember(newUserDefault)
                        setIsAddDialogOpen(false)
                    }
                }
            })
        } catch (e) {
            toast.error("Error", {description: "Something went wrong when creating user."});
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await sendAdminRequest(getSavedSessionToken(router), {
                method: "POST",
                path: "content/delete_member",
                body: {
                    adminId: id
                },
                onResponse: (response, status, data) => {
                    const toastType = status == ResponseStatus.SUCCESS ? toast.success : toast.error
                    toastType(status.toUpperCase(), {
                        description: data.msg
                    })

                    if (status == ResponseStatus.SUCCESS) {
                        setMemberList(memberList.filter((m) => m.id !== id))
                    }
                }
            })
        } catch (e) {
            console.error(e)
            toast.error("Error", {description: "Something went wrong when deleting user."});
        }
    }

    useEffect(() => {
        async function sendRequest() {
            await sendAdminRequest(getSavedSessionToken(router), {
                method: "GET",
                path: "content/members_info",
                onResponse: (response, status, data) => {
                    setMemberList(data.content)
                    setPermissionsList(data.permissionsData)
                    setPermissionsListArr(Object.values(data.permissionsData))
                    setIsLoading(false)
                }
            })
        }

        sendRequest()
    }, []);

    const togglePermission = (
        permissionName: string,
        memberData: MemberInfo,
        setIsNewOrEditing: boolean
    ) => {
        const setFunction = setIsNewOrEditing ? setEditingMember : setNewMember

        const hasPermission = memberData.permissions.includes(permissionName)

        let newPermissions = hasPermission
            ? memberData.permissions.filter(p => p !== permissionName)
            : [...memberData.permissions, permissionName]

        newPermissions = newPermissions.filter(p =>
            permissionsListArr.includes(p)
        )

        setFunction({
            ...memberData,
            permissions: newPermissions,
        })
    }

    return (
        <DashboardLayout pageIcon={UserCogIcon} title={"Member Management"}
                         description={"Manage MAdmin users from there."}>
            {
                isLoading ? <LoadingBar/> : <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>All Members</CardTitle>
                                <CardDescription>A list of all admin members with their details</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="gap-2">
                                            <UserPlus className="size-4"/>
                                            Add Member
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Add Member</DialogTitle>
                                            <DialogDescription>Create a new member with credentials</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="fullname">Full Name</Label>
                                                    <Input
                                                        id="fullname"
                                                        value={newMember.fullName}
                                                        onChange={(e) => setNewMember({
                                                            ...newMember,
                                                            fullName: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="username">Username</Label>
                                                    <Input
                                                        id="username"
                                                        value={newMember.userName}
                                                        onChange={(e) => setNewMember({
                                                            ...newMember,
                                                            userName: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="pp_url">Profile Picture URL</Label>
                                                <Input
                                                    id="pp_url"
                                                    value={newMember.ppUrl}
                                                    onChange={(e) => setNewMember({
                                                        ...newMember,
                                                        ppUrl: e.target.value
                                                    })}
                                                    placeholder="https://example.com/avatar.jpg"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="telegram_id">Telegram ID</Label>
                                                <Input
                                                    id="telegram_id"
                                                    value={newMember.telegramId}
                                                    onChange={(e) =>
                                                        setNewMember({...newMember, telegramId: e.target.value})
                                                    }
                                                    placeholder="Telegram User ID of Member"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password">Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        value={newMember.password == undefined ? "" : newMember.password}
                                                        onChange={(e) => setNewMember({
                                                            ...newMember,
                                                            password: e.target.value
                                                        })}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff className="size-4"/> :
                                                            <Eye className="size-4"/>}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Permissions</Label>
                                                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                                                    <CollapsibleTrigger
                                                        className="flex w-full items-center justify-between rounded-lg border bg-muted/50 p-4 hover:bg-muted transition-colors">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium">
                                                                {newMember.permissions.length > 0
                                                                    ? `${newMember.permissions.length} permission(s) selected`
                                                                    : "Select permissions"}
                                                            </span>
                                                        </div>
                                                        <ChevronDown
                                                            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}/>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="mt-2">
                                                        <div
                                                            className="border rounded-lg p-4 space-y-3 bg-background max-h-[120px] overflow-y-auto">
                                                            {Object.entries(permissionsList).map(([id, permissionName]) => (
                                                                <div key={id} className="flex items-center space-x-3">
                                                                    <Checkbox
                                                                        id={`perm-${id}`}
                                                                        checked={newMember.permissions.includes(permissionName)}
                                                                        onCheckedChange={() => togglePermission(permissionName, newMember, false)}
                                                                    />
                                                                    <Label htmlFor={`perm-${id}`}
                                                                           className="text-sm font-normal cursor-pointer flex-1">
                                                                        {permissionName}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                                {newMember.permissions.length > 0 && (
                                                    <p className="text-xs text-muted-foreground">Selected: {newMember.permissions.join(", ")}</p>
                                                )}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => {
                                                setIsAddDialogOpen(false)
                                                setNewMember(newUserDefault)
                                            }}>Cancel</Button>
                                            <Button onClick={createNewMember}>Create User</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Telegram</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {memberList.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="size-10">
                                                    <AvatarImage src={member.ppUrl || "/placeholder.svg"}
                                                                 alt={member.fullName}/>
                                                    <AvatarFallback>{member.fullName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{member.fullName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-sm bg-muted px-2 py-1 rounded">{member.id}</code>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm px-2 py-1 rounded">@{member.userName}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{member.telegramId}</span>
                                        </TableCell>
                                        <TableCell>
                                            {member.permissions.length > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {member.permissions[0]}
                                                    </Badge>
                                                    {member.permissions.length > 1 && (
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button variant="ghost" size="sm"
                                                                        className="h-6 px-2 text-xs">
                                                                    More
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-80">
                                                                <div className="space-y-2">
                                                                    <h4 className="font-medium text-sm">All
                                                                        Permissions</h4>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {member.permissions.map((perm) => (
                                                                            <Badge key={perm} variant="secondary"
                                                                                   className="text-xs">
                                                                                {perm}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">No permissions</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Dialog
                                                    open={editingMember?.id === member.id}
                                                    onOpenChange={(open) => {
                                                        if (!open) {
                                                            setEditingMember(null)
                                                            setShowPassword(false)
                                                        }
                                                    }}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => {
                                                            setEditingMember({...member})
                                                        }}>
                                                            <Pencil className="size-4"/>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        {editingMember && (
                                                            <>
                                                                <DialogHeader>
                                                                    <DialogTitle>Edit Member</DialogTitle>
                                                                    <DialogDescription>Update {editingMember.fullName} information
                                                                        and credentials</DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-4 py-4">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor="fullname">Full Name</Label>
                                                                            <Input
                                                                                id="fullname"
                                                                                value={editingMember.fullName}
                                                                                onChange={(e) => setEditingMember({
                                                                                    ...editingMember,
                                                                                    fullName: e.target.value
                                                                                })}
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor="pp_url">Profile Picture
                                                                                URL</Label>
                                                                            <Input
                                                                                id="pp_url"
                                                                                value={editingMember.ppUrl}
                                                                                onChange={(e) => setEditingMember({
                                                                                    ...editingMember,
                                                                                    ppUrl: e.target.value
                                                                                })}
                                                                                placeholder="https://example.com/avatar.jpg"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="telegram_id">Telegram ID</Label>
                                                                        <Input
                                                                            id="telegram_id"
                                                                            value={editingMember.telegramId}
                                                                            onChange={(e) =>
                                                                                setEditingMember({
                                                                                    ...editingMember,
                                                                                    telegramId: e.target.value
                                                                                })
                                                                            }
                                                                            placeholder="User Telegram ID"
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="password">Password</Label>
                                                                        <div className="relative">
                                                                            <Input
                                                                                id="password"
                                                                                type={showPassword ? "text" : "password"}
                                                                                value={editingMember.password == undefined ? "" : editingMember.password}
                                                                                placeholder={"Enter new password if you want to change it"}
                                                                                onChange={(e) => setEditingMember({
                                                                                    ...editingMember,
                                                                                    password: e.target.value
                                                                                })}
                                                                            />
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="absolute right-0 top-0 h-full"
                                                                                onClick={() => setShowPassword(!showPassword)}
                                                                            >
                                                                                {showPassword ?
                                                                                    <EyeOff className="size-4"/> :
                                                                                    <Eye className="size-4"/>}
                                                                            </Button>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <Label>Permissions</Label>
                                                                        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                                                                            <CollapsibleTrigger
                                                                                className="flex w-full items-center justify-between rounded-lg border bg-muted/50 p-4 hover:bg-muted transition-colors">
                                                                                <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium">
                                                                {editingMember.permissions.length > 0
                                                                    ? `${editingMember.permissions.length} permission(s) selected`
                                                                    : "Select permissions"}
                                                            </span>
                                                                                </div>
                                                                                <ChevronDown
                                                                                    className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}/>
                                                                            </CollapsibleTrigger>
                                                                            <CollapsibleContent className="mt-2">
                                                                                <div
                                                                                    className="border rounded-lg p-4 space-y-3 bg-background max-h-[120px] overflow-y-auto">
                                                                                    {Object.entries(permissionsList).map(([id, permissionName]) => (
                                                                                        <div key={id} className="flex items-center space-x-3">
                                                                                            <Checkbox
                                                                                                id={`perm-${id}`}
                                                                                                checked={editingMember.permissions.includes(permissionName)}
                                                                                                onCheckedChange={() => togglePermission(permissionName, editingMember, true)}
                                                                                            />
                                                                                            <Label htmlFor={`perm-${id}`}
                                                                                                   className="text-sm font-normal cursor-pointer flex-1">
                                                                                                {permissionName}
                                                                                            </Label>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </CollapsibleContent>
                                                                        </Collapsible>
                                                                        {editingMember.permissions.length > 0 && (
                                                                            <p className="text-xs text-muted-foreground">Selected: {editingMember.permissions.join(", ")}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                        <DialogFooter>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setEditingMember(null)
                                                                    setShowPassword(false)
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button type={"button"} onClick={handleMemberEdit}>Apply
                                                                Changes</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="size-4 text-destructive"/>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently
                                                                delete the member{" "}
                                                                <strong>{member.fullName}</strong> and remove their
                                                                access.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(member.id)}
                                                                className="bg-destructive hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            }
        </DashboardLayout>
    )
}
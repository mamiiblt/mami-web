"use client";

import {DashboardLayout} from "@/components/admin/DashboardLayout";
import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {
    CodeXmlIcon, EyeIcon, GlobeIcon, HardDriveDownload,
    ImageIcon, MousePointer2Icon,
    NewspaperIcon, PenIcon,
    PlusIcon,
    SaveIcon, UploadIcon,
} from "lucide-react"
import {Button} from "@/components/ui/button";
import {ResponseStatus, sendAdminRequest} from "@/lib/adminUtils";
import {toast} from "sonner";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import ArticleListCard from "@/components/articles/ArticleListCard";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {formatDate} from "@/lib/utils";
import ArticleContentViewer from "@/components/articles/ArticleContentViewer";
import {useTranslation} from "react-i18next";
import {Badge} from "@/components/ui/badge";

interface ArticleData {
    id: string
    date: string
    topic: string
    banner_id: string
    english: {
        title: string
        desc: string
        cont: string
    },
    turkish: {
        title: string
        desc: string
        cont: string
    }
}

export default function ArticlesListPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)
    const idValue = searchParams.get("id") ?? undefined
    const isEditMode = idValue != undefined
    const [articleData, setArticleData] = useState<ArticleData | undefined>(undefined)
    const [activeTab, setActiveTab] = useState("general")
    const [bannerFile, setBannerFile] = useState<File | null>(null)
    const [bannerSrc, setBannerSrc] = useState<string | null>(null)
    const [editorLang, setEditorLang] = useState<"turkish" | "english" | string>("turkish")
    const [showJson, setShowJson] = useState(false)
    const {t} = useTranslation("articles")

    useEffect(() => {
        if (!isEditMode) {
            console.log("Create new article is provided")
            setArticleData({
                id: "",
                date: new Date(Date.now()).toISOString(),
                topic: "",
                banner_id: "",
                turkish: {
                    title: "",
                    desc: "",
                    cont: "",
                },
                english: {
                    title: "",
                    desc: "",
                    cont: ""
                }
            })
            setIsLoading(false)
            return
        }

        const sendRequest = async () => {
            await sendAdminRequest({
                router,
                redirectToLogin: false,
                method: "POST",
                path: "content/article_info",
                body: JSON.stringify({
                    article_id: idValue
                }),
                onResponse: (response, status, data) => {
                    if (status === ResponseStatus.FAILURE) {
                        toast.error(status, {description: data.msg})
                        return
                    }

                    console.log(data.article)
                    setArticleData(data.article)
                    setBannerSrc(getBannerUrl(data.article.banner_id))
                    setIsLoading(false)
                }
            })
        }

        sendRequest()
    }, [])

    const handleChange = (field: keyof ArticleData, value: string) => {
        setArticleData({...articleData, [field]: value})
    }

    const handleTurkishChange = (field: keyof ArticleData["turkish"], value: string) => {
        setArticleData({
            ...articleData,
            turkish: {...articleData.turkish, [field]: value},
        })
    }

    const handleEnglishChange = (field: keyof ArticleData["english"], value: string) => {
        setArticleData({
            ...articleData,
            english: {...articleData.english, [field]: value},
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const preview = URL.createObjectURL(file)
            setBannerFile(file)
            setBannerSrc(preview)
        }
    }

    const handleRemoveBanner = () => {
        if (bannerSrc) {
            URL.revokeObjectURL(bannerSrc)
        }
        setBannerFile(null)
        setBannerSrc(null)
    }

    const handleUploadBanner = () => {
        const formData = new FormData();

        if (bannerFile) {
            formData.append("banner_img", bannerFile);
        }

        const sendRequest = async () => {
            await sendAdminRequest({
                router,
                redirectToLogin: false,
                method: "POST",
                path: `content/upload_banner`,
                body: formData,
                onResponse: (response, status, data) => {
                    const toastFn = status == ResponseStatus.SUCCESS ? toast.success : toast.warning
                    toastFn(status, { description: data.msg })

                    if (status == ResponseStatus.SUCCESS) {
                        setBannerFile(null)
                        setBannerSrc(getBannerUrl(data.newBannerId))
                        handleChange("banner_id", data.newBannerId)
                    }
                }
            })
        }

        sendRequest()
    }

    const handleAction = async () => {
        if (!isEditMode) {
            await sendAdminRequest({
                router,
                redirectToLogin: false,
                method: "POST",
                path: "content/create_article",
                body: JSON.stringify({
                    article: articleData
                }),
                onResponse: (response, status, data) => {
                    if (status == ResponseStatus.SUCCESS) {
                        toast.success(status, {
                            description: data.msg,
                            action: {
                                label: "View",
                                onClick: () => {
                                    window.open(data.article_url, "_blank", "noopener,noreferrer")
                                }
                            }
                        })
                    } else {
                        toast.warning(status, {description: data.msg})
                    }
                }
            })
        } else {
            // send edit request
        }
    }

    return (
        <DashboardLayout
            pageIcon={NewspaperIcon}
            title={`Article Editor`}
            description={isEditMode && !isLoading ? `Edit article "${articleData.english.title}"` : "Create new article from scratch"}
            loadingState={isLoading}
            actionBarItems={[
                <DropdownMenu key="setEditorLang">
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size={"icon"}>
                            <GlobeIcon className="size-3"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Editor Language</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuRadioGroup value={editorLang} onValueChange={setEditorLang}>
                            <DropdownMenuRadioItem value="turkish">Türkçe</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="english">English</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>,
                <Button
                    key={"showJsonCode"}
                    variant="outline"
                    size="icon"
                    className="size-9"
                    onClick={() => setShowJson(true)}
                >
                    <CodeXmlIcon className="size-4"/>
                </Button>,
                <Button key={"actionButton"} className="gap-2" onClick={handleAction}>
                    {isEditMode ? <SaveIcon className="size-4"/> : <PlusIcon className="size-4"/>}
                    {isEditMode ? "Apply Changes" : "Create Article"}
                </Button>,
            ]}
        >
            {
                !isLoading && <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className={`grid w-full grid-cols-3 mb-6`}>
                        <TabsTrigger value="general" className="flex items-center gap-2">
                            <NewspaperIcon className="w-4 h-4"/>
                            General Details
                        </TabsTrigger>
                        <TabsTrigger value="content" className="flex items-center gap-2">
                            <PenIcon className="w-4 h-4"/>
                            Edit Content
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex items-center gap-2">
                            <EyeIcon className="w-4 h-4"/>
                            Article Preview
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CardTitle className="flex items-center gap-2">
                                        <NewspaperIcon className="w-5 h-5"/>
                                        General Details
                                    </CardTitle>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="id" className="text-sm font-medium">
                                            Article ID
                                        </Label>
                                        <Input
                                            id="id"
                                            placeholder="Enter an unique ID string..."
                                            value={articleData.id}
                                            onChange={(e) => handleChange("id", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date" className="text-sm font-medium">
                                            Publish Date {isEditMode && "(Not Editable)"}
                                        </Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            disabled={isEditMode}
                                            value={articleData.date
                                                ? articleData.date.split("T")[0]
                                                : ""}
                                            onChange={(e) => handleChange("date", new Date(e.target.value).toISOString())}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="topic" className="text-sm font-medium">
                                            Topic
                                        </Label>
                                        <Input
                                            id="topic"
                                            placeholder="Enter topic..."
                                            value={articleData.topic}
                                            onChange={(e) => handleChange("topic", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Card className={"bg-muted/30"}>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5" />
                                            Set / Change Banner
                                            {bannerSrc && !bannerSrc.startsWith("https://") ? <Badge className={"bg-blue-700"}>Modified</Badge> : <Badge className={"bg-green-700"}>Uploaded</Badge>}
                                        </CardTitle>

                                       <div className={"space-x-2 flex"}>
                                           {bannerSrc && !bannerSrc.startsWith("https://") && <div>
                                               <Button
                                                   className={"bg-green-700 hover:bg-green-700"}
                                                   variant="default"
                                                   size="default"
                                                   onClick={handleUploadBanner}
                                               >
                                                   <UploadIcon className="h-4 w-4" />
                                                   <p>Upload Banner</p>
                                               </Button>
                                           </div>}

                                           <Button
                                               className={""}
                                               variant={"default"}
                                               size="default"
                                               onClick={handleRemoveBanner}
                                           >
                                               <MousePointer2Icon className="h-4 w-4" />
                                               <p>Change Banner</p>
                                           </Button>
                                       </div>
                                    </CardHeader>
                                    <CardContent>
                                        {bannerSrc ? (
                                            <div className="relative">
                                                <Card className={"border-2 bg-muted/50"}>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <EyeIcon className="w-5 h-5"/>
                                                            List Card Previews
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div
                                                                className="rounded-lg flex flex-col items-center justify-center">
                                                                <ArticleListCard
                                                                    idx={0} bannerSrc={bannerSrc || "/placeholder.svg"}
                                                                    bannerAlt={""}
                                                                    topic={articleData.topic} title={articleData.turkish.title}
                                                                    desc={articleData.turkish.desc}
                                                                    dateIso={articleData.date} dateLng={"tr"}
                                                                    rtmString={`5 dakika okuma süresi`}
                                                                />
                                                            </div>
                                                            <div
                                                                className="rounded-lg flex flex-col items-center justify-center">
                                                                <ArticleListCard
                                                                    idx={0} bannerSrc={bannerSrc || "/placeholder.svg"}
                                                                    bannerAlt={""}
                                                                    topic={articleData.topic} title={articleData.english.title}
                                                                    desc={articleData.english.desc}
                                                                    dateIso={articleData.date} dateLng={"en"}
                                                                    rtmString={`5 min to read`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="banner-upload"
                                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground"/>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        <span className="font-semibold">Click to upload image</span> or move
                                                        to
                                                        here.
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">Only PNG format are
                                                        supported
                                                        (Required resulation: 1024x588)</p>
                                                </div>
                                                <input id="banner-upload" type="file" className="hidden" accept="image/png"
                                                       onChange={handleFileChange}/>
                                            </label>
                                        )}
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="content" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PenIcon className="w-5 h-5"/>
                                    Edit Content
                                    <Badge variant={"outline"}>{editorLang === "turkish" ? "Türkçe" : "English"}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className={"space-y-4"}>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter title..."
                                        value={editorLang == "turkish" ? articleData.turkish.title : articleData.english.title}
                                        onChange={(e) => {
                                            const handleFunction = editorLang == "turkish" ? handleTurkishChange : handleEnglishChange
                                            handleFunction("title", e.target.value)
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="desc">Description</Label>
                                    <Textarea
                                        id="desc"
                                        placeholder="Enter description..."
                                        rows={3}
                                        value={editorLang == "turkish" ? articleData.turkish.desc : articleData.english.desc}
                                        onChange={(e) => {
                                            const handleFunction = editorLang == "turkish" ? handleTurkishChange : handleEnglishChange
                                            handleFunction("desc", e.target.value)
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <Label>Article Content</Label>
                                        <Textarea
                                            placeholder="Write article content here..."
                                            className="min-h-[400px] font-mono text-sm resize-none"
                                            value={editorLang == "turkish" ? articleData.turkish.cont : articleData.english.cont}
                                            onChange={(e) => {
                                                const handleFunction = editorLang == "turkish" ? handleTurkishChange : handleEnglishChange
                                                handleFunction("cont", e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="preview" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <EyeIcon className="w-5 h-5"/>
                                    Article Preview
                                    <Badge variant={"outline"}>{editorLang === "turkish" ? "Türkçe" : "English"}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Card className={"p-6 bg-muted/30"}>
                                    <ArticleContentViewer
                                        writtenByText={t("writtenBy")}
                                        content={editorLang == "turkish" ? articleData.turkish.cont : articleData.english.cont}
                                        bannerSrc={bannerSrc || "/placeholder.svg"}
                                        title={editorLang == "turkish" ? articleData.turkish.title : articleData.english.title}
                                        desc={editorLang == "turkish" ? articleData.turkish.desc : articleData.english.desc}
                                        viewText={t("viewText", {count: 31})}
                                        dateStr={formatDate(articleData.date, editorLang == "turkish" ? "tr" : "en")}
                                        dateIso={articleData.date}/>
                                </Card>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            }

            <Dialog open={showJson} onOpenChange={setShowJson}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Raw Article Data (with JSON)</DialogTitle>
                    </DialogHeader>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-[60vh]">
                        {JSON.stringify(articleData, null, 2) || "null"}
                    </pre>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}

function getBannerUrl(bannerId: string) {
    return `https://cdn.mamii.dev/mwb/article_banners/${bannerId}.png`
}
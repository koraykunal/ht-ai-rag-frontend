"use client";

import {useState, useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {sourceApi} from "@/lib/api";
import {useTranslation} from "@/contexts/TranslationContext";
import {useAuth} from "@/contexts/AuthContext";
import type {SourceDetail} from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/Button";
import {Badge} from "@/components/ui/badge";
import {
    FileText,
    Scale,
    ExternalLink,
    X,
    Copy,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

interface SourceDetailModalProps {
    sourceId: string | null;
    onClose: () => void;
}

export function SourceDetailModal({sourceId, onClose}: SourceDetailModalProps) {
    const {t} = useTranslation();
    const {isAuthenticated} = useAuth();
    const [copied, setCopied] = useState(false);

    const {data: sourceData, isLoading, error} = useQuery({
        queryKey: ["sourceDetail", sourceId],
        queryFn: () => sourceApi.getSourceDetail(sourceId!),
        enabled: !!sourceId,
        retry: 1,
    });

    const source = sourceData?.data;

    const handleCopyContent = async () => {
        if (!source?.full_content) return;
        
        try {
            await navigator.clipboard.writeText(source.full_content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Copy failed:", error);
        }
    };

    const getSourceIcon = (type: string) => {
        switch (type) {
            case "law":
            case "constitution":
                return Scale;
            case "decision":
                return FileText;
            default:
                return FileText;
        }
    };

    const getSourceTypeLabel = (type: string) => {
        switch (type) {
            case "law":
                return "Mevzuat";
            case "decision":
                return "Karar";
            case "constitution":
                return "Anayasa";
            default:
                return type;
        }
    };

    const getValidityStatusColor = (status?: string) => {
        switch (status) {
            case "yururlukte_ve_yayinda":
                return "bg-green-100 text-green-800";
            case "ilga_edilmis":
                return "bg-red-100 text-red-800";
            case "degisiklik_yapilmis":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getValidityStatusLabel = (status?: string) => {
        switch (status) {
            case "yururlukte_ve_yayinda":
                return "Yürürlükte";
            case "ilga_edilmis":
                return "İlga Edilmiş";
            case "degisiklik_yapilmis":
                return "Değişiklik Yapılmış";
            default:
                return status || "Bilinmiyor";
        }
    };

    if (!sourceId) return null;

    return (
        <Dialog open={!!sourceId} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center gap-3 text-lg">
                        {source && (() => {
                            const Icon = getSourceIcon(source.type);
                            return <Icon className="h-5 w-5"/>;
                        })()}
                        {isLoading ? "Kaynak yükleniyor..." : source?.title || "Kaynak Detayı"}
                    </DialogTitle>
                    <DialogClose className="absolute right-4 top-4">
                        <X className="h-4 w-4"/>
                    </DialogClose>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4"/>
                                <p className="text-red-600 mb-2">Kaynak yüklenirken hata oluştu</p>
                                <p className="text-sm text-muted-foreground">
                                    Kaynak bulunamadı veya erişim sorunu yaşandı.
                                </p>
                            </div>
                        </div>
                    )}

                    {source && (
                        <div className="space-y-6">
                            {/* Kaynak Bilgileri */}
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                    {(() => {
                                        const Icon = getSourceIcon(source.type);
                                        return <Icon className="h-3 w-3"/>;
                                    })()}
                                    {getSourceTypeLabel(source.type)}
                                </Badge>
                                
                                {source.law_article && (
                                    <Badge variant="outline">
                                        Madde {source.law_article}
                                    </Badge>
                                )}
                                
                                {source.validity_status && (
                                    <Badge className={getValidityStatusColor(source.validity_status)}>
                                        {getValidityStatusLabel(source.validity_status)}
                                    </Badge>
                                )}
                                
                                {source.court && (
                                    <Badge variant="outline">
                                        {source.court}
                                    </Badge>
                                )}
                            </div>

                            {/* Kaynak Metaları */}
                            {(source.law_type || source.decision_no || source.date) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                    {source.law_type && (
                                        <div>
                                            <span className="text-sm font-medium text-muted-foreground">Tür:</span>
                                            <p className="text-sm">{source.law_type}</p>
                                        </div>
                                    )}
                                    {source.decision_no && (
                                        <div>
                                            <span className="text-sm font-medium text-muted-foreground">Karar No:</span>
                                            <p className="text-sm">{source.decision_no}</p>
                                        </div>
                                    )}
                                    {source.date && (
                                        <div>
                                            <span className="text-sm font-medium text-muted-foreground">Tarih:</span>
                                            <p className="text-sm">{new Date(source.date).toLocaleDateString("tr-TR")}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">Kaynak:</span>
                                        <p className="text-sm capitalize">{source.metadata.source}</p>
                                    </div>
                                </div>
                            )}

                            {/* İçerik */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">İçerik</h3>
                                    {source.full_content && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopyContent}
                                            className="flex items-center gap-2"
                                        >
                                            {copied ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4"/>
                                                    Kopyalandı
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4"/>
                                                    Kopyala
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                                
                                {source.full_content ? (
                                    <div className="bg-muted/30 p-4 rounded-lg border">
                                        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                                            {source.full_content}
                                        </pre>
                                        
                                        {!isAuthenticated && source.full_content.length >= 500 && (
                                            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                                <p className="text-sm text-primary">
                                                    📋 Tam içeriği görüntülemek için kayıt olun veya giriş yapın.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                                        <p>İçerik bulunamadı</p>
                                    </div>
                                )}
                            </div>

                            {/* Kaynak Linki */}
                            {source.metadata.source === "official" && (
                                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <ExternalLink className="h-4 w-4 text-blue-600"/>
                                    <span className="text-sm text-blue-800">
                                        Bu kaynak resmi mevzuat sitesinden alınmıştır.
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 pt-4 border-t">
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Kapat
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
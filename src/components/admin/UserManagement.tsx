"use client";

import {useState, useMemo} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/Button";
import {Input} from "@/components/ui/Input";
import {adminApi} from "@/lib/api";
import {useTranslation} from "@/contexts/TranslationContext";
import {
    Users,
    Search,
    Shield,
    UserCheck,
    UserX,
    Crown,
    User,
} from "lucide-react";

export function UserManagement() {
    const {t} = useTranslation();
    const queryClient = useQueryClient();
    
    // State
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Constants
    const USERS_PER_PAGE = 10;

    // API calls
    const {data: usersData, isLoading, error} = useQuery({
        queryKey: ["adminUsers"],
        queryFn: () => adminApi.getAllUsers({skip: 0, limit: 100}),
        retry: false,
        refetchOnWindowFocus: false,
    });

    const roleUpdateMutation = useMutation({
        mutationFn: ({userId, role}: {userId: string; role: "free" | "premium" | "admin"}) =>
            adminApi.updateUserRole(userId, role),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["adminUsers"]}),
    });

    const statusUpdateMutation = useMutation({
        mutationFn: ({userId, isActive}: {userId: string; isActive: boolean}) =>
            adminApi.updateUserStatus(userId, isActive),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["adminUsers"]}),
    });

    // Data processing
    const allUsers = useMemo(() => 
        Array.isArray(usersData?.data) ? usersData.data : [], 
        [usersData?.data]
    );

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return allUsers;
        const searchLower = searchTerm.toLowerCase();
        return allUsers.filter(user =>
            user.full_name.toLowerCase().includes(searchLower) ||
            user.username.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        );
    }, [allUsers, searchTerm]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    // Event handlers
    const handleRoleChange = (userId: string, currentRole: "free" | "premium" | "admin") => {
        const roleOrder: Array<"free" | "premium" | "admin"> = ["free", "premium", "admin"];
        const currentIndex = roleOrder.indexOf(currentRole);
        const nextRole = roleOrder[(currentIndex + 1) % roleOrder.length];
        roleUpdateMutation.mutate({userId, role: nextRole});
    };

    const handleStatusToggle = (userId: string, currentStatus: boolean) => {
        statusUpdateMutation.mutate({userId, isActive: !currentStatus});
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Utilities
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getRoleButtonText = (role: "free" | "premium" | "admin") => {
        switch (role) {
            case "admin": return t("admin.make_free");
            case "premium": return t("admin.make_admin");
            case "free": return t("admin.make_premium");
            default: return "";
        }
    };

    const getRoleIcon = (role: "free" | "premium" | "admin") => {
        switch (role) {
            case "admin": return User;
            case "premium": return Shield;
            case "free": return Crown;
            default: return User;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5"/>
                        {t("admin.user_management_title")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({length: 5}).map((_, i) => (
                            <div key={i} className="animate-pulse border rounded-lg p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full"/>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"/>
                                        <div className="h-3 bg-gray-200 rounded w-24"/>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-8 w-16 bg-gray-200 rounded"/>
                                        <div className="h-8 w-16 bg-gray-200 rounded"/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5"/>
                        {t("admin.user_management_title")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground"/>
                        <p className="text-red-600 mb-2">{t("admin.user_management_unavailable")}</p>
                        <p className="text-sm text-muted-foreground">
                            {t("admin.user_management_coming_soon")}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Main render
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5"/>
                    {t("admin.user_management_title")}
                </CardTitle>
                
                <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder={t("admin.search_users")}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {paginatedUsers.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground"/>
                            <p className="text-muted-foreground">
                                {searchTerm ? t("admin.no_users_found") : t("admin.no_users_yet")}
                            </p>
                        </div>
                    ) : (
                        paginatedUsers.map((user) => {
                            const RoleIcon = getRoleIcon(user.role);
                            return (
                                <div 
                                    key={user.id}
                                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg hover:bg-zinc-950 transition-colors"
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                                            {user.full_name.charAt(0).toUpperCase()}
                                        </div>
                                        
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium">{user.full_name}</p>
                                                {user.role === "admin" && (
                                                    <Crown className="h-4 w-4 text-yellow-500" title="Admin"/>
                                                )}
                                                {!user.is_active && (
                                                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                                                        {t("admin.inactive")}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                                <span className="break-all">@{user.username}</span>
                                                <span className="break-all">{user.email}</span>
                                                <span className="whitespace-nowrap">
                                                    {user.daily_query_limit === -1 
                                                        ? t("admin.unlimited") 
                                                        : `${user.daily_query_limit} ${t("admin.daily_limit")}`
                                                    } / {user.monthly_query_limit === -1 
                                                        ? t("admin.unlimited") 
                                                        : `${user.monthly_query_limit} ${t("admin.monthly_limit")}`
                                                    }
                                                </span>
                                                <span className="whitespace-nowrap">{t("admin.membership")}: {formatDate(user.created_at)}</span>
                                                {user.last_login && (
                                                    <span className="whitespace-nowrap">{t("admin.last_login")}: {formatDate(user.last_login)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRoleChange(user.id, user.role)}
                                            disabled={roleUpdateMutation.isPending}
                                            className="flex items-center gap-1"
                                        >
                                            <RoleIcon className="h-3 w-3"/>
                                            {getRoleButtonText(user.role)}
                                        </Button>

                                        <Button
                                            variant={user.is_active ? "destructive" : "default"}
                                            size="sm"
                                            onClick={() => handleStatusToggle(user.id, user.is_active)}
                                            disabled={statusUpdateMutation.isPending}
                                            className="flex items-center gap-1"
                                        >
                                            {user.is_active ? (
                                                <>
                                                    <UserX className="h-3 w-3"/>
                                                    {t("admin.deactivate")}
                                                </>
                                            ) : (
                                                <>
                                                    <UserCheck className="h-3 w-3"/>
                                                    {t("admin.activate")}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            {t("admin.total_users_display").replace("{count}", filteredUsers.length.toString())}
                        </p>
                        
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    {t("history.previous")}
                                </Button>
                                
                                <span className="px-3 py-2 text-sm">
                                    {currentPage} / {totalPages}
                                </span>
                                
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    {t("history.next")}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
"use client"
import { SignatureSection } from "@/components/packages/SignatureSection";
import { useFetchTask } from "@/hooks/useFetchTask";
import { useParams } from "next/navigation";
import LoadingComponent from "@/components/user/LoadingComponent";
import { Task } from "@/types/types";
import { checkLinkUsed } from "@/app/actions/links/checkLinkUsed";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignaturelinkPage() {
    const params = useParams();
    const taskId = Array.isArray(params.id) ? params.id[0] : params.id;
    const { task, isLoading, error, isError, refetch } = useFetchTask(taskId, !!taskId);
    const [isLinkUsed, setIsLinkUsed] = useState<boolean >(false);
    const [isCheckingLink, setIsCheckingLink] = useState(true);

    // Check if link is used
    useEffect(() => {
        const checkLink = async () => {
            if (!taskId) {
                setIsCheckingLink(false);
                return;
            }
            
            try {
                const result = await checkLinkUsed(taskId);
                if (result.error) {
                    setIsLinkUsed(false);
                } else if (result.isUsed) {
                    setIsLinkUsed(true);
                } else {
                    setIsLinkUsed(false);
                }
            } catch (error) {
                console.error('Error checking link:', error);
                setIsLinkUsed(false);
            } finally {
                setIsCheckingLink(false);
            }
        };

        checkLink();
    }, [taskId]);

    const [justSaved, setJustSaved] = useState(false);

    const handleSignatureSaved = () => {
        // Refetch task data after signature is saved
        refetch();
        // Mark that signature was just saved in this session
        setJustSaved(true);
        // Don't update isLinkUsed here - let it be checked on next page load
    };

    if (!taskId) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center" dir="rtl">
                <div className="text-center">
                    <p className="text-red-600 text-lg">מזהה משימה לא נמצא</p>
                </div>
            </div>
        );
    }

    if (isLoading || isCheckingLink) {
        return <LoadingComponent message="טוען פרטי משימה..." />;
    }

    if (isError || error || !task) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center" dir="rtl">
                <div className="text-center">
                    <p className="text-red-600 text-lg">שגיאה בטעינת המשימה</p>
                </div>
            </div>
        );
    }

    const typedTask = task as Task;

    // Only show "link already used" message if:
    // 1. Link is marked as used AND
    // 2. Task already has a signature AND
    // 3. Signature was NOT just saved in this session
    // This prevents showing the message when user signs for the first time
    const shouldBlockAccess = isLinkUsed === true && typedTask.url && !justSaved;
    
    if (shouldBlockAccess) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center" dir="rtl">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <svg className="w-16 h-16 mx-auto text-yellow-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">הקישור כבר שימש</h2>
                        <p className="text-gray-700">קישור זה כבר שימש לחתימה על המשימה ולא ניתן להשתמש בו שוב.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">


                {/* Task Details */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6"> פרטי העסקה</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">כתובת</label>
                                <p className="text-lg text-gray-900">{typedTask.address}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                                <p className="text-lg text-gray-900">{typedTask.description}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">עיר</label>
                                <p className="text-lg text-gray-900">{typedTask.city}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">עד תאריך</label>
                                <p className="text-lg text-gray-900">
                                    {typedTask.date ? new Date(typedTask.date).toLocaleDateString('he-IL') : 'לא צוין'}
                                </p>
                            </div>

                            {typedTask.supplier && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">שם ספק</label>
                                        <p className="text-lg text-gray-900">
                                            {typedTask.supplier.firstName} {typedTask.supplier.lastName}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                                        <p className="text-lg text-gray-900">{typedTask.supplier.phone || 'לא זמין'}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Signature Section */}
                <SignatureSection task={typedTask} onSignatureSaved={handleSignatureSaved} />

                <ToastContainer
                    position="top-left"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={true}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        </div>
    );
}
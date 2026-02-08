'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save,
    Share2,
    ExternalLink,
    Check,
    Copy,
    Loader2,
    LogOut,
    X
} from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { updateProjectData, publishProject } from '../lib/projects';
import { clearEditSession } from '../lib/auth';

export default function EditorControls() {
    const {
        isEditing,
        isDirty,
        templateData,
        project,
        setProject,
        setIsDirty,
        setIsEditing,
        reset
    } = useEditorStore();

    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPublished, setIsPublished] = useState(false);

    const handleSave = useCallback(async () => {
        if (!project || !isDirty) return;

        console.log('[EditorControls] Saving project:', project.id);

        setIsSaving(true);
        setError(null);

        try {
            const updatedProject = await updateProjectData(project, templateData);
            setProject(updatedProject);
            console.log('[EditorControls] Save successful');
            setIsDirty(false);
        } catch (err) {
            console.error('[EditorControls] Save error:', err);
            if (err instanceof Error && err.message === 'Editing period expired') {
                setError('Editing period has expired');
            } else {
                setError('Failed to save changes');
            }
        } finally {
            setIsSaving(false);
        }
    }, [project, isDirty, templateData, setIsDirty, setProject]);

    const handlePublish = useCallback(async () => {
        if (!project) return;

        console.log('[EditorControls] Publishing project:', project.id);

        setIsPublishing(true);
        setError(null);

        try {
            // Save first if dirty
            if (isDirty) {
                console.log('[EditorControls] Saving before publish...');
                const savedProject = await updateProjectData(project, templateData);
                setProject(savedProject);
                setIsDirty(false);
            }

            const result = await publishProject(project.id);
            console.log('[EditorControls] Publish successful:', result.slug);
            setProject(result);
            setIsPublished(true);
            setShowShareModal(true);
        } catch (err) {
            console.error('[EditorControls] Publish error:', err);
            setError('Failed to publish project');
        } finally {
            setIsPublishing(false);
        }
    }, [project, isDirty, templateData, setIsDirty, setProject]);

    const handleCopyLink = useCallback(() => {
        if (!project) return;
        const shareUrl = `${window.location.origin}/v/teddy/${project.slug}`;
        navigator.clipboard.writeText(shareUrl);
        console.log('[EditorControls] Link copied:', shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [project]);

    const handleLogout = useCallback(() => {
        console.log('[EditorControls] Logging out');
        clearEditSession();
        setIsEditing(false);
        reset();
        window.location.reload();
    }, [setIsEditing, reset]);

    const shareUrl = project && typeof window !== 'undefined'
        ? `${window.location.origin}/v/teddy/${project.slug}`
        : '';

    if (!isEditing || !project) return null;

    return (
        <>
            {/* Floating Controls */}
            <motion.div
                className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                {/* Error Toast */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm shadow-lg flex items-center gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            {error}
                            <button onClick={() => setError(null)} className="hover:text-red-800">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Logout Button */}
                <motion.button
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full bg-white/80 text-teddy-brown-primary shadow-lg hover:bg-white transition-all text-sm sm:text-base"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium">Exit Edit</span>
                </motion.button>

                {/* Save Button */}
                <motion.button
                    className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-lg transition-all relative ${isDirty
                        ? 'bg-teddy-brown-primary text-white hover:bg-teddy-brown-deep animate-pulse'
                        : 'bg-white/80 text-teddy-brown-primary hover:bg-white'
                        } text-sm sm:text-base`}
                    onClick={handleSave}
                    disabled={isSaving || !isDirty}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    <span className="font-medium">
                        {isSaving ? 'Saving...' : isDirty ? '💾 Save Changes' : 'Saved'}
                    </span>
                    
                    {/* Pulsing indicator for unsaved changes */}
                    {isDirty && !isSaving && (
                        <motion.div
                            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    )}
                </motion.button>

                {/* Publish Button */}
                <motion.button
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full bg-blush-primary text-white shadow-lg hover:bg-heart-soft transition-all text-sm sm:text-base relative"
                    onClick={handlePublish}
                    disabled={isPublishing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isPublishing ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    <span className="font-medium">
                        {isPublishing ? 'Publishing...' : '🚀 Publish & Share'}
                    </span>
                    
                    {/* Sparkle effect when ready to publish */}
                    {!isDirty && !isPublishing && (
                        <motion.div
                            className="absolute -top-1 -right-1 text-yellow-300 text-sm"
                            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ✨
                        </motion.div>
                    )}
                </motion.button>
            </motion.div>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowShareModal(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            className="relative z-10 card-paper p-6 sm:p-8 max-w-lg w-full"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            {/* Close Button */}
                            <button
                                className="absolute top-3 right-3 p-1.5 sm:p-2 hover:bg-cream-soft rounded-full transition-colors"
                                onClick={() => setShowShareModal(false)}
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5 text-teddy-brown-primary" />
                            </button>

                            {/* Content */}
                            <div className="text-center">
                                <motion.div
                                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                >
                                    <Check className="w-10 h-10 text-green-600" />
                                </motion.div>

                                <h2 className="text-2xl font-serif text-teddy-brown-deep mb-2">
                                    Your Teddy is Ready! 🧸
                                </h2>
                                <p className="text-teddy-brown-primary/70 mb-6">
                                    Share this special surprise with your loved one
                                </p>

                                {/* Big Copy Link Button */}
                                <motion.button
                                    onClick={handleCopyLink}
                                    className="w-full p-4 bg-gradient-to-r from-blush-primary to-peach-warm text-white rounded-xl shadow-lg mb-4 flex items-center justify-center gap-3 text-lg font-medium"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-6 h-6" />
                                            <span>Link Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-6 h-6" />
                                            <span>Copy Share Link</span>
                                        </>
                                    )}
                                </motion.button>

                                {/* Share Link Display */}
                                <div className="flex items-center gap-2 p-3 bg-cream-soft rounded-lg mb-4 text-left">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className="flex-1 bg-transparent text-sm text-teddy-brown-deep outline-none font-mono"
                                    />
                                </div>

                                {/* Quick Share Actions */}
                                <div className="flex gap-3 justify-center mb-4">
                                    {/* WhatsApp */}
                                    <motion.a
                                        href={`https://wa.me/?text=${encodeURIComponent(`I made this for you! 🧸💕 ${shareUrl}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Share on WhatsApp"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    </motion.a>

                                    {/* Instagram (copy for stories) */}
                                    <motion.button
                                        onClick={handleCopyLink}
                                        className="p-3 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white rounded-full shadow-lg"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Copy for Instagram"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                        </svg>
                                    </motion.button>

                                    {/* Open Link */}
                                    <motion.a
                                        href={`/v/teddy/${project.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-teddy-brown-primary text-white rounded-full shadow-lg hover:bg-teddy-brown-deep"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Preview"
                                    >
                                        <ExternalLink className="w-6 h-6" />
                                    </motion.a>
                                </div>

                                <p className="text-xs text-teddy-brown-soft">
                                    Send this link to your special someone 💕
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

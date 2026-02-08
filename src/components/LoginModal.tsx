'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, KeyRound, Mail, AlertCircle } from 'lucide-react';
import { verifyAndGetProject } from '../lib/projects';
import { setEditSession } from '../lib/auth';
import { useEditorStore } from '../store/editorStore';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [templateCode, setTemplateCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setTemplateData, setProject, setIsEditing } = useEditorStore();

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !templateCode) {
            setError('Please enter both email and template code');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('[LoginModal] Attempting login for:', email, 'with code:', templateCode);
            const project = await verifyAndGetProject(email, templateCode);

            if (!project) {
                setError('Invalid email or template code. Please check and try again.');
                setIsLoading(false);
                return;
            }

            console.log('[LoginModal] Project found:', project.id);

            // Check if editing is still allowed (current time < editable_until)
            const now = new Date();
            const editableUntil = new Date(project.editable_until);
            if (now >= editableUntil) {
                console.log('[LoginModal] Editing period expired:', editableUntil);
                setError('Your editing period has expired. Please contact support.');
                setIsLoading(false);
                return;
            }

            // Success! Set up edit session
            setEditSession(project, email);
            setTemplateData(project.data);
            setProject(project);
            setIsEditing(true);

            console.log('[LoginModal] Login successful, entering edit mode');
            onSuccess();
            onClose();
        } catch (err) {
            console.error('[LoginModal] Error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [email, templateCode, setTemplateData, setProject, setIsEditing, onSuccess, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />

                {/* Modal */}
                <motion.div
                    className="relative z-10 card-paper p-6 sm:p-8 max-w-md w-full"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 p-2 hover:bg-cream-soft rounded-full transition-colors"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5 text-teddy-brown-primary" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-teddy-brown-soft to-peach-warm flex items-center justify-center shadow-lg">
                            <KeyRound className="w-7 h-7 text-teddy-brown-deep" />
                        </div>
                        <h2 className="text-xl font-serif text-teddy-brown-deep mb-2">
                            Edit Your Teddy
                        </h2>
                        <p className="text-sm text-teddy-brown-primary/70">
                            Enter your credentials to customize
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-teddy-brown-deep mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-teddy-brown-soft" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-teddy-brown-soft/30 bg-white/50 focus:bg-white focus:border-teddy-brown-primary focus:ring-2 focus:ring-teddy-brown-primary/20 outline-none transition-all text-teddy-brown-deep placeholder-teddy-brown-soft/50"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Template Code */}
                        <div>
                            <label className="block text-sm font-medium text-teddy-brown-deep mb-1.5">
                                Template Code
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <KeyRound className="w-5 h-5 text-teddy-brown-soft" />
                                </div>
                                <input
                                    type="text"
                                    value={templateCode}
                                    onChange={(e) => setTemplateCode(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-teddy-brown-soft/30 bg-white/50 focus:bg-white focus:border-teddy-brown-primary focus:ring-2 focus:ring-teddy-brown-primary/20 outline-none transition-all text-teddy-brown-deep placeholder-teddy-brown-soft/50 font-mono"
                                    placeholder="Enter your code"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            className="w-full btn-heart flex items-center justify-center gap-2 mt-6"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <span>Access Editor</span>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-teddy-brown-soft">
                        Check your purchase email for the template code
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

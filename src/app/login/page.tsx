'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Mail, ArrowRight, Loader2, AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { verifyAndGetProject } from '../../lib/projects';
import { setEditSession } from '../../lib/auth';
import { useEditorStore } from '../../store/editorStore';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [templateCode, setTemplateCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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
            const project = await verifyAndGetProject(email, templateCode);

            if (!project) {
                setError('Invalid email or template code. Please check and try again.');
                setIsLoading(false);
                return;
            }

            // Check if editing is still allowed
            const now = new Date();
            const editableUntil = new Date(project.editable_until);
            if (now >= editableUntil) {
                setError('Your editing period has expired. Please contact support.');
                setIsLoading(false);
                return;
            }

            // Success! Set up edit session and store state
            setEditSession(project, email);
            setTemplateData(project.data);
            setProject(project);
            setIsEditing(true);
            setSuccess(true);

            // Redirect to home page
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [email, templateCode, setTemplateData, setProject, setIsEditing]);

    return (
        <div className="min-h-screen gradient-teddy texture-grain vignette flex items-center justify-center p-4">
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="card-paper p-8 sm:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-teddy-brown-soft to-peach-warm flex items-center justify-center shadow-lg"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <KeyRound className="w-8 h-8 text-teddy-brown-deep" />
                        </motion.div>
                        <h1 className="text-2xl font-serif text-teddy-brown-deep mb-2">
                            Edit Your Teddy Surprise
                        </h1>
                        <p className="text-teddy-brown-primary/70 text-sm">
                            Enter your credentials to customize
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Input */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-teddy-brown-deep mb-2"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-teddy-brown-soft" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-teddy-brown-soft/30 bg-white/50 focus:bg-white focus:border-teddy-brown-primary focus:ring-2 focus:ring-teddy-brown-primary/20 outline-none transition-all text-teddy-brown-deep placeholder-teddy-brown-soft/50"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Template Code Input */}
                            <div>
                                <label
                                    htmlFor="templateCode"
                                    className="block text-sm font-medium text-teddy-brown-deep mb-2"
                                >
                                    Template Code
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <KeyRound className="w-5 h-5 text-teddy-brown-soft" />
                                    </div>
                                    <input
                                        type="text"
                                        id="templateCode"
                                        value={templateCode}
                                        onChange={(e) => setTemplateCode(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-teddy-brown-soft/30 bg-white/50 focus:bg-white focus:border-teddy-brown-primary focus:ring-2 focus:ring-teddy-brown-primary/20 outline-none transition-all text-teddy-brown-deep placeholder-teddy-brown-soft/50 font-mono"
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
                                className="w-full btn-heart flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Access Editor</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    ) : (
                        /* Success State */
                        <motion.div
                            className="text-center py-8"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <motion.div
                                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                            >
                                <KeyRound className="w-10 h-10 text-green-600" />
                            </motion.div>
                            <h2 className="text-xl font-serif text-teddy-brown-deep mb-2">
                                Access Granted!
                            </h2>
                            <p className="text-teddy-brown-primary/70 text-sm mb-4">
                                Redirecting to your teddy editor...
                            </p>
                            <div className="w-8 h-8 mx-auto border-2 border-teddy-brown-primary border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-teddy-brown-soft/20 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-teddy-brown-primary hover:text-teddy-brown-deep transition-colors text-sm"
                        >
                            <Home className="w-4 h-4" />
                            <span>Back to Preview</span>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

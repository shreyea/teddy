'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { defaultTemplateData } from '../data/templateData';
import Lottie from 'lottie-react';

// Simple confetti animation data
const confettiAnimation = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    layers: []
};

export default function HugTheTeddy() {
    const { templateData: storeData, hugCount, isEditing, updateField } = useEditorStore();
    const templateData = storeData ?? defaultTemplateData;
    const hugsRequired = templateData.hugInteraction.hugsRequired;
    const isComplete = hugCount >= hugsRequired;

    const handleFinalMessageEdit = (newMessage: string) => {
        updateField('hugInteraction', {
            ...templateData.hugInteraction,
            finalMessage: newMessage,
        });
    };

    const handlePromptTextEdit = (newText: string) => {
        updateField('hugInteraction', {
            ...templateData.hugInteraction,
            promptText: newText,
        });
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Prompt Text */}
            <AnimatePresence mode="wait">
                {!isComplete ? (
                    isEditing ? (
                        <motion.div
                            key="prompt-edit"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <input
                                type="text"
                                value={templateData.hugInteraction.promptText}
                                onChange={(e) => handlePromptTextEdit(e.target.value)}
                                className="text-lg text-teddy-brown-deep/80 font-serif italic text-center bg-white/50 backdrop-blur-sm border-2 border-dashed border-teddy-brown-soft rounded-lg px-4 py-2 focus:border-teddy-brown-primary outline-none"
                            />
                        </motion.div>
                    ) : (
                        <motion.p
                            key="prompt"
                            className="text-lg text-teddy-brown-deep/80 font-serif italic text-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                        >
                            {templateData.hugInteraction.promptText}
                        </motion.p>
                    )
                ) : (
                    <motion.div
                        key="complete"
                        className="text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        {/* Celebration */}
                        <motion.div
                            className="mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                        >
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blush-primary to-heart-soft rounded-full flex items-center justify-center shadow-lg animate-glow-pulse">
                                <Heart className="w-8 h-8 text-white fill-white animate-heartbeat" />
                            </div>
                        </motion.div>

                        {/* Final Message */}
                        {isEditing ? (
                            <textarea
                                value={templateData.hugInteraction.finalMessage}
                                onChange={(e) => handleFinalMessageEdit(e.target.value)}
                                className="w-full max-w-md text-xl font-serif text-teddy-brown-deep text-center bg-white/50 backdrop-blur-sm border-2 border-dashed border-teddy-brown-soft rounded-lg p-4 focus:border-teddy-brown-primary outline-none resize-none"
                                rows={2}
                            />
                        ) : (
                            <motion.p
                                className="text-xl sm:text-2xl font-serif text-teddy-brown-deep italic max-w-md px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                &ldquo;{templateData.hugInteraction.finalMessage}&rdquo;
                            </motion.p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Heart Meter */}
            <motion.div
                className="heart-meter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {[...Array(hugsRequired)].map((_, index) => (
                    <motion.div
                        key={index}
                        className={`heart-meter-item ${index < hugCount ? 'filled' : ''}`}
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{
                            scale: index < hugCount ? [1, 1.3, 1] : 1,
                            opacity: 1,
                        }}
                        transition={{
                            scale: { duration: 0.4, ease: 'easeOut' },
                        }}
                    >
                        <Heart
                            className={`w-full h-full transition-all duration-300 ${index < hugCount
                                ? 'text-heart-red fill-heart-red drop-shadow-lg'
                                : 'text-teddy-brown-soft/40'
                                }`}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Progress Text */}
            <motion.p
                className="text-sm text-teddy-brown-primary/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {isComplete
                    ? '✨ Perfect! You filled the meter with love ✨'
                    : `${hugCount} of ${hugsRequired} hugs`
                }
            </motion.p>

            {/* Sparkle celebration (placeholder - would use actual Lottie file) */}
            {isComplete && (
                <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {/* Simple CSS sparkles as fallback */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                                left: `${10 + Math.random() * 80}%`,
                                top: `${10 + Math.random() * 80}%`,
                                background: ['#F8B4B4', '#FECACA', '#D4A574', '#EF4444'][i % 4],
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: [0, 1.5, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.1,
                                repeat: Infinity,
                                repeatDelay: 2,
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}

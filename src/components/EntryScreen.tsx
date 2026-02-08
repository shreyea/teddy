'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import Image from 'next/image';
import { useEditorStore } from '../store/editorStore';
import FloatingParticles from './FloatingParticles';
import { defaultTemplateData } from '../data/templateData';

interface EntryScreenProps {
    onRequestLogin?: () => void;
}

export default function EntryScreen({ onRequestLogin }: EntryScreenProps) {
    const { templateData: storeData, setCurrentScene, isEditing, updateField } = useEditorStore();
    const templateData = storeData ?? defaultTemplateData;
    const [noClickCount, setNoClickCount] = useState(0);
    const [convinceMessage, setConvinceMessage] = useState('');

    const convinceMessages = [
        "Are you sure? 🥺",
        "Pretty please? 💕",
        "The teddy is waiting! 🧸",
        "Just one click? 🤍",
        "You'll love it! ✨",
    ];

    const handleYesClick = useCallback(() => {
        // If the user is not logged in, request login first
        if (!isEditing && onRequestLogin) {
            onRequestLogin();
            return;
        }
        setCurrentScene('reveal');
    }, [setCurrentScene, isEditing, onRequestLogin]);

    const handleNoClick = useCallback(() => {
        if (noClickCount >= convinceMessages.length - 1) {
            // After too many no clicks, just proceed anyway
            setCurrentScene('reveal');
        } else {
            setConvinceMessage(convinceMessages[noClickCount]);
            setNoClickCount(prev => prev + 1);
        }
    }, [noClickCount, setCurrentScene]);

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/bg.jpg')`,
                }}
            />
            {/* Soft overlay for readability - slightly darker */}
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-amber-50/20" />
            {/* Floating Particles */}
            <FloatingParticles />

            {/* Vignette effect */}
            <div className="absolute inset-0 vignette pointer-events-none" />

            {/* Left Side - comic.jpg with glow effect */}
            <motion.div
                className="absolute left-0 top-0 h-full w-1/3 sm:w-1/4 z-0"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="relative h-full w-full flex items-center justify-center p-4">
                    <motion.div
                        className="relative w-full h-[70%] rounded-2xl overflow-hidden shadow-2xl"
                        animate={{
                            y: [0, -10, 0],
                            rotate: [-2, 2, -2]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        style={{
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        <Image
                            src="/comic.png"
                            alt="Cute Comic"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </div>
                {/* Fade to center */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#fce4ec]/90 pointer-events-none" />
            </motion.div>

            {/* Right Side - love.png with glow effect */}
            <motion.div
                className="absolute right-0 top-0 h-full w-1/3 sm:w-1/4 z-0"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="relative h-full w-full flex items-center justify-center p-4">
                    <motion.div
                        className="relative w-full h-[70%] rounded-2xl overflow-hidden shadow-2xl"
                        animate={{
                            y: [0, -10, 0],
                            rotate: [2, -2, 2]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        style={{
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        <Image
                            src="/love.png"
                            alt="Love"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </div>
                {/* Fade to center */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/70 pointer-events-none" />
            </motion.div>

            {/* Decorative sparkles */}
            <motion.div
                className="absolute top-10 left-10 text-3xl sm:text-4xl z-20"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                ✨
            </motion.div>
            <motion.div
                className="absolute top-20 right-20 text-2xl sm:text-3xl z-20"
                animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >
                💕
            </motion.div>
            <motion.div
                className="absolute bottom-20 left-20 text-2xl sm:text-3xl z-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
            >
                🧸
            </motion.div>
            <motion.div
                className="absolute bottom-10 right-10 text-3xl sm:text-4xl z-20"
                animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 0.7 }}
            >
                ✨
            </motion.div>

            {/* Poster Card - Premium look */}
            <motion.div
                className="relative z-10 w-full max-w-sm sm:max-w-md"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 50 }}
                transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 100 }}
            >
                {/* Card shadow */}
                <div
                    className="absolute -inset-2 rounded-3xl opacity-20 blur-lg bg-black"
                />

                {/* Poster Image Container */}
                <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                        boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 40px rgba(255, 182, 193, 0.3)',
                    }}
                >
                    {/* The Poster Image */}
                    <div className="relative w-full aspect-[3/4]">
                        <Image
                            src="/first.jpg"
                            alt="Teddy Day Surprise"
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Darker Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center p-6 sm:p-8">
                            {/* Top Decoration */}
                            <motion.div
                                className="flex items-center gap-3 mt-4"
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                            >
                                <span className="text-2xl">✨</span>
                                <div
                                    className="px-5 py-2 rounded-full backdrop-blur-md border border-white/40"
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        boxShadow: '0 4px 20px rgba(255, 182, 193, 0.3)',
                                    }}
                                >
                                    <span className="text-white text-sm font-semibold tracking-wider">
                                        🧸 Teddy Day 🧸
                                    </span>
                                </div>
                                <span className="text-2xl">✨</span>
                            </motion.div>

                            {/* Main Content */}
                            <div className="flex-1 flex flex-col items-center justify-center -mt-8">
                                <motion.div
                                    className="flex gap-2 mb-4"
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <span className="text-4xl">💕</span>
                                </motion.div>

                                {/* Question Text */}
                                {isEditing ? (
                                    <textarea
                                        value={templateData.entry.question}
                                        onChange={(e) =>
                                            updateField('entry', {
                                                ...templateData.entry,
                                                question: e.target.value,
                                            })
                                        }
                                        className="w-full bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-2xl px-5 py-4 text-white text-center text-xl sm:text-2xl resize-none outline-none focus:border-white/60 transition-colors shadow-lg"
                                        style={{ fontFamily: "'Dancing Script', cursive" }}
                                        rows={2}
                                    />
                                ) : (
                                    <motion.div
                                        className="text-center px-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <h2
                                            className="text-2xl sm:text-3xl md:text-4xl text-white leading-relaxed"
                                            style={{
                                                fontFamily: "'Dancing Script', cursive",
                                                textShadow: '2px 2px 10px rgba(0,0,0,0.6), 0 0 30px rgba(255,182,193,0.5)'
                                            }}
                                        >
                                            {templateData.entry.question}
                                        </h2>
                                    </motion.div>
                                )}

                                <motion.div
                                    className="mt-4 text-white/90 text-xl"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    ~ 🤍 ~
                                </motion.div>
                            </div>

                            {/* Buttons */}
                            <div className="w-full space-y-3 mb-2">
                                <motion.div
                                    className="flex flex-col items-center gap-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    {/* Convince message */}
                                    {convinceMessage && (
                                        <motion.div
                                            className="text-white text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            key={convinceMessage}
                                        >
                                            {convinceMessage}
                                        </motion.div>
                                    )}

                                    {/* Yes Button - Centered */}
                                    <motion.button
                                        onClick={handleYesClick}
                                        className="py-3 px-8 rounded-full font-semibold flex items-center justify-center gap-2 text-sm"
                                        style={{
                                            background: 'linear-gradient(135deg, #fff 0%, #ffe4ec 100%)',
                                            boxShadow: '0 6px 20px rgba(255, 105, 180, 0.3), inset 0 2px 0 rgba(255,255,255,0.5)',
                                            color: '#8b4557',
                                        }}
                                        whileHover={{
                                            scale: 1.05,
                                            boxShadow: '0 12px 40px rgba(255, 105, 180, 0.5)'
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        animate={noClickCount > 0 ? { scale: [1, 1.1, 1] } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={templateData.entry.yesButtonText}
                                                onChange={(e) => updateField('entry', { ...templateData.entry, yesButtonText: e.target.value })}
                                                className="bg-transparent border-none outline-none text-center w-24"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        ) : (
                                            <span>{templateData.entry.yesButtonText}</span>
                                        )}
                                    </motion.button>

                                    {/* No Button - Minimal */}
                                    <motion.button
                                        onClick={handleNoClick}
                                        className="py-1 text-white/50 text-xs hover:text-white/70 transition-colors flex items-center justify-center gap-1"
                                        whileTap={{ scale: 0.98 }}
                                        animate={noClickCount > 0 ? { opacity: 0.3, scale: 0.9 } : {}}
                                    >
                                        <X className="w-3 h-3" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={templateData.entry.noButtonText}
                                                onChange={(e) => updateField('entry', { ...templateData.entry, noButtonText: e.target.value })}
                                                className="bg-transparent border-none outline-none text-center w-16 text-white/50"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        ) : (
                                            <span>{noClickCount > 0 ? "Fine..." : templateData.entry.noButtonText}</span>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative tape corners */}
                    <div className="tape -top-2 -left-2 rotate-[-30deg]" />
                    <div className="tape -top-2 -right-2 rotate-[30deg]" />
                </div>
            </motion.div>

            {/* Top Right Decoration - REM */}
            <motion.div
                className="absolute top-4 right-4 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none z-30"
                initial={{ opacity: 0, rotate: 20, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ delay: 1, duration: 0.8, type: 'spring' }}
            >
                <Image
                    src="/rem.png"
                    alt="Rem"
                    fill
                    className="object-contain"
                />
            </motion.div>
        </motion.div>
    );
}

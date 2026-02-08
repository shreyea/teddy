'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEditorStore } from '../store/editorStore';
import { defaultTemplateData } from '../data/templateData';

// Default teddy placeholder SVG
const DEFAULT_TEDDY = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" fill="none">
  <!-- Body -->
  <ellipse cx="100" cy="140" rx="60" ry="70" fill="#D4A574"/>
  <ellipse cx="100" cy="140" rx="55" ry="65" fill="#E6C9A8"/>
  
  <!-- Belly -->
  <ellipse cx="100" cy="150" rx="35" ry="40" fill="#F5E6D3"/>
  
  <!-- Head -->
  <circle cx="100" cy="60" r="50" fill="#D4A574"/>
  <circle cx="100" cy="60" r="45" fill="#E6C9A8"/>
  
  <!-- Ears -->
  <circle cx="55" cy="25" r="18" fill="#D4A574"/>
  <circle cx="55" cy="25" r="12" fill="#F8B4B4"/>
  <circle cx="145" cy="25" r="18" fill="#D4A574"/>
  <circle cx="145" cy="25" r="12" fill="#F8B4B4"/>
  
  <!-- Muzzle -->
  <ellipse cx="100" cy="75" rx="20" ry="15" fill="#F5E6D3"/>
  
  <!-- Nose -->
  <ellipse cx="100" cy="70" rx="8" ry="6" fill="#8B4513"/>
  
  <!-- Eyes -->
  <circle cx="80" cy="55" r="8" fill="#2D1810"/>
  <circle cx="120" cy="55" r="8" fill="#2D1810"/>
  <circle cx="82" cy="53" r="3" fill="white"/>
  <circle cx="122" cy="53" r="3" fill="white"/>
  
  <!-- Smile -->
  <path d="M90 82 Q100 90 110 82" stroke="#8B4513" stroke-width="2" fill="none" stroke-linecap="round"/>
  
  <!-- Arms -->
  <ellipse cx="45" cy="130" rx="15" ry="25" fill="#D4A574" transform="rotate(-20 45 130)"/>
  <ellipse cx="155" cy="130" rx="15" ry="25" fill="#D4A574" transform="rotate(20 155 130)"/>
  
  <!-- Legs -->
  <ellipse cx="70" cy="200" rx="20" ry="15" fill="#D4A574"/>
  <ellipse cx="130" cy="200" rx="20" ry="15" fill="#D4A574"/>
  
  <!-- Heart on belly -->
  <path d="M100 145 C95 138 85 138 85 148 C85 155 100 165 100 165 C100 165 115 155 115 148 C115 138 105 138 100 145" fill="#F8B4B4"/>
</svg>
`)}`;

export default function TeddyCenterpiece() {
    const { templateData: storeData, isEditing, incrementHugCount, hugCount } = useEditorStore();
    const templateData = storeData ?? defaultTemplateData;
    const [isSquishing, setIsSquishing] = useState(false);
    const [showBigHearts, setShowBigHearts] = useState(false);
    const isComplete = hugCount >= templateData.hugInteraction.hugsRequired;

    const handleTeddyClick = useCallback(() => {
        // Always show hearts animation on every click
        setIsSquishing(true);
        setShowBigHearts(true);

        // Only increment hug count if not complete
        if (!isComplete) {
            incrementHugCount();
        }

        setTimeout(() => {
            setIsSquishing(false);
        }, 400);

        // Keep big hearts visible for 3 seconds
        setTimeout(() => {
            setShowBigHearts(false);
        }, 3000);
    }, [isComplete, incrementHugCount]);

    const teddyImage = templateData.teddy.imageUrl || DEFAULT_TEDDY;

    return (
        <motion.div
            className="relative cursor-pointer select-none"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
            }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            onClick={handleTeddyClick}
        >
            {/* Shadow */}
            <motion.div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/10 rounded-full blur-xl"
                animate={{
                    scale: isSquishing ? 1.1 : [1, 1.02, 1],
                    opacity: isSquishing ? 0.15 : [0.1, 0.12, 0.1],
                }}
                transition={{
                    duration: isSquishing ? 0.2 : 3,
                    repeat: isSquishing ? 0 : Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Teddy Container */}
            <motion.div
                className="relative w-64 h-72 sm:w-72 sm:h-80"
                animate={
                    isSquishing
                        ? {
                            scale: [1, 1.1, 0.95, 1.02, 1],
                            rotate: [0, -3, 2, -1, 0],
                        }
                        : {
                            scale: [1, 1.04, 1],
                            rotate: [0, 1, 0],
                        }
                }
                transition={
                    isSquishing
                        ? { duration: 0.4, ease: 'easeOut' }
                        : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                }
                style={{ transformOrigin: 'center bottom' }}
            >
                {/* Glow effect on complete */}
                {isComplete && (
                    <motion.div
                        className="absolute inset-0 rounded-full glow-heart"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />
                )}

                {/* Teddy Image */}
                <Image
                    src={teddyImage}
                    alt={templateData.teddy.altText}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    unoptimized={teddyImage.startsWith('data:')}
                />

                {/* Heart particles on hug */}
                {isSquishing && (
                    <>
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute left-1/2 top-1/2 text-2xl"
                                initial={{
                                    x: 0,
                                    y: 0,
                                    opacity: 1,
                                    scale: 0.5
                                }}
                                animate={{
                                    x: (Math.random() - 0.5) * 150,
                                    y: -50 - Math.random() * 100,
                                    opacity: 0,
                                    scale: 1 + Math.random() * 0.5,
                                    rotate: Math.random() * 60 - 30,
                                }}
                                transition={{
                                    duration: 1,
                                    delay: i * 0.05,
                                    ease: 'easeOut',
                                }}
                            >
                                💕
                            </motion.div>
                        ))}
                    </>
                )}
            </motion.div>

            {/* BIG SCREEN-WIDE HEARTS on click */}
            {showBigHearts && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {[...Array(10)].map((_, i) => {
                        // Create a 5x2 grid with random offsets for proper spacing
                        const col = i % 5;
                        const row = Math.floor(i / 5);
                        const baseLeft = 5 + col * 18; // 5 columns spread across width
                        const baseTop = 15 + row * 40; // 2 rows
                        const randomOffsetX = (Math.random() - 0.5) * 10;
                        const randomOffsetY = (Math.random() - 0.5) * 15;

                        return (
                            <motion.div
                                key={`big-heart-${i}`}
                                className="absolute text-5xl sm:text-7xl"
                                style={{
                                    left: `${baseLeft + randomOffsetX}%`,
                                    top: `${baseTop + randomOffsetY}%`,
                                }}
                                initial={{
                                    opacity: 0,
                                    scale: 0,
                                    rotate: Math.random() * 40 - 20,
                                }}
                                animate={{
                                    opacity: [0, 0.5, 0.6, 0.4, 0],
                                    scale: [0, 1.3, 1.1, 0.9],
                                    y: [0, -20, -40, -80],
                                    rotate: Math.random() * 50 - 25,
                                }}
                                transition={{
                                    duration: 2.5,
                                    delay: i * 0.08,
                                    ease: 'easeOut',
                                }}
                            >
                                {['❤️', '💕', '💖', '💗', '💓', '🩷', '💝', '💘', '❤️', '💖'][i]}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Click hint when not complete */}
            {!isComplete && hugCount === 0 && (
                <motion.div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                >
                    <motion.span
                        className="text-sm text-teddy-brown-primary/60 whitespace-nowrap"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        tap me! 🤍
                    </motion.span>
                </motion.div>
            )}

            {/* Edit overlay */}
            {isEditing && (
                <div className="absolute inset-0 border-2 border-dashed border-teddy-brown-primary/30 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-teddy-brown-deep text-sm font-medium bg-white/80 px-3 py-1 rounded-full">
                        Click to change teddy
                    </span>
                </div>
            )}
        </motion.div>
    );
}

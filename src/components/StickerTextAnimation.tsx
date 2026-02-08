'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useEditorStore } from '../store/editorStore';
import { defaultTemplateData } from '../data/templateData';

// Default sticker placeholder
const DEFAULT_STICKER = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
  <circle cx="30" cy="30" r="28" fill="#FFECD2" stroke="#D4A574" stroke-width="2"/>
  <circle cx="22" cy="25" r="3" fill="#8B4513"/>
  <circle cx="38" cy="25" r="3" fill="#8B4513"/>
  <path d="M20 38 Q30 45 40 38" stroke="#8B4513" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>
`)}`;

export default function StickerTextAnimation() {
    const { templateData: storeData, currentScene, isEditing, updateField } = useEditorStore();
    const templateData = storeData ?? defaultTemplateData;
    const containerRef = useRef<HTMLDivElement>(null);
    const stickerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [displayedText, setDisplayedText] = useState('');
    const [animationComplete, setAnimationComplete] = useState(false);

    const fullText = templateData.stickerAnimation.typingText;
    const stickerImage = templateData.stickerAnimation.stickerImageUrl || DEFAULT_STICKER;

    const handleTypingTextEdit = (newText: string) => {
        updateField('stickerAnimation', {
            ...templateData.stickerAnimation,
            typingText: newText,
        });
    };

    useEffect(() => {
        if (currentScene !== 'reveal' || animationComplete) return;

        const tl = gsap.timeline({
            onComplete: () => setAnimationComplete(true),
        });

        // Sticker animation - arc from left to center
        if (stickerRef.current) {
            tl.fromTo(
                stickerRef.current,
                {
                    x: '-150%',
                    y: '50%',
                    rotation: -20,
                    opacity: 0,
                },
                {
                    duration: 2.5,
                    x: '0%',
                    y: '0%',
                    rotation: 5,
                    opacity: 1,
                    ease: 'power2.out',
                    motionPath: {
                        path: [
                            { x: '-100%', y: '30%' },
                            { x: '-50%', y: '-10%' },
                            { x: '0%', y: '0%' },
                        ],
                        curviness: 1.5,
                    },
                }
            );
        }

        // Typing animation synced with sticker movement
        const chars = fullText.split('');
        const charDelay = 2500 / chars.length; // Total 2.5s for typing

        chars.forEach((_, index) => {
            setTimeout(() => {
                setDisplayedText(fullText.slice(0, index + 1));
            }, index * charDelay + 500); // Start after 0.5s delay
        });

        return () => {
            tl.kill();
        };
    }, [currentScene, fullText, animationComplete]);

    if (currentScene !== 'reveal') {
        return null;
    }

    return (
        <div ref={containerRef} className="relative w-full h-20 overflow-visible">
            <div className="flex items-center justify-center gap-4">
                {/* Sticker */}
                <motion.div
                    ref={stickerRef}
                    className="w-12 h-12 sm:w-14 sm:h-14 relative flex-shrink-0"
                    initial={{ opacity: 0 }}
                >
                    <Image
                        src={stickerImage}
                        alt="Sticker"
                        fill
                        className="object-contain drop-shadow-md"
                        unoptimized={stickerImage.startsWith('data:')}
                    />
                </motion.div>

                {/* Typing Text */}
                <motion.div
                    ref={textRef}
                    className="text-xl sm:text-2xl font-serif text-teddy-brown-deep"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: displayedText || isEditing ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {isEditing ? (
                        <input
                            type="text"
                            value={fullText}
                            onChange={(e) => handleTypingTextEdit(e.target.value)}
                            className="text-xl sm:text-2xl font-serif text-teddy-brown-deep bg-white/50 backdrop-blur-sm border-2 border-dashed border-teddy-brown-soft rounded-lg px-4 py-2 focus:border-teddy-brown-primary outline-none text-center"
                        />
                    ) : (
                        <span className="relative">
                            {displayedText}
                            {!animationComplete && (
                                <motion.span
                                    className="inline-block w-0.5 h-6 bg-teddy-brown-primary ml-1"
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                />
                            )}
                        </span>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

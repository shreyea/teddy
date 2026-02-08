'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

// 4 images - arranged: LEFT (top, middle), RIGHT (top, middle)
const REVEAL_IMAGES = [
    // LEFT side
    { id: 'img-1', src: '/cute.png', position: 'left', offset: { x: -350, y: -220 }, mobileOffset: { x: 0, y: 0 }, rotation: -5 },
    { id: 'img-2', src: '/heart.png', position: 'left', offset: { x: -530, y: 40 }, mobileOffset: { x: 0, y: 0 }, rotation: -6 },

    // RIGHT side
    { id: 'img-4', src: '/download__19_-removebg-preview.png', position: 'right', offset: { x: 300, y: -210 }, mobileOffset: { x: 0, y: 0 }, rotation: 4 },
    { id: 'img-5', src: '/Trendy_Coquette_Teddy_Bear_With_Bow-removebg-preview.png', position: 'right', offset: { x: 440, y: 40 }, mobileOffset: { x: 0, y: 0 }, rotation: 6 }
];

export default function TapToRevealStickers() {
    const { stickersRevealed, setStickersRevealed } = useEditorStore();
    const [revealedCount, setRevealedCount] = useState(0);

    const handleTap = useCallback(() => {
        if (revealedCount < REVEAL_IMAGES.length) {
            setRevealedCount(prev => prev + 1);
        }

        if (revealedCount >= REVEAL_IMAGES.length - 1 && !stickersRevealed) {
            setStickersRevealed(true);
        }
    }, [revealedCount, stickersRevealed, setStickersRevealed]);

    return (
        <>
            {/* Balloon - Top left corner, smaller on mobile */}
            <motion.div
                className="fixed left-1 top-2 sm:left-6 sm:top-auto z-50"
                style={{ top: typeof window !== 'undefined' && window.innerWidth >= 640 ? '30%' : undefined }}
                animate={{
                    y: [0, -30, 0, -30, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                <motion.div
                    animate={{
                        x: [0, 5, -4, 6, 0],
                        rotate: [-3, 5, -4, 5, -3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <Image
                        src="/balloon.png"
                        alt="Floating Balloon"
                        width={150}
                        height={180}
                        className="w-14 h-18 sm:w-32 sm:h-40 object-contain"
                        style={{
                            filter: 'drop-shadow(0 10px 20px rgba(255,105,180,0.4))',
                        }}
                    />
                </motion.div>
            </motion.div>

            {/* Tap to reveal button - Now in flow, not absolute */}
            <div className="mt-6 sm:mt-8 flex justify-center">
                <AnimatePresence mode="wait">
                    {revealedCount < REVEAL_IMAGES.length ? (
                        <motion.button
                            key="reveal-btn"
                            className="px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-xs sm:text-base cursor-pointer z-30 flex items-center gap-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            onClick={handleTap}
                            whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(244,114,182,0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)',
                                color: 'white',
                                boxShadow: '0 4px 20px rgba(244,114,182,0.3)',
                            }}
                        >
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Tap to reveal ({revealedCount}/{REVEAL_IMAGES.length})</span>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="revealed-msg"
                            className="px-4 py-2 sm:px-6 sm:py-3 rounded-full text-white font-semibold text-xs sm:text-base shadow-xl z-30 flex items-center gap-2"
                            style={{
                                background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
                            }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <span>✨</span>
                            <span>All revealed!</span>
                            <span>✨</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile: 4 images in horizontal row below teddy */}
            <div className="sm:hidden mt-4 flex justify-center gap-2 flex-wrap">
                {REVEAL_IMAGES.map((img, index) => (
                    <AnimatePresence key={`mobile-${img.id}`}>
                        {index < revealedCount && (
                            <motion.div
                                className="relative w-14 h-14 rounded-md overflow-hidden"
                                style={{
                                    border: '2px solid rgba(255,255,255,0.8)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    background: 'rgba(255,255,255,0.3)',
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 150, delay: index * 0.1 }}
                            >
                                <Image
                                    src={img.src}
                                    alt={`Reveal ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                ))}
            </div>

            {/* Desktop: Comic-style images - LEFT and RIGHT of teddy */}
            <div className="hidden sm:block">
                {REVEAL_IMAGES.map((img, index) => (
                    <AnimatePresence key={img.id}>
                        {index < revealedCount && (
                            <motion.div
                                className="absolute pointer-events-none"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    zIndex: 10 + index,
                                }}
                                initial={{
                                    x: img.position === 'left' ? -500 : 500,
                                    y: 0,
                                    opacity: 0,
                                    scale: 0.2,
                                    rotate: img.position === 'left' ? -45 : 45,
                                }}
                                animate={{
                                    x: img.offset.x,
                                    y: img.offset.y,
                                    opacity: 1,
                                    scale: 1,
                                    rotate: img.rotation,
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 120,
                                    damping: 12,
                                }}
                            >
                                {/* Comic frame with floating animation */}
                                <motion.div
                                    className="relative"
                                    animate={{
                                        y: [0, -8, 0, 5, 0],
                                        rotate: [img.rotation, img.rotation + 3, img.rotation - 2, img.rotation],
                                    }}
                                    transition={{
                                        duration: 4 + index * 0.3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                >
                                    {/* Comic panel frame */}
                                    <div
                                        className="w-36 h-36 rounded-lg overflow-hidden backdrop-blur-sm"
                                        style={{
                                            border: '4px solid rgba(255,255,255,0.8)',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.2), 0 0 30px rgba(255,182,193,0.3)',
                                            background: 'rgba(255,255,255,0.3)',
                                        }}
                                    >
                                        <Image
                                            src={img.src}
                                            alt={`Reveal ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Comic burst effect */}
                                    <motion.div
                                        className="absolute -top-3 -right-3 text-3xl"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.3, 1] }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                    >
                                        💥
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                ))}
            </div>
        </>
    );
}

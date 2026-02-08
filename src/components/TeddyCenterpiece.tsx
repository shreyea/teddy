'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Heart, ImagePlus } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { defaultTemplateData } from '../data/templateData';

// Type for the floating hearts
interface FloatingHeart {
    id: number;
    x: number;
    y: number;
    size: number;
}

let globalHeartId = 0;

export default function TeddyCenterpiece() {
    const {
        templateData: storeData,
        isEditing,
        updateField,
        incrementHugCount,
    } = useEditorStore();

    const templateData = storeData ?? defaultTemplateData;
    const [isSquished, setIsSquished] = useState(false);
    const [hearts, setHearts] = useState<FloatingHeart[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTeddyUrlEdit = (newUrl: string) => {
        updateField('teddy', { ...templateData.teddy, imageUrl: newUrl });
    };

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                handleTeddyUrlEdit(base64);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    }, [handleTeddyUrlEdit]);

    const handleTeddyClick = useCallback(() => {
        // Squish animation
        setIsSquished(true);
        setTimeout(() => setIsSquished(false), 200);

        // Increment hug count
        incrementHugCount();

        // Create 6-7 floating hearts at random positions on screen
        const numHearts = Math.floor(Math.random() * 2) + 6; // 6 or 7 hearts
        const newHearts: FloatingHeart[] = [];

        for (let i = 0; i < numHearts; i++) {
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
            newHearts.push({
                id: globalHeartId++,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight * 0.6 : 300) + 100,
                size: isMobile ? Math.random() * 15 + 20 : Math.random() * 30 + 40, // Smaller on mobile
            });
        }

        setHearts(prev => [...prev, ...newHearts]);

        // Remove the hearts after animation (2-3 seconds)
        setTimeout(() => {
            setHearts(currentHearts => 
                currentHearts.filter(h => !newHearts.find(nh => nh.id === h.id))
            );
        }, 2500);

    }, [incrementHugCount]);

    const teddyImage = templateData.teddy.imageUrl || '/teddy.png';

    return (
        <div className="relative flex flex-col items-center justify-center">
            {/* Hidden file input for teddy image upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Responsive container for the teddy */}
            <motion.div
                className="relative w-48 h-48 sm:w-72 sm:h-72 md:w-80 md:h-80 cursor-pointer group"
                onClick={handleTeddyClick}
                animate={{ scale: isSquished ? [1, 0.95, 1] : 1 }}
                transition={{ duration: 0.2 }}
            >
                {/* Teddy Image */}
                <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <Image
                        src={teddyImage}
                        alt="Cute Teddy Bear"
                        fill
                        priority
                        className="object-contain drop-shadow-teddy"
                        unoptimized={teddyImage.startsWith('data:')}
                    />
                </motion.div>
            </motion.div>

            {/* Floating Hearts - Fixed to viewport, scattered across screen */}
            <AnimatePresence>
                {hearts.map(heart => (
                    <motion.div
                        key={heart.id}
                        className="fixed z-50 pointer-events-none"
                        initial={{
                            top: heart.y,
                            left: heart.x,
                            opacity: 1,
                            scale: 0,
                        }}
                        animate={{
                            top: heart.y - 200,
                            opacity: 0,
                            scale: 1.2,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.5, ease: 'easeOut' }}
                    >
                        <Heart
                            className="text-heart-red"
                            fill="currentColor"
                            style={{
                                width: heart.size,
                                height: heart.size,
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                            }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Edit Mode UI - Upload button */}
            {isEditing && (
                <motion.div
                    className="mt-4 w-full max-w-sm flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border-2 border-dashed border-teddy-brown-soft rounded-lg shadow-md text-sm font-medium text-teddy-brown-primary transition-colors"
                    >
                        <ImagePlus className="w-4 h-4" />
                        Upload Teddy Image
                    </button>
                </motion.div>
            )}
        </div>
    );
}

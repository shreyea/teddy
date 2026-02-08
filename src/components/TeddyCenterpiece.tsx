'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { defaultTemplateData } from '../data/templateData';

// Type for the floating hearts
interface FloatingHeart {
    id: number;
    x: number;
    y: number;
    size: number;
}

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
    let heartIdCounter = 0;

    const handleTeddyUrlEdit = (newUrl: string) => {
        updateField('teddy', { ...templateData.teddy, imageUrl: newUrl });
    };

    const handleTeddyClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        // Squish animation
        setIsSquished(true);
        setTimeout(() => setIsSquished(false), 200);

        // Increment hug count
        incrementHugCount();

        // Create a floating heart
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newHeart: FloatingHeart = {
            id: heartIdCounter++,
            x,
            y,
            size: Math.random() * 20 + 30, // Random size between 30 and 50
        };

        setHearts(prev => [...prev, newHeart]);

        // Remove the heart after animation
        setTimeout(() => {
            setHearts(currentHearts => currentHearts.filter(h => h.id !== newHeart.id));
        }, 2000);

    }, [incrementHugCount]);

    const teddyImage = templateData.teddy.imageUrl || '/teddy.png';

    return (
        <div className="relative flex flex-col items-center justify-center">
            {/* Responsive container for the teddy and hearts */}
            <motion.div
                className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 cursor-pointer group"
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
                    />
                </motion.div>

                {/* Floating Hearts Container */}
                <AnimatePresence>
                    {hearts.map(heart => (
                        <motion.div
                            key={heart.id}
                            className="absolute"
                            initial={{
                                top: heart.y,
                                left: heart.x,
                                opacity: 1,
                                scale: 0,
                            }}
                            animate={{
                                top: heart.y - 150,
                                opacity: 0,
                                scale: 1,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2, ease: 'easeOut' }}
                            style={{ pointerEvents: 'none' }}
                        >
                            <Heart
                                className="text-heart-red"
                                fill="currentColor"
                                style={{
                                    width: heart.size,
                                    height: heart.size,
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Edit Mode UI */}
            {isEditing && (
                <motion.div
                    className="mt-4 w-full max-w-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="block text-center text-sm font-medium text-teddy-brown-primary mb-2">
                        Teddy Image URL
                    </label>
                    <input
                        type="text"
                        value={teddyImage}
                        onChange={(e) => handleTeddyUrlEdit(e.target.value)}
                        className="w-full px-3 py-2 bg-white/60 border-2 border-dashed border-teddy-brown-soft rounded-lg shadow-inner text-sm text-teddy-brown-deep placeholder-teddy-brown-primary/70 focus:outline-none focus:border-teddy-brown-primary focus:ring-1 focus:ring-teddy-brown-primary"
                        placeholder="Enter image URL..."
                    />
                </motion.div>
            )}
        </div>
    );
}

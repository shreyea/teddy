'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEditorStore } from '../store/editorStore';
import FloatingParticles from './FloatingParticles';
import HeadingAnimation from './HeadingAnimation';
import TeddyCenterpiece from './TeddyCenterpiece';
import HugTheTeddy from './HugTheTeddy';
import ScrapbookPhotos from './ScrapbookPhotos';
import TapToRevealStickers from './TapToRevealStickers';
import { defaultTemplateData } from '../data/templateData';

export default function TeddyRevealScene() {
    const { currentScene, templateData: storeData, hugCount } = useEditorStore();
    const templateData = storeData ?? defaultTemplateData;
    const isComplete = hugCount >= templateData.hugInteraction.hugsRequired;

    if (currentScene !== 'reveal') {
        return null;
    }

    return (
        <motion.div
            className="min-h-screen relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background Layer */}
            <div className="fixed inset-0 z-0">
                {/* Background Image - main.jpg */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/main.jpg')`,
                        filter: 'blur(5px)',
                        transform: 'scale(1.05)',
                    }}
                />
                {/* Warm Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-rose-800/20 to-amber-900/30" />

                {/* Grain Texture */}
                <div className="absolute inset-0 texture-grain opacity-50" />

                {/* Particles */}
                <FloatingParticles variant={isComplete ? 'celebration' : 'reveal'} />
            </div>

            {/* Top Right Decoration - REM - Smaller on mobile */}
            <motion.div
                className="fixed top-2 right-2 w-16 h-16 sm:w-28 sm:h-28 md:w-40 md:h-40 pointer-events-none z-40"
                initial={{ opacity: 0, rotate: 20, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
            >
                <Image
                    src="/rem.png"
                    alt="Rem"
                    fill
                    className="object-contain"
                    style={{ filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.2))' }}
                />
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-6">
                {/* Heading Animation - run.png reveals "Happy Teddy Day" */}
                <div className="w-full max-w-2xl mx-auto mt-4">
                    <HeadingAnimation />
                </div>

                {/* Teddy Section */}
                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg gap-8">
                    {/* Teddy with Stickers */}
                    <div className="relative">
                        <TeddyCenterpiece />
                        <TapToRevealStickers />
                    </div>

                    {/* Hug Interaction - Now with proper spacing */}
                    <div className="w-full">
                        <HugTheTeddy />
                    </div>
                </div>

                {/* Scrapbook Photos */}
                <div className="w-full max-w-4xl mt-auto pt-8">
                    <ScrapbookPhotos />
                </div>

                {/* Footer */}
                <motion.footer
                    className="w-full text-center py-6 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                >
                    <p className="text-sm text-white/70 font-handwriting tracking-wide">
                        Made with 💕 for you
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                        Happy Teddy Day 🧸
                    </p>
                </motion.footer>
            </div>

            {/* Completion Glow Overlay */}
            {isComplete && (
                <motion.div
                    className="fixed inset-0 pointer-events-none z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                >
                    <div className="absolute inset-0 bg-gradient-radial from-blush-soft/20 via-transparent to-transparent" />
                </motion.div>
            )}
        </motion.div>
    );
}

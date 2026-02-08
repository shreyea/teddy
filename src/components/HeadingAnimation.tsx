'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeadingAnimation() {
    const [displayText, setDisplayText] = useState('');
    const [phase, setPhase] = useState<'writing' | 'shrinking' | 'done'>('writing');
    const fullText = 'Happy Teddy Day';

    useEffect(() => {
        let charIndex = 0;

        // Typewriter effect - write one character at a time
        const typeInterval = setInterval(() => {
            if (charIndex <= fullText.length) {
                setDisplayText(fullText.slice(0, charIndex));
                charIndex++;
            } else {
                clearInterval(typeInterval);
                // Start shrinking phase
                setPhase('shrinking');
                // After shrink animation, set to done
                setTimeout(() => {
                    setPhase('done');
                }, 800);
            }
        }, 120);

        return () => clearInterval(typeInterval);
    }, []);

    // Calculate teddy position based on text length
    const progress = displayText.length / fullText.length;

    return (
        <motion.div
            className="w-full flex items-center justify-center relative overflow-hidden"
            animate={{
                height: phase === 'done' ? '120px' : '50vh',
                paddingTop: phase === 'done' ? '10px' : '0px',
            }}
            transition={{
                duration: 0.6,
                ease: 'easeInOut',
            }}
        >
            {/* Center Container */}
            <motion.div
                className="relative flex flex-col items-center justify-center px-4"
                animate={{
                    scale: phase === 'done' ? 0.65 : 1,
                }}
                transition={{
                    duration: 0.6,
                    ease: 'easeInOut',
                }}
            >
                {/* Main Text - BIG BOLD being written */}
                <div className="relative">
                    <motion.h1
                        className="font-black text-white text-center"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            textShadow: '4px 4px 20px rgba(0,0,0,0.7), 0 0 60px rgba(255,182,193,0.5)',
                            letterSpacing: '0.02em',
                            fontSize: phase === 'done' ? 'clamp(2rem, 6vw, 3rem)' : 'clamp(3rem, 10vw, 5rem)',
                        }}
                    >
                        {displayText.split('').map((char, i) => {
                            const isTeddy = i >= 6 && i <= 10;
                            return (
                                <span
                                    key={i}
                                    className={isTeddy ? 'text-pink-600' : 'text-white'}
                                >
                                    {char}
                                </span>
                            );
                        })}
                        {phase === 'writing' && (
                            <motion.span
                                className="inline-block w-1 sm:w-1.5 h-10 sm:h-14 md:h-16 bg-white ml-1 align-middle"
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity }}
                            />
                        )}
                    </motion.h1>
                </div>

                {/* Running Teddy - Fixed to viewport, starts from LEFT EDGE */}
                {phase === 'writing' && (
                    <motion.div
                        className="fixed top-1/2 z-50"
                        style={{
                            transform: 'translateY(-50%)',
                        }}
                        initial={{
                            left: '-100px',
                        }}
                        animate={{
                            left: `calc(${progress * 60}vw + 10vw)`,
                        }}
                        transition={{
                            duration: 0.1,
                            ease: 'linear',
                        }}
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, -5, 5, 0],
                            }}
                            transition={{
                                duration: 0.25,
                                repeat: Infinity,
                            }}
                        >
                            <Image
                                src="/run.png"
                                alt="Writing Teddy"
                                width={150}
                                height={150}
                                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain drop-shadow-2xl"
                                style={{
                                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))',
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}

                {/* Big Teddy Emoji - shows after writing */}
                <motion.div
                    className="mt-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: phase !== 'writing' ? 1 : 0,
                        scale: phase !== 'writing' ? 1 : 0,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                    }}
                >
                    <span className="text-3xl sm:text-4xl md:text-5xl">🧸</span>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                    className="flex gap-4 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase !== 'writing' ? 1 : 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.span
                        className="text-lg sm:text-xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        ✨
                    </motion.span>
                    <motion.span
                        className="text-lg sm:text-xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    >
                        💕
                    </motion.span>
                    <motion.span
                        className="text-lg sm:text-xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                        ✨
                    </motion.span>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

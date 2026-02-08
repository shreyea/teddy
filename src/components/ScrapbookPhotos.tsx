'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ImagePlus, Pencil } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { defaultTemplateData } from '../data/templateData';

// Default placeholder image
const PLACEHOLDER_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#F5E6D3"/>
  <rect x="20" y="20" width="160" height="160" fill="#FFECD2" rx="8"/>
  <circle cx="100" cy="80" r="30" fill="#D4A574" opacity="0.4"/>
  <rect x="60" y="120" width="80" height="10" rx="5" fill="#D4A574" opacity="0.3"/>
  <rect x="70" y="140" width="60" height="8" rx="4" fill="#D4A574" opacity="0.2"/>
</svg>
`)}`;

interface PhotoData {
    id: string;
    imageUrl: string;
    caption: string;
    rotation: number;
}

export default function ScrapbookPhotos() {
    const { templateData: storeData, isEditing, updateField } = useEditorStore();
    const templateData = storeData ?? defaultTemplateData;
    const [showLetterMessage, setShowLetterMessage] = useState(false);
    const [showCarousel, setShowCarousel] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const photos = templateData.photos;
    const letter = templateData.letter ?? defaultTemplateData.letter;

    const handleCaptionEdit = useCallback((photoId: string, newCaption: string) => {
        const updatedPhotos = photos.map(p =>
            p.id === photoId ? { ...p, caption: newCaption } : p
        );
        updateField('photos', updatedPhotos);
    }, [photos, updateField]);

    const handleImageUrlEdit = useCallback((photoId: string, newUrl: string) => {
        const updatedPhotos = photos.map(p =>
            p.id === photoId ? { ...p, imageUrl: newUrl } : p
        );
        updateField('photos', updatedPhotos);
    }, [photos, updateField]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editingImageIndex !== null) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                handleImageUrlEdit(photos[editingImageIndex].id, base64);
                setEditingImageIndex(null);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    }, [editingImageIndex, photos, handleImageUrlEdit]);

    const handleLetterFieldEdit = useCallback((field: 'title' | 'body' | 'signoff', value: string) => {
        updateField('letter', {
            ...letter,
            [field]: value,
        });
    }, [letter, updateField]);

    const nextPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    return (
        <>
            {/* Main Interactive Section */}
            <motion.div
                className="relative w-full min-h-[70vh] flex items-center justify-center py-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                {/* Background blur overlay that appears on scroll */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-pink-50/60 via-white/80 to-rose-50/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                />

                {/* Content Container - Decorated with curved edges */}
                <motion.div
                    className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 px-6 py-8 sm:px-10 sm:py-10 mx-4"
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,252,250,0.95) 0%, rgba(255,245,250,0.9) 50%, rgba(255,250,245,0.95) 100%)',
                        borderRadius: '28px',
                        border: '2px solid rgba(255,192,203,0.4)',
                        boxShadow: '0 20px 60px rgba(219,112,147,0.15), 0 10px 30px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,0.9)'
                    }}
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
                >
                    {/* Corner decorations */}
                    <div className="absolute top-3 left-3 text-pink-300 text-2xl sm:text-3xl opacity-60">✿</div>
                    <div className="absolute top-3 right-3 text-rose-300 text-2xl sm:text-3xl opacity-60">❀</div>
                    <div className="absolute bottom-3 left-3 text-red-200 text-xl sm:text-2xl opacity-50">♡</div>
                    <div className="absolute bottom-3 right-3 text-pink-300 text-xl sm:text-2xl opacity-50">♡</div>

                    {/* Animated sparkles */}
                    <motion.div
                        className="absolute top-5 left-1/4 text-yellow-300/70 text-lg hidden sm:block"
                        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >✨</motion.div>
                    <motion.div
                        className="absolute bottom-5 right-1/4 text-yellow-300/70 text-lg hidden sm:block"
                        animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    >✨</motion.div>

                    {/* Letter Section */}
                    <motion.div
                        className="relative cursor-pointer group"
                        initial={{ opacity: 0, scale: 0.5, y: 50, rotate: -10 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0, rotate: -3 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                            delay: 0.2
                        }}
                        whileHover={{
                            scale: 1.1,
                            rotate: 0,
                            y: -10,
                            transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLetterMessage(true)}
                    >
                        {/* Glow effect */}
                        <motion.div
                            className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-pink-300/40 via-rose-200/30 to-amber-200/40 blur-xl"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {/* Letter Image */}
                        <div className="relative w-32 h-32 sm:w-64 sm:h-64 md:w-72 md:h-72">
                            <Image
                                src="/letter.png"
                                alt="Love Letter"
                                fill
                                className="object-contain drop-shadow-2xl"
                                style={{
                                    filter: 'drop-shadow(0 20px 40px rgba(219, 112, 147, 0.3))'
                                }}
                            />
                        </div>

                        {/* Floating hint */}
                        <motion.div
                            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-pink-600 shadow-lg border border-pink-100"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                        >
                            <motion.span
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                💌 Read Me!
                            </motion.span>
                        </motion.div>

                        {/* Sparkle effects */}
                        <motion.div
                            className="absolute -top-2 -right-2 text-2xl"
                            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ✨
                        </motion.div>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        className="hidden sm:block w-px h-32 bg-gradient-to-b from-transparent via-pink-300 to-transparent"
                        initial={{ scaleY: 0, opacity: 0 }}
                        whileInView={{ scaleY: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    />

                    {/* Camera Section */}
                    <motion.div
                        className="relative cursor-pointer group"
                        initial={{ opacity: 0, scale: 0.5, y: 100, rotate: 15 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 5 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                            delay: 0.4
                        }}
                        whileHover={{
                            scale: 1.1,
                            rotate: 0,
                            y: -10,
                            transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setCurrentPhotoIndex(0);
                            setShowCarousel(true);
                        }}
                    >
                        {/* Glow effect */}
                        <motion.div
                            className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-200/40 via-pink-200/30 to-rose-300/40 blur-xl"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        />

                        {/* Camera Image - For viewing photos */}
                        <div className="relative w-32 h-32 sm:w-64 sm:h-64 md:w-72 md:h-72">
                            <Image
                                src="/camera.png"
                                alt="Our Memories"
                                fill
                                className="object-contain drop-shadow-2xl"
                                style={{
                                    filter: 'drop-shadow(0 20px 40px rgba(180, 130, 100, 0.3))'
                                }}
                            />
                        </div>

                        {/* Floating hint */}
                        <motion.div
                            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-amber-700 shadow-lg border border-amber-100"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                        >
                            <motion.span
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                            >
                                📸 Our Memories
                            </motion.span>
                        </motion.div>

                        {/* Flash effect on hover */}
                        <motion.div
                            className="absolute -top-2 -left-2 text-2xl"
                            animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.2 }}
                        >
                            💫
                        </motion.div>

                        {/* Mini polaroids peek */}
                        <motion.div
                            className="absolute -bottom-4 -right-4 w-12 h-14 bg-white rounded-sm shadow-lg transform rotate-12 opacity-80"
                            style={{ padding: '2px' }}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-100 rounded-sm" />
                        </motion.div>
                        <motion.div
                            className="absolute -bottom-2 -right-8 w-10 h-12 bg-white rounded-sm shadow-md transform -rotate-6 opacity-60"
                            style={{ padding: '2px' }}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 rounded-sm" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Letter Message Modal */}
            <AnimatePresence>
                {showLetterMessage && (
                    <motion.div
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowLetterMessage(false)}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/50 backdrop-blur-md"
                        />

                        <motion.div
                            className="relative bg-[#fff9f0] p-8 sm:p-12 max-w-lg w-full shadow-2xl overflow-hidden"
                            style={{
                                borderRadius: '4px',
                                backgroundSize: '20px 20px',
                                backgroundImage: 'linear-gradient(#f5e5e0 1px, transparent 1px), linear-gradient(90deg, #f5e5e0 1px, transparent 1px)'
                            }}
                            initial={{ scale: 0.5, y: 100, opacity: 0, rotate: 10 }}
                            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, y: 100, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative tape */}
                            <div
                                className="absolute -top-4 left-1/2 -translate-x-1/2 w-36 h-10 bg-gradient-to-r from-pink-200/60 via-pink-100/80 to-pink-200/60 rotate-[-1deg]"
                                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                            />

                            <button
                                onClick={() => setShowLetterMessage(false)}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 hover:text-pink-600 transition-all flex items-center justify-center shadow-md"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mt-4">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={letter.title}
                                        onChange={(e) => handleLetterFieldEdit('title', e.target.value)}
                                        className="w-full text-center text-3xl sm:text-4xl text-rose-800 mb-6 bg-transparent border-b-2 border-rose-200 focus:border-rose-400 outline-none"
                                        style={{ fontFamily: "'Dancing Script', cursive" }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <motion.h3
                                        className="text-3xl sm:text-4xl text-rose-800 mb-6"
                                        style={{ fontFamily: "'Dancing Script', cursive" }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {letter.title}
                                    </motion.h3>
                                )}
                                {isEditing ? (
                                    <textarea
                                        value={letter.body}
                                        onChange={(e) => handleLetterFieldEdit('body', e.target.value)}
                                        className="w-full text-center text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 bg-transparent border-2 border-rose-100 focus:border-rose-300 rounded-lg p-3 outline-none resize-none"
                                        style={{ fontFamily: "'Dancing Script', cursive" }}
                                        rows={5}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <motion.p
                                        className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 whitespace-pre-line"
                                        style={{ fontFamily: "'Dancing Script', cursive" }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {letter.body}
                                    </motion.p>
                                )}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={letter.signoff}
                                        onChange={(e) => handleLetterFieldEdit('signoff', e.target.value)}
                                        className="w-full text-right text-rose-600 text-xl mt-8 bg-transparent border-b-2 border-rose-200 focus:border-rose-400 outline-none"
                                        style={{ fontFamily: "'Dancing Script', cursive" }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <motion.div
                                        className="text-right text-rose-600 text-xl mt-8"
                                        style={{ fontFamily: "'Dancing Script', cursive" }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {letter.signoff}
                                    </motion.div>
                                )}
                            </div>

                            {/* Heart decorations */}
                            <motion.div
                                className="absolute bottom-4 left-4 text-2xl text-pink-300"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                💕
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Photo Carousel Modal */}
            <AnimatePresence>
                {showCarousel && photos.length > 0 && (
                    <motion.div
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCarousel(false)}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/70 backdrop-blur-lg"
                        />

                        <motion.div
                            className="relative z-10 w-full max-w-[280px] sm:max-w-md"
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                className="absolute -top-3 -right-3 z-30 w-10 h-10 rounded-full bg-white text-gray-800 shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all transform hover:scale-110"
                                onClick={() => setShowCarousel(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Polaroid Frame */}
                            <motion.div
                                className="relative bg-white p-3 pb-14 sm:p-4 sm:pb-16 shadow-2xl"
                                style={{
                                    transform: `rotate(${(currentPhotoIndex % 2 === 0 ? 1 : -1) * 2}deg)`,
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0,0,0,0.05)'
                                }}
                                key={currentPhotoIndex}
                                initial={{ opacity: 0, scale: 0.9, rotate: 10 }}
                                animate={{ opacity: 1, scale: 1, rotate: (currentPhotoIndex % 2 === 0 ? 1 : -1) * 2 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Photo */}
                                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden group">
                                    <Image
                                        src={photos[currentPhotoIndex]?.imageUrl || PLACEHOLDER_IMAGE}
                                        alt={photos[currentPhotoIndex]?.caption || 'Memory'}
                                        fill
                                        className="object-cover"
                                        unoptimized={(photos[currentPhotoIndex]?.imageUrl || PLACEHOLDER_IMAGE).startsWith('data:')}
                                    />
                                    {/* Vintage overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100/10 via-transparent to-rose-100/15 pointer-events-none" />
                                    
                                    {/* Edit Image Button - Only show when editing */}
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingImageIndex(currentPhotoIndex);
                                                    fileInputRef.current?.click();
                                                }}
                                                className="px-4 py-2 bg-white rounded-full text-gray-800 font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg"
                                            >
                                                <ImagePlus className="w-5 h-5" />
                                                <span>Upload Photo</span>
                                            </button>
                                            <div className="text-white text-xs">or paste image URL below</div>
                                        </div>
                                    )}
                                </div>

                                {/* Image URL Input - Only show when editing */}
                                {isEditing && (
                                    <div className="mt-2 relative">
                                        <input
                                            type="text"
                                            value={photos[currentPhotoIndex]?.imageUrl || ''}
                                            onChange={(e) => handleImageUrlEdit(photos[currentPhotoIndex].id, e.target.value)}
                                            className="w-full text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1.5 pr-8 outline-none focus:border-pink-300 text-gray-600"
                                            placeholder="Paste image URL here..."
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                )}

                                {/* Caption */}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={photos[currentPhotoIndex]?.caption || ''}
                                        onChange={(e) => handleCaptionEdit(photos[currentPhotoIndex].id, e.target.value)}
                                        className="w-full bg-transparent border-none outline-none text-center mt-6 text-xl sm:text-2xl text-gray-700"
                                        style={{ fontFamily: "'Dancing Script', cursive" }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <p
                                        className="mt-6 text-center text-xl sm:text-2xl text-gray-700"
                                        style={{ fontFamily: "'Dancing Script', cursive" }}
                                    >
                                        {photos[currentPhotoIndex]?.caption || 'Our memory'}
                                    </p>
                                )}

                                {/* Photo counter */}
                                <div className="absolute bottom-3 right-4 text-sm text-gray-400">
                                    {currentPhotoIndex + 1} / {photos.length}
                                </div>
                            </motion.div>

                            {/* Navigation Arrows */}
                            {photos.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-14 h-14 rounded-full bg-white/90 backdrop-blur text-gray-700 shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
                                        onClick={prevPhoto}
                                    >
                                        <ChevronLeft className="w-7 h-7" />
                                    </button>
                                    <button
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-14 h-14 rounded-full bg-white/90 backdrop-blur text-gray-700 shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
                                        onClick={nextPhoto}
                                    >
                                        <ChevronRight className="w-7 h-7" />
                                    </button>
                                </>
                            )}

                            {/* Dots indicator */}
                            {photos.length > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    {photos.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentPhotoIndex(idx)}
                                            className={`w-3 h-3 rounded-full transition-all ${idx === currentPhotoIndex
                                                ? 'bg-white scale-125'
                                                : 'bg-white/40 hover:bg-white/60'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden file input for image upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </>
    );
}

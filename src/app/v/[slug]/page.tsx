'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import EntryScreen from '../../../components/EntryScreen';
import TeddyRevealScene from '../../../components/TeddyRevealScene';
import { useEditorStore } from '../../../store/editorStore';
import { getPublishedProjectBySlug } from "../../../lib/projects";

export default function ViewPage() {
    const params = useParams();
    const slug = params.slug as string;

    const {
        currentScene,
        setTemplateData,
        setIsEditing
    } = useEditorStore();
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function loadProject() {
            try {
                const project = await getPublishedProjectBySlug(slug);

                if (!project) {
                    setNotFound(true);
                    return;
                }

                if (!project.is_published) {
                    setNotFound(true);
                    return;
                }

                setTemplateData(project.data);
                setIsEditing(false); // View mode only
            } catch (err) {
                console.error('Error loading project:', err);
                setNotFound(true);
            } finally {
                setIsLoading(false);
            }
        }

        if (slug) {
            loadProject();
        }
    }, [slug, setTemplateData, setIsEditing]);

    if (isLoading) {
        return (
            <div className="min-h-screen gradient-teddy flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teddy-brown-soft/30 animate-pulse" />
                    <p className="text-teddy-brown-deep/60 font-serif">Loading surprise...</p>
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen gradient-teddy flex items-center justify-center p-4">
                <div className="card-paper p-8 text-center max-w-md">
                    <div className="text-6xl mb-4">🧸</div>
                    <h1 className="text-2xl font-serif text-teddy-brown-deep mb-4">
                        Oops! This teddy got lost
                    </h1>
                    <p className="text-teddy-brown-primary/70 mb-6">
                        We couldn&apos;t find this surprise. It might have been moved or hasn&apos;t been published yet.
                    </p>
                    <a
                        href="/"
                        className="btn-teddy inline-block"
                    >
                        <span>Create Your Own</span>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-cream-paper">
            <AnimatePresence mode="wait">
                {currentScene === 'entry' ? (
                    <EntryScreen key="entry" />
                ) : (
                    <TeddyRevealScene key="reveal" />
                )}
            </AnimatePresence>
        </main>
    );
}

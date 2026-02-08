'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPublishedProjectBySlug, Project } from '@/lib/projects';
import { useEditorStore } from '@/store/editorStore';

// Import your template components
import EntryScreen from '@/components/EntryScreen';
import TeddyRevealScene from '@/components/TeddyRevealScene';

export default function PublicViewPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [project, setProject] = useState<Project | null>(null);

    const { setTemplateData, currentScene, setIsEditing } = useEditorStore();

    useEffect(() => {
        async function loadProject() {
            if (!slug) {
                setError('Invalid URL');
                setLoading(false);
                return;
            }

            console.log('[PublicView] Loading project with slug:', slug);

            try {
                const projectData = await getPublishedProjectBySlug(slug);

                if (!projectData) {
                    console.log('[PublicView] Project not found or not published');
                    setError('This page is not available. It may not be published yet.');
                    setLoading(false);
                    return;
                }

                console.log('[PublicView] Project loaded:', projectData.id);
                setProject(projectData);
                setTemplateData(projectData.data);
                setIsEditing(false); // View-only mode
                setLoading(false);
            } catch (err) {
                console.error('[PublicView] Error loading project:', err);
                setError('Something went wrong. Please try again later.');
                setLoading(false);
            }
        }

        loadProject();
    }, [slug, setTemplateData, setIsEditing]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                        <div className="absolute inset-0 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin"></div>
                        <span className="absolute inset-0 flex items-center justify-center text-2xl">🧸</span>
                    </div>
                    <p className="text-pink-600 font-medium">Loading your surprise...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 p-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">🧸</div>
                    <h1 className="text-2xl font-serif text-gray-700 mb-2">
                        Oops! Not Found
                    </h1>
                    <p className="text-gray-500 mb-6">
                        {error || 'This teddy hasn\'t been prepared yet.'}
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    // Render the template based on current scene
    return (
        <main className="min-h-screen overflow-hidden">
            {currentScene === 'entry' ? (
                <EntryScreen />
            ) : (
                <TeddyRevealScene />
            )}
        </main>
    );
}

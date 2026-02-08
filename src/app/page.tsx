'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import EntryScreen from '../components/EntryScreen';
import TeddyRevealScene from '../components/TeddyRevealScene';
import EditorControls from '../components/EditorControls';
import LoginModal from '../components/LoginModal';
import { useEditorStore } from '../store/editorStore';
import { getEditSession, clearEditSession } from '../lib/auth';
import { verifyAndGetProject } from '../lib/projects';

export default function Home() {
  const {
    currentScene,
    setCurrentScene,
    setTemplateData,
    setIsEditing,
    setProject,
    isEditing
  } = useEditorStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check for existing edit session on mount
  useEffect(() => {
    async function checkSession() {
      const session = getEditSession();

      if (session) {
        try {
          // Verify session is still valid by fetching project
          // Note: session stores email and templateCode (which is project id for restore)
          const project = await verifyAndGetProject(session.email, session.templateCode || '');

          if (project) {
            setTemplateData(project.data);
            setProject(project);
            setIsEditing(true);
          } else {
            // Session invalid, clear it
            clearEditSession();
          }
        } catch {
          clearEditSession();
        }
      }

      setIsLoading(false);
    }

    checkSession();
  }, [setTemplateData, setIsEditing, setProject]);

  const handleLoginSuccess = useCallback(() => {
    // Close login modal and proceed to reveal after successful login
    setShowLoginModal(false);
    setCurrentScene('reveal');
  }, [setCurrentScene]);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-teddy flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-teddy-brown-soft/30"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <p className="text-teddy-brown-deep/60 font-serif">Loading your teddy...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream-paper relative">
      {/* Login Icon Button - Always visible when not editing */}
      {!isEditing && (
        <motion.button
          onClick={() => setShowLoginModal(true)}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-teddy-brown-soft/20 hover:bg-white transition-colors group"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Login to Edit"
        >
          <Settings className="w-5 h-5 text-teddy-brown-primary group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>
      )}

      {/* Main Content - Shows default or edited content */}
      <AnimatePresence mode="wait">
        {currentScene === 'entry' ? (
          <EntryScreen key="entry" onRequestLogin={() => setShowLoginModal(true)} />
        ) : (
          <TeddyRevealScene key="reveal" />
        )}
      </AnimatePresence>

      {/* Editor Controls - Only show when editing */}
      {isEditing && <EditorControls />}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </main>
  );
}

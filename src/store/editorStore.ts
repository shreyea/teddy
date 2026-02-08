import { create } from 'zustand';
import { TeddyTemplateData, defaultTemplateData } from '../data/templateData';
import { Project } from '../lib/projects';

interface EditorState {
    // Mode
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;

    // Template Data
    templateData: TeddyTemplateData;
    setTemplateData: (data: TeddyTemplateData) => void;
    updateField: <K extends keyof TeddyTemplateData>(
        key: K,
        value: TeddyTemplateData[K]
    ) => void;

    // Project (full object for save/publish operations)
    project: Project | null;
    setProject: (project: Project | null) => void;

    // Dirty State
    isDirty: boolean;
    setIsDirty: (dirty: boolean) => void;

    // Scene State
    currentScene: 'entry' | 'reveal';
    setCurrentScene: (scene: 'entry' | 'reveal') => void;

    // Interaction State
    stickersRevealed: boolean;
    setStickersRevealed: (revealed: boolean) => void;
    hugCount: number;
    incrementHugCount: () => void;
    resetHugCount: () => void;

    // Reset
    reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    // Mode
    isEditing: false,
    setIsEditing: (editing) => set({ isEditing: editing }),

    // Template Data
    templateData: defaultTemplateData,
    setTemplateData: (data) => set({ templateData: data ?? defaultTemplateData, isDirty: false }),
    updateField: (key, value) =>
        set((state) => ({
            templateData: { ...state.templateData, [key]: value },
            isDirty: true,
        })),

    // Project
    project: null,
    setProject: (project) => set({ project }),

    // Dirty State
    isDirty: false,
    setIsDirty: (dirty) => set({ isDirty: dirty }),

    // Scene State
    currentScene: 'entry',
    setCurrentScene: (scene) => set({ currentScene: scene }),

    // Interaction State
    stickersRevealed: false,
    setStickersRevealed: (revealed) => set({ stickersRevealed: revealed }),
    hugCount: 0,
    incrementHugCount: () =>
        set((state) => ({ hugCount: state.hugCount + 1 })),
    resetHugCount: () => set({ hugCount: 0 }),

    // Reset
    reset: () =>
        set({
            isEditing: false,
            templateData: defaultTemplateData,
            project: null,
            isDirty: false,
            currentScene: 'entry',
            stickersRevealed: false,
            hugCount: 0,
        }),
}));

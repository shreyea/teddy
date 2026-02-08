import { Project } from "./projects";

// Session storage for current edit session
interface EditSession {
    email: string;
    projectId: string;
    templateCode: string;
    slug: string;
    editableUntil: string;
}

let currentSession: EditSession | null = null;

export function setEditSession(project: Project, email: string) {
    currentSession = {
        email,
        projectId: project.id,
        templateCode: project.template_code,
        slug: project.slug,
        editableUntil: project.editable_until
    };
    console.log('[setEditSession] Session created for project:', project.id);

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
        localStorage.setItem('teddy_session', JSON.stringify(currentSession));
    }
}

export function getEditSession(): EditSession | null {
    if (currentSession) return currentSession;

    // Try to restore from localStorage
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('teddy_session');
        if (stored) {
            try {
                currentSession = JSON.parse(stored);
                return currentSession;
            } catch (e) {
                console.error('[getEditSession] Failed to parse stored session:', e);
                localStorage.removeItem('teddy_session');
            }
        }
    }
    return null;
}

export function clearEditSession() {
    console.log('[clearEditSession] Clearing session');
    currentSession = null;
    if (typeof window !== 'undefined') {
        localStorage.removeItem('teddy_session');
    }
}

export function isLoggedIn(): boolean {
    const session = getEditSession();
    if (!session) return false;

    // Also check if editing is still allowed
    const now = new Date();
    const editableUntil = new Date(session.editableUntil);
    const isValid = now < editableUntil;

    if (!isValid) {
        console.log('[isLoggedIn] Session expired, clearing');
        clearEditSession();
        return false;
    }

    return true;
}

export function getSessionProjectId(): string | null {
    const session = getEditSession();
    return session?.projectId || null;
}

export function getSessionSlug(): string | null {
    const session = getEditSession();
    return session?.slug || null;
}

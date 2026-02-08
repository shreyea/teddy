import { supabase } from "./supabase";
import { TeddyTemplateData } from "../data/templateData";

export interface Project {
    id: string;
    owner_email: string;
    data: TeddyTemplateData;
    editable_until: string;
    is_published: boolean;
    slug: string;
    created_at: string;
    updated_at?: string;
    template_type: string;
    template_code: string;
}

// ✅ Verify access using email + template_code + template_type
export async function verifyAndGetProject(
    email: string,
    templateCode: string
): Promise<Project | null> {
    // Normalize inputs
    email = email.trim().toLowerCase();
    templateCode = templateCode.trim();

    console.log("[verifyAndGetProject]", { email, templateCode });

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_email", email)
        .eq("template_code", templateCode)
        .eq("template_type", "teddy")
        .maybeSingle();

    if (error) {
        console.error("[verifyAndGetProject] error:", error);
        return null;
    }

    if (!data) {
        console.warn("[verifyAndGetProject] No matching project");
        return null;
    }

    console.log("[verifyAndGetProject] Loaded project:", data.id);
    return data ?? null;
}

// ✅ Editing window check
export function isEditingAllowed(project: Project): boolean {
    return new Date() < new Date(project.editable_until);
}

// ✅ Save project data
export async function updateProjectData(
    project: Project,
    updatedData: TeddyTemplateData
): Promise<Project> {
    if (!isEditingAllowed(project)) {
        throw new Error("Editing period expired");
    }

    const { data, error } = await supabase
        .from("projects")
        .update({
            data: updatedData,
            updated_at: new Date().toISOString(),
        })
        .eq("id", project.id)
        .select()
        .single();

    if (error) {
        console.error("[updateProjectData] error:", error);
        throw error;
    }

    return data as Project;
}

// ✅ Publish project
export async function publishProject(projectId: string): Promise<Project> {
    const { data, error } = await supabase
        .from("projects")
        .update({
            is_published: true,
            updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select()
        .single();

    if (error) {
        console.error("[publishProject] error:", error);
        throw error;
    }

    return data as Project;
}

// ✅ Public view (CRITICAL FIX)
export async function getPublishedProjectBySlug(
    slug: string
): Promise<Project | null> {
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("template_type", "teddy")
        .eq("is_published", true)
        .maybeSingle();

    if (error) {
        console.error("[getPublishedProjectBySlug] error:", error);
        return null;
    }

    return data as Project | null;
}

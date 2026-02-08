import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || 'shreyaupadhayay13@gmail.com';
    const code = url.searchParams.get('code') || 'qq';

    console.log('[API Test] Starting test with email:', email, 'code:', code);

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Missing env variables' });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Query: match owner_email + template_code + template_type
        const { data, error, status } = await supabase
            .from('projects')
            .select('*')
            .eq('owner_email', email)
            .eq('template_code', code)
            .eq('template_type', 'teddy')
            .maybeSingle();

        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message,
                code: error.code,
                status
            });
        }

        if (!data) {
            return NextResponse.json({
                success: false,
                message: 'No project found with that email + code + template_type=teddy'
            });
        }

        // Check editable_until
        const now = new Date();
        const editableUntil = new Date(data.editable_until);
        const canEdit = now < editableUntil;

        return NextResponse.json({
            success: true,
            canEdit,
            project: {
                id: data.id,
                email: data.owner_email,
                template_code: data.template_code,
                template_type: data.template_type,
                slug: data.slug,
                is_published: data.is_published,
                editable_until: data.editable_until,
                has_data: !!data.data
            }
        });

    } catch (err) {
        return NextResponse.json({
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
}

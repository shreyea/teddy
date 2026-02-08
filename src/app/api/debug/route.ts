import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Debug endpoint - hit this to test database
export async function GET(request: Request) {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || 'shreyaupadhayay13@gmail.com';
    const code = url.searchParams.get('code') || 'qq';

    const results: Record<string, unknown> = {
        timestamp: new Date().toISOString(),
        inputs: { email, code },
    };

    try {
        // Check env vars
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        results.env = {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseKey,
            urlPrefix: supabaseUrl?.substring(0, 30) + '...',
        };

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ ...results, error: 'Missing env vars' });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // TEST 1: Can we connect at all?
        console.log('[DEBUG] Test 1: Basic connection...');
        const { count, error: countError } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true });

        results.test1_count = { count, error: countError?.message };

        // TEST 2: What columns exist?
        console.log('[DEBUG] Test 2: Fetch one row to see columns...');
        const { data: sample, error: sampleError } = await supabase
            .from('projects')
            .select('*')
            .limit(1);

        if (sample && sample.length > 0) {
            results.test2_columns = Object.keys(sample[0]);
            results.test2_sampleRow = {
                id: sample[0].id,
                owner_email: sample[0].owner_email,
                template_code: sample[0].template_code,
                template_type: sample[0].template_type,
                slug: sample[0].slug,
            };
        } else {
            results.test2_columns = 'No rows found or error';
            results.test2_error = sampleError?.message;
        }

        // TEST 3: Query with exact match
        console.log('[DEBUG] Test 3: Query with owner_email + template_code + template_type...');
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedCode = code.trim();

        const { data: matchData, error: matchError, status, statusText } = await supabase
            .from('projects')
            .select('*')
            .eq('owner_email', normalizedEmail)
            .eq('template_code', normalizedCode)
            .eq('template_type', 'teddy')
            .maybeSingle();

        results.test3_query = {
            normalizedEmail,
            normalizedCode,
            templateType: 'teddy',
        };
        results.test3_result = {
            found: !!matchData,
            id: matchData?.id,
            slug: matchData?.slug,
            status,
            statusText,
            error: matchError?.message,
            errorCode: matchError?.code,
        };

        // TEST 4: Query without template_type to check if email+code exists
        console.log('[DEBUG] Test 4: Query without template_type filter...');
        const { data: noTypeData, error: noTypeError } = await supabase
            .from('projects')
            .select('id, owner_email, template_code, template_type, slug')
            .eq('owner_email', normalizedEmail)
            .eq('template_code', normalizedCode)
            .maybeSingle();

        results.test4_noTypeFilter = {
            found: !!noTypeData,
            data: noTypeData,
            error: noTypeError?.message,
        };

        // TEST 5: Check all rows with this email
        console.log('[DEBUG] Test 5: All projects for this email...');
        const { data: allForEmail, error: allForEmailError } = await supabase
            .from('projects')
            .select('id, owner_email, template_code, template_type, slug')
            .eq('owner_email', normalizedEmail);

        results.test5_allForEmail = {
            count: allForEmail?.length || 0,
            rows: allForEmail,
            error: allForEmailError?.message,
        };

        return NextResponse.json(results, { status: 200 });

    } catch (err) {
        results.exception = err instanceof Error ? err.message : String(err);
        return NextResponse.json(results, { status: 500 });
    }
}

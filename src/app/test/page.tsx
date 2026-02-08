'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabase() {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const runTests = async () => {
        setLoading(true);
        setResult('Running tests...\n');

        try {
            // Test 1: Basic connection
            setResult(prev => prev + '\n1. Testing Supabase connection...');
            const { error: pingError } = await supabase.from('projects').select('count').limit(1);

            if (pingError) {
                setResult(prev => prev + `\n❌ Connection failed: ${pingError.message}`);
            } else {
                setResult(prev => prev + '\n✅ Connection successful!');
            }

            // Test 2: Query all projects
            setResult(prev => prev + '\n\n2. Fetching all projects...');
            const { data: allProjects, error: allError } = await supabase
                .from('projects')
                .select('id, owner_email, template_code, template_type')
                .limit(10);

            if (allError) {
                setResult(prev => prev + `\n❌ Query failed: ${allError.message}`);
            } else {
                setResult(prev => prev + `\n✅ Found ${allProjects?.length || 0} projects`);
                if (allProjects && allProjects.length > 0) {
                    allProjects.forEach((p: { owner_email: string; template_code: string; template_type: string }, i: number) => {
                        setResult(prev => prev + `\n  ${i + 1}. Email: ${p.owner_email}, Code: ${p.template_code}, Type: ${p.template_type}`);
                    });
                }
            }

            // Test 3: Query teddy projects specifically
            setResult(prev => prev + '\n\n3. Testing specific query (teddy template)...');
            const { data: teddyData, error: teddyError } = await supabase
                .from('projects')
                .select('id, owner_email, template_code, template_type')
                .eq('template_type', 'teddy')
                .limit(5);

            if (teddyError) {
                setResult(prev => prev + `\n❌ Error: ${teddyError.message}`);
            } else {
                setResult(prev => prev + `\n✅ Found ${teddyData?.length || 0} teddy projects`);
                if (teddyData && teddyData.length > 0) {
                    teddyData.forEach((p: { owner_email: string; template_code: string }, i: number) => {
                        setResult(prev => prev + `\n  ${i + 1}. Email: ${p.owner_email}, Code: ${p.template_code}`);
                    });
                }
            }

        } catch (err) {
            setResult(prev => prev + `\n\n❌ Unexpected error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const testSpecificUser = async (email: string, code: string) => {
        setLoading(true);
        setResult(`Testing login for: ${email} with code: ${code}\n`);

        try {
            const { data, error, status } = await supabase
                .from('projects')
                .select('*')
                .eq('owner_email', email)
                .eq('template_code', code)
                .eq('template_type', 'teddy')
                .single();

            if (error) {
                setResult(prev => prev + `\n❌ Error (${status}): ${error.message}\nCode: ${error.code}`);
            } else if (data) {
                setResult(prev => prev + `\n✅ Project found!\nID: ${data.id}\nSlug: ${data.slug}\nPublished: ${data.is_published}\nEditable until: ${data.editable_until}`);
            } else {
                setResult(prev => prev + `\n⚠️ No project found`);
            }
        } catch (err) {
            setResult(prev => prev + `\n❌ Exception: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>

            <div className="space-y-4 mb-6">
                <button
                    onClick={runTests}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Running...' : 'Run Basic Tests'}
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => testSpecificUser('shreyaupadhayay13@gmail.com', 'qq')}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        Test: shreya + qq
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
                <h2 className="font-semibold mb-2">Results:</h2>
                <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded overflow-auto max-h-96">
                    {result || 'Click a button to run tests...'}
                </pre>
            </div>
        </div>
    );
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // HYBRID UPLOAD STRATEGY
        // 1. Try Supabase if configured
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            const { data: uploadData, error } = await supabase
                .storage
                .from('portfolio-assets')
                .upload(`resume-${Date.now()}.pdf`, buffer, {
                    contentType: file.type,
                    upsert: true
                });

            if (!error) {
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('portfolio-assets')
                    .getPublicUrl(uploadData.path);

                return NextResponse.json({ success: true, url: publicUrl });
            }
            console.warn("Supabase upload failed, falling back to local:", error.message);
        }

        // 2. Fallback to Local Filesystem
        const path = join(process.cwd(), 'public', 'resume.pdf');
        await writeFile(path, buffer);
        console.log(`Saved CV locally to ${path}`);
        return NextResponse.json({ success: true, url: '/resume.pdf' });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        console.log("ServerAPI: Checking Config...", {
            urlProvided: !!url,
            keyProvided: !!key,
            isPlaceholder: url?.includes("placeholder")
        });

        if (!url || url.includes("placeholder")) {
            return NextResponse.json({
                success: false,
                error: "SERVER CONFIG ERROR: .env variables are missing or not loaded. Restart server?"
            }, { status: 500 });
        }

        const body = await request.json();
        const { profile, projects, expertise, education } = body;

        console.log("ServerAPI: Saving data...", { profileId: profile?.id });

        // 1. Save Profile (Mapping to NEW 'personal_info' table)
        // We force ID: 1 to ensure we always update the Single User Profile
        if (profile) {
            const personalInfoPayload = {
                id: 1,
                full_name: profile.name,
                role_title: profile.role,
                about_bio: profile.bio,
                location_address: profile.location,
                email_contact: profile.email,
                phone_contact: profile.phone,
                github_link: profile.github,
                linkedin_link: profile.linkedin,
                facebook_link: profile.facebook,
                resume_link: profile.resume_url,
                education_cgpa: profile.cgpa,
                education_degree: profile.degree,
                education_uni: profile.university,
                grad_year: profile.grad_year
            };

            const { error: profileError } = await supabase
                .from('personal_info')
                .upsert(personalInfoPayload);

            if (profileError) {
                console.error("ServerAPI: Profile Error", profileError);
                return NextResponse.json({ success: false, error: "Profile DB Error: " + profileError.message }, { status: 500 });
            }
        }

        // 3. Save Education (Wipe and Re-insert for perfect sync)
        if (education && Array.isArray(education)) {
            // Delete all existing entries to handle removals
            await supabase.from('education').delete().neq('id', 0);

            if (education.length > 0) {
                const eduPayload = education.map((e: any) => ({
                    institution: e.institution,
                    degree: e.degree,
                    year: e.year,
                    result: e.result
                }));
                const { error: eduError } = await supabase.from('education').insert(eduPayload);
                if (eduError) {
                    console.error("ServerAPI: Education Error", eduError);
                }
            }
        }

        // 4. Save Projects
        if (projects && Array.isArray(projects)) {
            for (const p of projects) {
                const projectPayload: any = {
                    title: p.title,
                    category: p.category,
                    description: p.description,
                    image_url: p.image_url || p.image, // Handle mapping
                    github_url: p.github_url || p.githubUrl,
                    link: p.link
                };
                if (p.id) projectPayload.id = p.id;

                const { error: projError } = await supabase.from('projects').upsert(projectPayload);
                if (projError) {
                    console.error("ServerAPI: Project Error", projError);
                }
            }
        }

        // 5. Save Posts
        if (body.posts && Array.isArray(body.posts)) {
            for (const post of body.posts) {
                const postPayload: any = {
                    content: post.content,
                    image_url: post.image,
                    created_at: post.date // Optional override, else DB default
                };
                if (post.id) postPayload.id = post.id;

                const { error: postError } = await supabase.from('posts').upsert(postPayload);
                if (postError) {
                    console.error("ServerAPI: Post Error", postError);
                }
            }
        }

        return NextResponse.json({ success: true, message: "Data saved successfully" });

    } catch (error: any) {
        console.error("ServerAPI: Critical Error", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

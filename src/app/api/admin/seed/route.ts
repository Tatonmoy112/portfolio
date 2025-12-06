import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import portfolioData from '@/data/portfolio-data.json';

export async function POST() {
    try {
        // 1. Seed Profile
        console.log("Seeding Profile...");
        const profileData = {
            name: portfolioData.profile.name,
            role: portfolioData.profile.role,
            bio: portfolioData.profile.bio,
            location: portfolioData.profile.location,
            email: portfolioData.profile.email,
            phone: portfolioData.profile.phone,
            github: portfolioData.profile.github,
            linkedin: portfolioData.profile.linkedin,
            resume_url: portfolioData.profile.resumeUrl,
            // New Stats
            cgpa: portfolioData.stats?.cgpa,
            degree: portfolioData.stats?.degree,
            university: portfolioData.stats?.university,
            grad_year: portfolioData.stats?.gradYear
        };

        const { error: profileError } = await supabase
            .from('profile')
            .upsert(profileData, { onConflict: 'email' });

        if (profileError) {
            console.error("Profile Seed Error:", profileError);
            return NextResponse.json({ success: false, message: 'Profile seeding failed: ' + profileError.message });
        }

        // 2. Seed Expertise (Delete all first to strictly sync with JSON)
        console.log("Seeding Expertise...");
        await supabase.from('expertise').delete().neq('id', 0); // Hack to delete all rows

        if (portfolioData.expertise) {
            for (const exp of portfolioData.expertise) {
                const { error: expError } = await supabase.from('expertise').insert({
                    category: exp.category,
                    skills: exp.skills
                });
                if (expError) console.error("Expertise Seed Error:", expError);
            }
        }

        // 3. Seed Projects
        console.log("Seeding Projects...");
        // Loop through projects and upsert based on ID (assuming ID 1, 2, 3...)
        // Since we don't have a stable UUID in JSON, we'll upsert by ID if possible, or just insert if ID is auto-inc.
        // For this simple seed, let's just insert. But to prevent dupes on re-sync, we ideally wipe and recreate OR match by title.
        // Let's wipe and recreate for simplicity in this MVP sync.
        await supabase.from('projects').delete().neq('id', 0);

        for (const project of portfolioData.projects) {
            const { error: projectError } = await supabase
                .from('projects')
                .insert({
                    title: project.title,
                    category: project.category,
                    description: project.description,
                    image_url: project.image,
                    github_url: project.githubUrl,
                    link: project.link
                });

            if (projectError) console.error("Project Seed Error", projectError);
        }

        return NextResponse.json({ success: true, message: 'Database Synced Successfully!' });

    } catch (err: any) {
        console.error("Seed API Error:", err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

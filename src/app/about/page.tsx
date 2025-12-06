import React from "react";
import { supabase } from "@/lib/supabase";
import { AboutClient } from "@/components/about-client";

export const revalidate = 60;

export default async function About() {
    // Parallel Data Fetching
    let profileData, educationData, expertiseData;

    try {
        const results = await Promise.all([
            supabase.from('personal_info').select('*').limit(1).single(),
            supabase.from('education').select('*').order('id', { ascending: false }),
            supabase.from('expertise').select('*').order('id')
        ]);
        profileData = results[0].data;
        educationData = results[1].data;
        expertiseData = results[2].data;
    } catch (error) {
        console.error("About Page Data Fetch Error:", error);
    }

    // Data Transformation
    const profile = {
        name: profileData?.full_name || "Tanvir Ahmed",
        bio: profileData?.about_bio || "",
        resumeUrl: profileData?.resume_link || ""
    };

    let education = [];
    if (educationData && educationData.length > 0) {
        education = educationData.map((e: any) => ({
            degree: e.degree,
            institution: e.institution,
            year: e.year,
            details: e.result
        }));
    } else if (profileData?.education_degree) {
        // Fallback to legacy profile columns
        education = [{
            degree: profileData.education_degree,
            institution: profileData.education_uni || "University",
            year: profileData.grad_year || "Present",
            details: `CGPA: ${profileData.education_cgpa || "N/A"}`
        }];
    } else {
        // Default dummy data if absolutely nothing exists
        education = [{
            degree: "B.Sc. in Information Technology",
            institution: "Daffodil International University",
            year: "2022 - 2026",
            details: "CGPA: 3.52"
        }];
    }

    return (
        <AboutClient
            profile={profile}
            expertise={expertiseData || []}
            education={education}
        />
    );
}

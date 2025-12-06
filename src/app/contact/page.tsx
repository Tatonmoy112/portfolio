import React from "react";
import { supabase } from "@/lib/supabase";
import { ContactClient } from "@/components/contact-client";

export const revalidate = 60;

export default async function Contact() {
    const { data: profileData } = await supabase.from('personal_info').select('*').limit(1).single();

    const profile = {
        email: profileData?.email_contact || "",
        phone: profileData?.phone_contact || "",
        linkedin: profileData?.linkedin_link || "",
        github: profileData?.github_link || "",
        facebook: profileData?.facebook_link || "",
        resumeUrl: profileData?.resume_link || ""
    };

    return <ContactClient profile={profile} />;
}

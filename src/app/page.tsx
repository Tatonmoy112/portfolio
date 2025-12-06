import React from "react";
import { supabase } from "@/lib/supabase";
import { HomeClient } from "@/components/home-client";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function Home() {
  // Parallel Data Fetching
  // Parallel Data Fetching
  let profileData, expertiseData, educationData, postsData;

  try {
    const results = await Promise.all([
      supabase.from('personal_info').select('*').limit(1).single(),
      supabase.from('expertise').select('*').order('id'),
      supabase.from('education').select('*').order('year', { ascending: false }),
      supabase.from('posts').select('*').order('created_at', { ascending: false })
    ]);

    profileData = results[0].data;
    expertiseData = results[1].data;
    educationData = results[2].data;
    postsData = results[3].data;

    if (results[0].error) console.error("Profile Fetch Error:", results[0].error);

  } catch (error) {
    console.error("Home Page Data Fetch Error:", error);
    // Fallback will be handled by default values below
  }

  // Transform Data
  const profile = {
    name: profileData?.full_name || "Tanvir Ahmed",
    role: profileData?.role_title || "Software Engineer",
    bio: profileData?.about_bio || "Connecting digital solutions with human experiences.",
    location: profileData?.location_address || "Dhaka, Bangladesh",
    email: profileData?.email_contact || "contact@example.com",
    phone: profileData?.phone_contact || "",
    github: profileData?.github_link || "",
    linkedin: profileData?.linkedin_link || "",
    resumeUrl: profileData?.resume_link || ""
  };

  const posts = postsData?.map((p: any) => ({
    id: p.id,
    content: p.content,
    image: p.image_url,
    date: p.created_at
  })) || [];

  return (
    <HomeClient
      profile={profile}
      expertise={expertiseData || []}
      educationList={educationData || []}
      posts={posts}
    />
  );
}

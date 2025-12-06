import React from "react";
import { supabase } from "@/lib/supabase";
import { ProjectsClient } from "@/components/projects-client";

export const revalidate = 60;

export default async function Projects() {
    const { data } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });

    const projects = data?.map((p: any) => ({
        ...p,
        image: p.image_url,
        githubUrl: p.github_url
    })) || [];

    return <ProjectsClient projects={projects} />;
}

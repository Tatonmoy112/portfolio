"use client";

import React, { useState, useEffect } from "react";
import { Save, LogOut, User, Briefcase, FileText, Loader2, RefreshCw, Menu, X, LayoutDashboard, Mail, Upload, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import portfolioData from "@/data/portfolio-data.json";
import { supabase } from "@/lib/supabase";
import { uploadToImgBB } from "@/lib/imgbb";
import { ensurePath } from "@/lib/utils";

export default function StudioPage() {
    const [activeTab, setActiveTab] = useState("profile");
    // Initialize with local JSON as fallback, but we will overwrite with DB data
    const [data, setData] = useState<any>(portfolioData);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: profileData } = await supabase.from('personal_info').select('*').limit(1).single();
            const { data: expertiseData } = await supabase.from('expertise').select('*').order('id');
            const { data: projectsData } = await supabase.from('projects').select('*').order('id');
            const { data: educationData } = await supabase.from('education').select('*').order('id');
            const { data: postsData } = await supabase.from('posts').select('*').order('created_at', { ascending: false });

            // Merge DB data into state structure
            const newProfile = profileData ? {
                id: profileData.id,
                name: profileData.full_name,
                role: profileData.role_title,
                bio: profileData.about_bio,
                location: profileData.location_address,
                email: profileData.email_contact,
                phone: profileData.phone_contact,
                github: profileData.github_link,
                linkedin: profileData.linkedin_link,
                resumeUrl: profileData.resume_link
            } : data.profile;

            const newStats = profileData ? {
                cgpa: profileData.education_cgpa || "",
                degree: profileData.education_degree || "",
                university: profileData.education_uni || "",
                gradYear: profileData.grad_year || ""
            } : data.stats;

            const newProjects = projectsData?.map((p: any) => ({
                ...p,
                image: p.image_url,
                githubUrl: p.github_url
            })) || [];

            const newPosts = postsData?.map((p: any) => ({
                id: p.id,
                content: p.content,
                image: p.image_url,
                date: p.created_at
            })) || [];

            const { data: messagesData } = await supabase.from('messages').select('*').order('created_at', { ascending: false });

            setData({
                profile: newProfile,
                stats: newStats,
                expertise: expertiseData || [],
                education: educationData || [],
                projects: newProjects,
                posts: newPosts,
                messages: messagesData || []
            });
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Check Auth on Mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // 1. Check for cookie (Legacy/Localhost support)
                const hasCookie = document.cookie.includes("admin_session=true");

                // 2. Check for Supabase session (Primary for Static Site)
                const { data: { session } } = await supabase.auth.getSession();

                // 3. Strict Check based on Environment
                const isStaticHost = window.location.hostname.includes("github.io");

                let isAuthorized = false;

                if (isStaticHost) {
                    // On GitHub Pages, we CANNOT trust the cookie alone (no server to verify).
                    // We MUST have a valid Supabase session.
                    if (session) {
                        isAuthorized = true;
                    }
                } else {
                    // On Localhost, allow either (Legacy Password OR Supabase)
                    if (hasCookie || session) {
                        isAuthorized = true;
                    }
                }

                if (!isAuthorized) {
                    // Redirect if not authorized
                    console.warn("Unauthorized access attempt. Redirecting to login.");
                    router.push("/login?next=/login/studio");
                } else {
                    // Success
                    setIsAuthenticated(true);
                    fetchData();
                }
            } catch (err) {
                console.error("Auth Check Error:", err);
                router.push("/login");
            }
        };
        checkAuth();
    }, []);

    // 3. Idle Timeout Logic
    useEffect(() => {
        if (!isAuthenticated) return;

        let timeoutId: NodeJS.Timeout;
        const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                alert("Session timed out due to inactivity.");
                handleLogout();
            }, TIMEOUT_DURATION);
        };

        // Events to track activity
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

        // Attach listeners
        const handleActivity = () => resetTimer();
        events.forEach(event => window.addEventListener(event, handleActivity));

        // Start timer
        resetTimer();

        // Cleanup
        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [isAuthenticated]);

    // Prevent flashing content before auth check
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-neutral-500 animate-spin" />
            </div>
        );
    }



    // ... (handleSave remains same) ...
    const handleSave = async () => {
        setSaving(true);
        try {
            const profilePayload = {
                id: data.profile.id,
                name: data.profile.name,
                role: data.profile.role,
                bio: data.profile.bio,
                location: data.profile.location,
                email: data.profile.email,
                phone: data.profile.phone,
                github: data.profile.github,
                linkedin: data.profile.linkedin,
                facebook: data.profile.facebook,
                resume_url: data.profile.resumeUrl,
                cgpa: data.stats.cgpa,
                degree: data.stats.degree,
                university: data.stats.university,
                grad_year: data.stats.gradYear
            };

            const projectsPayload = data.projects.map((p: any) => ({
                id: p.id,
                title: p.title,
                category: p.category,
                description: p.description,
                image_url: p.image,
                github_url: p.githubUrl,
                link: p.link
            }));

            const educationPayload = (data.education || []).map((e: any) => ({
                institution: e.institution,
                degree: e.degree,
                year: e.year,
                result: e.result
            }));

            const postsPayload = (data.posts || []).map((p: any) => ({
                id: p.id,
                content: p.content,
                image: p.image,
                date: p.date
            }));

            const response = await fetch(ensurePath('/api/admin/save'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile: profilePayload,
                    projects: projectsPayload,
                    education: educationPayload,
                    posts: postsPayload
                })
            });

            const result = await response.json();
            if (!result.success) throw new Error(result.error);

            try {
                await supabase.from('expertise').delete().neq('id', 0);
                if (data.expertise?.length > 0) {
                    const infoToInsert = data.expertise.map((e: any) => ({
                        category: e.category,
                        skills: e.skills
                    }));
                    await supabase.from('expertise').insert(infoToInsert);
                }
            } catch (e: any) { console.warn("Expertise save failed:", e); }

            alert("Changes saved via Server API!");
            await fetchData();
        } catch (error: any) {
            console.error("Save Error:", error);
            alert("Failed to save changes: " + error.message);
        } finally {
            setSaving(false);
        }
    };
    const handleLogout = async () => {
        try {
            await fetch(ensurePath('/api/auth/logout'), { method: 'POST' });
            window.location.href = ensurePath('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
            {/* Top Navigation Bar */}
            <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur-md z-40 sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-white">S</span>
                        </div>
                        <span className="font-bold text-xl">Studio.</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase font-mono text-neutral-500 hidden md:inline-block">
                        {process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") ? "⚠️ NO DB" : "● Connected"}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
                    >
                        <LogOut size={16} /> <span className="hidden md:inline">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Secondary Navigation - Tabs */}
            <div className="border-b border-neutral-800 bg-black sticky top-16 z-30 px-6 py-1 overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                    <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<User size={16} />} label="Profile Info" />
                    <TabButton active={activeTab === "stats"} onClick={() => setActiveTab("stats")} icon={<FileText size={16} />} label="Stats & CV" />
                    <TabButton active={activeTab === "projects"} onClick={() => setActiveTab("projects")} icon={<Briefcase size={16} />} label="Projects" />
                    <TabButton active={activeTab === "posts"} onClick={() => setActiveTab("posts")} icon={<LayoutDashboard size={16} />} label="Status Posts" />
                    <TabButton active={activeTab === "messages"} onClick={() => setActiveTab("messages")} icon={<Mail size={16} />} label="Inbox" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">
                        {activeTab === "profile" && "Edit Profile"}
                        {activeTab === "stats" && "Vital Stats"}
                        {activeTab === "projects" && "Manage Projects"}
                        {activeTab === "posts" && "Manage Posts"}
                        {activeTab === "messages" && "Inbox Messages"}
                    </h1>

                    <div className="flex gap-3">
                        <button
                            onClick={fetchData}
                            className="bg-neutral-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-neutral-700 transition-colors flex items-center gap-2"
                            title="Reload from DB"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving || loading}
                            className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? (
                                <><Loader2 size={18} className="animate-spin" /> Saving...</>
                            ) : (
                                <><Save size={18} /> Save Changes</>
                            )}
                        </button>
                    </div>
                </div >

                {
                    loading ? (
                        <div className="flex justify-center items-center h-64" >
                            <Loader2 className="w-8 h-8 text-neutral-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="max-w-3xl">
                            {activeTab === "profile" && (
                                <div className="space-y-6">
                                    <InputGroup label="Display Name" value={data.profile.name} onChange={(v: string) => setData({ ...data, profile: { ...data.profile, name: v } })} />
                                    <InputGroup label="Role Title" value={data.profile.role} onChange={(v: string) => setData({ ...data, profile: { ...data.profile, role: v } })} />
                                    <TextAreaGroup label="Bio" value={data.profile.bio} onChange={(v: string) => setData({ ...data, profile: { ...data.profile, bio: v } })} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Location" value={data.profile.location} onChange={(v: string) => setData({ ...data, profile: { ...data.profile, location: v } })} />
                                        <InputGroup label="Email" value={data.profile.email} onChange={(v: string) => setData({ ...data, profile: { ...data.profile, email: v } })} />
                                    </div>
                                </div>
                            )}

                            {activeTab === "stats" && (
                                <div className="space-y-6">
                                    <div className="p-6 border border-neutral-800 rounded-xl bg-neutral-900/50">
                                        <h3 className="font-bold text-lg mb-4">CV / Resume</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <p className="text-sm text-neutral-400 mb-2">Current File</p>
                                                    <div className="flex items-center gap-2 p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                                                        <FileText size={16} className="text-blue-500" />
                                                        <a href={data.profile.resumeUrl || "#"} target="_blank" className="text-sm text-blue-400 hover:underline truncate">
                                                            {data.profile.resumeUrl || "No CV Uploaded"}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm text-neutral-400 mb-2 block">Upload New PDF/Word</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        const formData = new FormData();
                                                        formData.append("file", file);

                                                        try {
                                                            const res = await fetch(ensurePath("/api/upload/cv"), {
                                                                method: "POST",
                                                                body: formData,
                                                            });
                                                            const result = await res.json();

                                                            if (result.success) {
                                                                setData({ ...data, profile: { ...data.profile, resumeUrl: result.url } });
                                                                // Auto-save the URL to profile
                                                                await supabase.from('profile').upsert({ resume_url: result.url });
                                                                alert("Upload Successful & Saved!");
                                                            } else {
                                                                alert("Upload Failed: " + result.message);
                                                            }
                                                        } catch (err) {
                                                            alert("Error uploading file.");
                                                        }
                                                    }}
                                                    className="block w-full text-sm text-neutral-400
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-blue-600 file:text-white
                                                    hover:file:bg-blue-700
                                                    cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 border border-neutral-800 rounded-xl bg-neutral-900/50">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-lg">Education History</h3>
                                            <div className="text-xs text-neutral-500">Add multiple schools</div>
                                        </div>
                                        <div className="space-y-4">
                                            {data.education?.map((edu: any, idx: number) => (
                                                <div key={idx} className="p-4 border border-neutral-800 rounded-lg bg-black/40">
                                                    <div className="space-y-4">
                                                        <InputGroup label="Institution" value={edu.institution} onChange={(v: string) => {
                                                            const newEdu = [...data.education];
                                                            newEdu[idx].institution = v;
                                                            setData({ ...data, education: newEdu });
                                                        }} />
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <InputGroup label="Degree" value={edu.degree} onChange={(v: string) => {
                                                                const newEdu = [...data.education];
                                                                newEdu[idx].degree = v;
                                                                setData({ ...data, education: newEdu });
                                                            }} />
                                                            <InputGroup label="Year" value={edu.year} onChange={(v: string) => {
                                                                const newEdu = [...data.education];
                                                                newEdu[idx].year = v;
                                                                setData({ ...data, education: newEdu });
                                                            }} />
                                                        </div>
                                                        <div className="flex gap-2 items-end">
                                                            <div className="flex-1">
                                                                <InputGroup label="Result (e.g. CGPA)" value={edu.result} onChange={(v: string) => {
                                                                    const newEdu = [...data.education];
                                                                    newEdu[idx].result = v;
                                                                    setData({ ...data, education: newEdu });
                                                                }} />
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    const newEdu = data.education.filter((_: any, i: number) => i !== idx);
                                                                    setData({ ...data, education: newEdu });
                                                                }}
                                                                className="mb-1 p-3 bg-red-900/20 text-red-500 rounded-lg hover:bg-red-900/40"
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setData({ ...data, education: [...(data.education || []), { institution: "New Institution", degree: "Degree", year: "2024", result: "" }] })}
                                                className="w-full py-2 border border-dashed border-neutral-800 rounded-lg text-sm text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors"
                                            >
                                                + Add Education
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 border border-neutral-800 rounded-xl bg-neutral-900/50">
                                        <h3 className="font-bold text-lg mb-4">Expertise & Skills</h3>
                                        <div className="space-y-4">
                                            {data.expertise?.map((exp: any, idx: number) => (
                                                <div key={idx} className="p-4 border border-neutral-800 rounded-lg bg-black/40">
                                                    <div className="mb-2">
                                                        <InputGroup label="Category Name" value={exp.category} onChange={(v: string) => {
                                                            const newExp = [...data.expertise];
                                                            newExp[idx].category = v;
                                                            setData({ ...data, expertise: newExp });
                                                        }} />
                                                    </div>
                                                    <div className="flex gap-2 items-end">
                                                        <div className="flex-1">
                                                            <InputGroup label="Skills (Comma separated)" value={Array.isArray(exp.skills) ? exp.skills.join(", ") : exp.skills} onChange={(v: string) => {
                                                                const newExp = [...data.expertise];
                                                                newExp[idx].skills = v.split(",").map(s => s.trim());
                                                                setData({ ...data, expertise: newExp });
                                                            }} />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newExp = data.expertise.filter((_: any, i: number) => i !== idx);
                                                                setData({ ...data, expertise: newExp });
                                                            }}
                                                            className="mb-1 p-3 bg-red-900/20 text-red-500 rounded-lg hover:bg-red-900/40"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setData({ ...data, expertise: [...(data.expertise || []), { category: "New Category", skills: [] }] })}
                                                className="w-full py-2 border border-dashed border-neutral-800 rounded-lg text-sm text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors"
                                            >
                                                + Add Skill Category
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "projects" && (
                                <div className="space-y-6">
                                    {data.projects.map((project: any, idx: number) => (
                                        <div key={idx} className="p-6 border border-neutral-800 rounded-xl bg-neutral-900/50">
                                            <div className="flex justify-between mb-4">
                                                <h3 className="font-bold text-lg">Project #{idx + 1}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-neutral-500 font-mono">{project.id || 'New'}</span>
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm("Are you sure you want to delete this project?")) return;

                                                            if (project.id) {
                                                                const { error } = await supabase.from('projects').delete().eq('id', project.id);
                                                                if (error) {
                                                                    alert("Failed to delete project: " + error.message);
                                                                    return;
                                                                }
                                                            }
                                                            // Remove from local state
                                                            const newProjects = data.projects.filter((_: any, i: number) => i !== idx);
                                                            setData({ ...data, projects: newProjects });
                                                        }}
                                                        className="text-red-500 hover:text-red-400 p-1 hover:bg-white/5 rounded transition-colors"
                                                        title="Delete Project"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <InputGroup label="Project Title" value={project.title} onChange={(v: string) => {
                                                    const newProj = [...data.projects];
                                                    newProj[idx].title = v;
                                                    setData({ ...data, projects: newProj });
                                                }} />
                                                <div className="space-y-2">
                                                    <label className="text-sm text-neutral-400 font-medium">Project Image</label>
                                                    <div className="flex gap-2">
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                value={project.image || ""}
                                                                onChange={(e) => {
                                                                    const newProj = [...data.projects];
                                                                    newProj[idx].image = e.target.value;
                                                                    setData({ ...data, projects: newProj });
                                                                }}
                                                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                                                                placeholder="Image URL..."
                                                            />
                                                        </div>
                                                        <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white px-4 rounded-lg flex items-center justify-center transition-colors min-w-[60px]" title="Upload to ImgBB">
                                                            <Upload size={20} />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        const url = await uploadToImgBB(file);
                                                                        if (url) {
                                                                            const newProj = [...data.projects];
                                                                            newProj[idx].image = url;
                                                                            setData({ ...data, projects: newProj });
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                    {project.image && (
                                                        <div className="mt-2 h-32 w-full bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden relative group">
                                                            <img src={project.image} alt="Preview" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                                            <a href={project.image} target="_blank" className="absolute bottom-2 right-2 bg-black/50 text-xs px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">View</a>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <InputGroup label="Category" value={project.category} onChange={(v: string) => {
                                                        const newProj = [...data.projects];
                                                        newProj[idx].category = v;
                                                        setData({ ...data, projects: newProj });
                                                    }} />
                                                    <InputGroup label="GitHub URL" value={project.githubUrl || ""} onChange={(v: string) => {
                                                        const newProj = [...data.projects];
                                                        newProj[idx].githubUrl = v;
                                                        setData({ ...data, projects: newProj });
                                                    }} />
                                                    <InputGroup label="Live Link" value={project.link || ""} onChange={(v: string) => {
                                                        const newProj = [...data.projects];
                                                        newProj[idx].link = v;
                                                        setData({ ...data, projects: newProj });
                                                    }} />
                                                </div>
                                                <TextAreaGroup label="Description" value={project.description} onChange={(v: string) => {
                                                    const newProj = [...data.projects];
                                                    newProj[idx].description = v;
                                                    setData({ ...data, projects: newProj });
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setData({ ...data, projects: [...data.projects, { title: "New Project", category: "Web", description: "", image: "", link: "", githubUrl: "" }] })}
                                        className="w-full py-4 border-2 border-dashed border-neutral-800 rounded-xl text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors">
                                        + Add New Project
                                    </button>
                                </div>
                            )}

                            {activeTab === "posts" && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-white">Status Updates</h2>
                                        <button
                                            onClick={() => setData({ ...data, posts: [{ content: "New update...", image: "", date: new Date().toISOString() }, ...(data.posts || [])] })}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            + Add Post
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {data.posts?.map((post: any, idx: number) => (
                                            <div key={idx} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl relative group">
                                                <div className="flex justify-between mb-4">
                                                    <span className="text-xs font-mono text-neutral-500">{new Date(post.date).toLocaleDateString()}</span>
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm("Are you sure you want to delete this post?")) return;

                                                            if (post.id) {
                                                                const { error } = await supabase.from('posts').delete().eq('id', post.id);
                                                                if (error) {
                                                                    alert("Failed to delete post: " + error.message);
                                                                    return;
                                                                }
                                                            }

                                                            const newPosts = data.posts.filter((_: any, i: number) => i !== idx);
                                                            setData({ ...data, posts: newPosts });
                                                        }}
                                                        className="text-red-500 hover:text-white text-xs"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <div className="space-y-4">
                                                    <TextAreaGroup
                                                        label="Content"
                                                        value={post.content}
                                                        onChange={(v: string) => {
                                                            const newPosts = [...(data.posts || [])];
                                                            newPosts[idx].content = v;
                                                            setData({ ...data, posts: newPosts });
                                                        }}
                                                    />
                                                    <div className="space-y-2">
                                                        <label className="text-sm text-neutral-400 font-medium">Post Image (Optional)</label>
                                                        <div className="flex gap-2">
                                                            <div className="flex-1">
                                                                <input
                                                                    type="text"
                                                                    value={post.image || ""}
                                                                    onChange={(e) => {
                                                                        const newPosts = [...(data.posts || [])];
                                                                        newPosts[idx].image = e.target.value;
                                                                        setData({ ...data, posts: newPosts });
                                                                    }}
                                                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                                                                    placeholder="Image URL..."
                                                                />
                                                            </div>
                                                            <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white px-4 rounded-lg flex items-center justify-center transition-colors min-w-[60px]" title="Upload to ImgBB">
                                                                <Upload size={20} />
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            const url = await uploadToImgBB(file);
                                                                            if (url) {
                                                                                const newPosts = [...(data.posts || [])];
                                                                                newPosts[idx].image = url;
                                                                                setData({ ...data, posts: newPosts });
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                        {post.image && (
                                                            <div className="mt-2 h-40 w-full bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden relative group">
                                                                <img src={post.image} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                                <a href={post.image} target="_blank" className="absolute bottom-2 right-2 bg-black/50 text-xs px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">View</a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!data.posts || data.posts.length === 0) && (
                                            <p className="text-neutral-500 text-center py-10">No posts yet.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "messages" && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-white">Inbox ({data.messages?.length || 0})</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {data.messages?.map((msg: any, idx: number) => (
                                            <div key={idx} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl relative group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-white text-lg">{msg.name}</h3>
                                                        <a href={`mailto:${msg.email}`} className="text-blue-400 text-sm font-mono hover:underline">{msg.email}</a>
                                                    </div>
                                                    <span className="text-xs text-neutral-500 font-mono">
                                                        {new Date(msg.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
                                                    <p className="text-neutral-300 text-sm whitespace-pre-wrap">{msg.message}</p>
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    <button
                                                        className="text-red-500 text-xs hover:text-white transition-colors"
                                                        onClick={async () => {
                                                            if (!confirm("Delete this message?")) return;
                                                            const { error } = await supabase.from('messages').delete().eq('id', msg.id);
                                                            if (!error) {
                                                                const newMessages = data.messages.filter((m: any) => m.id !== msg.id);
                                                                setData({ ...data, messages: newMessages });
                                                            }
                                                        }}
                                                    >
                                                        Delete Message
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {(!data.messages || data.messages.length === 0) && (
                                            <div className="text-center py-20 text-neutral-500 bg-neutral-900/30 rounded-2xl border border-neutral-800/50">
                                                <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                <p>No messages in your inbox.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }
            </div >
        </div >
    );
}

function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors transition-all whitespace-nowrap ${active
                ? "border-blue-600 text-blue-500 font-medium bg-blue-500/5"
                : "border-transparent text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
        >
            {icon}
            <span className="text-sm">{label}</span>
        </button>
    )
}

function InputGroup({ label, value, onChange }: any) {
    return (
        <div className="space-y-2">
            <label className="text-sm text-neutral-400 font-medium">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
        </div>
    )
}

function TextAreaGroup({ label, value, onChange }: any) {
    return (
        <div className="space-y-2">
            <label className="text-sm text-neutral-400 font-medium">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-none"
            />
        </div>
    )
}

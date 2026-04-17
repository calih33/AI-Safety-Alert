import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { fetchProfile, updateProfile } from "../services/profile";

export default function SettingsPage() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        email: "",
        campus_id: "",
        name: "",
    });

    const token = useMemo(() => localStorage.getItem("token"), []);

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    })();

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        async function loadProfile() {
            setLoading(true);
            setError("");

            try {
                const data = await fetchProfile();
                setProfile({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    email: data.email || "",
                    campus_id: data.campus_id || "",
                    name: data.name || "",
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [navigate, token]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const updatedUser = await updateProfile({
                first_name: profile.first_name,
                last_name: profile.last_name,
                email: profile.email,
            });

            const mergedUser = {
                ...user,
                ...updatedUser,
            };

            localStorage.setItem("user", JSON.stringify(mergedUser));
            setProfile((prev) => ({
                ...prev,
                name: updatedUser.name,
                email: updatedUser.email,
                campus_id: updatedUser.campus_id,
            }));
            setSuccess("Profile updated successfully.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    }

    const displayName = `${profile.first_name || user.first_name || "Student"} ${profile.last_name || user.last_name || ""}`.trim();
    const displayEmail = profile.email || user.email || "student@bcit.ca";

    return (
        <div className="min-h-screen bg-[#f3f8ff] text-slate-900 antialiased">
            <div className="hidden md:flex min-h-screen p-4 gap-4 w-full">
                <Sidebar userName={profile.name || user.name || "Student"} activePage="settings" isMenuOpen={isMenuOpen} />

                <div className="flex-1 min-w-0 bg-white rounded-[32px] border border-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.08)] overflow-hidden">
                    <Navbar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} isSidebarOpen={isMenuOpen} />

                    <main className="p-6 lg:p-8">
                        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-100 text-slate-950 p-6 lg:p-8 mb-6">
                            <p className="inline-flex items-center rounded-full border border-white/50 bg-white/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-800 mb-4 backdrop-blur-sm">
                                Profile Settings
                            </p>
                            <h2 className="text-3xl font-bold tracking-tight">Edit your profile</h2>
                            <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-800 leading-7">
                                Update your first name, last name, and email so your account details stay accurate across reports, notifications, and admin views.
                            </p>
                        </div>

                        {loading ? (
                            <div className="grid gap-4 max-w-3xl">
                                <div className="h-40 rounded-[28px] bg-slate-50 animate-pulse" />
                                <div className="h-24 rounded-[28px] bg-slate-50 animate-pulse" />
                            </div>
                        ) : (
                            <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
                                <form onSubmit={handleSubmit} className="rounded-[32px] bg-[#f9fbff] border border-slate-100 p-6 lg:p-8 shadow-sm">
                                    <div className="flex items-center justify-between gap-4 mb-6">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.24em] mb-1">Account</p>
                                            <h3 className="text-2xl font-semibold text-slate-950">Personal information</h3>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="inline-flex items-center justify-center rounded-2xl bg-sky-100 text-slate-950 px-5 py-3 text-sm font-semibold hover:bg-sky-50 disabled:opacity-60 transition shadow-lg shadow-sky-200/30"
                                        >
                                            {saving ? "Saving..." : "Save Profile"}
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                            {success}
                                        </div>
                                    )}

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                id="first_name"
                                                name="first_name"
                                                type="text"
                                                value={profile.first_name}
                                                onChange={handleChange}
                                                className="w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                                                placeholder="First name"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                id="last_name"
                                                name="last_name"
                                                type="text"
                                                value={profile.last_name}
                                                onChange={handleChange}
                                                className="w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                                                placeholder="Last name"
                                                required
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={profile.email}
                                                onChange={handleChange}
                                                className="w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                                                placeholder="Email address"
                                                required
                                            />
                                        </div>
                                    </div>
                                </form>

                                <aside className="space-y-4">
                                    <div className="rounded-[28px] bg-white border border-slate-100 p-5 shadow-sm">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.24em] mb-2">Profile Summary</p>
                                        <p className="text-xl font-semibold text-slate-950 mb-1">{displayName}</p>
                                        <p className="text-sm text-slate-500">{displayEmail}</p>
                                    </div>

                                    <div className="rounded-[28px] bg-white border border-slate-100 p-5 shadow-sm">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.24em] mb-4">Read Only</p>
                                        <div className="space-y-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 mb-1">Campus ID</p>
                                                <p className="font-medium text-slate-900">{profile.campus_id || user.campus_id || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Email</p>
                                                <p className="font-medium text-slate-900">{displayEmail}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Display Name</p>
                                                <p className="font-medium text-slate-900">{profile.name || user.name || "Student"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <div className="md:hidden min-h-screen p-3">
                <div className="bg-white rounded-[28px] min-h-screen overflow-hidden border border-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                    <Navbar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} isSidebarOpen={isMenuOpen} />
                    <Sidebar userName={profile.name || user.name || "Student"} activePage="settings" isMenuOpen={isMenuOpen} />

                    <main className="p-4 pt-6">
                        <div className="rounded-[28px] bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-100 text-slate-950 p-5 mb-5">
                            <p className="inline-flex items-center rounded-full border border-white/50 bg-white/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-800 mb-3 backdrop-blur-sm">
                                Profile Settings
                            </p>
                            <h2 className="text-2xl font-bold">Edit your profile</h2>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                <div className="h-28 rounded-[24px] bg-slate-50 animate-pulse" />
                                <div className="h-24 rounded-[24px] bg-slate-50 animate-pulse" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <form onSubmit={handleSubmit} className="rounded-[28px] bg-[#f9fbff] border border-slate-100 p-4 shadow-sm space-y-4">
                                    {error && (
                                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                            {success}
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="first_name_mobile" className="block text-sm font-medium text-slate-700 mb-2">
                                            First Name
                                        </label>
                                        <input
                                            id="first_name_mobile"
                                            name="first_name"
                                            type="text"
                                            value={profile.first_name}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="last_name_mobile" className="block text-sm font-medium text-slate-700 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            id="last_name_mobile"
                                            name="last_name"
                                            type="text"
                                            value={profile.last_name}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email_mobile" className="block text-sm font-medium text-slate-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            id="email_mobile"
                                            name="email"
                                            type="email"
                                            value={profile.email}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full rounded-2xl bg-sky-100 text-slate-950 px-6 py-3 text-sm font-semibold hover:bg-sky-50 disabled:opacity-60 transition shadow-lg shadow-sky-200/30"
                                    >
                                        {saving ? "Saving..." : "Save Profile"}
                                    </button>
                                </form>

                                <div className="rounded-[28px] bg-white border border-slate-100 p-4 shadow-sm">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.24em] mb-3">Profile Summary</p>
                                    <p className="text-lg font-semibold text-slate-950">{displayName}</p>
                                    <p className="text-sm text-slate-500">{displayEmail}</p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

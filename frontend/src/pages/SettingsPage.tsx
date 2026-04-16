import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function SettingsPage() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return { name: "Student", email: "student@bcit.ca", campus_id: "N/A" };
        }
    })();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    // Inside SettingsPage.tsx
    return (
        <div className="min-h-screen bg-[#f7f7fb]">
            {/* Desktop View: added w-full here */}
            <div className="hidden md:flex min-h-screen p-4 gap-4 w-full">
                <Sidebar userName={user.name || "Student"} activePage="settings" isMenuOpen={isMenuOpen} />

                <div className="flex-1 min-w-0 bg-[#f7f7fb]">
                    <div className="bg-white rounded-[32px] min-h-full p-5 lg:p-6 shadow-sm border border-gray-100">
                        <Navbar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} isSidebarOpen={isMenuOpen} />

                        {/* Physical Change: Removed max-w-2xl so it fills the white card */}
                        <main className="pt-6 w-full">
                            <h2 className="text-3xl font-semibold text-gray-900 mb-8">Settings</h2>
                            {/* ... rest of your account info content ... */}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
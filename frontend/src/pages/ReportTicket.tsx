import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { createTicket } from "../services/tickets";

export default function ReportTicket() {
  const navigate = useNavigate();

  // Form fields for creating a new ticket
  const [form, setForm] = useState({
    title: "",
    location: "",
    content: "",
  });

  // Loading state while submitting the form
  const [loading, setLoading] = useState(false);

  // Error message shown if ticket creation fails
  const [error, setError] = useState("");

  // Controls whether the sidebar is open or closed
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  // Protects the page so only logged in users can access it
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Gets the logged in user's name from localStorage
  const userName = (() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return "Student";
    }

    try {
      const user = JSON.parse(storedUser);
      return user?.name || "Student";
    } catch {
      return "Student";
    }
  })();

  // Updates form values when user types in inputs or textarea
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handles ticket submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createTicket(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  }

  // Opens or closes the sidebar menu
  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  // Closes the sidebar menu
  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb]">
      {/* DESKTOP VIEW*/}
      <div className="hidden md:flex min-h-screen p-4 gap-4">
        {/* Desktop sidebar */}
                <Sidebar
                userName={userName}
                activePage="report"
                isMenuOpen={isMenuOpen}
              />

        {/* Desktop main content area */}
        <div className="flex-1 min-w-0 bg-[#f7f7fb] rounded-[32px]">
          <div className="bg-white rounded-[32px] min-h-full p-5 lg:p-6">
            {/* Navbar contains the hamburger menu button */}
            <Navbar
              appName="Campus Ticketing System"
              onMenuClick={toggleMenu}
              isSidebarOpen={isMenuOpen}
            />

            <main className="pt-6">
              {/* Report ticket content wrapper */}
              <div className="rounded-[28px] bg-[#f6f7fb] p-4 lg:p-6 min-h-[calc(100vh-10rem)]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Main <span className="mx-2">»</span> Report Ticket
                    </p>
                    <h2 className="text-3xl font-semibold text-gray-900">
                      Report a Ticket
                    </h2>
                  </div>

                  <Link
                    to="/dashboard"
                    className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-700 border border-gray-100 hover:bg-gray-50"
                  >
                    Back to Dashboard
                  </Link>
                </div>

                {/* Error message box */}
                {error && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Desktop report ticket form */}
                <form
                  onSubmit={handleSubmit}
                  className="rounded-[28px] bg-white border border-gray-100 p-6 lg:p-8 h-[calc(100%-5rem)] flex flex-col"
                >
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">

                      {/* Title input */} 
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Title
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent px-4 py-4 outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="Enter a short title"
                        required
                      />
                    </div>

                    {/* Location input */}
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Location
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent px-4 py-4 outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="Example: SW1 101 or Building B Lobby"
                        required
                      />
                    </div>
                  </div>

                  {/* Description text area */}
                  <div className="flex-1 flex flex-col">
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Describe the issue
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      className="flex-1 min-h-[360px] rounded-[24px] bg-[#f6f7fb] border border-transparent px-4 py-4 outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                      placeholder="Example: There is broken glass and a spill near the lobby entrance."
                      required
                    />
                  </div>

                  {/* Submit button */}
                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-2xl bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
                    >
                      {loading ? "Submitting..." : "Submit Ticket"}
                    </button>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden min-h-screen flex flex-col relative p-3 bg-[#f7f7fb]">
        <div className="bg-white rounded-[28px] min-h-screen overflow-hidden">
          {/* Navbar with hamburger menu button for mobile */}
          <Navbar
            appName="Campus Ticketing System"
            onMenuClick={toggleMenu}
            isSidebarOpen={isMenuOpen}
          />

          {/* Mobile sidebar overlay */}
           <Sidebar
            userName={userName}
            activePage="report"
            isMenuOpen={isMenuOpen}
          
          />

          {/* Mobile main content */}
          <main className="p-4">
            <div className="rounded-[24px] bg-[#f6f7fb] p-4">
              {/* Mobile heading and back button */}
              <div className="mb-5">
                <p className="text-sm text-gray-500 mb-2">
                  Main <span className="mx-2">»</span> Report Ticket
                </p>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Report a Ticket
                  </h2>

                  <Link
                    to="/dashboard"
                    className="rounded-2xl bg-white px-4 py-2 text-sm text-gray-700 border border-gray-100"
                  >
                    Back
                  </Link>
                </div>
              </div>

              {/* Mobile error message box */}
              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Mobile report ticket form */}
              <form
                onSubmit={handleSubmit}
                className="rounded-[24px] bg-white border border-gray-100 p-4 space-y-4"
              >
                {/* Mobile title input */}
                <div>
                  <label
                    htmlFor="title-mobile"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Title
                  </label>
                  <input
                    id="title-mobile"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent px-4 py-4 outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Enter a short title"
                    required
                  />
                </div>

                {/* Mobile location input */}
                <div>
                  <label
                    htmlFor="location-mobile"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location
                  </label>
                  <input
                    id="location-mobile"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent px-4 py-4 outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Example: SW1 101 or Building B Lobby"
                    required
                  />
                </div>

                {/* Mobile description textarea */}
                <div>
                  <label
                    htmlFor="content-mobile"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Describe the issue
                  </label>
                  <textarea
                    id="content-mobile"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    className="w-full min-h-[240px] rounded-[24px] bg-[#f6f7fb] border border-transparent px-4 py-4 outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                    placeholder="Describe what happened"
                    required
                  />
                </div>

                {/* Mobile submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Ticket"}
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
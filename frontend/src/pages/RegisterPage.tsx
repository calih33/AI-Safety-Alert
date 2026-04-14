import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    campus_id: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campus_id: form.campus_id,
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const token = data.token;
      const user =
        data.user ||
        {
          campus_id: form.campus_id,
          name: form.name,
          email: form.email,
        };

      if (!token) {
        throw new Error("Registration response is missing token");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] p-2 sm:p-3 md:p-4">
      <div className="min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2rem)] bg-white rounded-[22px] sm:rounded-[28px] md:rounded-[32px] overflow-hidden flex items-center justify-center p-3 sm:p-4 md:p-8">
        <div className="w-full max-w-md md:max-w-xl rounded-[20px] sm:rounded-[24px] md:rounded-[28px] bg-[#f6f7fb] p-3 sm:p-4 md:p-6">
          <div className="rounded-[20px] sm:rounded-[24px] bg-white border border-gray-100 p-4 sm:p-6 md:p-8">
            <div className="mb-5">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Register</h2>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Campus ID
                </label>
                <input
                  id="campus_id"
                  name="campus_id"
                  type="text"
                  value={form.campus_id}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent px-4 py-3 sm:py-4 outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Enter your campus ID"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent px-4 py-3 sm:py-4 outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent px-4 py-3 sm:py-4 outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent px-4 py-3 sm:py-4 outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent px-4 py-3 sm:py-4 outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-black text-white px-6 py-3 sm:py-4 text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-5 sm:mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-gray-900 font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
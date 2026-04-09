import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-gray-200 w-full min-h-screen flex items-center justify-center">
      <div className="w-full py-4">
      
        <div className="bg-white w-5/6 md:w-3/4 lg:w-2/3 xl:w-[500px] 2xl:w-[550px] mt-8 mx-auto px-10 py-8 rounded-lg shadow-2xl">
        <div className="flex items-cent er justify-center space-x-2">
          <h1 className="text-2xl font-bold text-blue-600 py-4 pb-10">
            Logo here
          </h1>
        </div>
          <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
            Sign In
          </h2>

          <p className="text-center text-sm text-gray-600 mt-2">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 hover:underline"
              title="Sign Up"
            >
              Sign up here
            </Link>
          </p>

          <form className="my-8 text-sm">
            <div className="flex flex-col my-4">
              <label htmlFor="email" className="text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-2 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col my-4">
              <label htmlFor="password" className="text-gray-700">
                Password
              </label>
              <div className="relative flex items-center mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className="flex-1 w-full p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                  placeholder="Enter your password"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 bg-transparent flex items-center justify-center text-gray-700"
                >
                  {!showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between my-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember_me"
                  id="remember_me"
                  className="mr-2 focus:ring-0 rounded"
                />
                <label htmlFor="remember_me" className="text-gray-700">
                  Remember me
                </label>
              </div>

              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <div className="my-4 flex items-center justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 rounded-lg px-8 py-2 text-gray-100 hover:shadow-xl transition duration-150 uppercase"
              >
                Sign In
              </button>
            </div>
          </form>

         
        </div>
      </div>
    </div>  
  );
}
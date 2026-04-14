import { Menu, UserCircle } from "lucide-react";

interface NavbarProps {
  appName?: string;
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export default function Navbar({
  appName = "Campus Ticketing System",
  onMenuClick,
  isSidebarOpen = false,
}: NavbarProps) {
  return (
    <>
      {/* Desktop navbar */}
      <header className="hidden md:block h-16 bg-white relative">
        <div className="h-full flex items-center justify-between px-4">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            className={[
              "p-2 rounded-full hover:bg-gray-100 transition-all duration-300 z-[80]",
              isSidebarOpen
                ? "fixed top-12 left-[250px] bg-white"
                : "relative",
            ].join(" ")}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <h1 className="text-lg font-semibold text-gray-900">{appName}</h1>

          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Profile"
          >
            <UserCircle className="w-7 h-7 text-gray-700" />
          </button>
        </div>
      </header>

      {/* Mobile navbar */}
      <header className="md:hidden h-16 bg-white relative">
        <div className="h-full grid grid-cols-[48px_1fr_48px] items-center px-3 gap-2">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            className={[
              "p-2 rounded-full hover:bg-gray-100 transition-all duration-300 z-[80]",
              isSidebarOpen
                ? "fixed top-5 left-[325px] bg-white"
                : "relative",
            ].join(" ")}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <h1 className="text-sm font-semibold text-gray-900 text-center truncate">
            {appName}
          </h1>

          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 justify-self-end"
            aria-label="Profile"
          >
            <UserCircle className="w-7 h-7 text-gray-700" />
          </button>
        </div>
      </header>
    </>
  );
} 
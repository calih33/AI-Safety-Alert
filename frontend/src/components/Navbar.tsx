import { Menu, UserCircle } from "lucide-react";

interface NavbarProps {
  appName?: string;
  onMenuClick?: () => void;
}

export default function Navbar({
  appName = "Campus Ticketing System",
  onMenuClick,
}: NavbarProps) {
  return (
    <header className="h-16 bg-white">
      <div className="h-full grid grid-cols-[48px_1fr_48px] items-center px-3 md:px-4 gap-2">
        <div className="flex justify-start">
          <button
            type="button"
            onClick={onMenuClick}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="min-w-0 flex justify-center">
          <h1 className="text-sm md:text-lg font-semibold text-gray-900 text-center truncate max-w-full">
            {appName}
          </h1>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Profile"
          >
            <UserCircle className="w-7 h-7 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}
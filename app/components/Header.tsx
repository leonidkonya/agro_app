import { Menu, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { useTheme } from "../contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import type React from "react" // Added import for React

interface HeaderProps {
  toggleSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-gradient-to-r from-primary to-primary-dark dark:from-gray-800 dark:to-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-white hover:bg-primary-dark/20 dark:hover:bg-gray-700/50 focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
            >
              <Menu size={24} />
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">Agricultural AI</span>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full bg-primary-dark/20 dark:bg-gray-700/50 text-white hover:bg-primary-dark/30 dark:hover:bg-gray-700/70 focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header


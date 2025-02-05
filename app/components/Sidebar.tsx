import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, CloudRain, Leaf, BarChart2, MessageSquare, Layers, Bell, BarChart, Plus } from "lucide-react"
import type React from "react"

interface SidebarProps {
  isOpen: boolean
  isAdmin?: boolean
  closeSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isAdmin = false, closeSidebar }) => {
  const pathname = usePathname()

  const links = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/notifications", icon: Bell, label: "Notifications" },
    { href: "/plots", icon: Layers, label: "Plots" },
    { href: "/plots/add", icon: Plus, label: "Add Plot" },
    { href: "/soil-analysis", icon: BarChart2, label: "Soil Analysis" },
    { href: "/gis", icon: Map, label: "GIS" },
    { href: "/weather", icon: CloudRain, label: "Weather" },
    { href: "/recommendations", icon: Leaf, label: "Recommendations" },
    { href: "/ai-chat", icon: MessageSquare, label: "AI Chat" },
  ]

  if (isAdmin) {
    links.push({ href: "/government-dashboard", icon: BarChart, label: "Government Dashboard" })
  }

  return (
    <div
      className={`bg-primary dark:bg-gray-800 text-white w-80 fixed top-0 bottom-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50 pt-16 overflow-y-auto`}
    >
      <nav className="px-4 space-y-2">
        <div className="h-4"></div>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-primary-dark dark:hover:bg-gray-700 hover:text-white ${
              pathname === link.href ? "bg-primary-dark dark:bg-gray-700" : ""
            }`}
            onClick={closeSidebar}
          >
            <link.icon className="inline-block mr-2" size={20} />
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar


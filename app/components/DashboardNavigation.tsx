import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, CloudRain, Leaf, BarChart2, MessageSquare, Layers, Bell, Plus } from "lucide-react"

const navItems = [
  { href: "/plots", icon: Layers, label: "Plots", color: "bg-blue-100 text-blue-600" },
  { href: "/plots/add", icon: Plus, label: "Add Plot", color: "bg-green-100 text-green-600" },
  { href: "/gis", icon: MapPin, label: "GIS Maps", color: "bg-emerald-100 text-emerald-600" },
  { href: "/weather", icon: CloudRain, label: "Weather", color: "bg-sky-100 text-sky-600" },
  { href: "/soil-analysis", icon: Leaf, label: "Soil Analysis", color: "bg-amber-100 text-amber-600" },
  { href: "/recommendations", icon: BarChart2, label: "Recommendations", color: "bg-purple-100 text-purple-600" },
  { href: "/ai-chat", icon: MessageSquare, label: "AI Chat", color: "bg-pink-100 text-pink-600" },
  { href: "/notifications", icon: Bell, label: "Notifications", color: "bg-red-100 text-red-600" },
]

export function DashboardNavigation() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Card className={`hover:shadow-lg transition-shadow ${item.color}`}>
            <CardContent className="flex flex-col items-center justify-center p-6 h-32">
              <item.icon className="w-10 h-10 mb-2" />
              <span className="text-lg font-semibold text-center">{item.label}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}


'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users } from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'All Leads', icon: Users },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1B1D4D] border-r border-white/8 flex flex-col z-50">
      <div className="px-6 py-6 border-b border-white/8">
        <div className="flex items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="aspect-gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1B1D4D" />
                <stop offset="1" stopColor="#166846" />
              </linearGradient>
            </defs>
            <rect x="14" y="2" width="20" height="20" rx="3" fill="url(#aspect-gradient)" />
            <rect x="2" y="14" width="10" height="10" rx="2" fill="url(#aspect-gradient)" opacity="0.7" />
          </svg>
          <div>
            <div className="text-white text-sm" style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif', fontWeight: 600 }}>
              Aspect CRM
            </div>
            <div className="text-white/40 text-xs">Infrastructure & Construction</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'text-white font-medium bg-white/5 border-l-[3px] border-[#D60039]'
                  : 'text-white/50 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent'
              }`}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 py-4 border-t border-white/8">
        <p className="text-white/20 text-xs italic" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif' }}>
          Bridging Traditions, Building Tomorrow
        </p>
      </div>
    </aside>
  )
}

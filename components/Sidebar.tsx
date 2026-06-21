'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ThemeToggle from './ThemeToggle'
import Image from 'next/image'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'All Leads', icon: Users },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col z-50">
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Aspect Realty Logo" width={40} height={40} />
          <div>
            <div className="text-foreground text-sm font-semibold" style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
            Aspect Realty CRM
            </div>
            <div className="text-muted-foreground text-xs">From Inquiry to Closure</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4" role="navigation" aria-label="Main navigation">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 px-6 py-3 h-auto text-sm rounded-none border-l-[3px] ${
                  isActive
                    ? 'text-foreground font-medium bg-accent border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent border-transparent'
                }`}
              >
                <link.icon size={16} />
                {link.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border">
        <ThemeToggle />
        <Separator />
        <div className="px-6 py-4">
          <p className="text-muted-foreground text-xs italic" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif' }}>
            Bridging Traditions, Building Tomorrow
          </p>
        </div>
      </div>
    </aside>
  )
}

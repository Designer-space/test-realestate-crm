'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'

const emptySubscribe = () => () => {}
const getServerSnapshot = () => false

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(emptySubscribe, () => true, getServerSnapshot)

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-full justify-start gap-3 px-6 py-3 h-auto text-sm text-muted-foreground hover:text-foreground rounded-none"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </Button>
  )
}

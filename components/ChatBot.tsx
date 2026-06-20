'use client'

import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m your Aspect CRM assistant. Ask me about leads, stats, or to update a lead status.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function renderMessage(content: string) {
    const lines = content.split('\n')
    const elements: ReactNode[] = []

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim()

      if (!trimmed) {
        elements.push(<div key={`br-${lineIdx}`} className="h-2" />)
        return
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.slice(2)
        elements.push(
          <div key={lineIdx} className="flex gap-1.5 ml-1">
            <span className="text-muted-foreground">•</span>
            <span>{renderInline(itemText)}</span>
          </div>
        )
      } else {
        elements.push(<div key={lineIdx}>{renderInline(trimmed)}</div>)
      }
    })

    return elements
  }

  function renderInline(text: string): ReactNode {
    const parts: ReactNode[] = []
    const regex = /(\*\*(.+?)\*\*)|\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/[^\s]+)/g
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }
      if (match[1]) {
        parts.push(<strong key={match.index} className="font-bold">{match[2]}</strong>)
      } else if (match[3] && match[4]) {
        parts.push(
          <a key={match.index} href={match[4]} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
            {match[3]}
          </a>
        )
      } else if (match[5]) {
        parts.push(
          <a key={match.index} href={match[5]} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 break-all">
            {match[5]}
          </a>
        )
      }
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts
  }

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMsg = res.status === 429
          ? 'Rate limit reached. Please wait a minute and try again.'
          : data.error || 'Something went wrong.'
        setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 size-12 rounded-full shadow-lg"
        size="icon"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </Button>

      {open && (
        <Card className="fixed bottom-20 right-6 z-50 w-[380px] h-[520px] flex flex-col p-0 overflow-hidden shadow-2xl border-border">
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
            <Bot size={18} />
            <span className="font-semibold text-sm">Aspect CRM Assistant</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="size-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={12} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm break-words overflow-hidden ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {msg.role === 'assistant' ? renderMessage(msg.content) : msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="size-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <User size={12} className="text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="size-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={12} />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 size={14} className="animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border p-3">
            <form
              onSubmit={(e) => { e.preventDefault(); send() }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about leads..."
                disabled={loading}
                className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring disabled:opacity-50"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send size={14} />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  )
}

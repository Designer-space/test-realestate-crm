import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions'
import { getSupabase, getSupabaseAdmin } from '@/lib/supabase'

function getOpenAI() {
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  })
}

const MODEL = 'openai/gpt-4o-mini'

const SYSTEM_PROMPT = `You are Aspect CRM assistant — a helpful AI for a real estate CRM focused on infrastructure & construction in Mumbai.

You can help with:
- Searching and listing leads
- Getting lead details
- Updating lead status
- Providing dashboard statistics

Be concise and friendly. When showing leads, format them nicely.
When updating a status, confirm the change.
Always respond in the same language the user uses.`

const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_leads',
      description: 'Search leads by name, phone, email, form type, or status. Returns matching leads.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search term to match against name, phone, or email' },
          status: { type: 'string', description: 'Filter by status: New, Contacted, Qualified, Follow-up, Converted, Rejected' },
          form_type: { type: 'string', description: 'Filter by form type: SRA Opportunity, Redevelopment, Open Plot, Others' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_lead_details',
      description: 'Get full details of a specific lead by ID.',
      parameters: {
        type: 'object',
        properties: {
          lead_id: { type: 'string', description: 'The lead UUID' },
        },
        required: ['lead_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_lead_status',
      description: 'Update the status of a lead.',
      parameters: {
        type: 'object',
        properties: {
          lead_id: { type: 'string', description: 'The lead UUID' },
          status: { type: 'string', description: 'New status: New, Contacted, Qualified, Follow-up, Converted, Rejected' },
        },
        required: ['lead_id', 'status'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_dashboard_stats',
      description: 'Get dashboard statistics: total leads, leads by status, leads by form type.',
      parameters: { type: 'object', properties: {} },
    },
  },
]

async function executeFunction(name: string, args: Record<string, unknown>) {
  const supabase = getSupabase()
  const supabaseAdmin = getSupabaseAdmin()

  switch (name) {
    case 'search_leads': {
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(20)
      if (args.query) {
        query = query.or(`full_name.ilike.%${args.query}%,phone_number.ilike.%${args.query}%,email.ilike.%${args.query}%`)
      }
      if (args.status) query = query.eq('status', args.status as string)
      if (args.form_type) query = query.eq('form_type', args.form_type as string)
      const { data, error } = await query
      if (error) return { error: error.message }
      return { leads: data?.map(l => ({ id: l.id, name: l.full_name, phone: l.phone_number, email: l.email, form_type: l.form_type, status: l.status, created_at: l.created_at })) || [] }
    }
    case 'get_lead_details': {
      const { data, error } = await supabase.from('leads').select('*').eq('id', args.lead_id).single()
      if (error) return { error: 'Lead not found' }
      return { lead: data }
    }
    case 'update_lead_status': {
      const validStatuses = ['New', 'Contacted', 'Qualified', 'Follow-up', 'Converted', 'Rejected']
      if (!validStatuses.includes(args.status as string)) {
        return { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }
      }
      const { error } = await supabaseAdmin.from('leads').update({ status: args.status }).eq('id', args.lead_id)
      if (error) return { error: error.message }
      return { success: true, message: `Lead status updated to ${args.status}` }
    }
    case 'get_dashboard_stats': {
      const { data: leads } = await supabase.from('leads').select('status, form_type, created_at')
      if (!leads) return { error: 'Failed to fetch data' }
      const total = leads.length
      const byStatus = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc }, {} as Record<string, number>)
      const byType = leads.reduce((acc, l) => { acc[l.form_type] = (acc[l.form_type] || 0) + 1; return acc }, {} as Record<string, number>)
      return { total, byStatus, byType }
    }
    default:
      return { error: 'Unknown function' }
  }
}

export async function POST(request: Request) {
  const { messages } = await request.json()

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OpenRouter API key not configured. Add OPENROUTER_API_KEY to .env.local' }, { status: 500 })
  }

  const apiMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ]

  try {
    let response = await getOpenAI().chat.completions.create({
      model: MODEL,
      messages: apiMessages,
      tools,
      tool_choice: 'auto',
    })

    while (response.choices[0]?.message.tool_calls?.length) {
      const assistantMessage = response.choices[0].message
      apiMessages.push(assistantMessage)

      for (const toolCall of assistantMessage.tool_calls!) {
        const fn = toolCall.type === 'function' ? toolCall.function : null
        if (!fn) continue
        const fnName = fn.name
        const fnArgs = JSON.parse(fn.arguments)
        const output = await executeFunction(fnName, fnArgs)

        apiMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(output),
        })
      }

      response = await getOpenAI().chat.completions.create({
        model: MODEL,
        messages: apiMessages,
        tools,
        tool_choice: 'auto',
      })
    }

    const reply = response.choices[0]?.message?.content || 'No response'
    return NextResponse.json({ reply })
  } catch (err: unknown) {
    const status = (err as { status?: number }).status
    console.error('OpenRouter error:', (err as Error).message)
    if (status === 429) {
      return NextResponse.json({ error: 'Rate limit reached. Please wait and try again.' }, { status: 429 })
    }
    return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getSupabase, getSupabaseAdmin } from '@/lib/supabase'
import { notifyStatusChangeUser } from '@/lib/whatsapp'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { status } = body

  if (!status) {
    return NextResponse.json({ success: false, error: 'Missing status field' }, { status: 400 })
  }

  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  const { data: lead } = await supabaseAdmin
    .from('leads')
    .select('full_name, phone_number')
    .eq('id', id)
    .single()

  if (lead) {
    notifyStatusChangeUser(lead.phone_number, lead.full_name, status)
  }

  return NextResponse.json({ success: true, id: data.id })
}

import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { notifyNewLeadAdmin, notifyNewLeadUser } from '@/lib/whatsapp'

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, phone } = body

  if (!name || !phone) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: name, phone' },
      { status: 400 }
    )
  }

  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      form_type: 'Open Plot',
      full_name: name,
      phone_number: phone,
      email: email || null,
      metadata: {
        plot_location: body['Plot location'] || '',
        plot_size: body['Plot Size'] || '',
        zone: body['Zone'] || '',
        road_frontage: body['Road frontage'] || '',
        families: body['Families'] || '',
        google_drive_link: body['Google Drive Link'] || '',
        file_upload: body['fileupload'] || '',
      },
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  notifyNewLeadAdmin(name, phone, 'Open Plot')
  notifyNewLeadUser(phone, name, 'Open Plot')

  return NextResponse.json({ success: true, id: data.id })
}

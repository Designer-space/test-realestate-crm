import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

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
      form_type: 'SRA Opportunity',
      full_name: name,
      phone_number: phone,
      email: email || null,
      metadata: {
        society_name: body['Society Name'] || '',
        number_of_families: body['Families'] || '',
        address: body['Property Address'] || '',
        plot_size: body['Plot Size'] || '',
        age_of_building: body['Building Age'] || '',
        google_drive_link: body['Google Drive Link'] || '',
        file_upload: body['fileupload'] || '',
      },
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id })
}

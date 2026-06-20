import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, phone, Phone } = body
  const phoneNumber = phone || Phone

  if (!name || !phoneNumber) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: name, phone' },
      { status: 400 }
    )
  }

  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      form_type: 'Redevelopment',
      full_name: name,
      phone_number: phoneNumber,
      email: email || null,
      metadata: {
        building_name: body['Building name'] || '',
        number_of_floors: body['Number of floors'] || '',
        built_up_area: body['Total built-up area'] || '',
        age_of_building: body['Building Age'] || '',
        plot_area: body['Plot area'] || '',
        number_of_units: body['Current number of units'] || '',
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

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0'

function getEnvOrThrow(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing env var: ${key}`)
  return val
}

function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('91') && digits.length === 12) return digits
  if (digits.length === 10) return `91${digits}`
  return digits
}

export async function sendWhatsAppMessage({ to, body }: { to: string; body: string }): Promise<void> {
  const phoneNumberId = getEnvOrThrow('WHATSAPP_PHONE_NUMBER_ID')
  const accessToken = getEnvOrThrow('WHATSAPP_ACCESS_TOKEN')

  const response = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: formatPhoneNumber(to),
      type: 'text',
      text: { body },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('[WhatsApp] Failed to send message:', error)
  }
}

export async function sendWhatsAppTemplate({
  to,
  templateName,
  languageCode = 'en',
  parameters,
}: {
  to: string
  templateName: string
  languageCode?: string
  parameters: Array<{ type: 'text'; text: string }>
}): Promise<void> {
  const phoneNumberId = getEnvOrThrow('WHATSAPP_PHONE_NUMBER_ID')
  const accessToken = getEnvOrThrow('WHATSAPP_ACCESS_TOKEN')

  const response = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: formatPhoneNumber(to),
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components: [
          {
            type: 'body',
            parameters,
          },
        ],
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('[WhatsApp] Failed to send template:', error)
  }
}

export function notifyNewLeadAdmin(name: string, phone: string, formType: string): void {
  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER
  if (!adminNumber) return
  const message = [
    `New Lead Submitted`,
    ``,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Form: ${formType}`,
  ].join('\n')
  sendWhatsAppMessage({ to: adminNumber, body: message }).catch(() => {})
}

export function notifyNewLeadUser(phone: string, name: string, formType: string): void {
  sendWhatsAppTemplate({
    to: phone,
    templateName: 'lead_confirmation',
    parameters: [
      { type: 'text', text: name },
      { type: 'text', text: formType },
    ],
  }).catch(() => {})
}

export function notifyStatusChangeUser(phone: string, name: string, newStatus: string): void {
  sendWhatsAppTemplate({
    to: phone,
    templateName: 'status_update__general',
    parameters: [
      { type: 'text', text: name },
      { type: 'text', text: newStatus },
    ],
  }).catch(() => {})
}

export function notifySiteVisitConfirmation(phone: string, name: string, projectName: string): void {
  sendWhatsAppTemplate({
    to: phone,
    templateName: 'status_update__site_vist__followup',
    parameters: [
      { type: 'text', text: name },
      { type: 'text', text: projectName },
    ],
  }).catch(() => {})
}

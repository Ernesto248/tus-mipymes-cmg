import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

interface MembershipEmailParams {
  to: string
  userName: string
  type: string
  status: string
  expiresAt?: Date | null
}

export async function sendMembershipEmail({
  to,
  userName,
  type,
  status,
  expiresAt,
}: MembershipEmailParams) {
  const typeLabel = type === "premium" ? "Premium" : "Basica"
  const statusLabel =
    status === "active"
      ? "Activada"
      : status === "cancelled"
        ? "Cancelada"
        : status === "expired"
          ? "Vencida"
          : "Actualizada"

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 520px; margin: 0 auto; padding: 32px 20px; background: #ffffff; }
        .logo { text-align: center; margin-bottom: 32px; }
        .title { font-size: 24px; font-weight: 600; color: #1d1d1f; text-align: center; margin-bottom: 8px; }
        .subtitle { font-size: 16px; color: #7a7a7a; text-align: center; margin-bottom: 24px; }
        .card { background: #f5f5f7; border-radius: 18px; padding: 24px; margin-bottom: 24px; }
        .card-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
        .card-row:last-child { border-bottom: none; }
        .label { font-size: 14px; color: #7a7a7a; }
        .value { font-size: 14px; font-weight: 600; color: #1d1d1f; }
        .badge { display: inline-block; border-radius: 9999px; padding: 4px 12px; font-size: 12px; font-weight: 600; }
        .badge-active { background: #dcfce7; color: #166534; }
        .badge-cancelled { background: #fee2e2; color: #991b1b; }
        .benefits { margin-top: 24px; }
        .benefits h3 { font-size: 16px; font-weight: 600; color: #1d1d1f; margin-bottom: 12px; }
        .benefit-item { font-size: 14px; color: #1d1d1f; padding: 4px 0; display: flex; align-items: center; gap: 8px; }
        .benefit-icon { color: #0066cc; }
        .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #f0f0f0; }
        .footer p { font-size: 12px; color: #7a7a7a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <strong style="font-size: 20px; color: #1d1d1f;">Socio+</strong>
        </div>
        <h1 class="title">Membresia ${statusLabel}</h1>
        <p class="subtitle">Hola ${userName}, tu plan ha sido actualizado.</p>
        <div class="card">
          <div class="card-row">
            <span class="label">Plan</span>
            <span class="value">${typeLabel}</span>
          </div>
          <div class="card-row">
            <span class="label">Estado</span>
            <span class="value">
              <span class="badge ${status === "active" ? "badge-active" : "badge-cancelled"}">
                ${statusLabel}
              </span>
            </span>
          </div>
          ${expiresAt
            ? `<div class="card-row">
                <span class="label">Vence</span>
                <span class="value">${new Date(expiresAt).toLocaleDateString("es-CO")}</span>
              </div>`
            : ""
          }
        </div>
        ${status === "active"
          ? `<div class="benefits">
              <h3>Tus beneficios</h3>
              <div class="benefit-item">
                <span class="benefit-icon">&#10003;</span>
                Descuentos exclusivos en pymes locales
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">&#10003;</span>
                Fila prioritaria en comercios participantes
              </div>
              ${type === "premium"
                ? `<div class="benefit-item">
                    <span class="benefit-icon">&#10003;</span>
                    Domicilio gratis todos los dias
                  </div>`
                : ""
              }
            </div>`
          : ""
        }
        <div class="footer">
          <p>Gracias por apoyar el comercio local.</p>
          <p>&#8212; Equipo Socio+</p>
        </div>
      </div>
    </body>
    </html>
  `

  if (!resend) {
    console.log("[Email] RESEND_API_KEY not configured. Email would be sent to:", to)
    console.log("[Email] Subject: Membresia Socio+ -", statusLabel)
    return { ok: true, simulated: true }
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Socio+ <onboarding@resend.dev>",
      to,
      subject: `Membresia Socio+ - ${statusLabel}`,
      html,
    })
    if (error) {
      console.error("[Email] Failed to send:", error)
      return { ok: false, error }
    }
    return { ok: true }
  } catch (err) {
    console.error("[Email] Failed to send:", err)
    return { ok: false, error: err }
  }
}

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  const { nombre, email, empresa, mensaje } = await request.json();

  if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing fields' }), { status: 400 });
  }

  const user = import.meta.env.GMAIL_USER;
  const pass = import.meta.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Keikaku AI Web" <${user}>`,
      to: 'keikakuconsulting@gmail.com',
      replyTo: email,
      subject: `Nuevo contacto web: ${nombre}${empresa ? ` — ${empresa}` : ''}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nEmpresa: ${empresa || '—'}\n\n${mensaje}`,
      html: `<p><strong>Nombre:</strong> ${nombre}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Empresa:</strong> ${empresa || '—'}</p>
             <hr/>
             <p>${mensaje.replace(/\n/g, '<br/>')}</p>`,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

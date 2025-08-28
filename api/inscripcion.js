import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { nombre, edad, categoria, telefono, email, observaciones } = req.body || {};
    if (!nombre || !edad || !categoria || !telefono || !email) {
      return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const toEmail = process.env.TO_EMAIL || process.env.SMTP_USER;
    const info = await transporter.sendMail({
      from: `Web Sant Quirze FS <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Nueva inscripción/interés en el club',
      text: `Nombre: ${nombre}\nEdad: ${edad}\nCategoría: ${categoria}\nTeléfono: ${telefono}\nEmail: ${email}\nObservaciones: ${observaciones || ''}`,
      html: `
        <h2>Nueva inscripción/interés</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Edad:</strong> ${edad}</p>
        <p><strong>Categoría:</strong> ${categoria}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Observaciones:</strong> ${observaciones || ''}</p>
      `
    });

    return res.status(200).json({ ok: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error enviando email', error);
    return res.status(500).json({ ok: false, error: 'No se pudo enviar el email' });
  }
}



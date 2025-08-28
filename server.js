import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/inscripcion', async (req, res) => {
  try {
    const { nombre, edad, categoria, telefono, email, observaciones } = req.body;

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

    return res.json({ ok: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error enviando email', error);
    return res.status(500).json({ ok: false, error: 'No se pudo enviar el email' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});



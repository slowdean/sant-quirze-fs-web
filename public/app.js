const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

const newsFilter = document.getElementById('news-filter');
const newsList = document.getElementById('news-list');
if (newsFilter && newsList) {
  newsFilter.addEventListener('change', () => {
    const value = newsFilter.value;
    const items = newsList.querySelectorAll('.news-item');
    items.forEach((el) => {
      const show = value === 'todos' || el.getAttribute('data-cat') === value;
      el.style.display = show ? '' : 'none';
    });
  });
}

const form = document.getElementById('inscripcion-form');
const statusEl = document.getElementById('form-status');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Enviando...';
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch('/api/inscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ok) {
        statusEl.textContent = '¡Solicitud enviada! Nos pondremos en contacto pronto.';
        form.reset();
      } else {
        statusEl.textContent = 'No se pudo enviar. Revisa los campos o inténtalo más tarde.';
      }
    } catch (err) {
      statusEl.textContent = 'Error de red. Inténtalo de nuevo.';
    }
  });
}



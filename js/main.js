(function () {
  function validarFecha(fechaPermitida) {
    try {
      const now = new Date();
      // Interpreta la fecha localmente al inicio del día
      const allowed = new Date(fechaPermitida + 'T00:00:00');
      if (isNaN(allowed)) return;
      if (now < allowed) {
        const main = document.querySelector('.container');
        if (main) main.setAttribute('aria-hidden', 'true');

        // Aviso accesible sin reemplazar todo el body
        const notice = document.createElement('div');
        notice.className = 'container locked-notice';
        notice.setAttribute('role', 'status');
        notice.innerHTML = '<h1>⏳ Aún no…</h1><p>Esta pista se desbloqueará pronto ❤️</p>';
        document.body.appendChild(notice);
      }
    } catch (e) {
      console.error('validarFecha error:', e);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const unlockDate = document.body.dataset.unlock;
    if (unlockDate) validarFecha(unlockDate);

    // Control simple para música (si se añade en HTML)
    const playBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    if (playBtn && audio) {
      playBtn.addEventListener('click', function () {
        if (audio.paused) {
          audio.play().catch(() => {});
          playBtn.textContent = 'Pausar música';
        } else {
          audio.pause();
          playBtn.textContent = 'Reproducir música';
        }
      });
    }
  });

  // Exponer para debug si hace falta
  window.validarFecha = validarFecha;
})();
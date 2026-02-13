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

  // --- Rompecabezas para dia12b ---
  function initDay12b() {
    const preview = document.getElementById('preview-photo');
    const puzzleContainer = document.getElementById('puzzle-container');
    const puzzleGrid = document.getElementById('puzzle-grid');
    const clue = document.getElementById('clue');
    const shuffleBtn = document.getElementById('shuffle-btn');
    if (!preview || !puzzleGrid || !puzzleContainer || !clue) return;

    const rows = 4, cols = 4;
    let pieces = [];
    let firstSelected = null;
    let solved = false;

    function createPuzzle(img) {
      const maxWidth = 520;
      const naturalW = img.naturalWidth || maxWidth;
      const naturalH = img.naturalHeight || Math.round(naturalW * 0.75);
      const ratio = naturalW / naturalH || 1;
      const displayW = Math.min(naturalW, maxWidth);
      const displayH = Math.round(displayW / ratio);
      puzzleGrid.style.width = displayW + 'px';
      puzzleGrid.style.height = displayH + 'px';
      puzzleGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      puzzleGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
      pieces = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const piece = document.createElement('div');
          piece.className = 'puzzle-piece';
          piece.dataset.correct = idx;
          piece.dataset.position = idx;
          piece.style.backgroundImage = `url('${img.src}')`;
          piece.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
          const posX = (c / (cols - 1)) * 100;
          const posY = (r / (rows - 1)) * 100;
          piece.style.backgroundPosition = `${posX}% ${posY}%`;
          piece.addEventListener('click', onPieceClick);
          pieces.push(piece);
        }
      }
      shufflePieces();
      renderPieces();
    }

    function shufflePieces() {
      const positions = pieces.map((_, i) => i);
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }
      pieces.forEach((p, i) => (p.dataset.position = positions[i]));
    }

    function renderPieces() {
      puzzleGrid.innerHTML = '';
      const arranged = pieces.slice().sort((a, b) => a.dataset.position - b.dataset.position);
      arranged.forEach((p) => puzzleGrid.appendChild(p));
    }

    function onPieceClick(e) {
      const el = e.currentTarget;
      if (!firstSelected) {
        firstSelected = el;
        el.classList.add('selected');
        return;
      }
      if (firstSelected === el) {
        el.classList.remove('selected');
        firstSelected = null;
        return;
      }
      const aPos = firstSelected.dataset.position;
      const bPos = el.dataset.position;
      firstSelected.dataset.position = bPos;
      el.dataset.position = aPos;
      firstSelected.classList.remove('selected');
      firstSelected = null;
      renderPieces();
      checkSolved();
    }

    function checkSolved() {
      if (solved) return;
      const allOk = pieces.every((p) => String(p.dataset.position) === String(p.dataset.correct));
      if (allOk) {
        solved = true;
        puzzleGrid.classList.add('puzzle-complete');
        // show temporary felicitations
        const congrats = document.createElement('div');
        congrats.className = 'locked-notice';
        congrats.style.marginTop = '16px';
        congrats.textContent = '¡Felicidades!';
        congrats.setAttribute('role', 'status');
        puzzleContainer.parentNode.insertBefore(congrats, puzzleContainer.nextSibling);

        // after a short delay hide puzzle and reveal clue
        setTimeout(() => {
          congrats.style.display = 'none';
          puzzleContainer.style.display = 'none';
          clue.style.display = 'block';
          clue.setAttribute('aria-hidden', 'false');
        }, 1000);
      }
    }

    function startFlow() {
      preview.style.display = 'block';
      puzzleContainer.style.display = 'none';
      clue.style.display = 'none';
      preview.onload = function () {
        setTimeout(() => {
          preview.style.display = 'none';
          puzzleContainer.style.display = 'block';
          puzzleContainer.setAttribute('aria-hidden', 'false');
          createPuzzle(preview);
        }, 5000);
      };
      if (preview.complete) preview.onload();
      if (shuffleBtn) shuffleBtn.addEventListener('click', function () {
        shufflePieces();
        renderPieces();
      });
    }

    startFlow();
  }

  // Inicializar rompecabezas en dia12b.html
  try {
    const path = window.location.pathname || '';
    if (path.endsWith('dia12b.html') || path.indexOf('/dia12b.html') !== -1) {
      document.addEventListener('DOMContentLoaded', function () {
        try { initDay12b(); } catch (e) { console.error('initDay12b error', e); }
      });
    }
  } catch (e) { console.error(e); }
})();
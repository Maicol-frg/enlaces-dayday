const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

    if (finePointer.matches) {
      document.querySelectorAll('.link').forEach(card => {
        let frame = 0;
        card.addEventListener('pointermove', event => {
          if (event.pointerType !== 'mouse') return;
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            const box = card.getBoundingClientRect();
            card.style.setProperty('--mx', (event.clientX - box.left) + 'px');
            card.style.setProperty('--my', (event.clientY - box.top) + 'px');
          });
        });
      });
    }

    if (finePointer.matches && !reducedMotion.matches) {
      const logo = document.querySelector('.logo');
      const STIFFNESS = 170, DAMPING = 18;
      let targetX = 0, targetY = 0, x = 0, y = 0, vx = 0, vy = 0, last = 0, raf = 0;

      const step = now => {
        const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
        last = now;
        vx += (STIFFNESS * (targetX - x) - DAMPING * vx) * dt;
        vy += (STIFFNESS * (targetY - y) - DAMPING * vy) * dt;
        x += vx * dt;
        y += vy * dt;
        logo.style.transform = `perspective(700px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`;
        const settled = Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Math.abs(targetX - x) < 0.001 && Math.abs(targetY - y) < 0.001;
        raf = settled ? 0 : requestAnimationFrame(step);
      };
      const wake = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } };

      window.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse') return;
        targetX = (event.clientX / innerWidth - 0.5) * 2;
        targetY = (event.clientY / innerHeight - 0.5) * 2;
        wake();
      }, { passive: true });
      document.documentElement.addEventListener('mouseleave', () => { targetX = targetY = 0; wake(); });
    }

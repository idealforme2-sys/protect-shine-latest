// bulgeEffect.js
// Simple mouse‑based bulge simulation for elements with class "bulge-effect"
// This is a lightweight alternative to the full WebGL shader.

function applyBulgeEffect() {
  const elements = document.querySelectorAll('.bulge-effect');
  elements.forEach(el => {
    el.style.transition = 'transform 0.1s ease-out';
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // x within element
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / rect.width;
      const dy = (y - cy) / rect.height;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Scale factor: closer to center = larger scale, farther = smaller
      const scale = 1 + (0.2 * (1 - Math.min(distance, 1)));
      el.style.transform = `scale(${scale})`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });
  });
}

if (document.readyState !== 'loading') {
  applyBulgeEffect();
} else {
  document.addEventListener('DOMContentLoaded', applyBulgeEffect);
}

'use client';
import confetti from 'react-confetti';

export function launchConfetti(){
  // dispara confete no centro da tela
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FFD700','#FFA500','#FFF8DC']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FFD700','#FFA500','#FFF8DC']
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

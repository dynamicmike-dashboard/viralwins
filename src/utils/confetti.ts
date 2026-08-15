import confetti from 'canvas-confetti';

export const triggerFireworks = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#6366F1', '#10B981', '#F59E0B']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#EC4899', '#8B5CF6', '#3B82F6']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#F59E0B', '#EF4444', '#10B981']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45
  });
};

export const triggerActionReward = () => {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#6366F1', '#10B981', '#F59E0B']
  });
};

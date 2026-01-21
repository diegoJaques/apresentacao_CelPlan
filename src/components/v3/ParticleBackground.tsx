import Particles from '@tsparticles/react';

interface ParticleBackgroundProps {
  density?: number;
  color?: string;
  connectDots?: boolean;
}

export const ParticleBackground = ({
  density = 80,
  color = '#7c3aed',
  connectDots = true
}: ParticleBackgroundProps) => {
  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: false,
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'grab',
            },
            resize: {
              enable: true
            }
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5,
              },
            },
          },
        },
        particles: {
          color: {
            value: color,
          },
          links: {
            color: color,
            distance: 150,
            enable: connectDots,
            opacity: 0.3,
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              width: 1920,
              height: 1080,
            },
            value: density,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 z-0"
    />
  );
};

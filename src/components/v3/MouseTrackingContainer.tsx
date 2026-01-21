import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';

interface MouseTrackingContainerProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export const MouseTrackingContainer = ({
  children,
  className = '',
  strength = 10
}: MouseTrackingContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), {
    stiffness: 200,
    damping: 20
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), {
    stiffness: 200,
    damping: 20
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

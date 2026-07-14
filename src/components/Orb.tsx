interface OrbProps {
  gradient: string;
  size: number;
  big?: boolean;
}

export default function Orb({ gradient, size, big = false }: OrbProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        WebkitMaskImage: 'radial-gradient(circle,#000 55%,transparent 100%)',
        maskImage: 'radial-gradient(circle,#000 55%,transparent 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: big ? '-30%' : '-25%',
          background: gradient,
          filter: `blur(${big ? 30 : 20}px) saturate(1.35)`,
          animation: 'orbDrift 9s ease-in-out infinite alternate',
        }}
      />
    </div>
  );
}

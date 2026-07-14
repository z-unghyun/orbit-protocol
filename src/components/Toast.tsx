export default function Toast({ message }: { message: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 70,
        left: '50%',
        background: '#1a1a1a',
        color: '#fff',
        fontSize: 12.5,
        fontWeight: 600,
        padding: '10px 18px',
        borderRadius: 100,
        zIndex: 40,
        animation: 'toastIn 1.8s ease forwards',
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  );
}

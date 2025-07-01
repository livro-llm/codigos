export default function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, height: 20 }}>
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            backgroundColor: "#3b82f6", // azul, pode alterar
            borderRadius: "50%",
            display: "inline-block",
            animation: `bounce 0.6s infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          40% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

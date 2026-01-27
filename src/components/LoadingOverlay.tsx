export const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-5xl sm:text-8xl font-black tracking-tighter animate-pulse opacity-10 mb-4 uppercase italic">
          DECODING
        </div>
        <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.5em] sm:tracking-[1em] text-primary">
          SUBCONSCIOUS BREACH IN PROGRESS...
        </p>
      </div>
    </div>
  );
};

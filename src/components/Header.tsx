interface HeaderProps {
  onBackClick: () => void;
}

export const Header = ({ onBackClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 w-full p-6 sm:p-10 z-40 border-b border-border bg-background/90 backdrop-blur-xl flex justify-between items-center shadow-2xl">
      <div onClick={onBackClick} className="cursor-pointer group">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter leading-[0.8] mb-1 sm:mb-2 uppercase italic text-primary group-hover:text-foreground transition-colors">
          // LOG
        </h1>
        <p className="text-[7px] sm:text-[8px] tracking-[0.3em] font-mono text-muted-foreground uppercase">BACK TO INTERFACE</p>
      </div>
      <div className="text-right font-mono text-[8px] sm:text-[10px] opacity-40 leading-tight">
        [ STATUS: ACTIVE ]<br/>
        [ UNIT: A9_MOBILE ]
      </div>
    </header>
  );
};

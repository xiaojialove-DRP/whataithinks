import { COMIC_STYLES, type ComicStyle } from "@/lib/comic-styles";
import { cn } from "@/lib/utils";

interface StyleSelectorProps {
  selected: ComicStyle;
  onChange: (style: ComicStyle) => void;
  compact?: boolean;
}

export const StyleSelector = ({ selected, onChange, compact = false }: StyleSelectorProps) => {
  return (
    <div className={cn("flex gap-2", compact ? "flex-row flex-wrap" : "flex-col sm:flex-row")}>
      {COMIC_STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => onChange(style.id)}
          className={cn(
            "group relative border font-mono text-left transition-all active:scale-95",
            compact
              ? "px-3 py-1.5 text-[9px]"
              : "flex-1 px-4 py-3 text-xs",
            selected === style.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground/50 hover:border-foreground/30 hover:text-foreground/80"
          )}
        >
          <span className="font-black tracking-tight">{style.label}</span>
          {!compact && (
            <>
              <span className="block text-[10px] mt-0.5 opacity-60">{style.labelCn}</span>
              <span className="block text-[8px] mt-1 opacity-40 tracking-wide uppercase">{style.description}</span>
            </>
          )}
          {selected === style.id && (
            <span className="absolute top-1 right-2 text-primary text-[8px] font-bold">●</span>
          )}
        </button>
      ))}
    </div>
  );
};

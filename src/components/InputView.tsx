import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InputViewProps {
  input: string;
  setInput: (value: string) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
}

export const InputView = ({ input, setInput, handleGenerate, isGenerating }: InputViewProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-8">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-3 uppercase italic">
          WHAT AI THINKS
        </h1>
        
        <p className="text-xl sm:text-2xl font-bold text-primary mb-6">
          AI 什么都知道
        </p>

        <div className="w-16 h-px bg-primary mx-auto mb-10" />
        
        <p className="text-[10px] sm:text-sm font-mono text-primary uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-12 opacity-60 px-4">
          ENTER THE VOID OF HUMAN CONSCIOUSNESS
        </p>
        
        <div className="bg-card border-2 border-primary p-1 shadow-[0_0_20px_hsl(var(--primary)/0.2)] input-glow transition-all">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-background">
            <div className="flex items-center flex-1">
              <span className="text-primary font-mono pl-4 pr-2 text-sm uppercase select-none">CMD &gt;</span>
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="INITIATE DECONSTRUCTION..."
                className="flex-1 bg-transparent py-5 text-sm font-mono focus-visible:ring-0 border-0 placeholder:text-foreground/20 min-w-0"
                disabled={isGenerating}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-primary text-primary-foreground px-8 py-5 h-auto font-black uppercase tracking-tighter hover:bg-foreground transition-colors disabled:opacity-50 rounded-none border-t sm:border-t-0 sm:border-l border-primary-foreground/50"
            >
              {isGenerating ? "WAITING..." : "RUN"}
            </Button>
          </div>
        </div>

        <p className="mt-8 text-[7px] sm:text-[8px] font-mono tracking-[0.4em] opacity-30 uppercase px-2 text-balance">
          SYSTEM NOTE: ALL INPUT IS LOGGED AND DECONSTRUCTED
        </p>
      </div>
    </div>
  );
};

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FooterProps {
  input: string;
  setInput: (value: string) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
}

export const Footer = ({ input, setInput, handleGenerate, isGenerating }: FooterProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full p-4 sm:p-8 z-50 border-t border-border bg-background/95 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-primary/30 p-1 flex flex-col sm:flex-row items-stretch sm:items-center shadow-2xl">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="INPUT NEW THOUGHT_..."
            className="flex-1 bg-transparent px-6 py-4 text-sm font-mono focus-visible:ring-0 border-0 placeholder:text-foreground/10 min-w-0"
            disabled={isGenerating}
          />
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-foreground text-background px-8 py-4 h-auto font-black uppercase tracking-tighter hover:bg-primary hover:text-primary-foreground transition-colors rounded-none border-t sm:border-t-0 sm:border-l border-primary-foreground/10"
          >
            {isGenerating ? "SCANNING..." : "SCAN"}
          </Button>
        </div>
      </div>
    </footer>
  );
};

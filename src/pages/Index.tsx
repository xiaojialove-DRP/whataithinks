import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { InputView } from "@/components/InputView";
import { HistoryView } from "@/components/HistoryView";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ComicEntry } from "@/components/ComicCard";

type PageType = 'INPUT' | 'HISTORY';

const Index = () => {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<ComicEntry[]>([]);
  const [currentPage, setCurrentPage] = useState<PageType>('INPUT');

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error("请输入您的想法");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-comic', {
        body: { thought: input.trim() }
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error("生成失败，请重试");
        return;
      }

      if (data.error) {
        console.error("API error:", data.error);
        toast.error(data.error);
        return;
      }

      const newEntry: ComicEntry = {
        id: Date.now(),
        thought: input,
        interpretation: `${data.englishInterpretation}\n// ${data.chineseInterpretation}`,
        imageUrl: data.imageUrl,
        timestamp: `LOG_UNIT_${Math.floor(Math.random() * 900) + 100}`
      };

      setHistory([newEntry, ...history]);
      setInput("");
      setCurrentPage('HISTORY');
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("网络错误，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Grid overlay */}
      <div className="fixed inset-0 grid-overlay pointer-events-none" />

      {currentPage === 'INPUT' ? (
        <InputView
          input={input}
          setInput={setInput}
          handleGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      ) : (
        <>
          <Header onBackClick={() => setCurrentPage('INPUT')} />
          <HistoryView history={history} />
          <Footer
            input={input}
            setInput={setInput}
            handleGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </>
      )}

      {isGenerating && <LoadingOverlay />}
    </div>
  );
};

export default Index;

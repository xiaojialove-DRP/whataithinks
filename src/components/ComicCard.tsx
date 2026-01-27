import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface ComicEntry {
  id: number;
  thought: string;
  interpretation: string;
  imageUrl: string | null;
  timestamp: string;
}

interface ComicCardProps {
  item: ComicEntry;
}

export const ComicCard = ({ item }: ComicCardProps) => {
  const copyPromptToClipboard = () => {
    const shareText = `【What AI Thinks】我的想法："${item.thought}"被AI解构了！`;
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success("已复制到剪贴板");
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success("已复制到剪贴板");
    });
  };

  const exportImage = async () => {
    const poster = document.createElement('div');
    poster.style.position = 'absolute';
    poster.style.left = '-9999px';
    poster.style.width = '750px';
    poster.style.backgroundColor = '#0A0A0A';
    poster.style.display = 'flex';
    poster.style.flexDirection = 'column';
    poster.style.fontFamily = "'Noto Sans SC', sans-serif";

    poster.innerHTML = `
      <div style="width: 100%; background-color: #0A0A0A; padding: 25px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="font-size: 28px; font-weight: 900; letter-spacing: -1.5px; color: #CCFF00; text-transform: uppercase;">WHAT AI THINKS</div>
        <div style="font-family: monospace; font-size: 10px; color: #FFFFFF; opacity: 0.4;">DECONSTRUCTION LOG / ${item.timestamp}</div>
      </div>

      <div style="width: 100%; background-color: #FFFFFF; padding: 40px; display: flex; flex-direction: column;">
        <div style="width: 100%; aspect-ratio: 1/1; overflow: hidden; border: 1px solid #000; background-color: #FFFFFF; position: relative;">
          <div style="position: absolute; inset: 0; pointer-events: none; z-index: 5; background-image: linear-gradient(rgba(0,0,0,0.03) 50%, transparent 50%), linear-gradient(90deg, rgba(0,0,0,0.01), rgba(0,0,255,0.01)); background-size: 100% 3px, 3px 100%;"></div>
          ${item.imageUrl ? `<img src="${item.imageUrl}" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.15); display: block;">` : '<div style="width: 100%; height: 100%; background: #f0f0f0;"></div>'}
        </div>
      </div>

      <div style="width: 100%; background-color: #0A0A0A; padding: 40px 40px 60px 40px; display: flex; flex-direction: column; gap: 35px;">
        <div>
          <div style="font-family: monospace; font-size: 11px; color: #CCFF00; margin-bottom: 8px; letter-spacing: 2px;">// ORIGINAL THOUGHT</div>
          <div style="font-size: 24px; font-weight: 300; font-style: italic; color: rgba(255,255,255,0.85); line-height: 1.4;">"${item.thought}"</div>
        </div>

        <div>
          <div style="font-family: monospace; font-size: 11px; color: #CCFF00; margin-bottom: 12px; letter-spacing: 2px;">// WHAT AI THOUGHT</div>
          <div style="font-size: 44px; font-weight: 900; letter-spacing: -1.5px; line-height: 1.05; color: #FFFFFF; white-space: pre-line; text-transform: uppercase;">${item.interpretation}</div>
        </div>
      </div>
      <div style="width: 100%; height: 10px; background-color: #CCFF00;"></div>
    `;

    document.body.appendChild(poster);

    try {
      const canvas = await html2canvas(poster, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `AI_THOUGHT_${item.id}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      toast.success("图片已导出");
    } catch (err) {
      console.error('Export error:', err);
      toast.error("导出失败");
    } finally {
      document.body.removeChild(poster);
    }
  };

  return (
    <article className="relative group animate-float overflow-hidden border border-border shadow-2xl rounded-sm">
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="w-full bg-secondary px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center border-b border-border">
          <div className="text-primary font-black italic text-lg sm:text-xl tracking-tighter">WHAT AI THINKS</div>
          <div className="text-[8px] sm:text-[10px] font-mono opacity-30 uppercase tracking-widest">{item.timestamp}</div>
        </div>

        {/* Comic Area */}
        <div className="w-full aspect-square bg-white p-3 sm:p-6 flex flex-col">
          <div className="flex-1 relative overflow-hidden border border-black/10">
            <div className="scanlines" />
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                className="w-full h-full object-cover grayscale contrast-125" 
                alt="AI Comic" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border border-black/10 rotate-45 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full bg-background p-6 sm:p-8 flex flex-col gap-6 sm:gap-10">
          <div className="py-1">
            <span className="text-[9px] sm:text-[10px] font-mono text-primary mb-2 block uppercase tracking-widest opacity-80">// ORIGINAL THOUGHT</span>
            <p className="text-xl sm:text-2xl font-light leading-snug tracking-tight text-foreground/90 italic">"{item.thought}"</p>
          </div>
          
          <div className="py-2 border-t border-border pt-6 sm:pt-8">
            <span className="text-[9px] sm:text-[10px] font-mono text-primary mb-4 block uppercase tracking-widest opacity-80">// WHAT AI THOUGHT</span>
            <p className="whitespace-pre-line text-3xl sm:text-5xl font-black tracking-tighter leading-[0.95] uppercase">
              {item.interpretation}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={exportImage}
              className="w-full sm:w-auto text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground px-6 py-4 sm:py-3 h-auto hover:bg-foreground hover:text-background transition-all active:scale-95 rounded-none"
            >
              [ EXPORT IMAGE ]
            </Button>
            <Button 
              onClick={copyPromptToClipboard}
              variant="outline"
              className="w-full sm:w-auto text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-primary border-primary px-6 py-4 sm:py-3 h-auto hover:bg-primary/10 transition-all active:scale-95 rounded-none"
            >
              [ COPY PROMPT LINK ]
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

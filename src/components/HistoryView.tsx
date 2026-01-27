import { ComicCard, ComicEntry } from "./ComicCard";

interface HistoryViewProps {
  history: ComicEntry[];
}

export const HistoryView = ({ history }: HistoryViewProps) => {
  return (
    <main className="pt-32 sm:pt-40 pb-72 px-4 sm:px-10 max-w-4xl mx-auto space-y-16 sm:space-y-32">
      <h2 className="text-lg sm:text-2xl font-black tracking-tighter uppercase text-muted-foreground border-b border-border pb-4 italic">
        // DECONSTRUCTION HISTORY
      </h2>
      
      {history.map((item) => (
        <ComicCard key={item.id} item={item} />
      ))}
    </main>
  );
};

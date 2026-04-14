import { Heart, Volume2, Flag } from "lucide-react";
import { useState } from "react";

export interface Word {
  id: string;
  word: string;
  translation: string;
  language: "uz" | "en";
  pronunciation?: string;
  partOfSpeech?: string;
  synonyms?: string[];
  antonyms?: string[];
  examples?: string[];
  idioms?: string[];
  audioUrl?: string;
}

interface WordDetailProps {
  word: Word;
  onFavoriteToggle?: (wordId: string) => void;
  isFavorite?: boolean;
}

export default function WordDetail({
  word,
  onFavoriteToggle,
  isFavorite = false,
}: WordDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (word.audioUrl) {
      setIsPlaying(true);
      const audio = new Audio(word.audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    }
  };

  return (
    <div className="animate-slide-up">
      {/* Word Header */}
      <div className="glass mb-6 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {word.word}
            </h2>
            {word.pronunciation && (
              <p className="text-sm text-muted-foreground italic">
                /{word.pronunciation}/
              </p>
            )}
          </div>
          <button
            onClick={() => onFavoriteToggle?.(word.id)}
            className="p-3 glass-sm hover:bg-white/10 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "fill-accent text-accent" : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        {/* Part of Speech */}
        {word.partOfSpeech && (
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
            {word.partOfSpeech}
          </span>
        )}
      </div>

      {/* Translation */}
      <div className="glass mb-6 p-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Tarjima
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-lg text-foreground">{word.translation}</p>
          {word.audioUrl && (
            <button
              onClick={playAudio}
              disabled={isPlaying}
              className="p-3 glass-sm hover:bg-white/10 transition-colors disabled:opacity-50"
              aria-label="Play pronunciation"
            >
              <Volume2
                className={`w-5 h-5 ${
                  isPlaying ? "text-accent" : "text-muted-foreground"
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Synonyms */}
      {word.synonyms && word.synonyms.length > 0 && (
        <div className="glass mb-6 p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Sinonimlar
          </h3>
          <div className="flex flex-wrap gap-2">
            {word.synonyms.map((synonym, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full hover:bg-accent/20 transition-colors cursor-pointer"
              >
                {synonym}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Antonyms */}
      {word.antonyms && word.antonyms.length > 0 && (
        <div className="glass mb-6 p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Antonimlar
          </h3>
          <div className="flex flex-wrap gap-2">
            {word.antonyms.map((antonym, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-destructive/10 text-red-400 text-sm rounded-full hover:bg-destructive/20 transition-colors cursor-pointer"
              >
                {antonym}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Examples */}
      {word.examples && word.examples.length > 0 && (
        <div className="glass mb-6 p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Misollar
          </h3>
          <div className="space-y-4">
            {word.examples.map((example, idx) => (
              <div key={idx} className="pl-4 border-l border-accent/30">
                <p className="text-foreground italic">"{example}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Idioms */}
      {word.idioms && word.idioms.length > 0 && (
        <div className="glass mb-6 p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Iboralar
          </h3>
          <div className="space-y-3">
            {word.idioms.map((idiom, idx) => (
              <div key={idx} className="text-foreground">
                <p className="font-medium">{idiom}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Error */}
      <div className="glass p-6">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors group">
          <Flag className="w-4 h-4 group-hover:text-accent" />
          Xatolikni Bildir
        </button>
      </div>
    </div>
  );
}

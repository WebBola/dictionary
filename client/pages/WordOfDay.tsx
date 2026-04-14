import { Sparkles, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import WordDetail from "@/components/WordDetail";
import { useState, useEffect } from "react";
import { WORD_OF_DAY } from "@/lib/dictionary";

export default function WordOfDay() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const handleToggleFavorite = (wordId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(wordId)) {
        newFavorites.delete(wordId);
      } else {
        newFavorites.add(wordId);
      }
      localStorage.setItem("favorites", JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  const handleShare = () => {
    const text = `Bugunning so'zi: ${WORD_OF_DAY.word} - ${WORD_OF_DAY.translation}`;
    if (navigator.share) {
      navigator.share({
        title: "O'zbek Lug'at - Kun So'zi",
        text: text,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert("So'z nusxalansildi!");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-accent/5 to-background/0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-accent" />
              <h1 className="text-4xl font-bold text-foreground">Bugunning So'zi</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Har kuni yangi va qiziqarli so'zlarni o'rganing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WordDetail
                word={WORD_OF_DAY}
                onFavoriteToggle={handleToggleFavorite}
                isFavorite={favorites.has(WORD_OF_DAY.id)}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass p-6 sticky top-20 space-y-4">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <Share2 className="w-4 h-4" />
                  Ulashish
                </button>

                <div className="glass-sm p-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    Maslahat
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Har kuni yangi so'zni o'zlashtirish uchun ushbu so'zni
                    sevimlilariga qo'shing va qayta qarang.
                  </p>
                </div>

                <Link
                  to="/quizzes"
                  className="w-full px-4 py-3 glass-sm rounded-lg font-medium text-center text-foreground hover:bg-white/10 transition-colors"
                >
                  Viktorinalar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

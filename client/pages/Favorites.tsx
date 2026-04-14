import { Heart, ArrowRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import WordDetail, { type Word } from "@/components/WordDetail";
import { getWordById } from "@/lib/dictionary";
import { useEffect, useMemo, useState } from "react";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const favoriteWords = useMemo(() => {
    return Array.from(favorites)
      .map((id) => getWordById(id))
      .filter(Boolean) as Word[];
  }, [favorites]);

  const removeFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.delete(id);
      localStorage.setItem("favorites", JSON.stringify(Array.from(next)));
      return next;
    });
    setSelectedWord((prev) => (prev?.id === id ? null : prev));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-accent/5 to-background/0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Sevimli So'zlar
            </h1>
            <p className="text-lg text-muted-foreground">
              Siz saqlagan barcha so'zlarni bu yerda topasiz.
            </p>
          </div>

          {favoriteWords.length === 0 ? (
            <div className="glass p-12 text-center">
              <Heart className="w-16 h-16 text-accent/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Hali sevimli so'zlar yo'q
              </h3>
              <p className="text-muted-foreground mb-6">
                Qidiruv sahifasida so'zlarni sevimlilar ro'yxatiga qo'shish uchun
                yurak belgisini bosing.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Qidiruvga O'tish
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="glass p-4 sticky top-20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-muted-foreground uppercase">
                      Sevimlilar
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {favoriteWords.length} ta
                    </div>
                  </div>

                  <div className="space-y-2">
                    {favoriteWords.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setSelectedWord(w)}
                        className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between gap-3 ${
                          selectedWord?.id === w.id
                            ? "bg-accent/15 border border-accent/40"
                            : "glass-sm hover:bg-white/10"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-foreground truncate">
                            {w.word}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {w.translation}
                          </div>
                        </div>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFavorite(w.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              removeFavorite(w.id);
                            }
                          }}
                          className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                          aria-label="Sevimlidan o'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                {selectedWord ? (
                  <WordDetail
                    word={selectedWord}
                    isFavorite
                    onFavoriteToggle={removeFavorite}
                  />
                ) : (
                  <div className="glass p-12 text-center">
                    <Heart className="w-16 h-16 text-accent/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      So'zni tanlang
                    </h3>
                    <p className="text-muted-foreground">
                      Chap tomondagi ro'yxatdan biror so'zni bosing.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

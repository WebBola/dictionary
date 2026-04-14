import { useState, useCallback, useMemo, useEffect } from "react";
import { Search, Clock, Zap, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import WordDetail, { Word } from "@/components/WordDetail";
import { SAMPLE_WORDS, WORD_OF_DAY } from "@/lib/dictionary";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchHistory, setSearchHistory] = useState<Word[]>([]);
  const [language, setLanguage] = useState<"uz" | "en">("uz");

  // Load favorites and history from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Filter words based on search query and language
  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    const query = searchQuery.toLowerCase();
    return SAMPLE_WORDS.filter(
      (word) =>
        word.language === language &&
        (word.word.toLowerCase().includes(query) ||
          word.translation.toLowerCase().includes(query))
    ).slice(0, 8); // Limit to 8 results
  }, [searchQuery, language]);

  const handleSelectWord = useCallback(
    (word: Word) => {
      setSelectedWord(word);
      setSearchQuery(word.word);

      // Add to search history
      setSearchHistory((prev) => {
        const filtered = prev.filter((w) => w.id !== word.id);
        return [word, ...filtered].slice(0, 10); // Keep last 10
      });
      localStorage.setItem(
        "searchHistory",
        JSON.stringify([word, ...searchHistory.filter((w) => w.id !== word.id)])
      );
    },
    [searchHistory]
  );

  const handleToggleFavorite = useCallback((wordId: string) => {
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
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-accent/5 to-background/0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          {!selectedWord && (
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                O'zbek-Ingliz Lug'at
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Tezkor, minimal va zamonaviy lug'at. O'zbek va Ingliz tillar
                o'rtasida oson tarjima qiling.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Search Panel */}
            <div className="lg:col-span-1">
              <div className="glass p-6 sticky top-20">
                {/* Language Toggle */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => {
                      setLanguage("uz");
                      setSearchQuery("");
                      setSelectedWord(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm font-medium ${
                      language === "uz"
                        ? "bg-accent text-accent-foreground"
                        : "glass-sm text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    O'zbek
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setSearchQuery("");
                      setSelectedWord(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm font-medium ${
                      language === "en"
                        ? "bg-accent text-accent-foreground"
                        : "glass-sm text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    English
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder={
                      language === "uz"
                        ? "So'zni yozing..."
                        : "Type a word..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  />
                </div>

                {/* Search Results */}
                {filteredWords.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                      {language === "uz" ? "Natijalar" : "Results"}
                    </h3>
                    {filteredWords.map((word) => (
                      <button
                        key={word.id}
                        onClick={() => handleSelectWord(word)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedWord?.id === word.id
                            ? "bg-accent/20 border border-accent/50"
                            : "glass-sm hover:bg-white/10"
                        }`}
                      >
                        <div className="font-medium text-foreground">
                          {word.word}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {word.translation}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Word of the Day */}
                {!selectedWord && !searchQuery && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                      {language === "uz" ? "Kun So'zi" : "Word of the Day"}
                    </h3>
                    <button
                      onClick={() => handleSelectWord(WORD_OF_DAY)}
                      className="w-full glass-sm p-4 rounded-lg hover:bg-white/10 transition-all text-left group"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-accent group-hover:text-accent mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-foreground">
                            {WORD_OF_DAY.word}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {WORD_OF_DAY.translation}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Search History */}
                {!selectedWord && searchHistory.length > 0 && !searchQuery && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                      {language === "uz" ? "So'nggi Qidiruvlar" : "Recent"}
                    </h3>
                    <div className="space-y-2">
                      {searchHistory.slice(0, 5).map((word) => (
                        <button
                          key={word.id}
                          onClick={() => handleSelectWord(word)}
                          className="w-full text-left p-2 rounded-lg glass-sm hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-foreground">
                            {word.word}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {selectedWord ? (
                <WordDetail
                  word={selectedWord}
                  onFavoriteToggle={handleToggleFavorite}
                  isFavorite={favorites.has(selectedWord.id)}
                />
              ) : (
                <div className="glass p-12 text-center">
                  <Zap className="w-16 h-16 text-accent/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {language === "uz"
                      ? "So'zni qidiring"
                      : "Search for a word"}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === "uz"
                      ? "O'zbekcha yoki Inglizcha so'zni qidirish bo'limiga yozing"
                      : "Type an Uzbek or English word to get started"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

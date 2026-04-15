import { useState, useCallback, useMemo, useEffect } from "react";
import { Search, Clock, Zap, Sparkles, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import WordDetail, { Word } from "@/components/WordDetail";
import { SAMPLE_WORDS, WORD_OF_DAY } from "@/lib/dictionary";
import {
  FavoriteMap,
  loadFavoriteFolders,
  saveFavoriteFolders,
} from "../lib/favoriteFolders";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [favorites, setFavorites] = useState<FavoriteMap>({});
  const [folders, setFolders] = useState<string[]>(["Umumiy"]);
  const [searchHistory, setSearchHistory] = useState<Word[]>([]);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [modalWord, setModalWord] = useState<Word | null>(null);
  const [selectedFolder, setSelectedFolder] = useState("Umumiy");
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    const { folders: savedFolders, mapping } = loadFavoriteFolders();
    setFolders(savedFolders);
    setFavorites(mapping);

    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) return;
    setSearchHistory((prev) => prev.slice(0, 10));
  }, [searchQuery]);

  const allWords = useMemo(
    () =>
      SAMPLE_WORDS.sort((a, b) => a.word.localeCompare(b.word, "uz")),
    []
  );

  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    const query = searchQuery.toLowerCase();
    return allWords.filter(
      (word) =>
        word.word.toLowerCase().includes(query) ||
        word.translation.toLowerCase().includes(query)
    );
  }, [searchQuery, allWords]);

  const wordsByLetter = useMemo(() => {
    return allWords.reduce((groups, word) => {
      const first = word.word[0].toUpperCase();
      if (!groups[first]) groups[first] = [];
      groups[first].push(word);
      return groups;
    }, {} as Record<string, Word[]>);
  }, [allWords]);

  const visibleLetters = useMemo(() => {
    return Object.keys(wordsByLetter).sort();
  }, [wordsByLetter]);

  const favoriteIds = useMemo(() => new Set(Object.keys(favorites)), [favorites]);

  const handleSelectWord = useCallback(
    (word: Word) => {
      setSelectedWord(word);
      setSearchQuery(word.word);

      setSearchHistory((prev) => {
        const filtered = prev.filter((w) => w.id !== word.id);
        const next = [word, ...filtered].slice(0, 10);
        localStorage.setItem("searchHistory", JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const closeFolderModal = () => {
    setFolderModalOpen(false);
    setModalWord(null);
    setNewFolderName("");
  };

  const handleFavoriteAction = useCallback(
    (wordId: string, word?: Word) => {
      if (favorites[wordId]) {
        const updated = { ...favorites };
        delete updated[wordId];
        setFavorites(updated);
        saveFavoriteFolders(folders, updated);
        if (selectedWord?.id === wordId) {
          setSelectedWord((prev) => (prev?.id === wordId ? prev : prev));
        }
        return;
      }

      const targetWord = word ?? selectedWord;
      if (!targetWord) return;
      setModalWord(targetWord);
      setSelectedFolder(folders[0] ?? "Umumiy");
      setFolderModalOpen(true);
    },
    [favorites, folders, selectedWord]
  );

  const handleSaveFavorite = () => {
    if (!modalWord) return;
    const folderName = newFolderName.trim() || selectedFolder || "Umumiy";
    const nextFolders = newFolderName.trim() && !folders.includes(folderName)
      ? [...folders, folderName]
      : folders;
    const nextFavorites = { ...favorites, [modalWord.id]: folderName };
    setFolders(nextFolders);
    setFavorites(nextFavorites);
    saveFavoriteFolders(nextFolders, nextFavorites);
    closeFolderModal();
  };

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const hasSearch = Boolean(searchQuery.trim());

  const displayWords = hasSearch ? filteredWords : allWords;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-accent/5 to-background/0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              O'zbek-Ingliz Lug'at
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Tezkor, neon aksentli lug'at tajribasi. So‘zlarni kuzatish va
              sevimlilar bilan ishlash endi oson.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-sm p-5 sticky top-20">

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="So'zni yozing..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  />
                </div>

                {filteredWords.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                      Natijalar
                    </h3>
                    {filteredWords.slice(0, 8).map((word) => (
                      <button
                        key={word.id}
                        onClick={() => handleSelectWord(word)}
                        className={`w-full text-left px-3 py-2 rounded-2xl transition-all ${
                          selectedWord?.id === word.id
                            ? "bg-accent/15 border border-accent/40"
                            : "glass-sm hover:bg-white/10"
                        }`}
                      >
                        <div className="font-semibold text-foreground text-sm">
                          {word.word}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {word.translation}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!selectedWord && !searchQuery && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                      Kun So'zi
                    </h3>
                    <button
                      onClick={() => handleSelectWord(WORD_OF_DAY)}
                      className="w-full glass-sm px-3 py-2 rounded-2xl hover:bg-white/10 transition-all text-left group"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-accent group-hover:text-accent mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-foreground text-sm">
                            {WORD_OF_DAY.word}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {WORD_OF_DAY.translation}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {!selectedWord && searchHistory.length > 0 && !searchQuery && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                      So'nggi Qidiruvlar
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

            <div className="lg:col-span-2">
              {selectedWord ? (
                <WordDetail
                  word={selectedWord}
                  onFavoriteToggle={() => handleFavoriteAction(selectedWord.id)}
                  isFavorite={favoriteIds.has(selectedWord.id)}
                />
              ) : (
                <div className="glass-sm p-5 mb-5">
                  <div className="glass-sm rounded-2xl overflow-hidden border border-white/10 bg-white/5 mb-4">
                    <div className="flex items-center gap-2 overflow-x-auto px-3 py-2 whitespace-nowrap scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      {visibleLetters.map((letter) => (
                        <button
                          key={letter}
                          type="button"
                          onClick={() => scrollToLetter(letter)}
                          className="rounded-full border border-white/10 bg-background/10 px-3 py-2 text-[11px] font-semibold text-foreground transition hover:bg-white/15"
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Har bir harfni bosib tegishli bo'limga o'ting.
                  </div>
                </div>
              )}

              <div className="glass-sm p-5">
                <div className="mb-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      {searchQuery.trim()
                        ? "Qidiruv Natijalari"
                        : "So'zlar Ro'yxati"}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchQuery.trim()
                        ? `${displayWords.length} topildi`
                        : "Bazada saqlangan barcha so'zlar"}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                    <Heart className="w-4 h-4 text-accent" />
                    {Object.keys(favorites).length} sevimli
                  </div>
                </div>

                {hasSearch ? (
                  <div className="grid grid-cols-1 gap-3">
                    {displayWords.map((word) => (
                      <div
                        key={word.id}
                        className="glass-sm px-3 py-2 rounded-2xl border border-white/10 flex items-center justify-between gap-3 hover:border-accent/40 transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectWord(word)}
                          className="text-left flex-1"
                        >
                          <div className="text-base font-semibold text-foreground">
                            {word.word}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {word.translation}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFavoriteAction(word.id, word)}
                          className={`rounded-full p-3 transition-colors ${
                            favoriteIds.has(word.id)
                              ? "bg-accent/15 text-accent"
                              : "bg-white/5 text-muted-foreground hover:bg-white/10"
                          }`}
                          aria-label={
                            favoriteIds.has(word.id)
                              ? "Remove favorite"
                              : "Add favorite"
                          }
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  Object.keys(wordsByLetter).length === 0 ? (
                    <div className="text-muted-foreground">Bu tilda so'zlar hozircha mavjud emas.</div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(wordsByLetter).map(([letter, words]) => (
                        <section key={letter} id={`letter-${letter}`}>
                          <div className="mb-3 rounded-2xl bg-white/5 p-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-semibold text-foreground">
                                {letter}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {words.length} ta so'z
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {words.map((word) => (
                              <div
                                key={word.id}
                                className="glass-sm p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-4 hover:border-accent/40 transition-all"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectWord(word)}
                                  className="text-left flex-1"
                                >
                                  <div className="text-base font-semibold text-foreground">
                                    {word.word}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {word.translation}
                                  </div>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleFavoriteAction(word.id, word)}
                                  className={`rounded-full p-3 transition-colors ${
                                    favoriteIds.has(word.id)
                                      ? "bg-accent/15 text-accent"
                                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                  }`}
                                  aria-label={
                                    favoriteIds.has(word.id)
                                      ? "Remove favorite"
                                      : "Add favorite"
                                  }
                                >
                                  <Heart className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {folderModalOpen && modalWord && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeFolderModal} />
              <div className="relative z-10 w-full max-w-xl bg-background/95 border border-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Sevimlilar papkasiga qo'shish
                    </p>
                    <h2 className="text-2xl font-semibold text-foreground">
                      {modalWord.word}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {modalWord.translation}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeFolderModal}
                    className="rounded-full p-2 glass-sm text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Papka tanlang
                    </label>
                    <select
                      value={selectedFolder}
                      onChange={(e) => setSelectedFolder(e.target.value)}
                      className="w-full bg-background/90 border border-white/10 rounded-2xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                    >
                      {folders.map((folder) => (
                        <option key={folder} value={folder}>
                          {folder}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Yangi papka yaratish
                    </label>
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Masalan: Darslik"
                      className="w-full bg-background/90 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeFolderModal}
                    className="px-5 py-3 glass-sm rounded-xl text-sm text-muted-foreground hover:bg-white/10 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveFavorite}
                    className="px-5 py-3 bg-accent text-accent-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Saqlash
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

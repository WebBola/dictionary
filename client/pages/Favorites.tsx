import { Heart, ArrowRight, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import WordDetail, { type Word } from "@/components/WordDetail";
import { getWordById } from "@/lib/dictionary";
import {
  FavoriteMap,
  loadFavoriteFolders,
  saveFavoriteFolders,
} from "../lib/favoriteFolders";
import { useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Favorites() {
  const [folders, setFolders] = useState<string[]>(["Umumiy"]);
  const [favorites, setFavorites] = useState<FavoriteMap>({});
  const [selectedFolder, setSelectedFolder] = useState("Barcha papkalar");
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

  useEffect(() => {
    const { folders: savedFolders, mapping } = loadFavoriteFolders();
    setFolders(savedFolders);
    setFavorites(mapping);
  }, []);

  const allFavoriteWords = useMemo(
    () =>
      Object.entries(favorites)
        .map(([id, folder]) => {
          const word = getWordById(id);
          return word ? { word, folder } : null;
        })
        .filter((item): item is { word: Word; folder: string } => Boolean(item)),
    [favorites]
  );

  const folderOptions = ["Barcha papkalar", ...folders];

  const visibleWords = useMemo(() => {
    if (selectedFolder === "Barcha papkalar") {
      return allFavoriteWords;
    }
    return allFavoriteWords.filter((item) => item.folder === selectedFolder);
  }, [allFavoriteWords, selectedFolder]);

  const favoriteWords = visibleWords.map((item) => item.word);

  const setCurrentFolder = (folder: string) => {
    setSelectedFolder(folder);
    setSelectedWord(null);
  };

  const saveState = (nextFolders: string[], nextFavorites: FavoriteMap) => {
    setFolders(nextFolders);
    setFavorites(nextFavorites);
    saveFavoriteFolders(nextFolders, nextFavorites);
  };

  const deleteFolder = (folder: string) => {
    if (folder === "Barcha papkalar" || folder === "Umumiy") return;
    const nextFolders = folders.filter((item) => item !== folder);
    const nextFavorites = Object.fromEntries(
      Object.entries(favorites).map(([id, itemFolder]) => [
        id,
        itemFolder === folder ? "Umumiy" : itemFolder,
      ])
    );
    saveState(nextFolders, nextFavorites);
    if (selectedFolder === folder) {
      setSelectedFolder("Barcha papkalar");
    }
    setFolderToDelete(null);
  };

  const addFolder = () => {
    const name = newFolderName.trim();
    if (!name || folders.includes(name)) return;
    const nextFolders = [...folders, name];
    saveState(nextFolders, favorites);
    setNewFolderName("");
    setSelectedFolder(name);
  };

  const removeFavorite = (id: string) => {
    const nextFavorites = { ...favorites };
    delete nextFavorites[id];
    saveState(folders, nextFavorites);
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
              Papkalar yordamida sevimli so'zlaringizni tartiblang.
            </p>
          </div>

          {Object.keys(favorites).length === 0 ? (
            <div className="glass p-12 text-center">
              <Heart className="w-16 h-16 text-accent/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Hali sevimli so'zlar yo'q
              </h3>
              <p className="text-muted-foreground mb-6">
                Bosh sahifadagi yurak tugmasini bosib sevimlilarga qo'shing.
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
                <div className="glass-sm p-5 sticky top-20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground uppercase">
                        Papkalar
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Object.keys(favorites).length} ta sevimli so'z
                      </p>
                    </div>
                    <div className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {folders.length} papka
                    </div>
                  </div>

                  <div className="space-y-2">
                    {folderOptions.map((folder) => (
                      <div key={folder} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCurrentFolder(folder)}
                          className={`flex-1 text-left rounded-2xl px-4 py-3 transition-all ${
                            selectedFolder === folder
                              ? "bg-accent/20 border border-accent/40"
                              : "glass-sm hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-foreground">{folder}</span>
                            <span className="text-xs text-muted-foreground">
                              {allFavoriteWords.filter((item) =>
                                folder === "Barcha papkalar"
                                  ? true
                                  : item.folder === folder
                              ).length}
                            </span>
                          </div>
                        </button>
                        {folder !== "Barcha papkalar" && folder !== "Umumiy" ? (
                          <button
                            type="button"
                            onClick={() => setFolderToDelete(folder)}
                            className="p-2 rounded-full glass-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            aria-label={`Papka ${folder} ni o'chirish`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <AlertDialog open={Boolean(folderToDelete)} onOpenChange={(open) => { if (!open) setFolderToDelete(null); }}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>“{folderToDelete}” papkasini o'chirish</AlertDialogTitle>
                        <AlertDialogDescription>
                          Ushbu papkani o'chirish papkaga tegishli so'zlarni "Umumiy" papkaga ko'chiradi.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                        <AlertDialogAction onClick={() => folderToDelete && deleteFolder(folderToDelete)} className="bg-destructive hover:bg-destructive/90">
                          Ha, o'chir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <div className="mt-6 border-t border-white/10 pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-muted-foreground uppercase">
                        Yangi papka
                      </span>
                      <Plus className="w-4 h-4 text-accent" />
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Darslik, Sayohat, Yuridik"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                      <button
                        type="button"
                        onClick={addFolder}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-accent text-accent-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
                      >
                        Papka yaratish
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                {favoriteWords.length === 0 ? (
                  <div className="glass-sm p-10 text-center">
                    <Heart className="w-16 h-16 text-accent/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Bu papkada so'zlar yo'q
                    </h3>
                    <p className="text-muted-foreground">
                      Yangi papka tanlang yoki boshqa papkadan so'z qo'shing.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="glass-sm p-5 rounded-2xl">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">
                            {selectedFolder}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            {favoriteWords.length} ta so'z
                          </p>
                        </div>
                        <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                          Tanlangan papka
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {favoriteWords.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setSelectedWord(w)}
                          className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center justify-between gap-4 ${
                            selectedWord?.id === w.id
                              ? "bg-accent/20 border border-accent/40"
                              : "glass-sm hover:bg-white/10"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-base font-semibold text-foreground truncate">
                              {w.word}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {w.translation}
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-muted-foreground">
                            {favorites[w.id]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedWord && (
                  <div className="mt-6">
                    <WordDetail
                      word={selectedWord}
                      isFavorite
                      onFavoriteToggle={removeFavorite}
                    />
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

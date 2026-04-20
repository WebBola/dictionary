import { Sparkles, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import WordDetail from "@/components/WordDetail";
import { useState, useEffect } from "react";
import { WORD_OF_DAY } from "@/lib/dictionary";
import {
  FavoriteMap,
  loadFavoriteFolders,
  saveFavoriteFolders,
} from "../lib/favoriteFolders";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function WordOfDay() {
  const [folders, setFolders] = useState<string[]>(["Umumiy"]);
  const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
  const [selectedFolder, setSelectedFolder] = useState("Umumiy");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedFolderData = localStorage.getItem("favoriteFolders");
    if (storedFolderData) {
      const { folders: savedFolders, mapping } = loadFavoriteFolders();
      setFolders(savedFolders);
      setFavoriteMap(mapping);
      return;
    }

    const legacyFavorites = localStorage.getItem("favorites");
    if (legacyFavorites) {
      try {
        const parsed = JSON.parse(legacyFavorites);
        if (Array.isArray(parsed)) {
          const mapping = parsed.reduce<FavoriteMap>((acc, item) => {
            if (typeof item === "string") {
              acc[item] = "Umumiy";
            }
            return acc;
          }, {});
          const nextFolders = ["Umumiy"];
          saveFavoriteFolders(nextFolders, mapping);
          localStorage.removeItem("favorites");
          setFolders(nextFolders);
          setFavoriteMap(mapping);
          return;
        }
      } catch {
        // ignore invalid legacy data
      }
    }

    const { folders: defaultFolders, mapping: defaultMapping } = loadFavoriteFolders();
    setFolders(defaultFolders);
    setFavoriteMap(defaultMapping);
  }, []);

  const isFavorite = Boolean(favoriteMap[WORD_OF_DAY.id]);

  const addFavorite = () => {
    const folderName = selectedFolder || "Umumiy";
    const nextFolders = folders.includes(folderName) ? folders : [...folders, folderName];
    const nextFavorites = { ...favoriteMap, [WORD_OF_DAY.id]: folderName };
    setFolders(nextFolders);
    setFavoriteMap(nextFavorites);
    saveFavoriteFolders(nextFolders, nextFavorites);
    setSaveDialogOpen(false);
  };

  const handleToggleFavorite = (wordId: string) => {
    if (favoriteMap[wordId]) {
      const nextFavorites = { ...favoriteMap };
      delete nextFavorites[wordId];
      setFavoriteMap(nextFavorites);
      saveFavoriteFolders(folders, nextFavorites);
      return;
    }

    setSelectedFolder(folders[0] || "Umumiy");
    setSaveDialogOpen(true);
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
                isFavorite={isFavorite}
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

          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Papka tanlang</DialogTitle>
                <DialogDescription>
                  Kun so'zini sevimlilar papkasiga qo'shing.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Papka tanlang
                  </label>
                  <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                    <SelectTrigger className="w-full" aria-label="Papka tanlang">
                      <SelectValue placeholder="Umumiy" />
                    </SelectTrigger>
                    <SelectContent>
                      {folders.map((folder) => (
                        <SelectItem key={folder} value={folder}>
                          {folder}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <button className="px-4 py-3 rounded-lg text-sm text-foreground bg-white/10 hover:bg-white/20 transition-colors">
                    Bekor qilish
                  </button>
                </DialogClose>
                <button
                  type="button"
                  onClick={addFavorite}
                  className="px-4 py-3 rounded-lg text-sm bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  Saqlash
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}

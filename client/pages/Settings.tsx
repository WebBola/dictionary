import {
  Settings as SettingsIcon,
  Trash2,
  Moon,
  Sun,
} from "lucide-react";
import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Settings() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const current = (theme === "system" ? resolvedTheme : theme) ?? "dark";
  const isDark = current === "dark";

  const counts = useMemo(() => {
    const historyRaw = localStorage.getItem("searchHistory");
    const favoritesRaw = localStorage.getItem("favorites");
    return {
      history: historyRaw ? (JSON.parse(historyRaw) as unknown[]).length : 0,
      favorites: favoritesRaw ? (JSON.parse(favoritesRaw) as unknown[]).length : 0,
    };
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("searchHistory");
    toast.success("Qidiruv tarixi tozalandi");
  };

  const clearFavorites = () => {
    localStorage.removeItem("favorites");
    toast.success("Sevimli so'zlar tozalandi");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-accent/5 to-background/0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-accent" />
              <h1 className="text-4xl font-bold text-foreground">Sozlamalar</h1>
            </div>
            <p className="text-muted-foreground mt-3">
              Interfeys, audio va ma’lumotlar boshqaruvi.
            </p>
          </div>

          <div className="space-y-6">
            {/* Dark Mode */}
            <div className="glass p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Tema</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tungi va kunduzgi rejimni almashtiring.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="gap-2"
                >
                  {isDark ? (
                    <>
                      <Moon className="text-accent" />
                      Tun
                    </>
                  ) : (
                    <>
                      <Sun className="text-accent" />
                      Kunduz
                    </>
                  )}
                </Button>
              </div>
              <div className="glass-sm p-4 text-sm text-muted-foreground">
                Hozirgi holat:{" "}
                <span className="text-foreground font-medium">
                  {isDark ? "Tungi" : "Kunduzgi"}
                </span>
              </div>
            </div>

            {/* Data Management */}
            <div className="glass p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Ma'lumotlarni boshqarish
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tarix va sevimlilarni tozalashdan oldin tasdiqlash so'raladi.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-4 glass-sm hover:bg-white/10 rounded-lg transition-colors text-left"
                    >
                      <div>
                        <div className="text-foreground font-medium">
                          Qidiruv tarixini tozalash
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {counts.history} ta yozuv o'chiriladi
                        </div>
                      </div>
                      <Trash2 className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Qidiruv tarixini o'chiraymi?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu amalni ortga qaytarib bo'lmaydi. Qidiruv tarixi butunlay
                        o'chiriladi.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                      <AlertDialogAction onClick={clearHistory}>
                        Ha, o'chir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-4 glass-sm hover:bg-white/10 rounded-lg transition-colors text-left"
                    >
                      <div>
                        <div className="text-foreground font-medium">
                          Sevimli so'zlarni o'chirish
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {counts.favorites} ta so'z o'chiriladi
                        </div>
                      </div>
                      <Trash2 className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Sevimlilarni o'chiraymi?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu amalni ortga qaytarib bo'lmaydi. Barcha sevimli so'zlar
                        o'chiriladi.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                      <AlertDialogAction onClick={clearFavorites} className="bg-destructive hover:bg-destructive/90">
                        Ha, o'chir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* About */}
            <div className="glass p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Dastur Haqida
              </h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="text-foreground font-medium">Versiya:</span> 1.0.0
                </p>
                <p>
                  <span className="text-foreground font-medium">
                    Yaratilgan:
                  </span>{" "}
                  2024
                </p>
                <p className="mt-4">
                  O'zbek Lug'at - minimalist va zamonaviy lug'at servisi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

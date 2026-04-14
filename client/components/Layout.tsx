import { Link } from "react-router-dom";
import {
  BookOpen,
  Heart,
  Clock,
  Brain,
  Settings,
  Menu,
  ArrowRight,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 glass-sm group-hover:bg-white/10 transition-colors">
                <BookOpen className="w-5 h-5 text-accent glow" />
              </div>
              <div>
                <div className="font-bold text-lg text-foreground">O'zbek</div>
                <div className="text-xs text-muted-foreground">Lug'at</div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Qidiruv
              </Link>
              <Link
                to="/word-of-day"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Kun So'zi
              </Link>
              <Link
                to="/favorites"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sevimlilar
              </Link>
              <Link
                to="/quizzes"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Viktorinalar
              </Link>
              <Link
                to="/settings"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sozlamalar
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              <div className="md:hidden flex items-center gap-2">
                <ThemeToggle />
                <Sheet>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Menyu"
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-0">
                    <div className="p-6">
                      <SheetTitle className="flex items-center gap-3">
                        <div className="p-2 glass-sm">
                          <BookOpen className="w-5 h-5 text-accent" />
                        </div>
                        <div className="leading-tight">
                          <div className="font-semibold text-foreground">O'zbek Lug'at</div>
                          <div className="text-sm text-muted-foreground">Menyu</div>
                        </div>
                      </SheetTitle>
                    </div>

                    <Separator />

                    <div className="p-3">
                      <SheetClose asChild>
                        <Link
                          to="/"
                          className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-accent/10 transition-colors"
                        >
                          <span className="flex items-center gap-3 text-foreground">
                            <Clock className="w-4 h-4 text-accent" />
                            Qidiruv
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/word-of-day"
                          className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-accent/10 transition-colors"
                        >
                          <span className="flex items-center gap-3 text-foreground">
                            <Brain className="w-4 h-4 text-accent" />
                            Kun So'zi
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/favorites"
                          className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-accent/10 transition-colors"
                        >
                          <span className="flex items-center gap-3 text-foreground">
                            <Heart className="w-4 h-4 text-accent" />
                            Sevimlilar
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/quizzes"
                          className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-accent/10 transition-colors"
                        >
                          <span className="flex items-center gap-3 text-foreground">
                            <Brain className="w-4 h-4 text-accent" />
                            Viktorinalar
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/settings"
                          className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-accent/10 transition-colors"
                        >
                          <span className="flex items-center gap-3 text-foreground">
                            <Settings className="w-4 h-4 text-accent" />
                            Sozlamalar
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="glass border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">O'zbek Lug'at</h4>
              <p className="text-sm text-muted-foreground">
                Minimal, zamonaviy Oz'bek-Ingliz lug'at.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Xususiyatlar</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-accent transition-colors">
                    Smart Qidiruv
                  </Link>
                </li>
                <li>
                  <Link
                    to="/favorites"
                    className="hover:text-accent transition-colors"
                  >
                    Sevimlilar
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quizzes"
                    className="hover:text-accent transition-colors"
                  >
                    Viktorinalar
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Boshqa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors"
                    onClick={() =>
                      alert(
                        "Xatolik haqida xabar berish formasi keyinchalik qo'shiladi"
                      )
                    }
                  >
                    Xatolikni Bildir
                  </a>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="hover:text-accent transition-colors"
                  >
                    Sozlamalar
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Tillar</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>O'zbek ↔ Ingliz</li>
                <li>Ko'proq tillar keyin</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 O'zbek Lug'at. Barcha huquqlar saqlanib qolgan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

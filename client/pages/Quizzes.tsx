import {
  Brain,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import { getWordById } from "@/lib/dictionary";
import type { Word } from "@/components/WordDetail";
import { loadFavoriteFolders } from "../lib/favoriteFolders";

type QuizQuestion = {
  prompt: string;
  correctId: string;
  options: { id: string; label: string }[];
};

function pickRandom<T>(arr: T[], n: number) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function buildQuizFromWords(words: Word[], count = 10): QuizQuestion[] {
  const usable = words.filter((w) => w.translation?.trim());
  const questions: QuizQuestion[] = [];
  const base = pickRandom(usable, Math.min(count, usable.length));

  for (const w of base) {
    const sameLang = usable.filter((x) => x.language === w.language && x.id !== w.id);
    const distractors = pickRandom(sameLang, 3);
    const options = pickRandom([w, ...distractors], Math.min(4, 1 + distractors.length)).map(
      (opt) => ({
        id: opt.id,
        label: opt.translation,
      })
    );
    questions.push({
      prompt: `“${w.word}” tarjimasi qaysi?`,
      correctId: w.id,
      options,
    });
  }
  return questions;
}

export default function Quizzes() {
  const [favoriteMap, setFavoriteMap] = useState<Record<string, string>>({});
  const [folders, setFolders] = useState<string[]>(["Umumiy"]);
  const [selectedFolder, setSelectedFolder] = useState("Barcha papkalar");
  const [questionCount, setQuestionCount] = useState(10);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const { folders: savedFolders, mapping } = loadFavoriteFolders();
    setFolders(savedFolders);
    setFavoriteMap(mapping);
  }, []);

  const allFavorites = useMemo(
    () =>
      Object.keys(favoriteMap)
        .map((id) => getWordById(id))
        .filter(Boolean) as Word[],
    [favoriteMap]
  );

  const folderOptions = useMemo(() => ["Barcha papkalar", ...folders], [folders]);

  useEffect(() => {
    if (!folderOptions.includes(selectedFolder)) {
      setSelectedFolder("Barcha papkalar");
    }
  }, [folderOptions, selectedFolder]);

  const sourceWords = useMemo(() => {
    if (selectedFolder === "Barcha papkalar") {
      return allFavorites;
    }
    return allFavorites.filter((word) => favoriteMap[word.id] === selectedFolder);
  }, [allFavorites, favoriteMap, selectedFolder]);

  const maxQuestionCount = Math.max(5, sourceWords.length);

  useEffect(() => {
    if (questionCount > maxQuestionCount) {
      setQuestionCount(maxQuestionCount);
    }
  }, [maxQuestionCount, questionCount]);

  const canStart = sourceWords.length >= 3;

  const start = () => {
    const questions = buildQuizFromWords(sourceWords, Math.min(questionCount, sourceWords.length));
    setQuiz(questions);
    setIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setRevealed(false);
  };

  const current = quiz[idx];
  const isCorrect = current ? selected === current.correctId : false;

  const advanceQuestion = () => {
    if (!current || !revealed) return;

    if (idx + 1 >= quiz.length) {
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-accent/5 to-background/0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-accent" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Viktorinalar
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mt-4">
              Sevimli so'zlari asosida flashcard va viktorinalar orqali o'zingizni
              tekshiring.
            </p>
          </div>

          {!canStart ? (
            <div className="glass p-12 text-center">
              <Brain className="w-16 h-16 text-accent/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Viktorina uchun yetarli so'zlar yo'q
              </h3>
              <p className="text-muted-foreground mb-6">
                Kamida 3 ta so'zni sevimlilarga qo'shing. Hozir: <span className="text-foreground font-medium">{sourceWords.length} ta</span>.
              </p>
              <Link
                to="/favorites"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Sevimlilar sahifasiga o'tish
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : quiz.length === 0 ? (
            <div className="glass p-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 glass-sm">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-xl font-semibold text-foreground">
                    Viktorina sozlamalari
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Manbani tanlang va savollar sonini belgilab boshlang.
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                <div className="glass-sm p-5 rounded-3xl border border-white/10">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-3 block">
                    Papka tanlash
                  </label>
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full bg-background/10 border border-white/10 rounded-3xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 appearance-none"
                  >
                    {folderOptions.map((folder) => (
                      <option key={folder} value={folder}>
                        {folder}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="glass-sm p-5 rounded-3xl border border-white/10">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-3 block">
                    Savollar soni
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={Math.max(5, sourceWords.length)}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full accent-accent"
                  />
                  <div className="mt-3 text-sm text-foreground font-semibold">
                    {questionCount} ta savol
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {sourceWords.length} ta so'z manba sifatida tanlandi.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  Saqlangan so'zlar: <span className="text-foreground font-semibold">{allFavorites.length}</span>
                </div>
                <button
                  type="button"
                  onClick={start}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Boshlash
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : finished ? (
            <div className="glass p-12 text-center">
              <CheckCircle2 className="w-14 h-14 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Tugadi!
              </h3>
              <p className="text-muted-foreground mb-6">
                Natija:{" "}
                <span className="text-foreground font-semibold">
                  {score}/{quiz.length}
                </span>
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={start}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Qayta Boshlash
                  <RotateCcw className="w-4 h-4" />
                </button>
                <Link
                  to="/favorites"
                  className="inline-flex items-center gap-2 px-6 py-3 glass-sm rounded-lg font-medium hover:bg-white/10 transition-colors text-foreground"
                >
                  Sevimlilar
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass p-8">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="text-sm text-muted-foreground">
                  Savol{" "}
                  <span className="text-foreground font-medium">{idx + 1}</span>/
                  {quiz.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ball:{" "}
                  <span className="text-foreground font-medium">{score}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xl md:text-2xl font-semibold text-foreground">
                  {current.prompt}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.options.map((opt) => {
                  const isPicked = selected === opt.id;
                  const isAnswer = current.correctId === opt.id;
                  const showCorrect = revealed && isAnswer;
                  const showWrong = revealed && isPicked && !isAnswer;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        if (revealed) return;
                        setSelected(opt.id);
                        if (opt.id === current.correctId) {
                          setScore((s) => s + 1);
                        }
                        setRevealed(true);
                      }}
                      className={`p-4 rounded-xl text-left transition-all duration-150 ${
                        showCorrect
                          ? "bg-accent/20 border border-accent/60"
                          : showWrong
                            ? "bg-destructive/10 border border-destructive/40"
                            : isPicked
                              ? "bg-accent/15 border border-accent/40"
                              : "glass-sm hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-foreground font-medium">
                          {opt.label}
                        </div>
                        {revealed && isAnswer ? (
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        ) : revealed && isPicked && !isAnswer ? (
                          <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  {!revealed ? (
                    "Variantni tanlang"
                  ) : isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        To'g'ri
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-destructive" />
                        Noto'g'ri
                      </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={advanceQuestion}
                  disabled={!revealed}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
                >
                  Keyingi
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

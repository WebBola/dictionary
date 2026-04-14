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
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavoriteIds(JSON.parse(saved));
  }, []);

  const favoriteWords = useMemo(() => {
    return favoriteIds
      .map((id) => getWordById(id))
      .filter(Boolean) as Word[];
  }, [favoriteIds]);

  const canStart = favoriteWords.length >= 3;

  const start = () => {
    const questions = buildQuizFromWords(favoriteWords, 10);
    setQuiz(questions);
    setIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setRevealed(false);
  };

  const current = quiz[idx];
  const isCorrect = current ? selected === current.correctId : false;

  const checkAnswer = () => {
    if (!current || !selected) return;
    if (!revealed) {
      if (selected === current.correctId) setScore((s) => s + 1);
      setRevealed(true);
      return;
    }

    // move to next question
    if (idx + 1 >= quiz.length) setFinished(true);
    else setIdx((i) => i + 1);
    setSelected(null);
    setRevealed(false);
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
                Viktorina uchun so'zlar yetarli emas
              </h3>
              <p className="text-muted-foreground mb-6">
                Kamida 3 ta so'zni sevimlilarga qo'shing. Hozir:{" "}
                <span className="text-foreground font-medium">
                  {favoriteWords.length} ta
                </span>
                .
              </p>
              <Link
                to="/favorites"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Sevimli So'zlarga O'tish
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : quiz.length === 0 ? (
            <div className="glass p-10">
              <div className="flex items-start gap-4">
                <div className="p-3 glass-sm">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-xl font-semibold text-foreground">
                    Sevimlilar asosida viktorina
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Savollar: 10 ta • Variantlar: 4 ta • Natija oxirida ko'rinadi
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
                <div className="text-sm text-muted-foreground">
                  Sevimli so'zlar:{" "}
                  <span className="text-foreground font-medium">
                    {favoriteWords.length}
                  </span>
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
                        if (!revealed) setSelected(opt.id);
                      }}
                      disabled={revealed}
                      className={`p-4 rounded-lg text-left transition-all ${
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
                  {!selected ? (
                    "Variantni tanlang"
                  ) : !revealed ? (
                    "Tekshirish uchun tugmani bosing"
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
                  onClick={checkAnswer}
                  disabled={!selected}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
                >
                  {revealed ? "Keyingi" : "Tekshirish"}
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

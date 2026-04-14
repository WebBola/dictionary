import type { Word } from "@/components/WordDetail";

// Sample dictionary data - in a real app, this would come from an API
export const SAMPLE_WORDS: Word[] = [
  {
    id: "kitob-1",
    word: "kitob",
    translation: "book",
    language: "uz",
    pronunciation: "ki-tob",
    partOfSpeech: "noun",
    synonyms: ["asar", "nashr"],
    antonyms: [],
    examples: [
      "Bu kitob juda qiziq.",
      "Men har kuni kitob o'qiman.",
      "Universiteta kitobxonasida ko'p kitoblar bor.",
    ],
    idioms: ["Kitob o'qiydigan odam - donishmand", "Kitob - hayotning yog'i"],
  },
  {
    id: "eshit-1",
    word: "eshit",
    translation: "listen",
    language: "uz",
    pronunciation: "e-shit",
    partOfSpeech: "verb",
    synonyms: ["qo'lga olmoq", "tinglash"],
    antonyms: ["gap qo'y"],
    examples: [
      "Menga eshit!",
      "U musiqani diqqat bilan eshitdi.",
      "O'qituvchining so'zlarini eshitaylik.",
    ],
    idioms: ["Eshitmasli quloq", "Eshita olmaydi"],
  },
  {
    id: "sevgi-1",
    word: "sevgi",
    translation: "love",
    language: "uz",
    pronunciation: "sev-gi",
    partOfSpeech: "noun",
    synonyms: ["muhabbat", "mehnot"],
    antonyms: ["nafrat", "o'g'inchiklik"],
    examples: [
      "Sevgi butun dunyoni birlashtiradi.",
      "Ota-onaning o'z farzandiga sevgisi cheksiz.",
      "Vatan sevgisi har bir kishi uchun muhimdir.",
    ],
    idioms: ["Sevgi bilan yozu", "Sevgining kuchi"],
  },
  {
    id: "baholavchi-1",
    word: "baholavchi",
    translation: "critic",
    language: "uz",
    pronunciation: "ba-hol-av-chi",
    partOfSpeech: "noun",
    synonyms: ["tanqid qiluvchi", "qadrlash"],
    antonyms: ["tariflovchi"],
    examples: [
      "Film baholavchilari bu filmni birinchi o'rinli deb topdilar.",
      "Uning asarini baholavchilar qimmatbaho deb hisoblaydilar.",
    ],
    idioms: ["Baholavchisiz hech narsa yo'q"],
  },
  {
    id: "book-1",
    word: "book",
    translation: "kitob",
    language: "en",
    pronunciation: "bʊk",
    partOfSpeech: "noun",
    synonyms: ["novel", "volume", "tome"],
    antonyms: [],
    examples: [
      "She reads a book every day.",
      "That is a very interesting book.",
      "The library has thousands of books.",
    ],
    idioms: ["Book of life", "Closed book"],
  },
];

export const WORD_OF_DAY: Word = {
  id: "kun-sozi",
  word: "doniş",
  translation: "knowledge, wisdom",
  language: "uz",
  pronunciation: "do-nish",
  partOfSpeech: "noun",
  synonyms: ["ilm", "aqil"],
  antonyms: ["jaholat", "betaraf"],
  examples: [
    "Doniş taun sarchashmasiga o'xshaydi.",
    "Doniş - dunyodagi eng qimmatli boylik.",
    "Ota-ona farzandiga doniş beradi.",
  ],
  idioms: ["Donishning asosi - sabr", "Donish darori yok"],
};

export function getWordById(id: string): Word | undefined {
  if (WORD_OF_DAY.id === id) return WORD_OF_DAY;
  return SAMPLE_WORDS.find((w) => w.id === id);
}


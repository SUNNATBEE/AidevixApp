---
loyiha: Aidevix mobil ilova
sana: 2026-06-21
funksiya: Dars Quiz (Testlar)
status: dizayn tasdiqlangan
---

# Dars Quiz — Dizayn

## Maqsad
Foydalanuvchi bilimини test orqali tekshiradi. To'g'ri javob → XP (+10/savol),
o'tish → +100 bonus. Backend **to'liq tayyor**, faqat mobil UI yoziladi.

## Backend kontrakti (mavjud, o'zgarmaydi)
```
GET  /api/xp/quiz/video/:videoId   → { success, data: null | {
        quiz: { _id, videoId, courseId, title, passingScore, isActive,
                questions: [{ _id, question, options: string[], xpReward }] },
        alreadySolved: boolean, previousScore: number | null
     }}
     // correctAnswer .select('-questions.correctAnswer') bilan YASHIRILGAN

POST /api/xp/quiz/:quizId   body: { answers: [{questionIndex, selectedOption}] }
     → { success, data: { score, passed, correctCount, totalQuestions,
            xpEarned, totalXp, level, levelProgress,
            answers: [{questionIndex, selectedOption, isCorrect}] }}
     // unique(userId, quizId): faqat 1 marta. Takror → 400 "allaqachon yechgansiz"
     // passed = score >= passingScore (default 70)
```

## Qaror qilingan UX (foydalanuvchi tanlovi)
- **Entry point:** Home `quickActions` qatorida 4-chi ikonka "Testlar"
  (Editor / Shorts / Asoschilar yonida).
- **Presentation:** `pageSheet` Modal (AiHelperModal pattern).
- **Feedback:** hammasi yechilgach — bitta natija ekrani (bitta submit).
- **Savol:** hozircha bitta o'zgarmas test (shuffle yo'q, backend o'zgarmaydi).
- **Topish:** "Testlar" bitta mavjud testga olib boradi. Backendда "testlar
  ro'yxati" endpointи yo'q → birinchi top-kurs videolaridan testи borини
  qidiramiz (probe), topilmasa "Hozircha test yo'q" empty state.

## Fayllar
| Fayl | O'zgarish |
|------|-----------|
| `src/types/quiz.ts` | YANGI — Quiz/savol/natija tiplari |
| `src/api/xpApi.ts` | TUZATISH — `submitQuiz(quizId, answers: QuizAnswer[])` (avval `number[]` noto'g'ri edi) |
| `src/components/quiz/QuizModal.tsx` | YANGI — pageSheet modal, 4 holat: loading / empty / questions / result |
| `src/screens/home/HomeScreen.tsx` | TUZATISH — "Testlar" ActionIcon + QuizModal ulash |

## QuizModal holatlari
1. **loading** — videoId topиш (probe) + getQuizForVideo
2. **empty** — quiz yo'q (`data===null` yoki probe topмади) → info + yopish
3. **alreadySolved** — "Allaqachon yechilgan • {previousScore}%" (ko'rish)
4. **questions** — savollar + variantlar (radio). Barchasi javoblanмагунча
   "Topshirish" disabled. submitQuiz → result
5. **result** — score%, passed ✓/✗, correctCount/total, +xpEarned XP.
   Har savol yonida isCorrect belgisi. passed → XPToast + success haptic.
   So'ngra `dispatch(updateUserLocal({ xp: totalXp }))` — Home XP yangilanadi.

## Doираdан tashqari (ustoz / keyin)
- Sertifikat-gate (test o'tmаса sertifikat yo'q) — backend logikasi.
- "Testlar ro'yxati" endpoint + chiroyli ro'yxat ekrani.
- Random savol banki + qayta yechish (mashq rejimi).
- Backendда quiz seeder yo'q → test yaratилмаguncha "test yo'q" ko'rinadi.

## Tekshiruv
- `tsc` 0 xato
- Qo'lda: testи bor video, testsiz, allaqachon yechilgan holat

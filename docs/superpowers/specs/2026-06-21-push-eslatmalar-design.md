---
loyiha: Aidevix mobil ilova
sana: 2026-06-21
funksiya: Push eslatmalar — aqlli streak + kunlik challenge (lokal)
status: dizayn tasdiqlangan / qilindi
---

# Push eslatmalar (lokal) — Dizayn

## Kontekst
Lokal streak eslatmasi avval (`850caa0`) qo'shilgan edi, lekin "ko'r" repeating
`DAILY` trigger — check-in qilingan bo'lsa ham 20:00 da kelaverardi. Kunlik
challenge eslatmasi umuman ulanmagan edi (`scheduleOneTime` o'lik kod).

## Asosiy g'oya — "rolling window"
`setNotificationHandler` faqat **foreground**da ishlaydi → background'da otilgan
eslatmani "bajarildimi?" deb to'sib bo'lmaydi. Repeating `DAILY`'da bitta kunni
o'tkazib yuborib ham bo'lmaydi. Yechim: keyingi **7 kun** uchun bittadan `DATE`
trigger qo'yamiz; bajarilgan kun o'tkazib yuboriladi. Har ilova ochilganda
qayta hisoblanadi (top-up) — yo'q kunlar ham qamrab olinadi.

## Fayllar
| Fayl | O'zgarish |
|------|-----------|
| `src/services/notifications.ts` | `refreshStreakReminders(checkedInToday)`, `refreshChallengeReminders(allDoneToday)`, `cancelStreakReminders`, `cancelChallengeReminders`; `initNotifications` faqat ruxsat+kanal; ID prefiks `streak-`/`challenge-` + sana (`streak-2026-06-22`); settings flag'ga bo'ysunadi |
| `src/hooks/useReminders.ts` | YANGI — login'da streak refresh + `fetchTodayChallenges`; challenge holatiga qarab refresh; AppState `active` top-up; logout'da cancel |
| `src/hooks/useDailyCheckIn.ts` | check-in muvaffaqiyatли → `refreshStreakReminders(true)` (bugungi bekor) |
| `src/navigation/RootNavigator.tsx` | `useReminders()` mount |
| `src/screens/profile/SettingsScreen.tsx` | streak toggle yangi fn'ga; **challenge toggle** qo'shildi (`settings:challengeReminder`) |

## Parametrlar
- Streak: 20:00 • Challenge: 18:00 • Window: 7 kun • Ikkalasi default ON
- Flag kalitlari: `settings:streakReminder`, `settings:challengeReminder`
- allDone (challenge): `challenges.length>0 && every(status==='done')`

## Doiradan tashqari (keyin / ustoz)
- Server push (yangi kurs/dars) — Expo token → backend → yuborish (backend ustozdan).
- `utils/notifications.ts` o'lik kod tozalash (alohida ish).
- Eslatma vaqtini foydalanuvchi tanlashi (custom time).

## Tekshiruv
- `tsc` 0 xato, o'zgargan fayllar lint 0 xato.
- Qo'lda: toggle ON/OFF, check-in'dan keyin bugungi streak eslatmasi yo'qolishi,
  challenge bajarilгач bugungi challenge eslatmasi yo'qolishi.

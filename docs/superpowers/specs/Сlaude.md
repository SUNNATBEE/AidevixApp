
# Aidevix — Yangi funksiyalar g'oyalari

> Maqsad: mavjud ilova ustiga qo'shsa bo'ladigan yangi funksiyalar ro'yxati.
> Token tejash uchun shu yerga to'liq yozildi — keyin bittadan tanlab dizayn qilamiz.

## Ilovada HOZIR bor narsalar
- Auth: login, register, parol tiklash, email tasdiqlash
- Home, Kurslar (ro'yxat / detal / video player)
- Mening kurslarim, Sertifikatlar
- Profil, profil tahrirlash, sozlamalar, follow, referral
- Leaderboard (reyting)
- Kunlik challenge (DailyChallenge)
- AI Chat
- Shorts (qisqa videolar)
- Code Playground + AI Helper Modal
- Founders (asoschilar)
- Obuna (subscription)
- Gamifikatsiya: streak, XP, kunlik check-in

## Saytda bor, ILOVADA hali YO'Q
- **Roadmaplar** (o'quv yo'llari)
- **Analitika dashboard** (haftalik progress, vaqt, statistika)
- **Mentor aloqasi** (Pro foydalanuvchi ↔ mentor)
- **Community / Q&A** (hamjamiyat)

---

## Top g'oyalar (ta'sir bo'yicha tartiblangan)

### 1. Dars testlari / Quiz ⭐ ✅ MOBIL QILINDI (2026-06-21)
- Har dars oxirida bilim tekshiruvi (savol-javob)
- To'g'ri javob → XP beriladi (+10/savol, o'tsa +100 bonus)
- Sertifikat olish SHARTI sifatida ishlatish (testdan o'tmasa sertifikat yo'q) — *backend logikasi, ustozdan*
- Mavjud kurs + XP + sertifikat tizimiga ulanadi
- **Nega muhim:** o'rganishni mustahkamlaydi, "ko'rib qo'ydim" emas "o'rgandim"
- **HOLAT:** Backend endpointlari ALLAQACHON tayyor (`GET /xp/quiz/video/:videoId`, `POST /xp/quiz/:quizId`). Mobil UI yozildi: Home quick-actions qatorida "Testlar" ikonkasi (Editor/Shorts/Asoschilar yonida) → pageSheet QuizModal. tsc 0 xato.
- **QOLDI (ustoz/backend):** quiz seeder yo'q → test yaratilмаguncha "test yo'q" ko'rinadi; "testlar ro'yxati" endpoint; sertifikat-gate; random savol + qayta yechish.
- Spec: `docs/superpowers/specs/2026-06-21-dars-quiz-design.md`

### 2. Push eslatmalar ⭐ ✅ LOKAL QISMI QILINDI (2026-06-21)
- `expo-notifications` ALLAQACHON o'rnatilgan — faqat ishlatish kerak
- ✅ Aqlli streak eslatmasi (20:00, check-in qilsang o'sha kuni KELMAYDI)
- ✅ Kunlik challenge eslatmasi (18:00, sinov bajarilmasa) + Settings toggle
- ❌ Yangi dars / yangi kurs chiqqanda xabar — **server push, backend ustozdan** (Expo token → backend → yuborish)
- **Nega muhim:** retention (qaytib kelish) ni keskin oshiradi, kam mehnat
- **Texnika:** "rolling window" — repeating DAILY o'rniga keyingi 7 kun uchun DATE eslatma; bajarilgan kun o'tkazib yuboriladi; har ochilganda top-up. (handler faqat foreground'da ishlagani uchun)
- Spec: `docs/superpowers/specs/2026-06-21-push-eslatmalar-design.md`

### 3. Roadmaplar ✅ QILINDI (2026-06-21)
- Frontend / Backend / AI / Web3&No-Code bo'yicha bosqichma-bosqich yo'l (Python katalogда yo'q → moslandi)
- Har bosqich → tegishli kategoriya kurslariga bog'lanadi
- Progress ko'rsatkichi (necha % tugadi) — enrollment + kategoriyadagi kurslardan hisoblanadi
- **Nega muhim:** yangi boshlovchi "nimadan boshlashni" biladi; saytda bor
- **HOLAT:** Client'da statik (backendда yo'q). Home'da "O'quv yo'llari" card'lari → RoadmapDetail (stepper + progress) → bosqich bosilsa kategoriya kurslari. tsc 0 xato.
- **QOLDI:** backend roadmap modeli (admin tahrirlаydigan); bosqich = aniq kurslar ketma-ketligi (hozir kategoriya darajasida).
- Spec: `docs/superpowers/specs/2026-06-21-roadmaplar-design.md`

### 4. AI kod tekshiruvi (AI Code Review)
- Playground'dagi kodni AI baholaydi va tuzatadi
- Xatolarni tushuntiradi, yaxshilash taklif qiladi
- Gemini-2.5-flash ishlatish (eslatma: 2.0-flash kvotasi 0)
- **Nega muhim:** "Aidevix" + AI yo'nalishini kuchaytiradi, playground'ga ulanadi

### 5. Offline yuklab olish
- Videolarni internetsiz ko'rish uchun yuklab olish
- `expo-file-system` bor — ishlatsa bo'ladi
- **Nega muhim:** internet kuchsiz joyda o'rganish imkoni

### 6. Video eslatma / bookmark
- Video ichida timestamp bilan shaxsiy izoh qoldirish
- Keyin "izohlarim" bo'limidan tez topish
- **Nega muhim:** takrorlash va konspekt uchun

### 7. Mentor chat / Q&A
- Pro foydalanuvchi ↔ mentor to'g'ridan-to'g'ri yozishma
- Yoki kurs ostida savol-javob (boshqalar ham ko'radi)
- **Nega muhim:** saytda va'da qilingan Pro imkoniyat

### 8. Analitika dashboard
- Haftalik o'rganilgan vaqt grafigi
- Streak tarixi, XP o'sishi, tugatilgan darslar
- **Nega muhim:** motivatsiya + saytda bor

---

## Qo'shimcha g'oyalar (kelajak uchun)
- Achievement/badge tizimi (streak'dan tashqari belgilar)
- Sertifikatni LinkedIn'ga ulashish
- Global qidiruv (kurs/dars bo'yicha)
- Live event / vebinar
- AI shaxsiy tavsiyalar ("senga mos keyingi kurs")
- AI generatsiya qilgan amaliy masalalar

---

## Keyingi qadam
1. Yuqoridagidan BITTA funksiya tanlash
2. Uni to'liq dizayn qilish (brainstorming → spec)
3. Implementatsiya rejasi tuzish
4. Kodlash

**Tavsiya tartibi:** Push eslatmalar (eng tez) → Quiz → Roadmap → AI kod tekshiruvi

#aidevix #mobil #funksiya #reja

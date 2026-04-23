# Aidevix Mobile Integration Guide (2026-04-23)

Bu hujjat React Native mobil jamoa uchun tayyorlandi. Maqsad:
- bugun kiritilgan backend/frontend o'zgarishlarni bitta joyda berish,
- mobil app uchun API va auth/subscription/video oqimini aniq tushuntirish,
- `.env` sozlamalarini frontend/backend/mobile bo'yicha standartlashtirish,
- Swagger orqali ishlash tartibini professional ko'rsatish.

---

## 1) Stack va Arxitektura (Qisqa)

- **Backend:** Express 5, MongoDB/Mongoose, cookie-based JWT, Swagger
- **Frontend (web):** Next.js 14 App Router, Redux Toolkit, Tailwind
- **Video:** Bunny.net Stream (signed embed URL)
- **Subscription Gate:** Telegram + Instagram (Telegram real-time check)
- **Bot:** Telegram Long Polling

Asosiy biznes oqimi:
1. User login qiladi (cookie sessiya).
2. User Telegram kanalga obuna bo'ladi va bot orqali account bog'laydi.
3. `GET /api/videos/:id` chaqiriladi.
4. Backend `subscriptionCheck` middleware orqali tekshiradi.
5. O'tsa, `player.embedUrl` (Bunny signed URL) qaytadi.

---

## 2) Bugungi O'zgarishlar (High-level Changelog)

Bugun quyidagi katta bloklar bajarildi:

### A) Video + Playground integratsiya (professional merge)
- `frontend/src/app/videos/[id]/page.tsx` yangilandi.
- `frontend/src/app/videos/[id]/playground/page.tsx` kengaytirildi.
- `frontend/src/components/videos/IntegratedPlayground.tsx` qo'shildi.
- `frontend/src/components/layout/ClientLayoutWrapper.tsx` playground route uchun moslandi.
- `frontend/src/types/video.ts` kengaydi (`course.category` qo'shildi).

### B) Build-stability fixlar
- Legacy `react-router-dom`ga bog'liq sahifalar chiqarib tashlandi.
- `VideoLinkModal`da thunk/hook lint xatosi tuzatildi.
- `AdminRoute`/`ProtectedRoute` redirectlar SSR-safe holatga keltirildi.
- `location is not defined` build log ogohlantirishlari tozalandi.

### C) Telegram verification muammosi fix
- `backend/utils/telegramBot.js`: `/start <token>` uchun `_handleVerifyToken` method qo'shildi.
- `backend/controllers/subscriptionController.js`: Telegram status o'zgargan joylarda `subscriptionCache.invalidate(...)` qo'shildi.
- Natija: foydalanuvchi obuna bo'lgach sayt stale holatda qolib ketishi kamaytirildi.

### D) Team sahifa va UI polish
- `/team` sahifasi premium card dizayn bilan yaratildi.
- Navbar responsiv siqilish muammolari tuzatildi.
- Sardor portfolio CTA (`https://sardoruz.vercel.app`) animatsiyali button bilan qo'shildi.

---

## 3) Muhim Backend Endpointlar (Mobile uchun)

## Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Subscription
- `GET /api/subscriptions/status`
- `GET /api/subscriptions/realtime-status`
- `GET /api/subscriptions/generate-token`
- `GET /api/subscriptions/check-token`
- `POST /api/subscriptions/verify-instagram`
- `POST /api/subscriptions/verify-telegram`
- `POST /api/subscriptions/set-telegram-id`

## Video
- `GET /api/videos/course/:courseId`
- `GET /api/videos/:id`  (auth + subscription required)
- `GET /api/videos/top`
- `POST /api/videos/:id/questions`
- `GET /api/videos/:id/questions`
- `POST /api/videos/link/:linkId/use`
- `POST /api/videos/:id/rate`
- `GET /api/videos/:id/rating`

## Enrollment / Progress
- `POST /api/enrollments/:courseId`
- `GET /api/enrollments/my`
- `GET /api/enrollments/:courseId/progress`
- `POST /api/enrollments/:courseId/watch/:videoId`  (watch progress save)

## XP / User
- `POST /api/xp/watch-video`
- `POST /api/xp/quiz/:quizId`
- `PUT /api/xp/profile`

> Eslatma: Web frontend progress uchun endi `enrollments/:courseId/watch/:videoId` endpointga moslangan.

---

## 4) Swagger bilan ishlash

- **Public Swagger:** `/api-docs`
- **Admin Swagger:** `/api-docs/admin`

Ish jarayoni:
1. Swaggerdan endpoint contractni tekshiring (request/response shape).
2. Mobile DTO/Type larni Swagger responsega 1:1 mos qiling.
3. Error body (`success`, `message`, `isSubscriptionError`, `missingSubscriptions`)ni ham parse qiling.

Mobile uchun tavsiya:
- Har endpoint uchun typed client yozing (`zod`/TS interface).
- 401/403/503 holatlarini global interceptor orqali handle qiling.

---

## 5) `.env` Sozlamalar

## Backend `.env` (majburiy)
```env
NODE_ENV=production
PORT=5000

MONGODB_URI=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...

FRONTEND_URL=https://aidevix.uz,http://localhost:3000
BACKEND_URL=https://aidevix-backend-production.up.railway.app

TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHANNEL_USERNAME=aidevix
TELEGRAM_ADMIN_CHAT_ID=697727022
TELEGRAM_BOT_USERNAME=aidevix_bot

BUNNY_STREAM_API_KEY=...
BUNNY_LIBRARY_ID=...
BUNNY_TOKEN_KEY=...

GROQ_API_KEY=...
NEWS_ENABLED=true
CHALLENGE_SCHEDULER_ENABLED=true
```

## Frontend `.env.local`
```env
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:5000
# prod:
# NEXT_PUBLIC_BACKEND_URL=https://aidevix-backend-production.up.railway.app
```

## Mobile (React Native) `.env` tavsiya
```env
API_BASE_URL=https://aidevix-backend-production.up.railway.app/api
APP_SCHEME=aidevix
TELEGRAM_BOT_USERNAME=aidevix_bot
TELEGRAM_CHANNEL_URL=https://t.me/aidevix
INSTAGRAM_URL=https://instagram.com/aidevix.uz
```

> Mobile JWT strategiyasi webdan farq qilishi mumkin (cookie o'rniga bearer). Agar bearer ishlatilsa backend auth flowni mobile uchun alohida moslashtirish kerak.

---

## 6) Telegram Verification: To'g'ri End-to-End Oqim

1. User kanalga obuna bo'ladi (`@aidevix`).
2. Mobile/Web `GET /api/subscriptions/generate-token` chaqiradi.
3. Bot URL ochiladi: `https://t.me/<botUsername>?start=<token>`.
4. Bot `/start <token>` ni qabul qilib userni bog'laydi (`linkTelegramByToken`).
5. Client `GET /api/subscriptions/check-token` ni polling qiladi.
6. `linked=true` va `subscribed=true` bo'lsa gate ochiladi.
7. Video endpoint qayta chaqiriladi.

Fixdan keyingi kritik nuqta:
- token handler real ishlaydi,
- cache invalidate sabab status yangilanishi tezlashdi.

---

## 7) Mobile uchun API Error Handling Standarti

Quyidagi statuslar bo'yicha UI state tavsiya:

- `401` -> login screenga yo'naltirish.
- `403` + `isSubscriptionError=true` -> Subscription flow modal/screen.
- `404` -> "content not found".
- `503` (video processing) -> retry UI + "video tayyorlanmoqda".
- `500` -> generic fallback + retry.

Minimal pseudo-flow:
```ts
if (status === 403 && data?.isSubscriptionError) {
  // Telegram/Instagram gate screen
}
```

---

## 8) Video Playback Integratsiya Qoidalari (Mobile)

- Web `iframe` ishlatadi; mobile'da native player (`react-native-video` / HLS compatible) ishlatiladi.
- Backenddan `player.embedUrl` kelganda:
  - URL expiry vaqtini kuzating (`expiresAt`),
  - expiry bo'lsa endpointni qayta chaqirib yangi URL oling.
- Progress saqlash:
  - har 10-15 soniyada `POST /api/enrollments/:courseId/watch/:videoId`.

---

## 9) Bugungi test natijalari

Bugun bir necha marotaba tekshirildi:
- `frontend npm run lint` -> PASS
- `frontend npm run build` -> PASS
- `node --check backend/index.js` va tegishli backend fayllar -> PASS

Telegram fixdan keyin:
- `/start <token>` yo'li ishlaydigan holatga keltirildi.
- subscription cache invalidation qo'shildi.

---

## 10) React Native jamoa uchun aniq TODO

1. `SubscriptionService` yozish:
   - `generateToken`, `checkToken`, `getStatus`, `getRealtimeStatus`.
2. `TelegramLinkingScreen`:
   - bot deep-link ochish,
   - 3s polling + timeout.
3. `VideoAccessGuard`:
   - 403 subscription errorni ushlash.
4. `VideoPlayerScreen`:
   - `GET /videos/:id` -> `embedUrl`.
5. `ProgressReporter`:
   - periodic `watch/:videoId`.
6. Global API interceptor:
   - 401, 403, 503 unified handling.

---

## 11) Ops va Deploy eslatma

- Backend: `git push origin main` -> Railway deploy.
- Frontend: `cd frontend && npx vercel --prod`.
- Deploydan keyin darhol tekshirish:
  1. Login
  2. Subscription link
  3. Video open
  4. Progress save

---

## 12) Xulosa

Bugungi o'zgarishlar asosiy fokuslari:
- video/playground UX va integratsiya,
- SSR/build stability,
- Telegram verificationdagi production bug fix.

Hozirgi holatda mobile jamoa backend API bilan parallel ishlashi mumkin. Eng muhim qism — subscription + token-linking oqimini to'g'ri implement qilish.


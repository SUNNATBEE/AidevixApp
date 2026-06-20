
# AIDEVIX — Mobil (Native) Ilova Qo'llanmasi

> Bu hujjat **mavjud aidevix.uz veb-saytini** native ilovaga ko'chirish uchun
> to'liq arxitektura ma'lumotnomasi. Backend o'zgartirilmaydi — ilova faqat
> mavjud REST API'ni iste'mol qiladi.

---

## 1. Loyiha haqida

**Aidevix** — AI-yo'naltirilgan dasturlash ta'lim platformasi (o'zbek tilida):

- Video kurslar (Bunny.net Stream orqali himoyalangan)
- Geymifikatsiya: XP, daraja, streak, badge, leaderboard
- Kunlik challenge'lar va kunlik mukofot
- Prompt kutubxonasi (Claude, Cursor, Copilot promptlari)
- Sertifikatlar, referal dasturi, AI Coach yordamchisi
- Telegram + Instagram obunaga asoslangan kontent gate

---

## 2. Tavsiya etilgan native stack

| Qatlam | Tavsiya | Sabab |
|--------|---------|-------|
| Framework | **React Native + Expo** | Veb React/Redux tajribasini qayta ishlatish |
| State | Redux Toolkit | Veb'dagi slice'lar deyarli o'zgarmasdan ko'chadi |
| Navigatsiya | React Navigation (stack + bottom tabs) | |
| HTTP | Axios | Veb'dagi `axiosInstance` mantiqi qayta ishlatiladi |
| Video | `expo-video` yoki `react-native-video` | Bunny.net HLS (`.m3u8`) qo'llab-quvvatlash |
| Saqlash | `expo-secure-store` | Token'larni xavfsiz saqlash |
| Push | `expo-notifications` | Challenge / news bildirishnomalari |

---

## 3. Backend API — asosiy ma'lumotlar

- **Base URL (production):** `https://aidevix-backend-production.up.railway.app`
- **Barcha endpointlar prefiksi:** `/api`
- **Format:** JSON, REST
- **Til:** kontent o'zbekcha

### 3.1. Autentifikatsiya — MUHIM native farqi

Veb-sayt **httpOnly cookie** auth ishlatadi. Native ilovada cookie ishlamaydi —
shuning uchun **token-based oqim** kerak:

```
POST /api/auth/login        → access + refresh token qaytadi
POST /api/auth/refresh-token → access token yangilash
```

- `accessToken` va `refreshToken` ni `expo-secure-store` da saqlang.
- Har bir so'rovda: `Authorization: Bearer <accessToken>` header qo'ying.
- 401 olganda → `refresh-token` bilan yangilang → so'rovni qayta yuboring.
- Login javobida token'lar body'da kelishini **birinchi navbatda tekshiring**
  (cookie'dan tashqari). Kelmasa — backend jamoasidan native uchun token
  javobini so'rang.

> Backendda `STORAGE_KEYS` (`aidevix_access_token`, `aidevix_refresh_token`)
> va `/refresh-token` endpoint mavjud — demak token oqimi qo'llab-quvvatlanadi.

---

## 4. To'liq API endpoint xaritasi

### Auth — `/api/auth`
| Method | Path | Tavsif |
|--------|------|--------|
| POST | `/register` | Ro'yxatdan o'tish |
| POST | `/login` | Kirish |
| POST | `/refresh-token` | Token yangilash |
| POST | `/logout` | Chiqish (auth) |
| GET  | `/me` | Joriy foydalanuvchi (auth) |
| POST | `/forgot-password` | Parolni tiklash kodi |
| POST | `/verify-code` | OTP tekshirish |
| POST | `/reset-password` | Yangi parol |
| POST | `/verify-email` | Email tasdiqlash (auth) |
| POST | `/resend-verification` | Tasdiq kodini qayta yuborish (auth) |
| POST | `/daily-reward` | Kunlik mukofot olish (auth) |
| GET  | `/referrals` | Referal statistikasi (auth) |

### Kurslar — `/api/courses`
| Method | Path | Tavsif |
|--------|------|--------|
| GET | `/` | Barcha kurslar (filter, sort, search) |
| GET | `/top` | Top kurslar |
| GET | `/categories` | Kategoriyalar |
| GET | `/autocomplete` | Qidiruv autocomplete |
| GET | `/filter-counts` | Filter bo'yicha sonlar |
| GET | `/:id` | Kurs tafsiloti |
| GET | `/:id/recommended` | Tavsiya etilgan kurslar |
| POST | `/:id/rate` | Kursni baholash (auth) |

### Videolar — `/api/videos`
| Method | Path | Tavsif |
|--------|------|--------|
| GET | `/course/:courseId` | Kurs videolari |
| GET | `/top` | Top videolar |
| GET | `/search` | Video qidirish (auth) |
| GET | `/:id` | Video (auth + **obuna tekshiruvi**) |
| GET | `/:id/questions` | Video savollari |
| POST | `/:id/questions` | Savol berish (auth) |
| POST | `/link/:linkId/use` | Video havola ishlatish (auth) |

### Bo'limlar — `/api/sections`
| GET | `/course/:courseId` | Kurs bo'limlari |

### Obuna gate — `/api/subscriptions`
| Method | Path | Tavsif |
|--------|------|--------|
| GET | `/status` | Obuna holati (auth) |
| GET | `/realtime-status` | Real-time obuna holati (auth) |
| POST | `/verify-telegram` | Telegram tekshirish (auth) |
| POST | `/verify-instagram` | Instagram tekshirish (auth) |
| POST | `/set-telegram-id` | Telegram ID bog'lash (auth) |
| GET | `/generate-token` | Bog'lash tokeni (auth) |
| GET | `/check-token` | Bog'lash holatini polling (auth) |

### XP / Geymifikatsiya — `/api/xp`
| Method | Path | Tavsif |
|--------|------|--------|
| GET | `/stats` | Foydalanuvchi statistikasi |
| GET | `/history` | XP tarixi |
| GET | `/streak-status` | Streak holati |
| POST | `/streak-freeze` | Streak muzlatish |
| POST | `/streak-freeze/add` | Streak freeze qo'shish |
| POST | `/video-watched/:videoId` | Video ko'rilgani uchun XP |
| GET | `/quiz/video/:videoId` | Video quizi |
| POST | `/quiz/:quizId` | Quiz topshirish |
| PUT | `/profile` | Profil yangilash (bio, aiStack) |
| GET | `/weekly-leaderboard` | Haftalik leaderboard |

### Reyting — `/api/ranking`
| GET | `/courses` | Top kurslar |
| GET | `/users` | Top foydalanuvchilar |
| GET | `/users/:userId/position` | Foydalanuvchi o'rni (auth) |
| GET | `/weekly` | Haftalik leaderboard (auth) |
| GET | `/weekly/prizes` | Haftalik sovrinlar |

### Challenge'lar — `/api/challenges`
| GET | `/today` | Bugungi challenge (auth) |
| POST | `/progress` | Challenge progress yangilash (auth) |

### Promptlar — `/api/prompts`
| GET | `/` | Promptlar ro'yxati |
| GET | `/featured` | Tanlangan promptlar |
| GET | `/:id` | Bitta prompt |
| POST | `/` | Prompt yaratish (auth, +30 XP) |
| POST | `/:id/like` | Like (auth) |
| DELETE | `/:id` | O'chirish (egasi/admin) |

### Ro'yxatga olish — `/api/enrollments`
| GET | `/continue` | Davom ettirish (auth) |
| GET | `/my` | Mening kurslarim (auth) |
| POST | `/:courseId` | Kursga yozilish (auth) |
| GET | `/:courseId/progress` | Kurs progressi (auth) |
| POST | `/:courseId/watch/:videoId` | Video ko'rilgani belgilash (auth) |

### Sertifikatlar — `/api/certificates`
| GET | `/my` | Mening sertifikatlarim (auth) |
| GET | `/verify/:code` | Sertifikat tekshirish (ochiq) |
| GET | `/:code/download` | Yuklab olish (auth) |

### Loyihalar — `/api/projects`
| GET | `/course/:courseId` | Kurs loyihalari |
| GET | `/:id` | Loyiha |
| POST | `/:id/complete` | Loyihani yakunlash (auth, +200 XP) |

### Wishlist — `/api/wishlist`
| GET | `/` | Wishlist (auth) |
| POST | `/:courseId` | Qo'shish (auth) |
| DELETE | `/:courseId` | O'chirish (auth) |

### Follow — `/api/follow`
| POST | `/:userId` | Follow (auth) |
| DELETE | `/:userId` | Unfollow (auth) |
| GET | `/:userId/stats` | Follow statistikasi |
| GET | `/my/followers` | Followerlar (auth) |
| GET | `/my/following` | Following (auth) |

### To'lovlar — `/api/payments`
| POST | `/initiate` | To'lov boshlash (auth) |
| GET | `/my` | Mening to'lovlarim (auth) |
| GET | `/:id/status` | To'lov holati (auth) |
| POST | `/payme`, `/click/*` | Provayder callback'lari (server-to-server) |

### Foydalanuvchilar — `/api/users`
| GET | `/:username/public` | Ommaviy profil |

### Yuklash — `/api/upload`
| POST | `/avatar` | Avatar yuklash (auth, multipart) |

> **Admin endpointlari** (`/api/admin/*`) native ilovaga kiritilmaydi —
> admin panel veb'da qoladi.

---

## 5. Asosiy ma'lumot modellari (muhim maydonlar)

**User** — `name`, `email`, `avatar`, `role`, `aiStack[]`, `socialSubscriptions`,
`gamification` (xp, level, streak, badges), `referral`, `emailVerified`

**Course** — `title`, `description`, `thumbnail`, `category`, `level`, `price`,
`rating`, `views`, `videoCount`

**Video** — `title`, `courseId`, `sectionId`, `bunnyVideoId`, `duration`,
`order`, `isFree`

**Prompt** — `title`, `content`, `category`, `tool`, `likes`, `views`, `author`

**DailyChallenge** — `type` (watch_video/complete_quiz/streak/share_prompt),
`xpReward`, `target`

**Enrollment / Certificate / Payment / Quiz** — CLAUDE.md ga qarang

---

## 6. Native ilova ekranlari (funksional joylar)

### Tab navigatsiyasi (bottom tabs)
1. **Bosh sahifa** — tavsiya kurslar, davom ettirish, kunlik challenge
2. **Kurslar** — katalog: kategoriya/filter/sort/qidiruv
3. **Promptlar** — Prompt kutubxonasi
4. **Leaderboard** — XP reyting + haftalik
5. **Profil** — XP, daraja, streak, AI Stack, sertifikatlar

### Stack ekranlar
| Ekran | API | Eslatma |
|-------|-----|---------|
| Login / Register | `/auth/login`, `/register` | Token saqlash |
| Parolni tiklash | `/forgot-password` → `/verify-code` → `/reset-password` | 3 bosqich |
| Kurs tafsiloti | `/courses/:id`, `/sections/course/:id`, `/videos/course/:id` | |
| Video pleer | `/videos/:id` | **Obuna gate** + Bunny HLS |
| Quiz | `/xp/quiz/video/:videoId`, `/xp/quiz/:quizId` | Video oxirida |
| Challenge'lar | `/challenges/today`, `/challenges/progress` | |
| Sertifikatlar | `/certificates/my` | |
| Referal | `/auth/referrals` | |
| Ommaviy profil | `/users/:username/public`, `/follow/*` | |
| Obuna gate | `/subscriptions/*` | Quyida 7-bo'limga qarang |
| To'lov | `/payments/initiate` → WebView (Payme/Click) → `/payments/:id/status` | |
| AI Coach | Veb `/api/coach` proxy ishlatadi | Native uchun alohida endpoint kerak — backenddan so'rang |

---

## 7. Obuna gate oqimi (biznes-kritik)

Video ko'rishdan oldin foydalanuvchi @aidevix Telegram kanaliga obuna bo'lishi shart:

```
1. /videos/:id → 403 (obuna yo'q bo'lsa)
2. Obuna ekrani ko'rsatiladi:
   a) Foydalanuvchi @aidevix kanaliga obuna bo'ladi (deep link: tg://)
   b) "Bot orqali bog'lash" → GET /subscriptions/generate-token
   c) Telegram bot ochiladi (https://t.me/aidevix_bot?start=<token>)
   d) Ilova GET /subscriptions/check-token ni har 3 soniyada polling qiladi
   e) linked + subscribed bo'lganda → video ochiladi
3. Instagram — soft-check (username kiritilsa true)
```

Native'da Telegram'ga `tg://resolve?domain=aidevix` deep link, qaytishda
ilovaga `AppState` (foreground) bilan polling'ni qayta ishga tushiring.

---

## 8. Video playback (Bunny.net)

- Backend `/videos/:id` javobida **token bilan imzolangan** Bunny URL qaytaradi.
- URL vaqtinchalik — har safar yangidan oling, kesh qilmang.
- HLS format (`.m3u8`) — `expo-video` yoki `react-native-video` qo'llab-quvvatlaydi.
- Video ko'rilgach: `POST /enrollments/:courseId/watch/:videoId` va
  `POST /xp/video-watched/:videoId` (+50 XP) chaqiriladi.

---

## 9. Geymifikatsiya (XP)

| Harakat | XP |
|---------|-----|
| Video ko'rish | +50 |
| Quiz to'g'ri javob | +10 / savol |
| Quiz o'tish bonusi | +100 |
| Kunlik challenge | +80–250 |
| Prompt yaratish | +30 |
| Loyiha yakunlash | +200 |

Daraja: `AMATEUR → CANDIDATE → JUNIOR → MIDDLE → SENIOR → MASTER → LEGEND`

Streak: kunlik faollik; `streak-freeze` bilan saqlanadi.

---

## 10. Native'ga xos hisobga olinadigan jihatlar

| Mavzu | Yechim |
|-------|--------|
| Cookie auth | `Authorization: Bearer` + secure-store token oqimiga o'tish |
| To'lov (Payme/Click) | `WebView` ichida ochish, `/payments/:id/status` polling |
| AI Coach | Veb Next.js `/api/coach` proxy'siga bog'liq — native endpoint so'rash |
| Telegram bog'lash | Deep link + foreground polling |
| Push bildirishnoma | `expo-notifications` — challenge/news uchun |
| Offline | Kurs ro'yxati/profilni kesh, video offline emas |
| Rasm yuklash | `/upload/avatar` multipart — `expo-image-picker` |
| Rate limiting | Backendda `apiLimiter` bor — polling'ni 3s dan tez qilmang |

---

## 11. Backend jamoasidan aniqlashtirish kerak

1. `/auth/login` native uchun token'larni **JSON body**'da qaytaradimi?
2. AI Coach uchun to'g'ridan-to'g'ri backend endpoint bormi?
3. CORS / mobile App so'rovlari uchun cheklov yo'qmi?
4. Push bildirishnoma uchun device token endpoint kerak bo'ladimi?

---

> Manba: `backend/routes/*`, `backend/index.js`, `frontend/CLAUDE.md`.
> Backend o'zgartirilmagan — bu hujjat faqat mavjud API'ni hujjatlashtiradi.

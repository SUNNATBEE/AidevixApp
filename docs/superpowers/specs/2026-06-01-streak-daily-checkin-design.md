# Kunlik Streak (Olov) — Dizayn Hujjati

**Sana:** 2026-06-01
**Holat:** Tasdiqlangan dizayn (implementatsiya kutilmoqda)

## 1. Maqsad

Foydalanuvchi **har kuni ilovaga kirsa** (kuniga bir marta), streak hisoblagichi (🔥 "olov") **+1** oshsin. Hozir streak faqat XP ishlab topilganda (video ko'rish, quiz) oshadi — sof "ilovaga kirish" uchun mexanizm yo'q.

## 2. Talablar (brainstorm natijasi)

| Savol | Qaror |
|-------|-------|
| Trigger | **Faqat ilovaga kirish** — kuniga 1 marta ochsa +1 (XP shart emas) |
| Qachon tekshiriladi | **Ilova old planga chiqqanda** (`AppState` → `active`), JWT bilan eslab qolingan userlar uchun ham |
| Foydalanuvchi bildirishi | **To'liq modal** (Lottie olov animatsiyasi + tabrik) + `triggerHaptic('success')` |
| Server matni (kurs/AI) | Bu vazifa doirasiga kirmaydi |

## 3. Arxitektura

Ikki qism: **(A) Backend** (ustoz Railway'ga deploy qiladi) va **(B) Mobil** (shu repo).

### A. Backend — yangi endpoint

**`POST /api/xp/check-in`** (authenticate bilan, `aiController` emas — `xpController.js`)

Mantiq `xpController.js:109-135` dagi mavjud streak hisoblashning **aynan nusxasi** (mavjud ishlayotgan funksiyalarga tegmaymiz → kam xavf):

```
today = bugun (00:00 ga normallashtirilgan)
agar lastActivityDate mavjud bo'lsa:
    diffDays = today - lastActivityDate (kunlarda)
    diffDays === 0  → o'zgarmaydi (bugun allaqachon hisoblangan)
    diffDays === 1  → streak += 1
    diffDays  >  1  → freeze bor & diffDays===2 bo'lsa freeze sarflanadi (streak saqlanadi),
                      aks holda streak = 1
aks holda (birinchi marta) → streak = 1
lastActivityDate = hozir
User modelini sinxronlash (xp/streak) — mavjud pattern
```

**Javob shakli:**
```json
{ "success": true, "data": {
    "streak": 5,
    "increased": true,           // bugun yangidan oshdimi
    "freezeUsed": false,         // streak freeze sarflandimi
    "alreadyCheckedToday": false // diffDays === 0 edi
}}
```

**Anti-cheat:** server vaqti ishlatiladi (telefon soatini surish ta'sir qilmaydi). `diffDays === 0` qoidasi tufayli video ko'rish bilan check-in **ikki marta hisoblanmaydi** — qaysi biri avval bo'lsa, ikkinchisi oshirmaydi.

### B. Mobil

1. **`src/api/xpApi.ts`** — yangi metod:
   ```ts
   checkIn: () => axiosInstance.post('/xp/check-in'),
   ```

2. **Kunlik trigger** (`App.tsx` yoki yangi `useDailyCheckIn` hook):
   - `AppState` listener — `active` bo'lganda ishga tushadi.
   - AsyncStorage'da oxirgi check-in sanasi saqlanadi (`aidevix_last_checkin`). Bugun allaqachon urinilgan bo'lsa — so'rov yuborilmaydi (ortiqcha trafik va backend `apiLimiter` himoyasi).
   - Faqat `isLoggedIn === true` bo'lganda chaqiriladi.
   - Offline/xato bo'lsa — jim o'tadi, sana saqlanmaydi (keyingi ochilishda qayta urinadi).

3. **Streak sonini yangilash:** javobdagi `streak` `authSlice`/stats holatiga yoziladi → Home va Profil avtomatik yangi sonni ko'rsatadi.

4. **Modal** (`increased === true` yoki `freezeUsed === true` bo'lsa):
   - Yangi komponent `src/components/gamification/StreakCelebrationModal.tsx`.
   - Lottie olov animatsiyasi, katta streak soni, tabrik matni (o'zbekcha), "Davom etish" tugmasi.
   - `freezeUsed` bo'lsa boshqa matn: "Streak freeze ishlatildi, olovingiz saqlandi 🧊".
   - `useTheme()` ranglari, `triggerHaptic('success')`.

## 4. Birliklar (units) va mas'uliyat

| Birlik | Vazifa | Bog'liqlik |
|--------|--------|-----------|
| `POST /xp/check-in` (backend) | Streakni server vaqti bo'yicha hisoblash | UserStats, User modellari |
| `xpApi.checkIn()` | Endpoint wrapper | axiosInstance |
| `useDailyCheckIn` hook | AppState + AsyncStorage guard, kuniga 1 marta chaqirish | xpApi, authSlice |
| `StreakCelebrationModal` | Tabrik UI | useTheme, lottie |

## 5. Edge-case'lar

- **Bir kunda ko'p ochish:** AsyncStorage guard (mobil) + `diffDays === 0` (backend) — ikki qatlamli himoya.
- **Streak uzilgan (kun o'tkazib yuborilgan):** backend `streak = 1` qaytaradi va `increased: true` bo'ladi. Modal **ko'rsatiladi**, lekin matn farqli: "Yangi streak boshlandi 🔥 — bugundan davom eting!" (uzilganini do'stona eslatadi, lekin foydalanuvchini qaytib kelgani uchun rag'batlantiradi).
- **Offline:** so'rov muvaffaqiyatsiz → sana saqlanmaydi → keyin qayta urinadi.
- **Soat mintaqasi:** backend server vaqtidan foydalanadi (Railway UTC). O'zbek foydalanuvchilari uchun "kun" UTC bo'yicha aylanadi — kelajakda UTC+5 ga sozlash mumkin (hozircha YAGNI).

## 6. Test rejasi

- Backend (ustoz tomonida): birinchi check-in → streak=1; ertasi kun → 2; kun o'tkazib → 1 (yoki freeze); o'sha kun ikkinchi marta → o'zgarmaydi.
- Mobil: AsyncStorage guard bir kunda bitta so'rov yuborishini tekshirish; `increased` bo'yicha modal chiqishini tekshirish.

## 7. Bog'liqlik / xavf

- **Backend endpoint ustoz tomonidan Railway'ga deploy qilinishi shart** — usiz mobil qism 404 oladi. Mobil kod tayyor bo'lsa ham, to'liq sinov backend chiqqach mumkin.
- `lottie-react-native` allaqachon stack'da bor (CLAUDE.md) — yangi paket kerak emas.

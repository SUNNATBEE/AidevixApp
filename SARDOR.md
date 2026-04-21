# Salom Sardor! 👋

Aidevix loyihasiga xush kelibsan. Bu loyiha O'zbekistondagi dasturlash ta'limini AI (Sun'iy Intellekt) yordamida yangi bosqichga olib chiqish uchun yaratilmoqda. Quyida loyiha bilan tanishish va uni ishga tushirish bo'yicha to'liq ko'rsatmalarni tayyorladim.

---

## 🚀 Loyiha Haqida

**Aidevix** — o'quvchilarga dasturlashni o'zbek tilida, AI-ustoz (AICoach) yordamida o'rgatadigan mobil ilova.
- **Asosiy maqsad**: O'quvchi videodars ko'rayotganda tushunmagan joyini darhol AI dan so'rashi, kod yozib ko'rishi va doimiy o'sishda bo'lishi.

---

## 🛠️ Ishga tushirish (Run project)

1. **Repozitoriyani yuklab olgach (Clone):**
   ```bash
   npm install
   ```

2. **Login (EAS uchun):**
   *(Agar o'zingizda test qilmoqchi bo'lsangiz)*
   ```bash
   npx expo login
   ```

3. **Ishga tushirish:**
   ```bash
   npx expo start --offline
   ```
   *(Eslatma: `--offline` flagi login so'ramasdan darhol Metro Bundlerni ochadi. Ilova esa internetingiz bo'lsa serverga bog'lanib ishlayveradi).*

---

## 🔑 Environment Variables (.env)

Loyihaning ildiz (root) papkasida `.env` faylini yarating va quyidagi ma'lumotlarni qo'shing:

```env
# Backend API (Server orqali ma'lumot olish uchun)
EXPO_PUBLIC_API_URL=https://aidevix-backend-production.up.railway.app/api

# Ijtimoiy tarmoqlar
EXPO_PUBLIC_TELEGRAM_CHANNEL=https://t.me/aidevix
EXPO_PUBLIC_TELEGRAM_BOT=https://t.me/aidevix_bot
EXPO_PUBLIC_INSTAGRAM_URL=https://instagram.com/aidevix

# Expo Project ID (EAS Build uchun kerak)
EXPO_PUBLIC_PROJECT_ID=f000-0000-0000-0000
```

---

## 📂 Fayl Strukturasi (File Structure)

Loyiha professional **Modular Architecture** asosida qurilgan:

```bash
src/
├── api/             # Backend bilan bog'lanish (Axios)
├── components/      # UI qismlari (Buttonlar, Inputlar, Cardlar)
│   ├── common/      # Hamma joyda ishlatiladigan umumiy komponentlar
│   └── home/        # Faqat Home sahifasiga tegishli qismlar
├── navigation/      # Sahifalar orasidagi o'tishlar (React Navigation)
│   ├── MainTabs.tsx # Pastki menyu (Tabs)
│   └── HomeStack.tsx# Asosiy sahifa ichidagi ichki sahifalar
├── screens/         # Ilovaning asosiy sahifalari
├── store/           # Redux Toolkit (State Management)
│   └── slices/      # Alohida funksiyalar (Auth, Chat, Courses)
├── theme/           # Loyiha ranglari, spacing va shriftlari
└── utils/           # Yordamchi funksiyalar (Storage, Haptics, Notifications)
```

---

## 💎 Professional Maslahatlar

1. **Theme System**: Hech qachon ranglarni qo'lda (`#ffffff`) yozma. Har doim `useTheme()` hookidan foydalanib ranglarni ol:
   ```tsx
   const { colors } = useTheme();
   // <View style={{ backgroundColor: colors.background }} />
   ```
2. **Haptic Feedback**: Foydalanuvchi tugmani bosganda unga taktil sezgi berish uchun `triggerHaptic('light')` dan foydalanishni unutma.
3. **Commit**: Kodni Git'ga yuklashdan oldin xatoliklarni tekshirib, chiroyli izoh bilan commit qil.

Senga omad, Sardor! Birgalikda Aidevixni eng yaxshi ta'lim platformasiga aylantiramiz. 💪⚡

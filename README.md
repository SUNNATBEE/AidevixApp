# Aidevix Mobile App 🚀

**Aidevix** — O'zbek tilidagi AI va dasturlashni o'rgatuvchi eng zamonaviy o'quv platformasi. Ushbu mobil ilova o'quvchilarga istalgan joyda, hatto internetsiz ham bilim olish imkonini beradi.

---

## ✨ Asosiy Imkoniyatlar

### 📚 O'quv Tizimi
- **Professional Kurslar**: Video darsliklar, kod namunalari va testlar.
- **Offline Mode**: Videolarni yuklab olish va metro yoki viloyatlarda internetsiz ko'rish.
- **Video Bookmarks**: Video ichida kerakli joylarni belgilab ketish va qaydlar yozish.

### 🤖 AI Imkoniyatlari
- **AICoach (Chat)**: Kod tushuntirish, xatolarni topish (Debug) va savollarga real-vaqtda javob olish.
- **AI Roadmap**: Sizning darajangizga moslangan individual o'quv rejasi.

### 🎮 Gamifikatsiya
- **Streak Tizimi**: Har kungi faollik uchun olovli streaklar va Lottie animatsiyalar.
- **Reyting (Leaderboard)**: Top o'quvchilar orasida o'z o'rningizni ko'ring.
- **XP va Badges**: O'quv jarayonidagi yutuqlaringiz uchun mukofotlar.

### 🛠️ Dasturchi Instrumentlari
- **Code Playground**: Ilovaning o'zida HTML/CSS/JS kod yozish va natijani ko'rish.
- **Focus Mode**: Pomodoro taymeri orqali chalg'imasdan o'qish.

---

## 🛠 Texnologiyalar

- **Framework**: [React Native (Expo SDK 52+)](https://expo.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **State Persistence**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Navigation**: [React Navigation v7](https://reactnavigation.org/)
- **Styling**: Vanilla StyleSheet (Custom Theme System)
- **Networking**: Axios with Interceptors (JWT Bearer Auth)
- **Animations**: [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native)
- **Multimedia**: [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)
- **Forms**: React Hook Form

---

## 📂 Loyiha Strukturasi

```bash
src/
├── api/             # API interfeyslari va Axios konfiguratsiyasi
├── assets/          # Animatsiyalar, rasmlar va fontlar
├── components/      # Reusable UI komponentlar (Button, Input, Card, etc.)
├── navigation/      # Stack va Tab navigatorlar
├── screens/         # Ilova sahifalari (Home, Course, AI Chat, etc.)
├── store/           # Redux store ve slices (Auth, Course, Chat, Offline)
├── theme/           # Ranglar palitrasi (Dark, Light, AMOLED) va Typography
├── types/           # TypeScript interfeyslari
└── utils/           # Yordamchi funksiyalar (Haptics, Notifications, Storage)
```

---

## 🚀 O'rnatish va Ishga tushirish

1. **Repozitoriyani klon qiling:**
   ```bash
   git clone https://github.com/your-username/AidevixApp.git
   cd AidevixApp
   ```

2. **Kutubxonalarni o'rnating:**
   ```bash
   npm install
   ```

3. **Loyiha sozlamalarini tekshiring:**
   `app.json` faylida o'z loyihangiz ID larini kiriting.

4. **Ishga tushiring:**
   ```bash
   npx expo start
   ```

---

## 💡 Ishlab chiquvchilar uchun eslatmalar

- **Tema tanlash**: Ilova tizim sozlamasiga qarab avtomatik ravishda Dark/Light temaga o'tadi. AMOLED rejimini sozlamalardan yoqish mumkin.
- **Haptic Feedback**: Foydalanuvchi tajribasini oshirish uchun har bir tugma bosilganda yoki yutuq bo'lganda `triggerHaptic` dan foydalaning.
- **Sync Logic**: Foydalanuvchi offlineda kurs ko'rsa, ma'lumotlar `offlineSync` quyrug'iga qo'shiladi va internet ulanganda backendga yuboriladi.

---

## 📑 Roadmap

- [x] MVP (Auth, Courses, XP)
- [x] Push Notifications
- [x] AI Chat Assistant
- [x] Code Playground
- [ ] Mini Games (Code Battle)
- [ ] QR Code Certificate Verification

---

## 🤝 Aloqa

- **Web**: [aidevix.uz](https://aidevix.uz)
- **Telegram**: [@aidevix](https://t.me/aidevix)
- **Instagram**: [@aidevix.uz](https://instagram.com/aidevix.uz)

---
© 2026 Aidevix Team. Barcha huquqlar himoyalangan.

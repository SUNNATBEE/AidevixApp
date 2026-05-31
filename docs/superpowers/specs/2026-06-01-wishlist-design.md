# Wishlist (Sevimli kurslar) — Dizayn

**Sana:** 2026-06-01
**Branch:** abduvoris
**Maqsad:** Foydalanuvchi kurslarni "Sevimlilar" ro'yxatiga qo'shishi, ko'rishi va olib tashlashi. Backend allaqachon tayyor (`/api/wishlist`), faqat mobil tomon yetishmaydi.

---

## 1. Kontekst

Backend endpointlar (tayyor, o'zgartirilmaydi):

| Metod | Yo'l | Vazifa | Auth |
|-------|------|--------|------|
| GET | `/wishlist` | Foydalanuvchi sevimli kurslari | Private |
| POST | `/wishlist/:courseId` | Kurs qo'shish | Private |
| DELETE | `/wishlist/:courseId` | Kursni olib tashlash | Private |

`GET /wishlist` javob shakli:
```json
{ "success": true, "data": { "courses": [ { "courseId": { "_id": "...", "title": "...", "thumbnail": "...", "category": "...", "level": "...", "rating": 0, "price": 0, "isFree": true, "instructor": { "username": "...", "jobTitle": "..." } } } ] } }
```

**Muhim nuans:** `GET /courses` va `GET /courses/:id` javoblarida `isInWishlist` maydoni YO'Q. Shu sababli kurs sevimlida ekanini client tomonda aniqlaymiz — `GET /wishlist` orqali ID'lar to'plamini bir marta olib, state'da saqlaymiz.

UX qarorlari (foydalanuvchi tasdiqladi):
- **Kirish nuqtasi:** Kurslar tab header'ida yurak ikonkasi → WishlistScreen
- **Toggle joyi:** Kurs kartasida (CourseCard) yurak tugmasi

---

## 2. Arxitektura

### 2.1 API qatlami — `src/api/wishlistApi.ts` (yangi)
`axiosInstance` orqali thin wrapper (loyiha konventsiyasi):
```ts
getWishlist()                → axiosInstance.get('/wishlist')
addToWishlist(courseId)      → axiosInstance.post(`/wishlist/${courseId}`)
removeFromWishlist(courseId) → axiosInstance.delete(`/wishlist/${courseId}`)
```

### 2.2 Redux — `src/store/slices/wishlistSlice.ts` (yangi)
State:
```ts
interface WishlistState {
  ids: string[];        // tez tekshirish uchun (heart holati)
  items: Course[];      // WishlistScreen ro'yxati uchun
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}
```

Thunklar:
- `fetchWishlist()` — `GET /wishlist` chaqiradi, javobdan `courses[].courseId`ni ajratib `items` va `ids`ga yozadi. Populate qilinmagan (null) elementlarni filtrlaydi.
- `toggleWishlist({ courseId })` — **optimistik** (`promptSlice` uslubi):
  - `pending`: agar `ids`da bo'lsa olib tashlaydi (+`items`dan), aks holda qo'shadi. Server holatiga qarab POST yoki DELETE chaqiradi.
  - `rejected`: optimistik o'zgarishni qaytaradi, `error` o'rnatadi.
  - `fulfilled`: holatni saqlab qoladi (server muvaffaqiyatli).

`store/index.ts`ga `wishlist: wishlistReducer` qo'shiladi.

`fetchWishlist` Courses tabga kirilganda (CoursesScreen `useEffect`) bir marta chaqiriladi, shunda yuraklar to'g'ri ko'rinadi.

### 2.3 CourseCard — `src/components/course/CourseCard.tsx` (o'zgartiriladi)
- Yangi ixtiyoriy proplar: `isWishlisted?: boolean`, `onToggleWishlist?: (id: string) => void`
- `onToggleWishlist` berilgan bo'lsagina thumbnail ustki o'ng burchagida yurak tugmasi ko'rinadi:
  - `heart` (to'la, `colors.error` rang) yoki `heart-outline` (`#fff`)
  - Yarim shaffof qora doira fon (ikonka thumbnail ustida ko'rinishi uchun)
  - Bosilganda `triggerHaptic('light')` + `onToggleWishlist(course._id)`
  - `TouchableOpacity` karta `onPress`ini ushlamasligi uchun alohida joylashadi (absolute position)
- Komponent dumb qoladi — selector/dispatch CoursesScreen va WishlistScreen tomonda ulanadi.

### 2.4 WishlistScreen — `src/screens/courses/WishlistScreen.tsx` (yangi)
- `useEffect`da `fetchWishlist` (yoki `useFocusEffect` bilan har fokusda yangilash)
- Sarlavha: "Sevimli kurslar", orqaga qaytish tugmasi
- `items`ni 2 ustunli `FlatList` + `CourseCard` (Courses ekrani bilan bir xil grid)
- Har karta `isWishlisted={true}` va `onToggleWishlist` (toggle → kartani ro'yxatdan chiqaradi)
- Pull-to-refresh (`refreshing` state)
- Bo'sh holat: yurak ikonkasi + "Hozircha sevimli kurs yo'q"
- `loading && items.length === 0` → `<Loader fullScreen />`
- Barcha ranglar `useTheme()` orqali

### 2.5 Navigatsiya
- `src/navigation/types.ts`: `CourseStackParamList`ga `Wishlist: undefined`
- `src/navigation/CoursesStack.tsx`: `<Stack.Screen name="Wishlist" component={WishlistScreen} />`
- `src/screens/courses/CoursesScreen.tsx`:
  - Custom header'da "Kurslar" sarlavhasi yoniga yurak ikonkasi (`TouchableOpacity`) → `navigation.navigate('Wishlist')`
  - `renderItem`da `CourseCard`ga `isWishlisted` (selector `ids`dan) va `onToggleWishlist` (dispatch `toggleWishlist`) uzatiladi

---

## 3. Ma'lumot oqimi

1. Courses tab ochiladi → `fetchCourses` + `fetchWishlist` dispatch
2. `wishlist.ids` to'plami yuklanadi → har CourseCard `isWishlisted = ids.includes(course._id)`
3. Foydalanuvchi yurakni bosadi → `toggleWishlist` optimistik flip (UI darrov) → API → xato bo'lsa revert
4. Header yurak ikonkasi → WishlistScreen → `items` ro'yxati ko'rinadi
5. WishlistScreen'da yurakni o'chirsa → `toggleWishlist` → karta ro'yxatdan chiqadi

---

## 4. Xatoliklarni boshqarish
- Tarmoq xatosi: optimistik o'zgarish qaytariladi, `error` state'ga yoziladi (kerak bo'lsa toast/alert)
- `GET /wishlist` populate qilinmagan (o'chirilgan kurs) elementlar: `courseId === null` bo'lganlar filtrlanadi
- Auth yo'q (401): `axiosInstance` interceptor refresh/logout'ni avtomatik boshqaradi

---

## 5. Konventsiyalarga rioya (CLAUDE.md)
- Ranglar faqat `useTheme()` — inline hex yo'q (yurak fonidagi yarim shaffof qora `rgba` — bu ikonka kontrasti uchun, theme rang emas; muqobil: `colors.overlay` bo'lsa ishlatamiz)
- Barcha matn o'zbekcha
- Har action'da `triggerHaptic`
- API faqat `axiosInstance` orqali
- Redux: `createAsyncThunk` + typed hooklar

---

## 6. Qamrov tashqarisi (YAGNI)
- Offline keshlash (AsyncStorage)
- Sevimlilarni saralash/filtrlash
- CourseDetailScreen'dagi yurak tugmasi (faqat karta tanlandi)
- Sevimlilar soni badge'i

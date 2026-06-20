// Aidevix platformasini yaratgan jamoa (asoschilar).
// Ma'lumot https://www.aidevix.uz/team sahifasidan olingan.
// Backend modeli yo'q — statik ro'yxat. Yangi a'zo qo'shilsa shu yerga qo'shing.

export interface Founder {
  id: string;
  name: string;
  age?: number;
  role: string;
  task: string;
  /** Remote rasm URL. Yuklanmasa ekranda ism harfidan avatar ko'rsatiladi. */
  image: string;
  /** Bosh asoschi/CEO ni ajratib ko'rsatish uchun. */
  lead?: boolean;
}

const TEAM_BASE = 'https://www.aidevix.uz/team';

export const FOUNDERS: Founder[] = [
  {
    id: 'sunnatbek',
    name: 'Sunnatbek Yusupov',
    role: 'CEO · Loyiha asoschisi · Frontend',
    task:
      'Aidevix strategiyasi, mahsulot yo\'nalishi va frontend arxitekturasining umumiy rahbari. Investorlar, hamkorlar va jamoani bir maqsad atrofida birlashtirish, platformaning foydalanuvchi tajribasi va o\'sish yo\'nalishlarini belgilash.',
    image: `${TEAM_BASE}/sunnatbee.jpg`,
    lead: true,
  },
  {
    id: 'sardor',
    name: 'Sardor',
    age: 15,
    role: 'Team Lead · Tester',
    task:
      'Jamoa rahbari (Team Lead) va tester sifatida release sifatini, regressiya va muhim user flowlarni tekshiradi. Railway (backend) + Vercel (frontend) production muhitini sozlash, JWT cookie auth, Mongoose sxemalari, Swagger API va CI/CD jarayonlarida yetakchi rol o\'ynagan.',
    image: `${TEAM_BASE}/Sardor.jpg`,
  },
  {
    id: 'firdavs',
    name: 'Firdavs',
    age: 16,
    role: 'Auth Specialist',
    task:
      'Platforma autentifikatsiya tizimini noldan qurgan. Cookie-based JWT sessiyasi, login/register formlar, ProtectedRoute va AdminRoute komponentlari, email orqali parolni tiklash va kunlik mukofot modali — hammasi Firdavsning ishi.',
    image: `${TEAM_BASE}/Firdavs.jpg`,
  },
  {
    id: 'abduvohid',
    name: 'Abduvohid',
    age: 15,
    role: 'Home UI · Frontend',
    task:
      'Aidevix bosh sahifasining UI va foydalanuvchi tajribasini boshqaradi: hero, metrikalar, kurs va video bloklari, umumiy tartib va Navbar/Footer bilan uyg\'un dizayn. Framer Motion va GSAP bilan silliq animatsiyalar va vizual ierarxiya — asosan uning hissasi.',
    image: `${TEAM_BASE}/abduvohid.jpg`,
  },
  {
    id: 'abduvoris',
    name: 'Abduvoris',
    age: 16,
    role: 'Video Engineer',
    task:
      'Video platformasining asosini yaratgan. Bunny.net Stream bilan token-autentifikatsiyali HLS video pleer, videolar ichidagi quiz tizimi, qidiruv va filtrlash — bular Abduvorisning hissasi. Video yuklanish skeletoni va progress tracking ham uniki.',
    image: `${TEAM_BASE}/Abduvoris.jpg`,
  },
  {
    id: 'doniyor',
    name: 'Doniyor',
    age: 16,
    role: 'Course Architect',
    task:
      'Kurslar katalogini to\'liq qurgan. Kategoriya va narx filtrlar, skeleton loading, yulduzcha reyting tizimi, kursga yozilish oqimi va wishlist — bular Doniyorning loyihaga qo\'shgan hissasi. React Native versiyasi uchun ham komponentlar yozgan.',
    image: `${TEAM_BASE}/Doniyor.jpg`,
  },
  {
    id: 'suhrob',
    name: 'Suhrob',
    age: 14,
    role: 'Ranking Builder',
    task:
      'XP asosidagi liderlar jadvalini yaratgan. AMATEUR dan LEGEND gacha bo\'lgan rank tizimi, AI Stack ikonlari, haftalik statistika va foydalanuvchi pozitsiyasini real vaqtda kuzatish — bu Suhrob yaratgan tizim.',
    image: `${TEAM_BASE}/Suhrob.jpg`,
  },
  {
    id: 'qudrat',
    name: 'Qudrat',
    age: 14,
    role: 'Motion Creator',
    task:
      'Platforma vizual tajribasini butunlay o\'zgartirgan. GSAP bilan 3D yuklanish ekrani, sahifalar orasidagi silliq o\'tishlar, Three.js fon effektlari va scroll animatsiyalari — bular Qudratning qo\'li. Micro-interaction va UX polishing ham uning ishi.',
    image: `${TEAM_BASE}/Qudrat.jpg`,
  },
];

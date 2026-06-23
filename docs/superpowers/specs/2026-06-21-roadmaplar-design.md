---
loyiha: Aidevix mobil ilova
sana: 2026-06-21
funksiya: Roadmaplar (O'quv yo'llari)
status: dizayn tasdiqlangan / qilindi
---

# Roadmaplar — Dizayn

## Kontekst
Backendда roadmap YO'Q. Kurs'da `category` (13 enum) + `level` bor. Roadmaplar
**client'da statik** ta'riflanadi, har bosqich bitta `category`ga bog'lanadi.
Progress `enrollments` (progress===100 / completedAt) + kategoriyadagi jami
kurslardan hisoblanadi.

## Qaror qilingan UX (foydalanuvchi tanlovi)
- **Entry:** Home'da "O'quv yo'llari" bo'limi — gorizontal card'lar (progress bilan).
- **Detal:** RoadmapDetail — bosqichli (stepper) ekran; har bosqichда progress bar
  + "x/y kurs tugatildi"; bosqich bosilsa → o'sha kategoriya kurslari (CoursesScreen filtri).

## Fayllar
| Fayl | O'zgarish |
|------|-----------|
| `src/data/roadmaps.ts` | YANGI — `ROADMAPS` (Frontend/Backend/AI/Web3&No-Code), `stepPercent`, `roadmapProgress` helperlari |
| `src/hooks/useRoadmapProgress.ts` | YANGI — courseApi+enrollmentApi'dan LOKAL fetch (Redux courses'ni klobber qilmaslik uchun), kategoriya statistikasi |
| `src/screens/roadmap/RoadmapDetailScreen.tsx` | YANGI — hero + vertical stepper + cross-tab navigatsiya |
| `src/components/home/RoadmapsSection.tsx` | YANGI — Home gorizontal card'lar |
| `src/screens/home/HomeScreen.tsx` | RoadmapsSection qo'shildi (quick-actions'dan keyin) |
| `src/navigation/HomeStack.tsx` + `types.ts` | `RoadmapDetail` ekran + param; `Courses` param `{category?}` |
| `src/screens/courses/CoursesScreen.tsx` | `route.params.category`ni boshlang'ich filtr sifatida o'qiydi |

## Roadmaplar (kategoriyaga moslangan)
- **Frontend:** html → css → javascript → react → typescript
- **Backend:** javascript → nodejs → security
- **AI Muhandis:** general → javascript → ai
- **Web3 & No-Code:** nocode → web3 → telegram
- *Eslatma:* "Python" katalogда yo'q → mavjud kategoriyalarга moslandi.

## Progress mantiqi
- `stepPercent(cat) = round(completed/total*100)` (kategoriyadagi kurslar)
- `roadmapProgress = bosqichlar foizining o'rtachasi` + doneSteps/totalSteps
- completed: enrollment.progress>=100 yoki completedAt

## Doiradan tashqari (keyin / ustoz)
- Backend roadmap modeli (admin tahrirlаydigan yo'llar).
- Bosqich = aniq kurslar ketma-ketligi (hozir kategoriya darajasида).
- Sertifikat / yakuniy "roadmap tugatildi" mukofoti.

## Tekshiruv
- `tsc` 0 xato; yangi fayllar lint 0 xato (HomeScreen'da 2 xato avvaldan bor).
- Qo'lda: card progress, stepper, bosqich → kategoriya kurslari ochilishi.

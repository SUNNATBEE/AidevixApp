# Model Selection Guide — Aidevix

Claude Code sessiyalarida token tejash uchun promptning murakkabligiga qarab to'g'ri modelni tanlash bo'yicha qo'llanma.

> **Muhim**: Claude Code sessiya ichida modelni **avtomatik** almashtira olmaydi. Hook (`.claude/hooks/model-suggest.cjs`) promptni tahlil qilib, sizga tavsiya ko'rsatadi — **almashtirish qo'lda bajariladi**.

---

## 1. Qaysi modelni qachon ishlatish

| Model | Narx | Kontekst | Ishlatish holati |
|-------|------|---------|------------------|
| **Haiku 4.5** | Eng arzon (~$1/M input) | 200K | Sodda savollar, typo, rename, bitta import qo'shish, oddiy tushuntirish, tarjima, kichik format o'zgarishi |
| **Sonnet 4.6** | O'rta (~$3/M input) | 200K | Komponent yozish, bitta fayl refactor, bug tuzatish, Redux slice qo'shish, UI o'zgartirish, orta review |
| **Opus 4.7** | Qimmat (~$15/M input) | 200K / 1M | Arxitektura qarorlari, ko'p fayl refactor, xavfsizlik audit, murakkab debug, butun loyihani tushunish kerak bo'lganda |
| **Opus 4.6 Fast** | Opus narxi | 200K | Opus javobini tezroq olish kerak bo'lsa — `/fast` |

### Baho haqida eslatma
Siz Claude plan obunadasiz (statusline'da ko'rinadi). Absolyut dollar emas, balki **plan limitlari** (5-soatlik sessiya, haftalik limit) bo'yicha tejash uchun:
- Haiku ≈ 1× unit
- Sonnet ≈ 5× unit
- Opus ≈ 25× unit

Shuning uchun oddiy promptga Opus sarflashdan saqlaning.

---

## 2. Hook qanday ishlaydi

Har safar siz prompt yuborganingizda `.claude/hooks/model-suggest.cjs` skripti ishga tushadi:

1. Promptni stdin orqali oladi
2. So'z soni, qator soni, kalit so'zlar, kod bloklari va fayl yo'llarini tahlil qiladi
3. 4 ta ssenariy ichidan bittasini tanlaydi
4. Ekranga bitta qator `systemMessage` chiqaradi

### Trigger mantiqiyotlari

| Ssenariy | Sharoit | Tavsiya |
|---------|---------|---------|
| **Haiku** (oddiy) | ≤12 so'z, murakkab kalit so'z yo'q, kod bloki yo'q, fayl yo'li yo'q | `/model haiku` |
| **Haiku** (kichik vazifa) | Sodda kalit so'zlar bor (rename, typo, tarjima, ...) + ≤30 so'z | `/model haiku` yoki `/fast` |
| **Opus** | ≥80 so'z YOKI ≥8 qator YOKI "arxitektura/refactor/audit..." kalit so'zlari YOKI kod bloki + fayl yo'li | `/model opus[1m]` |
| **Sonnet** | Yuqorilardan hech biri | `/model sonnet` |

---

## 3. Qo'lda almashtirish buyruqlari

```
/model              # interaktiv tanlash menyusi
/model haiku        # Haiku 4.5
/model sonnet       # Sonnet 4.6
/model opus         # Opus 4.7 (200K kontekst)
/model opus[1m]     # Opus 4.7 1M kontekst
/fast               # Opus 4.6 Fast (faqat Opus bo'lganda)
```

---

## 4. Workflow tavsiya

### Eng tejamli oqim

1. Har sessiyani `/model sonnet` bilan boshlang (default yaxshi o'rtacha).
2. Hook ogohlantirishini o'qing:
   - Agar **Haiku** tavsiya etsa → darhol `/model haiku` yozing.
   - Agar **Opus** tavsiya etsa → `/model opus[1m]` ga o'ting.
3. Murakkab ishdan keyin **darhol `/model sonnet` ga qayting** (kontekst tozalanmaydi).

### Qachon Opus kerak (ro'yxat)

- "Loyihani tahlil qil"
- "Arxitekturani qayta ko'r"
- Xavfsizlik review
- 3+ fayl bir vaqtda
- Multi-step debugging (stack trace + logs + kod)
- Yangi feature uchun plan
- Migration (SDK, yoki Redux → Zustand kabi)

### Qachon Haiku yetadi

- "Bu funksiya nima qiladi?"
- "Nomini X ga o'zgartir"
- "Bu yerga import qo'sh"
- Typo tuzatish
- Bir qatorlik format o'zgarishi
- Oddiy til savoli

---

## 5. Hookni o'chirish

Agar ogohlantirishlar xalaqit bersa, `.claude/settings.json` dagi `hooks` bo'limini o'chiring yoki butun faylni olib tashlang. Hook faqat shu loyiha uchun — boshqa loyihalarga ta'sir qilmaydi.

---

## 6. Tekshirish

Hook to'g'ri ishlayotganini tekshirish:

```bash
echo '{"prompt":"rename variable"}' | node .claude/hooks/model-suggest.cjs
# Kutilgan: {"systemMessage":"[Model suggest: haiku] ..."}

echo '{"prompt":"refactor the whole auth system across multiple files"}' | node .claude/hooks/model-suggest.cjs
# Kutilgan: {"systemMessage":"[Model suggest: opus] ..."}
```

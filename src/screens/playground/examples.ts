// Playground misollari — har biri to'liq HTML + CSS + JS to'plami.
// Foydalanuvchi misol tanlasa, joriy kodlari shu misol bilan almashtiriladi.

export type CodeExample = {
  id: string;
  title: string;
  description: string;
  category: 'html' | 'css' | 'js';
  level: 'oson' | 'o\'rta' | 'yuqori';
  icon: string; // Ionicons nomi
  html: string;
  css: string;
  js: string;
};

export const EXAMPLES: CodeExample[] = [
  {
    id: 'counter',
    title: 'Sanovchi (Counter)',
    description: 'Tugmani bosing — raqam o\'sadi. JS event va DOM ishlatish',
    category: 'js',
    level: 'oson',
    icon: 'add-circle-outline',
    html: `<div class="box">
  <h1>Sanovchi</h1>
  <div id="count">0</div>
  <button id="add">+ Qo'shish</button>
  <button id="reset">Tozalash</button>
</div>`,
    css: `body {
  background: #0f172a;
  color: white;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.box { text-align: center; }
#count {
  font-size: 64px;
  font-weight: bold;
  color: #6366f1;
  margin: 20px 0;
}
button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 16px;
  margin: 0 4px;
  cursor: pointer;
}
button:hover { background: #4f46e5; }`,
    js: `let count = 0;
const display = document.getElementById('count');

document.getElementById('add').addEventListener('click', () => {
  count++;
  display.textContent = count;
  console.log('Hozirgi qiymat:', count);
});

document.getElementById('reset').addEventListener('click', () => {
  count = 0;
  display.textContent = count;
  console.log('Tozalandi');
});`,
  },
  {
    id: 'clock',
    title: 'Raqamli soat',
    description: 'Vaqtni real holatda ko\'rsatish. setInterval ishlatish',
    category: 'js',
    level: 'o\'rta',
    icon: 'time-outline',
    html: `<div class="clock">
  <div id="time">00:00:00</div>
  <div id="date">Bugun</div>
</div>`,
    css: `body {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.clock { text-align: center; }
#time {
  font-size: 56px;
  font-weight: bold;
  letter-spacing: 4px;
  font-variant-numeric: tabular-nums;
}
#date {
  font-size: 18px;
  margin-top: 10px;
  opacity: 0.9;
}`,
    js: `function update() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('time').textContent = h + ':' + m + ':' + s;
  document.getElementById('date').textContent = now.toDateString();
}
update();
setInterval(update, 1000);
console.log('Soat ishga tushdi');`,
  },
  {
    id: 'random-color',
    title: 'Tasodifiy rang',
    description: 'Tugma bosilsa fon rangi o\'zgaradi. Math.random() bilan',
    category: 'js',
    level: 'oson',
    icon: 'color-palette-outline',
    html: `<div class="container">
  <h1>Tasodifiy rang</h1>
  <p>Tugmani bosing — fon o'zgaradi</p>
  <button id="change">Rang o'zgartirish</button>
  <p>Joriy rang: <span id="color-name">#ffffff</span></p>
</div>`,
    css: `body {
  background: #ffffff;
  color: #1f2937;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  transition: background 0.5s ease;
}
.container { text-align: center; }
button {
  background: #1f2937;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}
#color-name {
  font-family: monospace;
  font-weight: bold;
}`,
    js: `function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

document.getElementById('change').addEventListener('click', () => {
  const c = randomColor();
  document.body.style.background = c;
  document.getElementById('color-name').textContent = c;
  console.log('Yangi rang:', c);
});`,
  },
  {
    id: 'form-validation',
    title: 'Forma tekshirish',
    description: 'Foydalanuvchi ma\'lumotlarini olish va tekshirish',
    category: 'js',
    level: 'o\'rta',
    icon: 'document-text-outline',
    html: `<div class="form-box">
  <h2>Ro'yxatdan o'tish</h2>
  <input id="name" type="text" placeholder="Ismingiz" />
  <input id="email" type="email" placeholder="Email" />
  <button id="submit">Yuborish</button>
  <div id="result"></div>
</div>`,
    css: `body {
  background: #f3f4f6;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.form-box {
  background: white;
  padding: 30px;
  border-radius: 14px;
  width: 280px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}
input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}
button {
  width: 100%;
  background: #6366f1;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  margin-top: 8px;
  cursor: pointer;
}
#result {
  margin-top: 12px;
  font-size: 14px;
  text-align: center;
}
.ok { color: #16a34a; }
.err { color: #dc2626; }`,
    js: `document.getElementById('submit').addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const result = document.getElementById('result');

  if (!name || !email) {
    result.className = 'err';
    result.textContent = 'Barcha maydonlarni to\\'ldiring';
    console.error('Forma to\\'liq emas');
    return;
  }
  if (!email.includes('@')) {
    result.className = 'err';
    result.textContent = 'Email noto\\'g\\'ri';
    console.error('Email xato:', email);
    return;
  }
  result.className = 'ok';
  result.textContent = 'Salom, ' + name + '!';
  console.log('Forma yuborildi:', { name, email });
});`,
  },
  {
    id: 'hover-button',
    title: 'Hover effekti',
    description: 'CSS bilan tugma ustiga kelganda rang o\'zgaradi',
    category: 'css',
    level: 'oson',
    icon: 'hand-left-outline',
    html: `<div class="center">
  <h2>CSS Hover misol</h2>
  <button class="btn">Ustimga keling</button>
  <button class="btn outline">Boshqa stil</button>
</div>`,
    css: `body {
  background: #0f172a;
  color: white;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.center { text-align: center; }
.btn {
  background: #6366f1;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 16px;
  margin: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn:hover {
  background: #f59e0b;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
}
.btn.outline {
  background: transparent;
  border: 2px solid #6366f1;
}
.btn.outline:hover {
  background: #6366f1;
  color: white;
}`,
    js: `// CSS misol — JS ishlatilmagan
console.log('Sichqonchani tugma ustiga olib keling');`,
  },
  {
    id: 'flexbox',
    title: 'Flexbox markazi',
    description: 'CSS Flexbox bilan elementlarni qatorlash',
    category: 'css',
    level: 'oson',
    icon: 'apps-outline',
    html: `<div class="container">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
  <div class="box">4</div>
</div>`,
    css: `body {
  background: #1e293b;
  margin: 0;
  font-family: sans-serif;
}
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
  padding: 30px;
  min-height: 100vh;
  box-sizing: border-box;
}
.box {
  width: 80px;
  height: 80px;
  background: #6366f1;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  border-radius: 12px;
  transition: transform 0.2s ease;
}
.box:hover {
  transform: scale(1.1);
  background: #f59e0b;
}`,
    js: `// CSS misol
console.log('Flexbox bilan markazlashtirish');`,
  },
  {
    id: 'gradient',
    title: 'Gradient fon',
    description: 'Linear-gradient bilan chiroyli fon',
    category: 'css',
    level: 'oson',
    icon: 'water-outline',
    html: `<div class="card">
  <h1>Salom!</h1>
  <p>Gradient fon — CSS linear-gradient bilan</p>
</div>`,
    css: `body {
  background: linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%);
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 40px;
  border-radius: 20px;
  color: white;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
h1 { margin: 0 0 10px; font-size: 32px; }
p { margin: 0; opacity: 0.9; }`,
    js: `// CSS misol
console.log('Gradient yuklandi');`,
  },
  {
    id: 'animation',
    title: 'Animatsiya',
    description: 'CSS @keyframes bilan elementni harakatga keltirish',
    category: 'css',
    level: 'o\'rta',
    icon: 'sparkles-outline',
    html: `<div class="stage">
  <div class="ball"></div>
  <p>CSS animatsiya</p>
</div>`,
    css: `body {
  background: #0f172a;
  color: white;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.stage { text-align: center; }
.ball {
  width: 60px;
  height: 60px;
  background: #f59e0b;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: bounce 1.5s infinite ease-in-out;
  box-shadow: 0 0 20px #f59e0b;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-60px); }
}`,
    js: `// CSS animatsiya
console.log('Shar sakrayapti');`,
  },
  {
    id: 'list',
    title: 'Tartibsiz ro\'yxat',
    description: 'HTML ul va li elementlari bilan ro\'yxat tuzish',
    category: 'html',
    level: 'oson',
    icon: 'list-outline',
    html: `<h1>Mening rejam</h1>
<ul>
  <li>HTML o'rganish</li>
  <li>CSS bilan stillash</li>
  <li>JavaScript yozish</li>
  <li>React Native dasturlash</li>
  <li>Loyihalar qurish</li>
</ul>

<h2>Tartibli ro'yxat</h2>
<ol>
  <li>Birinchi qadam</li>
  <li>Ikkinchi qadam</li>
  <li>Uchinchi qadam</li>
</ol>`,
    css: `body {
  background: #0f172a;
  color: white;
  font-family: sans-serif;
  padding: 20px;
}
h1, h2 { color: #6366f1; }
li {
  padding: 6px 0;
  font-size: 15px;
}
li:hover { color: #f59e0b; }`,
    js: `// HTML misol
console.log('Ro\\'yxat yaratildi');`,
  },
  {
    id: 'table',
    title: 'Jadval',
    description: 'HTML table elementi bilan ma\'lumotlarni ko\'rsatish',
    category: 'html',
    level: 'oson',
    icon: 'grid-outline',
    html: `<h1>Talabalar ro'yxati</h1>
<table>
  <thead>
    <tr>
      <th>Ism</th>
      <th>Yosh</th>
      <th>Daraja</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Aziz</td>
      <td>17</td>
      <td>Junior</td>
    </tr>
    <tr>
      <td>Malika</td>
      <td>19</td>
      <td>Middle</td>
    </tr>
    <tr>
      <td>Bobur</td>
      <td>22</td>
      <td>Senior</td>
    </tr>
  </tbody>
</table>`,
    css: `body {
  background: #0f172a;
  color: white;
  font-family: sans-serif;
  padding: 20px;
}
h1 { color: #6366f1; }
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}
th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #334155;
}
th {
  background: #1e293b;
  color: #6366f1;
}
tr:hover td { background: #1e293b; }`,
    js: `// HTML misol
console.log('Jadval ko\\'rsatildi');`,
  },
];

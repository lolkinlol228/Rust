/* ============================ RUST HELPER APP ============================ */

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const fmt = n => n.toLocaleString('ru-RU');

// иконка предмета из /icons (по shortname, без .webp)
const ICON = (name, cls='ico') => name ? `<img class="${cls}" src="icons/${name}.webp" alt="">` : '';
// маленькая иконка серы — заменяет слово «серы»
const SULF = `<img class="ico-sm" src="icons/sulfur.webp" alt="серы" title="сера">`;

/* ---------- Tabs ---------- */
$$('nav.tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('nav.tabs button').forEach(b => b.classList.remove('active'));
    $$('.tab-page').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $('#tab-' + btn.dataset.tab).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ---------- helpers ---------- */
const tierName = { twig:'twig', wood:'wood', stone:'stone', metal:'metal', hqm:'hqm' };

// возвращает {key, sulfur} самого дешёвого метода для постройки
function cheapestMethod(s){
  let best = null;
  METHODS.forEach(m => {
    const c = s.counts[m.key];
    if (c == null) return;
    const sulfur = c * SULFUR[m.key];
    if (!best || sulfur < best.sulfur) best = { key:m.key, sulfur };
  });
  return best;
}

/* ============================ RAID TABLE ============================ */
function renderRaidTable(filter='Все'){
  const tbody = $('#raid-body');
  tbody.innerHTML = '';
  const list = STRUCTURES.filter(s => filter==='Все' || s.cat===filter);

  list.forEach(s => {
    const best = cheapestMethod(s);
    const tr = document.createElement('tr');

    let cells = `<td class="name">
        ${ICON(s.icon)}
        <span class="tier-dot t-${tierName[s.tier]}"></span>
        <span class="namecol">${s.name}<span class="hp">${fmt(s.hp)} HP</span></span>
      </td>`;

    METHODS.forEach(m => {
      const c = s.counts[m.key];
      if (c == null){ cells += `<td>—</td>`; return; }
      const sulfur = c * SULFUR[m.key];
      const isBest = best && best.key === m.key;
      cells += `<td>
        <span class="cell-num ${isBest?'best':''}">${fmt(c)} шт${isBest?'<span class="best-tag">выгодно</span>':''}</span>
        <span class="cell-sub">${fmt(sulfur)} ${SULF}</span>
      </td>`;
    });

    tr.innerHTML = cells;
    tbody.appendChild(tr);
  });
}

// фильтр-чипы
const cats = ['Все', ...new Set(STRUCTURES.map(s => s.cat))];
const chipsBox = $('#raid-chips');
cats.forEach((c,i) => {
  const b = document.createElement('button');
  b.textContent = c;
  if (i===0) b.classList.add('active');
  b.onclick = () => {
    $$('#raid-chips button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    renderRaidTable(c);
  };
  chipsBox.appendChild(b);
});
renderRaidTable();

/* ============================ MELEE TABLES ============================ */
function renderMeleeWall(){
  const tbody = $('#melee-wall-body');
  MELEE_WALL.rows.forEach(r => {
    tbody.insertAdjacentHTML('beforeend', `<tr>
      <td class="name">${ICON(r.icon)}<span class="namecol">${r.tool}</span></td>
      <td class="cell-num">${r.hits}</td>
      <td>${r.need}</td>
      <td>${r.craft}</td>
      <td style="color:var(--muted)">${r.note||''}</td>
    </tr>`);
  });
}
function renderMeleeDoor(){
  const tbody = $('#melee-door-body');
  MELEE_DOOR.rows.forEach(r => {
    tbody.insertAdjacentHTML('beforeend', `<tr>
      <td class="name">${ICON(r.icon)}<span class="namecol">${r.tool}</span></td>
      <td class="cell-num">${r.hits}</td>
      <td style="color:var(--muted)">${r.note||''}</td>
    </tr>`);
  });
  $('#melee-door-tip').textContent = MELEE_DOOR.tip;
}
renderMeleeWall();
renderMeleeDoor();

/* ============================ CRAFTING ============================ */
function renderCrafting(){
  const tbody = $('#craft-body');
  CRAFTING.forEach(c => {
    tbody.insertAdjacentHTML('beforeend', `<tr>
      <td class="name">${ICON(c.icon)}<span class="namecol">${c.item}</span></td>
      <td><span class="cell-num" style="color:var(--yellow)">${fmt(c.sulfur)}</span> ${SULF}</td>
      <td>${c.parts}</td>
      <td>${c.wb}</td>
      <td style="color:var(--muted)">${c.note}</td>
    </tr>`);
  });
}
function renderUpgrade(){
  const tbody = $('#upgrade-body');
  UPGRADE.forEach(u => {
    tbody.insertAdjacentHTML('beforeend', `<tr>
      <td class="name">${ICON(u.icon)}<span class="namecol">${u.tier}</span></td>
      <td class="cell-num">${fmt(u.hp)} HP</td>
      <td>${u.cost}</td>
    </tr>`);
  });
}
renderCrafting();
renderUpgrade();

/* ============================ CALCULATOR ============================ */
const cart = [];   // { id, qty }

function buildSelect(){
  const sel = $('#calc-select');
  let groups = {};
  STRUCTURES.forEach(s => { (groups[s.cat] = groups[s.cat]||[]).push(s); });
  Object.keys(groups).forEach(cat => {
    const og = document.createElement('optgroup');
    og.label = cat;
    groups[cat].forEach(s => {
      const o = document.createElement('option');
      o.value = s.id; o.textContent = `${s.name} (${fmt(s.hp)} HP)`;
      og.appendChild(o);
    });
    sel.appendChild(og);
  });
}
buildSelect();

$('#calc-add').onclick = () => {
  const id = $('#calc-select').value;
  const qty = Math.max(1, parseInt($('#calc-qty').value, 10) || 1);
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ id, qty });
  $('#calc-qty').value = 1;
  renderCart();
};

function renderCart(){
  const box = $('#calc-cart');
  box.innerHTML = '';
  if (!cart.length){ box.innerHTML = '<p class="hint">Список пуст — добавь постройки, которые хочешь снести.</p>'; }
  cart.forEach((c, i) => {
    const s = STRUCTURES.find(x => x.id === c.id);
    box.insertAdjacentHTML('beforeend', `<div class="cart-item">
      <span>${ICON(s.icon,'ico-sm')} <b>${c.qty}×</b> ${s.name}</span>
      <button class="btn ghost mini" data-rm="${i}">убрать</button>
    </div>`);
  });
  $$('#calc-cart [data-rm]').forEach(b => b.onclick = () => { cart.splice(+b.dataset.rm,1); renderCart(); });
  calculate();
}

function calculate(){
  const out = $('#calc-result');
  if (!cart.length){ out.innerHTML = ''; return; }

  // суммируем количество по каждому методу (если метод применим ко всем объектам)
  const totals = {};
  METHODS.forEach(m => totals[m.key] = { count:0, sulfur:0, possible:true });

  // оптимальный микс: для каждого объекта берём самый дешёвый способ
  let mixSulfur = 0;

  cart.forEach(c => {
    const s = STRUCTURES.find(x => x.id === c.id);
    const cm = cheapestMethod(s);
    if (cm) mixSulfur += cm.sulfur * c.qty;
    METHODS.forEach(m => {
      const unit = s.counts[m.key];
      if (unit == null){ totals[m.key].possible = false; return; }
      totals[m.key].count  += unit * c.qty;
      totals[m.key].sulfur += unit * SULFUR[m.key] * c.qty;
    });
  });

  // самый дешёвый единый метод (один тип бума на всё)
  let best = null;
  METHODS.forEach(m => {
    const t = totals[m.key];
    if (!t.possible) return;
    if (!best || t.sulfur < totals[best].sulfur) best = m.key;
  });

  let html = `<div class="total-sulfur">
      Минимум серы (оптимальный микс по каждому объекту):
      <div class="num">${fmt(mixSulfur)} ${SULF}</div>
    </div>`;

  html += '<h3 style="margin:16px 0 10px">Если ломать одним типом бума:</h3><div class="result-grid">';
  METHODS.forEach(m => {
    const t = totals[m.key];
    if (!t.possible) return;
    const win = m.key === best;
    html += `<div class="result-card ${win?'win':''}">
      ${ICON(m.icon)}
      <div class="big">${fmt(t.count)}</div>
      <div class="lbl">${m.label}</div>
      <div class="sub">${fmt(t.sulfur)} ${SULF}${win?' ✓ дешевле всего':''}</div>
    </div>`;
  });
  html += '</div>';
  out.innerHTML = html;
}

$('#calc-clear').onclick = () => { cart.length = 0; renderCart(); };
renderCart();

/* ============================ TIMERS ============================ */
// День/ночь — Rust: ночь 15 мин, день 30 мин (цикл 45 мин). Сохраняется в localStorage.
const NIGHT = 15*60*1000, DAY = 30*60*1000, CYCLE = NIGHT+DAY;
const DN_KEY = 'rustDayNight';
let dn = { phase:'night', start:Date.now() };

function loadDN(){
  try{
    const raw = localStorage.getItem(DN_KEY);
    if (!raw) return;
    const st = JSON.parse(raw);
    const into = (Date.now() - st.start) % CYCLE;
    dn.start = Date.now() - into;
    dn.phase = into < NIGHT ? 'night' : 'day';
  }catch(e){}
}
function saveDN(){ try{ localStorage.setItem(DN_KEY, JSON.stringify(dn)); }catch(e){} }

function fmtTime(ms){
  if (ms<0) ms=0;
  const t=Math.floor(ms/1000), m=Math.floor(t/60), s=t%60;
  return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}

function tickDN(){
  const card = $('#dn-card');
  const elapsed = Date.now() - dn.start;
  const dur = dn.phase==='night' ? NIGHT : DAY;
  let remain = dur - elapsed;
  if (remain <= 0){
    dn.phase = dn.phase==='night' ? 'day' : 'night';
    dn.start = Date.now();
    remain = dn.phase==='night' ? NIGHT : DAY;
    saveDN();
  }
  card.className = 'timer-card ' + dn.phase;
  $('#dn-icon').textContent = dn.phase==='night' ? '🌙' : '☀️';
  $('#dn-label').textContent = dn.phase==='night' ? 'Сейчас ночь — до дня' : 'Сейчас день — до ночи';
  $('#dn-display').textContent = fmtTime(remain);
}
$('#dn-sync').onclick = () => { dn.phase='night'; dn.start=Date.now(); saveDN(); };
$('#dn-set').onclick = () => {
  const v = $('#dn-input').value.split(':');
  const mins = parseInt(v[0],10)||0, secs = parseInt(v[1]||'0',10)||0;
  const ms = (mins*60+secs)*1000;
  if (ms>0){ const dur = dn.phase==='night'?NIGHT:DAY; dn.start = Date.now()-(dur-ms); saveDN(); }
  $('#dn-input').value='';
};
loadDN();

// Универсальный обратный отсчёт (взлом ящика 15 мин и свой таймер)
function makeCountdown(displayEl, defMs){
  let running=false, start=0, dur=defMs;
  return {
    begin(ms){ dur = ms||defMs; start=Date.now(); running=true; },
    tick(){
      if(!running){ displayEl.textContent = fmtTime(0); return; }
      let r = dur - (Date.now()-start);
      if (r<=0){ r=0; running=false; displayEl.classList.add('done'); }
      displayEl.textContent = fmtTime(r);
    }
  };
}
const hack = makeCountdown($('#hack-display'), 15*60*1000);
$('#hack-start').onclick = () => { $('#hack-display').classList.remove('done'); hack.begin(15*60*1000); };

const custom = makeCountdown($('#custom-display'), 0);
$('#custom-start').onclick = () => {
  const v = $('#custom-input').value.split(':');
  const mins = parseInt(v[0],10)||0, secs = parseInt(v[1]||'0',10)||0;
  const ms=(mins*60+secs)*1000;
  if(ms>0){ $('#custom-display').classList.remove('done'); custom.begin(ms); }
};

setInterval(() => { tickDN(); hack.tick(); custom.tick(); }, 250);

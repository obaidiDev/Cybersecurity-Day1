/* ============================================================
   MAJAL Day 1 — deck interactions
   Three distinct mechanics: balance · deduce · reveal
   ============================================================ */
(function(){
  "use strict";
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const reward=(opts={})=>{ if(window.confetti){ window.confetti(Object.assign(
    {particleCount:90,spread:70,origin:{y:.6},colors:['#23C4C0','#E2E233','#0A5C78','#ffffff']},opts)); } };

  /* ========================================================
     1 · CIA TENSION CONSOLE  (balance, don't quiz)
     Push one pillar too hard and another degrades.
     ======================================================== */
  function initCIA(root){
    if(!root || root.dataset.ready) return; root.dataset.ready="1";
    const dials = { C: $('#cia-c',root), I: $('#cia-i',root), A: $('#cia-a',root) };
    const vals  = { C: $('#cia-cv',root), I: $('#cia-iv',root), A: $('#cia-av',root) };
    // scenario needs: hospital ER records — must be reachable fast, trustworthy, reasonably private
    const need = { C:45, I:70, A:75 };
    const bars = { C: $('#g-c i',root), I: $('#g-i i',root), A: $('#g-a i',root) };
    const btxt = { C: $('#g-c .lbl b',root), I: $('#g-i .lbl b',root), A: $('#g-a .lbl b',root) };
    const verdict = $('#cia-verdict',root);
    let won=false;

    function effective(c,i,a){
      // tension model: heavy confidentiality/verification slows legitimate access;
      // wide-open availability erodes confidentiality.
      const effC = clamp(c - 0.35*Math.max(0,a-60), 0,100);
      const effA = clamp(a - 0.45*Math.max(0,c-60) - 0.25*Math.max(0,i-72), 0,100);
      const effI = clamp(i - 0.15*Math.max(0,a-80), 0,100);
      return {C:Math.round(effC), I:Math.round(effI), A:Math.round(effA)};
    }
    function paint(){
      const c=+dials.C.value,i=+dials.I.value,a=+dials.A.value;
      vals.C.textContent=c; vals.I.textContent=i; vals.A.textContent=a;
      ['C','I','A'].forEach(k=>dials[k].style.setProperty('--fill',dials[k].value+'%'));
      const eff=effective(c,i,a);
      const fails=[];
      ['C','I','A'].forEach(k=>{
        const ok = eff[k] >= need[k];
        bars[k].style.width = eff[k]+'%';
        bars[k].style.background = ok ? 'var(--yellow)' : (eff[k] >= need[k]-15 ? '#f2b134' : '#e15b5b');
        btxt[k].textContent = eff[k];
        if(!ok) fails.push(k);
      });
      const names={C:'Confidentiality',I:'Integrity',A:'Availability'};
      const why={
        C:'records leak — privacy + PDPL breach',
        I:'records can be tampered — wrong dosage risk',
        A:'doctors can’t pull records in an emergency'
      };
      if(fails.length===0){
        verdict.innerHTML='<b>Balanced.</b> All three pillars hold for the ER. Notice you couldn’t just max everything — security is engineering the <b>trade-offs</b>, not one dial to 100.';
        if(!won){ won=true; reward(); }
      }else{
        won=false;
        verdict.innerHTML = fails.map(k=>`<b>${names[k]}</b> is starving → ${why[k]}.`).join('<br>')+
          '<br><span style="opacity:.8">Ease off wherever you over-tightened.</span>';
      }
    }
    ['C','I','A'].forEach(k=> dials[k].addEventListener('input',paint));
    paint();
  }

  /* ========================================================
     2 · THREAT-ACTOR INVESTIGATION  (cumulative deduction)
     Clues drop in; suspects dim out; you name the culprit.
     ======================================================== */
  const SUSPECTS = [
    {id:'kiddie',   ic:'🧑‍💻', name:'Script kiddie',  mot:'ego · lulz'},
    {id:'hacktivist',ic:'📣', name:'Hacktivist',      mot:'ideology · message'},
    {id:'crime',    ic:'💰', name:'Cybercriminal',    mot:'money'},
    {id:'insider',  ic:'🎫', name:'Insider',          mot:'revenge · access'},
    {id:'nation',   ic:'🛰️', name:'Nation-state / APT',mot:'espionage'}
  ];
  const CASES = [
    { title:'Case 01 — The defaced homepage',
      clues:[
        {t:'Target: a government ministry’s public website.', out:[]},
        {t:'Loud and proud — the front page was swapped for a political message meant to be seen.', out:['crime','insider','nation']},
        {t:'Entry was a known un-patched CMS plugin, popped with an off-the-shelf exploit.', out:[]},
        {t:'The defacement carried a coordinated campaign hashtag reused on three other gov sites the same day.', out:['kiddie']}
      ],
      culprit:'hacktivist',
      tell:'A coordinated message across many targets = <b>ideology</b>, not a lone thrill-seeker. That’s a hacktivist.'
    },
    { title:'Case 02 — The silent quarter',
      clues:[
        {t:'Target: a defense contractor’s R&D network.', out:[]},
        {t:'The intrusion sat undetected for 8 months. Whisper-quiet, custom malware.', out:['kiddie','hacktivist']},
        {t:'Bespoke tooling, zero-day exploits, infrastructure rotated to dodge attribution.', out:['insider']},
        {t:'Nothing was monetised — only guidance-system design documents were exfiltrated.', out:['crime']}
      ],
      culprit:'nation',
      tell:'Patience + zero-days + stealing secrets (not cash) = <b>espionage</b>. Classic nation-state / APT.'
    },
    { title:'Case 03 — The Friday transfer',
      clues:[
        {t:'Target: a mid-size company’s finance system.', out:[]},
        {t:'A legitimate employee login was used — active for 2 years, no forced entry, no malware.', out:['kiddie','nation']},
        {t:'Access came during normal hours, from a normal location. Nothing looked out of place.', out:['hacktivist']},
        {t:'The user had just been passed over for promotion, routed funds to a personal account, then resigned.', out:['crime']}
      ],
      culprit:'insider',
      tell:'Legit access + a personal grudge + quiet abuse from the inside = the hardest one to catch: the <b>insider</b>.'
    }
  ];

  function initCase(root){
    if(!root || root.dataset.ready) return; root.dataset.ready="1";
    const clueList = $('#case-clues',root);
    const suspectWrap = $('#case-suspects',root);
    const titleEl = $('#case-title',root);
    const nextBtn = $('#case-next',root);
    const newBtn  = $('#case-new',root);
    const vEl = $('#case-verdict',root);
    let ci=0, step=0, ruled=new Set(), decided=false;

    // render suspects once
    suspectWrap.innerHTML = SUSPECTS.map(s=>
      `<button class="suspect" data-id="${s.id}">
         <div class="sic">${s.ic}</div>
         <div class="sname">${s.name}</div>
         <div class="smot">${s.mot}</div>
       </button>`).join('');
    $$('.suspect',suspectWrap).forEach(b=> b.addEventListener('click',()=>accuse(b)));

    function loadCase(){
      const c=CASES[ci]; step=0; ruled=new Set(); decided=false;
      titleEl.textContent=c.title;
      clueList.innerHTML = c.clues.map((cl,idx)=>
        `<li data-i="${idx}"><span class="num">${String(idx+1).padStart(2,'0')}</span><span>${cl.t}</span></li>`).join('');
      $$('.suspect',suspectWrap).forEach(b=>{ b.className='suspect'; });
      vEl.innerHTML='Reveal the clues, watch suspects drop out, then <b>name your culprit.</b>';
      nextBtn.disabled=false; nextBtn.textContent='Reveal first clue →';
    }
    function nextClue(){
      const c=CASES[ci];
      if(step>=c.clues.length) return;
      const li=$(`li[data-i="${step}"]`,clueList); li.classList.add('on');
      c.clues[step].out.forEach(id=>{
        ruled.add(id);
        const s=$(`.suspect[data-id="${id}"]`,suspectWrap);
        if(s && !s.classList.contains('picked')) s.classList.add('ruled');
      });
      step++;
      if(step>=c.clues.length){ nextBtn.disabled=true; nextBtn.textContent='All clues in — accuse!'; }
      else nextBtn.textContent='Next clue →';
    }
    function accuse(b){
      if(decided) return;
      const id=b.dataset.id;
      if(ruled.has(id)){ b.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:220}); return; }
      decided=true;
      const c=CASES[ci];
      b.classList.add('picked');
      if(id===c.culprit){ b.classList.add('correct'); vEl.innerHTML='✅ <b>Correct.</b> '+c.tell; reward({origin:{y:.5}}); }
      else{
        b.classList.add('picked');
        const right=$(`.suspect[data-id="${c.culprit}"]`,suspectWrap); right.classList.add('correct');
        vEl.innerHTML='❌ Not quite. '+c.tell;
      }
    }
    nextBtn.addEventListener('click',nextClue);
    newBtn.addEventListener('click',()=>{ ci=(ci+1)%CASES.length; loadCase(); });
    loadCase();
  }

  /* ========================================================
     3 · ATTACK SURFACE — guess, then watch it explode
     ======================================================== */
  const VECTORS = [
    {cat:'core',    t:'“Just a small company”', x:50, y:50},
    {cat:'digital', t:'Public website login',   x:50, y:16},
    {cat:'digital', t:'VPN gateway',            x:74, y:22},
    {cat:'digital', t:'Exposed RDP port',       x:86, y:42},
    {cat:'digital', t:'Forgotten staging server',x:88, y:66},
    {cat:'digital', t:'Cloud storage bucket',   x:74, y:82},
    {cat:'digital', t:'Unsecured API endpoint', x:26, y:82},
    {cat:'digital', t:'IoT camera / printer',   x:12, y:66},
    {cat:'human',   t:'Reused / weak passwords',x:12, y:34},
    {cat:'human',   t:'Phishable staff',        x:30, y:14},
    {cat:'human',   t:'Help-desk (social eng.)',x:66, y:12},
    {cat:'physical',t:'Badge reader / tailgating',x:92, y:26},
    {cat:'physical',t:'USB drop in car park',   x:94, y:80},
    {cat:'physical',t:'Guest / office Wi-Fi',   x:6,  y:50},
    {cat:'social',  t:'CEO oversharing on LinkedIn',x:40,y:90},
    {cat:'social',  t:'Third-party vendor access',x:62, y:88},
    {cat:'social',  t:'HVAC / supplier VPN link',x:20, y:16}
  ];
  function initSurface(root){
    if(!root || root.dataset.ready) return; root.dataset.ready="1";
    const field=$('#surf-field',root);
    const btn=$('#surf-go',root);
    const guessIn=$('#surf-guess',root);
    const counter=$('#surf-count',root);
    const caption=$('#surf-cap',root);
    const total=VECTORS.length-1; // exclude core
    field.innerHTML=VECTORS.map((v,i)=>
      `<div class="node ${v.cat==='core'?'core':''}" data-cat="${v.cat}" data-i="${i}"
            style="left:${v.x}%;top:${v.y}%">
         ${v.cat==='core'?'':'<span class="dot"></span>'}${v.t}
       </div>`).join('');
    let done=false;
    function explode(){
      if(done) return; done=true;
      const guess=parseInt(guessIn.value,10);
      $('.node.core',field).classList.add('on');
      let shown=0;
      VECTORS.forEach((v,i)=>{
        if(v.cat==='core') return;
        setTimeout(()=>{
          $(`.node[data-i="${i}"]`,field).classList.add('on');
          shown++; counter.textContent=shown;
          if(shown===total){
            reward({particleCount:120,spread:100});
            if(!isNaN(guess)){
              caption.innerHTML = guess<total
                ? `You guessed <b>${guess}</b>. Reality: <b>${total}</b> ways in — and this is a <em>small</em> company.`
                : `You guessed <b>${guess}</b> — good instinct. Even so, every one of these <b>${total}</b> is a door an attacker can try.`;
            } else {
              caption.innerHTML = `<b>${total}</b> ways in — and this is only a <em>small</em> company. Every door is part of the attack surface.`;
            }
          }
        }, 120*shown + 200);
      });
      btn.disabled=true; guessIn.disabled=true;
    }
    btn.addEventListener('click',explode);
    guessIn.addEventListener('keydown',e=>{ if(e.key==='Enter') explode(); });
  }

  /* ========================================================
     Wire up on Reveal lifecycle
     ======================================================== */
  function boot(){
    initCIA($('#cia-console'));
    initCase($('#investigation'));
    initSurface($('#attack-surface'));
  }
  window.MajalInteractions = { boot };
})();

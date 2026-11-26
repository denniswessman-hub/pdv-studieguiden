"use strict";
const host = document.querySelector("main");
const icons = {
  book:'<path d="M3 5.3c3.3-.9 6-.3 9 1.7 3-2 5.7-2.6 9-1.7v13c-3.5-.7-6-.1-9 1.7-3-1.8-5.5-2.4-9-1.7z"/><path d="M12 7v13"/>',
  people:'<circle cx="9" cy="7" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m1 3a5 5 0 0 1 4 5"/>',
  message:'<path d="M4 4h16v12H9l-5 4zM8 8h8m-8 4h5"/>',
  scale:'<path d="M12 3v17m-5 0h10M4 7l8-2 8 2M5 7l-3 7h6zm14 0-3 7h6z"/>',
  play:'<rect x="2.5" y="4" width="19" height="16" rx="3"/><path d="m10 8 5 4-5 4z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  clip:'<rect x="5" y="5" width="14" height="16" rx="2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m8 14 2.5 2.5L16 11"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>',
  idea:'<path d="M9 17c0-2.3-3-3-3-7a6 6 0 0 1 12 0c0 4-3 4.7-3 7zm.5 3h5"/>',
  back:'<path d="m14.5 5-7 7 7 7"/>',
  mark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.1M4 12h.1M4 18h.1"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-9v.3"/>'
};
const ico = name => '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>';
document.querySelector(".brand-mark").innerHTML=ico("book");
const key="pdv-studieguide-2026-11-v1";
let saved={};
try { saved=JSON.parse(localStorage.getItem(key)||"{}")||{}; } catch { saved={}; }
const validSet=(value,allowed)=>new Set((Array.isArray(value)?value:[]).filter(x=>allowed.includes(x)));
const done=validSet(saved.done,modules.map(x=>x.id));
const watched=validSet(saved.watched,films.map(x=>x.id));
const prep=validSet(saved.prep,readingTasks.map((_,i)=>i));
let filter="Alla";
let lastModule=modules.find(m=>m.id===saved.last)?.id;
let practice={}, quiz=null;
function validQuiz(candidate){
  if(!candidate||!Array.isArray(candidate.ids)||!candidate.ids.length||candidate.ids.length>questions.length)return false;
  if(new Set(candidate.ids).size!==candidate.ids.length||!candidate.ids.every(n=>Number.isInteger(n)&&questions[n]))return false;
  if(!Array.isArray(candidate.picks)||candidate.picks.length>candidate.ids.length)return false;
  if(!candidate.picks.every((p,i)=>Number.isInteger(p)&&questions[candidate.ids[i]].a[p]!==undefined))return false;
  return Number.isInteger(candidate.pos)&&candidate.pos>=0&&candidate.pos<=candidate.picks.length&&candidate.picks.length<=candidate.pos+1;
}
if(validQuiz(saved.quiz))quiz=saved.quiz;
function persist(){try{localStorage.setItem(key,JSON.stringify({done:[...done],watched:[...watched],prep:[...prep],last:lastModule,quiz}));}catch{/* The guide remains usable for this visit. */}}
function external(url,label,cls=""){return '<a href="'+url+'" target="_blank" rel="noopener noreferrer" class="'+cls+'">'+label+'</a>';}
const ref=id=>external(source[id][1],source[id][0]);
function sourceList(ids){return '<ul class="source-list">'+ids.map(id=>'<li>'+ref(id)+'</li>').join('')+'</ul>';}
function header(label,title,description){return '<div class="page-head"><span class="category">'+label+'</span><h1>'+title+'</h1><p>'+description+'</p></div>';}
function page(content){return '<div class="wrap page"><a class="crumb" href="#oversikt">'+ico("back")+' Översikt</a>'+content+'</div>';}
function card(m){
 const status=done.has(m.id)?'<span class="badge-done">'+ico("check")+' Klar</span>':'<span class="time">'+ico("clock")+' ca '+m.time+' min</span>';
 return '<a class="mod-card" href="#modul/'+m.id+'"><div class="cardtop"><span class="tile-icon '+m.color+'">'+ico(m.icon)+'</span>'+status+'</div><span class="category">'+m.type+'</span><h3>'+m.name+'</h3><p>'+m.desc+'</p></a>';
}
function progressPanel(){const next=modules.find(m=>m.id===lastModule&&!done.has(m.id))||modules.find(m=>!done.has(m.id));return '<section class="panel progress-panel"><h3>'+ico("mark")+' Dina studier</h3><div class="progress-line"><span>Avklarade moduler</span><strong>'+done.size+' av '+modules.length+'</strong></div><progress max="4" value="'+done.size+'" aria-label="Avklarade moduler"></progress><p class="small">Dina markeringar sparas i den här webbläsaren.</p><a class="textlink" href="'+(next?'#modul/'+next.id:'#sjalvtest')+'">'+(lastModule&&next?'Fortsätt läsa':next?'Öppna första modulen':'Öppna självtestet')+'</a></section>';}
function homepage(){
 const next=modules.find(m=>m.id===lastModule&&!done.has(m.id))||modules.find(m=>!done.has(m.id));
 return '<div class="wrap"><section class="hero"><div class="hero-inner"><div class="eyebrow">Polisprogrammet · Termin 5</div><h1>Pågående<br>dödligt våld</h1><p>Studera polisens uppdrag, repetera våldsjuridiken och förbered dig inför de två PDV-dagarna.</p><div class="actions"><a class="btn primary" href="'+(next?'#modul/'+next.id:'#sjalvtest')+'">'+ico("book")+(lastModule&&next?'Fortsätt studera':next?'Börja studera':'Till självtestet')+'</a><a class="btn secondary" href="#filmer">'+ico("play")+' Öppna filmrummet</a></div></div></section><div class="home-layout"><section><div class="section-head"><h2>Studiemoduler</h2><span class="small">4 moduler</span></div><div class="cards">'+modules.map(card).join('')+'</div></section><aside class="side">'+progressPanel()+'<section class="panel"><span class="side-date">Kursmoment · Termin 5</span><h3>Inför utbildningsdagarna</h3><p>Två dagar i följd. Kontrollera förberedelser, utrustning och efterarbete.</p><a class="textlink" href="#kursdagar">Öppna checklistan</a></section><section class="panel"><span class="side-date">Rättsläge · 26 november 2026</span><h3>Ny lag om skjutvapen</h3><p>Från den 1 juli gäller lag (2025:1062).</p><a class="textlink" href="#modul/skjutvapen">Läs om förändringen</a></section></aside></div></div>';
}
function prepPage(){return page(header("Canvas · Termin 5","Inför utbildningsdagarna","Kursen tränar eget ansvar, ett säkert och lagligt ingripande samt sambandet mellan taktik, juridik och etik.")+'<div class="studygrid"><div class="stack"><section class="paper"><h2>Förberedelser</h2><div class="checkrows">'+readingTasks.map((t,i)=>'<label class="checkrow"><input type="checkbox" data-prep="'+i+'" '+(prep.has(i)?'checked':'')+'>'+t+'</label>').join('')+'</div></section><section class="paper"><h2>Dag 1</h2><p>Undervisningen sker inomhus. Ta med klädsel och utrustning för yttre tjänst, heltäckande klädsel för övningen, radiofäste och öronsnäcka.</p><p>Efter dagen ska du se kursfilmerna och jämföra dina upplevelser med det som filmerna tar upp.</p><a class="textlink" href="#filmer">Till filmrummet</a></section><section class="paper"><h2>Dag 2</h2><p>Du behöver ha deltagit dag 1 för att kunna genomföra dag 2. Samma utrustning behövs. Ta även med en väderanpassad uniformsjacka för den korta förflyttningen utomhus.</p></section></div><aside class="side"><section class="panel"><h3>'+ico("info")+' Kursens anvisningar</h3><p>Plats och tid anges i Kronox. Canvas är kursens originalkälla för ändrade anvisningar.</p>'+external(source.canvas[1],"Öppna kurssidan","textlink")+'</section></aside></div>');}
function modulesPage(){return page(header("Termin 5 · Fördjupning","Studiemoduler","Välj ett ämne. Varje modul avslutas med en kontrollfråga och källor för fortsatt läsning.")+'<div class="studygrid"><div class="cards">'+modules.map(card).join('')+'</div><aside class="side">'+progressPanel()+'</aside></div>');}
function feedback(q,pick){return '<div class="feedback" tabindex="-1" role="status"><b>'+(pick===q.key?'Rätt svar.':'Rätt svar är '+String.fromCharCode(65+q.key)+'.')+'</b><p>'+q.why+'</p><p class="minor">'+(q.ref?ref(q.ref):q.local)+'</p></div>';}
function answers(q,pick,mode){return '<div class="choices">'+q.a.map((a,i)=>{
 const cls=pick===undefined?'':i===q.key?' correct':i===pick?' wrong':'';
 return '<button type="button" class="choice'+cls+'" data-'+mode+'="'+i+'" '+(pick!==undefined?'disabled':'')+'><b>'+String.fromCharCode(65+i)+'</b><span>'+a+'</span></button>';
 }).join('')+'</div>'+(pick!==undefined?feedback(q,pick):'');}
function gtfGraphic(){return '<section class="paper"><h2>Vem vet vad?</h2><div class="symbol-row"><div>'+ico("eye")+'<strong>Iakttagelse</strong><span>”Jag såg en elev sitta ner.”</span></div><div>'+ico("message")+'<strong>Uppgift</strong><span>”En lärare säger att eleven har ont.”</span></div><div>'+ico("idea")+'<strong>Bedömning</strong><span>”Eleven kan behöva vård.”</span></div></div></section>';}
function lawGraphic(){return '<section class="paper"><h2>Tre gränser i lagtexten</h2><div class="symbol-row"><div><strong>PL 10 §</strong><span>Våldet måste vara försvarligt.</span></div><div><strong>Nödvärn</strong><span>Gränsen går vid uppenbart oförsvarligt.</span></div><div><strong>Nöd</strong><span>Gränsen går vid oförsvarligt.</span></div></div></section>';}
function modulePage(m){
 const i=modules.indexOf(m),q=questions[m.check],pick=practice[m.id];
 const article=m.sections.map(([h,p],idx)=>'<details '+(idx===0?'open':'')+'><summary>'+h+'</summary><p>'+p+'</p></details>').join('');
 return page(header(m.type,m.name,m.intro)+'<div class="studygrid"><article class="stack"><section class="paper"><h2>Fördjupning</h2>'+article+'</section>'+(m.id==='gtf'?gtfGraphic():m.id==='valdsjuridik'?lawGraphic():'')+'<section class="mini-ex" id="practice"><span class="category">Kontrollfråga</span><h2>'+q.q+'</h2><div id="practice-options">'+answers(q,pick,"practice")+'</div></section><section class="paper"><h2>Källor till modulen</h2>'+sourceList(m.refs)+(m.local?'<p class="note">'+m.local+'</p>':'')+'</section><div class="reader-next"><button type="button" class="btn primary" data-done="'+m.id+'" aria-pressed="'+done.has(m.id)+'">'+ico("check")+' <span>'+(done.has(m.id)?'Markerad som klar':'Markera modulen som klar')+'</span></button><a class="btn" href="'+(modules[i+1]?'#modul/'+modules[i+1].id:'#sjalvtest')+'">'+(modules[i+1]?'Nästa modul':'Öppna självtestet')+'</a></div></article><aside class="side"><section class="panel"><h3>'+ico("list")+' Studiemoduler</h3>'+modules.map((x)=>'<a class="sidebarlink '+(x===m?'current':'')+'" '+(x===m?'aria-current="page"':'')+' href="#modul/'+x.id+'">'+x.name+'</a>').join('')+'</section></aside></div>');
}
function filmCards(){
 const visible=films.filter(f=>filter==="Alla"||(filter==="Kvar att se"?!watched.has(f.id):watched.has(f.id)));
 if(!visible.length)return '<div class="paper"><p>'+(filter==="Sedda"?'Här visas filmer som du markerar som sedda.':'Du har markerat alla fem filmer som sedda.')+'</p></div>';
 return visible.map(f=>'<article class="film"><span class="tile-icon">'+ico("play")+'</span><div><span class="category">'+f.tag+' · '+f.meta+'</span><h2>'+f.name+'</h2><p>'+f.prompt+'</p><label class="checkrow"><input type="checkbox" data-film="'+f.id+'" '+(watched.has(f.id)?'checked':'')+'> Markerad som sedd</label></div>'+external(f.url||source.canvas[1],f.url?"Öppna filmen":"Öppna kurssidan","btn")+'</article>').join('');
}
function filmsPage(){return page(header("Efterarbete · Dag 1","Filmrummet","Se filmerna efter den första utbildningsdagen. Välj en fråga att diskutera med basgruppen efter varje film.")+'<p class="notice">Filmerna skildrar verkliga våldshändelser eller dramatiseringar och kan innehålla starka scener. De utländska exemplen ger underlag för reflektion. Svenska rättsregler finns i juridikmodulerna.</p><div class="filters" aria-label="Filtrera filmer">'+["Alla","Kvar att se","Sedda"].map(f=>'<button type="button" data-filter="'+f+'" aria-pressed="'+(f===filter)+'">'+f+'</button>').join('')+'</div><p class="small" id="film-count" aria-live="polite">'+watched.size+' av 5 markerade som sedda</p><div class="film-list" id="film-list" style="margin-top:12px">'+filmCards()+'</div>');}
function sourcesPage(){return page(header("Referenser","Källor och rättsläge","Rättsläget på sidan kontrollerades den 26 november 2026. Länkarna går till lagtext, förarbeten, praxis, myndigheternas utvärderingar och kursens anvisningar.")+'<div class="stack refbox"><section class="paper"><h2>Lagtext och förarbeten</h2>'+sourceList(["pl","brb","skjut","prop","hd"])+'</section><section class="paper"><h2>Myndigheternas underlag</h2>'+sourceList(["polis","pmfs","orebro","mcf","skr"])+'</section><section class="paper"><h2>Kursen och de fem underlagen</h2>'+sourceList(["canvas"])+'<p><strong>Nationell bastaktik</strong> (Polishögskolan, 2005, s. 4) ger bakgrund till GTF och den inledande bedömningen.</p><p><strong>Kommunikativa kunskapsområdet</strong> (s. 4, 9–10) behandlar återkoppling och aktivt lyssnande. <strong>Taktiska kunskapsområdet</strong> (s. 3–6) behandlar kontroll, risk, hot och mänskliga begränsningar.</p><p><strong>Frågor och svar juridiskt vapen</strong> och <strong>Sammanfattning av juridiska bestämmelser för simulatorlektion vapen</strong> har använts för att identifiera kursens juridiska frågor. Hänvisningar till skjutkungörelsen och den upphävda FAP 104-2 har ersatts med gällande rätt.</p></section><section class="paper"><h2>Om studieguiden</h2><p>Fristående repetitionsmaterial för polisstudenter. Praktisk färdighetsträning hör till den lärarledda undervisningen. Bilden på startsidan är en AI-genererad illustration. Frågesvar och studiemarkeringar sparas på din enhet.</p></section></div>');}
function quizPage(){
 const top=header("Repetition","Självtest","Pröva din bedömning och läs motiveringen efter varje svar.");
 if(!quiz)return page(top+'<section class="quizbox"><h2>Åtta frågor om PDV</h2><p>Frågorna täcker polisens uppdrag, lägesbild, våldsjuridik och skjutvapenlagen. Du kan lämna testet och fortsätta senare i samma webbläsare.</p><div class="actions"><button type="button" class="btn primary" data-quiz-action="start">Starta självtestet</button></div></section>');
 if(quiz.pos===quiz.ids.length){
 const wrong=quiz.ids.filter((id,i)=>quiz.picks[i]!==questions[id].key),right=quiz.ids.length-wrong.length;
 return page(top+'<section class="quizbox"><span class="category">Resultat</span><h2>'+right+' av '+quiz.ids.length+' rätt</h2><p>'+(wrong.length?'Repetera gärna frågorna nedan. Du kan sedan göra om just dem.':'Du har klarat samtliga frågor i den här omgången.')+'</p>'+(wrong.length?'<ul>'+wrong.map(id=>'<li>'+questions[id].q+' <a href="#modul/'+modules[questions[id].m].id+'">Läs modulen</a></li>').join('')+'</ul>':'')+'<div class="actions">'+(wrong.length?'<button class="btn primary" data-quiz-action="wrong">Öva på missade frågor</button>':'')+'<button class="btn" data-quiz-action="start">Gör hela testet igen</button></div></section>');
 }
 const q=questions[quiz.ids[quiz.pos]],pick=quiz.picks[quiz.pos];
 return page(top+'<section class="quizbox"><div class="progress-line"><span>Fråga '+(quiz.pos+1)+' av '+quiz.ids.length+'</span><span>'+modules[q.m].type+'</span></div><progress max="'+quiz.ids.length+'" value="'+quiz.picks.length+'" aria-label="Besvarade frågor"></progress><h2>'+q.q+'</h2>'+answers(q,pick,"pick")+(pick!==undefined?'<div class="actions"><button class="btn primary" data-quiz-action="next">'+(quiz.pos===quiz.ids.length-1?'Visa resultat':'Nästa fråga')+'</button></div>':'')+'</section>');
}
function route(){return location.hash.slice(1)||"oversikt";}
function render(focus=false){
 const path=route();let nav=path,title="Översikt",view;
 if(path.startsWith("modul/")){
 const m=modules.find(x=>"modul/"+x.id===path);
 if(m){lastModule=m.id;persist();view=modulePage(m);title=m.name;nav="moduler";}
 }
 if(!view){const pages={oversikt:[homepage,"Översikt"],moduler:[modulesPage,"Studiemoduler"],filmer:[filmsPage,"Filmrummet"],sjalvtest:[quizPage,"Självtest"],kallor:[sourcesPage,"Källor"],kursdagar:[prepPage,"Utbildningsdagarna"]};const item=pages[path]||pages.oversikt;view=item[0]();title=item[1];if(item===pages.oversikt||path==="kursdagar")nav="oversikt";}
 host.innerHTML=view;
 document.title=title+" · PDV-studieguiden";
 document.querySelectorAll("nav a").forEach(a=>{if(a.hash==="#"+nav)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
 if(focus){host.focus({preventScroll:true});window.scrollTo(0,0);}
}
function refreshQuiz(target){host.innerHTML=quizPage();const next=host.querySelector(target);if(next){if(!next.hasAttribute("tabindex")&&!next.matches("button"))next.tabIndex=-1;next.focus();}}
host.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;
 if(b.hasAttribute("data-done")){
 const id=b.dataset.done;if(done.has(id))done.delete(id);else done.add(id);
 b.setAttribute("aria-pressed",String(done.has(id)));b.querySelector("span").textContent=done.has(id)?"Markerad som klar":"Markera modulen som klar";persist();
 }else if(b.hasAttribute("data-practice")){
 const m=modules.find(x=>"modul/"+x.id===route());if(!m||practice[m.id]!==undefined)return;
 practice[m.id]=Number(b.dataset.practice);document.querySelector("#practice-options").innerHTML=answers(questions[m.check],practice[m.id],"practice");document.querySelector(".feedback").focus();
 }else if(b.hasAttribute("data-filter")){
 filter=b.dataset.filter;host.querySelectorAll("[data-filter]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));document.querySelector("#film-list").innerHTML=filmCards();
 }else if(b.hasAttribute("data-pick")&&quiz&&quiz.picks[quiz.pos]===undefined){
 quiz.picks.push(Number(b.dataset.pick));persist();refreshQuiz(".feedback");
 }else if(b.hasAttribute("data-quiz-action")){
 const action=b.dataset.quizAction;
 if(action==="start"||action==="wrong"){const ids=action==="start"?questions.map((_,i)=>i):quiz.ids.filter((id,i)=>quiz.picks[i]!==questions[id].key);quiz={ids,picks:[],pos:0};}
 else if(action==="next"&&quiz&&quiz.picks[quiz.pos]!==undefined)quiz.pos++;
 persist();refreshQuiz(".quizbox h2");
 }
});
host.addEventListener("change",e=>{
 const input=e.target;
 if(input.hasAttribute("data-prep")){const i=Number(input.dataset.prep);if(input.checked)prep.add(i);else prep.delete(i);persist();}
 if(input.hasAttribute("data-film")){const id=input.dataset.film;if(input.checked)watched.add(id);else watched.delete(id);persist();document.querySelector("#film-count").textContent=watched.size+" av 5 markerade som sedda";if(filter!=="Alla"){document.querySelector("#film-list").innerHTML=filmCards();host.querySelector("[data-filter][aria-pressed=true]").focus();}}
});
document.querySelector(".skip").addEventListener("click",e=>{e.preventDefault();host.focus();host.scrollIntoView();});
window.addEventListener("hashchange",()=>render(true));
render();

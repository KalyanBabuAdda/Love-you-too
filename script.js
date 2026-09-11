const START = new Date('2023-11-16T00:00:00+05:30');
const DISTANCE_START = new Date('2026-09-19T00:00:00+05:30');
const REUNION = new Date('2026-11-19T00:00:00+05:30');
const ANNIVERSARY = new Date('2026-11-16T00:00:00+05:30');

function pad(n){return String(n).padStart(2,'0')}
function relationshipParts(from,to){
  let cursor = new Date(from);
  let years=0, months=0;
  while(true){ const n=new Date(cursor); n.setFullYear(n.getFullYear()+1); if(n<=to){years++;cursor=n}else break; }
  while(true){ const n=new Date(cursor); n.setMonth(n.getMonth()+1); if(n<=to){months++;cursor=n}else break; }
  let ms=to-cursor;
  const days=Math.floor(ms/86400000); ms-=days*86400000;
  const hours=Math.floor(ms/3600000); ms-=hours*3600000;
  const minutes=Math.floor(ms/60000); ms-=minutes*60000;
  const seconds=Math.floor(ms/1000);
  return {years,months,days,hours,minutes,seconds};
}
function updateTimers(){
  const now=new Date();
  const p=relationshipParts(START,now);
  document.getElementById('tYears').textContent=p.years;
  document.getElementById('tMonths').textContent=p.months;
  document.getElementById('tDays').textContent=p.days;
  document.getElementById('tHours').textContent=pad(p.hours);
  document.getElementById('tMinutes').textContent=pad(p.minutes);
  document.getElementById('tSeconds').textContent=pad(p.seconds);
  let diff=Math.max(0,REUNION-now);
  const d=Math.floor(diff/86400000); diff-=d*86400000;
  const h=Math.floor(diff/3600000); diff-=h*3600000;
  const m=Math.floor(diff/60000); diff-=m*60000;
  const s=Math.floor(diff/1000);
  cDays.textContent=d; cHours.textContent=pad(h); cMinutes.textContent=pad(m); cSeconds.textContent=pad(s);
}
setInterval(updateTimers,1000);updateTimers();

const memories=[
  ['assets/moments/product-1.jpg','You. Always.','With you, every ordinary day feels special.'],
  ['assets/moments/product-2.jpg','My favourite view.','I still choose you in every version of every day.'],
  ['assets/moments/product-3.jpg','Us, in little moments.','You are the calm place my heart keeps coming home to.'],
  ['assets/moments/product-4.jpg','Same hearts.','Somehow, even the smallest memory becomes beautiful with you.'],
  ['assets/moments/product-5.jpg','Wherever we are.','Different places, same love, same us.'],
  ['assets/moments/product-6.jpg','A little happiness.','You make life softer without even trying.'],
  ['assets/moments/product-7.jpg','Everywhere with you.','If I could keep one feeling forever, it would be being beside you.'],
  ['assets/moments/product-8.jpg','My person.','The best part of every place is having you there with me.'],
  ['assets/moments/product-9.png','A page I keep.','We are made of tiny memories that somehow became everything.'],
  ['assets/moments/product-10.png','Still my favourite.','No matter how far the map stretches, my heart knows where home is.']
];
let page=0;const photo=document.getElementById('memoryPhoto'), quote=document.getElementById('memoryQuote'),note=document.getElementById('photoNote'),pageNumber=document.getElementById('pageNumber');
function setPage(next,dir=1){
  const lp=document.querySelector('.left-page'),rp=document.querySelector('.right-page');
  lp.classList.add(dir>0?'turning-left':'turning-right');rp.classList.add(dir>0?'turning-right':'turning-left');
  setTimeout(()=>{page=(next+memories.length)%memories.length;const m=memories[page];photo.src=m[0];note.textContent=m[1];quote.textContent=m[2];pageNumber.textContent=pad(page+1);},230);
  setTimeout(()=>{lp.className='page left-page';rp.className='page right-page';},570);
}
prevPage.onclick=()=>setPage(page-1,-1);nextPage.onclick=()=>setPage(page+1,1);
let sx=0;document.getElementById('book').addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});document.getElementById('book').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)setPage(page+(dx<0?1:-1),dx<0?1:-1)},{passive:true});

function makeCalendar(year,month){
  const names=['September','October','November'];
  const wrap=document.createElement('section');wrap.className='month';wrap.innerHTML=`<h3>${names[month-8]} ${year}</h3><div class="weekdays">${['S','M','T','W','T','F','S'].map(x=>`<span>${x}</span>`).join('')}</div>`;
  const days=document.createElement('div');days.className='days';
  const first=new Date(year,month,1).getDay(),last=new Date(year,month+1,0).getDate();
  for(let i=0;i<first;i++){const e=document.createElement('span');e.className='day empty';days.appendChild(e)}
  const now=new Date();
  for(let d=1;d<=last;d++){
    const date=new Date(year,month,d);const el=document.createElement('span');el.className='day';el.textContent=d;
    if(date>=new Date(2026,8,19)&&date<=new Date(2026,10,19))el.classList.add('long-distance');
    if(date < new Date(now.getFullYear(),now.getMonth(),now.getDate()))el.classList.add('passed');
    if(month===10&&d===16){el.classList.add('anniversary');el.title='Our anniversary — 16 November'}
    if(month===10&&d===19){el.classList.add('reunion');el.title='Together again — 19 November'}
    days.appendChild(el)
  }
  wrap.appendChild(days);return wrap
}
const cm=document.getElementById('calendarMonths');[8,9,10].forEach(m=>cm.appendChild(makeCalendar(2026,m)));

// Reveal scenes
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')}),{threshold:.22});document.querySelectorAll('.scene').forEach(s=>obs.observe(s));

// THREE.JS cinematic depth + scroll camera
if(window.THREE){
  const canvas=document.getElementById('three-canvas');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(46,innerWidth/innerHeight,.1,100);camera.position.set(0,0,8);
  const group=new THREE.Group();scene.add(group);
  const geo=new THREE.BufferGeometry();const count=170;const pos=new Float32Array(count*3);const sizes=[];
  for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*18;pos[i*3+1]=(Math.random()-.5)*28;pos[i*3+2]=(Math.random()-.5)*10;sizes.push(.01+Math.random()*.025)}geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({size:.045,color:0xd89a88,transparent:true,opacity:.42,depthWrite:false});group.add(new THREE.Points(geo,mat));
  const petals=[];const petalGeo=new THREE.PlaneGeometry(.14,.28);
  for(let i=0;i<22;i++){const pm=new THREE.MeshBasicMaterial({color:i%2?0x9f6b58:0xc9868c,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false});const p=new THREE.Mesh(petalGeo,pm);p.position.set((Math.random()-.5)*14,(Math.random()-.5)*26,(Math.random()-.5)*6);p.rotation.z=Math.random()*Math.PI;group.add(p);petals.push(p)}
  function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
  let targetY=0,targetZ=8,targetRot=0,mouseX=0,mouseY=0;addEventListener('pointermove',e=>{mouseX=(e.clientX/innerWidth-.5);mouseY=(e.clientY/innerHeight-.5)});
  function scrollUpdate(){const max=document.documentElement.scrollHeight-innerHeight;const t=max?scrollY/max:0;targetY=-t*11.5;targetZ=8-Math.sin(t*Math.PI)*1.6;targetRot=(t-.5)*.18;document.querySelectorAll('.reveal-3d').forEach(el=>{const r=el.getBoundingClientRect();const c=(r.top+r.height/2-innerHeight/2)/innerHeight;el.style.transform=`translate3d(${mouseX*4}px,${Math.max(-18,Math.min(18,c*22))}px,${Math.max(-60,Math.min(45,-Math.abs(c)*45))}px) rotateX(${c*-3}deg) rotateY(${mouseX*1.4}deg)`})}addEventListener('scroll',scrollUpdate,{passive:true});scrollUpdate();
  const clock=new THREE.Clock();function animate(){const t=clock.getElapsedTime();camera.position.y+=(targetY-camera.position.y)*.035;camera.position.z+=(targetZ-camera.position.z)*.035;camera.rotation.z+=(targetRot-camera.rotation.z)*.03;camera.position.x+=(mouseX*.35-camera.position.x)*.03;camera.rotation.x+=(-mouseY*.012-camera.rotation.x)*.03;group.rotation.y=t*.006;petals.forEach((p,i)=>{p.rotation.z+=.0015*(i%3+1);p.position.y-=.0015*(i%4+1);if(p.position.y<-14)p.position.y=14});renderer.render(scene,camera);requestAnimationFrame(animate)}animate();
}

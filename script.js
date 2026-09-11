const relationshipStart = new Date(2023, 10, 16, 0, 0, 0);
const distanceStart = new Date(2026, 8, 19, 0, 0, 0);
const reunionDate = new Date(2026, 10, 19, 0, 0, 0);
const anniversaryDate = new Date(2026, 10, 16, 0, 0, 0);

const pad = n => String(n).padStart(2, "0");

function updateRelationshipCounter(){
  let diff=Math.max(0,new Date()-relationshipStart);
  const days=Math.floor(diff/86400000); diff%=86400000;
  const hours=Math.floor(diff/3600000); diff%=3600000;
  const minutes=Math.floor(diff/60000); diff%=60000;
  const seconds=Math.floor(diff/1000);
  document.getElementById("togetherDays").textContent=days.toLocaleString();
  document.getElementById("togetherHours").textContent=pad(hours);
  document.getElementById("togetherMinutes").textContent=pad(minutes);
  document.getElementById("togetherSeconds").textContent=pad(seconds);
}

function updateDistanceCountdown(){
  const now=new Date();
  const daysEl=document.getElementById("remainingDays");
  const exact=document.getElementById("exactCountdown");
  const title=document.getElementById("distanceTitle");
  const note=document.getElementById("statusNote");

  if(now<distanceStart){
    const d=distanceStart-now;
    const days=Math.floor(d/86400000),hours=Math.floor((d%86400000)/3600000),minutes=Math.floor((d%3600000)/60000),seconds=Math.floor((d%60000)/1000);
    daysEl.textContent="61";
    exact.textContent=`Long distance begins in ${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    title.textContent="A little countdown to us.";
    note.textContent="Until 19 September, keep collecting all the close-by moments you can.";
    return;
  }
  if(now>=reunionDate){
    daysEl.textContent="0"; exact.textContent="The countdown is over ♡"; title.textContent="Sriram & Vasanthi are together again."; note.textContent="No more crossing out days. You made it back to each other."; return;
  }
  const d=reunionDate-now;
  const days=Math.floor(d/86400000),hours=Math.floor((d%86400000)/3600000),minutes=Math.floor((d%3600000)/60000),seconds=Math.floor((d%60000)/1000);
  daysEl.textContent=days;
  exact.textContent=`${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s until 19 Nov 2026`;
  title.textContent="A little countdown to us.";
  note.textContent="Every crossed-out day means you're one day closer.";
}

function startOfDay(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function sameDay(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()}

function renderCalendar(){
  const container=document.getElementById("calendarContainer"); container.innerHTML="";
  const months=[new Date(2026,8,1),new Date(2026,9,1),new Date(2026,10,1)];
  const weekdays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const today=startOfDay(new Date()),rangeStart=startOfDay(distanceStart),rangeEnd=startOfDay(reunionDate),anniv=startOfDay(anniversaryDate);

  months.forEach(monthDate=>{
    const block=document.createElement("div"); block.className="month-block";
    const title=document.createElement("div"); title.className="month-title"; title.textContent=monthDate.toLocaleDateString("en-US",{month:"long",year:"numeric"});
    const weekdaysRow=document.createElement("div"); weekdaysRow.className="weekdays";
    weekdays.forEach(day=>{const el=document.createElement("div");el.textContent=day;weekdaysRow.appendChild(el)});
    const grid=document.createElement("div"); grid.className="calendar-grid";
    const y=monthDate.getFullYear(),m=monthDate.getMonth(),first=new Date(y,m,1).getDay(),daysInMonth=new Date(y,m+1,0).getDate();
    for(let i=0;i<first;i++){const e=document.createElement("div");e.className="day-cell empty";grid.appendChild(e)}
    for(let day=1;day<=daysInMonth;day++){
      const date=new Date(y,m,day),cell=document.createElement("div");cell.className="day-cell";
      const num=document.createElement("span");num.className="day-number";num.textContent=day;cell.appendChild(num);
      const inRange=date>=rangeStart&&date<=rangeEnd;
      if(!inRange){cell.classList.add("outside-range")}else{
        cell.classList.add("active-range");
        if(date<today)cell.classList.add("passed");
        if(sameDay(date,today)){cell.classList.remove("passed");cell.classList.add("today")}
        if(sameDay(date,anniv)){cell.classList.remove("passed");cell.classList.add("anniversary");cell.title="Sriram & Vasanthi's anniversary — 16 November ♡"}
        if(sameDay(date,rangeEnd)){cell.classList.remove("passed","today");cell.classList.add("reunion");cell.title="Together again ♡"}
      }
      grid.appendChild(cell);
    }
    block.append(title,weekdaysRow,grid); container.appendChild(block);
  });
}

function updateProgress(){
  const today=startOfDay(new Date()),start=startOfDay(distanceStart),end=startOfDay(reunionDate);
  const total=Math.round((end-start)/86400000); let passed=0;
  if(today<=start)passed=0;else if(today>=end)passed=total;else passed=Math.floor((today-start)/86400000);
  const pct=total?Math.min(100,Math.max(0,(passed/total)*100)):100;
  document.getElementById("progressText").textContent=`${passed} of ${total} days passed`;
  document.getElementById("progressPercent").textContent=`${Math.round(pct)}%`;
  document.getElementById("progressFill").style.width=`${pct}%`;
}

function tick(){updateRelationshipCounter();updateDistanceCountdown()}
renderCalendar();updateProgress();tick();setInterval(tick,1000);setInterval(()=>{renderCalendar();updateProgress()},60000);

// Sketchbook carousel
const spreads=[...document.querySelectorAll(".memory-spread")];
const prev=document.getElementById("prevMemory"),next=document.getElementById("nextMemory"),page=document.getElementById("memoryPage"),dotsWrap=document.getElementById("memoryDots");
let memoryIndex=0;
spreads.forEach((_,i)=>{const b=document.createElement("button");b.className="book-dot";b.setAttribute("aria-label",`Go to memory ${i+1}`);b.addEventListener("click",()=>showMemory(i));dotsWrap.appendChild(b)});
const dots=[...dotsWrap.children];
function showMemory(index){memoryIndex=(index+spreads.length)%spreads.length;spreads.forEach((s,i)=>s.classList.toggle("active",i===memoryIndex));dots.forEach((d,i)=>d.classList.toggle("active",i===memoryIndex));page.textContent=`${pad(memoryIndex+1)} / ${pad(spreads.length)}`}
prev.addEventListener("click",()=>showMemory(memoryIndex-1));next.addEventListener("click",()=>showMemory(memoryIndex+1));showMemory(0);

let touchStartX=0;
const sketchbook=document.getElementById("sketchbook");
sketchbook.addEventListener("touchstart",e=>touchStartX=e.changedTouches[0].screenX,{passive:true});
sketchbook.addEventListener("touchend",e=>{const dx=e.changedTouches[0].screenX-touchStartX;if(Math.abs(dx)>45)showMemory(memoryIndex+(dx<0?1:-1))},{passive:true});

// Photo lightbox
const lightbox=document.getElementById("lightbox"),lightboxImage=document.getElementById("lightboxImage"),lightboxClose=document.getElementById("lightboxClose");
function closeLightbox(){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");document.body.classList.remove("lightbox-open");lightboxImage.src=""}
document.querySelectorAll(".photo-frame").forEach(btn=>btn.addEventListener("click",()=>{const src=btn.dataset.full;if(!src)return;lightboxImage.src=src;lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");document.body.classList.add("lightbox-open")}));
lightboxClose.addEventListener("click",closeLightbox);lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox()});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLightbox();if(e.key==="ArrowRight")showMemory(memoryIndex+1);if(e.key==="ArrowLeft")showMemory(memoryIndex-1)});

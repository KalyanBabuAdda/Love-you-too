// ==============================
// PERSONAL DATES
// ==============================
const relationshipStart = new Date(2023, 10, 16, 0, 0, 0); // Nov 16, 2023
const distanceStart = new Date(2026, 8, 19, 0, 0, 0);      // Sep 19, 2026
const reunionDate = new Date(2026, 10, 19, 0, 0, 0);       // Nov 19, 2026

const pad = (number) => String(number).padStart(2, "0");

function updateRelationshipCounter() {
  const now = new Date();
  let diff = Math.max(0, now - relationshipStart);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff %= 1000 * 60 * 60 * 24;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff %= 1000 * 60 * 60;

  const minutes = Math.floor(diff / (1000 * 60));
  diff %= 1000 * 60;

  const seconds = Math.floor(diff / 1000);

  document.getElementById("togetherDays").textContent = days.toLocaleString();
  document.getElementById("togetherHours").textContent = pad(hours);
  document.getElementById("togetherMinutes").textContent = pad(minutes);
  document.getElementById("togetherSeconds").textContent = pad(seconds);
}

function updateDistanceCountdown() {
  const now = new Date();
  const remainingDaysEl = document.getElementById("remainingDays");
  const exactCountdownEl = document.getElementById("exactCountdown");
  const distanceTitleEl = document.getElementById("distanceTitle");
  const statusNoteEl = document.getElementById("statusNote");

  if (now < distanceStart) {
    const untilDistance = distanceStart - now;
    const days = Math.floor(untilDistance / 86400000);
    const hours = Math.floor((untilDistance % 86400000) / 3600000);
    const minutes = Math.floor((untilDistance % 3600000) / 60000);
    const seconds = Math.floor((untilDistance % 60000) / 1000);

    remainingDaysEl.textContent = "61";
    exactCountdownEl.textContent = `Long distance begins in ${days}d ${hours}h ${minutes}m ${seconds}s`;
    distanceTitleEl.textContent = "A little countdown to us.";
    statusNoteEl.textContent = "The countdown begins on 19 September. Until then, enjoy every close-by moment.";
    return;
  }

  if (now >= reunionDate) {
    remainingDaysEl.textContent = "0";
    exactCountdownEl.textContent = "The countdown is over ♥";
    distanceTitleEl.textContent = "You're together again.";
    statusNoteEl.textContent = "No more counting miles. This chapter made it to the happy part.";
    return;
  }

  let diff = reunionDate - now;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  remainingDaysEl.textContent = days;
  exactCountdownEl.textContent = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s until 19 Nov 2026`;
  distanceTitleEl.textContent = "A little countdown to us.";
  statusNoteEl.textContent = "Every crossed-out day means we're one day closer.";
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function renderCalendar() {
  const container = document.getElementById("calendarContainer");
  container.innerHTML = "";

  const months = [
    new Date(2026, 8, 1),
    new Date(2026, 9, 1),
    new Date(2026, 10, 1)
  ];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = startOfDay(new Date());
  const rangeStart = startOfDay(distanceStart);
  const rangeEnd = startOfDay(reunionDate);

  months.forEach(monthDate => {
    const block = document.createElement("div");
    block.className = "month-block";

    const title = document.createElement("div");
    title.className = "month-title";
    title.textContent = monthDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });

    const weekdaysRow = document.createElement("div");
    weekdaysRow.className = "weekdays";
    weekdays.forEach(day => {
      const label = document.createElement("div");
      label.textContent = day;
      weekdaysRow.appendChild(label);
    });

    const grid = document.createElement("div");
    grid.className = "calendar-grid";

    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.className = "day-cell empty";
      grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const cell = document.createElement("div");
      cell.className = "day-cell";

      const number = document.createElement("span");
      number.className = "day-number";
      number.textContent = day;
      cell.appendChild(number);

      const inRange = date >= rangeStart && date <= rangeEnd;

      if (!inRange) {
        cell.classList.add("outside-range");
      } else {
        cell.classList.add("active-range");

        if (date < today) {
          cell.classList.add("passed");
        }

        if (sameDay(date, today)) {
          cell.classList.remove("passed");
          cell.classList.add("today");
        }

        if (sameDay(date, rangeEnd)) {
          cell.classList.remove("passed", "today");
          cell.classList.add("reunion");
          cell.title = "Together again ♥";
        }
      }

      grid.appendChild(cell);
    }

    block.appendChild(title);
    block.appendChild(weekdaysRow);
    block.appendChild(grid);
    container.appendChild(block);
  });
}

function updateProgress() {
  const today = startOfDay(new Date());
  const start = startOfDay(distanceStart);
  const end = startOfDay(reunionDate);

  const totalDays = Math.round((end - start) / 86400000);
  let passedDays = 0;

  if (today <= start) {
    passedDays = 0;
  } else if (today >= end) {
    passedDays = totalDays;
  } else {
    passedDays = Math.floor((today - start) / 86400000);
  }

  const percent = totalDays === 0 ? 100 : Math.min(100, Math.max(0, (passedDays / totalDays) * 100));

  document.getElementById("progressText").textContent = `${passedDays} of ${totalDays} days passed`;
  document.getElementById("progressPercent").textContent = `${Math.round(percent)}%`;
  document.getElementById("progressFill").style.width = `${percent}%`;
}

function tick() {
  updateRelationshipCounter();
  updateDistanceCountdown();
}

renderCalendar();
updateProgress();
tick();
setInterval(tick, 1000);

// Refresh day-based UI after midnight without needing a page reload.
setInterval(() => {
  renderCalendar();
  updateProgress();
}, 60 * 1000);

// ==============================
// PHOTO LIGHTBOX
// ==============================
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  if (lightboxImage) lightboxImage.src = "";
}

document.querySelectorAll(".moment-card").forEach((card) => {
  card.addEventListener("click", () => {
    const src = card.dataset.full;
    if (!src || !lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

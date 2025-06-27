const conferenceDate = new Date(Date.UTC(2026, 2, 27, 17, 0, 0)); // Feb 27, 2026, 17:00 UTC

function updateCountdown() {
  const now = new Date();
  const diff = conferenceDate - now;
  const countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (diff > 0) {
    countdown.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    countdown.hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    countdown.minutes = Math.floor((diff / (1000 * 60)) % 60);
    countdown.seconds = Math.floor((diff / 1000) % 60);
  }

  const el = id => document.getElementById(id);
  if (el('days')) el('days').textContent = countdown.days;
  if (el('hours')) el('hours').textContent = countdown.hours;
  if (el('minutes')) el('minutes').textContent = countdown.minutes;
  if (el('seconds')) el('seconds').textContent = countdown.seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

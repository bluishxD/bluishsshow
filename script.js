const row = document.querySelector('.episode-row.completed');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');

let autoScrollActive = false;
let speed = 5; // higher speed for visible effect
let animId = null;

// Get how far we can scroll
function getMaxScroll() {
  return row.scrollWidth - row.clientWidth;
}

// Auto-scroll loop
function autoScroll() {
  if (!autoScrollActive) return;
  row.scrollLeft += speed;

  // Loop back to start
  if (row.scrollLeft >= getMaxScroll()) {
    row.scrollLeft = 0;
  }

  animId = requestAnimationFrame(autoScroll);
}

// Start auto-scroll on hover
row.addEventListener('mouseenter', () => {
  autoScrollActive = true;
  if (!animId) autoScroll();
});

// Stop auto-scroll on mouse leave
row.addEventListener('mouseleave', () => {
  autoScrollActive = false;
  cancelAnimationFrame(animId);
  animId = null;
});

// Arrow buttons
leftBtn.addEventListener('click', () => { row.scrollLeft -= 300; });
rightBtn.addEventListener('click', () => { row.scrollLeft += 300; });

// Drag-to-scroll
let isDown = false, startX, scrollLeftStart;
row.addEventListener('mousedown', e => {
  isDown = true;
  startX = e.pageX - row.offsetLeft;
  scrollLeftStart = row.scrollLeft;
});
row.addEventListener('mouseup', () => isDown = false);
row.addEventListener('mouseleave', () => isDown = false);
row.addEventListener('mousemove', e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - row.offsetLeft;
  row.scrollLeft = scrollLeftStart - (x - startX) * 2;
});

// Scroll-reveal: fade in sections as they enter viewport
const revealSections = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealSections.forEach(section => revealObserver.observe(section));
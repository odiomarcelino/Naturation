// Basic interactivity for the nature scene
const scene = document.getElementById('nature-scene');
const sun = document.getElementById('sun');
const trees = document.querySelectorAll('.tree ellipse');
const river = document.getElementById('river');
const flower = document.getElementById('flower');
const stars = document.getElementById('stars');

let isDay = true;

// Sway trees more on mouse move
scene.addEventListener('mousemove', (e) => {
  const percent = e.offsetX / scene.clientWidth;
  trees.forEach((tree, i) => {
    const sway = (percent - 0.5) * 8 * (1 + i * 0.2);
    tree.style.transform = `rotate(${sway}deg)`;
  });
});

scene.addEventListener('mouseleave', () => {
  trees.forEach(tree => {
    tree.style.transform = '';
  });
});

// Tap/click to change time of day
scene.addEventListener('click', () => {
  isDay = !isDay;
  if (isDay) {
    sun.setAttribute('fill', '#ffe066');
    scene.querySelector('rect').setAttribute('fill', '#b3e0ff');
    document.body.style.background = 'linear-gradient(to bottom, #e0f7fa 0%, #b3e0ff 100%)';
  } else {
    sun.setAttribute('fill', '#f7e1ff');
    scene.querySelector('rect').setAttribute('fill', '#232946');
    document.body.style.background = 'linear-gradient(to bottom, #232946 0%, #3a506b 100%)';
  }
  setNightMode(!isDay);
});

// Ripple effect on river
river.addEventListener('click', (e) => {
  river.classList.remove('ripple');
  void river.offsetWidth; // force reflow
  river.classList.add('ripple');
  e.stopPropagation();
});
river.addEventListener('touchstart', (e) => {
  river.classList.remove('ripple');
  void river.offsetWidth;
  river.classList.add('ripple');
  e.stopPropagation();
}, {passive:true});

// Flower bloom on hover/tap
function bloomFlower() {
  flower.classList.add('bloom');
}
function unbloomFlower() {
  flower.classList.remove('bloom');
}
flower.addEventListener('mouseenter', bloomFlower);
flower.addEventListener('mouseleave', unbloomFlower);
flower.addEventListener('touchstart', bloomFlower, {passive:true});
flower.addEventListener('touchend', unbloomFlower, {passive:true});

// Show/hide stars at night, twinkle
function setNightMode(night) {
  if (night) {
    stars.style.opacity = 1;
  } else {
    stars.style.opacity = 0;
  }
}

// Touch support for mobile
scene.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  const rect = scene.getBoundingClientRect();
  const percent = (touch.clientX - rect.left) / rect.width;
  trees.forEach((tree, i) => {
    const sway = (percent - 0.5) * 8 * (1 + i * 0.2);
    tree.style.transform = `rotate(${sway}deg)`;
  });
});

scene.addEventListener('touchend', () => {
  trees.forEach(tree => {
    tree.style.transform = '';
  });
});

// On load, ensure stars are hidden
setNightMode(false);

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Canvas Image Sequence Setup
const canvas = document.querySelector('#bg-canvas');
const context = canvas.getContext('2d');

const setCanvasSize = () => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.scale(dpr, dpr);
};

setCanvasSize();

const frameCount = 240;
const currentFrame = index => (
  `/new_frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const imageSeq = {
  frame: 0
};

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Render the first frame once it loads
images[0].onload = render;

function render() {
  const img = images[imageSeq.frame];
  if (!img) return;
  
  const drawWidth = window.innerWidth;
  const drawHeight = window.innerHeight;

  const hRatio = drawWidth / img.width;
  const vRatio = drawHeight / img.height;
  const ratio = Math.max(hRatio, vRatio);
  const centerShift_x = (drawWidth - img.width * ratio) / 2;
  const centerShift_y = (drawHeight - img.height * ratio) / 2;  

  context.clearRect(0, 0, drawWidth, drawHeight);
  context.drawImage(img, 0, 0, img.width, img.height,
                      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}

gsap.to(imageSeq, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5 // Adding a slight delay makes the scroll feel smoother
  },
  onUpdate: render
});

// Resize handler
window.addEventListener('resize', () => {
  setCanvasSize();
  render();
});

// 3. HTML UI elements animations
gsap.utils.toArray('.card').forEach((card, i) => {
    gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
        }
    });
});

gsap.from('.hero-content', {
    y: 30,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
    delay: 0.5
});

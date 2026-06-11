import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// 1. 3D Mouse Parallax (Bio Images only)
const parallaxImages = document.querySelectorAll('.bio-images img');

parallaxImages.forEach(img => {
    const parent = img.parentElement;
    
    parent.addEventListener('mousemove', (e) => {
        const rect = parent.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        // Calculate percentages from center
        const xPercent = (x / rect.width - 0.5) * 2;
        const yPercent = (y / rect.height - 0.5) * 2;
        
        // Apply 3D rotation based on mouse position
        gsap.to(img, {
            rotationY: xPercent * 10,
            rotationX: -yPercent * 10,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 1000,
            transformOrigin: "center center"
        });
    });
    
    parent.addEventListener('mouseleave', () => {
        // Reset to normal
        gsap.to(img, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });
});

// 2. GSAP 3D Scroll Reveals
const revealElements = document.querySelectorAll('.bio-content p, .service-col');

revealElements.forEach((el) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%", // Trigger when element is 85% from top of viewport
            toggleActions: "play none none reverse"
        },
        y: 60,
        rotationX: -30,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        transformPerspective: 800,
        transformOrigin: "top center"
    });
});

// 3. Deep Parallax Window (Sanctuary Image)
gsap.to('.sanctuary-image img', {
    scrollTrigger: {
        trigger: '.sanctuary-image',
        start: "top bottom",
        end: "bottom top",
        scrub: true
    },
    y: 150, // Move the image down by 150px over the course of the scroll
    ease: "none"
});

// 4. Magnetic Button Effect
const magneticButton = document.querySelector('.btn-book');

if (magneticButton) {
    magneticButton.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const h = rect.width / 2;
        const v = rect.height / 2;
        
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - v;
        
        gsap.to(this, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    magneticButton.addEventListener('mouseleave', function() {
        gsap.to(this, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
}

// 5. Three.js "Floating Hair" Background
const canvas = document.querySelector('#three-bg');
if (canvas) {
    const scene = new THREE.Scene();
    // Use a very light fog to fade hair in the distance
    scene.fog = new THREE.FogExp2(0xffffff, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Hair Strands Group
    const hairGroup = new THREE.Group();
    scene.add(hairGroup);

    // Create Strands
    const strandCount = 150;
    const pointsPerStrand = 50;
    const materials = [
        new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.3 }), // Champagne Gold
        new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.15 }), // Charcoal
        new THREE.LineBasicMaterial({ color: 0xe6c27a, transparent: true, opacity: 0.2 })  // Lighter Gold
    ];

    const strands = [];

    for (let i = 0; i < strandCount; i++) {
        const points = [];
        // Base positions spread out in 3D space
        const startX = (Math.random() - 0.5) * 200;
        const startY = (Math.random() - 0.5) * 200;
        const startZ = (Math.random() - 0.5) * 100;

        for (let j = 0; j < pointsPerStrand; j++) {
            points.push(new THREE.Vector3(startX, startY - j * 2, startZ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = materials[Math.floor(Math.random() * materials.length)];
        const line = new THREE.Line(geometry, material);
        
        hairGroup.add(line);
        
        strands.push({
            line: line,
            baseX: startX,
            baseY: startY,
            baseZ: startZ,
            speed: Math.random() * 0.02 + 0.01,
            offset: Math.random() * Math.PI * 2
        });
    }

    // Animation Loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        strands.forEach(strand => {
            const positions = strand.line.geometry.attributes.position.array;
            
            for (let j = 0; j < pointsPerStrand; j++) {
                const index = j * 3;
                // Wave effect using Sine functions
                const waveX = Math.sin(time * strand.speed + j * 0.1 + strand.offset) * 10;
                const waveZ = Math.cos(time * strand.speed + j * 0.05 + strand.offset) * 15;
                
                positions[index] = strand.baseX + waveX;
                // positions[index+1] remains Y
                positions[index + 2] = strand.baseZ + waveZ;
            }
            strand.line.geometry.attributes.position.needsUpdate = true;
        });

        // Slow overall rotation for the group
        hairGroup.rotation.y = Math.sin(time * 0.1) * 0.2;
        hairGroup.rotation.x = Math.cos(time * 0.15) * 0.1;

        renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Scroll Interaction: Move camera Y position based on scroll
    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
            // Move camera down through the hair strands
            camera.position.y = -self.progress * 150;
        }
    });
}

// 6. Woman Face Turn Scroll Sequence
const womanCanvas = document.querySelector('#woman-canvas');
if (womanCanvas) {
    const context = womanCanvas.getContext('2d');
    const frameCount = 240;
    
    // Generate paths for all 240 frames
    const currentFrame = index => (
        `/frames_woman/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );

    const images = [];
    const airpods = {
        frame: 0
    };

    // Preload all images
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    // Connect animation to scroll
    gsap.to(airpods, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: ".woman-sequence-section",
            start: "top top",
            end: "+=200%", // 200% of viewport height scroll distance
            scrub: 0.5 // Smooth scrubbing
        },
        onUpdate: render
    });

    images[0].onload = render;

    function render() {
        if (!images[airpods.frame]) return;
        const img = images[airpods.frame];
        
        // Scale and center the image to cover the canvas
        const hRatio = womanCanvas.width / img.width;
        const vRatio = womanCanvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (womanCanvas.width - img.width * ratio) / 2;
        const centerShift_y = (womanCanvas.height - img.height * ratio) / 2;
        
        context.clearRect(0, 0, womanCanvas.width, womanCanvas.height);
        context.drawImage(img, 0, 0, img.width, img.height,
            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    }

    // Set correct dimensions
    function resizeWomanCanvas() {
        womanCanvas.width = window.innerWidth;
        womanCanvas.height = window.innerHeight;
        render();
    }
    
    window.addEventListener('resize', resizeWomanCanvas);
    resizeWomanCanvas();
}

// 7. Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

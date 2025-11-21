// Navbar scroll effect
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Highlight active section
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== ANIMACIÓN AVANZADA DE BROCHETAZO CON CANVAS ==========

class PaintBrushAnimation {
    constructor() {
        this.canvas = document.getElementById('paintCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationStarted = false;
        this.setupCanvas();
        this.startAnimation();
    }

    setupCanvas() {
        const container = document.querySelector('.hero-slogan-container');
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = 700;
        this.canvas.height = 150;
        this.canvas.style.width = '700px';
        this.canvas.style.height = '150px';
    }

    createParticle(x, y) {
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            size: Math.random() * 4 + 2,
            alpha: 1,
            color: `rgba(${231 + Math.random() * 20}, ${205 + Math.random() * 20}, ${50 + Math.random() * 10}, ${Math.random() * 0.3 + 0.7})`
        };
    }

    startAnimation() {
        let startTime = Date.now();
        let brushX = -50;
        let brushY = 75;
        let progress = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / 2500, 1);

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Curva del brochetazo
            if (progress < 0.8) {
                const curveProgress = progress / 0.8;
                brushX = -50 + curveProgress * 750;
                brushY = 75 + Math.sin(curveProgress * Math.PI) * 15;

                // Crear partículas mientras el pincel se mueve
                if (Math.random() > 0.3) {
                    for (let i = 0; i < 3; i++) {
                        this.particles.push(this.createParticle(
                            brushX + (Math.random() - 0.5) * 30,
                            brushY + (Math.random() - 0.5) * 30
                        ));
                    }
                }

                // Dibujar trazo principal del pincel
                this.ctx.save();
                this.ctx.globalAlpha = 0.3 + curveProgress * 0.4;
                
                // Efecto de trazo con múltiples capas
                for (let i = 0; i < 5; i++) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(231, 205, 50, ${0.2 - i * 0.03})`;
                    this.ctx.lineWidth = 50 - i * 8;
                    this.ctx.lineCap = 'round';
                    this.ctx.moveTo(Math.max(0, brushX - 100), brushY);
                    this.ctx.lineTo(brushX, brushY);
                    this.ctx.stroke();
                }
                
                this.ctx.restore();
            }

            // Actualizar y dibujar partículas
            this.particles = this.particles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // Gravedad
                particle.alpha -= 0.01;

                if (particle.alpha > 0) {
                    this.ctx.save();
                    this.ctx.globalAlpha = particle.alpha;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                    return true;
                }
                return false;
            });

            // Continuar animación mientras haya partículas o el pincel esté activo
            if (progress < 1 || this.particles.length > 0) {
                requestAnimationFrame(animate);
            }
        };

        // Iniciar después de un pequeño delay
        setTimeout(() => {
            animate();
        }, 300);
    }
}

// Inicializar animación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new PaintBrushAnimation();
    }, 500);
});

// ========== FIN ANIMACIÓN DE BROCHETAZO ==========

// Animated counter for statistics
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                if (stat.textContent === '0') {
                    animateCounter(stat);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const impactoSection = document.querySelector('.impacto');
if (impactoSection) {
    statsObserver.observe(impactoSection);
}

// Fade in animation on scroll
const fadeElements = document.querySelectorAll('.valor-item, .disciplina-card, .gallery-item, .testimonio-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px'
});

fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(element);
});

// Form validation and submission
const contactForm = document.querySelector('.contacto-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const telefono = contactForm.querySelector('input[type="tel"]').value;
        const disciplina = contactForm.querySelector('select').value;
        const mensaje = contactForm.querySelector('textarea').value;

        if (!nombre || !email || !disciplina || !mensaje) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor ingresa un correo electrónico válido.');
            return;
        }

        alert(`¡Gracias ${nombre}! Tu mensaje ha sido enviado. Nos pondremos en contacto contigo pronto.`);
        contactForm.reset();

        console.log({
            nombre,
            email,
            telefono,
            disciplina,
            mensaje
        });
    });
}

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor ingresa un correo electrónico válido.');
            return;
        }

        alert('¡Gracias por suscribirte a nuestro newsletter!');
        newsletterForm.reset();

        console.log('Newsletter subscription:', email);
    });
}

// Gallery lightbox effect
let lightboxActive = false;

function createLightbox(imgSrc, imgAlt) {
    if (lightboxActive) return;
    
    lightboxActive = true;
    
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        animation: fadeIn 0.3s ease;
    `;
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = imgAlt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 0 50px rgba(231, 205, 50, 0.3);
        animation: zoomIn 0.3s ease;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background-color: #E7CD32;
        color: #000;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        font-weight: bold;
        transition: transform 0.3s ease;
        z-index: 10001;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.transform = 'scale(1.1)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.transform = 'scale(1)';
    });
    
    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    document.body.style.overflow = 'hidden';
    
    const closeLightbox = () => {
        lightboxActive = false;
        document.body.style.overflow = '';
        lightbox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (lightbox.parentNode) {
                lightbox.remove();
            }
        }, 300);
    };
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === closeBtn) {
            closeLightbox();
        }
    });
    
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

document.addEventListener('click', (e) => {
    const galleryItem = e.target.closest('.gallery-item');
    if (galleryItem && !galleryItem.classList.contains('hidden')) {
        const img = galleryItem.querySelector('img');
        if (img) {
            createLightbox(img.src, img.alt);
        }
    }
});

// Add CSS animations for lightbox
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes zoomIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Testimonial slider
const testimonioCards = document.querySelectorAll('.testimonio-card');
let currentTestimonio = 0;

const rotateTestimonios = () => {
    testimonioCards.forEach((card, index) => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        if (index === currentTestimonio) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1.05)';
        } else {
            card.style.opacity = '0.6';
            card.style.transform = 'scale(1)';
        }
    });

    currentTestimonio = (currentTestimonio + 1) % testimonioCards.length;
};

if (testimonioCards.length > 0) {
    setInterval(rotateTestimonios, 4000);
}

// Parallax effect for hero section
const heroParallax = () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
};

window.addEventListener('scroll', heroParallax);

// Scroll Up button behavior
const scrollUpBtn = document.getElementById('scrollUpBtn');

if (scrollUpBtn) {
    const toggleScrollUp = () => {
        if (window.scrollY > 300) {
            scrollUpBtn.classList.add('show');
        } else {
            scrollUpBtn.classList.remove('show');
        }
    };

    window.addEventListener('scroll', toggleScrollUp);

    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const firstFocusable = document.querySelector('a, button, input, [tabindex]');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    });

    scrollUpBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollUpBtn.click();
        }
    });
}

// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

images.forEach(img => imageObserver.observe(img));

// Scroll reveal animations for sections
const revealSections = document.querySelectorAll('section');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.15
});

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 1s ease, transform 1s ease';
    sectionObserver.observe(section);
});

// Add dynamic year to footer
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${currentYear} Urban Star's. Todos los derechos reservados.`;
}

// Gallery "Ver Más" functionality
const loadMoreBtn = document.getElementById('loadMoreBtn');
const hiddenItems = document.querySelectorAll('.gallery-item.hidden');

if (loadMoreBtn && hiddenItems.length > 0) {
    loadMoreBtn.addEventListener('click', () => {
        hiddenItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.remove('hidden');
                item.classList.add('show');
            }, index * 100);
        });
        
        loadMoreBtn.classList.add('hidden');
    });
}

// Performance: Debounce scroll events
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Console message
console.log('%c🌟 Urban Star\'s 🌟', 'color: #E7CD32; font-size: 24px; font-weight: bold;');
console.log('%cSembramos cultura en la violencia', 'color: #FFFFFF; font-size: 16px;');
console.log('%cDesarrollado con ❤️ para la comunidad urbana', 'color: #E7CD32; font-size: 14px;');
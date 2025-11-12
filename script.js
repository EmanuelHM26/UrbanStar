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

// Animated counter for statistics
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
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

        // Get form values
        const nombre = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const telefono = contactForm.querySelector('input[type="tel"]').value;
        const disciplina = contactForm.querySelector('select').value;
        const mensaje = contactForm.querySelector('textarea').value;

        // Basic validation
        if (!nombre || !email || !disciplina || !mensaje) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor ingresa un correo electrónico válido.');
            return;
        }

        // Success message
        alert(`¡Gracias ${nombre}! Tu mensaje ha sido enviado. Nos pondremos en contacto contigo pronto.`);
        
        // Reset form
        contactForm.reset();

        // In a real application, you would send this data to a server
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
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor ingresa un correo electrónico válido.');
            return;
        }

        alert('¡Gracias por suscribirte a nuestro newsletter!');
        newsletterForm.reset();

        // In a real application, you would send this to a server
        console.log('Newsletter subscription:', email);
    });
}

// Gallery lightbox effect (improved version)
let lightboxActive = false;

function createLightbox(imgSrc, imgAlt) {
    if (lightboxActive) return;
    
    lightboxActive = true;
    
    // Create lightbox container
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
    
    // Create image
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
    
    // Create close button
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
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Close lightbox function
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
    
    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === closeBtn) {
            closeLightbox();
        }
    });
    
    // Close on ESC key
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// Add click event to gallery items
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

// Testimonial slider (auto-rotate)
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

// Start testimonial rotation
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

    // Show/hide on scroll
    window.addEventListener('scroll', toggleScrollUp);

    // Click -> smooth scroll to top
    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // for accessibility, move focus to top element after scroll
        const firstFocusable = document.querySelector('a, button, input, [tabindex]');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    });

    // Keyboard support: Enter/Space
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

// Typing effect for hero slogan
const heroSlogan = document.querySelector('.hero-slogan');
if (heroSlogan) {
    const text = heroSlogan.textContent;
    heroSlogan.textContent = '';
    let index = 0;

    const typeWriter = () => {
        if (index < text.length) {
            heroSlogan.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        }
    };

    // Start typing after a short delay
    setTimeout(typeWriter, 500);
}

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
            }, index * 100); // Staggered animation
        });
        
        // Hide button after showing all images
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
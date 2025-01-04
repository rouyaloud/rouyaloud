// Preloader with proper timing
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.style.overflow = 'visible'; // Enable scrolling after preloader
        }, 500);
    }, 1500);
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Enhanced Typing Animation with faster timing
function initTypewriter() {
    const lines = document.querySelectorAll('.typing-text .line');
    let delay = 0;
    
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('typing');
            
            // Remove cursor from previous line
            if (index > 0) {
                lines[index - 1].style.animation = 'none';
                lines[index - 1].style.opacity = '1';
                lines[index - 1].style.width = '100%';
            }
        }, delay);
        
        delay += 700; // Reduced from 1700 to 700ms between lines
    });

    // Clean up last line
    setTimeout(() => {
        lines[lines.length - 1].style.animation = 'none';
        lines[lines.length - 1].style.opacity = '1';
        lines[lines.length - 1].style.width = '100%';
    }, delay);
}

// Improved intersection observer with shorter delay
const typewriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                initTypewriter();
            }, 100); // Reduced from 300 to 100ms initial delay
            typewriterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

typewriterObserver.observe(document.querySelector('.craftsmanship'));

// Animate bars when in view
const barsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.accord-bar');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    const width = bar.dataset.width;
                    bar.querySelector('.bar').style.width = `${width}%`;
                }, index * 200); // Stagger the animations
            });
            barsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

barsObserver.observe(document.querySelector('.accords-container'));

// Add this to your existing JavaScript
function typeWriter(element, text, speed = 30) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Typewriter effect
const text = "Beyond gender lies true elegance. Royal Oud Paris transcends traditional boundaries, creating not just a fragrance, but a statement of individuality. This isn't about being masculine or feminine - it's about embodying sophistication, power, and timeless grace. Let your essence speak louder than conventions.";
let charIndex = 0;

const genderObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const typewriterText = entry.target.querySelector('.typewriter-text');
            
            function type() {
                if (charIndex < text.length) {
                    typewriterText.textContent += text.charAt(charIndex);
                    charIndex++;
                    requestAnimationFrame(() => setTimeout(type, 20)); // Adjust speed here
                }
            }
            
            type();
            genderObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe the gender section
genderObserver.observe(document.querySelector('.gender-section'));

// Counter animation
const reachObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const steps = 50;
                const increment = target / steps;
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current).toLocaleString();
                        setTimeout(updateCounter, duration / steps);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                
                updateCounter();
            });
            
            reachObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe the global reach section
reachObserver.observe(document.querySelector('.global-reach'));

// Add this to your existing JavaScript
document.getElementById('subscribeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    // Here you would typically send this to your backend
    console.log('Subscription email:', email);
    
    // Show success message (you can customize this)
    alert('Thank you for subscribing!');
    this.reset();
});

// Updated Product Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.product-image');
    const contents = document.querySelectorAll('.product-content');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    let currentIndex = 0;

    function updateProduct(index) {
        // Update images
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');

        // Update content
        contents.forEach(content => content.classList.remove('active'));
        contents[index].classList.add('active');
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        updateProduct(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        updateProduct(currentIndex);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const body = document.body;

    // Add overlay div if it doesn't exist
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    // Open menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            console.log('Menu clicked'); // Debug line
            hamburger.classList.add('active');
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
        });
    }

    // Close menu function
    const closeMenuFn = () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    };

    // Close menu click handlers
    if (closeMenu) closeMenu.addEventListener('click', closeMenuFn);
    if (overlay) overlay.addEventListener('click', closeMenuFn);

    // Close menu when clicking links
    const mobileLinks = document.querySelectorAll('.mobile-menu-items a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenuFn);
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

// Language switcher functionality
function switchLanguage() {
    const currentPath = window.location.pathname;
    
    // Get the base URL
    const baseUrl = window.location.origin;
    
    // Handle paths for policy pages
    if (currentPath.includes('/policies/')) {
        if (currentPath.includes('/ar/')) {
            // Switch from Arabic to English
            window.location.href = currentPath.replace('/ar/policies/', '/policies/');
        } else {
            // Switch from English to Arabic
            window.location.href = currentPath.replace('/policies/', '/ar/policies/');
        }
    } else {
        // Handle paths for other pages
        if (currentPath.includes('/ar/')) {
            window.location.href = baseUrl + currentPath.replace('/ar/', '/');
        } else {
            window.location.href = baseUrl + '/ar' + currentPath;
        }
    }
}

// Update button text based on current language
document.addEventListener('DOMContentLoaded', function() {
    const langBtn = document.querySelector('.lang-btn .lang-text');
    if (langBtn) {  // Add null check
        const isArabic = window.location.pathname.includes('/ar/');
        langBtn.textContent = isArabic ? 'English' : 'عربي';
    }
});

/**
 * home.js - Main JavaScript for the portfolio website
 * Includes functionality for all website sections (dark mode, navigation, resume, socials)
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Home functionality initialized');    
      // Dark mode toggle functionality
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) {
        // Set initial state based on saved preference
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        darkModeSwitch.checked = savedDarkMode;
        
        // Apply dark mode without triggering scroll (do this before any other DOM operations)
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
        }
            // Add change event listener with anti-jitter implementation
        darkModeSwitch.addEventListener('change', function() {
            const isDarkMode = this.checked;
            
            // Calculate document dimensions before toggle to prevent layout shifts
            const docHeight = document.documentElement.scrollHeight;
            const docWidth = document.documentElement.scrollWidth;
            const scrollPosition = window.scrollY;
            
            // Fix dimensions temporarily to prevent reflow
            document.documentElement.style.height = docHeight + 'px';
            document.documentElement.style.minHeight = docHeight + 'px';
            document.documentElement.style.width = docWidth + 'px';
            document.documentElement.style.overflow = 'hidden';
            
            // Use requestAnimationFrame for smoother transitions
            requestAnimationFrame(() => {
                // Apply dark mode change
                document.body.classList.toggle('dark-mode', isDarkMode);
                // Save preference to localStorage
                localStorage.setItem('darkMode', isDarkMode);
                
                // Restore scroll position immediately to prevent jump
                window.scrollTo(0, scrollPosition);
                
                // Remove the fixed dimensions after transition completes
                setTimeout(() => {
                    document.documentElement.style.height = '';
                    document.documentElement.style.minHeight = '';
                    document.documentElement.style.width = '';
                    document.documentElement.style.overflow = '';
                }, 300); // Match to your CSS transition duration
            });
        });
    }

    // Smooth scrolling for navigation with fixed navbar offset
    setupSmoothScrolling();
    
    // Initialize resume card animations
    initResumeCardAnimation();
    
    // Initialize social card animations
    initSocialCardAnimations();

    // Check for blog paragraph overflow
    setTimeout(checkBlogOverflow, 500); // Delay slightly to ensure content is rendered
    
    // Recheck on window resize
    window.addEventListener('resize', checkBlogOverflow);    // Add active class to navbar items when scrolling
    // Get all sections that have an ID defined
    const sections = document.querySelectorAll("div[id], h2[id]");
    const navItems = document.querySelectorAll("nav a");
    
    // Add an event listener for scroll
    window.addEventListener("scroll", navHighlighter);
    
    // Run navHighlighter once on page load to set initial active state
    navHighlighter();
    
    // Also run it after a small delay to ensure all elements are properly loaded
    setTimeout(navHighlighter, 500);
    
    setInitialNavbarActive();
    
      function navHighlighter() {
        // Get current scroll position
        let scrollY = window.pageYOffset;
        
        // Now we loop through sections to get height, top and ID values for each
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Adjust for navbar height
            const sectionId = current.getAttribute("id");
            
            // If our current scroll position enters the space where the section is
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Find the corresponding nav item and add active class
                navItems.forEach(item => {
                    item.classList.remove("active");
                    const href = item.getAttribute("href");
                    
                    // Check for various conditions to match nav links with sections
                    if (href === "#" + sectionId || 
                        (href === "#home" && sectionId === "home") ||
                        (href === "#" + sectionId.replace("-heading", "")) ||
                        (href === "#" + sectionId.replace("-section-heading", "-section"))) {
                        item.classList.add("active");
                    }
                });
            }
        });
    }// Navigation code was here
});

/**
 * Sets the active state for the navbar item corresponding to the URL hash on page load
 */
function setInitialNavbarActive() {
    const hash = window.location.hash;
    if (hash) {
        const navItems = document.querySelectorAll("nav a");
        navItems.forEach(item => {
            item.classList.remove("active");
            if (item.getAttribute("href") === hash) {
                item.classList.add("active");
            }
        });
    } else {
        // If no hash, highlight the home link
        const homeLink = document.querySelector("nav a[href='#home']");
        if (homeLink) {
            homeLink.classList.add("active");
        }
    }
}

/**
 * Set up smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('nav a, h1 a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (document.querySelector(href)) {
                const targetElement = document.querySelector(href);
                const navHeight = document.querySelector('nav').offsetHeight;
                const headerOffset = navHeight + 20; // Additional offset for padding
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize resume card animations
 */
function initResumeCardAnimation() {
    const resumeCard = document.querySelector('.resume-card');
    if (resumeCard) {
        // Add entrance animation
        resumeCard.style.opacity = '0';
        resumeCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            resumeCard.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            resumeCard.style.opacity = '1';
            resumeCard.style.transform = 'translateY(0)';
        }, 400);
          
        // Add animation for button
        const resumeButton = document.querySelector('.resume-btn');
        if (resumeButton) {
            resumeButton.style.opacity = '0';
            resumeButton.style.transform = 'translateY(15px)';
            
            setTimeout(() => {
                resumeButton.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                resumeButton.style.opacity = '1';
                resumeButton.style.transform = 'translateY(0)';
            }, 800);
        }
    }
}

/**
 * Update resume card styles based on dark mode - this function is now a placeholder
 * as we're handling styles purely via CSS classes
 */
function updateResumeCardStyles() {
    // All styling is now handled via CSS classes
    // This function is kept for backwards compatibility
}

/**
 * Initialize social card animations with staggered entrance
 */
function initSocialCardAnimations() {
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach((card, index) => {
        // Add entrance animation with staggered delay
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 100)); // Stagger the animations based on card index
        
        // Add hover interaction for icon wrapper
        const iconWrapper = card.querySelector('.social-icon-wrapper');
        if (iconWrapper) {
            card.addEventListener('mouseenter', () => {
                iconWrapper.style.transform = 'scale(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                iconWrapper.style.transform = 'scale(1)';
            });
        }
    });
}

/**
 * Update social card styles based on dark mode - this function is now a placeholder
 * as we're handling styles purely via CSS classes
 */
function updateSocialCardStyles() {
    // All styling is now handled via CSS classes
    // This function is kept for backwards compatibility
}

/**
 * Check if blog paragraphs have overflow and add appropriate class
 */
function checkBlogOverflow() {
    const blogParagraphs = document.querySelectorAll('.blog p');
    
    blogParagraphs.forEach(paragraph => {
        if (paragraph.scrollHeight > paragraph.clientHeight) {
            paragraph.classList.add('overflowing');
        } else {
            paragraph.classList.remove('overflowing');
        }
    });
}

// This function is kept for backward compatibility with existing HTML
function openBlog(url) {
    window.open(url, '_blank');
}
/**
 * home.js - Main JavaScript for the portfolio website
 * Includes functionality for all website sections (dark mode, navigation, resume, socials)
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Home functionality initialized');
    
    // Set initial navigation highlight
    setInitialHighlight();
    
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
        
        // Define section mappings (maps section IDs to nav href values)
        const sectionMappings = {
            "home": "#home",
            "about": "#about-heading",
            "education": "#education-heading",
            "achievments": "#achievments-heading", // Note: misspelled in original code
            "skills": "#skills-heading",
            "blog-section": "#blog-section-heading",
            "resume": "#resume-heading",
            "socials": "#socials-heading"
        };
        
        // Find which section is currently in view
        let currentSection = null;
          // Get all sections into an array
        const sectionsArray = Array.from(sections);
          // Adjust the offset and detection thresholds based on screen size
        const isMobile = window.innerWidth <= 480;
        const navbarHeight = isMobile ? 70 : 100;
        
        // Mobile-specific parameters
        const mobileTopThreshold = isMobile ? 0 : 20; // More strict at the top for mobile
        const mobileBottomThreshold = isMobile ? -20 : -50; // Less distance below for mobile
        
        // Store sections with their position data for better analysis
        const viewableSections = [];
        
        // Get all heading elements that should trigger navigation highlighting
        const headings = document.querySelectorAll(".section-heading");
        
        // First prioritize headings - check if any heading is close to the top of the viewport
        let headingFound = false;
        headings.forEach(heading => {
            const headingId = heading.getAttribute("id");
            const headingRect = heading.getBoundingClientRect();
            
            // Different threshold for mobile vs desktop
            const topThreshold = navbarHeight + mobileTopThreshold;
            const bottomThreshold = mobileBottomThreshold;
            
            // Check if heading is at or just past the top of the viewport (accounting for navbar)
            if (headingRect.top <= topThreshold && headingRect.top >= bottomThreshold) {
                let normalizedId = headingId;
                if (headingId.includes("-heading")) {
                    normalizedId = headingId.replace("-heading", "");
                } else if (headingId.includes("-section-heading")) {
                    normalizedId = headingId.replace("-section-heading", "-section");
                }
                viewableSections.push({
                    id: normalizedId,
                    visibility: 1.0, // Give highest priority to headings
                    top: heading.offsetTop,
                    isHeading: true
                });
                headingFound = true;
            }
        });
          
        // If no heading is found at the top, fall back to calculating section visibility
        if (!headingFound) {            // First collect all sections that are visible in the viewport
            sectionsArray.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - navbarHeight;
                const sectionId = section.getAttribute("id");
                const sectionBottom = sectionTop + sectionHeight;
                
                // Get the corresponding heading for this section if it exists
                let sectionHeadingId = null;
                if (sectionId.includes("-heading")) {
                    // This is already a heading
                    sectionHeadingId = sectionId;
                } else {
                    // Try to find a corresponding heading
                    sectionHeadingId = sectionId + "-heading";
                }
                
                // For mobile views, we need to be more precise about when sections begin
                let adjustedSectionTop = sectionTop;
                
                // Mobile specific adjustment: prioritize the start of sections more strongly
                if (isMobile) {
                    // If there's a heading for this section, use its position as the section start
                    const correspondingHeading = document.getElementById(sectionHeadingId);
                    if (correspondingHeading) {
                        adjustedSectionTop = correspondingHeading.offsetTop - navbarHeight;
                    }
                    
                    // Add a small buffer to prevent triggering too early
                    adjustedSectionTop += 15; 
                }
                
                // If our current scroll position falls within this section
                if (scrollY >= adjustedSectionTop && scrollY < sectionBottom) {
                    // Calculate how much of the section is visible, with mobile adjustments
                    const viewportHeight = window.innerHeight;
                    const sectionVisibleTop = Math.max(adjustedSectionTop, scrollY);
                    const sectionVisibleBottom = Math.min(sectionBottom, scrollY + viewportHeight);
                    const visibleAmount = sectionVisibleBottom - sectionVisibleTop;
                    
                    // For mobile, give extra weight to sections at the start of viewing
                    const visibilityRatio = visibleAmount / sectionHeight;
                    // On mobile, prioritize sections just coming into view from the top
                    let priorityFactor = 1.0;
                    if (isMobile && Math.abs(scrollY - adjustedSectionTop) < 100) {
                        priorityFactor = 1.5; // Boost sections where we're near their start
                    }
                    
                    let normalizedId = sectionId;
                    // Process different types of section IDs
                    if (sectionId.includes("-heading")) {
                        normalizedId = sectionId.replace("-heading", "");
                    } else if (sectionId.includes("-section-heading")) {
                        normalizedId = sectionId.replace("-section-heading", "-section");
                    }
                      // Store section with its visibility data
                    viewableSections.push({
                        id: normalizedId,
                        visibility: visibilityRatio * priorityFactor,
                        top: adjustedSectionTop,
                        isHeading: false
                    });
                }
            });
        }
            // If we have visible sections, find the most prominent one
        if (viewableSections.length > 0) {
            // Mobile view needs different sorting priority
            if (isMobile) {
                viewableSections.sort((a, b) => {
                    // Headings always come first on any device
                    if (a.isHeading && !b.isHeading) return -1;
                    if (!a.isHeading && b.isHeading) return 1;
                    
                    // On mobile, position is more important than visibility when close
                    // This helps prevent "jumping" between sections during scroll
                    const topDiff = a.top - b.top;
                    
                    // If one section is significantly higher than the other, prioritize it
                    if (Math.abs(topDiff) > 50) {
                        return topDiff;
                    }
                    
                    // Otherwise use visibility as a tiebreaker
                    return b.visibility - a.visibility;
                });
            } else {
                // Desktop sorting algorithm - unchanged
                viewableSections.sort((a, b) => {
                    // Headings always come first
                    if (a.isHeading && !b.isHeading) return -1;
                    if (!a.isHeading && b.isHeading) return 1;
                    
                    // Then by visibility
                    if (Math.abs(a.visibility - b.visibility) > 0.1) {
                        return b.visibility - a.visibility;
                    }
                    // Finally by position (higher up has priority)
                    return a.top - b.top;
                });
            }
            
            // The most prominent section
            currentSection = viewableSections[0].id;
        }
        
        // First remove active class from all nav items
        navItems.forEach(item => {
            item.classList.remove("active");
        });
        
        // If we found a matching section, highlight the appropriate nav item
        if (currentSection) {
            // Look for matching nav items with more comprehensive checks
            navItems.forEach(item => {
                const href = item.getAttribute("href");
                
                // Multiple ways a nav item could match a section:
                // 1. Direct mapping via sectionMappings
                // 2. Simple hash match (#section-id)
                // 3. Section name contained in the href with a hash
                if (href === sectionMappings[currentSection] || 
                    href === "#" + currentSection ||
                    (href.startsWith("#") && currentSection.includes(href.substring(1)))) {
                    item.classList.add("active");
                }
            });
        }
    }
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
 * Set initial navigation highlight on page load
 * Also handles URL hash changes
 */
function setInitialHighlight() {
    const hash = window.location.hash || "#home";
    const navItems = document.querySelectorAll("nav a");
    let activeSet = false;
    
    // Remove active class from all nav items first
    navItems.forEach(item => {
        item.classList.remove("active");
    });
    
    // First try direct match
    navItems.forEach(item => {
        const href = item.getAttribute("href");
        if (href === hash) {
            item.classList.add("active");
            activeSet = true;
        }
    });
    
    // If no match found (e.g., with section-heading in hash), try to find closest match
    if (!activeSet && hash !== "#home") {
        // Comprehensive section mappings (bidirectional)
        const sectionMappings = {
            "#about": "#about-heading",
            "#about-heading": "#about",
            "#education": "#education-heading",
            "#education-heading": "#education",
            "#achievments": "#achievments-heading", 
            "#achievments-heading": "#achievments",
            "#skills": "#skills-heading",
            "#skills-heading": "#skills",
            "#blog-section": "#blog-section-heading",
            "#blog-section-heading": "#blog-section",
            "#resume": "#resume-heading",
            "#resume-heading": "#resume",
            "#socials": "#socials-heading",
            "#socials-heading": "#socials"
        };
        
        // Check if we have a direct mapping
        const mappedNav = sectionMappings[hash];
        
        // Try standard transformations
        const baseId = hash.replace("-heading", "").replace("-section-heading", "-section");
        
        navItems.forEach(item => {
            const href = item.getAttribute("href");
            if ((mappedNav && href === mappedNav) || 
                href === baseId || 
                (href.startsWith("#") && hash.substring(1).includes(href.substring(1)))) {
                item.classList.add("active");
                activeSet = true;
            }
        });    }
    
    // If still no match, default to home
    if (!activeSet) {
        const homeLink = document.querySelector("nav a[href='#home']");
        if (homeLink) {
            homeLink.classList.add("active");
        }
    }
}

// Add event listener to handle URL hash changes
window.addEventListener('hashchange', setInitialHighlight);

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

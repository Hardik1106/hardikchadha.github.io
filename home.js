window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('darkModeSwitch').addEventListener('change', function(event) {
        document.body.classList.toggle('dark-mode', event.target.checked);
    });
});

// Select all links in the navigation bar
var navLinks = document.querySelectorAll('nav a');

// Add a click event listener to each link
navLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
        // Prevent the default action
        event.preventDefault();

        // Get the target section
        var target = document.querySelector(this.getAttribute('href'));

        // Scroll to the target section
        target.scrollIntoView({ behavior: 'smooth' });
    });
});
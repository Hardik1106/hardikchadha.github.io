window.onload = function() {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    darkModeSwitch.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
    });
};

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const offsetTop = document.querySelector(href).offsetTop - parseInt(getComputedStyle(document.querySelector(href)).marginTop);
        const navHeight = document.querySelector('nav').offsetHeight;
        scroll({
            top: offsetTop - navHeight - 20,
            behavior: 'smooth'
        });
    });
});
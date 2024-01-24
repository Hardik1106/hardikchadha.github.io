window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('darkModeSwitch').addEventListener('change', function(event) {
        document.body.classList.toggle('dark-mode', event.target.checked);
    });
});
window.addEventListener('DOMContentLoaded', (event) => {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section');
    const navHeight = nav.getBoundingClientRect().height;

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const id = e.currentTarget.getAttribute('href').slice(1);
            const element = document.getElementById(id);
            const position = element.offsetTop - navHeight;

            window.scrollTo({
                left: 0,
                top: position,
                behavior: 'smooth'
            });
        });
    });

    window.addEventListener('scroll', () => {
        const scrollHeight = window.pageYOffset;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight;
            const sectionHeight = section.getBoundingClientRect().height;
            const sectionId = section.getAttribute('id');

            if(scrollHeight > sectionTop && scrollHeight <= sectionTop + sectionHeight) {
                document.querySelector('.nav__item a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav__item a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    });
});
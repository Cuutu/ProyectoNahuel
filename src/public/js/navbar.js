document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const hamburgerIcon = document.querySelector('.hamburger-icon');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Opcional: cambiar el ícono del menú
            hamburgerIcon.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinksItems = document.querySelectorAll('.nav-links a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerIcon.textContent = '☰';
            });
        });
    }

    // Cerrar el menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !navLinks.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}); 
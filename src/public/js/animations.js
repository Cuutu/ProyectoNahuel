document.addEventListener('DOMContentLoaded', function() {
    // Función para verificar si un elemento está en el viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Función para animar elementos cuando son visibles
    function animateOnScroll() {
        const elements = document.querySelectorAll('[data-animate]');
        
        elements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('animated');
            }
        });
    }

    // Ejecutar en el scroll y al cargar la página
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
    
    // Ejecutar después de pequeño delay para asegurar carga completa
    setTimeout(animateOnScroll, 100);
}); 
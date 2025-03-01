document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-accordion-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-accordion-header');
        
        header.addEventListener('click', () => {
            // Cerrar todos los otros items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alternar el estado del item actual
            item.classList.toggle('active');
        });
    });
}); 
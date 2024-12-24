document.addEventListener('DOMContentLoaded', function() {
    const formulaModal = document.getElementById('formulaModal');
    const calendarModal = document.getElementById('calendarModal');
    const closeBtns = document.getElementsByClassName('close');

    // Capturar clicks en botones
    document.querySelectorAll('.resource-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            
            if (buttonText === 'Ver calendarios') {
                e.preventDefault();
                calendarModal.style.display = 'block';
            } else if (buttonText === 'Ver índices' || buttonText === 'Ver indices') {
                e.preventDefault();
                formulaModal.style.display = 'block';
            }
        });
    });

    // Cerrar modales
    Array.from(closeBtns).forEach(btn => {
        btn.onclick = function() {
            formulaModal.style.display = 'none';
            if (calendarModal) calendarModal.style.display = 'none';
        }
    });

    // Cerrar al hacer click fuera del modal
    window.onclick = function(event) {
        if (event.target == formulaModal) {
            formulaModal.style.display = 'none';
        }
        if (calendarModal && event.target == calendarModal) {
            calendarModal.style.display = 'none';
        }
    }

    // Copiar fórmulas
    document.querySelectorAll('.copy-button').forEach(button => {
        button.onclick = function() {
            const formula = this.previousElementSibling;
            navigator.clipboard.writeText(formula.textContent).then(() => {
                const originalText = button.textContent;
                button.textContent = '¡Copiado!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        }
    });
});
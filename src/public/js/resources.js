document.addEventListener('DOMContentLoaded', function() {
    // Obtener los modales
    const formulaModal = document.getElementById('formulaModal');
    const calendarModal = document.getElementById('calendarModal');
    const materialModal = document.getElementById('materialModal');
    
    // Obtener todos los botones de recursos
    document.querySelectorAll('.resource-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const type = this.dataset.type;
            
            // Verificar el tipo de botón y abrir el modal correspondiente
            if (type === 'formula') {
                formulaModal.style.display = 'block';
            } else if (type === 'calendar') {
                calendarModal.style.display = 'block';
            } else if (type === 'material') {
                materialModal.style.display = 'block';
            }
        });
    });

    // Manejar el cierre de los modales
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            formulaModal.style.display = 'none';
            calendarModal.style.display = 'none';
            materialModal.style.display = 'none';
        });
    });

    // Cerrar modales al hacer click fuera
    window.addEventListener('click', function(event) {
        if (event.target === formulaModal || 
            event.target === calendarModal || 
            event.target === materialModal) {
            formulaModal.style.display = 'none';
            calendarModal.style.display = 'none';
            materialModal.style.display = 'none';
        }
    });

    // Manejar la copia de fórmulas
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', function() {
            const formula = this.previousElementSibling.textContent;
            navigator.clipboard.writeText(formula);
            
            // Feedback visual
            const originalText = this.textContent;
            this.textContent = '¡Copiado!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        });
    });

    // Función para previsualizar PDFs
    window.previewPDF = function(pdfUrl) {
        window.open(pdfUrl, '_blank');
    };
});

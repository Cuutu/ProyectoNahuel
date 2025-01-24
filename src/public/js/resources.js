document.addEventListener('DOMContentLoaded', function() {
    console.log('Script de recursos cargado'); // Log para verificar que el script se carga
    
    // Obtener los modales
    const formulaModal = document.getElementById('formulaModal');
    const calendarModal = document.getElementById('calendarModal');
    const materialModal = document.getElementById('materialModal');
    
    // Obtener todos los botones de recursos
    document.querySelectorAll('.resource-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            
            // Verificar el texto del botón y abrir el modal correspondiente
            if (buttonText === 'Ver índices') {
                e.preventDefault();
                formulaModal.style.display = 'block';
            } else if (buttonText === 'Ver calendarios') {
                e.preventDefault();
                calendarModal.style.display = 'block';
            } else if (buttonText === 'Ver material') {
                e.preventDefault();
                showMaterialPopup();
            }
        });
    });

    // Lista de PDFs disponibles
    const pdfList = [
        {
            title: "Estrategias Avanzadas",
            filename: "estrategias-avanzadas.pdf"
        },
        {
            title: "Cómo medir la cartera",
            filename: "Como-medir-la-cartera-1.pdf"
        },
        {
            title: "Cálculo CCL",
            filename: "CALCULO-CCL-1.pdf"
        },
        {
            title: "Gestión de Riesgo",
            filename: "gestion-de-riesgo.pdf"
        }
    ];

    // Función para cerrar el modal
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        console.log('Intentando cerrar modal:', modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Manejador específico para el botón de cierre del modal de material
    const materialModalClose = document.querySelector('#materialModal .close');
    console.log('Botón de cierre del material modal:', materialModalClose);

    if (materialModalClose) {
        materialModalClose.addEventListener('click', function(e) {
            console.log('Click en botón de cierre del material modal');
            e.preventDefault();
            closeModal('materialModal');
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    };

    // Función para mostrar el modal
    window.showMaterialPopup = function() {
        const modal = document.getElementById('materialModal');
        if (modal) {
            console.log('Mostrando modal de material');
            modal.style.display = 'block';
        }
    };

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
    window.openPDFViewer = function(pdfUrl) {
        const fullUrl = window.location.origin + pdfUrl;
        // Abrir directamente en una nueva pestaña
        window.open(fullUrl, '_blank');
    }

    // Cerrar el modal cuando se hace clic en la X
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            this.closest('.modal').style.display = 'none';
        }
    });

    // Agregar funcionalidad para cerrar el modal de material
    document.querySelectorAll('.close').forEach(closeButton => {
        console.log('Botón de cierre encontrado:', closeButton);
        
        closeButton.addEventListener('click', function(e) {
            console.log('Click en botón de cierre detectado');
            
            // Encontrar el modal padre más cercano y ocultarlo
            const modal = this.closest('.modal');
            console.log('Modal encontrado:', modal);
            
            if (modal) {
                modal.style.display = 'none';
                console.log('Modal ocultado');
            }
        });
    });

    // También agregar la funcionalidad de cerrar al hacer clic fuera del modal
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
});

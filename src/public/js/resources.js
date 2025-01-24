document.addEventListener('DOMContentLoaded', function() {
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
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Manejador específico para el botón de cierre del modal de material
    const materialModalClose = document.querySelector('#materialModal .close');

    if (materialModalClose) {
        materialModalClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('materialModal');
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };

    // Funciones para previsualizar y descargar
    window.previsualizar = function(tipo) {
        let pdfUrl;
        switch(tipo) {
            case 'estrategias':
                pdfUrl = '/pdfs/estrategias-avanzadas.pdf';
                break;
            case 'cartera':
                pdfUrl = '/pdfs/Como-medir-la-cartera-1.pdf';
                break;
            case 'ccl':
                pdfUrl = '/pdfs/CALCULO-CCL-1.pdf';
                break;
            case 'riesgo':
                pdfUrl = '/pdfs/gestion-de-riesgo.pdf';
                break;
        }
        if (pdfUrl) {
            openPDFViewer(pdfUrl);
        }
    };

    window.descargar = function(tipo) {
        let pdfUrl;
        switch(tipo) {
            case 'estrategias':
                pdfUrl = '/pdfs/estrategias-avanzadas.pdf';
                break;
            case 'cartera':
                pdfUrl = '/pdfs/Como-medir-la-cartera-1.pdf';
                break;
            case 'ccl':
                pdfUrl = '/pdfs/CALCULO-CCL-1.pdf';
                break;
            case 'riesgo':
                pdfUrl = '/pdfs/gestion-de-riesgo.pdf';
                break;
        }
        if (pdfUrl) {
            window.location.href = pdfUrl;
        }
    };

    // Función para mostrar el modal de material
    window.showMaterialPopup = function() {
        const modal = document.getElementById('materialModal');
        const modalContent = modal.querySelector('.material-modal-content');
        
        // Asegurarse de que el contenido del modal esté presente
        if (!modalContent.querySelector('h2')) {
            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h2>Material Complementario</h2>
                <div class="pdf-grid">
                    <div class="pdf-item">
                        <h3>Estrategias Avanzadas</h3>
                        <div class="button-group">
                            <button class="resource-button" onclick="previsualizar('estrategias')">Previsualizar</button>
                            <button class="resource-button" onclick="descargar('estrategias')">Descargar</button>
                        </div>
                    </div>
                    <div class="pdf-item">
                        <h3>Cómo medir la cartera</h3>
                        <div class="button-group">
                            <button class="resource-button" onclick="previsualizar('cartera')">Previsualizar</button>
                            <button class="resource-button" onclick="descargar('cartera')">Descargar</button>
                        </div>
                    </div>
                    <div class="pdf-item">
                        <h3>Cálculo CCL</h3>
                        <div class="button-group">
                            <button class="resource-button" onclick="previsualizar('ccl')">Previsualizar</button>
                            <button class="resource-button" onclick="descargar('ccl')">Descargar</button>
                        </div>
                    </div>
                    <div class="pdf-item">
                        <h3>Gestión de Riesgo</h3>
                        <div class="button-group">
                            <button class="resource-button" onclick="previsualizar('riesgo')">Previsualizar</button>
                            <button class="resource-button" onclick="descargar('riesgo')">Descargar</button>
                        </div>
                    </div>
                </div>
            `;
        }

        modal.style.display = 'block';

        // Agregar el evento de cierre al nuevo botón
        const closeButton = modalContent.querySelector('.close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                modal.style.display = 'none';
            });
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
        closeButton.addEventListener('click', function(e) {
            // Encontrar el modal padre más cercano y ocultarlo
            const modal = this.closest('.modal');
            
            if (modal) {
                modal.style.display = 'none';
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

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

    // Función para mostrar el popup con los PDFs
    window.showMaterialPopup = function() {
        const modal = document.getElementById('materialModal');
        const modalContent = document.querySelector('.material-modal-content');
        
        let content = `
            <span class="close">&times;</span>
            <h2>Material Complementario</h2>
            <div class="pdf-grid">
        `;
        
        pdfList.forEach(pdf => {
            content += `
                <div class="pdf-item">
                    <h4>${pdf.title}</h4>
                    <div class="button-group">
                        <a href="/pdfs/${pdf.filename}" 
                           class="resource-button preview-btn" 
                           target="_blank">
                            <i class="fas fa-eye"></i> Previsualizar
                        </a>
                        <a href="/pdfs/${pdf.filename}" 
                           class="resource-button download-btn" 
                           download>
                            <i class="fas fa-download"></i> Descargar
                        </a>
                    </div>
                </div>
            `;
        });
        
        content += `</div>`;
        modalContent.innerHTML = content;
        modal.style.display = "block";
        document.body.classList.add('modal-open');
    }

    // Manejar el cierre de los modales
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
            document.body.classList.remove('modal-open');
        });
    });

    // Cerrar modales al hacer click fuera
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            document.body.classList.remove('modal-open');
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

    // Cerrar el modal cuando se hace clic fuera de él
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }

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

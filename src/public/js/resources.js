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
        const fullUrl = window.location.origin + pdfUrl;
        
        // Intentar primero abrir en una nueva pestaña
        const newWindow = window.open(fullUrl, '_blank');
        
        // Si el navegador bloquea la apertura, usar Google Docs Viewer como fallback
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
            window.open(viewerUrl, '_blank');
        }
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
function showMaterialPopup() {
    const modal = document.getElementById('materialModal');
    const modalContent = document.querySelector('.material-modal-content');
    
    // Generar el contenido del modal
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
                    <a href="#" class="resource-button preview-btn" 
                       onclick="previewPDF('/pdfs/${pdf.filename}')">
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
    
    // Cerrar modal
    const closeBtn = modalContent.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = "none";
    
    // Cerrar al hacer clic fuera
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

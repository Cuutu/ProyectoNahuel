document.addEventListener('DOMContentLoaded', function() {
    // Obtener los modales
    const formulaModal = document.getElementById('formulaModal');
    const calendarModal = document.getElementById('calendarModal');
    const materialModal = document.getElementById('materialModal');
    const booksModal = document.getElementById('booksModal');
    
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
                showCalendarModal();
            } else if (buttonText === 'Ver material') {
                e.preventDefault();
                showMaterialPopup();
            } else if (buttonText === 'Ver libros') {
                e.preventDefault();
                showBooksPopup();
            }
        });
    });

    // Lista de PDFs disponibles
    const pdfList = [
        {
            title: "Ratios de conversión BYMA",
            filename: "Ratios-de-Conversion-BYMA-1.pdf"
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
            title: "Ratios de conversión COMAFI",
            filename: "Ratios-de-Conversion-COMAFI-1.pdf"
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
                pdfUrl = '/pdfs/Ratios-de-Conversion-BYMA-1.pdf';
                break;
            case 'cartera':
                pdfUrl = '/pdfs/Como-medir-la-cartera-1.pdf';
                break;
            case 'ccl':
                pdfUrl = '/pdfs/CALCULO-CCL-1.pdf';
                break;
            case 'riesgo':
                pdfUrl = '/pdfs/Ratios-de-Conversion-COMAFI.pdf';
                break;
            case 'libro1':
                pdfUrl = '/pdfs/Analisis-Tecnico-de-los-Mercados-Financieros-John-Murphy.pdf';
                break;
            case 'libro2':
                pdfUrl = '/pdfs/EL-METODO-WYCKOFF-Enrique-Diaz-Valdecantos-PDFDrive-.pdf';
                break;
            case 'libro3':
                pdfUrl = '/pdfs/Libro-Guia-para-invertir-Robert-T-Kiyosaki.pdf';
                break;
            case 'libro4':
                pdfUrl = '/pdfs/Padre-Rico-Padre-Pobre.pdf';
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
                pdfUrl = '/pdfs/Ratios-de-Conversion-BYMA-1.pdf';
                break;
            case 'cartera':
                pdfUrl = '/pdfs/Como-medir-la-cartera-1.pdf';
                break;
            case 'ccl':
                pdfUrl = '/pdfs/CALCULO-CCL-1.pdf';
                break;
            case 'riesgo':
                pdfUrl = '/pdfs/Ratios-de-Conversion-COMAFI.pdf';
                break;
            case 'libro1':
                pdfUrl = '/pdfs/Analisis-Tecnico-de-los-Mercados-Financieros-John-Murphy.pdf';
                break;
            case 'libro2':
                pdfUrl = '/pdfs/EL-METODO-WYCKOFF-Enrique-Diaz-Valdecantos-PDFDrive-.pdf';
                break;
            case 'libro3':
                pdfUrl = '/pdfs/Libro-Guia-para-invertir-Robert-T-Kiyosaki.pdf';
                break;
            case 'libro4':
                pdfUrl = '/pdfs/Padre-Rico-Padre-Pobre.pdf';
                break;
        }
        if (pdfUrl) {
            // Crear un elemento <a> temporal
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = pdfUrl.split('/').pop(); // Obtiene el nombre del archivo
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
                        <h3>Ratios de conversión BYMA</h3>
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
                        <h3>Ratios de conversión COMAFI</h3>
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

    // Función para mostrar el modal de libros recomendados
    window.showBooksPopup = function() {
        const modal = document.getElementById('booksModal');
        const modalContent = modal.querySelector('.material-modal-content');
        
        // Asegurarse de que el contenido del modal esté presente
        if (!modalContent.querySelector('h2')) {
            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h2>Libros Recomendados</h2>
                <div class="pdf-grid">
                    <div class="pdf-item">
                        <h3>Análisis Técnico de los Mercados Financieros</h3>
                        <div class="button-group">
                            <button class="resource-button" onclick="previsualizar('libro1')">Previsualizar</button>
                            <button class="resource-button" onclick="descargar('libro1')">Descargar</button>
                        </div>
                    </div>
                    <div class="pdf-item">
                        <h3>Trading en la Zona</h3>
                        <div class="button-group">
                            <button class="resource-button" onclick="previsualizar('libro2')">Previsualizar</button>
                            <button class="resource-button" onclick="descargar('libro2')">Descargar</button>
                        </div>
                    </div>
                    <div class="pdf-item">
                        <h3>El Inversor Inteligente</h3>
                        <div class="button-group">
                            <button class="resource-button" onclick="previsualizar('libro3')">Previsualizar</button>
                            <button class="resource-button" onclick="descargar('libro3')">Descargar</button>
                        </div>
                    </div>
                    <div class="pdf-item">
                        <h3>Psicología del Trading</h3>
                        <div class="button-group">
                            <button class="resource-button" onclick="previsualizar('libro4')">Previsualizar</button>
                            <button class="resource-button" onclick="descargar('libro4')">Descargar</button>
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

    // Crear el modal de calendarios
    const modalContent = document.querySelector('.material-modal-content');
    const modal = document.getElementById('materialModal');

    function showCalendarModal() {
        if (!modalContent.querySelector('h2')) {
            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h2>Calendarios Económicos</h2>
                <div class="calendar-links">
                    <div class="calendar-item">
                        <h3>Calendario de Inflación USA</h3>
                        <a href="https://www.investing.com/economic-calendar/" target="_blank" class="resource-button">
                            Ver Calendario
                        </a>
                    </div>
                    <div class="calendar-item">
                        <h3>Calendario FED</h3>
                        <a href="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" target="_blank" class="resource-button">
                            Ver Calendario
                        </a>
                    </div>
                    <div class="calendar-item">
                        <h3>Calendario de Balances</h3>
                        <a href="https://www.investing.com/earnings-calendar/" target="_blank" class="resource-button">
                            Ver Calendario
                        </a>
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
    }

    // Agregar el evento al botón de calendarios
    document.querySelector('[data-type="calendars"]').addEventListener('click', function(e) {
        e.preventDefault();
        showCalendarModal();
    });

    // Cerrar el modal si se hace clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

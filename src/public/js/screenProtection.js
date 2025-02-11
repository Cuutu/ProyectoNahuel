import html2canvas from 'html2canvas';

class ScreenProtection {
    constructor() {
        this.init();
    }

    init() {
        // Proteger los elementos con clase update-card
        const protectedElements = document.querySelectorAll('.update-card');
        
        // Configurar html2canvas
        html2canvas.prototype.getContextWindow = () => {
            return null; // Previene la captura del canvas
        };

        // Observar intentos de captura
        protectedElements.forEach(element => {
            // Prevenir captura directa
            element.addEventListener('beforescreenshot', (e) => {
                e.preventDefault();
                this.protectContent(element);
            });

            // Prevenir copiar
            element.addEventListener('copy', (e) => {
                e.preventDefault();
                return false;
            });

            // Prevenir arrastrar
            element.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
        });

        // Detectar cambios de visibilidad
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                protectedElements.forEach(el => this.protectContent(el));
            }
        });
    }

    protectContent(element) {
        // Crear una capa de protección
        const overlay = document.createElement('div');
        overlay.className = 'protection-overlay';
        overlay.innerHTML = `
            <div class="protection-message">
                <i class="fas fa-lock"></i>
                Contenido Protegido
            </div>
        `;

        element.appendChild(overlay);

        // Remover después de un momento
        setTimeout(() => {
            overlay.remove();
        }, 1500);
    }
}

// Inicializar la protección
new ScreenProtection();
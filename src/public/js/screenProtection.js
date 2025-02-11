// Sin usar import/export
class ScreenProtection {
    constructor() {
        this.init();
        this.addProtectionLayer();
    }

    init() {
        // Detectar cambios de visibilidad
        document.addEventListener('visibilitychange', () => {
            const protectedElements = document.querySelectorAll('.update-card');
            if (document.hidden) {
                protectedElements.forEach(el => {
                    el.style.filter = 'blur(20px)';
                });
            } else {
                protectedElements.forEach(el => {
                    el.style.filter = 'none';
                });
            }
        });
    }

    addProtectionLayer() {
        const style = document.createElement('style');
        style.textContent = `
            .update-card {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ScreenProtection();
});
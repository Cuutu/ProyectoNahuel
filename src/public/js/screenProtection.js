// Sin usar import/export
class ScreenProtection {
    constructor() {
        this.init();
    }

    init() {
        // Crear overlay negro
        this.overlay = document.createElement('div');
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #000;
            z-index: 99999;
            display: none;
        `;
        document.body.appendChild(this.overlay);

        // Detectar captura de pantalla usando Screen Capture API
        if (navigator.mediaDevices) {
            const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
            navigator.mediaDevices.getDisplayMedia = async function(constraints) {
                try {
                    document.querySelector('.screen-protection-overlay').style.display = 'block';
                    const stream = await originalGetDisplayMedia.call(this, constraints);
                    
                    stream.getTracks().forEach(track => {
                        track.onended = () => {
                            document.querySelector('.screen-protection-overlay').style.display = 'none';
                        };
                    });
                    
                    return stream;
                } catch (err) {
                    document.querySelector('.screen-protection-overlay').style.display = 'none';
                    throw err;
                }
            };
        }

        // Detectar tecla PrintScreen
        document.addEventListener('keyup', (e) => {
            if (e.key === 'PrintScreen') {
                this.overlay.style.display = 'block';
                setTimeout(() => {
                    this.overlay.style.display = 'none';
                }, 500); // Ocultar después de medio segundo
            }
        });

        // Detectar cambios de visibilidad
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.overlay.style.display = 'block';
            } else {
                this.overlay.style.display = 'none';
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ScreenProtection();
});
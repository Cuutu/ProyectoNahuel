class ScreenProtection {
    constructor() {
        // Detectar si el navegador soporta la API
        this.mediaSupported = 'mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices;
        
        // Estado de la captura de pantalla
        this.isCapturing = false;
    }

    async init() {
        try {
            // Usar Screen Capture API para detectar grabación
            if (this.mediaSupported) {
                const mediaQuery = matchMedia('(display-mode: fullscreen)');
                mediaQuery.addListener(this.handleScreenChange.bind(this));
            }

            // Detectar Picture-in-Picture
            if (document.pictureInPictureEnabled) {
                document.addEventListener('leavepictureinpicture', this.handlePiPChange.bind(this));
            }

            // Detectar visibilidad
            if (document.documentElement.requestFullscreen) {
                document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
            }

            // Detectar captura de pantalla en navegadores modernos
            if ('getDisplayMedia' in navigator.mediaDevices) {
                navigator.mediaDevices.getDisplayMedia = async () => {
                    this.handleScreenCapture();
                    throw new Error('Captura de pantalla no permitida');
                };
            }

        } catch (error) {
            console.warn('Screen Protection API no soportada completamente:', error);
        }
    }

    handleScreenChange(e) {
        if (e.matches) {
            this.protectContent(true);
        } else {
            this.protectContent(false);
        }
    }

    handlePiPChange() {
        this.protectContent(true);
    }

    handleFullscreenChange() {
        if (document.fullscreenElement) {
            this.protectContent(true);
        } else {
            this.protectContent(false);
        }
    }

    handleScreenCapture() {
        this.protectContent(true);
        // Notificar al servidor del intento de captura
        this.notifyServer();
    }

    protectContent(activate) {
        const sensitiveContent = document.querySelectorAll('.update-card');
        sensitiveContent.forEach(element => {
            if (activate) {
                element.classList.add('protected');
                // Opcional: Agregar marca de agua
                this.addWatermark(element);
            } else {
                element.classList.remove('protected');
                this.removeWatermark(element);
            }
        });
    }

    addWatermark(element) {
        const watermark = document.createElement('div');
        watermark.className = 'content-watermark';
        watermark.textContent = `${new Date().toISOString()} - Contenido Protegido`;
        element.appendChild(watermark);
    }

    removeWatermark(element) {
        const watermark = element.querySelector('.content-watermark');
        if (watermark) {
            watermark.remove();
        }
    }

    async notifyServer() {
        try {
            await fetch('/api/security/capture-attempt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    timestamp: new Date(),
                    userId: window.currentUser?.id
                })
            });
        } catch (error) {
            console.warn('Error notificando intento de captura:', error);
        }
    }
}

// Inicializar protección
document.addEventListener('DOMContentLoaded', () => {
    const protection = new ScreenProtection();
    protection.init();
});
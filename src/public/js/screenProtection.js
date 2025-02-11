class ScreenProtectionAPI {
    constructor() {
        this.init();
    }

    init() {
        // Prevenir captura de pantalla usando la API nativa
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
            navigator.mediaDevices.getDisplayMedia = async function(constraints) {
                try {
                    const protectedElements = document.querySelectorAll('.update-card');
                    protectedElements.forEach(el => el.style.visibility = 'hidden');
                    
                    const stream = await originalGetDisplayMedia.call(this, constraints);
                    
                    stream.getTracks().forEach(track => {
                        track.onended = () => {
                            protectedElements.forEach(el => el.style.visibility = 'visible');
                        };
                    });
                    
                    return stream;
                } catch (err) {
                    console.warn('Intento de captura de pantalla bloqueado');
                    protectedElements.forEach(el => el.style.visibility = 'visible');
                    throw err;
                }
            };
        }

        // Detectar modo pantalla completa
        document.addEventListener('fullscreenchange', () => {
            const protectedElements = document.querySelectorAll('.update-card');
            if (document.fullscreenElement) {
                protectedElements.forEach(el => el.style.visibility = 'hidden');
            } else {
                protectedElements.forEach(el => el.style.visibility = 'visible');
            }
        });
    }
}

// Inicializar la protección
new ScreenProtectionAPI();
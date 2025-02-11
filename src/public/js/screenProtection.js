class ScreenProtectionAPI {
    constructor() {
        this.init();
        this.addProtectionLayer();
    }

    init() {
        // Prevenir captura de pantalla usando la API nativa
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
            navigator.mediaDevices.getDisplayMedia = async function(constraints) {
                try {
                    const protectedElements = document.querySelectorAll('.update-card');
                    protectedElements.forEach(el => el.classList.add('protected-content'));
                    
                    const stream = await originalGetDisplayMedia.call(this, constraints);
                    
                    stream.getTracks().forEach(track => {
                        track.onended = () => {
                            protectedElements.forEach(el => el.classList.remove('protected-content'));
                        };
                    });
                    
                    return stream;
                } catch (err) {
                    const protectedElements = document.querySelectorAll('.update-card');
                    protectedElements.forEach(el => el.classList.remove('protected-content'));
                    throw err;
                }
            };
        }

        // Detectar modo pantalla completa
        document.addEventListener('fullscreenchange', () => {
            const protectedElements = document.querySelectorAll('.update-card');
            if (document.fullscreenElement) {
                protectedElements.forEach(el => el.classList.add('protected-content'));
            } else {
                protectedElements.forEach(el => el.classList.remove('protected-content'));
            }
        });
    }

    addProtectionLayer() {
        // Prevenir PrintScreen y otras teclas
        document.addEventListener('keydown', (e) => {
            if (
                e.key === 'PrintScreen' ||
                (e.ctrlKey && e.key === 'p') ||
                (e.ctrlKey && e.shiftKey && e.key === 'i') ||
                (e.ctrlKey && e.key === 's')
            ) {
                e.preventDefault();
                return false;
            }
        });

        // Prevenir clic derecho
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.update-card')) {
                e.preventDefault();
                return false;
            }
        });

        // Observar cambios de visibilidad
        document.addEventListener('visibilitychange', () => {
            const protectedElements = document.querySelectorAll('.update-card');
            if (document.hidden) {
                protectedElements.forEach(el => el.classList.add('protected-content'));
            } else {
                protectedElements.forEach(el => el.classList.remove('protected-content'));
            }
        });
    }
}

// Inicializar la protección
new ScreenProtectionAPI();
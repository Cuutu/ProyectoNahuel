import DisableDevtool from 'disable-devtool';

DisableDevtool({
    disableSelect: true,
    disableCopy: true,
    disableCut: true,
    disableScreenshot: true,
    disablePrint: true,
    clearLog: true,
    disableRightClick: true,
});

class ScreenProtection {
    constructor() {
        this.init();
    }

    init() {
        // Prevenir captura usando la API nativa
        if (document.documentElement.requestFullscreen) {
            document.documentElement.addEventListener('fullscreenchange', () => {
                if (document.fullscreenElement) {
                    this.hideContent();
                } else {
                    this.showContent();
                }
            });
        }

        // Detectar pérdida de foco
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.hideContent();
            } else {
                this.showContent();
            }
        });

        // Prevenir teclas de captura
        document.addEventListener('keydown', (e) => {
            if (
                e.key === 'PrintScreen' ||
                (e.ctrlKey && e.key === 'p') ||
                (e.ctrlKey && e.shiftKey && e.key === 'i') ||
                (e.ctrlKey && e.key === 's')
            ) {
                e.preventDefault();
                this.hideContent();
                return false;
            }
        });
    }

    hideContent() {
        document.querySelectorAll('.update-card').forEach(el => {
            el.style.filter = 'blur(20px)';
            el.style.userSelect = 'none';
        });
    }

    showContent() {
        document.querySelectorAll('.update-card').forEach(el => {
            el.style.filter = 'none';
            el.style.userSelect = 'auto';
        });
    }
}

new ScreenProtection();
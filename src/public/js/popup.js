document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('leadPopup');
    const closeBtn = document.querySelector('.close-popup');
    const leadForm = document.getElementById('leadForm');

    // Mostrar popup inmediatamente al cargar
    if (!localStorage.getItem('popupShown')) {
        showPopup();
    }

    // Cerrar popup
    closeBtn.addEventListener('click', hidePopup);

    // Click fuera del popup
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            hidePopup();
        }
    });

    // Manejar envío del formulario
    leadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                alert('¡Gracias! Revisa tu email para obtener tu guía.');
                hidePopup();
                localStorage.setItem('popupShown', 'true');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error. Por favor intenta nuevamente.');
        }
    });

    function showPopup() {
        popup.style.display = 'flex';
    }

    function hidePopup() {
        popup.style.display = 'none';
    }
}); 
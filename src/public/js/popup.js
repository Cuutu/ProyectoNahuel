document.addEventListener('DOMContentLoaded', function() {
    // Mostrar el popup después de 10 segundos
    setTimeout(() => {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <div class="popup-content">
                <button class="close-popup">&times;</button>
                <h2>¡No te pierdas nada!</h2>
                <p>Recibí códigos de descuento y alertas de lanzamiento!</p>
                <form id="popup-form" class="popup-form">
                    <input type="email" placeholder="Tu email" required>
                    <button type="submit" class="submit-btn">Suscribirme</button>
                </form>
            </div>
        `;

        document.body.appendChild(popup);
        
        // Mostrar el popup con una animación suave
        setTimeout(() => {
            popup.classList.add('show');
        }, 100);

        // Manejar envío del formulario
        const form = popup.querySelector('#popup-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;

            try {
                const response = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();
                
                if (data.success) {
                    popup.classList.remove('show');
                    setTimeout(() => {
                        popup.remove();
                        
                        // Mostrar popup de agradecimiento
                        const thankYouPopup = document.createElement('div');
                        thankYouPopup.className = 'popup';
                        thankYouPopup.innerHTML = `
                            <div class="popup-content thank-you">
                                <button class="close-popup">&times;</button>
                                <h2>¡Gracias por suscribirte!</h2>
                                <p>Revisa tu correo!</p>
                                <p>Te hemos enviado un curso gratuito en PDF</p>
                            </div>
                        `;
                        
                        document.body.appendChild(thankYouPopup);
                        
                        setTimeout(() => {
                            thankYouPopup.classList.add('show');
                        }, 100);

                        // Cerrar popup de agradecimiento
                        const closeThankYou = thankYouPopup.querySelector('.close-popup');
                        closeThankYou.addEventListener('click', () => {
                            thankYouPopup.classList.remove('show');
                            setTimeout(() => {
                                thankYouPopup.remove();
                            }, 300);
                        });

                        // Cerrar automáticamente después de 3 segundos
                        setTimeout(() => {
                            thankYouPopup.classList.remove('show');
                            setTimeout(() => {
                                thankYouPopup.remove();
                            }, 300);
                        }, 3000);
                    }, 300);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error. Por favor intenta nuevamente.');
            }
        });

        // Cerrar popup con el botón X
        const closeBtn = popup.querySelector('.close-popup');
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 300);
        });
    }, 10000);
}); 
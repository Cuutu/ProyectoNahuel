// Función para iniciar el proceso de pago
function initPayment(serviceType = 'signals', options = {}) {
    // Mostrar un mensaje de carga
    showLoadingMessage();
    
    // Configurar los datos del servicio según el tipo
    let paymentData = {
        serviceType: serviceType
    };
    
    // Agregar opciones adicionales si se proporcionan
    if (options.price) paymentData.price = options.price;
    if (options.title) paymentData.title = options.title;
    
    // Enviar solicitud al servidor para crear una preferencia de pago
    fetch('/api/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al crear la orden de pago');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            showErrorMessage(data.message || 'Error al procesar el pago');
            return;
        }
        
        // Redirigir a la página de pago de MercadoPago
        window.location.href = data.init_point;
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.');
    });
}

// Función para mostrar mensaje de carga
function showLoadingMessage() {
    // Verificar si ya existe un mensaje
    if (document.getElementById('payment-message')) {
        return;
    }
    
    const messageContainer = document.createElement('div');
    messageContainer.id = 'payment-message';
    messageContainer.className = 'payment-message loading';
    messageContainer.innerHTML = `
        <div class="message-content">
            <div class="spinner"></div>
            <p>Procesando tu solicitud...</p>
        </div>
    `;
    
    document.body.appendChild(messageContainer);
}

// Función para mostrar mensaje de error
function showErrorMessage(message) {
    // Eliminar mensaje de carga si existe
    const loadingMessage = document.getElementById('payment-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
    
    const messageContainer = document.createElement('div');
    messageContainer.id = 'payment-message';
    messageContainer.className = 'payment-message error';
    messageContainer.innerHTML = `
        <div class="message-content">
            <div class="error-icon">❌</div>
            <p>${message}</p>
            <button onclick="closeMessage()">Cerrar</button>
        </div>
    `;
    
    document.body.appendChild(messageContainer);
}

// Función para cerrar el mensaje
function closeMessage() {
    const messageContainer = document.getElementById('payment-message');
    if (messageContainer) {
        messageContainer.remove();
    }
}

// Agregar estilos para los mensajes
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .payment-message {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .message-content {
            background-color: white;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid #00ff88;
            width: 40px;
            height: 40px;
            margin: 0 auto 1rem;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #ff3333;
        }
        
        .payment-message button {
            background: #00ff88;
            color: #1a1a2e;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }
        
        .payment-message button:hover {
            background: #00cc6a;
        }
    `;
    
    document.head.appendChild(style);
}); 
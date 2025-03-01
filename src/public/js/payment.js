function initPayment() {
    fetch('/payment/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = data.init_point;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al procesar el pago');
    });
} 
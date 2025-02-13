document.addEventListener('DOMContentLoaded', function() {
    // Primero verificamos que estemos en la página correcta
    const bookingCalendar = document.getElementById('booking-calendar');
    const confirmBtn = document.getElementById('confirm-booking');
    
    if (!bookingCalendar || !confirmBtn) {
        console.log('No estamos en la página de reservas');
        return; // Si no estamos en la página de reservas, salimos
    }

    let calendar;
    try {
        calendar = flatpickr("#booking-calendar", {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            minDate: "today",
            locale: "es",
            minTime: "09:00",
            maxTime: "18:00",
            disable: [
                function(date) {
                    return (date.getDay() === 0 || date.getDay() === 6);
                }
            ],
            onChange: function(selectedDates) {
                const selectedDatetimeDiv = document.getElementById('selected-datetime');
                if (!selectedDatetimeDiv) return;

                if (selectedDates.length > 0) {
                    const formattedDate = selectedDates[0].toLocaleString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    selectedDatetimeDiv.textContent = `Fecha seleccionada: ${formattedDate}`;
                    confirmBtn.disabled = false;
                } else {
                    selectedDatetimeDiv.textContent = '';
                    confirmBtn.disabled = true;
                }
            }
        });
    } catch (error) {
        console.error('Error inicializando el calendario:', error);
        return;
    }

    // Función para cargar las próximas clases
    function loadUpcomingClasses() {
        fetch('/api/v1/classes')
            .then(response => response.json())
            .then(data => {
                const upcomingClassesDiv = document.getElementById('upcoming-classes');
                upcomingClassesDiv.innerHTML = data.classes
                    .map(clase => `
                        <div class="class-item">
                            <p>Fecha: ${new Date(clase.date).toLocaleString()}</p>
                        </div>
                    `).join('');
            })
            .catch(error => console.error('Error cargando clases:', error));
    }

    // Cargar clases al iniciar
    loadUpcomingClasses();

    // Agregar el event listener al botón
    confirmBtn.addEventListener('click', async function() {
        try {
            const selectedDate = calendar.selectedDates[0];
            
            if (!selectedDate) {
                alert('Por favor selecciona una fecha y hora');
                return;
            }

            const response = await fetch('/api/mentoring/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: selectedDate.toISOString()
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('¡Reserva confirmada exitosamente!');
                // Opcional: redirigir a una página de confirmación
                window.location.href = '/booking/success';
            } else {
                throw new Error(data.error || 'Error al procesar la reserva');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al procesar tu reserva. Por favor intenta nuevamente.');
        }
    });
}); 
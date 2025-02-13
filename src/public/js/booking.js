document.addEventListener('DOMContentLoaded', function() {
    // Forzar la configuración en español
    const spanishConfig = {
        weekdays: {
            shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        },
        months: {
            shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        },
        firstDayOfWeek: 1,
        time_24hr: true
    };

    // Aplicar la configuración en español globalmente
    flatpickr.localize(spanishConfig);

    const calendar = flatpickr("#booking-calendar", {
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
            const confirmBtn = document.getElementById('confirm-booking');
            const selectedDatetimeDiv = document.getElementById('selected-datetime');
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
    const confirmBtn = document.getElementById('confirm-booking');
    confirmBtn.addEventListener('click', async function() {
        const selectedDate = calendar.selectedDates[0];
        
        if (!selectedDate) {
            alert('Por favor selecciona una fecha y hora');
            return;
        }

        try {
            const response = await fetch('/api/mentoring/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    date: selectedDate.toISOString(),
                    duration: '1 hora',
                    price: 99.99
                })
            });

            if (!response.ok) {
                throw new Error('Error al procesar la reserva');
            }

            const result = await response.json();
            if (result.success) {
                alert('Reserva confirmada exitosamente');
                window.location.href = '/dashboard';
            } else {
                throw new Error(result.error || 'Error al procesar la reserva');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la reserva: ' + error.message);
        }
    });
}); 
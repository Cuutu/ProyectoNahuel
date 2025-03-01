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
            minuteIncrement: 60,
            onMonthChange: function(selectedDates, dateStr) {
                loadBookedSlots();
            },
            onYearChange: function(selectedDates, dateStr) {
                loadBookedSlots();
            },
            onOpen: function(selectedDates, dateStr) {
                loadBookedSlots();
            },
            onChange: function(selectedDates, dateStr) {
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

    // Función para cargar horarios ocupados
    async function loadBookedSlots() {
        try {
            const response = await fetch('/api/booked-slots', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const bookedSlots = await response.json();
            
            // Actualizar los horarios deshabilitados en el calendario
            calendar.set('disable', [
                function(date) {
                    // Deshabilitar fines de semana
                    if (date.getDay() === 0 || date.getDay() === 6) return true;
                    
                    // Deshabilitar horarios ya reservados
                    return bookedSlots.some(slot => {
                        const bookedDate = new Date(slot.datetime);
                        return date.getTime() === bookedDate.getTime();
                    });
                }
            ]);
        } catch (error) {
            console.error('Error cargando horarios ocupados:', error);
        }
    }

    // Manejar la reserva del turno
    confirmBtn.addEventListener('click', async function() {
        const selectedDate = calendar.selectedDates[0];
        if (!selectedDate) return;

        try {
            const response = await fetch('/api/book-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    datetime: selectedDate.toISOString()
                })
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Turno reservado exitosamente');
                // Recargar horarios ocupados
                await loadBookedSlots();
            } else {
                alert('Error al reservar el turno: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la reserva');
        }
    });

    // Cargar horarios ocupados al iniciar
    loadBookedSlots();
}); 
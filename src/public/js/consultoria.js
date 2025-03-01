document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado');

    let bookedSlots = [];

    // Función para cargar turnos ocupados
    async function loadBookedSlots() {
        try {
            const timeMin = new Date().toISOString();
            const timeMax = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString();
            
            const response = await fetch(`/api/bookings/slots?timeMin=${timeMin}&timeMax=${timeMax}`);
            bookedSlots = await response.json();
            
            // Actualizar el calendario con las fechas ocupadas
            calendario.set('disable', [
                function(date) {
                    // Deshabilitar fines de semana
                    if (date.getDay() === 0 || date.getDay() === 6) return true;
                    
                    // Deshabilitar horarios ya reservados
                    return bookedSlots.some(slot => {
                        const slotStart = new Date(slot.start);
                        const slotEnd = new Date(slot.end);
                        return date >= slotStart && date < slotEnd;
                    });
                }
            ]);
        } catch (error) {
            console.error('Error al cargar turnos ocupados:', error);
        }
    }

    // Configuración del calendario
    const calendario = flatpickr("#calendario-turno", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        maxDate: new Date().fp_incr(30),
        minTime: "09:00",
        maxTime: "18:00",
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
            },
            months: {
                shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            }
        },
        onChange: function(selectedDates, dateStr) {
            const fechaSeleccionada = document.getElementById('fecha-seleccionada');
            if (fechaSeleccionada && selectedDates.length > 0) {
                const fecha = selectedDates[0];
                fechaSeleccionada.textContent = fecha.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        },
        onOpen: loadBookedSlots
    });

    // Manejar el envío del formulario usando delegación de eventos
    document.addEventListener('submit', function(e) {
        // Verificar si el evento viene del formulario de reserva
        if (e.target && e.target.matches('#form-reserva')) {
            e.preventDefault();
            console.log('Formulario enviado');

            const fechaSeleccionada = calendario.selectedDates[0];
            if (!fechaSeleccionada) {
                alert('Por favor, selecciona una fecha y hora para tu consultoría');
                return;
            }

            const formData = {
                fecha: fechaSeleccionada.toISOString(),
                nombre: e.target.nombre.value,
                email: e.target.email.value,
                telefono: e.target.telefono.value
            };

            console.log('Datos del formulario:', formData);

            // Enviar la reserva al servidor
            fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);
                if (data.success) {
                    alert('¡Reserva confirmada exitosamente!');
                    e.target.reset();
                    calendario.clear();
                    const fechaSeleccionada = document.getElementById('fecha-seleccionada');
                    if (fechaSeleccionada) {
                        fechaSeleccionada.textContent = 'Selecciona una fecha en el calendario';
                    }
                } else {
                    alert(data.message || 'Error al procesar la reserva');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al procesar la reserva');
            });
        }
    });

    // Debug para verificar que los elementos existen
    console.log('Formulario encontrado:', !!document.getElementById('form-reserva'));
    console.log('Botón encontrado:', !!document.getElementById('btn-confirmar'));
});
document.addEventListener('DOMContentLoaded', function() {
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
            if (selectedDates.length > 0) {
                const fecha = selectedDates[0];
                const dia = fecha.getDate();
                const mes = fecha.toLocaleString('es-ES', { month: 'long' });
                const año = fecha.getFullYear();
                const hora = fecha.getHours().toString().padStart(2, '0');
                const minutos = fecha.getMinutes().toString().padStart(2, '0');
                
                fechaSeleccionada.textContent = `${dia} de ${mes} de ${año} a las ${hora}:${minutos}`;
            } else {
                fechaSeleccionada.textContent = 'Selecciona una fecha en el calendario';
            }
        },
        onOpen: loadBookedSlots
    });

    // Manejar el envío del formulario
    const formPago = document.getElementById('form-pago');
    formPago.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const fechaSeleccionada = calendario.selectedDates[0];
        if (!fechaSeleccionada) {
            alert('Por favor, selecciona una fecha y hora para tu consultoría');
            return;
        }

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fecha: fechaSeleccionada.toISOString(),
                    nombre: this.nombre.value,
                    email: this.email.value,
                    telefono: this.telefono.value
                })
            });

            const data = await response.json();
            
            if (data.success) {
                alert('Reserva confirmada exitosamente');
                // Recargar los turnos ocupados
                await loadBookedSlots();
                // Limpiar el formulario
                this.reset();
                calendario.clear();
            } else {
                alert('Error al procesar la reserva. Por favor, intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la reserva. Por favor, intenta nuevamente.');
        }
    });
}); 
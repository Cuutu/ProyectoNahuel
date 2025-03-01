document.addEventListener('DOMContentLoaded', function() {
    // Configuración del calendario
    const calendario = flatpickr("#calendario-turno", {
        enableTime: true,
        dateFormat: "d/m/Y H:i",
        minDate: "today",
        maxDate: new Date().fp_incr(30), // Permite reservar hasta 30 días adelante
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
        disable: [
            function(date) {
                // Deshabilitar fines de semana
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ],
        onChange: function(selectedDates, dateStr) {
            // Actualizar el resumen del turno
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
        }
    });

    // Manejar el envío del formulario
    const formPago = document.getElementById('form-pago');
    formPago.addEventListener('submit', function(e) {
        e.preventDefault();
        const fechaSeleccionada = calendario.selectedDates[0];
        if (!fechaSeleccionada) {
            alert('Por favor, selecciona una fecha y hora para tu consultoría');
            return;
        }
        // Aquí puedes agregar la lógica para procesar el pago y la reserva
        console.log('Fecha seleccionada:', fechaSeleccionada);
        console.log('Datos del formulario:', {
            nombre: this.nombre.value,
            email: this.email.value,
            telefono: this.telefono.value
        });
    });
}); 
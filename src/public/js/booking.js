document.addEventListener('DOMContentLoaded', function() {
    // Configurar Flatpickr en español globalmente
    flatpickr.localize(flatpickr.l10ns.es);

    const calendar = flatpickr("#schedule-calendar", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        inline: true,
        time_24hr: true,
        minuteIncrement: 30,
        minTime: "09:00",
        maxTime: "18:00",
        disable: [
            function(date) {
                // Deshabilitar sábados y domingos (0 es domingo, 6 es sábado)
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ],
        monthSelectorType: "static",
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
            },
            months: {
                shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            },
            rangeSeparator: ' a ',
            time_24hr: true
        }
    });

    // Manejador para el botón de agendar
    document.getElementById('schedule-class').addEventListener('click', function() {
        const selectedDate = calendar.selectedDates[0];
        if (!selectedDate) {
            alert('Por favor selecciona una fecha y hora para la clase');
            return;
        }
        alert(`Clase agendada para: ${selectedDate.toLocaleString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`);
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
}); 
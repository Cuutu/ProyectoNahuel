document.addEventListener('DOMContentLoaded', function() {
    // Configuración básica de Flatpickr
    flatpickr("#schedule-calendar", {
        enableTime: true,
        noCalendar: false,
        dateFormat: "d 'de' F",
        time_24hr: true,
        minDate: "today",
        theme: "dark",
        locale: "es",
        minuteIncrement: 30,
        defaultHour: 12,
        position: "auto",
        inline: true, // Esto hace que el calendario esté siempre visible
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'],
                longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
            },
            months: {
                shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            }
        },
        onChange: function(selectedDates, dateStr) {
            document.getElementById('selected-datetime').innerHTML = 
                `<p>Fecha seleccionada: ${dateStr}</p>`;
        }
    });

    // Manejador para el botón de agendar
    document.getElementById('schedule-class').addEventListener('click', function() {
        const selectedDate = document.getElementById('schedule-calendar').value;
        if (!selectedDate) {
            alert('Por favor selecciona una fecha y hora');
            return;
        }

        alert(`Clase agendada para: ${selectedDate}`);
        // Aquí puedes agregar la lógica para guardar la fecha
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
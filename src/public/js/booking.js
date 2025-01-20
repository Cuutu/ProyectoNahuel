document.addEventListener('DOMContentLoaded', function() {
    const calendar = flatpickr("#schedule-calendar", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        inline: true,
        locale: "es",
        time_24hr: true,
        minuteIncrement: 30,
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
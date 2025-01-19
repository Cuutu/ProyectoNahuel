document.addEventListener('DOMContentLoaded', function() {
    // Configuración de Flatpickr (calendario)
    const calendar = flatpickr("#schedule-calendar", {
        enableTime: true,
        minTime: "09:00",
        maxTime: "18:00",
        dateFormat: "Y-m-d H:i",
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
            document.getElementById('selected-datetime').innerHTML = 
                `<p>Fecha seleccionada: ${dateStr}</p>`;
        }
    });

    // Manejador para agendar clase
    document.getElementById('schedule-class').addEventListener('click', function() {
        const selectedDate = calendar.selectedDates[0];
        if (!selectedDate) {
            alert('Por favor selecciona una fecha y hora para la clase');
            return;
        }

        // Enviar la fecha seleccionada al servidor
        fetch('/api/v1/classes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: selectedDate
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('¡Clase agendada con éxito!');
                loadUpcomingClasses(); // Recargar las clases programadas
            } else {
                alert('Error al agendar la clase: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al agendar la clase');
        });
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
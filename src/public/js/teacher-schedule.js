document.addEventListener('DOMContentLoaded', function() {
    const isTeacher = document.getElementById('teacher-calendar').hasAttribute('readonly') === false;
    
    // Configuración de Flatpickr para visualización/edición
    const teacherCalendar = flatpickr("#teacher-calendar", {
        enableTime: true,
        minTime: "09:00",
        maxTime: "18:00",
        minDate: "today",
        dateFormat: "Y-m-d H:i",
        inline: true, // Mostrar calendario siempre visible
        disable: [
            function(date) {
                // Deshabilitar fines de semana
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ],
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
            if (isTeacher) {
                document.getElementById('selected-class-datetime').innerHTML = 
                    `<p>Fecha de clase programada: ${dateStr}</p>`;
            }
        },
        clickOpens: isTeacher, // Solo permite abrir el selector si es profesor
        allowInput: false // Deshabilita la entrada manual
    });

    // Si es profesor, agregar la funcionalidad de programación
    if (isTeacher && document.getElementById('schedule-class')) {
        document.getElementById('schedule-class').addEventListener('click', function() {
            const selectedDate = teacherCalendar.selectedDates[0];
            if (!selectedDate) {
                alert('Por favor selecciona una fecha y hora para la clase');
                return;
            }

            // Actualizar la ruta de la API
            fetch('/api/v1/classes', {  // Asegúrate que esta ruta coincida con tu backend
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
                // Manejar la respuesta
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al programar la clase');
            });
        });
    }

    // Cargar clases programadas (para todos los usuarios)
    fetch('/api/classes')
        .then(response => response.json())
        .then(classes => {
            const scheduledDates = classes.map(classDate => ({
                from: classDate.startTime,
                to: classDate.endTime
            }));
            teacherCalendar.set('enable', scheduledDates);
        })
        .catch(error => console.error('Error cargando clases: ', error));
}); 
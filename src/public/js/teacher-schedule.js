document.addEventListener('DOMContentLoaded', function() {
    // Configuración de Flatpickr para profesores
    const teacherCalendar = flatpickr("#teacher-calendar", {
        enableTime: true,
        minTime: "09:00",
        maxTime: "18:00",
        minDate: "today",
        dateFormat: "Y-m-d H:i",
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
            document.getElementById('selected-class-datetime').innerHTML = 
                `<p>Fecha de clase programada: ${dateStr}</p>`;
        }
    });

    // Manejar la programación de clases
    document.getElementById('schedule-class').addEventListener('click', function() {
        const selectedDate = teacherCalendar.selectedDates[0];
        if (!selectedDate) {
            alert('Por favor selecciona una fecha y hora para la clase');
            return;
        }

        // Crear evento en Google Calendar
        gapi.load('client:auth2', () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            }).then(() => {
                return gapi.auth2.getAuthInstance().signIn();
            }).then(() => {
                const event = {
                    'summary': 'Clase de Análisis Técnico',
                    'location': 'Online',
                    'description': 'Clase del curso de Análisis Técnico',
                    'start': {
                        'dateTime': selectedDate.toISOString(),
                        'timeZone': 'America/Argentina/Buenos_Aires'
                    },
                    'end': {
                        'dateTime': new Date(selectedDate.getTime() + 120*60000).toISOString(),
                        'timeZone': 'America/Argentina/Buenos_Aires'
                    }
                };

                return gapi.client.calendar.events.insert({
                    'calendarId': 'primary',
                    'resource': event,
                    'sendNotifications': true
                });
            }).then(response => {
                alert('¡Clase programada exitosamente!');
                // Aquí puedes agregar la lógica para notificar a los estudiantes
            }).catch(error => {
                console.error('Error:', error);
                alert('Error al programar la clase. Por favor intenta nuevamente.');
            });
        });
    });
}); 
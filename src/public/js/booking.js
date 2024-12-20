document.addEventListener('DOMContentLoaded', function() {
    // Configuración de Flatpickr (calendario)
    const calendar = flatpickr("#booking-calendar", {
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
            document.getElementById('selected-datetime').innerHTML = 
                `<p>Fecha seleccionada: ${dateStr}</p>`;
        }
    });

    // Configuración de Google Calendar API
    const CLIENT_ID = 'TU_CLIENT_ID';
    const API_KEY = 'TU_API_KEY';
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar.events";

    document.getElementById('confirm-booking').addEventListener('click', function() {
        const selectedDate = calendar.selectedDates[0];
        if (!selectedDate) {
            alert('Por favor selecciona una fecha y hora');
            return;
        }

        // Inicializar Google Calendar API
        gapi.load('client:auth2', () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            }).then(() => {
                // Autenticar usuario
                return gapi.auth2.getAuthInstance().signIn();
            }).then(() => {
                // Crear evento en el calendario
                const event = {
                    'summary': 'Mentoría de Trading',
                    'location': 'Online',
                    'description': 'Sesión de mentoría personalizada',
                    'start': {
                        'dateTime': selectedDate.toISOString(),
                        'timeZone': 'America/Argentina/Buenos_Aires'
                    },
                    'end': {
                        'dateTime': new Date(selectedDate.getTime() + 60*60000).toISOString(),
                        'timeZone': 'America/Argentina/Buenos_Aires'
                    }
                };

                return gapi.client.calendar.events.insert({
                    'calendarId': 'primary',
                    'resource': event
                });
            }).then(response => {
                alert('¡Reserva confirmada! Se ha agregado el evento a tu calendario.');
            }).catch(error => {
                console.error('Error:', error);
                alert('Error al procesar la reserva. Por favor intenta nuevamente.');
            });
        });
    });
}); 
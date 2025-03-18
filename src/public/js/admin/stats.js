document.addEventListener('DOMContentLoaded', function() {
    // Funciones para manejar las estadísticas
    window.editStat = async function(id, category) {
        try {
            // Obtener los datos actuales de la estadística
            const statRow = document.querySelector(`[data-stat-id="${id}"]`);
            const value = statRow.querySelector('.stat-value').textContent;
            const text = statRow.querySelector('.stat-description').textContent;

            // Mostrar modal o prompt para editar
            const newValue = prompt('Nuevo valor:', value);
            const newText = prompt('Nuevo texto:', text);

            if (newValue && newText) {
                const response = await fetch('/admin/stats/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id,
                        value: newValue,
                        text: newText,
                        category
                    })
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Error al actualizar la estadística');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al editar la estadística');
        }
    };

    window.toggleVisibility = async function(id, currentVisible, category) {
        try {
            const response = await fetch('/admin/stats/toggle-visibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id,
                    visible: !currentVisible,
                    category
                })
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error al cambiar la visibilidad');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cambiar la visibilidad');
        }
    };

    window.deleteStat = async function(id, category) {
        if (confirm('¿Estás seguro de que quieres eliminar esta estadística?')) {
            try {
                const response = await fetch('/admin/stats/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id,
                        category
                    })
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Error al eliminar la estadística');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar la estadística');
            }
        }
    };
}); 
async function updateMentoringStatus(mentoringId, newStatus) {
    try {
        const response = await fetch(`/api/mentoring/${mentoringId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el estado');
        }

        // Recargar la página para mostrar los cambios
        window.location.reload();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar el estado de la mentoría');
    }
}

// Código para el modal de edición de membresías
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando modal de membresías');
    
    // Obtener el modal
    const modal = document.getElementById("editMembresiaModal");
    if (!modal) {
        console.error('Modal no encontrado en el DOM');
        return;
    }
    
    const span = document.getElementsByClassName("close")[0];
    const form = document.getElementById("editMembresiaForm");
    
    if (!form) {
        console.error('Formulario no encontrado en el DOM');
        return;
    }
    
    // Cerrar el modal al hacer clic en la X
    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }
    
    // Cerrar el modal al hacer clic fuera de él
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    // Función para abrir el modal y configurar el formulario
    window.editarMembresia = function(userId) {
        console.log('Editando membresía para usuario:', userId);
        
        if (!userId) {
            console.error('ID de usuario no proporcionado');
            return;
        }
        
        // Actualizar la acción del formulario con el ID del usuario
        form.action = `/admin/users/${userId}/update-membership`;
        
        // Abrir el modal
        modal.style.display = "block";
    }
    
    // Manejar el envío del formulario
    form.addEventListener('submit', function(event) {
        const alertas = document.getElementById('alertas').value;
        const entrenamientos = document.getElementById('entrenamientos').value;
        const asesoramiento = document.getElementById('asesoramiento').value;
        const duracionMeses = document.getElementById('duracionMeses').value;
        
        console.log('Enviando formulario:', {
            alertas,
            entrenamientos,
            asesoramiento,
            duracionMeses
        });
    });
}); 
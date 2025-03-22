function toggleEditMode() {
    const viewMode = document.getElementById('viewMode');
    const editMode = document.getElementById('editMode');
    const isEditing = viewMode.style.display === 'none';

    viewMode.style.display = isEditing ? 'block' : 'none';
    editMode.style.display = isEditing ? 'none' : 'block';
}

async function updateProfile(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Actualizar la vista
            document.getElementById('nombreView').textContent = data.nombre;
            document.getElementById('telefonoView').textContent = data.telefono;
            
            // Volver al modo vista
            toggleEditMode();
            
            // Mostrar mensaje de éxito
            showNotification('Perfil actualizado correctamente', 'success');
        } else {
            throw new Error('Error al actualizar el perfil');
        }
    } catch (error) {
        showNotification('Error al actualizar el perfil', 'error');
    }
}

function showNotification(message, type) {
    // Implementar sistema de notificaciones
    alert(message);
} 
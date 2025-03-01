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
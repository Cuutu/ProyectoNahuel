document.addEventListener('DOMContentLoaded', function() {
    // Búsqueda de usuarios
    const searchInput = document.getElementById('searchUser');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.users-table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Manejo de acciones
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const userId = this.dataset.id;
            const action = this.classList.contains('edit') ? 'edit' : 'delete';

            if (action === 'delete') {
                if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                    try {
                        const response = await fetch(`/admin/users/${userId}`, {
                            method: 'DELETE'
                        });

                        if (response.ok) {
                            this.closest('tr').remove();
                        } else {
                            alert('Error al eliminar el usuario');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Error al eliminar el usuario');
                    }
                }
            } else {
                // Implementar lógica de edición
                console.log('Editar usuario:', userId);
            }
        });
    });
}); 
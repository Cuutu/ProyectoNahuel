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

    // Modal de suscripción
    const modal = document.getElementById('subscriptionModal');
    const form = document.getElementById('subscriptionForm');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.querySelector('.cancel');

    // Abrir modal al hacer clic en el botón de suscripción
    document.querySelectorAll('.action-btn.subscription').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.dataset.id;
            document.getElementById('userId').value = userId;
            form.action = `/admin/users/${userId}/update-membership`;
            modal.style.display = 'block';
        });
    });

    // Cerrar modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Manejo de acciones
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            if (this.classList.contains('subscription')) {
                return; // Ya manejado arriba
            }

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
// Funciones para manejar el modal
function showAddStatForm() {
    const modal = document.getElementById('statModal');
    const form = document.getElementById('statForm');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = 'Agregar Nueva Estadística';
    form.reset();
    form.setAttribute('data-mode', 'add');
    modal.style.display = 'block';
}

function editStat(id, value, label, visible) {
    const modal = document.getElementById('statModal');
    const form = document.getElementById('statForm');
    const modalTitle = document.getElementById('modalTitle');
    
    document.getElementById('statId').value = id;
    document.getElementById('statValue').value = value;
    document.getElementById('statLabel').value = label;
    document.getElementById('statVisible').checked = visible;
    
    modalTitle.textContent = 'Editar Estadística';
    form.setAttribute('data-mode', 'edit');
    modal.style.display = 'block';
}

// Manejadores de eventos
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('statModal');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('statForm');

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    form.onsubmit = async function(e) {
        e.preventDefault();
        const mode = form.getAttribute('data-mode');
        const formData = {
            value: document.getElementById('statValue').value,
            label: document.getElementById('statLabel').value,
            visible: document.getElementById('statVisible').checked
        };

        if (mode === 'edit') {
            formData.id = document.getElementById('statId').value;
        }

        try {
            const response = await fetch(`/admin/smart-money-stats/${mode === 'edit' ? 'update' : 'create'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error al guardar la estadística');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar la estadística');
        }
    }
});

async function toggleStatVisibility(id, currentVisible) {
    try {
        const response = await fetch('/admin/smart-money-stats/toggle-visibility', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, visible: !currentVisible })
        });

        if (response.ok) {
            window.location.reload();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cambiar la visibilidad');
    }
}

async function deleteStat(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta estadística?')) {
        try {
            const response = await fetch(`/admin/smart-money-stats/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar la estadística');
        }
    }
} 
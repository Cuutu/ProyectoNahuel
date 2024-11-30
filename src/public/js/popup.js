document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.getElementById('popupOverlay').style.display = 'flex';
    }, 5000);

    document.querySelector('.close-popup').addEventListener('click', function() {
        document.getElementById('popupOverlay').style.display = 'none';
    });

    document.getElementById('popupOverlay').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
}); 
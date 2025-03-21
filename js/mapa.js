var map = L.map('map').setView([39.4662031, -0.3745618], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marcadorRestaurante = L.marker([39.4662031, -0.3745618]).addTo(map)
    .bindPopup('La Trattoria Valenciana<br>Carrer de Colón 25, Valencia')
    .openPopup();

function calculateRoute() {
    if (!navigator.geolocation) {
        alert('Tu navegador no soporta geolocalización.');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            var latUsuario = position.coords.latitude;
            var lonUsuario = position.coords.longitude;

            if (map.routingControl) {
                map.removeControl(map.routingControl);
            }

            map.routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(latUsuario, lonUsuario),
                    L.latLng(39.4662031, -0.3745618)
                ],
                routeWhileDragging: true,
                show: true,
                addWaypoints: false,
                createMarker: function() { return null; },
                lineOptions: {
                    styles: [{ color: '#a31818', weight: 4 }]
                },
                showAlternatives: false,
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                })
            }).addTo(map);
        },
        error => {
            alert('No se pudo obtener tu ubicación. Asegúrate de permitir el acceso.');
            console.error('Error de geolocalización:', error);
        },
        { timeout: 10000, enableHighAccuracy: true }
    );
}

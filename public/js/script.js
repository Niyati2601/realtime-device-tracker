const socket = io();

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit('sendLocation', {latitude, longitude});
    }, (error)=> {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    });
}

const map = L.map("map").setView([0,0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

const markers =  {};

socket.on('receiveLocation', function(data) {
    const {latitude, longitude, id} = data;
    map.setView([latitude, longitude], 16) // this will set current position view where i am in map
    if(!markers[id]) {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    } else {
        markers[id].setLatLng([latitude, longitude]);
    }
});

socket.on("disconnect", (id)=> {
    if(markers[id]) {
        map.removeLayer(markers[id])
        delete markers[id];
    }
})

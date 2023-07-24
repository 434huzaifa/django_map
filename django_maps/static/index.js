var map = L.map("map");
map.setView([51.505, -0.09], 13); //setView([long,lat],Zoom)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
navigator.geolocation.watchPosition(success, error);
let marker,circle,zoomed;
function success(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const accuracy = pos.coords.accuracy;

  console.log(lat, " ", lng, " ", accuracy);
  if(marker){
    map.removeLayer(marker);
    map.removeLayer(circle);
  }
  marker = L.marker([lat, lng],{
    title:'User Position',
  })
  .bindPopup("<button onclick='clickme()'>User</button>")
  .addTo(map);
  circle = L.circle([lat, lng], { radius: accuracy }).addTo(map);
  if (!zoomed) {
    zoomed=map.fitBounds(circle.getBounds());
  }
  
}
function error(err) {
  //handel errorr
  console.log(err);
}

function clickme(){
  console.log('hi')
}

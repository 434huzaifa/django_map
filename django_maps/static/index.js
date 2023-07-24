var map = L.map("map");
map.setView([51.505, -0.09], 13); //setView([long,lat],Zoom)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
navigator.geolocation.watchPosition(success, error);
let marker, circle, zoomed;
function success(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const accuracy = pos.coords.accuracy;

  console.log(lat, " ", lng, " ", accuracy);
  f = "<form>";
  // f+='{% csrf_token %}';
  f +=
    '<input type="text" name="name" id="name" required placeholder="name"><br>';
  f +=
    '<input type="text" name="lng" id="lng" value="' +
    lat +
    '" required placeholder="Longitude"><br>';
  f +=
    '<input type="text" name="lat" id="lat" value="' +
    lng +
    '" required placeholder="Latitude"><br>';
  f +=
    '<input type="text" name="accuracy" id="accuracy" value="' +
    accuracy +
    '" required placeholder="Accuracy">';
  f +='<button onclick="savedata()">Save</button>';
    // '<input id="button" type="submit" onlcick="savedata()" value="Save"><br>';
  f += "</form>";
  if (marker) {
    map.removeLayer(marker);
    map.removeLayer(circle);
  }
  marker = L.marker([lat, lng], {
    title: "User Position",
  })
    .bindPopup(f)
    .addTo(map);
  circle = L.circle([lat, lng], { radius: accuracy }).addTo(map);
  map.fitBounds(circle.getBounds());
  // if (!zoomed) {
  //   zoomed=map.fitBounds(circle.getBounds());
  // }
}
function error(err) {
  //handel errorr
  console.log(err);
}

function savedata() {
  function handleSubmit(event, type) {
    event.preventDefault();

    const data = new FormData(event.target);

    const value = Object.fromEntries(data.entries());
    var deta = JSON.stringify(value);
    
    deta = JSON.parse(deta);
    var baseURL = "/api/save-location/";
    $.post(baseURL, deta, function (data, status) {
      console.log(data, status);
    });
  }
  const form = document.querySelector("form");
  form.addEventListener("submit", handleSubmit);
}

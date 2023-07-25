var map = L.map("map");
map.setView([51.505, -0.09], 13); //setView([long,lat],Zoom)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  noWrap: true,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
navigator.geolocation.watchPosition(success, error);
let marker,
  circle,
  zoomed,
  locationSocket,
  other_user_marker,
  other_user_circle,
  client = false;
let lat=-999,lng=-999,accuracy=-999;
function success(pos) {
  if (lat!=pos.coords.latitude) {
    if (lng != pos.coords.longitude) {
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      accuracy = pos.coords.accuracy;
    }
  }
  if (client) {
    locationSocket.send(
      JSON.stringify({
        'lat': lat,
        'lng': lng,
        'accuracy': accuracy,
      })
    );
  }

  markermaker(lat, lng, accuracy);
}
function isclient() {
  client = !client;
}

function markermaker(lat, lng, accuracy) {
  f = "<form>";
  // f+='{% csrf_token %}';
  f +=
    '<input type="text" name="name" id="name" required placeholder="name"><br>';
  f +=
    '<input type="number" name="lng" id="lng" value="' +
    lng +
    '" required placeholder="Longitude"><br>';
  f +=
    '<input type="number" name="lat" id="lat" value="' +
    lat +
    '" required placeholder="Latitude"><br>';
  f +=
    '<input type="number" name="accuracy" id="accuracy" value="' +
    accuracy +
    '" required placeholder="Accuracy"><br>';
  f += '<button onclick="savedata()">Save</button>';
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
  // map.fitBounds(circle.getBounds());
  if (!zoomed) {
    zoomed=map.fitBounds(circle.getBounds());
  }
}
function error(err) {
  if (err == 1) {
    alert("Grant Location permission");
  } else {
    alert("Something Wrong or you are changing location from developer tool");
  }
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
      if (status == "success") {
        // alert('Location Saved');
        locationSocket.send(
          JSON.stringify({
            'lat': 'data_added',
            'lng': 'lng',
            'accuracy': 'accuracy',
          })
        );
        getdata();
      }
    });
  }
  const form = document.querySelector("form");
  form.addEventListener("submit", handleSubmit);
}

function getdata() {
  const save_icon = L.icon({
    iconUrl: save_location,
    iconSize: [30, 30], // size of the icon
    iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -45], // point from which the popup should open relative to the iconAnchor
  });
  var baseURL = "/api/get-location/";
  $.get(baseURL, function (data, status) {
    // console.log(data, status);
    output = "";
    if (status == "success") {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        output += "<tr id=" + element["id"] + ">";
        output += "<td class='name'>" + element["name"] + "</td>";
        output += "<td class='lng'>" + element["lng"] + "</td>";
        output += "<td class='lat'>" + element["lat"] + "</td>";
        output += "<td class='accuracy' >" + element["accuracy"] + "</td>";
        output +=
          "<td><button onclick='showinthemap(" +
          element["id"] +
          ")'>Show</button></td>";
        output += "</tr>";
        L.marker([element["lat"], element["lng"]], {
          title: element["name"],
          icon: save_icon,
        })
          .bindPopup(
            "<h6>Name:&nbsp" +
              element["name"] +
              "</h6><h6>Longitude:&nbsp" +
              element["lng"] +
              "</h6><h6>Latitude:&nbsp" +
              element["lat"] +
              "</h6><h6>Accuracy:&nbsp" +
              element["accuracy"] +
              "</h6>"
          )
          .addTo(map);
        L.circle([element["lat"], element["lng"]], {
          radius: element["accuracy"],
        }).addTo(map);
      }
    }
    $(".row").html(output);
  });
}
$(document).ready(getdata(), ws());
function showinthemap(id) {
  let element = document.getElementById(id);

  let lat = element.getElementsByClassName("lat")[0].innerHTML;
  let lng = element.getElementsByClassName("lng")[0].innerHTML;
  let accuracy = element.getElementsByClassName("accuracy")[0].innerHTML;
  map.setView([lat, lng], 15);
}

function onMapClick(e) {
  markermaker(e.latlng.lat, e.latlng.lng, 10);
}

map.on("click", onMapClick);

function ws(params) {
  let url = `ws://${window.location.host}/ws/socket-server/`;
  locationSocket = new WebSocket(url);
  locationSocket.onmessage = function (e) {
    let data = JSON.parse(e.data);
    console.log(data, "locationSocket");
    // markermaker(data['lat'],data['lng'],data['accuracy'])
    const user_icon = L.icon({
      iconUrl: user_locaion,
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -45], // point from which the popup should open relative to the iconAnchor
    });
    if (data["lat"] == "data_added") {
      getdata();
    } else {
      lat = data["lat"];
      lng = data["lng"];
      accuracy = data["accuracy"];

      if (!client) {
        if (other_user_marker) {
          map.removeLayer(other_user_marker);
          map.removeLayer(other_user_circle);
        }
        other_user_marker = L.marker([lat, lng], {
          title: data["name"],
        })
          .bindPopup(f)
          .addTo(map);
        other_user_circle = L.circle([lat, lng], { radius: accuracy }).addTo(
          map
        );
        // map.fitBounds(circle.getBounds());
      }
    }
  };
}

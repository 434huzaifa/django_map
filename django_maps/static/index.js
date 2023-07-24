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
    lng +
    '" required placeholder="Longitude"><br>';
  f +=
    '<input type="text" name="lat" id="lat" value="' +
    lat +
    '" required placeholder="Latitude"><br>';
  f +=
    '<input type="text" name="accuracy" id="accuracy" value="' +
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
  map.fitBounds(circle.getBounds());
  // if (!zoomed) {
  //   zoomed=map.fitBounds(circle.getBounds());
  // }
}
function error(err) {
if (err==1) {
  alert('Grant Location permission')
}else{
  alert('Something Wrong or you are changing location from developer tool')
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
      if (status=='success') {
        // alert('Location Saved');
        getdata();
      }
    });
  }
  const form = document.querySelector("form");
  form.addEventListener("submit", handleSubmit);
}


function getdata() {
  var baseURL = "/api/get-location/";
  $.get(baseURL, function (data, status) {
    // console.log(data, status);
    output = "";
    if (status == "success") {

      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        output += "<tr id="+element["id"]+">";
        output += "<td class='name'>" + element["name"] + "</td>";
        output += "<td class='lng'>" + element["lng"] + "</td>";
        output += "<td class='lat'>" + element["lat"] + "</td>";
        output += "<td class='accuracy' >" + element["accuracy"] + "</td>";
        output += "<td><button onclick='showinthemap("+element["id"]+")'>Show</button></td>";
        output += "</tr>";
        L.marker([element["lat"], element["lng"]], {
          title: element["name"],
        }).bindPopup(
          "<h6>Name:&nbsp" +
            element["name"] +
            "</h6><h6>Longitude:&nbsp" +
            element["lng"] +
            "</h6><h6>Latitude:&nbsp" +
            element["lat"] +
            "</h6><h6>Accuracy:&nbsp" +
            element["accuracy"] +
            "</h6>"
        ).addTo(map);
        L.circle([element["lat"], element["lng"]], { radius: element["accuracy"] }).addTo(map);
      }
    }
    $(".row").html(output)
  });
}
$(document).ready(getdata());
function showinthemap(id){
  let element=document.getElementById(id);
 
  let lat=element.getElementsByClassName('lat')[0].innerHTML;
  let lng=element.getElementsByClassName('lng')[0].innerHTML;
  let accuracy=element.getElementsByClassName('accuracy')[0].innerHTML;
  console.log(lat, " ", lng, " ", accuracy);
  console.log(lat)
  map.setView([lat, lng], 15);

}
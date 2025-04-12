let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 18.9437984, lng: 76.5282043 },
    zoom: 6,
  });

  const locationButton = document.createElement("button");

  locationButton.textContent = "Around Me";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map.setCenter(pos);
          map.setZoom(16);
        }
      );
    } else {
      // Browser doesn't support Geolocation
    }
  });
}

window.initMap = initMap;

$(window).on('load', function () {
  // sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
  const sheetId = "1FTkdNlwxdFYtVdlfQ532O-I0naBiEzFJ9lKoI95rwRA";
  // sheetName is the name of the TAB in your spreadsheet (default is "Sheet1")
  const sheetName = encodeURIComponent("Sheet1");
  const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
  $.ajax({
    type: "GET",
    url: sheetURL,
    dataType: "text",
    success: function (response) {
      const positionData = $.csv.toObjects(response);
      console.log(positionData);
      const image = {
          url: "./markerIcon.png",
          scaledSize: new google.maps.Size(30, 30)
      };
      
      var marker;
      var infowindow = new google.maps.InfoWindow();
      for (let i = 0; i < positionData.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng({
            lat: parseFloat(positionData[i].lat),
            lng: parseFloat(positionData[i].lng)
          }),
          map: map,
          icon: image
        });
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
          var boxText = document.createElement("p");
          boxText.innerHTML = `<p class="hook">
          <div>${positionData[i].name || "Hospital Name Not Mentioned"}</div>
          <div>Survey conducted by: ${positionData[i].conducted_by || "No Name"}</div>
          <div>Survey conducted on: ${positionData[i].conducted_on || "No Time"}</div>
          <div>Address: ${positionData[i].address || "Private address"}</div>
          </p>`;
          return function () {
            infowindow.setContent(boxText);
            infowindow.open(map, marker);
          }
        })(marker, i));
      }
      marker.setMap(map);
    },
  });
});


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
      alert("Geolocation is not supported by your browser.");
    }
  });
}

window.initMap = initMap;

$(window).on("load", function () {
  const sheetId = "1FTkdNlwxdFYtVdlfQ532O-I0naBiEzFJ9lKoI95rwRA";
  const sheetName = encodeURIComponent("Sheet1");
  const sheetURL = https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName};

  $.ajax({
    type: "GET",
    url: sheetURL,
    dataType: "text",
    success: function (response) {
      const positionData = $.csv.toObjects(response);

      const image = (pending, ccaMissing) => {
        if (ccaMissing) {
          return {
            url: ${ctx}/static/img/blue.png,
            scaledSize: new google.maps.Size(30, 30),
          };
        }
        return {
          url: pending
            ? ${ctx}/static/img/pendingIcon.png
            : ${ctx}/static/img/markerIcon.png,
          scaledSize: new google.maps.Size(30, 30),
        };
      };

      const infowindow = new google.maps.InfoWindow();

      positionData.forEach((pos, i) => {
        const isPending = !pos.conducted;
        const isCCAMissing = pos.CCA;

        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(pos.lat),
            lng: parseFloat(pos.lng),
          },
          map: map,
          icon: image(isPending, isCCAMissing),
        });

        google.maps.event.addListener(marker, "click", () => {
          const html = pos.conducted
            ? `<p class="hook">
                 <h3>${pos.name || "Hospital Name Not Mentioned"}</h3>
                 <div><b>Survey conducted by:</b> ${pos.conducted || "IBWG"}</div>
                 <div><b>Survey conducted on:</b> ${pos.conducted_on || "No Time"}</div>
                 <div><b>HCF TYPE:</b> ${pos.hcftype || "No Type"}</div>
                 <div><b>Address:</b> ${pos.address || "Private address"}</div>
               </p>`
            : `<p class="hook">
                 <h3>${pos.name || "Hospital Name Not Mentioned"}</h3>
                 <div><b>Address:</b> ${pos.address || "Private address"}</div>
                 <h4>Register HCF</h4>
               </p>`;

          infowindow.setContent(html);
          infowindow.open(map, marker);
        });
      });
    },
  });
});

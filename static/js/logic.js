let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

function markerSize(mag) {
  if (mag < 0) mag = mag * -1;
  return Math.sqrt(mag) * 30000;
}

function setColor(depth) {
  if (depth > -10 && depth <= 10) {
    return "#ccff33";
  } else if (depth > 10 && depth < 30) {
    return "#ffff33";
  } else if (depth > 30 && depth < 50) {
    return "#ffcc33";
  } else if (depth > 50 && depth < 70) {
    return "#ff9933";
  } else if (depth > 70 && depth < 90) {
    return "#ff6633";
  } else {
    return "#ff3333";
  }
}

function makeMap(data) {
  data.forEach((ele) => {
    L.circle([ele.geometry.coordinates[1], ele.geometry.coordinates[0]], {
      fillOpacity: 1,
      color: "black",
      fillColor: setColor(ele.geometry.coordinates[2]),
      // Setting our circle's radius to equal the output of our markerSize() function:
      // This will make our marker's size proportionate to its population.
      radius: markerSize(ele.properties.mag),
    })
      .bindPopup(
        `<h1>${ele.properties.place}</h1> <hr> <h3>Magnitude: ${
          ele.properties.mag
        }<br>Depth: ${ele.geometry.coordinates[2]} <br> Date: ${new Date(
          ele.properties.time
        )}</h3>`
      )
      .addTo(myMap);
  });
}

function addLegend() {
  // Add legend to the map
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let depth = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    let color = [
      "#ccff33",
      "#ffff33",
      "#ffcc33",
      "#ff9933",
      "#ff6633",
      "#ff3333",
    ];

    let label = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    depth.forEach((ele, i) => {
      label.push(
        `<span style="display:flex; flex-direction:row;"><i style="background:${color[i]}; width:20px; height:20px;"></i>&nbsp;<span>${ele}</span><br></span>`
      );
    });
    div.innerHTML += `<div style="background:white; width:auto; padding:10px">${label.join(
      ""
    )}</div>`;
    return div;
  };
  legend.addTo(myMap);
}

let url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (data) {
  makeMap(data.features);
  addLegend();
});

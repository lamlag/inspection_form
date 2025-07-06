function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        document.getElementById("latitude").value = pos.coords.latitude;
        document.getElementById("longitude").value = pos.coords.longitude;
      },
      function (error) {
        alert("Error fetching location: " + error.message);
      }
    );
  } else {
    alert("Geolocation not supported");
  }
}

// Optional: Auto-set date & time
window.onload = function () {
  const now = new Date();
  document.getElementById("date").value = now.toISOString().split("T")[0];
  document.getElementById("time").value = now
    .toTimeString()
    .split(" ")[0]
    .substring(0, 5);
};

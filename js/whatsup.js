function sendToWhatsapp() {
  let number = "+2782896515";

  let name = document.getElementById("name").value;
  let address = document.getElementById("address").value;
  let notes = document.getElementById("notes").value;
  let photo = document.getElementById("photo").value;
  let latitude = document.getElementById("latitude").value;
  let longitude = document.getElementById("longitude").value;
  var url =
    "https://wa.me/" +
    number +
    "?text=" +
    "Name : " +
    name +
    "%0a" +
    "Address : " +
    address +
    "%0a" +
    "Notes : " +
    notes +
    "latitude : " +
    latitude +
    "longitude : " +
    longitude +
    "%0a%0a" + &"image=" + photo;

  window.open(url, "_blank").focus();
}

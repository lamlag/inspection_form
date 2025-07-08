// Set default date to current date/time
document.addEventListener("DOMContentLoaded", function () {
  // Set current date/time
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 16);
  document.getElementById("date").value = formattedDate;

  // Handle "Other" option display
  const otherRadio = document.getElementById("optionOther");
  const optionARadio = document.getElementById("optionA");
  const otherComment = document.getElementById("otherComment");

  otherRadio.addEventListener("change", function () {
    if (this.checked) {
      otherComment.style.display = "block";
    } else {
      otherComment.style.display = "none";
    }
  });

  optionARadio.addEventListener("change", function () {
    if (!this.checked) {
      otherComment.style.display = "block";
    } else {
      otherComment.style.display = "none";
    }
  });

  // Handle file input display names
  const photoInput = document.getElementById("photo");
  const documentInput = document.getElementById("document");
  const photoName = document.getElementById("photoName");
  const documentName = document.getElementById("documentName");

  photoInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      photoName.textContent = this.files[0].name;
      photoName.style.display = "block";
    } else {
      photoName.style.display = "none";
    }
  });

  documentInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      documentName.textContent = this.files[0].name;
      documentName.style.display = "block";
    } else {
      documentName.style.display = "none";
    }
  });

  // Handle geolocation
  const getLocationBtn = document.getElementById("getLocationBtn");
  const geoResult = document.getElementById("geoResult");
  const latitudeInput = document.getElementById("latitude");
  const longitudeInput = document.getElementById("longitude");

  getLocationBtn.addEventListener("click", function () {
    if (navigator.geolocation) {
      // Show loading state
      geoResult.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Getting location...';
      geoResult.style.display = "block";

      navigator.geolocation.getCurrentPosition(
        function (position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          latitudeInput.value = lat;
          longitudeInput.value = lng;

          // Get approximate address using reverse geocoding
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          )
            .then((response) => response.json())
            .then((data) => {
              const address = data.display_name || "Address not available";
              geoResult.innerHTML = `<strong><i class="fas fa-check-circle"></i> Location captured:</strong> ${address}`;
              geoResult.style.display = "block";

              // Fill physical location field if empty
              if (!document.getElementById("physicalLocation").value) {
                document.getElementById("physicalLocation").value = address;
              }
            })
            .catch((error) => {
              geoResult.innerHTML = `<strong><i class="fas fa-map-marker-alt"></i> Coordinates:</strong> Latitude: ${lat.toFixed(
                6
              )}, Longitude: ${lng.toFixed(6)}`;
              geoResult.style.display = "block";
            });
        },
        function (error) {
          let errorMessage = "Error getting location: ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "The request to get user location timed out.";
              break;
            case error.UNKNOWN_ERROR:
              errorMessage += "An unknown error occurred.";
              break;
          }
          geoResult.innerHTML = `<strong><i class="fas fa-exclamation-triangle"></i> ${errorMessage}</strong>`;
          geoResult.style.display = "block";
        }
      );
    } else {
      geoResult.innerHTML =
        "<strong><i class='fas fa-exclamation-triangle'></i> Geolocation is not supported by this browser.</strong>";
      geoResult.style.display = "block";
    }
  });

 

  // Form validation and submission
  const form = document.getElementById("contactForm");
  const spinner = document.getElementById("spinner");
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset previous errors
    document.querySelectorAll(".error-message").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(".form-control").forEach((el) => {
      el.classList.remove("error");
    });

    let isValid = true;

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "phone",
      "date",
      "physicalLocation",
      "idnumber",
    ];

    requiredFields.forEach((field) => {
      const input = document.getElementById(field);
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add("error");
        document.getElementById(`${field}Error`).style.display = "block";
      }
    });

    // Validate phone number format
    const phoneInput = document.getElementById("phone");
    const phoneRegex = /^\d{10}$/;
    if (phoneInput.value && !phoneRegex.test(phoneInput.value)) {
      isValid = false;
      phoneInput.classList.add("error");
      document.getElementById("phoneError").style.display = "block";
    }

    // Validate RSA ID number format
    const idnumberInput = document.getElementById("idnumber");
    const idnumberRegex = /^\d{13}$/;
    if (idnumberInput.value && !idnumberRegex.test(idnumberInput.value)) {
      isValid = false;
      idnumberInput.classList.add("error");
      document.getElementById("idnumberError").style.display = "block";
    }

    // Validate  province category selection
    const categorySelect = document.getElementById("category");
    if (!categorySelect.value) {
      isValid = false;
      categorySelect.classList.add("error");
      document.getElementById("categoryError").style.display = "block";
    }

    // Validate service type selection
    const serviceTypeSelected = document.querySelector(
      'input[name="serviceType"]:checked'
    );
    if (!serviceTypeSelected) {
      isValid = false;
      document.getElementById("serviceTypeError").style.display = "block";
    }

    // If form is valid, prepare WhatsApp message
    if (isValid) {
      // Show spinner and hide submit icon
      spinner.style.display = "inline-block";
      document.querySelector(".btn-submit i").style.display = "none";
      document.querySelector(".btn-submit").disabled = true;

      // Show success message
      successMessage.style.display = "block";

      // Simulate processing time
      setTimeout(prepareWhatsAppMessage, 1500);
    }
  });
});

//Function just to get co-ordinates in case geocoding fails
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

function prepareWhatsAppMessage() {
  // Collect form data
  const formData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    phone: document.getElementById("phone").value,
    idNumber: document.getElementById("idnumber").value,
    date: document.getElementById("date").value,
    physicalLocation: document.getElementById("physicalLocation").value,
    category: document.getElementById("category").value,
    serviceType: document.querySelector('input[name="serviceType"]:checked')
      .value,
    otherComment: document.getElementById("optionOther").checked
      ? document.getElementById("otherText").value
      : "",
    latitude: document.getElementById("latitude").value,
    longitude: document.getElementById("longitude").value,
    attachedPhoto: document.getElementById("photo").value,
    attachedDoc: document.getElementById("document").value,
  };

  // Create WhatsApp message
  let sphoto = formData.attachedPhoto;
  let sdocument= formData.attachedDoc;
  let message = `*New Form Submission*%0A%0A`;
  message += `*First Name:* ${formData.firstName}%0A`;
  message += `*Last Name:* ${formData.lastName}%0A`;
  message += `*Id Number:* ${formData.idNumber}%0A`;
  message += `*Phone:* ${formData.phone}%0A`;
  message += `*Date:* ${formData.date.replace("T", " ")}%0A`;
  message += `*Physical Location:* ${formData.physicalLocation}%0A`;
  message += `*Province:* ${formData.category}%0A`;
  message += `*NHBRC Builder?:* ${formData.serviceType}`;

  if (formData.otherComment) {
    message += ` (${formData.otherComment})`;
  }

  if (formData.latitude && formData.longitude) {
    message += `%0A*Coordinates:* ${formData.latitude}, ${formData.longitude}`;
    message += `%0A*Map Link:* https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`;
  }

  // Add note about files
  const photoFile = document.getElementById("photo").files[0];
  const documentFile = document.getElementById("document").files[0];

  if (photoFile || documentFile) {
    message += `%0A%0A*Files Attached:*%0A`;
    if (photoFile) message += `- Photo: ${photoFile.name}%0A`;
    if (documentFile) message += `- Document: ${documentFile.name}`;

    message += `%0A%0APlease note: Files cannot be sent directly via WhatsApp link. They will need to be shared separately.`;
  }

  // WhatsApp number - replace with your actual number (without +, spaces or dashes)
  const whatsappNumber = "+27646945160";

  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}&file=${photoFile}&file=${sphoto}`;

  // Open WhatsApp in a new tab
  setTimeout(() => {
    window.open(whatsappUrl, "_blank");

    // Reset form state
    document.getElementById("spinner").style.display = "none";
    document.querySelector(".btn-submit i").style.display = "inline-block";
    document.querySelector(".btn-submit").disabled = false;
    document.getElementById("successMessage").style.display = "none";
  }, 2000);
}

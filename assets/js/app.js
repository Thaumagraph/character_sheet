document.addEventListener("DOMContentLoaded", function () {
  // Function to save data to local storage
  function save_to_local_storage(element) {
    const id = element.id;
    const value = element.value;
    localStorage.setItem(id, value);
  }

  // Function to save file data to local storage and update image source
  function save_file_to_local_storage(element) {
    const file = element.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const id = element.id;
        localStorage.setItem(id, event.target.result);
        update_image_src("character_portrait_img", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // Function to update the src attribute of the img tag
  function update_image_src(id, data) {
    const img_element = document.querySelector(`img#${id}`);
    if (img_element) {
      img_element.src = data;
    }
  }

  // Function to load data from local storage and set it to the input fields
  function load_from_local_storage() {
    const inputs = document.querySelectorAll(
      "input[type='text'], input[type='number']"
    );
    inputs.forEach((input) => {
      const saved_value = localStorage.getItem(input.id);
      if (saved_value !== null) {
        input.value = saved_value;
      }
    });

    // Load the saved file data if it exists
    const file_input = document.getElementById("character_portrait_input");
    const saved_file_data = localStorage.getItem(file_input.id);
    if (saved_file_data) {
      update_image_src("character_portrait_img", saved_file_data);
    }
  }

  // Attach the save function to all text and number input fields
  const text_inputs = document.querySelectorAll(
    "input[type='text'], input[type='number']"
  );
  text_inputs.forEach((input) => {
    input.addEventListener("change", function () {
      save_to_local_storage(this);
    });
  });

  // Attach the save function to the file input field
  const file_input = document.getElementById("character_portrait_input");
  file_input.addEventListener("change", function () {
    save_file_to_local_storage(this);
  });

  // Load any saved data from local storage on page load
  load_from_local_storage();
});

// Function to resize the image
function resize_image(file, max_width, max_height, callback) {
  var img = new Image();
  img.onload = function () {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var width = img.width;
    var height = img.height;

    // Calculate new dimensions while maintaining aspect ratio
    if (width > height) {
      if (width > max_width) {
        height *= max_width / width;
        width = max_width;
      }
    } else {
      if (height > max_height) {
        width *= max_height / height;
        height = max_height;
      }
    }

    // Set canvas dimensions to resized image dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw image onto canvas
    ctx.drawImage(img, 0, 0, width, height);

    // Get data URL of resized image
    var resized_data_url = canvas.toDataURL("image/jpeg"); // You can change the format here

    // Pass the resized data URL to the callback function
    callback(resized_data_url);
  };
  img.src = URL.createObjectURL(file);
}

// Event listener for file input change to resize and update image preview
var file_input = document.getElementById("character_portrait_input");
file_input.addEventListener("change", function (event) {
  var file = event.target.files[0];
  resize_image(file, 800, 600, function (resized_data_url) {
    var img_preview = document.getElementById("character_portrait_img");
    img_preview.src = resized_data_url;
  });
});

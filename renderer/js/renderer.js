/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
// console.log(os.homeDir());

const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const fileName = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");
const previewImage = document.querySelector("#preview");

const loadImage = (e) => {
  const file = e.target.files[0];
  if (!makeSureFileIsImage(file)) {
    alertError("Fail. Please select an image in gif, jpeg, png formats. ");
    return;
  }

  //original dimensions
  const image = new Image();
  image.src = URL.createObjectURL(file);
  // console.dir(image);
  image.onload = () => {
    widthInput.value = image.width;
    heightInput.value = image.height;
    previewImage.src = URL.createObjectURL(file);
    previewImage.classList.remove("hidden");
  };

  form.style.display = "block";
  fileName.innerText = file.name;

  outputPath.innerText = path.join(os.homeDir(), "imageresizer");
  console.log("success");
};

const alertError = (message) => {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: { background: "red", color: "white", textAlign: "center" },
  });
};

const alertSuccess = (message) => {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: { background: "green", color: "white", textAlign: "center" },
  });
};

const sendImage = (e) => {
  e.preventDefault();
  const width = widthInput.value;
  const height = heightInput.value;
  const imagePath = img.files[0].path;

  if (!img.files[0]) {
    alertError("There is no image, pleas upload");
    return;
  }
  if ((width === "") | (height === "")) {
    alertError("Image size is entered incorrectly");
    return;
  }

  // send to main using ipcRenderer
  ipcRenderer.send("image:resize", { imagePath, width, height });
};

ipcRenderer.on("image:done", () =>
  alertSuccess(
    `The image was resized. (${widthInput.value}x${heightInput.value})`
  )
);

const makeSureFileIsImage = (file) => {
  const acceptedImages = ["image/gif", "image/jpeg", "image/png"];
  return file && acceptedImages.includes(file["type"]);
};

img.addEventListener("change", loadImage);
form.addEventListener("submit", sendImage);

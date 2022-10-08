/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
// console.log(os.homeDir());
console.log(versions.electron());

const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const fileName = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");

const loadImage = (e) => {
  const file = e.target.files[0];
  if (!makeSureFileIsImage(file)) {
    console.log("fail");
    return;
  }

  //original dimentions
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = () => {
    widthInput.value = this.width;
    heightInput.value = this.width;
  };

  form.style.display = "block";
  fileName.innerText = file.name;
  console.log(path.join());
  // outputPath.innerText = path.join(os.homeDir(), "imageresizer");
  console.log("success");
};

const makeSureFileIsImage = (file) => {
  const acceptedImages = ["image/gif", "image/jpeg", "image/png"];
  return file && acceptedImages.includes(file["type"]);
};

img.addEventListener("change", loadImage);

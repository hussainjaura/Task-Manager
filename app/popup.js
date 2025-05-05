// this function is used globally for popup
export function showPopup(message, isSuccess = false) {
  // to remove any existing popup
  const existingPopup = document.querySelector(".popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  // popup DOM setup
  const popup = document.createElement("div");
  // using ternary operator if isSuccess then succes class otherwise none
  popup.className = `popup${isSuccess ? " success" : ""}`;
  popup.textContent = message;

  // append to body of DOM
  document.body.appendChild(popup);

  // display the popup after 10 milisecond this is a css trick otherwise browser wont have time to recognise our show class
  setTimeout(() => popup.classList.add("show"), 10);

  // this will remove popup after 3 seconds
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 3000);
}

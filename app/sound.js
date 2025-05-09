// Preload audio objects only once
const preloadedSounds = {
  add: new Audio("/sounds/add.mp3"),
  delete: new Audio("/sounds/delete.mp3"),
  complete: new Audio("/sounds/complete.mp3"),
};

// Set volume and preload
Object.values(preloadedSounds).forEach((audio) => {
  audio.volume = 0.4;
  audio.load(); // Ensures it's ready to play
});

// Play sound by type
export function playSound(soundType) {
  const audio = preloadedSounds[soundType];
  if (audio) {
    audio.currentTime = 0; // Rewind to start
    audio.play().catch((error) => console.log("Error playing sound:", error));
  }
}

// // this is a function to play the sound based on a action type add, delete, complete
// export function playSound(soundType) {
//   const sounds = {
//     // play theses sounds when a specific thing happens
//     add: "/sounds/add.mp3",
//     delete: "/sounds/delete.mp3",
//     complete: "/sounds/complete.mp3",
//   };

//   // new audio object with appropriate sound type
//   const audio = new Audio(sounds[soundType]);
//   audio.volume = 0.4; // Set volume to 50%
//   audio.play().catch((error) => console.log("Error playing sound:", error));
// }

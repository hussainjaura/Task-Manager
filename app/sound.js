// preload audio objects only once
// // this is a function to play the sound based on a action type add, delete, complete
const preloadedSounds = {
  // play theses sounds when a specific thing happens
  add: new Audio("/sounds/add.mp3"),
  delete: new Audio("/sounds/delete.mp3"),
  complete: new Audio("/sounds/complete.mp3"),
};

// set volume and preload
Object.values(preloadedSounds).forEach((audio) => {
  // set volume to 50%
  audio.volume = 0.4;
  // ensures it's ready to play
  audio.load();
});

// play sound by type
export function playSound(soundType) {
  // new audio object with appropriate sound type
  const audio = preloadedSounds[soundType];
  if (audio) {
    audio.currentTime = 0; // Rewind to start
    audio.play().catch((error) => console.log("Error playing sound:", error));
  }
}

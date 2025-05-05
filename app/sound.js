// this is a function to play the sound based on a action type add, delete, complete
export function playSound(soundType) {
  const sounds = {
    // play theses sounds when a specific thing happens
    add: "/sounds/add.mp3",
    delete: "/sounds/delete.mp3",
    complete: "/sounds/complete.mp3",
  };

  // new audio object with appropriate sound type
  const audio = new Audio(sounds[soundType]);
  audio.volume = 0.4; // Set volume to 50%
  audio.play().catch((error) => console.log("Error playing sound:", error));
}

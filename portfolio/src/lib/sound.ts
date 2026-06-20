export const playClick = () => {
  const audio = new Audio("/sounds/click.mp3");

  audio.volume = 0.15;

  audio.play().catch(() => {});
};
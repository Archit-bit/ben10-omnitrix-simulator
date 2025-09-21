import { Howl } from "howler";

const sounds = {
  dialRotate: new Howl({
    src: ["/sfx/dial-rotate.mp3"],
    volume: 0.5,
  }),
  confirmSelection: new Howl({
    src: ["/sfx/confirm.mp3"],
    volume: 0.6,
  }),
  transform: new Howl({
    src: ["/sfx/transform.mp3"],
    volume: 0.8,
  }),
  detransform: new Howl({
    src: ["/sfx/detransform.mp3"],
    volume: 0.7,
  }),
  cooldownStart: new Howl({
    src: ["/sfx/cooldown-start.mp3"],
    volume: 0.4,
  }),
  cooldownComplete: new Howl({
    src: ["/sfx/cooldown-complete.mp3"],
    volume: 0.5,
  }),
};

export const playSound = (soundKey: keyof typeof sounds) => {
  sounds[soundKey]?.play();
};

export default sounds;

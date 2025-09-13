import { Howl } from 'howler';

const sounds: Record<string, Howl> = {
  parchment: new Howl({ src: ['/sounds/parchment.mp3'], volume: 0.5 }),
  coins: new Howl({ src: ['/sounds/coins.mp3'], volume: 0.5 }),
  fire: new Howl({ src: ['/sounds/fire.mp3'], loop: true, volume: 0.3 }),
};

export function playSound(name:string){
  const s = sounds[name];
  if(s){
    s.play();
  }
}

export function stopSound(name:string){
  const s = sounds[name];
  if(s){
    s.stop();
  }
}

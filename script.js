const orbits = [...document.querySelectorAll(".orbit,.moon-orbit")];
const earthOrbit = document.querySelector(".earth-orbit");
const msg = document.getElementById("msg");
const scene = document.getElementById("scene");

const speed = document.getElementById("speed");
const musicBtn = document.getElementById("musicBtn");
const volume = document.getElementById("volume");
const music = document.getElementById("bgMusic");

/* ORBIT SPEED */
function updateSpeed(){
  const s = speed.value;
  orbits.forEach(o=>{
    const base = o.dataset.base || 1;
    o.style.animationDuration = (base / s * 8) + "s";
  });
}
updateSpeed();
speed.oninput = updateSpeed;

/* RESIZE SYSTEM */
function resizeSystem(){
  const system = document.querySelector(".system");
  const size = system.clientWidth;
  document.querySelectorAll(".orbit").forEach(o=>{
    const r = o.dataset.size;
    o.style.width = size * r + "px";
    o.style.height = size * r + "px";
  });
}
window.addEventListener("resize", resizeSystem);
resizeSystem();

/* NEW YEAR MESSAGE */
earthOrbit.addEventListener("animationiteration", ()=>{
  msg.classList.add("show");
});

/* MUSIC */
music.volume = volume.value;
musicBtn.onclick = ()=>{
  music.paused ? music.play() : music.pause();
  musicBtn.textContent = music.paused ? "Play Music" : "Pause";
};
volume.oninput = ()=> music.volume = volume.value;

/* PARALLAX */
document.addEventListener("mousemove", e=>{
  const x = (e.clientX / innerWidth - .5) * 25;
  const y = (e.clientY / innerHeight - .5) * -25;
  scene.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

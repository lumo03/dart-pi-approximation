const canvas = document.querySelector('#dart_canvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const slider = document.querySelector('#speed_slider');
const evalDiv = document.querySelector('#evaluation_div');
const totalCountP = evalDiv.querySelector('#totalCountP');
const circleCountP = evalDiv.querySelector('#circleCountP');
const piApproxP = evalDiv.querySelector('#piApproxP');
const points = new Set();
let speed = 0.5;
let intervall;
let totalCount = 0;
let circleCount = 0;
let piApprox = 0;

const draw = () => {
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.lineWidth = "4";
  ctx.beginPath();
  ctx.arc(250, 250, 250, 0, Math.PI * 2, true);
  ctx.stroke();
}

const isStrike = (x, y) => {
  const distance = Math.sqrt(Math.pow(250 - x, 2) + Math.pow(250 - y, 2));
  return distance < 250;
}

const addPoint = (x, y) => {
  points.add({ x, y, isStrike: isStrike(x, y) });
  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.beginPath();
  ctx.fillRect(x-2, y-2, 4, 4);
  ctx.stroke();
  console.log(points);
}

const addRandomPoint = () => {
  const randX = Math.random() * 500;
  const randY = Math.random() * 500;
  addPoint(randX, randY);
}

const startAutoPoints = () => {
  if (intervall) return;
  intervall = setInterval(addRandomPoint, speed);
  console.log("value of intervall", intervall)
}


const stopAutoPoints = () => {
  if (intervall) {
    clearInterval(intervall);
    intervall = null;
  }
}

const deleteAllPoints = () => {
  points.clear();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
}

slider.addEventListener("change", (e) => {
  speed = 1000 - (e.target.value * 1000);
  stopAutoPoints();
  startAutoPoints();
})

const doEvaluation = () => {
  totalCount = points.size;
  circleCount = [...points].reduce((acc, p) => { return p.isStrike ? acc + 1 : acc }, 0);
  piApprox = totalCount > 0 ? (circleCount / totalCount * 4) : 0;
  console.log(`total: ${totalCount}, circle: ${circleCount}, pi: ${piApprox}`);

  totalCountP.innerHTML = totalCount;
  circleCountP.innerHTML = circleCount;
  piApproxP.innerHTML = piApprox === 0 ? 0 : piApprox.toFixed(5);
}

draw();
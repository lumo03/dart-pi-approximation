// ** Grab HTML elements **

// canvas
const canvas = document.querySelector("#dart_canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

// slider
const slider = document.querySelector("#speed_slider");

// evaluation elements
const evalDiv = document.querySelector("#evaluation_div");
const totalCountP = evalDiv.querySelector("#totalCountP");
const circleCountP = evalDiv.querySelector("#circleCountP");
const piApproxP = evalDiv.querySelector("#piApproxP");

// dart control elements
const ctrlDiv = document.querySelector("#dart_controls");
const addPointBtn = ctrlDiv.querySelector("#add_point_btn");
const startAutoPointsBtn = ctrlDiv.querySelector("#start_auto_points_btn");
const stopAutoPointsBtn = ctrlDiv.querySelector("#stop_auto_points_btn");
const deleteAllPointsBtn = ctrlDiv.querySelector("#delete_all_points_btn");

// ** define game variables ***

const points = new Set();
let speed = 0.5;
let intervall;
let totalCount = 0;
let circleCount = 0;
let piApprox = 0;

/**
 * Draw a circle with a radius of 250 pixels, centered at 250, 250.
 * -> Dartboard
 */
const draw = () => {
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.lineWidth = "4";
  ctx.fillStyle = "rgb(211,211,211)"
  ctx.beginPath();
  ctx.arc(250, 250, 250, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.stroke();
};

/**
 * Given an x and y coordinate, return true if the point is within the circle, and false otherwise.
 * @param x - The x coordinate of the point
 * @param y - The y coordinate of the point
 * @returns A boolean value.
 */
const isStrike = (x, y) => {
  const distance = Math.sqrt(Math.pow(250 - x, 2) + Math.pow(250 - y, 2));
  return distance < 250;
};

/**
 * It adds a point (the dart) to the points collection, draws a red square on the canvas, and logs the points
 * collection to the console
 * @param x - The x coordinate of the point
 * @param y - The y coordinate of the point
 */
const addPoint = (x, y) => {
  points.add({ x, y, isStrike: isStrike(x, y) });
  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.beginPath();
  ctx.fillRect(x - 2, y - 2, 4, 4);
  ctx.stroke();
  console.log(points);
};

/**
 * AddRandomPoint() adds a random point to the canvas.
 */
const addRandomPoint = () => {
  const randX = Math.random() * 500;
  const randY = Math.random() * 500;
  addPoint(randX, randY);
};

/**
 * This functions starts an intervall which executes addRandomPoint() infinite times
 * with the given speed
 */
const startAutoPoints = () => {
  if (intervall) return;
  intervall = setInterval(addRandomPoint, speed);
  console.log("value of intervall", intervall);
};

/**
 * It stops the auto-points-adding interval.
 */
const stopAutoPoints = () => {
  if (intervall) {
    clearInterval(intervall);
    intervall = null;
  }
};

/**
 * It clears the points array, clears the canvas, and then redraws the canvas
 */
const deleteAllPoints = () => {
  points.clear();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
};

/**
 * It counts the number of points that are inside the circle and divides it by the total number of
 * points to get an approximation of pi
 */
const doEvaluation = () => {
  totalCount = points.size;
  circleCount = [...points].reduce((acc, p) => {
    return p.isStrike ? acc + 1 : acc;
  }, 0);
  piApprox = totalCount > 0 ? (circleCount / totalCount) * 4 : 0;
  console.log(`total: ${totalCount}, circle: ${circleCount}, pi: ${piApprox}`);

  totalCountP.innerHTML = totalCount;
  circleCountP.innerHTML = circleCount;
  piApproxP.innerHTML = piApprox === 0 ? 0 : piApprox.toFixed(5);
};

// ** Add events listeners **

/* An event listener which listens to the change event of the slider. */
slider.addEventListener("change", (e) => {
  speed = 1000 - e.target.value * 1000;
  stopAutoPoints();
  startAutoPoints();
});

/* add event listeners to the buttons */
addPointBtn.addEventListener("click", addRandomPoint);
startAutoPointsBtn.addEventListener("click", startAutoPoints);
stopAutoPointsBtn.addEventListener("click", stopAutoPoints);
deleteAllPointsBtn.addEventListener("click", () => {
  const result = confirm(
    "Do you really want to reset the simulation?\nEvery dart will be deleted!"
  );
  if (result) deleteAllPoints();
});

// ** onload execution **
draw();

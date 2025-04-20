const gridSize = 5;
const totalDwarfs = 7;
const apiKey = "p2hwyeiZo4uM2Lfa0A26/Q==Yxfpem66xxm7L8T9"

const lat = 18.0686;
const lon = 59.3293;


let player;
let rescued = 0;
let witch;
let dwarfs = [];
let rescuedDwarfPositions = [];
let visited;


const dwarfImages = [
  "image/DwarfBashful.png",
  "image/DwarfDoc2.png",
  "image/DwarfDopey.png",
  "image/DwarfGrumpy.png",
  "image/DwarfHappy.png",
  "image/DwarfSleepy.png",
  "image/DwarfSneezy.png"
];


const backgrounds = [
  "image/apa.webp",
  "image/ballong.jpg",
  "image/bro.jpg",
  "image/djur.webp",
  "image/fängelse.webp",
  "image/fönster.jpg",
  "image/hundar.png",
  "image/hus.jpg",
  "image/hus2.jpg",
  "image/hus2.webp",
  "image/lejonkungen.jpg",
  "image/något.jpg",
  "image/säng.jpg",
  "image/skog.webp",
  "image/skog2.webp",
  "image/skog3.jpg",
  "image/slott.webp",
  "image/städa.jpg",
  "image/sten.jpg",
  "image/strand.jpg",
  "image/tarzan2.jpg",
  "image/träd.jpg",
  "image/träd2.jpg",
  "image/trappa.jpg",
  "image/unge.webp"
];

backgrounds.forEach(url => {
  const img = new Image();
  img.src = url;
});

// Ger en random position som inte är upptagen 
function getRandomPosition(exclude = []) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (exclude.some(p => p.x === pos.x && p.y === pos.y));
  return pos;
}

function setupGame() {

  player = getRandomPosition();
  rescued = 0;
  rescuedDwarfPositions = [];
  visited = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );

  dwarfs = [];
  for (let i = 0; i < totalDwarfs; i++) {
    dwarfs.push(getRandomPosition([player, ...dwarfs]));
  }

  witch = getRandomPosition([player, ...dwarfs]);

  updateGame();
}

function getWitchDirection() {
  const dx = witch.x - player.x;
  const dy = witch.y - player.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "➡️" : "⬅️";
  } else {
    return dy > 0 ? "⬇️" : "⬆️";
  }
}

function uppdateraText() {
  document.getElementById("position").textContent = `${player.x}, ${player.y}`;
  document.getElementById("rescued").textContent = rescued;
  const avstånd = Math.abs(witch.x - player.x) + Math.abs(witch.y - player.y);
  document.getElementById("danger").textContent = avstånd;
  document.getElementById("witch-direction").textContent = `Häxan hörs från: ${getWitchDirection()}`;
}

//  Uppdaterar spelet varje gång man rör sig 
function updateGame() {
  visited[player.y][player.x] = true;
  document.getElementById("event-image").style.display = "none";
  uppdateraText();


  const backgroundIndex = player.y * gridSize + player.x;
  document.getElementById("image-area").style.backgroundImage =
    `url('${backgrounds[backgroundIndex]}')`;

  // Kontrollera om spelaren hittar en dvärg
  let foundDwarf = false;
  dwarfs = dwarfs.filter(d => {
    if (d.x === player.x && d.y === player.y) {
      rescued++;
      foundDwarf = true;
      rescuedDwarfPositions.push({ x: d.x, y: d.y });
      return false;
    }
    return true;
  });

  if (foundDwarf) {
    document.getElementById("description").textContent = "Du hittade en dvärg! 🧝";

    //  visar slumpmässig bild
    const eventImg = document.getElementById("event-image");
    const randomDwarf = dwarfImages[Math.floor(Math.random() * dwarfImages.length)];
    eventImg.src = randomDwarf;
    eventImg.style.display = "block";

  } else {
    document.getElementById("description").textContent = "Du går vidare";
  }

  if (player.x === witch.x && player.y === witch.y) {
    const eventImg = document.getElementById("event-image");
    eventImg.src = "image/witch.png"; 
    eventImg.style.display = "block";
  
 
    setTimeout(() => {
      alert("Häxan tog dig! Spelet är slut.");
      location.reload();
    }, 500);
  
  }

  if (rescued === totalDwarfs) {
    
    setTimeout(() => {
      alert("Du har räddat alla Dvärgar!");
      location.reload();
    }, 500);
  }

  drawMap();
}

function move(direction) {
  if (direction === 'N' && player.y > 0) player.y--;
  else if (direction === 'S' && player.y < gridSize - 1) player.y++;
  else if (direction === 'V' && player.x > 0) player.x--;
  else if (direction === 'O' && player.x < gridSize - 1) player.x++;

  // 25% chans att häxan rör sig
  if (Math.random() < 0.25) {
    const dx = player.x - witch.x;
    const dy = player.y - witch.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && witch.x < gridSize - 1) witch.x++;
      else if (dx < 0 && witch.x > 0) witch.x--;
    } else {
      if (dy > 0 && witch.y < gridSize - 1) witch.y++;
      else if (dy < 0 && witch.y > 0) witch.y--;
    }
  }

  updateGame();
}

function skapaRuta(x, y) {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  if (!visited[y][x]) {
    cell.style.backgroundColor = "#ccc";
    return cell;
  }

  if (player.x === x && player.y === y) {
    cell.classList.add("player");
    cell.textContent = "👸";
  } else if (witch.x === x && witch.y === y) {
    cell.classList.add("witch");
    cell.textContent = "🧙";
  } else if (rescuedDwarfPositions.some(p => p.x === x && p.y === y)) {
    cell.classList.add("visited-dwarf");
    cell.textContent = "✅";
  }

  return cell;
}

function drawMap() {
  const map = document.getElementById("map");
  map.innerHTML = "";

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = skapaRuta(x, y);
      map.appendChild(cell);
    }
  }
}

setupGame();

function getTime() {
  fetch(`https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lon}`, {
    method: 'GET',
    headers: { 'X-Api-Key': apiKey }
  })
    .then(response => response.json())
    .then(data => {
      const tid = data.datetime.split(" ")[1]; 
      document.getElementById("clock").textContent = tid;
    })
}

getTime(); 
setInterval(getTime, 10000);
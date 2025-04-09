const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellsize = 32;
let roundleft = 2;
let roundwidth = 5;
let roundtop = 1;
let roundheight = 14;
let rounddata = [];
let roundnum = 1;
let puyodata = [];
let puyonowidx = 0;
let puyosuu = 0;
let puyomultiplier = 4;
let puyospeed = 4;
let puyospeedmax = 8;
let gamemode = 1;
let countdown = 0;
let nowmovepuyo;
let score = 0;
let misscount = 0;
let getpuyo = [];

class Round {
  constructor(mapdata, puyodata) {
    this.mapdata = mapdata;
    this.puyodata = puyodata;
  }
  
  getMap(x) {
    return this.mapdata[x];
  }
  
  getPuyo(idx) {
    return this.puyodata[idx];
  }
  
  getPuyoNum() {
    return this.puyodata.length;
  }
}

class MovePuyo {
  constructor(puyo) {
    this.puyox = [cellsize * 4, cellsize * 4];
    this.puyoy = [cellsize * 2, cellsize * 1];
    this.puyoc = [puyo[0], puyo[1]];
    this.erase = [0, 0];
    this.rotate = 0;
    this.end = 0;
  }

  drop() {
    this.puyoy[0] += puyospeed;
    this.puyoy[1] += puyospeed;

    this.erasecheck();

    if (this.puyoy[0] > (cellsize * 20)) {
      this.end = 1;
      for (let i = 0; i<= 1; i++) {
        if ((this.erase[i] === 0) && (this.puyoc[i] != 8)) {
          misscount++;
        }
      }
    }
  }

  erasecheck() {
    for (let i = 0; i <= 1; i++) {
      if (this.erase[i] === 0) {
        if (((roundtop + roundheight - 2) * cellsize < this.puyoy[i]) && (this.puyoy[i] < (roundtop + roundheight - 1) * cellsize)) {
          let xidx = Math.floor(this.puyox[i] / cellsize) - roundleft;
          if (rounddata[roundnum].getMap(xidx) != 0) {
            if (rounddata[roundnum].getMap(xidx) === this.puyoc[i]) {
              score += 100;
              getpuyo.push(this.puyoc[i]);
            } else {
              score -= 10;
              misscount++;
            }
            this.erase[i] = 1;
          }
        }
      }
    }
  }

  turn(direction) { // direction は 1 (右回転) または -1 (左回転)
    this.rotate = (this.rotate + direction + 4) % 4; // +4 は負の剰余対策
    switch (this.rotate) {
      case 0:
        this.puyox[1] = this.puyox[0];
        this.puyoy[1] = this.puyoy[0] - cellsize;
        break;
      case 1:
        this.puyox[1] = this.puyox[0] + cellsize;
        this.puyoy[1] = this.puyoy[0];
        break;
      case 2:
        this.puyox[1] = this.puyox[0];
        this.puyoy[1] = this.puyoy[0] + cellsize;
        break;
      case 3:
        this.puyox[1] = this.puyox[0] - cellsize;
        this.puyoy[1] = this.puyoy[0];
        break;
    }

    this.adjustPosition(); // 位置調整を共通化
  }

  turnRight() {
    this.turn(1);
  }

  turnLeft() {
    this.turn(-1);
  }

  adjustPosition() {
    if ((this.puyox[0] > ((roundleft + roundwidth - 1) * cellsize)) || (this.puyox[1] > ((roundleft + roundwidth - 1) * cellsize))) {
      this.puyox[0] -= cellsize;
      this.puyox[1] -= cellsize;
    }

    if ((this.puyox[0] < (roundleft * cellsize)) || (this.puyox[1] < (roundleft * cellsize))) {
      this.puyox[0] += cellsize;
      this.puyox[1] += cellsize;
    }
  }

  moveRight() {
    this.puyox[0] += cellsize;
    this.puyox[1] += cellsize;

    this.adjustPosition(); // 位置調整を共通化
  }

  moveLeft() {
    this.puyox[0] -= cellsize;
    this.puyox[1] -= cellsize;

    this.adjustPosition(); // 位置調整を共通化
  }
}

const roundSelectButton = {
  vector: [
  { x: 4, y: 15 },
  { x: 27, y: 4 },
  { x: 27, y: 27 },
  { x: 4, y: 16 }
  ]
};

const kagoShape = {
  vector: [
  { x: 1, y: 1 },
  { x: 1, y: 30 },
  { x: 30, y: 30 },
  { x: 30, y: 1 },
  { x: 27, y: 1 },
  { x: 27, y: 27 },
  { x: 4, y: 27 },
  { x: 4, y: 1 }
  ]
}

const rounddata1 = [ 0, 0, 6, 0, 0];
const roundpuyodata1 = [
  [ 8, 8],
  [ 8, 6],
  [ 6, 8],
  [ 6, 6]
];

const rounddata2 = [ 0, 0, 6, 2, 0];
const roundpuyodata2 = [
  [ 8, 8],
  [ 2, 2],
  [ 6, 6],
  [ 8, 2],
  [ 8, 6],
  [ 2, 8],
  [ 2, 6],
  [ 6, 8],
  [ 6, 2]
];

const rounddata3 = [ 0, 1, 6, 2, 0];
const roundpuyodata3 = [
  [ 8, 8],
  [ 1, 1],
  [ 2, 2],
  [ 6, 6],
  [ 8, 1],
  [ 8, 2],
  [ 1, 8],
  [ 1, 6],
  [ 2, 8],
  [ 2, 6],
  [ 6, 1],
  [ 6, 2]
];

const rounddata4 = [ 0, 1, 6, 2, 4];
const roundpuyodata4 = [
  [ 8, 8],
  [ 1, 1],
  [ 2, 2],
  [ 4, 4],
  [ 6, 6],
  [ 8, 1],
  [ 1, 8],
  [ 1, 6],
  [ 2, 4],
  [ 2, 6],
  [ 4, 2],
  [ 6, 1],
  [ 6, 2]
];

rounddata[1] = new Round(rounddata1, roundpuyodata1);
rounddata[2] = new Round(rounddata2, roundpuyodata2);
rounddata[3] = new Round(rounddata3, roundpuyodata3);
rounddata[4] = new Round(rounddata4, roundpuyodata4);

const maxround = 4;

function shuffleArray(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

function duplicateArray(array, multiplier) {
  return array.flatMap((row) => Array(multiplier).fill(row));
}

function mapinit() {

  score = 0;
  getpuyo = [];
  misscount = 0;

  puyoinit();

}

function puyoinit() {
  puyodata = [];

  puyodata = rounddata[roundnum].puyodata;
  puyodata = duplicateArray(puyodata, puyomultiplier);
  puyodata = shuffleArray(puyodata);

  puyosuu = rounddata[roundnum].getPuyoNum() * puyomultiplier;
  puyonowidx = 0;
  
  nowmovepuyo = new MovePuyo(puyodata[puyonowidx]);

}

// ドットの色を定義
const colors = [
  '#000000',
  '#0000FF',
  '#FF0000',
  '#FF00FF',
  '#00FF00',
  '#00FFFF',
  '#FFFF00',
  '#FFFFFF',
  '#C0C0C0',
  '#C0C0FF',
  '#FFC0C0',
  '#FFC0FF',
  '#C0FFC0',
  '#C0FFFF',
  '#FFFFC0',
  '#FFFFFF'
];

// ドットの倍率
const dsize = 4;

const dotDataWall = [
  [2, 2, 2, 2, 2, 0, 2, 2],
  [2, 2, 2, 2, 2, 0, 2, 2],
  [2, 2, 2, 2, 2, 0, 2, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 0, 2, 2, 2, 2, 2],
  [2, 2, 0, 2, 2, 2, 2, 2],
  [2, 2, 0, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

// ドットを描画する関数
function drawDot(x, y, colorIndex) {
  ctx.fillStyle = colors[colorIndex];
  ctx.fillRect(x, y, dsize, dsize);
}

// ドット絵を描画する関数
function drawDotImage(data, basex, basey, rotateR, refrectF) {
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      
      tempx = x;
      tempy = y;

      if (refrectF === 0) {
        switch (rotateR) {
          case 0:
            datax = tempx;
            datay = tempy;
            break;
          case 90:
            datax = tempy;
            datay = data[y].length - tempx - 1;
            break;
          case 180:
            datax = data[y].length - tempx - 1;
            datay = data.length - tempy - 1;
            break;
          case 270:
            datax = data.length - tempy - 1;
            datay = tempx;
            break;  
        }
      } else {
        switch (rotateR) {
          case 0:
            datax = data[y].length - tempx - 1;
            datay = tempy;
            break;
          case 90:
            datax = data.length - tempy - 1;
            datay = data[y].length - tempx - 1;
            break;
          case 180:
            datax = tempx;
            datay = data.length - tempy - 1;
            break;
          case 270:
            datax = tempy;
            datay = tempx;
            break;  
        }
      }

      drawDot(basex + (x * dsize), basey + (y * dsize), data[datay][datax]);
    }
  }
}

function drawShape(shapeData, shapeColor, offsetX, offsetY, cellsizeS, rotateR, refrectF) {
  // Create a copy of shapeData to avoid overwriting the original
  const shapeDataCopy = JSON.parse(JSON.stringify(shapeData));
  const drawpath = [...shapeDataCopy.vector];

  if (refrectF === 1) {
    for (let i = 0; i < drawpath.length; i++) {
      drawpath[i].x = cellsizeS - drawpath[i].x - 1;
    }
  }

  switch (rotateR) {
    case 90:
      for (let i = 0; i < drawpath.length; i++) {
        let x = drawpath[i].x;
        let y = drawpath[i].y;
        drawpath[i].x = cellsizeS - y - 1;
        drawpath[i].y = x;
      }
      break;
    case 180:
      for (let i = 0; i < drawpath.length; i++) {
        drawpath[i].x = cellsizeS - drawpath[i].x - 1;
        drawpath[i].y = cellsizeS - drawpath[i].y - 1;
      }
      break;
    case 270:
      for (let i = 0; i < drawpath.length; i++) {
        let x = drawpath[i].x;
        let y = drawpath[i].y;
        drawpath[i].x = y;
        drawpath[i].y = cellsizeS - x - 1;
      }
      break;  
  }

  ctx.beginPath();
  ctx.moveTo(drawpath[0].x + offsetX, drawpath[0].y + offsetY);
  for (let i = 1; i < drawpath.length; i++) {
    ctx.lineTo(drawpath[i].x + offsetX, drawpath[i].y + offsetY);
  }
  ctx.closePath();
  ctx.fillStyle = shapeColor;
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // drawCell();
  drawBack();
  drawWall();
  drawRoundSelect();
  drawStartButton();
  drawGiveupButton();
  drawKago();
  drawPuyo();
  drawNextPuyo();
  drawSpeed();
  drawScore();
  drawGetPuyo();

}

function drawCell() {
  ctx.strokeStyle = 'black';
  for (let i = 0; i < canvas.width; i = i + cellsize) {
    for (let j = 0; j < canvas.height; j = j + cellsize) {
      ctx.strokeRect(i, j, cellsize, cellsize);
    }
  }
}

function drawWall() {

  for (let i = roundleft - 1; i <= roundwidth + 2; i += (roundwidth + 1)) {
    for (let j = roundtop; j <= roundheight; j++) {
      drawDotImage(dotDataWall, i * cellsize, j * cellsize, 0, 0);
    }
  }

}

function drawBack() {
  ctx.fillStyle = colors[0];
  ctx.fillRect(roundleft * cellsize, roundtop * cellsize, cellsize * roundwidth, cellsize * roundheight);
}

function drawRoundSelect() {
  drawShape(roundSelectButton, colors[1], 16 * cellsize, 2 * cellsize, cellsize, 0, 0);
  drawShape(roundSelectButton, colors[1], 18 * cellsize, 2 * cellsize, cellsize, 0, 1);

  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'blue';
  ctx.fillText(roundnum , 17 * cellsize + (cellsize / 2), 2 * cellsize + (cellsize / 2));
}

function drawKago() {
  for (let x = 0; x <= roundwidth - 1; x++) {
    let mapvalue = rounddata[roundnum].getMap(x);
    if (mapvalue != 0) {
      drawShape(kagoShape, colors[mapvalue], (roundleft + x) * cellsize, (roundtop + roundheight - 2) * cellsize, cellsize, 0, 0);
    }
  }
}

function drawStartButton() {
  switch (gamemode) {
    case 1:
      ctx.font = '30px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'red';
      ctx.fillText('Start!' , 17 * cellsize + (cellsize / 2), 4 * cellsize + (cellsize / 2));
      ctx.strokeStyle = 'red';
      ctx.strokeRect(16 * cellsize, 4 * cellsize, cellsize * 3, cellsize);
      break;
    case 2:
      ctx.font = '30px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'red';
      ctx.fillText(countdown, 17 * cellsize + (cellsize / 2), 4 * cellsize + (cellsize / 2));
      ctx.strokeStyle = 'red';
      ctx.strokeRect(16 * cellsize, 4 * cellsize, cellsize * 3, cellsize);
      break;
    case 3:
      ctx.font = '30px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'red';
      ctx.fillText('GO!', 17 * cellsize + (cellsize / 2), 4 * cellsize + (cellsize / 2));
      ctx.strokeStyle = 'red';
      ctx.strokeRect(16 * cellsize, 4 * cellsize, cellsize * 3, cellsize);
      break;
  }
}

function drawPuyo() {

  for (let i = 0; i <= 1; i++) {
    if (nowmovepuyo.erase[i] === 0) {
      ctx.beginPath();
      ctx.arc(nowmovepuyo.puyox[i] + (cellsize / 2), nowmovepuyo.puyoy[i] + (cellsize / 2), cellsize / 2, 0, Math.PI*2);
      ctx.fillStyle = colors[nowmovepuyo.puyoc[i]];
      ctx.fill();
      ctx.closePath();
    }
  }

}

function drawNextPuyo() {

  ctx.fillStyle = colors[0];
  ctx.fillRect(9 * cellsize, 1 * cellsize, cellsize * 1, cellsize * 2);

  ctx.fillStyle = colors[0];
  ctx.fillRect(11 * cellsize, 1 * cellsize, cellsize * 1, cellsize * 2);

  if (puyonowidx + 1 < puyosuu) {
    for (let i = 0; i <= 1; i++){
      ctx.beginPath();
      ctx.arc((cellsize * 9) + (cellsize / 2), (cellsize * (2 - i)) + (cellsize / 2), cellsize / 2, 0, Math.PI*2);
      ctx.fillStyle = colors[puyodata[puyonowidx + 1][i]];
      ctx.fill();
      ctx.closePath();
    }
  }

  if (puyonowidx + 2 < puyosuu) {
    for (let i = 0; i <= 1; i++){
      ctx.beginPath();
      ctx.arc((cellsize * 11) + (cellsize / 2), (cellsize * (2 - i)) + (cellsize / 2), cellsize / 2, 0, Math.PI*2);
      ctx.fillStyle = colors[puyodata[puyonowidx + 2][i]];
      ctx.fill();
      ctx.closePath();
    }
  }

}

function drawSpeed() {
  for (let y = 1; y <= puyospeed; y++) {
    drawShape(roundSelectButton, colors[1], 10 * cellsize, (y + 5) * cellsize, cellsize, 270, 0);
  }
}

function drawGiveupButton() {
  switch (gamemode) {
    case 3:
      ctx.font = '18px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'green';
      ctx.fillText('Give up', 17 * cellsize + (cellsize / 2), 5 * cellsize + (cellsize / 2));
      ctx.strokeStyle = 'green';
      ctx.strokeRect(16 * cellsize, 5 * cellsize, cellsize * 3, cellsize);
      break;
  }
}

function drawScore() {

  ctx.font = '30px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText('SCORE', 17 * cellsize + (cellsize / 2), 7 * cellsize + (cellsize / 2));

  ctx.font = '30px serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(score, 19 * cellsize , 8 * cellsize + (cellsize / 2));
}

function drawGetPuyo() {

  if (getpuyo.length <= 7) {
    for (let i = 0; i < getpuyo.length; i++) {
      ctx.beginPath();
      ctx.arc((cellsize * (12 + i)) + (cellsize / 2), (cellsize * (roundtop + roundheight - 2)) + (cellsize / 2), cellsize / 2, 0, Math.PI*2);
      ctx.fillStyle = colors[getpuyo[i]];
      ctx.fill();
      ctx.closePath();
    }
  } else {
    for (let i = 0; i < getpuyo.length; i++) {
      ctx.beginPath();
      ctx.arc((cellsize * 12) + (cellsize * i * 7 / getpuyo.length) + (cellsize / 2), (cellsize * (roundtop + roundheight - 2)) + (cellsize / 2), cellsize / 2, 0, Math.PI*2);
      ctx.fillStyle = colors[getpuyo[i]];
      ctx.fill();
      ctx.closePath();
    }
  }

}

function drawFinish() {
  ctx.font = '30px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'red';
  ctx.fillText('Finish!' , 17 * cellsize + (cellsize / 2), 9 * cellsize + (cellsize / 2));
  
  if (misscount === 0) {
    ctx.font = '30px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'red';
    ctx.fillText('Perfect!' , 17 * cellsize + (cellsize / 2), 10 * cellsize + (cellsize / 2));
  }
  
}

function countStart() {
  countdown = 4;

  function calcCount() {
    countdown--;
    
    if (countdown === 0) {
      // カウントダウン終了時の処理
      gamemode = 3;
    } else {
      setTimeout(calcCount, 1000);
    }

  }

  calcCount(); // カウントダウン開始
}

function gameStart() {
  gamemode = 2;
  countStart();
}

function gameClear() {
  gamemode = 1;
  draw();
  drawFinish();
  mapinit();
}

function gameGiveup() {
  gamemode = 1;
  mapinit();
}

mapinit();
draw();

setInterval(function() {
  if (gamemode === 3) {
    nowmovepuyo.drop();
    if (nowmovepuyo.end === 1) {
      puyonowidx++;
      if (puyonowidx < puyosuu) {
        nowmovepuyo = new MovePuyo(puyodata[puyonowidx]);
      } else {
        gameClear();
      }
    }
  }

  if ((gamemode === 2) || (gamemode === 3)) {
    draw();
  }
    
}, 16);

// キャンバスをクリックした時のイベントリスナー
canvas.addEventListener('click', (event) => {
  // キャンバス要素の左上からの相対座標を取得
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const mapx = Math.floor(x / cellsize);
  const mapy = Math.floor(y / cellsize);

  switch (gamemode) {
    case 1:
      if ((mapx === 16) && (mapy === 2) && (roundnum > 1)) {
        roundnum--;
        mapinit();
        draw();
      }
      if ((mapx === 18) && (mapy === 2) && (roundnum < maxround)) {
        roundnum++;
        mapinit();
        draw();
      }

      if ((mapx >= 16) && (mapx <= 18) && (mapy === 4)) {
        gameStart();
      }
      break;
    case 2:
      break;
    case 3:
      if ((mapx >= 16) && (mapx <= 18) && (mapy === 5)) {
        gameGiveup();
      }
      break;
  }
});

// キーボードイベントリスナー
document.addEventListener('keydown', (event) => {
  switch (gamemode) {
    case 1:
      switch (event.key) {
        case 'ArrowUp':
          if (puyospeed > 1) {
            puyospeed--;
            draw();
          }
          break;
        case 'ArrowDown':
          if (puyospeed < puyospeedmax) {
            puyospeed++;
            draw();
          }
          break;
        case 'ArrowLeft':
          if (roundnum > 1) {
            roundnum--;
            mapinit();
            draw();
          }
          break;
        case 'ArrowRight':
          if (roundnum < maxround) {
            roundnum++;
            mapinit();
            draw();
          }
          break;
        case 'Enter':
          gameStart();
          break;
      }
      break;
    case 2:
      switch (event.key) {
        case 'ArrowUp':
          if (puyospeed > 1) {
            puyospeed--;
            draw();
          }
          break;
        case 'ArrowDown':
          if (puyospeed < puyospeedmax) {
            puyospeed++;
            draw();
          }
          break;
      }
      break;
    case 3:
      switch (event.key) {
        case 'ArrowUp':
          if (puyospeed > 1) {
            puyospeed--;
            draw();
          }
          break;
        case 'ArrowDown':
          if (puyospeed < puyospeedmax) {
            puyospeed++;
            draw();
          }
          break;
        case 'ArrowLeft':
          nowmovepuyo.moveLeft();
          break;
        case 'ArrowRight':
          nowmovepuyo.moveRight();
          break;
        case 'z':
        case 'Z':
          nowmovepuyo.turnLeft();
          break;
        case 'x':
        case 'X':
          nowmovepuyo.turnRight();
          break;
        case 'Escape':
          gameGiveup();
          break;
      }
      break;
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
  }
});

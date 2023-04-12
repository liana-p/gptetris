export function tetris() {
  var score = 0,
    timePassed = 0,
    speed = 1000,
    lastTime = 0,
    level = 1;
  var c = document.getElementById('canvas');
  var g = c.getContext('2d');
  var b = [];
  var S = [
    [
      [1, 1],
      [1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [[1, 1, 1, 1]],
  ];
  var C = ['#f00', '#0f0', '#00f', '#880', '#ff0', '#0ff', '#f0f'];
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  function clearLines() {
    var lines = 0;
    for (var i = 19; i >= 0; i--) {
      var filled = true;
      for (var j = 0; j < 10; j++) {
        if (b[i][j] === 0) {
          filled = false;
          break;
        }
      }
      if (filled) {
        lines++;
        for (var k = i; k > 0; k--) {
          b[k] = b[k - 1];
        }
        b[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }
    score += lines * 10;
  }
  class T {
    constructor(s, c) {
      this.s = s;
      this.c = c;
      this.x = 3;
      this.y = 0;
    }
    d() {
      g.fillStyle = this.c;
      for (var i = 0; i < this.s.length; i++) {
        for (var j = 0; j < this.s[i].length; j++) {
          if (this.s[i][j]) {
            const x = (this.x + j) * 40;
            const y = (this.y + i) * 40;
            g.fillRect(x, y, 40, 40);
          }
        }
      }
    }
    canMove(dx, dy, newShape) {
      var x = this.x + dx,
        y = this.y + dy;
      for (var i = 0; i < newShape.length; i++) {
        for (var j = 0; j < newShape[i].length; j++) {
          if (newShape[i][j]) {
            if (y + i >= 20 || x + j < 0 || x + j >= 10 || b[y + i][x + j])
              return false;
          }
        }
      }
      return true;
    }
    rotate() {
      var newShape = [];
      for (var i = 0; i < this.s[0].length; i++) {
        newShape[i] = [];
        for (var j = 0; j < this.s.length; j++) {
          newShape[i][j] = this.s[this.s.length - 1 - j][i];
        }
      }
      return newShape;
    }
    update(time = 0) {
      var deltaTime = time - lastTime;
      lastTime = time;
      if (score >= 1000 && level === 1) {
        speed -= 50;
        level = 2;
      } else if (score >= 2000 && level === 2) {
        speed -= 50;
        level = 3;
      } else if (score >= 3000 && level === 3) {
        speed -= 50;
        level = 4;
      }
      timePassed += deltaTime;
      if (timePassed > speed) {
        p.y++;
        if (!p.canMove(0, 1, p.s)) {
          p.y--;
          for (var i = 0; i < p.s.length; i++) {
            for (var j = 0; j < p.s[i].length; j++) {
              if (p.s[i][j]) {
                b[p.y + i][p.x + j] = p.c;
              }
            }
          }
          clearLines();
          p = new T(S[n], C[n]);
          n = getRandomInt(7);
        }
        timePassed = 0;
      }
    }
  }
  for (var i = 0; i < 20; i++) {
    b[i] = [];
    for (var j = 0; j < 10; j++) {
      b[i][j] = 0;
    }
  }
  var n = getRandomInt(7);
  var p = new T(S[n], C[n]),
    gameLoop = function () {
      requestAnimationFrame(gameLoop);
      p.update(Date.now());
      g.clearRect(0, 0, c.width, c.height);
      for (var y = 0; y < b.length; y++) {
        if (b[y]) {
          for (var x = 0; x < b[y].length; x++) {
            if (b[y][x]) {
              const fill = b[y][x];
              g.fillStyle = fill;
              g.fillRect(x * 40, y * 40, 40, 40);
            }
          }
        }
      }
      p.d();
    };
  gameLoop();
  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 37 && p.canMove(-1, 0, p.s)) p.x--;
    else if (e.keyCode == 39 && p.canMove(1, 0, p.s)) p.x++;
    else if (e.keyCode == 40 && p.canMove(0, 1, p.s)) p.y++;
    else if (e.keyCode == 38) {
      var newShape = p.rotate();
      if (p.canMove(0, 0, newShape)) {
        p.s = newShape;
      }
    }
  });
}

const SERVER_URL = 'https://pong-server-kbjl.onrender.com';
const socket = io(SERVER_URL);

// 参加用入力欄の表示トグル
function showJoinInput() {
    document.getElementById('join-input-area').style.display = 'block';
}

function enterGame() {
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    
    // ゲーム開始！
    startGameLoop();
}

function startAI() {
    const user = document.getElementById('username').value;
    const points = document.getElementById('ai-points').value;
    const balls = document.getElementById('ai-balls').value;
    if(!user) return alert('名前を入れてね');
    
    socket.emit('join-ai', { user, points, balls });
    enterGame();
}

function createRoom() {
    const user = document.getElementById('username').value;
    const points = document.getElementById('room-points').value;
    const balls = document.getElementById('room-balls').value;
    if(!user) return alert('名前を入れてね');

    socket.emit('create-room', { user, points, balls });
    enterGame();
}

function joinRoom() {
    const user = document.getElementById('username').value;
    const room = document.getElementById('roomCode').value;
    if(!user || !room) return alert('名前とコードを入れてね');
    
    socket.emit('join-room', { user, room });
    enterGame();
}
// --- ゲームの状態管理 ---
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let gameRunning = false;
const ball = { x: 300, y: 200, dx: 2, dy: 2, radius: 10 };
const paddle1 = { x: 10, y: 150, width: 10, height: 80 };
const paddle2 = { x: 580, y: 150, width: 10, height: 80 };

// 描画処理
function draw() {
    // 画面クリア
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // パドルとボールの描画
    ctx.fillStyle = 'white';
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    if (gameRunning) {
        requestAnimationFrame(update); // 次のフレームへ
    }
}

// 更新処理（ボールを動かすなど）
function update() {
    // ボールの移動（仮）
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // 壁での反射
    if (ball.y < 0 || ball.y > canvas.height) ball.dy *= -1;
    if (ball.x < 0 || ball.x > canvas.width) ball.dx *= -1;

    draw();
}

// ループ開始関数（enterGameから呼ぶ）
function startGameLoop() {
    gameRunning = true;
    update();
}

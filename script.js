const socket = io('https://pong-server-kbjl.onrender.com');
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let paddleY = 150;
let ball = { x: 300, y: 200, dx: 4, dy: 4 };
let score = { p1: 0, p2: 0 };
let gameRunning = false;

// 画面切り替え
function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// 共通のパドル操作
function movePaddle(y) {
    paddleY = Math.max(0, Math.min(320, y - 40));
}

// マウス/タッチ操作
canvas.addEventListener('mousemove', (e) => movePaddle(e.clientY - canvas.getBoundingClientRect().top));
canvas.addEventListener('touchmove', (e) => movePaddle(e.touches[0].clientY - canvas.getBoundingClientRect().top), {passive: false});

// キーボード操作
window.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowUp') movePaddle(paddleY - 20);
    if(e.key === 'ArrowDown') movePaddle(paddleY + 100);
});

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 600, 400);
    
    // ボール移動
    if(gameRunning) {
        ball.x += ball.dx; ball.y += ball.dy;
        if(ball.y < 0 || ball.y > 400) ball.dy *= -1;
        if(ball.x < 0 || ball.x > 600) { ball.x = 300; ball.y = 200; } // 仮の簡易リセット
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(10, paddleY, 10, 80); // 自分のパドル
    ctx.fillRect(ball.x, ball.y, 10, 10); // ボール
    requestAnimationFrame(draw);
}

// 通信処理
function startAI() {
    gameRunning = true;
    switchScreen('game-area');
    draw();
}

function createRoom() { socket.emit('create-room', { user: document.getElementById('username').value }); }
function joinRoom() { socket.emit('join-room', { user: document.getElementById('username').value, room: document.getElementById('roomCode').value }); }
function showJoinInput() { document.getElementById('join-input-area').style.display = 'block'; }

socket.on('room-created', (code) => { switchScreen('waiting-room'); document.getElementById('display-room-code').innerText = code; });
socket.on('game-start', () => { gameRunning = true; switchScreen('game-area'); draw(); });

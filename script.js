const socket = io('https://pong-server-kbjl.onrender.com');
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let paddleY = 150;
let gameState = 'lobby'; // lobby, waiting, playing

// 画面切り替え
function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function showJoinInput() { document.getElementById('join-input-area').style.display = 'block'; }

// 操作
window.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowUp') paddleY = Math.max(0, paddleY - 20);
    if(e.key === 'ArrowDown') paddleY = Math.min(320, paddleY + 20);
});

// ゲーム描画ループ
function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = 'white';
    ctx.fillRect(10, paddleY, 10, 80); // 自分のパドル
    requestAnimationFrame(draw);
}

// サーバー通信
function startAI() {
    socket.emit('join-ai', { user: document.getElementById('username').value });
    switchScreen('game-area');
    draw();
}

function createRoom() {
    socket.emit('create-room', { user: document.getElementById('username').value });
}

function joinRoom() {
    socket.emit('join-room', { 
        user: document.getElementById('username').value, 
        room: document.getElementById('roomCode').value 
    });
}

// 受信処理
socket.on('room-created', (code) => {
    switchScreen('waiting-room');
    document.getElementById('display-room-code').innerText = code;
});

socket.on('game-start', () => {
    switchScreen('game-area');
    draw();
});

const socket = io('https://pong-server-kbjl.onrender.com');
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let p1Y = 150, p2Y = 150;
let ball = { x: 300, y: 200, dx: 4, dy: 4 };
let score = { p1: 0, p2: 0 };
let gameRunning = false;
let isAI = false;

function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// どこでも操作できるようにする
function updatePaddle(e) {
    const rect = canvas.getBoundingClientRect();
    const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    p1Y = Math.max(0, Math.min(320, (clientY - rect.top) - 40));
}
document.addEventListener('mousemove', updatePaddle);
document.addEventListener('touchmove', (e) => { updatePaddle(e); e.preventDefault(); }, {passive: false});

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 600, 400);
    
    if(gameRunning) {
        ball.x += ball.dx; ball.y += ball.dy;
        if(ball.y < 0 || ball.y > 390) ball.dy *= -1;
        // パドル衝突判定
        if(ball.x < 20 && ball.y > p1Y && ball.y < p1Y + 80) ball.dx *= -1;
        if(ball.x > 570 && ball.y > p2Y && ball.y < p2Y + 80) ball.dx *= -1;
        // AIの動き
        if(isAI) p2Y += (ball.y - (p2Y + 40)) * 0.1;
        // 得点判定
        if(ball.x < 0) { score.p2++; resetBall(); }
        if(ball.x > 600) { score.p1++; resetBall(); }
        document.getElementById('score').innerText = `${score.p1} - ${score.p2}`;
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(10, p1Y, 10, 80);
    ctx.fillRect(580, p2Y, 10, 80);
    ctx.fillRect(ball.x, ball.y, 10, 10);
    requestAnimationFrame(draw);
}

function resetBall() { ball = { x: 300, y: 200, dx: (Math.random()>0.5?4:-4), dy: 4 }; }
function startAI() { isAI = true; gameRunning = true; switchScreen('game-area'); draw(); }
function createRoom() { socket.emit('create-room', { user: document.getElementById('username').value }); }
function joinRoom() { socket.emit('join-room', { user: document.getElementById('username').value, room: document.getElementById('roomCode').value }); }
function showJoinInput() { document.getElementById('join-input-area').style.display = 'block'; }

socket.on('room-created', (code) => { switchScreen('waiting-room'); document.getElementById('display-room-code').innerText = code; });
socket.on('game-start', () => { gameRunning = true; switchScreen('game-area'); draw(); });

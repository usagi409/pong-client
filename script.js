const socket = io('https://pong-server-kbjl.onrender.com');
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let p1Y = 150, p2Y = 150;
let balls = [];
let score = { p1: 0, p2: 0 };
let config = { points: 5, balls: 1 };
let gameStatus = 'ready'; // ready, playing, finished
let isAI = false;

function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function updatePaddle(e) {
    const rect = canvas.getBoundingClientRect();
    const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    p1Y = Math.max(0, Math.min(320, (clientY - rect.top) - 40));
}
document.addEventListener('mousemove', updatePaddle);
document.addEventListener('touchmove', (e) => { updatePaddle(e); e.preventDefault(); }, {passive: false});
canvas.addEventListener('click', () => { if(gameStatus === 'ready') gameStatus = 'playing'; });

function initGame(cfg) {
    config = cfg;
    score = { p1: 0, p2: 0 };
    resetBalls();
    gameStatus = 'ready';
    switchScreen('game-area');
    draw();
}

function resetBalls() {
    balls = [];
    for(let i=0; i<config.balls; i++) {
        balls.push({ x: 300, y: 200, dx: (Math.random()>0.5?4:-4), dy: 4 });
    }
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 600, 400);
    
    if(gameStatus === 'playing') {
        balls.forEach(b => {
            b.x += b.dx; b.y += b.dy;
            if(b.y < 0 || b.y > 390) b.dy *= -1;
            if(b.x < 20 && b.y > p1Y && b.y < p1Y + 80) b.dx = Math.abs(b.dx);
            if(b.x > 570 && b.y > p2Y && b.y < p2Y + 80) b.dx = -Math.abs(b.dx);
            
            if(b.x < 0) { score.p2++; gameStatus = 'ready'; resetBalls(); }
            if(b.x > 600) { score.p1++; gameStatus = 'ready'; resetBalls(); }
        });
        if(isAI) p2Y += (balls[0].y - (p2Y + 40)) * 0.1;
        document.getElementById('msg').innerText = "プレイ中...";
    } else {
        document.getElementById('msg').innerText = "クリックして開始";
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(10, p1Y, 10, 80);
    ctx.fillRect(580, p2Y, 10, 80);
    balls.forEach(b => ctx.fillRect(b.x, b.y, 10, 10));
    document.getElementById('score').innerText = `${score.p1} - ${score.p2}`;
    
    if(score.p1 >= config.points || score.p2 >= config.points) {
        document.getElementById('msg').innerText = "終了！";
        return;
    }
    requestAnimationFrame(draw);
}

function startAI() { 
    isAI = true; 
    initGame({ points: document.getElementById('ai-points').value, balls: document.getElementById('ai-balls').value }); 
}
function createRoom() { 
    socket.emit('create-room', { 
        user: document.getElementById('username').value,
        points: document.getElementById('room-points').value,
        balls: document.getElementById('room-balls').value
    }); 
}
function joinRoom() { 
    socket.emit('join-room', { user: document.getElementById('username').value, room: document.getElementById('roomCode').value }); 
}
function showJoinInput() { document.getElementById('join-input-area').style.display = 'block'; }

socket.on('room-created', (code) => { switchScreen('waiting-room'); document.getElementById('display-room-code').innerText = code; });
socket.on('game-start', (cfg) => { isAI = false; initGame(cfg); });

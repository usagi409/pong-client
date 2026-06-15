const socket = io('https://pong-server-kbjl.onrender.com');
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let p1Y = 150, p2Y = 150;
let balls = [];
let score = { p1: 0, p2: 0 };
let config = { points: 5, balls: 1, p1Name: '自分', p2Name: '相手' };
let gameStatus = 'ready'; // ready, playing, finished
let isAI = false;

function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    p1Y = Math.max(0, Math.min(320, (e.clientY - rect.top) - 40));
});

function initGame(cfg) {
    config = { ...config, ...cfg };
    score = { p1: 0, p2: 0 };
    resetBalls();
    gameStatus = 'playing'; // すぐ開始
    switchScreen('game-area');
    document.getElementById('game-over-screen').style.display = 'none';
    draw();
}

function resetBalls() {
    balls = [];
    for(let i=0; i<config.balls; i++) {
        balls.push({ x: 300, y: 200, dx: (Math.random()>0.5?4:-4), dy: (Math.random()>0.5?2:-2) });
    }
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 600, 400);
    
    // UI描画
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(config.p1Name + ": " + score.p1, 50, 30);
    ctx.fillText(config.p2Name + ": " + score.p2, 450, 30);

    if(gameStatus === 'playing') {
        balls.forEach(b => {
            b.x += b.dx; b.y += b.dy;
            if(b.y < 0 || b.y > 390) b.dy *= -1;
            if(b.x < 20 && b.y > p1Y && b.y < p1Y + 80) b.dx = Math.abs(b.dx);
            if(b.x > 570 && b.y > p2Y && b.y < p2Y + 80) b.dx = -Math.abs(b.dx);
            
            // 得点判定（1点ずつ確実に）
            if(b.x < 0 || b.x > 600) {
                if(b.x < 0) score.p2++; else score.p1++;
                resetBalls();
                if(score.p1 >= config.points || score.p2 >= config.points) gameStatus = 'finished';
            }
        });
        if(isAI) p2Y += (balls[0].y - (p2Y + 40)) * 0.05; // AIを弱体化
    } else if(gameStatus === 'finished') {
        document.getElementById('game-over-screen').style.display = 'block';
        document.getElementById('winner-text').innerText = (score.p1 > score.p2 ? config.p1Name : config.p2Name) + " の勝利！";
    }

    ctx.fillRect(10, p1Y, 10, 80);
    ctx.fillRect(580, p2Y, 10, 80);
    balls.forEach(b => ctx.fillRect(b.x, b.y, 10, 10));
    
    if(gameStatus !== 'finished') requestAnimationFrame(draw);
}

function startAI() { 
    isAI = true; 
    initGame({ 
        points: document.getElementById('ai-points').value, 
        balls: document.getElementById('ai-balls').value,
        p1Name: document.getElementById('username').value || '自分',
        p2Name: 'AI'
    }); 
}
function createRoom() { 
    socket.emit('create-room', { 
        user: document.getElementById('username').value || '自分',
        points: document.getElementById('room-points').value,
        balls: document.getElementById('room-balls').value
    }); 
}
function joinRoom() { 
    socket.emit('join-room', { user: document.getElementById('username').value || '自分', room: document.getElementById('roomCode').value }); 
}
function restartGame() { resetBalls(); score = { p1: 0, p2: 0 }; gameStatus = 'playing'; document.getElementById('game-over-screen').style.display = 'none'; draw(); }
function showJoinInput() { document.getElementById('join-input-area').style.display = 'block'; }

socket.on('room-created', (code) => { switchScreen('waiting-room'); document.getElementById('display-room-code').innerText = code; });
socket.on('game-start', (cfg) => { isAI = false; initGame(cfg); });

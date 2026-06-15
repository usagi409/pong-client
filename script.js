const SERVER_URL = 'https://pong-server-kbjl.onrender.com';
const socket = io(SERVER_URL);

// 画面切り替え関数
function enterGame() {
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    // ここでゲームループを開始する
}

// AI対戦開始
function startAI() {
    const user = document.getElementById('username').value;
    const points = document.getElementById('points').value;
    const balls = document.getElementById('balls').value;
    
    if(!user) return alert('ユーザー名を入力してください');
    
    socket.emit('join-ai', { user, points, balls });
    enterGame();
}

// 部屋作成
function createRoom() {
    const user = document.getElementById('username').value;
    const points = document.getElementById('points').value;
    const balls = document.getElementById('balls').value;
    socket.emit('create-room', { user, points, balls });
    enterGame();
}

// 部屋参加
function joinRoom() {
    const user = document.getElementById('username').value;
    const room = document.getElementById('roomCode').value;
    socket.emit('join-room', { user, room });
    enterGame();
}

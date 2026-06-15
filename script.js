const SERVER_URL = 'https://pong-server-kbjl.onrender.com';
const socket = io(SERVER_URL);

// 参加用入力欄の表示トグル
function showJoinInput() {
    document.getElementById('join-input-area').style.display = 'block';
}

function enterGame() {
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
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

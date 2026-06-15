const SERVER_URL = 'https://system-api-bridge.onrender.com';
const socket = io(SERVER_URL);

// 接続確認
socket.on('connect', () => {
    alert('サーバーと繋がったよ！');
});

// サーバーからの返答
socket.on('server-echo', (msg) => {
    alert('サーバーからの返事: ' + msg);
});

// クリックで送信（テスト）
window.addEventListener('click', () => {
    socket.emit('broadcast-test', '誰かが動きました！');
});
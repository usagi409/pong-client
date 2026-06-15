const SERVER_URL = 'https://pong-server-kbjl.onrender.com';
const socket = io(SERVER_URL);

// 画面にステータスを表示する関数
function showStatus(text) {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.bottom = '10px';
    div.style.left = '10px';
    div.style.background = 'black';
    div.style.color = 'lime';
    div.style.padding = '10px';
    div.style.zIndex = '99999';
    div.innerText = text;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// 接続確認
socket.on('connect', () => {
    showStatus("✅ サーバー接続成功！");
});

// ボタンが押されたら送信
document.getElementById('sendBtn').addEventListener('click', () => {
    socket.emit('test-message', '誰かが動きました！');
    showStatus("📤 送信！");
});

// 受信したらアラート表示
socket.on('test-broadcast', (data) => {
    alert("受信: " + data);
});

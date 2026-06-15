const SERVER_URL = 'https://system-api-bridge.onrender.com';
const socket = io(SERVER_URL);

// 画面にメッセージを表示する関数
function showMessage(text) {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.background = 'white';
    div.style.padding = '20px';
    div.style.fontSize = '24px';
    div.style.border = '2px solid black';
    div.innerText = text;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000); // 2秒で消える
}

// クリックした時に送信
document.addEventListener('click', () => {
    socket.emit('test-message', '誰かが動きました！');
});

// 受信した時に表示
socket.on('test-broadcast', (data) => {
    showMessage(data);
});

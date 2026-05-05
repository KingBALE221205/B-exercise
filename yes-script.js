let musicPlaying = false;
let charIndex = 0;
let textToType = "";

window.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy tên từ bộ nhớ
    const savedName = localStorage.getItem('userCrushName');
    const el = document.getElementById("love-text");

    // 2. Kiểm tra xem có lấy được tên không (Hiện trong F12 Console)
    console.log("Tên đã lưu là:", savedName);

    if (el) {
        // Nếu có tên thì hiện kèm tên, không có thì hiện mặc định
        if (savedName && savedName !== "") {
            textToType = `${savedName}, I really really like you 💕`;
        } else {
            textToType = "I really really like you 💕";
        }
        
        el.textContent = ""; // Xóa trắng trước khi đánh máy
        typeEffect();
    }

    // 3. Các hiệu ứng khác
    if (typeof launchConfetti === 'function') launchConfetti();
    if (typeof createHeart === 'function') setInterval(createHeart, 300);
    const music = document.getElementById('bg-music');
    if (music) {
        music.volume = 0.4;
        
        // Thử phát nhạc ngay lập tức
        const playPromise = music.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Nếu trình duyệt chặn, ta sẽ phát ngay khi người dùng chạm vào bất cứ đâu trên trang
                console.log("Autoplay bị chặn, đang chờ tương tác người dùng...");
                document.addEventListener('click', () => {
                    music.play();
                    musicPlaying = true;
                    document.getElementById('music-toggle').textContent = '🔊';
                }, { once: true }); // Chỉ chạy một lần duy nhất
            });
        }
    }
});
function typeEffect() {
    const el = document.getElementById("love-text");
    if (el && charIndex < textToType.length) {
        el.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 100);
    }
}
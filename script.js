// --- CẤU HÌNH DỮ LIỆU ---
const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
];

const noMessages = [
    "No",
    "Are you positive? 🤔",
    "Pookie please... 🥺",
    "If you say no, I will be really sad...",
    "I will be very sad... 😢",
    "Please??? 💔",
    "Don't do this to me...",
    "Last chance! 😭",
    "You can't catch me anyway 😜"
];

// --- BIẾN TOÀN CỤC ---
let userName = "";
let noClickCount = 0;
let runawayEnabled = false;

const catGif = document.getElementById('cat-gif');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');

// --- QUẢN LÝ NHẠC ---
music.volume = 0.3;

function toggleMusic() {
    if (music.paused) {
        music.play();
        musicBtn.textContent = '🔊';
    } else {
        music.pause();
        musicBtn.textContent = '🔇';
    }
}

// --- GIAI ĐOẠN 1: CHUYỂN TỪ NHẬP TÊN SANG HỎI ---
function goToStep2() {
    const nameInput = document.getElementById('crush-name');
    if (nameInput.value.trim() === "") {
        alert("Nhập tên trước đã bạn ơi! 💕");
        return;
    }
    userName = nameInput.value.trim();

    // Chuyển màn hình
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';

    // Bắt đầu phát nhạc khi có tương tác đầu tiên
    music.play().catch(() => {
        console.log("Cần click thêm để nhạc phát");
    });
}

// --- GIAI ĐOẠN 2: XỬ LÝ YES/NO ---
function handleYesClick() {
    // Ẩn màn hình hỏi, hiện kết quả
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-3').style.display = 'block';

    // Chạy hiệu ứng đánh máy tên đã nhập
    startTyping(userName);

    // Bắn pháo hoa
    launchConfetti();
}

function handleNoClick() {
    noClickCount++;

    // Thay đổi thông điệp nút No
    const msgIndex = Math.min(noClickCount, noMessages.length - 1);
    noBtn.textContent = noMessages[msgIndex];

    // Nút Yes to dần
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    yesBtn.style.fontSize = `${currentSize * 1.3}px`;
    const padY = Math.min(15 + noClickCount * 5, 50);
    const padX = Math.min(35 + noClickCount * 10, 100);
    yesBtn.style.padding = `${padY}px ${padX}px`;

    // Nút No nhỏ dần
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize);
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`;
    }

    // Đổi GIF theo mức độ "đau khổ"
    const gifIndex = Math.min(noClickCount, gifStages.length - 1);
    swapGif(gifStages[gifIndex]);

    // Kích hoạt né tránh từ lần bấm thứ 5
    if (noClickCount >= 5 && !runawayEnabled) {
        runawayEnabled = true;
    }
}

// --- LOGIC NÉ TRÁNH SIÊU NHẠY ---
document.addEventListener('mousemove', (e) => {
    if (!runawayEnabled) return;

    const x = e.clientX;
    const y = e.clientY;
    
    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const distance = Math.sqrt(Math.pow(x - btnCenterX, 2) + Math.pow(y - btnCenterY, 2));

    // Bán kính 150px là né ngay
    if (distance < 150) {
        runAway();
    }
});

function runAway() {
    const margin = 50;
    const maxX = window.innerWidth - noBtn.offsetWidth - margin;
    const maxY = window.innerHeight - noBtn.offsetHeight - margin;

    const randomX = Math.random() * maxX + margin / 2;
    const randomY = Math.random() * maxY + margin / 2;

    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.transition = 'none'; // Né tức thì
    noBtn.style.zIndex = '999';
}

// --- HIỆU ỨNG PHỤ ---
function swapGif(src) {
    catGif.style.opacity = '0';
    setTimeout(() => {
        catGif.src = src;
        catGif.style.opacity = '1';
    }, 200);
}

function startTyping(name) {
    const el = document.getElementById("love-text");
    const fullText = `${name}, I really really like you 💕`;
    let i = 0;
    el.textContent = "";
    
    function type() {
        if (i < fullText.length) {
            el.textContent += fullText.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    type();
}

// --- SỬA LẠI HÀM BẮN PHÁO HOA TRONG SCRIPT.JS ---

function launchConfetti() {
    // Kiểm tra xem thư viện confetti đã được tải chưa
    if (typeof confetti !== 'function') return;

    // --- CẤU HÌNH PHÁO HOA ---
    const duration = 10000; // Tổng thời gian bắn (10 giây)
    const animationEnd = Date.now() + duration; // Thời điểm kết thúc
    
    // Màu sắc pháo hoa (tone hồng/đỏ/vàng cho hợp chủ đề)
    const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#fff', '#ffdf00'];

    // --- PHÁT BẮN ĐẦU TIÊN (BÙNG NỔ GIỮA MÀN HÌNH) ---
    confetti({
        particleCount: 150, // Số lượng hạt
        spread: 100, // Độ lan
        origin: { x: 0.5, y: 0.3 }, // Vị trí (giữa, hơi cao)
        colors: colors,
        startVelocity: 45, // Tốc độ ban đầu
        gravity: 0.8 // Trọng lực (hạt rơi chậm)
    });

    // --- BẮN LIÊN HOÀN 2 BÊN TRÁI/PHẢI ---
    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        // Nếu hết thời gian, dừng bắn
        if (timeLeft <= 0) {
            clearInterval(interval);
            return;
        }

        // 1. Pháo bên TRÁI
        confetti({
            particleCount: 80, // Bắn nhiều hạt mỗi lần
            angle: 60, // Góc bắn (chéo lên phải)
            spread: 70, // Độ lan rộng
            origin: { x: 0, y: 0.6 }, // Vị trí (góc trái, hơi thấp)
            colors: colors,
            startVelocity: 55, // Bắn mạnh hơn
            ticks: 200 // Hạt tồn tại lâu hơn
        });

        // 2. Pháo bên PHẢI
        confetti({
            particleCount: 80, 
            angle: 120, // Góc bắn (chéo lên trái)
            spread: 70,
            origin: { x: 1, y: 0.6 }, // Vị trí (góc phải, hơi thấp)
            colors: colors,
            startVelocity: 55,
            ticks: 200
        });

    }, 400); // Khoảng thời gian giữa các lần bắn (0.4 giây)
}
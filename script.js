document.addEventListener("DOMContentLoaded", () => {
    // UI Elements
    const stepShake = document.getElementById("step-shake");
    const stepResult = document.getElementById("step-result");
    const gaugeBar = document.getElementById("gauge-bar");
    const omikujiContainer = document.getElementById("omikuji-container");
    const instructionP = document.querySelector(".instruction");
    
    // Result Elements
    const resultTitle = document.getElementById("result-title");
    const resultImage = document.getElementById("result-image");
    const resultDesc = document.getElementById("result-desc");
    const resultArea = document.getElementById("result-area");
    const btnRestart = document.getElementById("btn-restart");
    
    // Configuration
    const SHAKE_THRESHOLD = 1000; // 筒を振る回数
    let shakeAmount = 0;
    let isDragging = false;
    let isRevealed = false;
    let lastX = 0;
    let lastY = 0;
    
    // Prize List (おみくじの中身せっていする)
    const prizes = [
        {
            name: "『108アイドルサドンデス』",
            image: "108アイドル.png",
            desc: "最新シーズン【108アイドル・サドンデス】開幕。「命をかけられるもののみ、募集」「経歴不問」"
        },
        {
            name: "『異能特区シンギュラリティ』",
            image: "inoutokku_KV.jpg",
            desc: "ここはセカンドたちが収容された【異能特区】裏切り、焦燥、希望、絶望……、生き残るのは■■だ。"
        },
        {
            name: "『檻見る5人』",
            image: "orimiru_sns.png",
            desc: "ここには10年前の事件の関係者がいる……牢獄のボスに促され、受刑者たちは10年前の事件の話を始めた。"
        },
        {
            name: "『空色時箱-ソライロタイムカプセル-』",
            image: "sorairo_sns.png",
            desc: "青春の思い出と後悔が詰まった教室で、きっと僕らは、あの頃の話をする。苦すぎる過去を精算するために……"
        },        
        {
            name: "『廻る弾丸輪舞曲』",
            image: "弾丸輪舞曲_KV印刷用.jpg",
            desc: "舞台は、闇カジノ クラブ・バラライカ――王国は今夜、終焉を迎える。その行く末は廻る弾丸だけが知っていた。"
        },        
        {
            name: "『ゼロの爆弾』",
            image: "キービジュアル (1).png",
            desc: "意識が覚醒するとそこは見知らぬ部屋だった。無機質で、冷たい部屋。右腹部に違和感を覚える。肌の内側を撫でる異物感と確かな重み。"
        },        
        {
            name: "『THE REAL FOLK '30s』",
            image: "THE_REAL_FOLK_30s_KV_250307.png",
            desc: "1930年。ここは、アメリカ、ペンシルベニア州。違法酒場『Club30』の落成を記念したパーティーが行われ――密かに殺人が起きた。"
        },
        {
            name: "『マーダー・オブ・エクスプローラー』",
            image: "表紙.png",
            desc: "時代は1950年代。南米アマゾンの奥地に発見された、古代文明の遺跡。不穏な死の気配が漂う遺跡の中、それでも探検隊は冒険を進めていく。"
        },           
        {
            name: "『漣の向こう側』",
            image: "漣の向こう側.png",
            desc: "ある日【後呂レイ】と名乗る人物からのメールが届く。見覚えのない名前、「みんなで集まろうよ」と書かれた意味不明な内容。"
        }, 
        {
            name: "『くずの葉のもり』",
            image: "kuzunoha_sns.png",
            desc: "昭和二十六年、二月、故 大野木政嗣七回忌の法要の席でのことだった。"
        }, 
        {
            name: "『コロシタバッドエンド』",
            image: "koroshitabadend.jpg",
            desc: "被害者Shindaをコロシタ犯人を特定しBADENDを回避せよ！投票から始まる新感覚マダミス！"
        },
        {
            name: "『緋色と聖剣』",
            image: "キービジュアル(2).png",
            desc: "ここは剣と魔法が活躍する世界。勇者一行は魔王を討伐するべく冒険をしていた。とある日、仲間の商人が伝説の聖剣が眠っているとされる村の話をした。"
        },
        {
            name: "『ゼロ・オルビット』",
            image: "09_zeroorbit_kv.png",
            desc: "時代は近未来。地球の静止軌道上に浮かぶ超巨大住居施設の医療区で、防衛セクター最高責任者の遺体が発見された。"
        },
        {
            name: "『機巧人形の心臓』",
            image: "automata_KV_qw_nashi.jpg",
            desc: "海上に浮かぶ孤島、コリドー。世界と切り離されてから長い年月が過ぎたその島には、二種類の命があった。"
        }, 
        {
            name: "『すべては山荘から始まる。』",
            image: "すべ山.png",
            desc: "山荘に集まった男女6名は回想する。電波の届かない山奥で1年前に何が起きていたのか？"
        },   
        {
            name: "『空籠のコマドリ』",
            image: "202667619190646.png",
            desc: "……頭がぼんやりする。ここはどこだろう。壁も、天井も、床も。何もかも真っ白な部屋には窓はない。"
        }

    ];

    function initOmikuji() {
        shakeAmount = 0;
        isRevealed = false;
        gaugeBar.style.width = '0%';
        
        // Reset styles and animations
        omikujiContainer.style.transform = `translate(0px, 0px) rotate(0deg)`;
        omikujiContainer.classList.remove('shake-animation', 'upside-down'); // Removed extra classes
        document.body.classList.remove('flash-effect'); // Reset flash effect
        
        // Remove old result animation classes if needed (hack to re-trigger CSS animations)
        const paperContent = document.querySelector('.paper-content');
        if (paperContent) {
            paperContent.style.animation = 'none';
            paperContent.offsetHeight; // trigger reflow
            paperContent.style.animation = null;
        }

        stepResult.classList.remove('active');
        stepShake.classList.add('active');
        instructionP.classList.remove('hidden'); // Ensure instruction is visible
        instructionP.textContent = "筒を振ってね！";
    }

    function rollPrize() {
        const randomIndex = Math.floor(Math.random() * prizes.length);
        const selected = prizes[randomIndex];
        
        resultTitle.textContent = selected.name;
        // Construct the image path relative to the HTML file (assuming images are in image/ folder)
        resultImage.src = "image/" + selected.image;
        resultDesc.textContent = selected.desc;
        
        // Remove 'loss' class just in case it was added previously
        resultArea.classList.remove("loss");
    }

    function triggerReveal() {
        if (isRevealed) return;
        isRevealed = true;
        
        // Snap container back to center and turn upside down
        omikujiContainer.style.transform = `translate(0px, 0px)`;
        omikujiContainer.style.transition = `transform 0.1s`;
        
        // Remove shake, add upside down animation
        omikujiContainer.classList.remove('shake-animation');
        omikujiContainer.classList.add('upside-down');
        instructionP.classList.add('hidden'); // Hide the instruction completely instead of showing text
        
        // Add screen flash effect
        document.body.classList.add('flash-effect');
        
        createParticles();

        // Wait a moment for the flip/drop animation, then show result
        setTimeout(() => {
            stepShake.classList.remove('active');
            stepResult.classList.add('active');
            rollPrize();
        }, 1500); // Slightly longer to finish flip and flash
    }

    // Drag / Touch Logic
    function handleStart(e) {
        if (isRevealed) return;
        isDragging = true;
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
        omikujiContainer.style.transition = 'none'; // disable transition while dragging
    }

    function handleMove(e) {
        if (!isDragging || isRevealed) return;
        // Prevent default scrolling when dragging the cylinder
        e.preventDefault();
        
        const pos = getPos(e);
        const deltaX = pos.x - lastX;
        const deltaY = pos.y - lastY;
        
        // Calculate movement distance
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Accumulate shake amount (multiply by a factor to make it feel right)
        shakeAmount += distance * 1.5;
        
        // Update gauge
        let percent = (shakeAmount / SHAKE_THRESHOLD) * 100;
        if (percent > 100) percent = 100;
        gaugeBar.style.width = `${percent}%`;
        
        // Visually move the cylinder based on drag
        // Apply a little rotation based on X movement
        const maxOffset = 50;
        let visualX = deltaX * 0.5;
        let visualY = deltaY * 0.5;
        
        // Clamp visual movement
        visualX = Math.max(-maxOffset, Math.min(maxOffset, visualX));
        visualY = Math.max(-maxOffset, Math.min(maxOffset, visualY));
        const rotate = visualX * 0.2;

        omikujiContainer.style.transform = `translate(${visualX}px, ${visualY}px) rotate(${rotate}deg)`;
        
        lastX = pos.x;
        lastY = pos.y;
        
        if (shakeAmount >= SHAKE_THRESHOLD) {
            isDragging = false;
            triggerReveal();
        }
    }

    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        if (!isRevealed) {
            // Spring back to center
            omikujiContainer.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            omikujiContainer.style.transform = 'translate(0px, 0px) rotate(0deg)';
            
            // Gradually decay shake amount if they stop shaking?
            // Could add an interval here, but for simplicity, let's let them keep the gauge for a bit.
        }
    }

    function getPos(e) {
        return {
            x: e.touches ? e.touches[0].clientX : e.clientX,
            y: e.touches ? e.touches[0].clientY : e.clientY
        };
    }

    // Event Listeners for the Container
    omikujiContainer.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    
    omikujiContainer.addEventListener('touchstart', handleStart, {passive: false});
    window.addEventListener('touchmove', handleMove, {passive: false});
    window.addEventListener('touchend', handleEnd);

    btnRestart.addEventListener('click', () => {
        initOmikuji();
    });

    // Particle effect
    function createParticles() {
        const container = document.getElementById('particles-container');
        container.innerHTML = '';
        
        const colors = ['#f44336', '#ffeb3b', '#2196f3', '#4caf50', '#ff9800'];
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random styling
            const size = Math.random() * 8 + 4;
            const bg = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = bg;
            
            // Start position (around the cylinder top)
            const startX = window.innerWidth / 2;
            const startY = window.innerHeight / 2 - 50;
            
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            
            // Animation config
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 100; // bias upwards
            
            container.appendChild(particle);
            
            // Perform animation using Web Animations API
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0, .9, .57, 1)',
                fill: 'forwards'
            });
        }
    }
    
    // Auto-decay gauge to make it slightly challenging
    setInterval(() => {
        if (!isRevealed && !isDragging && shakeAmount > 0) {
            shakeAmount -= 20;
            if (shakeAmount < 0) shakeAmount = 0;
            const percent = (shakeAmount / SHAKE_THRESHOLD) * 100;
            gaugeBar.style.width = `${percent}%`;
        }
    }, 100);

    // Initialize state
    initOmikuji();
});

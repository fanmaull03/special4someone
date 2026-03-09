// Logika Buka Surat
let isOpened = false;
function openEnvelope() {
  if (isOpened) return;
  isOpened = true;

  // Putar musik — aman dari blokir browser karena dipicu langsung dari klik user
  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic) {
    bgMusic.play().catch(e => console.log("Audio error:", e));
  }

  const env = document.getElementById("envelope");
  const letter = document.getElementById("envLetter");
  const hint = document.getElementById("clickHint");

  hint.style.opacity = "0"; // Sembunyikan teks klik
  env.classList.add("open");

  // Tunggu animasi flap, lalu bawa surat ke depan dan naikkan
  setTimeout(() => {
    letter.style.zIndex = "6";
    letter.style.transform = "translateY(-100px)";
  }, 500);

  // Tunggu sebentar setelah baca, lalu pindah halaman
  setTimeout(() => {
    document.getElementById("envelopeScreen").classList.add("hidden");
    initMainScreen();
  }, 3000);
}

function initMainScreen() {
  document.getElementById("mainScreen").classList.add("visible");
  initFloatingIcons();

  // Memulai efek mengetik setelah jeda 1 detik (setelah layar utama muncul)
  setTimeout(() => {
    const textToType =
      "aku tau kita emang masih bisa dibilang strangers. tapi honestly aku ada keinginan buat kenal kamu lebih deket. <br><br><b>so.. aku mau izin ngajak kamu bukber gimana la?</b>";

    typeWriterHTML("typedText", textToType, 50, () => {
      // Tampilkan tombol setelah teks selesai diketik
      const btn = document.getElementById("btnGroup");
      btn.style.opacity = "1";
      btn.style.visibility = "visible";
    });
  }, 1000);
}

// Fungsi Efek Mengetik dengan support Tag HTML
function typeWriterHTML(elementId, htmlString, speed, callback) {
  let el = document.getElementById(elementId);
  let i = 0;
  let isTag = false;
  let text = "";

  function type() {
    if (i < htmlString.length) {
      let char = htmlString.charAt(i);
      if (char === "<") isTag = true;
      if (char === ">") isTag = false;

      text += char;
      el.innerHTML = text + (isTag ? "" : "<span class='cursor'>|</span>");
      i++;

      if (isTag) {
        type(); // Skip delay jika sedang memproses tag HTML
      } else {
        // Berikan sedikit jeda acak agar ketikan terlihat lebih natural
        let randomSpeed = speed + (Math.random() * 30 - 15);
        setTimeout(type, randomSpeed);
      }
    } else {
      el.innerHTML = text; // Hapus kursor di akhir
      if (callback) callback();
    }
  }

  el.innerHTML = "<span class='cursor'>|</span>";
  type();
}

// Animasi Antigravity Ikon Ramadan
function initFloatingIcons() {
  const bg = document.getElementById("bgItems");
  if (bg.innerHTML !== "") return; // cegah double render
  const icons = ["💖", "✨", "🌸", "💕", "💗"];

  for (let i = 0; i < 25; i++) {
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = icons[Math.floor(Math.random() * icons.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = Math.random() * 100 + "vh";
    el.style.fontSize = Math.random() * (35 - 20) + 20 + "px";
    el.style.animationDelay = Math.random() * 5 + "s";
    el.style.animationDuration = Math.random() * 4 + 4 + "s";
    bg.appendChild(el);
  }
}

// Logika tombol "Enggak" yang kabur
function runAway() {
  const noBtn = document.getElementById("noBtn");

  // Pindahkan ke body di trigger pertama agar posisinya relatif terhadap viewport penuh
  if (noBtn.parentElement.id === "btnGroup") {
    const rect = noBtn.getBoundingClientRect();
    document.body.appendChild(noBtn);

    noBtn.style.position = "fixed";
    noBtn.style.left = rect.left + "px";
    noBtn.style.top = rect.top + "px";
    noBtn.style.zIndex = "9999";

    // Force reflow agar animasi berjalan mulus dari titik awal
    noBtn.offsetHeight;
  }

  // Mengatasi batas layar agar tombol tidak keluar layar
  const maxX = window.innerWidth - noBtn.offsetWidth - 20;
  const maxY = window.innerHeight - noBtn.offsetHeight - 20;

  const randomX = Math.max(20, Math.floor(Math.random() * maxX));
  const randomY = Math.max(20, Math.floor(Math.random() * maxY));

  noBtn.style.transition = "left 0.2s ease-out, top 0.2s ease-out";
  noBtn.style.left = randomX + "px";
  noBtn.style.top = randomY + "px";
}

// Logika saat diterima
function accepted() {
  document.getElementById("askSection").style.display = "none";
  document.getElementById("finalMessage").style.display = "block";

  // Ganti background jadi lebih ceria (Pink dan blue)
  document.body.style.background = "linear-gradient(135deg, #ffb6c1, #87cefa)";

  // Tutup semua floating ramadan items
  document.getElementById("bgItems").style.opacity = "0";

  // Efek hujan bintang
  setInterval(createStar, 100);
}

function createStar() {
  const star = document.createElement("div");
  star.innerHTML = "💖";
  star.style.position = "fixed";
  star.style.left = Math.random() * 100 + "vw";
  star.style.top = "-20px";
  star.style.fontSize = "20px";
  star.style.transition = "transform 3s linear";
  star.style.zIndex = "100";
  document.body.appendChild(star);

  setTimeout(() => {
    star.style.transform = `translateY(${window.innerHeight + 50}px)`;
  }, 50);

  setTimeout(() => star.remove(), 3000);
}

// Logika Kirim WhatsApp
function sendToWhatsApp() {
  const jadwal = document.getElementById("jadwalInput").value;
  if (!jadwal.trim()) {
    alert("Jangan lupa diisi tanggal dan jamnya ya Lala!");
    return;
  }

  // Ganti nomor ini dengan nomormu (format: 628xxxxxxxxxx tanpa awalan 0 atau +)
  const phoneNumber = "6285229141150";
  const message = `Hi ivanka, iya deh aku mau bukber sama kamu! Aku bisanya: ${jadwal}. Jemput ya! hihi 😊`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
}

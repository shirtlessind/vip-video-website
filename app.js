let currentBasePrice = 0;
let currentCurrency = 'IDR';
let appliedDiscount = 0;

document.addEventListener("DOMContentLoaded", function() {
  if (window.lucide) { lucide.createIcons(); }
  loadAnnouncements();
});

// LOAD PENGUMUMAN (GAMBAR KIRI, ISI KANAN & SELENGKAPNYA>>)
function loadAnnouncements() {
  const container = document.getElementById('announcementList');
  if (!container) return;

  const storedData = localStorage.getItem('vip_announcements');
  let announcements = storedData ? JSON.parse(storedData) : [
    {
      title: "Diskon Promo HUT RI ke-81 TH",
      date: "19/08/2026",
      text: "Akses VIP Channel disc up to 50%! Gunakan kode promo khusus yang tersedia di pendaftaran untuk mengklaim promo ini secara langsung.",
      img: "promo-agustus.jpeg"
    },
    {
      title: "Mendapatkan 3 Grup VIP Sekaligus",
      date: "18/08/2026",
      text: "Akses langsung ke VIP ALPA SQUAD, BONUS ALPA SQUAD, & CHAT GRUP. Bebas request video ke Admin @glg_md tanpa batasan waktu.",
      img: "harga-normal.jpeg"
    }
  ];

  container.innerHTML = announcements.map((item, index) => {
    const isLong = item.text.length > 100;
    const shortText = isLong ? item.text.substring(0, 100) + "..." : item.text;
    const imgHtml = item.img ? `<img src="${item.img}" class="announcement-img" alt="Pengumuman">` : `<div style="width:100%; height:180px; background:var(--bg-dark); border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--text-muted)">Tanpa Gambar</div>`;

    return `
      <div class="card announcement-card">
        <div>${imgHtml}</div>
        <div class="announcement-content">
          <small style="color:var(--text-muted); display:block; margin-bottom:4px;">${item.date}</small>
          <h3>${item.title}</h3>
          <p class="announcement-text" id="text-${index}">${shortText}</p>
          ${isLong ? `<button class="read-more-btn" id="btn-${index}" onclick="toggleReadMore(${index}, \`${item.text.replace(/`/g, "\\`")}\`)">Selengkapnya >></button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function toggleReadMore(index, fullText) {
  const textEl = document.getElementById(`text-${index}`);
  const btnEl = document.getElementById(`btn-${index}`);

  if (btnEl.innerText.includes("Selengkapnya")) {
    textEl.innerText = fullText;
    btnEl.innerText = "<< Sembunyikan";
  } else {
    textEl.innerText = fullText.substring(0, 100) + "...";
    btnEl.innerText = "Selengkapnya >>";
  }
}

// MODAL ADMIN LOGIN
function openLoginModal() { document.getElementById('loginModal').style.display = 'block'; }
function closeLoginModal() { document.getElementById('loginModal').style.display = 'none'; }

function processAdminLogin() {
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;

  if (user === "admin" && pass === "admin123") {
    localStorage.setItem('admin_logged_in', 'true');
    window.location.href = "admin.html";
  } else {
    alert("Username atau Password salah!");
  }
}

// CHECKOUT & PROMO
function openCheckoutModal(paketName, price, currency) {
  currentBasePrice = price;
  currentCurrency = currency;
  appliedDiscount = 0;
  
  document.getElementById('modalPaket').value = paketName;
  document.getElementById('promoCodeInput').value = '';
  document.getElementById('promoMessage').innerText = '';
  
  updateDisplayPrice();
  document.getElementById('checkoutModal').style.display = 'block';
}

function closeCheckoutModal() { document.getElementById('checkoutModal').style.display = 'none'; }

function updateDisplayPrice() {
  let finalPrice = currentBasePrice * (1 - appliedDiscount / 100);
  let priceString = "";

  if (currentCurrency === 'IDR') priceString = "Rp " + Math.round(finalPrice).toLocaleString('id-ID');
  else if (currentCurrency === 'MYR') priceString = finalPrice.toFixed(2) + " RM";
  else if (currentCurrency === 'USD') priceString = finalPrice.toFixed(2) + " USD";

  document.getElementById('modalHarga').value = priceString;
}

function applyPromoCode() {
  const code = document.getElementById('promoCodeInput').value.trim().toUpperCase();
  const msg = document.getElementById('promoMessage');
  const promoSettings = JSON.parse(localStorage.getItem('vip_promo_settings')) || {
    code: "HUTRI81", discount: 50, startDate: "2026-08-01", endDate: "2026-08-31"
  };

  const today = new Date().toISOString().split('T')[0];

  if (code === promoSettings.code) {
    if (today >= promoSettings.startDate && today <= promoSettings.endDate) {
      appliedDiscount = parseFloat(promoSettings.discount);
      msg.style.color = "#22c55e";
      msg.innerText = `Kode promo berhasil! Diskon ${appliedDiscount}% diterapkan.`;
      updateDisplayPrice();
    } else {
      msg.style.color = "#ef4444";
      msg.innerText = "Kode promo sudah kadaluarsa atau belum berlaku.";
    }
  } else {
    msg.style.color = "#ef4444";
    msg.innerText = "Kode promo tidak valid!";
  }
}

function sendOrder(platform) {
  const name = document.getElementById('userName').value;
  const contact = document.getElementById('userContact').value;
  const paket = document.getElementById('modalPaket').value;
  const harga = document.getElementById('modalHarga').value;
  const proofImg = document.getElementById('paymentProofImg').files[0];

  if (!name || !contact || !proofImg) {
    alert("Harap lengkapi nama, kontak, dan unggah foto bukti transfer!");
    return;
  }

  const text = `Halo Admin, saya ingin konfirmasi pendaftaran VIP:%0A- *Nama*: ${name}%0A- *Kontak*: ${contact}%0A- *Paket*: ${paket}%0A- *Total Bayar*: ${harga}%0A- *Bukti Transfer*: (Telah dilampirkan screenshot)`;

  if (platform === 'whatsapp') {
    window.open(`https://wa.me/6281933712555?text=${text}`, '_blank');
  } else {
    window.open(`https://t.me/glg_md`, '_blank');
  }
}

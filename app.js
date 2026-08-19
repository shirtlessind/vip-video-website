let currentBasePrice = 0;
let currentCurrency = 'IDR';
let appliedDiscount = 0;

// Load Pengumuman dan Gambar Fallback
document.addEventListener("DOMContentLoaded", function() {
  lucide.createIcons();
  loadAnnouncements();
});

function loadAnnouncements() {
  const container = document.getElementById('announcementList');
  const storedData = localStorage.getItem('vip_announcements');
  let announcements = storedData ? JSON.parse(storedData) : [
    {
      title: "Diskon Promo HUT RI ke-81 TH",
      date: "19/08/2026",
      badge: "PROMO HUT RI",
      text: "Akses VIP Channel disc up to 50%! Gunakan kode promo khusus yang tersedia di promo banner.",
      img: "promo-agustus.jpeg"
    },
    {
      title: "Mendapatkan 3 Grup VIP Sekaligus",
      date: "18/08/2026",
      badge: "VIP BENEFITS",
      text: "Akses langsung ke VIP ALPA SQUAD, BONUS ALPA SQUAD, & CHAT GRUP. Bebas request video ke Admin @glg_md.",
      img: "harga-normal.jpeg"
    }
  ];

  container.innerHTML = announcements.map(item => `
    <div class="card card-hover" style="margin-bottom: 1rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
        <span class="badge">${item.badge}</span>
        <small style="color:var(--text-muted);">${item.date}</small>
      </div>
      <h3 style="margin-bottom:0.5rem;">${item.title}</h3>
      ${item.img ? `<img src="${item.img}" style="width:100%; max-height:250px; object-fit:cover; border-radius:8px; margin: 0.8rem 0;">` : ''}
      <p style="color:var(--text-muted);">${item.text}</p>
    </div>
  `).join('');
}

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

function closeCheckoutModal() {
  document.getElementById('checkoutModal').style.display = 'none';
}

function updateDisplayPrice() {
  let finalPrice = currentBasePrice * (1 - appliedDiscount / 100);
  let priceString = "";

  if (currentCurrency === 'IDR') {
    priceString = "Rp " + Math.round(finalPrice).toLocaleString('id-ID');
  } else if (currentCurrency === 'MYR') {
    priceString = finalPrice.toFixed(2) + " RM";
  } else if (currentCurrency === 'USD') {
    priceString = finalPrice.toFixed(2) + " USD";
  }

  document.getElementById('modalHarga').value = priceString;
}

function applyPromoCode() {
  const code = document.getElementById('promoCodeInput').value.trim().toUpperCase();
  const msg = document.getElementById('promoMessage');
  const promoSettings = JSON.parse(localStorage.getItem('vip_promo_settings')) || {
    code: "HUTRI81",
    discount: 50,
    startDate: "2026-08-01",
    endDate: "2026-08-31"
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

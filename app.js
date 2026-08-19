// Data Kontak Admin Utama
const ADMIN_WA = "6281933712555"; 
const ADMIN_TG = "glg_md";

// Firebase Setup
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Navigation & Animations
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('active');
});

const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;
  revealElements.forEach(el => {
    if (el.getBoundingClientRect().top < triggerBottom) el.classList.add('active');
  });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Modal Handlers
function openCheckoutModal(paket, harga) {
  document.getElementById('modalPaket').value = paket;
  document.getElementById('modalHarga').value = harga;
  document.getElementById('checkoutModal').style.display = 'block';
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').style.display = 'none';
}

// Send Order to Admin WhatsApp / Telegram
function sendOrder(platform) {
  const paket = document.getElementById('modalPaket').value;
  const harga = document.getElementById('modalHarga').value;
  const name = document.getElementById('userName').value;
  const contact = document.getElementById('userContact').value;
  const proof = document.getElementById('paymentProof').value;

  if(!name || !contact || !proof) {
    alert("Harap lengkapi semua kolom pendaftaran terlebih dahulu!");
    return;
  }

  const message = `Halo Admin VIP Video Media (@glg_md),
Saya ingin konfirmasi pendaftaran VIP Channel:

` +
    `📌 *Paket:* ${paket}
` +
    `💰 *Nominal Bayar:* ${harga}
` +
    `👤 *Nama Lengkap:* ${name}
` +
    `📱 *Kontak User:* ${contact}
` +
    `🧾 *Bukti/Ref Transfer:* ${proof}
` +
    `⏳ *Status:* PENDING APPROVAL

` +
    `Mohon disetujui & dikirimkan link akses 3 Grup VIP. Terima kasih!`;

  if(platform === 'whatsapp') {
    const waUrl = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  } else if(platform === 'telegram') {
    const tgUrl = `https://t.me/${ADMIN_TG}?text=${encodeURIComponent(message)}`;
    window.open(tgUrl, '_blank');
  }
}

// Fetch Dynamic Announcements
async function loadAnnouncements() {
  const container = document.getElementById('announcementList');
  try {
    const snapshot = await db.collection('announcements').orderBy('createdAt', 'desc').get();
    if(snapshot.empty) {
      const res = await fetch('data-fallback.json');
      const fallback = await res.json();
      renderAnnouncements(fallback.announcements, container);
    } else {
      let list = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      renderAnnouncements(list, container);
    }
  } catch(err) {
    const res = await fetch('data-fallback.json');
    const fallback = await res.json();
    renderAnnouncements(fallback.announcements, container);
  }
  lucide.createIcons();
}

function renderAnnouncements(items, container) {
  container.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card card-hover';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
        <span class="badge">${item.category || 'INFO'}</span>
        <small style="color:var(--text-muted)">${item.date || ''}</small>
      </div>
      <h3 style="margin-bottom:8px;">${item.title}</h3>
      <p style="color:var(--text-muted);">${item.content}</p>
    `;
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', loadAnnouncements);

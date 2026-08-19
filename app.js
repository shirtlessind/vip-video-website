// Konfigurasi Firebase (Ganti dengan Config milik Anda dari Firebase Console)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
  };
  
  // Inisialisasi Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // 1. Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  // 2. Scroll Reveal Animation Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) el.classList.add('active');
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger awal saat load
  
  // 3. Load Pengumuman Dinamis & Settings dari Firestore
  async function loadDynamicContent() {
    const container = document.getElementById('announcementList');
    
    try {
      // Ambil Pengumuman (Terbaru di atas)
      const snapshot = await db.collection('announcements').orderBy('createdAt', 'desc').get();
      
      if (snapshot.empty) {
        // Fallback ke file JSON lokal jika Firebase kosong
        const res = await fetch('data-fallback.json');
        const fallbackData = await res.json();
        renderAnnouncements(fallbackData.announcements, container);
      } else {
        let announcements = [];
        snapshot.forEach(doc => announcements.push({ id: doc.id, ...doc.data() }));
        renderAnnouncements(announcements, container);
      }
  
      // Ambil Config Harga & Link Contact
      const configDoc = await db.collection('settings').doc('general').get();
      if(configDoc.exists) {
        const data = configDoc.data();
        if(data.priceBulanan) document.getElementById('priceBulanan').innerText = data.priceBulanan;
        if(data.priceLifetime) document.getElementById('priceLifetime').innerText = data.priceLifetime;
        if(data.linkTelegram) document.getElementById('btnTelegram').href = data.linkTelegram;
        if(data.linkWhatsapp) document.getElementById('btnWhatsapp').href = data.linkWhatsapp;
      }
  
    } catch (err) {
      console.warn('Gagal koneksi Firebase, menggunakan fallback JSON:', err);
      const res = await fetch('data-fallback.json');
      const fallbackData = await res.json();
      renderAnnouncements(fallbackData.announcements, container);
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
  
  document.addEventListener('DOMContentLoaded', loadDynamicContent);
// Konfigurasi Firebase (Gunakan config yang sama dengan app.js)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Auth Monitor
  auth.onAuthStateChanged(user => {
    if (user) {
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('dashboardSection').style.display = 'block';
    } else {
      document.getElementById('loginSection').style.display = 'block';
      document.getElementById('dashboardSection').style.display = 'none';
    }
  });
  
  // Login Handler
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPass').value;
    
    auth.signInWithEmailAndPassword(email, pass)
      .catch(err => alert("Gagal Login: " + err.message));
  });
  
  // Logout
  document.getElementById('btnLogout').addEventListener('click', () => auth.signOut());
  
  // Simpan Pengumuman Baru
  document.getElementById('announcementForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await db.collection('announcements').add({
      title: document.getElementById('postTitle').value,
      category: document.getElementById('postCategory').value.toUpperCase(),
      content: document.getElementById('postContent').value,
      date: new Date().toLocaleDateString('id-ID'),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert('Pengumuman berhasil di-publish!');
    e.target.reset();
  });
  
  // Simpan Settings
  document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await db.collection('settings').doc('general').set({
      priceBulanan: document.getElementById('setPriceBulanan').value,
      priceLifetime: document.getElementById('setPriceLifetime').value,
      linkTelegram: document.getElementById('setLinkTg').value,
      linkWhatsapp: document.getElementById('setLinkWa').value
    }, { merge: true });
    alert('Pengaturan berhasil diperbarui!');
  });
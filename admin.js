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

// Login Form Handling (dimasss / 12345678)
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('adminUsername').value;
  const pass = document.getElementById('adminPassword').value;

  if (user === "dimasss" && pass === "12345678") {
    localStorage.setItem('adminSession', 'true');
    checkAdminSession();
  } else {
    alert("Username atau Password Admin Salah!");
  }
});

function checkAdminSession() {
  const isLogged = localStorage.getItem('adminSession');
  if (isLogged === 'true') {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
  } else {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
  }
}

function logoutAdmin() {
  localStorage.removeItem('adminSession');
  checkAdminSession();
}

// Simpan Pengumuman ke Firebase
document.getElementById('announcementForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await db.collection('announcements').add({
      title: document.getElementById('postTitle').value,
      category: document.getElementById('postCategory').value.toUpperCase(),
      content: document.getElementById('postContent').value,
      date: new Date().toLocaleDateString('id-ID'),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert('Pengumuman berhasil dipublish ke landing page!');
    e.target.reset();
  } catch(err) {
    alert("Gagal menyimpan pengumuman: " + err.message);
  }
});

document.addEventListener('DOMContentLoaded', checkAdminSession);

document.addEventListener("DOMContentLoaded", function() {
  if (window.lucide) {
    lucide.createIcons();
  }
  loadCurrentPromo();
});

// Fungsi Switch Menu Tab
function switchTab(tabName) {
  const tabs = document.querySelectorAll('.tab-content');
  const buttons = document.querySelectorAll('.tab-btn');

  tabs.forEach(tab => tab.classList.remove('active'));
  buttons.forEach(btn => btn.classList.remove('active'));

  if (tabName === 'pengumuman') {
    document.getElementById('tab-pengumuman').classList.add('active');
    buttons[0].classList.add('active');
  } else {
    document.getElementById('tab-diskon').classList.add('active');
    buttons[1].classList.add('active');
  }
}

// SIMPAN PENGUMUMAN
function simpanPengumuman() {
  const title = document.getElementById('annTitle').value.trim();
  const text = document.getElementById('annText').value.trim();
  const fileInput = document.getElementById('annImage');

  if (!title || !text) {
    alert("Harap isi Judul dan Keterangan yang wajib!");
    return;
  }

  const processSave = (imgBase64) => {
    const newAnnouncement = {
      title: title,
      text: text,
      badge: "PENGUMUMAN",
      date: new Date().toLocaleDateString('id-ID'),
      img: imgBase64 || ""
    };

    let listPengumuman = JSON.parse(localStorage.getItem('vip_announcements')) || [];
    listPengumuman.unshift(newAnnouncement);
    localStorage.setItem('vip_announcements', JSON.stringify(listPengumuman));

    alert("Pengumuman berhasil dipublish!");
    document.getElementById('formPengumuman').reset();
  };

  if (fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      processSave(e.target.result);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    processSave("");
  }
}

// SIMPAN DISKON
function simpanDiskon() {
  const code = document.getElementById('promoCode').value.trim().toUpperCase();
  const startDate = document.getElementById('promoStartDate').value;
  const endDate = document.getElementById('promoEndDate').value;
  const discount = document.getElementById('promoDiscount').value;

  if (!code || !startDate || !endDate || !discount) {
    alert("Harap isi seluruh field pada form promo!");
    return;
  }

  const promoSettings = {
    code: code,
    startDate: startDate,
    endDate: endDate,
    discount: parseFloat(discount)
  };

  localStorage.setItem('vip_promo_settings', JSON.stringify(promoSettings));
  alert("Pengaturan Diskon berhasil disimpan!");
}

// LOAD EXISTING PROMO DATA
function loadCurrentPromo() {
  const data = JSON.parse(localStorage.getItem('vip_promo_settings'));
  if (data) {
    document.getElementById('promoCode').value = data.code || '';
    document.getElementById('promoStartDate').value = data.startDate || '';
    document.getElementById('promoEndDate').value = data.endDate || '';
    document.getElementById('promoDiscount').value = data.discount || '';
  }
}

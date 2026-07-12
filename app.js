// ==========================================
// IMPORT FIREBASE
// ==========================================

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ==========================================
// TETAPAN FIREBASE SMM SRBM
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyBdwAAJ6UwN4ekwDFepjrUJXPrIDM0x2qA",
  authDomain: "sistem-maklumat-murid-srbm.firebaseapp.com",
  projectId: "sistem-maklumat-murid-srbm",
  storageBucket: "sistem-maklumat-murid-srbm.firebasestorage.app",
  messagingSenderId: "532951554931",
  appId: "1:532951554931:web:d3551739b68420af1a0306"
};


// ==========================================
// MULAKAN FIREBASE DAN FIRESTORE
// ==========================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const koleksiMurid = collection(db, "murid");


// ==========================================
// ELEMEN HALAMAN
// ==========================================

const dashboardPage = document.getElementById("dashboardPage");
const muridPage = document.getElementById("muridPage");

const navButtons = document.querySelectorAll(".nav-button");

const btnBukaBorang = document.getElementById("btnBukaBorang");
const btnTambahMurid = document.getElementById("btnTambahMurid");

const modalMurid = document.getElementById("modalMurid");
const modalOverlay = document.getElementById("modalOverlay");
const btnTutupModal = document.getElementById("btnTutupModal");
const btnBatal = document.getElementById("btnBatal");

const borangMurid = document.getElementById("borangMurid");
const tajukBorang = document.getElementById("tajukBorang");
const btnSimpan = document.getElementById("btnSimpan");

const documentId = document.getElementById("documentId");

const noDaftar = document.getElementById("noDaftar");
const namaMurid = document.getElementById("namaMurid");
const jantina = document.getElementById("jantina");
const tarikhLahir = document.getElementById("tarikhLahir");
const tahun = document.getElementById("tahun");
const kelas = document.getElementById("kelas");
const noKadPengenalan =
  document.getElementById("noKadPengenalan");
const bangsa = document.getElementById("bangsa");
const agama = document.getElementById("agama");
const alamat = document.getElementById("alamat");
const namaPenjaga = document.getElementById("namaPenjaga");
const hubunganPenjaga =
  document.getElementById("hubunganPenjaga");
const telefonPenjaga =
  document.getElementById("telefonPenjaga");
const catatan = document.getElementById("catatan");

const carianMurid = document.getElementById("carianMurid");
const tapisTahun = document.getElementById("tapisTahun");
const tapisJantina = document.getElementById("tapisJantina");
const btnResetCarian = document.getElementById("btnResetCarian");

const senaraiMurid = document.getElementById("senaraiMurid");
const loadingMessage = document.getElementById("loadingMessage");
const emptyMessage = document.getElementById("emptyMessage");
const jadualMurid = document.getElementById("jadualMurid");

const jumlahRekodDipaparkan =
  document.getElementById("jumlahRekodDipaparkan");

const notification = document.getElementById("notification");
const notificationMessage =
  document.getElementById("notificationMessage");


// ==========================================
// DATA SEMENTARA
// ==========================================

let semuaMurid = [];


// ==========================================
// NAVIGASI HALAMAN
// ==========================================

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    const page = button.dataset.page;

    dashboardPage.classList.remove("active");
    muridPage.classList.remove("active");

    if (page === "murid") {
      muridPage.classList.add("active");
    } else {
      dashboardPage.classList.add("active");
    }
  });
});


// ==========================================
// BUKA DAN TUTUP MODAL
// ==========================================

function bukaModalTambah() {
  borangMurid.reset();
  documentId.value = "";

  tajukBorang.textContent = "Tambah Murid";
  btnSimpan.textContent = "Simpan Maklumat";

  modalMurid.classList.remove("hidden");
  modalMurid.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  setTimeout(() => {
    noDaftar.focus();
  }, 100);
}


function tutupModal() {
  modalMurid.classList.add("hidden");
  modalMurid.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
  borangMurid.reset();
  documentId.value = "";
}


btnBukaBorang.addEventListener("click", bukaModalTambah);
btnTambahMurid.addEventListener("click", bukaModalTambah);
btnTutupModal.addEventListener("click", tutupModal);
btnBatal.addEventListener("click", tutupModal);
modalOverlay.addEventListener("click", tutupModal);


document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    !modalMurid.classList.contains("hidden")
  ) {
    tutupModal();
  }
});


// ==========================================
// NOTIFIKASI
// ==========================================

function paparNotifikasi(mesej, jenis = "success") {
  notificationMessage.textContent = mesej;

  notification.classList.remove("hidden", "error");

  if (jenis === "error") {
    notification.classList.add("error");
  }

  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3500);
}


// ==========================================
// BERSIHKAN TEKS
// ==========================================

function bersihkanTeks(teks) {
  return String(teks ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// ==========================================
// SIMPAN ATAU KEMAS KINI MURID
// ==========================================

borangMurid.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nomborDaftarBersih =
    noDaftar.value.trim().toUpperCase();

  const namaBersih =
    namaMurid.value.trim().toUpperCase();

  const kelasBersih =
    kelas.value.trim().toUpperCase();

  if (
    !nomborDaftarBersih ||
    !namaBersih ||
    !jantina.value ||
    !tahun.value ||
    !kelasBersih
  ) {
    paparNotifikasi(
      "Sila lengkapkan semua ruangan wajib.",
      "error"
    );

    return;
  }

  const idSemasa = documentId.value;

  const nomborDaftarSama = semuaMurid.find((murid) => {
    return (
      String(murid.noDaftar).toUpperCase() ===
        nomborDaftarBersih &&
      murid.id !== idSemasa
    );
  });

  if (nomborDaftarSama) {
    paparNotifikasi(
      "Nombor daftar ini sudah digunakan.",
      "error"
    );

    return;
  }

  const dataMurid = {
    noDaftar: nomborDaftarBersih,
    namaMurid: namaBersih,
    jantina: jantina.value,
    tarikhLahir: tarikhLahir.value,
    tahun: tahun.value,
    kelas: kelasBersih,
    noKadPengenalan:
      noKadPengenalan.value.trim().toUpperCase(),
    bangsa: bangsa.value.trim(),
    agama: agama.value.trim(),
    alamat: alamat.value.trim(),
    namaPenjaga: namaPenjaga.value.trim().toUpperCase(),
    hubunganPenjaga: hubunganPenjaga.value,
    telefonPenjaga: telefonPenjaga.value.trim(),
    catatan: catatan.value.trim(),
    dikemasKiniPada: serverTimestamp()
  };

  try {
    btnSimpan.disabled = true;

    if (idSemasa) {
      btnSimpan.textContent = "Mengemas kini...";

      const rujukanMurid = doc(db, "murid", idSemasa);

      await updateDoc(rujukanMurid, dataMurid);

      paparNotifikasi(
        "Maklumat murid berjaya dikemas kini."
      );
    } else {
      btnSimpan.textContent = "Menyimpan...";

      dataMurid.diciptaPada = serverTimestamp();

      await addDoc(koleksiMurid, dataMurid);

      paparNotifikasi(
        "Maklumat murid berjaya disimpan."
      );
    }

    tutupModal();
  } catch (error) {
    console.error("Ralat menyimpan data:", error);

    paparNotifikasi(
      "Data tidak dapat disimpan. Semak sambungan Firebase.",
      "error"
    );
  } finally {
    btnSimpan.disabled = false;
    btnSimpan.textContent = "Simpan Maklumat";
  }
});


// ==========================================
// PAPAR DATA DARIPADA FIRESTORE
// ==========================================

onSnapshot(
  koleksiMurid,

  (snapshot) => {
    semuaMurid = snapshot.docs.map((dokumen) => {
      return {
        id: dokumen.id,
        ...dokumen.data()
      };
    });

    semuaMurid.sort((a, b) => {
      const tahunA = Number(a.tahun || 0);
      const tahunB = Number(b.tahun || 0);

      if (tahunA !== tahunB) {
        return tahunA - tahunB;
      }

      return String(a.namaMurid || "")
        .localeCompare(String(b.namaMurid || ""));
    });

    loadingMessage.classList.add("hidden");

    paparSenaraiMurid();
    kemasKiniDashboard();
  },

  (error) => {
    console.error("Ralat membaca Firestore:", error);

    loadingMessage.textContent =
      "Data tidak dapat dimuatkan. Semak Firestore dan Rules.";

    paparNotifikasi(
      "Data murid tidak dapat dimuatkan.",
      "error"
    );
  }
);


// ==========================================
// PAPAR SENARAI MURID
// ==========================================

function paparSenaraiMurid() {
  const kataCarian =
    carianMurid.value.trim().toLowerCase();

  const tahunDipilih = tapisTahun.value;
  const jantinaDipilih = tapisJantina.value;

  const dataDitapis = semuaMurid.filter((murid) => {
    const nama =
      String(murid.namaMurid || "").toLowerCase();

    const nombor =
      String(murid.noDaftar || "").toLowerCase();

    const kadPengenalan =
      String(murid.noKadPengenalan || "").toLowerCase();

    const padanCarian =
      nama.includes(kataCarian) ||
      nombor.includes(kataCarian) ||
      kadPengenalan.includes(kataCarian);

    const padanTahun =
      !tahunDipilih ||
      String(murid.tahun) === tahunDipilih;

    const padanJantina =
      !jantinaDipilih ||
      murid.jantina === jantinaDipilih;

    return padanCarian && padanTahun && padanJantina;
  });

  jumlahRekodDipaparkan.textContent = dataDitapis.length;
  senaraiMurid.innerHTML = "";

  if (dataDitapis.length === 0) {
    jadualMurid.classList.add("hidden");
    emptyMessage.classList.remove("hidden");

    if (semuaMurid.length > 0) {
      emptyMessage.innerHTML = `
        <div class="empty-icon">🔍</div>
        <h3>Tiada rekod ditemui</h3>
        <p>Cuba ubah carian atau tapisan.</p>
      `;
    } else {
      emptyMessage.innerHTML = `
        <div class="empty-icon">📋</div>
        <h3>Belum ada rekod murid</h3>
        <p>
          Tekan butang “Tambah Murid”
          untuk memasukkan rekod.
        </p>
      `;
    }

    return;
  }

  jadualMurid.classList.remove("hidden");
  emptyMessage.classList.add("hidden");

  dataDitapis.forEach((murid, index) => {
    const baris = document.createElement("tr");

    const kelasJantina =
      murid.jantina === "Perempuan"
        ? "badge-perempuan"
        : "badge-lelaki";

    baris.innerHTML = `
      <td>${index + 1}</td>

      <td>
        <strong>
          ${bersihkanTeks(murid.noDaftar || "-")}
        </strong>
      </td>

      <td class="student-name">
        ${bersihkanTeks(murid.namaMurid || "-")}
      </td>

      <td>
        <span class="badge ${kelasJantina}">
          ${bersihkanTeks(murid.jantina || "-")}
        </span>
      </td>

      <td>
        <span class="badge badge-tahun">
          Tahun ${bersihkanTeks(murid.tahun || "-")}
        </span>
      </td>

      <td>
        ${bersihkanTeks(murid.kelas || "-")}
      </td>

      <td>
        <div class="action-buttons">
          <button
            type="button"
            class="btn-edit"
            data-action="edit"
            data-id="${murid.id}"
          >
            Edit
          </button>

          <button
            type="button"
            class="btn-delete"
            data-action="delete"
            data-id="${murid.id}"
          >
            Padam
          </button>
        </div>
      </td>
    `;

    senaraiMurid.appendChild(baris);
  });
}


// ==========================================
// BUTANG EDIT DAN PADAM
// ==========================================

senaraiMurid.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const tindakan = button.dataset.action;
  const id = button.dataset.id;

  if (tindakan === "edit") {
    bukaBorangEdit(id);
  }

  if (tindakan === "delete") {
    padamMurid(id);
  }
});


// ==========================================
// BUKA BORANG EDIT
// ==========================================

function bukaBorangEdit(id) {
  const murid = semuaMurid.find((item) => item.id === id);

  if (!murid) {
    paparNotifikasi(
      "Rekod murid tidak ditemui.",
      "error"
    );

    return;
  }

  documentId.value = murid.id;

  noDaftar.value = murid.noDaftar || "";
  namaMurid.value = murid.namaMurid || "";
  jantina.value = murid.jantina || "";
  tarikhLahir.value = murid.tarikhLahir || "";
  tahun.value = murid.tahun || "";
  kelas.value = murid.kelas || "";
  noKadPengenalan.value =
    murid.noKadPengenalan || "";
  bangsa.value = murid.bangsa || "";
  agama.value = murid.agama || "";
  alamat.value = murid.alamat || "";
  namaPenjaga.value = murid.namaPenjaga || "";
  hubunganPenjaga.value =
    murid.hubunganPenjaga || "";
  telefonPenjaga.value =
    murid.telefonPenjaga || "";
  catatan.value = murid.catatan || "";

  tajukBorang.textContent = "Edit Maklumat Murid";
  btnSimpan.textContent = "Kemas Kini Maklumat";

  modalMurid.classList.remove("hidden");
  modalMurid.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}


// ==========================================
// PADAM MURID
// ==========================================

async function padamMurid(id) {
  const murid = semuaMurid.find((item) => item.id === id);

  if (!murid) {
    return;
  }

  const pengesahan = confirm(
    `Adakah Cikgu pasti mahu memadam rekod:\n\n` +
    `${murid.namaMurid}\n` +
    `${murid.noDaftar}\n\n` +
    `Tindakan ini tidak dapat dibatalkan.`
  );

  if (!pengesahan) {
    return;
  }

  try {
    await deleteDoc(doc(db, "murid", id));

    paparNotifikasi(
      "Rekod murid berjaya dipadam."
    );
  } catch (error) {
    console.error("Ralat memadam rekod:", error);

    paparNotifikasi(
      "Rekod tidak dapat dipadam.",
      "error"
    );
  }
}


// ==========================================
// CARIAN DAN TAPISAN
// ==========================================

carianMurid.addEventListener("input", paparSenaraiMurid);
tapisTahun.addEventListener("change", paparSenaraiMurid);
tapisJantina.addEventListener("change", paparSenaraiMurid);


btnResetCarian.addEventListener("click", () => {
  carianMurid.value = "";
  tapisTahun.value = "";
  tapisJantina.value = "";

  paparSenaraiMurid();
});


// ==========================================
// KEMAS KINI DASHBOARD
// ==========================================

function kemasKiniDashboard() {
  const jumlahMurid = semuaMurid.length;

  const jumlahLelaki = semuaMurid.filter(
    (murid) => murid.jantina === "Lelaki"
  ).length;

  const jumlahPerempuan = semuaMurid.filter(
    (murid) => murid.jantina === "Perempuan"
  ).length;

  const senaraiKelas = new Set(
    semuaMurid
      .map((murid) => murid.kelas)
      .filter(Boolean)
  );

  document.getElementById("jumlahMurid").textContent =
    jumlahMurid;

  document.getElementById("jumlahLelaki").textContent =
    jumlahLelaki;

  document.getElementById("jumlahPerempuan").textContent =
    jumlahPerempuan;

  document.getElementById("jumlahKelas").textContent =
    senaraiKelas.size;

  for (let nomborTahun = 1; nomborTahun <= 6; nomborTahun++) {
    const jumlah = semuaMurid.filter((murid) => {
      return String(murid.tahun) === String(nomborTahun);
    }).length;

    const elemen = document.getElementById(
      `jumlahTahun${nomborTahun}`
    );

    if (elemen) {
      elemen.textContent = jumlah;
    }
  }
}

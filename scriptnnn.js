document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('loggedIn') === 'true') {
        document.getElementById('login').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        loadBarang();
        loadKeranjang();
    }
});

// Fungsi untuk memeriksa status login saat halaman dimuat
function checkLogin() {
    const loggedIn = localStorage.getItem('loggedIn');
    const username = localStorage.getItem('username');

    if (loggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

// Fungsi logout
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    localStorage.setItem('loginAttempts', JSON.stringify({})); // Reset login attempts
    window.location.href = 'login.html';
}

// Memastikan fungsi checkLogin dipanggil saat halaman dimuat
window.onload = checkLogin;

function tambahBarang() {
    const kodeBarang = document.getElementById('kodeBarang').value;
    const namaBarang = document.getElementById('namaBarang').value;
    const hargaBeli = document.getElementById('hargaBeli').value;
    const hargaJual = document.getElementById('hargaJual').value;
    const stokBarang = document.getElementById('stokBarang').value;
    const kodeToko = document.getElementById('kodeToko').value;

    if (kodeBarang && namaBarang && hargaBeli && hargaJual && stokBarang && kodeToko) {
        let barang = JSON.parse(localStorage.getItem('barang')) || [];
        barang.push({
            kode: kodeBarang,
            nama: namaBarang,
            hargaBeli: parseFloat(hargaBeli),
            hargaJual: parseFloat(hargaJual),
            stok: parseInt(stokBarang),
            kodeToko: kodeToko,
            terjual: 0
        });
        localStorage.setItem('barang', JSON.stringify(barang));
        loadBarang();
    } else {
        alert('Lengkapi data barang');
    }
}

function loadBarang() {
    let barang = JSON.parse(localStorage.getItem('barang')) || [];
    const tabelBarang = document.getElementById('tabelBarang');
    tabelBarang.innerHTML = '';

    barang.forEach((item, index) => {
        const row = tabelBarang.insertRow();
        row.insertCell(0).innerText = item.kode;
        row.insertCell(1).innerText = item.nama;
        row.insertCell(2).innerText = `Rp${item.hargaJual}`;
        row.insertCell(3).innerText = item.stok;

        const aksiCell = row.insertCell(4);

        const detailBtn = document.createElement('button');
        detailBtn.classList.add('action-btn');
        detailBtn.innerHTML = '<i class="fas fa-info-circle"></i>';
        detailBtn.onclick = () => detailBarang(index);
        aksiCell.appendChild(detailBtn);

        const editBtn = document.createElement('button');
        editBtn.classList.add('action-btn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.onclick = () => editBarang(index);
        aksiCell.appendChild(editBtn);

        const hapusBtn = document.createElement('button');
        hapusBtn.classList.add('action-btn');
        hapusBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        hapusBtn.onclick = () => hapusBarang(index);
        aksiCell.appendChild(hapusBtn);
    });
}

function detailBarang(index) {
    let barang = JSON.parse(localStorage.getItem('barang')) || [];
    const item = barang[index];
    alert(`Kode: ${item.kode}\nNama: ${item.nama}\nHarga Beli: Rp${item.hargaBeli}\nHarga Jual: Rp${item.hargaJual}\nStok: ${item.stok}\nKode Toko: ${item.kodeToko}\nTerjual: ${item.terjual}\nKeuntungan: Rp${item.terjual * (item.hargaJual - item.hargaBeli)}`);
}

function editBarang(index) {
    const pin = prompt('Masukkan PIN:');
    if (pin === '451') {
        let barang = JSON.parse(localStorage.getItem('barang')) || [];
        const item = barang[index];

        const kodeBarang = prompt('Kode Barang:', item.kode);
        const namaBarang = prompt('Nama Barang:', item.nama);
        const hargaBeli = prompt('Harga Beli:', item.hargaBeli);
        const hargaJual = prompt('Harga Jual:', item.hargaJual);
        const stokBarang = prompt('Stok Barang:', item.stok);
        const kodeToko = prompt('Kode Toko:', item.kodeToko);

        if (kodeBarang && namaBarang && hargaBeli && hargaJual && stokBarang && kodeToko) {
            barang[index] = {
                kode: kodeBarang,
                nama: namaBarang,
                hargaBeli: parseFloat(hargaBeli),
                hargaJual: parseFloat(hargaJual),
                stok: parseInt(stokBarang),
                kodeToko: kodeToko,
                terjual: item.terjual
            };
            localStorage.setItem('barang', JSON.stringify(barang));
            loadBarang();
        } else {
            alert('Lengkapi data barang');
        }
    } else {
        alert('PIN salah');
    }
}

function hapusBarang(index) {
    let barang = JSON.parse(localStorage.getItem('barang')) || [];
    barang.splice(index, 1);
    localStorage.setItem('barang', JSON.stringify(barang));
    loadBarang();
}

function tambahKeKeranjang() {
    const kodeNamaBarang = document.getElementById('kodeNamaBarang').value;
    const jumlahBarang = document.getElementById('jumlahBarang').value;

    if (kodeNamaBarang !== '' && jumlahBarang) {
        let barang = JSON.parse(localStorage.getItem('barang')) || [];
        let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];

        const item = barang.find(item => item.kode === kodeNamaBarang || item.nama === kodeNamaBarang);
        if (!item) {
            alert('Barang tidak ditemukan');
            return;
        }
        if (item.stok < jumlahBarang) {
            alert('Stok tidak mencukupi');
            return;
        }

        const existingItem = keranjang.find(k => k.kode === item.kode);
        if (existingItem) {
            existingItem.jumlah += parseInt(jumlahBarang);
            existingItem.total = existingItem.jumlah * item.hargaJual;
        } else {
            keranjang.push({
                kode: item.kode,
                nama: item.nama,
                jumlah: parseInt(jumlahBarang),
                harga: item.hargaJual,
                total: item.hargaJual * jumlahBarang
            });
        }
        localStorage.setItem('keranjang', JSON.stringify(keranjang));
        
        // Kurangi stok barang
        item.stok -= jumlahBarang;
        item.terjual += parseInt(jumlahBarang);
        localStorage.setItem('barang', JSON.stringify(barang));

        loadKeranjang();
        loadBarang();
        document.getElementById('kodeNamaBarang').value = '';
        document.getElementById('jumlahBarang').value = '';
    } else {
        alert('Lengkapi data transaksi');
    }
}

function loadKeranjang() {
    let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
    const tabelKeranjang = document.getElementById('tabelKeranjang');
    tabelKeranjang.innerHTML = '';
    let total = 0;

    keranjang.forEach((item) => {
        const row = tabelKeranjang.insertRow();
        row.insertCell(0).innerText = item.nama;
        row.insertCell(1).innerText = item.jumlah;
        row.insertCell(2).innerText = `Rp${item.harga}`;
        row.insertCell(3).innerText = `Rp${item.total}`;
        total += item.total;
    });

    document.getElementById('totalKeranjang').innerText = total;
}

function bayar() {
    let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
    if (keranjang.length === 0) {
        alert('Keranjang kosong, tambahkan barang ke keranjang terlebih dahulu');
        return;
    }

    document.getElementById('popup').style.display = 'flex';
    document.getElementById('totalBayar').innerText = document.getElementById('totalKeranjang').innerText;
    document.getElementById('totalBayarQRIS').innerText = document.getElementById('totalKeranjang').innerText;
}

function pilihMetode(metode) {
    document.getElementById('metodeCash').style.display = metode === 'cash' ? 'block' : 'none';
    document.getElementById('metodeQRIS').style.display = metode === 'qris' ? 'block' : 'none';
}

function prosesPembayaran(metode) {
    if (metode === 'qris') {
        const checkbox = document.getElementById('checkbox').checked;
        if (!checkbox) {
            alert('Checklist persetujuan pembayaran');
            return;
        }
    }

    let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
    const idTransaksi = generateIdTransaksi();

    if (metode === 'cash') {
        const nominal = parseFloat(document.getElementById('nominalCash').value);
        const total = parseFloat(document.getElementById('totalBayar').innerText);

        if (nominal < total) {
            alert('Nominal kurang');
        } else {
            const kembalian = nominal - total;
            document.getElementById('kembalian').innerText = kembalian.toFixed(2);
            alert(`Pembayaran berhasil! Kembalian: Rp${kembalian.toFixed(2)}`);
            simpanTransaksi('cash', nominal, kembalian, idTransaksi);
            resetKeranjang();
        }
    } else if (metode === 'qris') {
        alert('Pembayaran berhasil!');
        simpanTransaksi('qris', document.getElementById('totalBayarQRIS').innerText, 0, idTransaksi);
        resetKeranjang();
    }
}

function simpanTransaksi(metode, nominal, kembalian, idTransaksi) {
    let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
    let transaksi = JSON.parse(localStorage.getItem('transaksi')) || [];
    const tanggal = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    keranjang.forEach((item) => {
        transaksi.push({
            id: idTransaksi,
            kodeBarang: item.kode,
            namaBarang: item.nama,
            jumlah: item.jumlah,
            total: item.total,
            nominal: nominal,
            kembalian: kembalian,
            metode: metode,
            tanggal: tanggal
        });
    });

    localStorage.setItem('transaksi', JSON.stringify(transaksi));
}

function resetKeranjang() {
    localStorage.removeItem('keranjang');
    loadKeranjang();
    document.getElementById('popup').style.display = 'none';
}

function tutupPopup() {
    document.getElementById('popup').style.display = 'none';
}

function lihatLaporan() {
    window.location.href = 'laporan.html';
}

function generateIdTransaksi() {
    return Math.random().toString(36).substr(2, 5).toUpperCase();
}
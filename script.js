document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('loggedIn') === 'true') {
        document.getElementById('login').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        loadBarang();
        loadKeranjang();
    }
});






function checkLogin() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    localStorage.setItem('loginAttempts', JSON.stringify({}));
    window.location.href = 'index.html';
}

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
        
        // Cek apakah kode barang sudah ada
        let existingItem = barang.find(item => item.kode === kodeBarang);
        if (existingItem) {
            alert('Kode barang sudah ada. Silakan masukkan kode yang berbeda.');
        } else {
            // Tambahkan barang baru
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

            // Clear input fields after adding
            document.getElementById('kodeBarang').value = '';
            document.getElementById('namaBarang').value = '';
            document.getElementById('hargaBeli').value = '';
            document.getElementById('hargaJual').value = '';
            document.getElementById('stokBarang').value = '';
            document.getElementById('kodeToko').value = '';
        }
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
        row.insertCell(2).innerText = formatRupiah(item.hargaJual);
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
    alert(`Kode: ${item.kode}\nNama: ${item.nama}\nHarga Beli: ${formatRupiah(item.hargaBeli)}\nHarga Jual: ${formatRupiah(item.hargaJual)}\nStok: ${item.stok}\nKode Toko: ${item.kodeToko}\nTerjual: ${item.terjual}\nKeuntungan: ${formatRupiah(item.terjual * (item.hargaJual - item.hargaBeli))}`);
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
    const konfirmasi = confirm('Apakah Anda yakin ingin menghapus barang ini?');
    if (konfirmasi) {
        let barang = JSON.parse(localStorage.getItem('barang')) || [];
        barang.splice(index, 1);
        localStorage.setItem('barang', JSON.stringify(barang));
        loadBarang();
        alert('Barang berhasil dihapus');
    } else {
        alert('Penghapusan dibatalkan');
    }
}

function tambahKeKeranjang() {
    const kodeNamaBarang = document.getElementById('kodeNamaBarang').value;
    const jumlahBarang = document.getElementById('jumlahBarang').value;

    if (kodeNamaBarang !== '' && jumlahBarang) {
        // Memastikan bahwa jumlahBarang hanya berisi angka
        if (!/^\d+$/.test(jumlahBarang)) {
            alert('Jumlah barang harus berupa angka positif');
            return;
        }

        let barang = JSON.parse(localStorage.getItem('barang')) || [];
        let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];

        const item = barang.find(item => item.kode === kodeNamaBarang || item.nama === kodeNamaBarang);
        if (!item) {
            alert('Barang tidak ditemukan');
            return;
        }
        if (parseInt(jumlahBarang) <= 0) {
            alert('Jumlah barang tidak boleh kurang dari atau sama dengan nol');
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

    keranjang.forEach((item, index) => {
        const row = tabelKeranjang.insertRow();
        row.insertCell(0).innerText = item.nama;
        row.insertCell(1).innerText = item.jumlah;
        row.insertCell(2).innerText = formatRupiah(item.harga);
        row.insertCell(3).innerText = formatRupiah(item.total);
        total += item.total;

        const aksiCell = row.insertCell(4);

        const voidBtn = document.createElement('button');
        voidBtn.classList.add('action-btn');
        voidBtn.innerHTML = '<i class="fas fa-ban"></i>';
        voidBtn.onclick = () => voidBarang(index);
        aksiCell.appendChild(voidBtn);
    });

    document.getElementById('totalKeranjang').innerText = formatRupiah(total);
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
    let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
    const idTransaksi = generateIdTransaksi();

    if (metode === 'cash') {
        const nominalElement = document.getElementById('nominalCash');
        const nominal = parseFloat(nominalElement.value);
        const total = parseFloat(document.getElementById('totalBayar').innerText.replace(/[^,\d]/g, ''));

        if (isNaN(nominal) || nominal <= 0) {
            alert('Nominal tidak valid');
            return;
        }

        if (nominal < total) {
            alert('Nominal kurang');
        } else {
            const kembalian = nominal - total;
            document.getElementById('kembalian').innerText = formatRupiah(kembalian, 'Rp. ', false);
            alert(`Pembayaran berhasil! Kembalian: ${formatRupiah(kembalian, 'Rp. ', false)}`);
            simpanTransaksi('cash', formatRupiah(nominal), formatRupiah(kembalian, 'Rp. ', false), idTransaksi);
            nominalElement.value = '';  // Membersihkan input nominal
            resetKeranjang();
        }
    } else if (metode === 'qris') {
        alert('Pembayaran berhasil!');
        simpanTransaksi('qris', formatRupiah(document.getElementById('totalBayarQRIS').innerText, 'Rp. ', false), 0, idTransaksi);
        resetKeranjang();
    }
}

function formatRupiah(angka, prefix = 'Rp. ', removeCents = true) {
    if (angka === null || angka === undefined) {
        return prefix + '0';
    }

    let numberString = angka.toString().replace(/[^,\d]/g, ''),
        split = numberString.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    if (removeCents) {
        rupiah = rupiah.replace(/,00$/, ''); // Hapus .00 jika ada
    }
    return prefix + rupiah;
}






function simpanTransaksi(metode, nominal, kembalian, idTransaksi) {
    let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
    let transaksi = JSON.parse(localStorage.getItem('transaksi')) || [];
    const tanggal = new Date().toISOString().split('T')[0];

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

let counter = 0;

function generateIdTransaksi() {
    counter++;
    let numDigits = Math.floor(counter / 20000) + 6;
    let maxNumber = Math.pow(10, numDigits) - 1;
    let id = Math.floor(Math.random() * maxNumber).toString().padStart(numDigits, '0');
    return id;
}

function voidBarang(index) {
    const pin = prompt('Masukkan PIN untuk void:');
    if (pin === '451') {
        let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
        let voids = JSON.parse(localStorage.getItem('voids')) || [];
        const item = keranjang[index];

        const kodeVoid = generateKodeVoid();
        voids.push({
            kodeVoid: kodeVoid,
            namaBarang: item.nama,
            jumlah: item.jumlah,
            harga: item.harga,
            total: item.total,
            tanggal: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('voids', JSON.stringify(voids));

        keranjang.splice(index, 1);
        localStorage.setItem('keranjang', JSON.stringify(keranjang));

        let barang = JSON.parse(localStorage.getItem('barang')) || [];
        const barangItem = barang.find(b => b.kode === item.kode);
        if (barangItem) {
            barangItem.stok += item.jumlah;
            barangItem.terjual -= item.jumlah;
            localStorage.setItem('barang', JSON.stringify(barang));
        }

        loadKeranjang();
        loadBarang();
        alert(`Barang berhasil di-void dengan kode: ${kodeVoid}`);
    } else {
        alert('PIN salah');
    }
}

function generateKodeVoid() {
    return Math.random().toString(36).substr(2, 5).toUpperCase();
}


function downloadExcel() {
    document.body.classList.add('loading');  // Tambahkan kelas loading ke body
    document.getElementById('download-animation').style.display = 'block';

    setTimeout(() => {
        let barang = JSON.parse(localStorage.getItem('barang')) || [];

        let workbook = XLSX.utils.book_new();
        let worksheet_data = [['Kode', 'Nama', 'Harga Beli', 'Harga Jual', 'Stok', 'Terjual', 'Keuntungan']];
        barang.forEach(item => {
            worksheet_data.push([
                item.kode,
                item.nama,
                item.hargaBeli,
                item.hargaJual,
                item.stok,
                item.terjual,
                item.terjual * (item.hargaJual - item.hargaBeli)
            ]);
        });

        let worksheet = XLSX.utils.aoa_to_sheet(worksheet_data);

        // Styling the first row
        let cellStyles = {
            font: { bold: true },
            alignment: { horizontal: 'center' },
            fill: { fgColor: { rgb: 'FFFF00' } }
        };

        worksheet['!cols'] = [
            { wpx: 100 },
            { wpx: 200 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 120 }
        ];

        for (let cell in worksheet) {
            if (worksheet[cell] && typeof worksheet[cell] === 'object') {
                if (worksheet[cell].v === 'Kode' || worksheet[cell].v === 'Nama' || worksheet[cell].v === 'Harga Beli') {
                    worksheet[cell].s = cellStyles;
                }
            }
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Barang');
        XLSX.writeFile(workbook, 'data_barang.xlsx');

        document.body.classList.remove('loading');  // Hapus kelas loading dari body
        document.getElementById('download-animation').style.display = 'none';
    }, 2000);  // Simulasi waktu tunggu download, bisa disesuaikan
}

function formatRupiah(angka, prefix = 'Rp. ') {
    if (angka === null || angka === undefined) {
        return prefix + '0';
    }

    let numberString = angka.toString().replace(/[^,\d]/g, ''),
        split = numberString.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix + rupiah;
}
// GANTI DENGAN URL DAN KUNCI ANDA!
const SUPABASE_URL = 'https://hmpoxlwchwkjcxjehqyx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtcG94bHdjaHdramN4amVocXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MzM2MTIsImV4cCI6MjA3MjQwOTYxMn0.Hf-b4KiMgx5jVyGzcMzRMUw-el5wUOvfQdprSLPzy3s
';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Ambil elemen dari HTML
const registerButton = document.getElementById('registerButton');
const captureButton = document.getElementById('captureButton');
const registerNameInput = document.getElementById('registerName');
const attendNameInput = document.getElementById('attendName');
const responseEl = document.getElementById('response');

// Fungsi untuk Pendaftaran
registerButton.addEventListener('click', async () => {
    const name = registerNameInput.value;
    if (!name) {
        responseEl.textContent = 'Status: Nama untuk pendaftaran harus diisi!';
        return;
    }

    responseEl.textContent = 'Status: Mendaftarkan...';

    // Kirim data nama ke tabel 'users' di Supabase
    const { error } = await supabase.from('users').insert({ name: name });

    if (error) {
        responseEl.textContent = `Status: Gagal - ${error.message}`;
    } else {
        responseEl.textContent = `Status: Pengguna ${name} berhasil terdaftar!`;
        registerNameInput.value = ''; // Kosongkan input
    }
});

// Fungsi untuk Absensi
captureButton.addEventListener('click', async () => {
    const name = attendNameInput.value;
    if (!name) {
        responseEl.textContent = 'Status: Nama untuk absensi harus diisi!';
        return;
    }

    responseEl.textContent = 'Status: Memproses absensi...';

    try {
        // Memanggil Edge Function 'attend' yang sudah kita buat
        const { data, error } = await supabase.functions.invoke('attend', {
            body: { name: name }
        });

        if (error) throw error;

        responseEl.textContent = `Status: ${data.message}`;
        attendNameInput.value = ''; // Kosongkan input

    } catch (error) {
        // Menampilkan pesan error dari Edge Function
        const errorMessage = error.context?.body?.message || error.message;
        responseEl.textContent = `Status: Gagal - ${errorMessage}`;
    }
});
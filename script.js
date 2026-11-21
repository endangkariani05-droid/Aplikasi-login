// DATA BUKU
const books = [
    {
        id: 1,
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        emoji: "🌈",
        category: "Novel"
    },
    {
        id: 2,
        title: "Bumi",
        author: "Tere Liye",
        emoji: "🌍",
        category: "Fantasi"
    },
    {
        id: 3,
        title: "Filosofi Teras",
        author: "Henry Manampiring",
        emoji: "🧠",
        category: "Pendidikan"
    },
    {
        id: 4,
        title: "Negeri 5 Menara",
        author: "Ahmad Fuadi",
        emoji: "🏫",
        category: "Novel"
    },
    {
        id: 5,
        title: "Atomic Habits",
        author: "James Clear",
        emoji: "⚡",
        category: "Motivasi"
    },
    {
        id: 6,
        title: "Sains Menyenangkan",
        author: "Tim BookSpace",
        emoji: "🔬",
        category: "Pendidikan"
    }
];

// NAMA PENYIMPANAN
const USERS_KEY = "bookspace_users";
const SESSION_KEY = "bookspace_session";
const SAVED_KEY = "bookspace_saved";

// MENGAMBIL DATA
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function getSaved() {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
}

// PINDAH HALAMAN LOGIN DAN DAFTAR
function switchTab(tab) {
    const login = tab === "login";

    loginForm.classList.toggle("hidden", !login);
    registerForm.classList.toggle("hidden", login);

    document.getElementById("loginTab")
        .classList.toggle("active", login);

    document.getElementById("registerTab")
        .classList.toggle("active", !login);

    authMessage.textContent = "";
}

document.getElementById("loginTab")
    .addEventListener("click", () => switchTab("login"));

document.getElementById("registerTab")
    .addEventListener("click", () => switchTab("register"));

// REGISTRASI
registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value;

    const users = getUsers();

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        authMessage.textContent = "Username sudah digunakan!";
        return;
    }

    users.push({ name, username, password });

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    registerForm.reset();
    switchTab("login");

    authMessage.textContent = "Pendaftaran berhasil! Silakan login.";
});

// LOGIN
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    const user = getUsers().find(u =>
        u.username === username && u.password === password
    );

    if (!user) {
        authMessage.textContent = "Username atau password salah!";
        return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({
        name: user.name,
        username: user.username
    }));

    loginForm.reset();
    showApp();
});

// MENAMPILKAN BUKU
function renderBooks(keyword = "") {
    const grid = document.getElementById("bookGrid");

    const filtered = books.filter(book =>
        (book.title + " " + book.author + " " + book.category)
        .toLowerCase().includes(keyword.toLowerCase())
    );

    if (filtered.length === 0) {
        grid.innerHTML = "<p>Buku tidak ditemukan.</p>";
        return;
    }

    grid.innerHTML = filtered.map(book => `
        <div class="book-card">
            <div class="book-cover">${book.emoji}</div>
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>${book.category}</p>
            <button onclick="saveBook(${book.id})">
                + Simpan Buku
            </button>
        </div>
    `).join("");
}

// PENCARIAN BUKU
document.getElementById("searchInput")
    .addEventListener("input", function() {
        renderBooks(this.value);
    });

// MENYIMPAN BUKU KE LOCALSTORAGE
function saveBook(id) {
    const saved = getSaved();

    if (saved.includes(id)) {
        alert("Buku sudah disimpan!");
        return;
    }

    saved.push(id);

    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));

    renderSaved();
    alert("Buku berhasil disimpan!");
}

// MENAMPILKAN BUKU SAYA
function renderSaved() {
    const saved = getSaved();
    const list = document.getElementById("loanList");

    if (saved.length === 0) {
        list.innerHTML = "<p>Belum ada buku yang disimpan.</p>";
        return;
    }

    list.innerHTML = saved.map(id => {
        const book = books.find(b => b.id === id);

        return `
            <div class="loan-row">
                <span>${book.emoji} ${book.title} - ${book.author}</span>
                <button class="remove"
                    onclick="removeBook(${book.id})">
                    Hapus
                </button>
            </div>
        `;
    }).join("");
}

// MENGHAPUS BUKU
function removeBook(id) {
    const saved = getSaved().filter(bookId => bookId !== id);

    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));

    renderSaved();
}

// MENAMPILKAN DASHBOARD
function showApp() {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));

    if (!session) {
        showAuth();
        return;
    }

    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");

    document.getElementById("logoutBtn")
        .classList.remove("hidden");

    document.getElementById("userName").textContent = session.name;

    renderBooks();
    renderSaved();
}

// LOGOUT
document.getElementById("logoutBtn")
    .addEventListener("click", function() {
        localStorage.removeItem(SESSION_KEY);
        showAuth();
    });

// KEMBALI KE LOGIN
function showAuth() {
    appSection.classList.add("hidden");
    authSection.classList.remove("hidden");

    document.getElementById("logoutBtn")
        .classList.add("hidden");

    switchTab("login");
}

// CEK LOGIN SAAT HALAMAN DIBUKA
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authMessage = document.getElementById("authMessage");
const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");

if (localStorage.getItem(SESSION_KEY)) {
    showApp();
} else {
    showAuth();
}

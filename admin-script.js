// Admin Panel Script - NoteFolio
const API_BASE = window.location.origin;
let adminToken = localStorage.getItem('adminToken');

// ==================== AUTH CHECK ====================
(function checkAuth() {
    if (!adminToken) {
        window.location.href = '/login.html';
        return;
    }
})();

// ==================== TOAST ====================
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ==================== SIDEBAR NAVIGATION & MOBILE TOGGLE ====================
const sidebar = document.getElementById('admin-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const mobileToggleBtn = document.getElementById('mobile-sidebar-toggle');

function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
}

if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
        if (sidebar) sidebar.classList.toggle('mobile-open');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        // Close sidebar on mobile upon navigation
        if (window.innerWidth <= 768) {
            closeMobileSidebar();
        }

        // Update active section
        const sectionId = 'section-' + item.dataset.section;
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        const section = document.getElementById(sectionId);
        if (section) section.classList.add('active');

        // Update header title
        const titleSpan = item.querySelector('span');
        if (titleSpan) {
            document.querySelector('.page-header h1').textContent = titleSpan.textContent;
        }

        // Load data when switching
        if (item.dataset.section === 'manage-notes') loadNotes();
        if (item.dataset.section === 'dashboard') loadStats();
        if (item.dataset.section === 'manage-users') loadUsers();
    });
});

// ==================== LOGOUT ====================
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login.html';
});

// ==================== API HELPER ====================
async function apiCall(url, options = {}) {
    const defaultHeaders = {
        'Authorization': `Bearer ${adminToken}`,
    };
    // Don't set Content-Type for FormData (browser sets boundary)
    if (!(options.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }
    options.headers = { ...defaultHeaders, ...options.headers };

    try {
        const res = await fetch(`${API_BASE}${url}`, options);
        const data = await res.json();
        return { ok: res.ok, data };
    } catch (error) {
        console.error('API call failed:', error);
        return { ok: false, data: { message: 'Network error. Please try again.' } };
    }
}

// ==================== LOAD STATS ====================
async function loadStats() {
    const { ok, data } = await apiCall('/api/notes/admin/stats');
    if (ok && data.success) {
        document.getElementById('total-notes').textContent = data.data.totalNotes || 0;
        document.getElementById('total-users').textContent = data.data.totalUsers || 0;
        document.getElementById('total-orders').textContent = data.data.totalOrders || 0;
        document.getElementById('total-revenue').textContent = '₹' + (data.data.totalRevenue || 0);
    }
}

// ==================== LOAD NOTES TABLE ====================
async function loadNotes() {
    const { ok, data } = await apiCall('/api/notes');
    const tbody = document.getElementById('notes-table-body');

    if (ok && data.success && data.data.length > 0) {
        tbody.innerHTML = data.data.map(note => `
            <tr>
                <td>${note.title}</td>
                <td>${note.subject}</td>
                <td>₹${note.price}</td>
                <td>Sem ${note.semester}</td>
                <td>${note.isHandwritten ? '<span style="color:#fbbf24;">✍ Handwritten</span>' : '<span style="color:#60a5fa;">📖 Digital</span>'}</td>
                <td class="actions-cell">
                    <button class="btn btn-edit btn-sm" onclick="editNote('${note._id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="deleteNote('${note._id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#64748b;padding:30px;">No notes found. Add your first note!</td></tr>';
    }
}

// ==================== ADD NOTE FORM ====================
document.getElementById('add-note-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';

    const { ok, data } = await apiCall('/api/notes', { method: 'POST', body: formData });

    if (ok && data.success) {
        showToast('Note added successfully!');
        form.reset();
    } else {
        showToast(data.message || 'Failed to add note', 'error');
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-plus"></i> Add Note';
});

// ==================== HANDWRITTEN NOTES UPLOAD ====================
document.getElementById('handwritten-notes-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const btn = form.querySelector('button[type="submit"]');
    const progress = document.getElementById('upload-progress');
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('upload-status');

    // Validate PDF
    const pdfInput = document.getElementById('handwritten-pdf');
    if (!pdfInput.files.length) {
        showToast('Please select a PDF file', 'error');
        return;
    }
    const pdfFile = pdfInput.files[0];
    if (pdfFile.type !== 'application/pdf') {
        showToast('Only PDF files are accepted', 'error');
        return;
    }
    if (pdfFile.size > 50 * 1024 * 1024) {
        showToast('File size exceeds 50MB limit', 'error');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    progress.style.display = 'block';
    progressBar.style.width = '0%';
    statusText.textContent = 'Uploading to cloud storage...';

    // Use XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/api/notes/handwritten`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${adminToken}`);

    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            progressBar.style.width = pct + '%';
            statusText.textContent = `Uploading... ${pct}%`;
        }
    };

    xhr.onload = () => {
        try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && data.success) {
                progressBar.style.width = '100%';
                statusText.textContent = '✅ Upload complete!';
                showToast('Handwritten notes uploaded successfully!');
                form.reset();
                setTimeout(() => { progress.style.display = 'none'; }, 2000);
            } else {
                statusText.textContent = '❌ Upload failed';
                showToast(data.message || 'Upload failed', 'error');
            }
        } catch (err) {
            statusText.textContent = '❌ Upload failed';
            showToast('Upload failed. Server error.', 'error');
        }
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload Handwritten Notes';
    };

    xhr.onerror = () => {
        statusText.textContent = '❌ Network error';
        showToast('Network error. Please try again.', 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload Handwritten Notes';
    };

    xhr.send(formData);
});

// ==================== EDIT NOTE ====================
let allNotes = [];

async function editNote(id) {
    // Fetch the note data
    const { ok, data } = await apiCall(`/api/notes/${id}`);
    if (!ok || !data.success) {
        showToast('Failed to load note data', 'error');
        return;
    }
    const note = data.data;
    document.getElementById('edit-note-id').value = note._id;
    document.getElementById('edit-note-title').value = note.title;
    document.getElementById('edit-note-subject').value = note.subject;
    document.getElementById('edit-note-price').value = note.price;
    document.getElementById('edit-note-semester').value = note.semester;
    document.getElementById('edit-note-pages').value = note.pages || 0;
    document.getElementById('edit-note-description').value = note.description;
    document.getElementById('edit-note-chapters').value = note.chapters ? JSON.stringify(note.chapters) : '';

    document.getElementById('editNoteModal').classList.add('show');
}

document.getElementById('close-edit-modal').addEventListener('click', () => {
    document.getElementById('editNoteModal').classList.remove('show');
});

document.getElementById('edit-note-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const id = document.getElementById('edit-note-id').value;
    const formData = new FormData(form);

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const { ok, data } = await apiCall(`/api/notes/${id}`, { method: 'PUT', body: formData });

    if (ok && data.success) {
        showToast('Note updated successfully!');
        document.getElementById('editNoteModal').classList.remove('show');
        loadNotes();
    } else {
        showToast(data.message || 'Failed to update', 'error');
    }
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
});

// ==================== DELETE NOTE ====================
async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note? This cannot be undone.')) return;

    const { ok, data } = await apiCall(`/api/notes/${id}`, { method: 'DELETE' });
    if (ok && data.success) {
        showToast('Note deleted successfully');
        loadNotes();
    } else {
        showToast(data.message || 'Failed to delete', 'error');
    }
}

// ==================== MANAGE USERS ====================
async function loadUsers() {
    const tbody = document.getElementById('users-table-body');
    if(!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#64748b;">Loading users...</td></tr>';
    const { ok, data } = await apiCall('/api/auth');
    if (ok && data.success) {
        const users = data.data;
        document.getElementById('total-users').textContent = users.length;
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#64748b;">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${user.avatar || 'images/default-avatar.png'}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;" onerror="this.src='images/Digital Notes.jpeg'">
                        <span>${user.name}</span>
                    </div>
                </td>
                <td>${user.email}</td>
                <td><span style="padding:4px 8px; border-radius:4px; font-size:12px; background:${user.role==='admin'?'rgba(52,211,153,0.1)':'rgba(96,165,250,0.1)'}; color:${user.role==='admin'?'#34d399':'#60a5fa'}">${user.role}</span></td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td class="actions-cell">
                    ${user.role !== 'admin' ? `
                    <button class="btn btn-primary" style="background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.3); padding:6px 10px;" onclick="deleteUser('${user._id}')" title="Delete User">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#ef4444;">Failed to load users</td></tr>';
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

    const { ok, data } = await apiCall(`/api/auth/${id}`, { method: 'DELETE' });
    if (ok && data.success) {
        showToast('User deleted successfully');
        loadUsers();
    } else {
        showToast(data.message || 'Failed to delete user', 'error');
    }
}


// ==================== INIT ====================
loadStats();
loadUsers();

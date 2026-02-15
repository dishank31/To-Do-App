/* ============================
   TaskFlow Pro - Application Logic
   ============================ */

// DOM Elements
const liveClock = document.getElementById('liveClock');
const liveDate = document.getElementById('liveDate');
const currentYear = document.getElementById('currentYear');
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModal = document.getElementById('closeModal');
const cancelEdit = document.getElementById('cancelEdit');
const confettiCanvas = document.getElementById('confetti');
const confettiCtx = confettiCanvas.getContext('2d');
const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClear');
const clearCompletedBtn = document.getElementById('clearCompleted');
const greetingEl = document.getElementById('greeting');

// Stats Elements
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const overdueTasksEl = document.getElementById('overdueTasks');
const progressRing = document.getElementById('progressRing');
const progressPercent = document.getElementById('progressPercent');

// Filter Elements
const filterCategory = document.getElementById('filterCategory');
const filterStatus = document.getElementById('filterStatus');
const sortBy = document.getElementById('sortBy');
const quickFilters = document.querySelectorAll('.quick-filter');

// App State
let tasks = [];
let activeQuickFilter = 'all';
let searchQuery = '';

// Priority & Category Config
const priorityConfig = {
    low: { label: '🟢 Low', weight: 1 },
    medium: { label: '🟡 Medium', weight: 2 },
    high: { label: '🟠 High', weight: 3 },
    critical: { label: '🔴 Critical', weight: 4 }
};

const categoryConfig = {
    work: { label: '💼 Work', icon: '💼' },
    personal: { label: '🏠 Personal', icon: '🏠' },
    health: { label: '❤️ Health', icon: '❤️' },
    learning: { label: '📚 Learning', icon: '📚' },
    shopping: { label: '🛒 Shopping', icon: '🛒' },
    finance: { label: '💰 Finance', icon: '💰' }
};

// ============================
// INITIALIZATION
// ============================

function init() {
    loadTasks();
    updateClock();
    updateGreeting();
    setInterval(updateClock, 1000);
    setInterval(updateCountdowns, 60000);
    setInterval(updateGreeting, 60000); // Update greeting every minute
    renderTasks();
    updateStats();
    setupEventListeners();
    setDefaultDueDate();
    currentYear.textContent = new Date().getFullYear();
    resizeConfetti();
}

// ============================
// CLOCK & DATE
// ============================

function updateClock() {
    const now = new Date();

    // Format time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    liveClock.textContent = `${hours}:${minutes}:${seconds}`;

    // Format date
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    liveDate.textContent = now.toLocaleDateString('en-US', options);
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting, emoji;

    if (hour >= 5 && hour < 12) {
        greeting = 'Good Morning';
        emoji = '☀️';
    } else if (hour >= 12 && hour < 17) {
        greeting = 'Good Afternoon';
        emoji = '🌤️';
    } else if (hour >= 17 && hour < 21) {
        greeting = 'Good Evening';
        emoji = '🌆';
    } else {
        greeting = 'Burning the Midnight Oil';
        emoji = '🌙';
    }

    const pending = tasks.filter(t => !t.completed).length;
    const taskMsg = pending > 0 ? ` — ${pending} task${pending !== 1 ? 's' : ''} remaining` : ' — All caught up! 🎉';
    greetingEl.textContent = `${emoji} ${greeting}${taskMsg}`;
}

function setDefaultDueDate() {
    const today = new Date();
    const dateInput = document.getElementById('taskDate');
    dateInput.value = formatDateForInput(today);
    dateInput.min = formatDateForInput(today);

    const editDateInput = document.getElementById('editTaskDate');
    if (editDateInput) {
        editDateInput.min = formatDateForInput(today);
    }
}

function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

// ============================
// TASK MANAGEMENT
// ============================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function addTask(taskData) {
    const task = {
        id: generateId(),
        title: taskData.title,
        category: taskData.category,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        dueTime: taskData.dueTime,
        notes: taskData.notes,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
    updateStats();
    showToast('✅ Task added successfully!', 'success');
}

function updateTask(id, taskData) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...taskData };
        saveTasks();
        renderTasks();
        updateStats();
        showToast('📝 Task updated!', 'info');
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
    updateGreeting();
    showToast('🗑️ Task deleted!', 'info');
}

function clearCompletedTasks() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
        showToast('📭 No completed tasks to clear!', 'info');
        return;
    }
    if (confirm(`Remove ${completedCount} completed task${completedCount !== 1 ? 's' : ''}?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        updateStats();
        updateGreeting();
        showToast(`🧹 Cleared ${completedCount} completed task${completedCount !== 1 ? 's' : ''}!`, 'success');
    }
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            launchConfetti();
            showToast('🎉 Great job! Task completed!', 'success');
        }
        saveTasks();
        renderTasks();
        updateStats();
        updateGreeting();
    }
}

// ============================
// LOCAL STORAGE
// ============================

function saveTasks() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const stored = localStorage.getItem('taskflow_tasks');
    if (stored) {
        tasks = JSON.parse(stored);
    }
}

// ============================
// RENDERING
// ============================

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    const sortedTasks = getSortedTasks(filteredTasks);

    if (sortedTasks.length === 0) {
        taskList.innerHTML = '';
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
        taskList.innerHTML = sortedTasks.map(task => createTaskHTML(task)).join('');
    }

    updateCountdowns();
}

function createTaskHTML(task) {
    const isOverdue = isTaskOverdue(task);
    const countdown = getCountdown(task);
    const categoryIcon = categoryConfig[task.category]?.icon || '📌';

    return `
        <div class="task-item ${task.completed ? 'completed' : ''} ${isOverdue && !task.completed ? 'overdue' : ''}" data-id="${task.id}">
            <label class="task-checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete('${task.id}')">
                <span class="checkmark"></span>
            </label>
            <div class="task-content">
                <div class="task-header">
                    <span class="task-title">${escapeHtml(task.title)}</span>
                    <span class="task-badge badge-priority-${task.priority}">${task.priority}</span>
                    <span class="task-badge badge-category">${categoryIcon} ${task.category}</span>
                </div>
                <div class="task-meta">
                    ${task.dueDate ? `
                        <span>📅 ${formatDisplayDate(task.dueDate)}</span>
                        ${task.dueTime ? `<span>⏰ ${formatDisplayTime(task.dueTime)}</span>` : ''}
                        ${!task.completed ? `<span class="countdown ${countdown.class}">${countdown.text}</span>` : ''}
                    ` : '<span>📅 No due date</span>'}
                </div>
                ${task.notes ? `<div class="task-notes-preview">📝 ${escapeHtml(task.notes)}</div>` : ''}
            </div>
            <div class="task-actions">
                <button class="btn-action" onclick="openEditModal('${task.id}')" title="Edit">✏️</button>
                <button class="btn-action btn-delete" onclick="confirmDelete('${task.id}')" title="Delete">🗑️</button>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================
// FILTERING & SORTING
// ============================

function getFilteredTasks() {
    let filtered = [...tasks];

    // Apply search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(query) ||
            (t.notes && t.notes.toLowerCase().includes(query)) ||
            t.category.toLowerCase().includes(query)
        );
    }

    // Apply quick filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    switch (activeQuickFilter) {
        case 'today':
            filtered = filtered.filter(t => {
                if (!t.dueDate) return false;
                const dueDate = new Date(t.dueDate);
                return dueDate.toDateString() === today.toDateString();
            });
            break;
        case 'upcoming':
            filtered = filtered.filter(t => {
                if (!t.dueDate) return false;
                const dueDate = new Date(t.dueDate);
                return dueDate >= today && dueDate <= weekFromNow;
            });
            break;
        case 'overdue':
            filtered = filtered.filter(t => isTaskOverdue(t) && !t.completed);
            break;
    }

    // Apply category filter
    const categoryFilter = filterCategory.value;
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Apply status filter
    const statusFilter = filterStatus.value;
    switch (statusFilter) {
        case 'pending':
            filtered = filtered.filter(t => !t.completed);
            break;
        case 'completed':
            filtered = filtered.filter(t => t.completed);
            break;
        case 'overdue':
            filtered = filtered.filter(t => isTaskOverdue(t) && !t.completed);
            break;
    }

    return filtered;
}

function getSortedTasks(tasksToSort) {
    const sortOption = sortBy.value;

    return [...tasksToSort].sort((a, b) => {
        switch (sortOption) {
            case 'dueDate':
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            case 'priority':
                return priorityConfig[b.priority].weight - priorityConfig[a.priority].weight;
            case 'created':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });
}

// ============================
// DATE/TIME UTILITIES
// ============================

function isTaskOverdue(task) {
    if (!task.dueDate || task.completed) return false;

    const now = new Date();
    let dueDateTime = new Date(task.dueDate);

    if (task.dueTime) {
        const [hours, minutes] = task.dueTime.split(':');
        dueDateTime.setHours(parseInt(hours), parseInt(minutes));
    } else {
        dueDateTime.setHours(23, 59, 59);
    }

    return now > dueDateTime;
}

function getCountdown(task) {
    if (!task.dueDate) return { text: '', class: '' };

    const now = new Date();
    let dueDateTime = new Date(task.dueDate);

    if (task.dueTime) {
        const [hours, minutes] = task.dueTime.split(':');
        dueDateTime.setHours(parseInt(hours), parseInt(minutes));
    } else {
        dueDateTime.setHours(23, 59, 59);
    }

    const diff = dueDateTime - now;

    if (diff < 0) {
        const absDiff = Math.abs(diff);
        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) {
            return { text: `⚠️ ${days}d ${hours}h overdue`, class: 'overdue' };
        } else if (hours > 0) {
            return { text: `⚠️ ${hours}h overdue`, class: 'overdue' };
        } else {
            return { text: '⚠️ Overdue', class: 'overdue' };
        }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 7) {
        return { text: `📆 ${days} days left`, class: '' };
    } else if (days > 1) {
        return { text: `⏰ ${days} days left`, class: '' };
    } else if (days === 1) {
        return { text: `⏰ Tomorrow, ${hours}h left`, class: 'urgent' };
    } else if (hours > 0) {
        return { text: `🔥 ${hours}h ${minutes}m left`, class: 'urgent' };
    } else if (minutes > 0) {
        return { text: `🔥 ${minutes}m left`, class: 'urgent' };
    } else {
        return { text: '🔥 Due now!', class: 'urgent' };
    }
}

function updateCountdowns() {
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        const id = item.dataset.id;
        const task = tasks.find(t => t.id === id);
        if (task && !task.completed) {
            const countdownEl = item.querySelector('.countdown');
            if (countdownEl) {
                const countdown = getCountdown(task);
                countdownEl.textContent = countdown.text;
                countdownEl.className = `countdown ${countdown.class}`;
            }

            // Update overdue status
            if (isTaskOverdue(task)) {
                item.classList.add('overdue');
            }
        }
    });
    updateStats(); // Also update overdue count
}

function formatDisplayDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatDisplayTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// ============================
// STATISTICS
// ============================

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    const overdue = tasks.filter(t => isTaskOverdue(t) && !t.completed).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Animate numbers
    animateNumber(totalTasksEl, total);
    animateNumber(completedTasksEl, completed);
    animateNumber(pendingTasksEl, pending);
    animateNumber(overdueTasksEl, overdue);

    // Update progress ring
    const circumference = 2 * Math.PI * 35;
    const offset = circumference - (progress / 100) * circumference;
    progressRing.style.strokeDasharray = circumference;
    progressRing.style.strokeDashoffset = offset;
    progressPercent.textContent = `${progress}%`;

    // Add gradient to progress ring
    addGradientToSVG();
}

function animateNumber(element, target) {
    const current = parseInt(element.textContent) || 0;
    if (current === target) return;

    const increment = target > current ? 1 : -1;
    const duration = 300;
    const steps = Math.abs(target - current);
    const stepDuration = duration / steps;

    let value = current;
    const interval = setInterval(() => {
        value += increment;
        element.textContent = value;
        if (value === target) {
            clearInterval(interval);
        }
    }, stepDuration);
}

function addGradientToSVG() {
    const svg = document.querySelector('.progress-ring');
    if (!svg.querySelector('defs')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'gradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '0%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#8b5cf6');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#06b6d4');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }
}

// ============================
// MODAL MANAGEMENT
// ============================

function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskCategory').value = task.category;
    document.getElementById('editTaskPriority').value = task.priority;
    document.getElementById('editTaskDate').value = task.dueDate || '';
    document.getElementById('editTaskTime').value = task.dueTime || '';
    document.getElementById('editTaskNotes').value = task.notes || '';

    editModal.classList.add('show');
}

function closeEditModal() {
    editModal.classList.remove('show');
}

function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        deleteTask(id);
    }
}

// ============================
// CONFETTI EFFECT
// ============================

const confettiParticles = [];

function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function launchConfetti() {
    const colors = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#22c55e'];

    for (let i = 0; i < 100; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: confettiCanvas.height + 10,
            vx: (Math.random() - 0.5) * 10,
            vy: -Math.random() * 20 - 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }

    animateConfetti();
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const p = confettiParticles[i];

        p.vy += 0.5; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        confettiCtx.restore();

        if (p.y > confettiCanvas.height + 20) {
            confettiParticles.splice(i, 1);
        }
    }

    if (confettiParticles.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// ============================
// TOAST NOTIFICATIONS
// ============================

function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ============================
// EVENT LISTENERS
// ============================

function setupEventListeners() {
    // Add task form
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskData = {
            title: document.getElementById('taskTitle').value.trim(),
            category: document.getElementById('taskCategory').value,
            priority: document.getElementById('taskPriority').value,
            dueDate: document.getElementById('taskDate').value,
            dueTime: document.getElementById('taskTime').value,
            notes: document.getElementById('taskNotes').value.trim()
        };

        if (!taskData.title) {
            showToast('❌ Please enter a task title!', 'error');
            return;
        }

        addTask(taskData);
        taskForm.reset();
        setDefaultDueDate();
    });

    // Edit task form
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('editTaskId').value;
        const taskData = {
            title: document.getElementById('editTaskTitle').value.trim(),
            category: document.getElementById('editTaskCategory').value,
            priority: document.getElementById('editTaskPriority').value,
            dueDate: document.getElementById('editTaskDate').value,
            dueTime: document.getElementById('editTaskTime').value,
            notes: document.getElementById('editTaskNotes').value.trim()
        };

        if (!taskData.title) {
            showToast('❌ Please enter a task title!', 'error');
            return;
        }

        updateTask(id, taskData);
        closeEditModal();
    });

    // Modal close buttons
    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);

    // Close modal on overlay click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    // Filter changes
    filterCategory.addEventListener('change', renderTasks);
    filterStatus.addEventListener('change', renderTasks);
    sortBy.addEventListener('change', renderTasks);

    // Quick filters
    quickFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            quickFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeQuickFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Window resize
    window.addEventListener('resize', resizeConfetti);

    // Search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        searchClearBtn.classList.toggle('visible', searchQuery.length > 0);
        renderTasks();
    });

    // Search clear button
    searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClearBtn.classList.remove('visible');
        renderTasks();
        searchInput.focus();
    });

    // Clear completed button
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape to close modal
        if (e.key === 'Escape' && editModal.classList.contains('show')) {
            closeEditModal();
        }

        // Ctrl+N to focus task input
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            document.getElementById('taskTitle').focus();
        }
    });
}

// ============================
// EXPOSE FUNCTIONS GLOBALLY
// ============================

window.toggleComplete = toggleComplete;
window.openEditModal = openEditModal;
window.confirmDelete = confirmDelete;
window.clearCompletedTasks = clearCompletedTasks;

// ============================
// INITIALIZE APP
// ============================

document.addEventListener('DOMContentLoaded', init);

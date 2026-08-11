// ===== Document Ready =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initDate();
    initSidebar();
    initNavigation();
    initStressSlider();
    initMoodSelector();
    initCharts();
});

// ===== Date Display =====
function initDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// ===== Sidebar Toggle =====
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Toggle function
    window.toggleSidebar = function() {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
        document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
    };
    
    // Close on overlay click
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

// ===== Navigation =====
function initNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page-content');
    const pageTitle = document.querySelector('.page-title');
    
    // Page titles mapping
    const pageTitles = {
        'dashboard': 'Dashboard',
        'mood-tracker': 'Mood Tracker',
        'stress-tracker': 'Stress Tracker',
        'journal': 'Journal',
        'pomodoro': 'Pomodoro Timer',
        'breathing': 'Breathing Exercise',
        'kamustahan': 'Kamustahan',
        'appointments': 'Appointments',
        'notifications': 'Notifications',
        'achievements': 'Achievements',
        'profile': 'Profile',
        'settings': 'Settings',
        'logout': 'Logout'
    };
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active from all menu items
            menuItems.forEach(m => m.classList.remove('active'));
            
            // Add active to clicked item
            this.classList.add('active');
            
            // Get page to show
            const page = this.dataset.page;
            
            // Hide all pages
            pages.forEach(p => p.classList.remove('active'));
            
            // Show target page
            const targetPage = document.getElementById(page + '-page');
            if (targetPage) {
                targetPage.classList.add('active');
            }
            
            // Update page title
            if (pageTitle && pageTitles[page]) {
                pageTitle.textContent = pageTitles[page];
            }
            
            // Close sidebar on mobile
            if (window.innerWidth <= 991) {
                const sidebar = document.getElementById('sidebar');
                const overlay = document.querySelector('.sidebar-overlay');
                sidebar.classList.remove('show');
                overlay.classList.remove('show');
                document.body.style.overflow = '';
            }
            
            // Reinitialize charts if needed
            if (page === 'dashboard') {
                initCharts();
            }
        });
    });
}

// ===== Stress Slider =====
function initStressSlider() {
    const slider = document.getElementById('stressSlider');
    const valueDisplay = document.getElementById('stressValue');
    
    if (slider && valueDisplay) {
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
        });
    }
}

// ===== Mood Selector =====
function initMoodSelector() {
    const moodEmojis = document.querySelectorAll('.mood-emoji');
    
    moodEmojis.forEach(emoji => {
        emoji.addEventListener('click', function() {
            // Remove active from all
            moodEmojis.forEach(e => e.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
        });
    });
}

// ===== Save Functions (Mock) =====
function saveMood() {
    const activeMood = document.querySelector('.mood-emoji.active');
    const mood = activeMood ? activeMood.dataset.mood : 'happy';
    const notes = document.querySelector('#mood-tracker-page textarea').value;
    
    alert(`Mood saved! ${mood} - ${notes}`);
    location.reload();
}

function saveStress() {
    const level = document.getElementById('stressSlider').value;
    const triggers = [];
    document.querySelectorAll('#stress-tracker-page .form-check-input:checked').forEach(cb => {
        triggers.push(cb.nextElementSibling.textContent.trim());
    });
    const notes = document.querySelector('#stress-tracker-page textarea').value;
    
    alert(`Stress saved! Level: ${level}/10, Triggers: ${triggers.join(', ')}`);
    location.reload();
}

function saveJournal() {
    const title = document.getElementById('journalTitle').value;
    const content = document.getElementById('journalContent').value;
    const moodTag = document.getElementById('journalMood').value;
    
    if (!title || !content) {
        alert('Please fill in both title and content');
        return;
    }
    
    alert(`Journal saved! ${title} - ${moodTag}`);
    location.reload();
}

// ===== Navigation Function =====
function navigateTo(page) {
    const menuItem = document.querySelector(`.menu-item[data-page="${page}"]`);
    if (menuItem) {
        menuItem.click();
    }
}

// ===== Pomodoro Timer =====
let pomodoroTimeLeft = 25 * 60;
let pomodoroTimerId = null;
let pomodoroIsRunning = false;

function startPomodoro() {
    if (pomodoroIsRunning) return;
    pomodoroIsRunning = true;
    
    pomodoroTimerId = setInterval(() => {
        pomodoroTimeLeft--;
        updatePomodoroDisplay();
        
        if (pomodoroTimeLeft <= 0) {
            stopPomodoro();
            alert('Pomodoro complete! Take a break.');
        }
    }, 1000);
}

function pausePomodoro() {
    if (pomodoroIsRunning) {
        clearInterval(pomodoroTimerId);
        pomodoroIsRunning = false;
    }
}

function resetPomodoro() {
    clearInterval(pomodoroTimerId);
    pomodoroIsRunning = false;
    pomodoroTimeLeft = 25 * 60;
    updatePomodoroDisplay();
}

function setPomodoroTime(minutes) {
    if (pomodoroIsRunning) return;
    pomodoroTimeLeft = minutes * 60;
    updatePomodoroDisplay();
    
    // Update active button
    document.querySelectorAll('#pomodoro-page .btn-outline-primary, #pomodoro-page .btn-outline-success, #pomodoro-page .btn-outline-info')
        .forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function updatePomodoroDisplay() {
    const display = document.getElementById('timerDisplay');
    if (display) {
        const minutes = Math.floor(pomodoroTimeLeft / 60);
        const seconds = pomodoroTimeLeft % 60;
        display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// ===== Breathing Exercise =====
let breathingTimerId = null;
let breathingPhase = 0;
const breathingPhases = ['Inhale', 'Hold', 'Exhale', 'Hold'];

function startBreathing() {
    if (breathingTimerId) return;
    
    breathingPhase = 0;
    updateBreathingPhase();
    
    breathingTimerId = setInterval(() => {
        breathingPhase = (breathingPhase + 1) % 4;
        updateBreathingPhase();
    }, 4000);
}

function stopBreathing() {
    clearInterval(breathingTimerId);
    breathingTimerId = null;
    document.getElementById('breathingPhase').textContent = 'Ready';
    document.getElementById('breathingTimer').textContent = '4 seconds';
}

function updateBreathingPhase() {
    const phaseText = document.getElementById('breathingPhase');
    const timerText = document.getElementById('breathingTimer');
    const circle = document.getElementById('breathingCircle');
    
    if (phaseText) {
        phaseText.textContent = breathingPhases[breathingPhase];
    }
    
    if (timerText) {
        timerText.textContent = '4 seconds';
    }
    
    if (circle) {
        // Scale animation based on phase
        const scales = [1.3, 1, 0.8, 1];
        circle.style.transform = `scale(${scales[breathingPhase]})`;
        circle.style.transition = 'transform 4s ease-in-out';
    }
}
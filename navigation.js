// ===== Navigation Functions =====

// Navigate to a specific page
function navigateTo(page) {
    const menuItem = document.querySelector(`.menu-item[data-page="${page}"]`);
    if (menuItem) {
        menuItem.click();
    }
}

// Get current page
function getCurrentPage() {
    const activeMenuItem = document.querySelector('.menu-item.active');
    if (activeMenuItem) {
        return activeMenuItem.dataset.page;
    }
    return null;
}

// ===== Breadcrumb Generator =====
function generateBreadcrumb() {
    const page = getCurrentPage();
    if (!page) return;
    
    const breadcrumbMap = {
        'dashboard': 'Dashboard',
        'mood-tracker': 'Mood Tracker',
        'stress-tracker': 'Stress Tracker',
        'journal': 'Journal',
        'pomodoro': 'Pomodoro',
        'breathing': 'Breathing Exercise',
        'kamustahan': 'Kamustahan',
        'appointments': 'Appointments',
        'notifications': 'Notifications',
        'achievements': 'Achievements',
        'profile': 'Profile',
        'settings': 'Settings'
    };
    
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        const pageName = breadcrumbMap[page] || page;
        breadcrumb.innerHTML = `
            <li class="breadcrumb-item"><a href="#" onclick="navigateTo('dashboard')">Home</a></li>
            <li class="breadcrumb-item active">${pageName}</li>
        `;
    }
}

// Call on page load and navigation
document.addEventListener('DOMContentLoaded', generateBreadcrumb);
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', generateBreadcrumb);
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', function(e) {
    // Ctrl + 1-9 for navigation
    if (e.ctrlKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const pages = ['dashboard', 'mood-tracker', 'stress-tracker', 'journal', 'pomodoro', 'breathing', 'kamustahan', 'appointments', 'notifications'];
        const index = parseInt(e.key) - 1;
        if (index < pages.length) {
            navigateTo(pages[index]);
        }
    }
    
    // Escape to close sidebar
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('show')) {
            toggleSidebar();
        }
    }
});

// ===== Search Functionality =====
document.querySelector('.search-box input')?.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
            // Search across pages
            searchContent(query);
        }
    }
});

function searchContent(query) {
    // Search in current page content
    const currentPage = document.querySelector('.page-content.active');
    if (!currentPage) return;
    
    // Clear previous highlights
    currentPage.querySelectorAll('.search-highlight').forEach(el => {
        el.classList.remove('search-highlight');
    });
    
    // Search for text
    const searchRegex = new RegExp(query, 'gi');
    const textElements = currentPage.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, td, th');
    
    let found = false;
    textElements.forEach(el => {
        if (searchRegex.test(el.textContent)) {
            el.innerHTML = el.innerHTML.replace(searchRegex, match => {
                found = true;
                return `<span class="search-highlight">${match}</span>`;
            });
        }
    });
    
    if (found) {
        // Scroll to first match
        const firstMatch = currentPage.querySelector('.search-highlight');
        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Add search highlight styles
const style = document.createElement('style');
style.textContent = `
    .search-highlight {
        background-color: rgba(85, 107, 79, 0.2);
        padding: 0 2px;
        border-radius: 4px;
        font-weight: 600;
    }
`;
document.head.appendChild(style);
// State Management
const state = {
    currentPhaseIndex: 0,
    currentFilter: 'all', // 'all', 'beginner', 'intermediate', 'advanced'
    searchQuery: '',
    completedTopics: JSON.parse(localStorage.getItem('djangomongo_completed_topics') || '[]')
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Navigation (Sidebar/MobileMenu)
    renderPhasesNavigation();

    // 2. Render Initial Active Phase
    renderActivePhase();

    // 3. Update Progress UI
    updateProgress();

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('global-search').focus();
        }
    });

    // Mobile specific: Close sidebar if clicking outside
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const mobileBtn = document.querySelector('button[onclick="toggleMobileMenu()"]');
        if (window.innerWidth < 1024 &&
            !sidebar.classList.contains('hidden') &&
            !sidebar.contains(e.target) &&
            !mobileBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
});

// --- RENDER FUNCTIONS ---

function renderPhasesNavigation() {
    const sidebarList = document.getElementById('phases-list');
    const mobileList = document.getElementById('mobile-phases-list');

    sidebarList.innerHTML = '';
    mobileList.innerHTML = '';

    roadmapData.forEach((phase, index) => {
        // Desktop Sidebar Item
        const isActive = index === state.currentPhaseIndex;
        const isCompleted = isPhaseCompleted(phase);

        const sidebarItem = document.createElement('button');
        sidebarItem.onclick = () => setPhase(index);
        sidebarItem.className = `w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group ${isActive
                ? 'bg-gradient-to-r from-green-500/10 to-transparent border-l-2 border-green-500 text-green-400'
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200 border-l-2 border-transparent border-slate-900'
            }`;

        sidebarItem.innerHTML = `
            <div class="flex items-center gap-3">
                <i data-lucide="${phase.icon || 'folder'}" class="w-4 h-4 ${isActive ? 'text-green-500' : 'text-gray-500 group-hover:text-gray-400'}"></i>
                <span class="truncate w-40">${phase.phase}</span>
            </div>
            ${isCompleted ? '<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-green-600"></i>' : ''}
        `;
        sidebarList.appendChild(sidebarItem);

        // Mobile Pill Item
        const mobileItem = document.createElement('button');
        mobileItem.onclick = () => setPhase(index);
        mobileItem.className = `shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${isActive
                ? 'bg-green-600 border-green-600 text-white'
                : 'bg-slate-800 border-slate-700 text-gray-400 hover:border-gray-500'
            }`;
        mobileItem.innerText = phase.phase; // Simplified for mobile
        mobileList.appendChild(mobileItem);
    });

    lucide.createIcons();
}

function renderActivePhase() {
    const phase = roadmapData[state.currentPhaseIndex];
    if (!phase) return;

    // Update Header Info
    document.getElementById('active-phase-breadcrumb').textContent = phase.phase;
    document.getElementById('phase-title').textContent = phase.phase;
    document.getElementById('phase-description').textContent = phase.description;
    document.getElementById('phase-icon-container').innerHTML = `<i data-lucide="${phase.icon || 'folder'}" class="w-8 h-8 text-white"></i>`;

    // Filter Topics within this phase
    const grid = document.getElementById('topics-grid');
    grid.innerHTML = '';

    let visibleCount = 0;

    phase.topics.forEach(topic => {
        // Filter Logic
        const matchesDiff = state.currentFilter === 'all' || topic.difficulty === state.currentFilter;
        const matchesSearch = state.searchQuery === '' ||
            topic.title.toLowerCase().includes(state.searchQuery) ||
            topic.description.toLowerCase().includes(state.searchQuery);

        if (!matchesDiff || !matchesSearch) return;

        visibleCount++;
        const card = createTopicCard(topic);
        grid.appendChild(card);
    });

    // Empty State
    if (visibleCount === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                <i data-lucide="filter" class="w-12 h-12 text-slate-700 mx-auto mb-4"></i>
                <h3 class="text-gray-400 font-medium">No topics found</h3>
                <p class="text-sm text-gray-600 mt-1">Try changing the difficulty filter or search term</p>
                <button onclick="clearFilters()" class="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors">
                    Clear Filters
                </button>
            </div>
        `;
    }

    // Handle Pagination Buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = state.currentPhaseIndex === 0;
    nextBtn.disabled = state.currentPhaseIndex === roadmapData.length - 1;

    // Update button text for Next Phase context
    const nextTextDiv = nextBtn.querySelector('.text-sm');
    if (state.currentPhaseIndex < roadmapData.length - 1) {
        if (nextTextDiv) nextTextDiv.textContent = roadmapData[state.currentPhaseIndex + 1].phase;
    } else {
        if (nextTextDiv) nextTextDiv.textContent = "All Phases Complete";
    }

    // Scroll to top of content
    document.getElementById('main-scroll').scrollTo({ top: 0, behavior: 'smooth' });

    lucide.createIcons();
}

function createTopicCard(topic) {
    const isCompleted = state.completedTopics.includes(topic.id);
    const difficultyColors = {
        'beginner': 'text-green-400 bg-green-400/10 border-green-400/20',
        'intermediate': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
        'advanced': 'text-red-400 bg-red-400/10 border-red-400/20',
        'expert': 'text-purple-400 bg-purple-400/10 border-purple-400/20'
    };

    const div = document.createElement('div');
    div.className = `group relative bg-[#161b22] border rounded-xl p-5 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300 card-hover ${isCompleted ? 'border-green-500/30' : 'border-slate-800'
        }`;

    div.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${difficultyColors[topic.difficulty] || 'text-gray-400 bg-gray-400/10 border-gray-400/20'}">
                ${topic.difficulty}
            </span>
            <button onclick="toggleTopicCompletion('${topic.id}')" 
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isCompleted
            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
            : 'bg-slate-800 text-slate-500 hover:text-white hover:bg-slate-700'
        }">
                <i data-lucide="check" class="w-4 h-4"></i>
            </button>
        </div>
        
        <div class="mb-6">
            <h3 class="text-lg font-bold text-gray-100 mb-2 group-hover:text-green-400 transition-colors line-clamp-1" title="${topic.title}">${topic.title}</h3>
            <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed">${topic.description}</p>
        </div>
        
        <div class="flex items-center justify-between mt-auto">
            <div class="flex items-center gap-3 text-xs text-gray-500 font-mono">
                <div class="flex items-center gap-1.5">
                    <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                    ${topic.estimatedTime}
                </div>
            </div>
            
            <a href="${topic.githubUrl}" target="_blank" 
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                <span>View Code</span>
                <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
            </a>
        </div>
    `;
    return div;
}

// --- LOGIC FUNCTIONS ---

function setPhase(index) {
    state.currentPhaseIndex = index;
    renderPhasesNavigation(); // Re-render to update active state style
    renderActivePhase();
}

function nextPhase() {
    if (state.currentPhaseIndex < roadmapData.length - 1) {
        setPhase(state.currentPhaseIndex + 1);
    }
}

function prevPhase() {
    if (state.currentPhaseIndex > 0) {
        setPhase(state.currentPhaseIndex - 1);
    }
}

function setDifficulty(diff) {
    state.currentFilter = diff;

    // Update Buttons UI
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        if (btn.dataset.diff === diff) {
            btn.classList.add('bg-slate-800', 'text-white');
            btn.classList.remove('text-gray-400');
        } else {
            btn.classList.remove('bg-slate-800', 'text-white');
            btn.classList.add('text-gray-400');
        }
    });

    renderActivePhase();
}

function handleSearch(query) {
    state.searchQuery = query.toLowerCase();

    renderActivePhase();
    highlightPhasesWithMatches();
}

function highlightPhasesWithMatches() {
    if (state.searchQuery.length < 2) {
        renderPhasesNavigation(); // Reset
        return;
    }

    roadmapData.forEach((phase, index) => {
        const hasMatch = phase.topics.some(t =>
            t.title.toLowerCase().includes(state.searchQuery) ||
            t.description.toLowerCase().includes(state.searchQuery)
        );

        // Find sidebar item
        const sidebarButtons = document.querySelectorAll('#phases-list button');
        if (sidebarButtons[index]) {
            if (hasMatch) {
                sidebarButtons[index].classList.add('bg-slate-800', 'border-slate-700');
            } else {
                sidebarButtons[index].classList.add('opacity-40');
            }
        }
    });
}

function clearFilters() {
    state.searchQuery = '';
    state.currentFilter = 'all';
    document.getElementById('global-search').value = '';
    setDifficulty('all');
}

function toggleTopicCompletion(id) {
    if (state.completedTopics.includes(id)) {
        state.completedTopics = state.completedTopics.filter(t => t !== id);
        showToast('Marked as pending');
    } else {
        state.completedTopics.push(id);
        showToast('Topic Completed! 🎉', 'success');
    }
    localStorage.setItem('djangomongo_completed_topics', JSON.stringify(state.completedTopics));

    // Re-render
    renderActivePhase();
    renderPhasesNavigation(); // Update checkmarks in sidebar
    updateProgress();
}

function updateProgress() {
    // Calculate total stats
    const totalTopics = roadmapData.reduce((acc, p) => acc + p.topics.length, 0);
    const completedCount = state.completedTopics.length;
    const progress = Math.round((completedCount / totalTopics) * 100) || 0;

    // Update Navbar Widget
    const progressBar = document.getElementById('nav-progress-bar');
    const progressText = document.getElementById('nav-progress-text');

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}%`;
}

function isPhaseCompleted(phase) {
    if (phase.topics.length === 0) return false;
    return phase.topics.every(t => state.completedTopics.includes(t.id));
}

function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');

    // Reset classes
    toast.className = `fixed bottom-6 right-6 translate-y-24 opacity-0 transition-all duration-300 z-[60] px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 ${type === 'success' ? 'bg-green-900 border border-green-700 text-white' : 'bg-slate-800 border border-slate-700 text-white'
        }`;

    msgEl.textContent = msg;

    // Show
    requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-24');
    });

    // Hide
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-24');
    }, 3000);
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');

    if (sidebar.classList.contains('hidden')) {
        // Show sidebar for mobile
        sidebar.classList.remove('hidden');
        sidebar.classList.add('fixed', 'inset-0', 'z-40', 'w-3/4', 'border-r-2', 'shadow-2xl');

        // Add overlay? For simplicity just click outside listener handles it
    } else {
        // Hide
        sidebar.classList.add('hidden');
        sidebar.classList.remove('fixed', 'inset-0', 'z-40', 'w-3/4', 'border-r-2', 'shadow-2xl');
    }
}

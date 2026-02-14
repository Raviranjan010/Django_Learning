// State Management
const state = {
    currentPhaseIndex: 0,
    currentFilter: 'all', // 'all', 'beginner', 'intermediate', 'advanced'
    searchQuery: '',
    viewMode: localStorage.getItem('djangomongo_view_mode') || 'grid',
    completedTopics: JSON.parse(localStorage.getItem('djangomongo_completed_topics') || '[]')
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Navigation
    renderPhasesNavigation();

    // 2. Render Initial Active Phase
    renderActivePhase();

    // 3. Update Progress UI
    updateProgress();

    // Event Listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Global Search (Ctrl+K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('global-search').focus();
        }
    });

    // Sidebar Phase Filter
    const phaseFilter = document.getElementById('phase-filter');
    if (phaseFilter) {
        phaseFilter.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            const buttons = document.querySelectorAll('#phases-list button');

            buttons.forEach(btn => {
                const text = btn.innerText.toLowerCase();
                if (text.includes(term)) {
                    btn.style.display = 'flex';
                } else {
                    btn.style.display = 'none';
                }
            });
        });
    }

    // Close Sidebar on Mobile when clicking outside (Overlay handled in HTML onclick)
}

// --- RENDER FUNCTIONS ---

function renderPhasesNavigation() {
    const sidebarList = document.getElementById('phases-list');
    if (!sidebarList) return;

    sidebarList.innerHTML = '';

    roadmapData.forEach((phase, index) => {
        const isActive = index === state.currentPhaseIndex;
        const isCompleted = isPhaseCompleted(phase);

        const btn = document.createElement('button');
        btn.onclick = () => {
            setPhase(index);
            // On mobile, close sidebar after selection
            if (window.innerWidth < 768) {
                toggleSidebar();
            }
        };

        // Dynamic Classes based on state
        const baseClasses = "w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-between group mx-1 my-0.5";
        const activeClasses = isActive
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent";

        btn.className = `${baseClasses} ${activeClasses}`;

        btn.innerHTML = `
            <div class="flex items-center gap-3 overflow-hidden">
                <i data-lucide="${phase.icon || 'folder'}" class="w-4 h-4 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-400'}"></i>
                <span class="truncate">${phase.phase}</span>
            </div>
            ${isCompleted ? '<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></i>' : ''}
        `;
        sidebarList.appendChild(btn);
    });

    lucide.createIcons();
}

function renderActivePhase() {
    const phase = roadmapData[state.currentPhaseIndex];
    if (!phase) return;

    // Update Header Info
    const breadcrumb = document.getElementById('breadcrumb-phase');
    if (breadcrumb) breadcrumb.textContent = phase.phase;

    document.getElementById('phase-title').textContent = phase.phase;
    document.getElementById('phase-description').textContent = phase.description;

    // Update Icon
    const iconContainer = document.getElementById('phase-icon-wrapper');
    if (iconContainer) {
        iconContainer.innerHTML = `<i data-lucide="${phase.icon || 'folder'}" class="w-8 h-8 md:w-10 md:h-10 text-emerald-400"></i>`;
    }

    // Filter Topics
    const grid = document.getElementById('topics-grid');
    grid.innerHTML = '';

    // Adjust Grid Layout based on View Mode
    if (state.viewMode === 'list') {
        grid.className = 'grid grid-cols-1 gap-4';
    } else {
        grid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';
    }

    // Update Toggle Buttons UI
    const gridBtn = document.getElementById('view-grid-btn');
    const listBtn = document.getElementById('view-list-btn');

    if (gridBtn && listBtn) {
        if (state.viewMode === 'grid') {
            gridBtn.classList.add('bg-slate-800', 'text-white', 'shadow-sm');
            gridBtn.classList.remove('text-slate-400');
            listBtn.classList.remove('bg-slate-800', 'text-white', 'shadow-sm');
            listBtn.classList.add('text-slate-400');
        } else {
            listBtn.classList.add('bg-slate-800', 'text-white', 'shadow-sm');
            listBtn.classList.remove('text-slate-400');
            gridBtn.classList.remove('bg-slate-800', 'text-white', 'shadow-sm');
            gridBtn.classList.add('text-slate-400');
        }
    }

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
            <div class="col-span-full py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
                <i data-lucide="filter" class="w-12 h-12 text-slate-700 mx-auto mb-4"></i>
                <h3 class="text-slate-400 font-medium">No topics found</h3>
                <p class="text-sm text-slate-600 mt-1">Try changing the difficulty filter or search term</p>
                <button onclick="clearFilters()" class="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors border border-slate-700">
                    Clear Filters
                </button>
            </div>
        `;
    }

    // Handle Pagination Buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) prevBtn.disabled = state.currentPhaseIndex === 0;
    if (nextBtn) {
        nextBtn.disabled = state.currentPhaseIndex === roadmapData.length - 1;

        // Update next button text
        const nextTextDiv = nextBtn.querySelector('.text-[10px]');
        if (state.currentPhaseIndex < roadmapData.length - 1) {
            // Optional: Show name of next phase
            // if (nextTextDiv) nextTextDiv.textContent = "NEXT: " + roadmapData[state.currentPhaseIndex + 1].phase;
        }
    }

    // Scroll to top
    const mainScroll = document.getElementById('main-scroll');
    if (mainScroll) mainScroll.scrollTo({ top: 0, behavior: 'smooth' });

    lucide.createIcons();
}

function createTopicCard(topic) {
    const isCompleted = state.completedTopics.includes(topic.id);
    const difficultyColors = {
        'beginner': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        'intermediate': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        'advanced': 'text-rose-400 bg-rose-400/10 border-rose-400/20',
        'expert': 'text-purple-400 bg-purple-400/10 border-purple-400/20'
    };

    const div = document.createElement('div');
    // Glass card style
    div.className = `group relative bg-slate-900/40 backdrop-blur-sm border rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-300 transform hover:-translate-y-1 ${isCompleted ? 'border-emerald-500/30 bg-emerald-900/5' : 'border-slate-800'} ${state.viewMode === 'list' ? 'flex flex-col md:flex-row md:items-center gap-6' : ''}`;

    div.innerHTML = `
        <div class="${state.viewMode === 'list' ? 'md:w-64 shrink-0 flex flex-col gap-3' : 'flex justify-between items-start mb-5'}">
            <div class="flex justify-between w-full"> 
                 <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${difficultyColors[topic.difficulty] || 'text-slate-400 bg-slate-400/10 border-slate-400/20'}">
                    ${topic.difficulty}
                </span>
                 <button onclick="toggleTopicCompletion('${topic.id}')" 
                    class="${state.viewMode === 'list' ? 'md:hidden' : ''} w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isCompleted
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
            : 'bg-slate-800 text-slate-500 hover:text-white hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
        }">
                    <i data-lucide="check" class="w-4 h-4"></i>
                </button>
            </div>
            
             <button onclick="toggleTopicCompletion('${topic.id}')" 
                    class="hidden ${state.viewMode === 'list' ? 'md:flex' : ''} w-full py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${isCompleted
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
            : 'bg-slate-800 text-slate-500 hover:text-white hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
        }">
                    <i data-lucide="check" class="w-4 h-4"></i>
                    <span class="text-xs font-bold">${isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
        </div>
        
        <div class="${state.viewMode === 'list' ? 'flex-1 min-w-0' : 'mb-8'}">
            <h3 class="text-xl font-bold text-slate-100 mb-3 group-hover:text-emerald-400 transition-colors line-clamp-1" title="${topic.title}">${topic.title}</h3>
            <p class="text-sm text-slate-400 leading-relaxed line-clamp-3">${topic.description}</p>
        </div>
        
        <div class="${state.viewMode === 'list' ? 'md:w-48 shrink-0 flex md:flex-col items-end md:items-stretch gap-4' : 'flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50'}">
            <div class="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                <span>${topic.estimatedTime}</span>
            </div>
            
            <a href="${topic.githubUrl}" target="_blank" 
                class="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 hover:text-white text-xs font-bold text-white transition-all duration-300 border border-emerald-500 shadow-lg shadow-emerald-900/20 group-hover:scale-105">
                <span>Start</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
        </div>
    `;
    return div;
}

// --- LOGIC FUNCTIONS ---

function setPhase(index) {
    state.currentPhaseIndex = index;
    renderPhasesNavigation();
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
            btn.classList.remove('text-slate-400', 'hover:text-white');
            btn.classList.add('bg-slate-800', 'text-white', 'shadow-sm');
        } else {
            btn.classList.add('text-slate-400', 'hover:text-white');
            btn.classList.remove('bg-slate-800', 'text-white', 'shadow-sm');
        }
    });

    renderActivePhase();
}

function setViewMode(mode) {
    state.viewMode = mode;
    localStorage.setItem('djangomongo_view_mode', mode);
    renderActivePhase();
}

function handleSearch(query) {
    state.searchQuery = query.toLowerCase();
    renderActivePhase();
    // Optional: Auto-expand sidebar matches could go here
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

    renderActivePhase();
    renderPhasesNavigation();
    updateProgress();
}

function updateProgress() {
    const totalTopics = roadmapData.reduce((acc, p) => acc + p.topics.length, 0);
    const completedCount = state.completedTopics.length;
    const progress = Math.round((completedCount / totalTopics) * 100) || 0;

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
    const iconContainer = toast.querySelector('div'); // The circle container
    const icon = iconContainer.querySelector('i'); // The icon itself

    // Reset basic structure

    // Update content and styling
    msgEl.textContent = msg;

    if (type === 'success') {
        toast.querySelector('h4').textContent = 'Success';
        iconContainer.className = 'w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400';
        // We assume the icon is already check-circle or similar
    } else {
        toast.querySelector('h4').textContent = 'Info';
        iconContainer.className = 'w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400';
    }

    // Animation: visible
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        toast.style.pointerEvents = 'auto';
    }, 10);

    // Hide after delay
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(128px)'; // translate-y-32
        toast.style.pointerEvents = 'none';
    }, 3000);
}


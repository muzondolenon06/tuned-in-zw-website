const API_BASE = window.location.hostname.includes('vercel.app') ? 'https://tuned-in-zw-backend.onrender.com' : ((window.location.origin && window.location.origin.startsWith('http')) ? window.location.origin : 'http://127.0.0.1:8006');

// -----------------------------------------
// Global State
// -----------------------------------------
let currentUserId = sessionStorage.getItem('currentUserId') ? parseInt(sessionStorage.getItem('currentUserId')) : 1;
let currentUsername = sessionStorage.getItem('currentUsername') || 'SmartAmbassador';
let currentUniversity = sessionStorage.getItem('currentUniversity') || 'UZ';
let currentSafeSpaceTopic = 'How I Navigated Peer Pressure';

const ACADEMY_TITLES = [
    "Binge Drinking & Health Limits",
    "Drinking & Driving Prevention",
    "Illicit & Unregulated Brews",
    "Underage Drinking & Campus Culture",
    "Alcohol & Pregnancy",
    "Sugary Drinks, Diet & Long-Term Health"
];

const SUPPORT_HUB_TITLES = [
    "Peer Pressure & Social Isolation",
    "Gender-Based Violence (GBV) & Alcohol",
    "Mental Health & Coping",
    "Overdose & Alcohol Poisoning Protocol"
];

const PEER_STORY_CATEGORIES = [
    "How I Navigated Peer Pressure",
    "Overcoming Addiction",
    "Hosting Sober Events",
    "Campus Stories"
];

// -----------------------------------------
// Optimistic UI State Stores
// -----------------------------------------
let userRSVPs = {};
try { userRSVPs = JSON.parse(localStorage.getItem('userRSVPs') || '{}'); } catch(e){}

let userLikedStories = {};
try { userLikedStories = JSON.parse(localStorage.getItem('userLikedStories') || '{}'); } catch(e){}

// -----------------------------------------
// Skeleton Loading Renderers (Mirrors Content • Zero Layout Shift)
// -----------------------------------------
function renderEventsSkeleton(count = 3) {
    let cards = '';
    for (let i = 0; i < count; i++) {
        cards += `
            <div class="event-card-skeleton" aria-hidden="true">
                <div class="skeleton-shimmer skeleton-banner"></div>
                <div style="padding:18px; display:flex; flex-direction:column; flex:1;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <div class="skeleton-shimmer skeleton-badge"></div>
                        <div class="skeleton-shimmer skeleton-badge" style="width:70px;"></div>
                    </div>
                    <div class="skeleton-shimmer skeleton-title" style="margin-bottom:10px;"></div>
                    <div class="skeleton-shimmer skeleton-line medium" style="margin-bottom:6px;"></div>
                    <div class="skeleton-shimmer skeleton-line short" style="margin-bottom:12px;"></div>
                    <div class="skeleton-shimmer skeleton-line" style="margin-bottom:6px;"></div>
                    <div class="skeleton-shimmer skeleton-line" style="width:88%; margin-bottom:16px;"></div>
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:12px; margin-top:auto;">
                        <div class="skeleton-shimmer skeleton-line short" style="width:85px; margin-bottom:0;"></div>
                        <div class="skeleton-shimmer skeleton-btn"></div>
                    </div>
                </div>
            </div>
        `;
    }
    return cards;
}

function renderPeerStoriesSkeleton(count = 3) {
    let items = '';
    for (let i = 0; i < count; i++) {
        items += `
            <div class="peer-story-skeleton" aria-hidden="true">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div class="skeleton-shimmer skeleton-avatar"></div>
                        <div class="skeleton-shimmer skeleton-line short" style="width:85px; height:15px; margin-bottom:0;"></div>
                    </div>
                    <div class="skeleton-shimmer skeleton-badge" style="width:105px;"></div>
                </div>
                <div class="skeleton-shimmer skeleton-line" style="margin-bottom:6px;"></div>
                <div class="skeleton-shimmer skeleton-line" style="width:80%; margin-bottom:10px;"></div>
                <div style="display:flex; justify-content:space-between; align-items:center; padding-top:8px; border-top:1px solid rgba(255,255,255,0.06);">
                    <div class="skeleton-shimmer skeleton-badge" style="width:65px; height:24px; border-radius:15px !important;"></div>
                </div>
            </div>
        `;
    }
    return items;
}

function renderNewsSkeleton(count = 4) {
    let cards = '';
    for (let i = 0; i < count; i++) {
        cards += `
            <div class="news-card-skeleton" aria-hidden="true">
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <div class="skeleton-shimmer skeleton-badge" style="width:80px;"></div>
                        <div class="skeleton-shimmer skeleton-badge" style="width:65px;"></div>
                    </div>
                    <div class="skeleton-shimmer skeleton-title" style="margin-bottom:12px;"></div>
                    <div class="skeleton-shimmer skeleton-line" style="margin-bottom:6px;"></div>
                    <div class="skeleton-shimmer skeleton-line" style="margin-bottom:6px;"></div>
                    <div class="skeleton-shimmer skeleton-line" style="width:75%; margin-bottom:16px;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:10px;">
                    <div class="skeleton-shimmer skeleton-line short" style="width:70px; margin-bottom:0;"></div>
                    <div class="skeleton-shimmer skeleton-line short" style="width:90px; margin-bottom:0;"></div>
                </div>
            </div>
        `;
    }
    return cards;
}

function renderModulesSkeleton(count = 6) {
    let cards = '';
    for (let i = 0; i < count; i++) {
        cards += `
            <div class="outreach-card" style="display:flex; flex-direction:column; justify-content:space-between; height:100%; min-height:220px;" aria-hidden="true">
                <div>
                    <div style="display:flex; justify-content:flex-end; margin-bottom:10px;">
                        <div class="skeleton-shimmer skeleton-badge" style="width:90px;"></div>
                    </div>
                    <div class="skeleton-shimmer skeleton-title" style="margin-bottom:12px;"></div>
                    <div class="skeleton-shimmer skeleton-line" style="margin-bottom:6px;"></div>
                    <div class="skeleton-shimmer skeleton-line" style="width:85%; margin-bottom:16px;"></div>
                </div>
                <div class="skeleton-shimmer skeleton-btn" style="width:100%; height:42px;"></div>
            </div>
        `;
    }
    return `<div class="grid-layout">${cards}</div>`;
}

function getCompletedModules() {
    try {
        const raw = localStorage.getItem('completedSmartModules');
        return raw ? JSON.parse(raw) : ["Binge Drinking & Health Limits", "Drinking & Driving Prevention"];
    } catch (e) {
        return ["Binge Drinking & Health Limits"];
    }
}

function markModuleCompleted(title) {
    const completed = getCompletedModules();
    if (!completed.includes(title)) {
        completed.push(title);
        try {
            localStorage.setItem('completedSmartModules', JSON.stringify(completed));
        } catch (e) {}
    }
    return completed;
}

// -----------------------------------------
// Navigation Logic
// -----------------------------------------
function switchMainView(viewId, el) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const targetNav = el || document.querySelector(`.bottom-nav .nav-item[data-view="${viewId}"]`);
    if (targetNav) targetNav.classList.add('active');

    document.querySelectorAll('.content-view').forEach(view => view.classList.remove('active'));
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');

    if (viewId === 'outreach') {
        loadOutreach('home');
    } else if (viewId === 'influence') {
        loadAboveTheInfluenceView();
    } else if (viewId === 'news') {
        loadNews('All');
    } else if (viewId === 'radio') {
        loadRadio('All');
    } else if (viewId === 'events') {
        loadEvents('All');
    } else if (viewId === 'besure') {
        switchBeSureTab('verify', document.querySelector('#view-besure .out-tab'));
    }
}

function closeDetailView() {
    switchMainView('outreach', document.querySelector('.bottom-nav .nav-item[data-view="outreach"]'));
    switchOutreachTab('home', document.querySelectorAll('#view-outreach .out-tab')[0]);
}

function closeSafeSpaceDetailView() {
    switchMainView('influence', document.querySelector('.bottom-nav .nav-item[data-view="influence"]'));
}

async function loadAboveTheInfluenceView() {
    const container = document.getElementById('influence-feed');
    if (!container) return;
    container.innerHTML = renderModulesSkeleton(4);

    try {
        const res = await fetch(`${API_BASE}/modules`);
        const allModules = await res.json();
        const modules = allModules.filter(m => SUPPORT_HUB_TITLES.includes(m.title));

        let html = `
            <div style="display:flex; gap:20px; flex-wrap:wrap; align-items:flex-start;">
        `;

        // Left Column: 4 Harm-Reduction Guides
        html += '<div style="flex: 1 1 58%; min-width:300px;">';
        html += '<h3 style="margin-bottom:15px; color:#2ecc71;">Harm-Reduction &amp; Coping Playbooks</h3>';
        html += '<div class="grid-layout" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">';
        if (modules.length === 0) {
            html += '<p style="text-align:center; padding:20px; width:100%;">No guides available.</p>';
        } else {
            modules.forEach(mod => {
                html += `
                    <div class="outreach-card" style="display:flex; flex-direction:column; justify-content:space-between; height:100%; border-left:3px solid #2ecc71;">
                        <div>
                            <h3 class="card-title">${mod.title}</h3>
                            <p class="card-desc" style="color:#aaa; font-size:14px; margin-bottom:15px;">${mod.description}</p>
                        </div>
                        <button onclick="openModuleDetail(${mod.id}, '${mod.title.replace(/'/g, "\\'")}', false)" style="width:100%; background:#2ecc71; color:#fff; border:none; padding:10px; border-radius:5px; font-weight:bold; cursor:pointer;">
                            Open Harm-Reduction Playbook →
                        </button>
                    </div>
                `;
            });
        }
        html += '</div>';

        // Quick Watchdog Banner inside Support Hub
        html += `
            <div class="outreach-card" style="margin-top:20px; border:1px solid rgba(231, 76, 60, 0.4); background:rgba(231, 76, 60, 0.08); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
                <div>
                    <h4 style="color:#e74c3c; margin:0 0 5px 0;">Spotted Illicit Brews ('Kambwa') or Underage Selling?</h4>
                    <p style="color:#ccc; font-size:0.88rem; margin:0;">Submit a 100% confidential tip to Campus Security &amp; Law Enforcement Liaisons.</p>
                </div>
                <button onclick="switchMainView('outreach', document.querySelector('.bottom-nav .nav-item[data-view=\\'outreach\\']')); setTimeout(() => switchOutreachTab('watchdog', document.querySelectorAll('#view-outreach .out-tab')[1]), 100);" style="background:#e74c3c; color:#fff; border:none; padding:10px 18px; border-radius:5px; font-weight:bold; cursor:pointer;">
                    Report Confidentially →
                </button>
            </div>
        `;
        html += '</div>';

        // Right Column: Peer Stories Forum with Anonymous Toggle & 4 Categories
        html += `
            <div style="flex: 1 1 36%; min-width:290px;" class="outreach-card">
                <h3 class="card-title" style="margin-bottom:8px;">Peer Stories Forum</h3>
                <p style="font-size:0.85rem; color:#aaa; margin-bottom:12px;">Real stories from Zimbabwean university students navigating peer pressure, sobriety, and campus life.</p>
                
                <button onclick="document.getElementById('global-share-form').style.display='block'; this.style.display='none';" id="global-share-btn" style="width:100%; background:#3498db; color:#fff; border:none; padding:10px; border-radius:5px; font-weight:bold; cursor:pointer; margin-bottom:14px;">
                    + Share Your Story (Anonymous Option)
                </button>
                
                <div id="global-share-form" style="display:none; margin-bottom:18px; background:rgba(0,0,0,0.3); padding:14px; border-radius:8px; border:1px solid rgba(255,255,255,0.12);">
                    <label style="font-size:0.8rem; color:#aaa; display:block; margin-bottom:4px;">Story Category:</label>
                    <select id="global-share-topic" style="width:100%; margin-bottom:10px; padding:8px; background:#1a2332; color:#fff; border:1px solid #555; border-radius:5px;">
                        ${PEER_STORY_CATEGORIES.map(t => `<option value="${t}">${t}</option>`).join('')}
                    </select>
                    <textarea id="global-share-text" placeholder="Share how you declined a drink, helped a friend, overcame addiction, or hosted a sober event..." style="width:100%; height:85px; margin-bottom:10px; padding:10px; border-radius:5px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.08); color:white; box-sizing:border-box;"></textarea>
                    
                    <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#2ecc71; margin-bottom:10px; cursor:pointer; font-weight:600;">
                        <input type="checkbox" id="global-share-anon" checked />
                        <span>Post Anonymously (Hide my name)</span>
                    </label>
                    
                    <input type="file" id="global-share-image" accept="image/*" style="margin-bottom:10px; width:100%; color:#aaa; font-size:0.8rem;" />
                    <button onclick="submitGlobalExperience()" id="global-submit-btn" style="background:#2ecc71; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer; font-weight:bold; width:100%;">
                        Publish Peer Story
                    </button>
                </div>

                <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px;">
                    <button onclick="fetchGlobalPeerFeed('')" style="font-size:0.72rem; padding:4px 8px; border-radius:12px; border:1px solid #3498db; background:rgba(52,152,219,0.2); color:#fff; cursor:pointer;">All</button>
                    ${PEER_STORY_CATEGORIES.map(c => `<button onclick="fetchGlobalPeerFeed('${c.replace(/'/g, "\\'")}')" style="font-size:0.72rem; padding:4px 8px; border-radius:12px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:#ccc; cursor:pointer;">${c}</button>`).join('')}
                </div>
                
                <div id="global-peer-feed" style="max-height: 520px; overflow-y: auto; padding-right:5px;">
                    <p style="text-align:center;">Loading peer stories...</p>
                </div>
            </div>
        `;
        html += '</div>';
        container.innerHTML = html;

        fetchGlobalPeerFeed();
    } catch (e) {
        container.innerHTML = '<p style="text-align:center; color:red;">Failed to load Support Hub. Ensure backend is running.</p>';
    }
}

// -----------------------------------------
// Youth Connect+: Above the Influence (Outreach) Logic
// -----------------------------------------
function switchOutreachTab(tabId, el) {
    document.querySelectorAll('#view-outreach .out-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    loadOutreach(tabId);
}

async function loadOutreach(tabId) {
    const container = document.getElementById('outreach-feed');
    container.innerHTML = renderModulesSkeleton(6);

    try {
        if (tabId === 'home') {
            const res = await fetch(`${API_BASE}/modules`);
            const allModules = await res.json();
            const modules = allModules.filter(m => ACADEMY_TITLES.includes(m.title));
            const completed = getCompletedModules();
            const pct = Math.min(100, Math.round((completed.length / ACADEMY_TITLES.length) * 100));
            const isFullAmbassador = completed.length >= ACADEMY_TITLES.length;

            let html = `
                <div class="outreach-card" style="margin-bottom:25px; background:linear-gradient(135deg, rgba(46,204,113,0.14), rgba(52,152,219,0.14)); border:1px solid rgba(46,204,113,0.4); padding:22px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
                        <div>
                            <span style="background:${isFullAmbassador ? '#f1c40f' : '#2ecc71'}; color:${isFullAmbassador ? '#111' : '#fff'}; font-size:0.75rem; font-weight:800; padding:4px 10px; border-radius:12px; text-transform:uppercase;">
                                ${isFullAmbassador ? 'Certified Smart Drinking Ambassador' : 'Ambassador Certification Track'}
                            </span>
                            <h3 style="margin:10px 0 5px 0; font-size:1.35rem;">"Smart Drinking Ambassador" Digital Badge</h3>
                            <p style="color:#ccc; font-size:0.9rem; margin:0;">
                                Complete all 6 core Smart Living &amp; Moderation modules to unlock your verified Ambassador Badge &amp; contribute points to <strong>${currentUniversity}</strong>.
                            </p>
                        </div>
                        <div style="text-align:right; min-width:160px;">
                            <div style="font-size:1.6rem; font-weight:800; color:#2ecc71;">${completed.length} / ${ACADEMY_TITLES.length} Modules</div>
                            <div style="font-size:0.8rem; color:#aaa;">${pct}% Complete</div>
                        </div>
                    </div>
                    <div style="background:rgba(0,0,0,0.35); height:10px; border-radius:5px; margin-top:14px; overflow:hidden;">
                        <div style="background:linear-gradient(90deg, #2ecc71, #3498db); width:${pct}%; height:100%; border-radius:5px; transition:width 0.4s;"></div>
                    </div>
                </div>

                <div class="outreach-header">
                    <h2 style="font-size:1.8rem; margin-bottom:10px;">Smart Living &amp; Moderation Academy – 6 Core Modules</h2>
                    <p style="color:#aaa;">Evidence-based alcohol education, BAC science, illicit brew awareness, and healthy campus living.</p>
                </div>
                <div class="grid-layout">
            `;

            if (modules.length === 0) {
                html += '<p style="text-align:center; padding:20px; width:100%;">No modules available.</p>';
            } else {
                modules.forEach(mod => {
                    const isDone = completed.includes(mod.title);
                    html += `
                        <div class="outreach-card" style="position:relative; display:flex; flex-direction:column; justify-content:space-between; height:100%; padding-bottom:20px; border-top:3px solid ${isDone ? '#2ecc71' : '#3498db'};">
                            <div>
                                <div style="position:absolute; top:-10px; right:15px; background:${isDone ? '#2ecc71' : '#3498db'}; color:#fff; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:15px;">
                                    ${isDone ? '✓ Badge Earned' : 'Smart Living Module'}
                                </div>
                                <h3 class="card-title" style="margin-top:10px;">${mod.title}</h3>
                                <p class="card-desc" style="color:#aaa; font-size:14px; margin-bottom:20px;">${mod.description}</p>
                            </div>
                            <button onclick="openModuleDetail(${mod.id}, '${mod.title.replace(/'/g, "\\'")}', true)" style="width:100%; background:${isDone ? '#2ecc71' : '#3498db'}; border:none; color:#fff; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer; transition:0.2s;">
                                ${isDone ? 'Review Module & Guide →' : 'Start Module & Earn Badge →'}
                            </button>
                        </div>
                    `;
                });
            }
            html += '</div>';
            container.innerHTML = html;

        } else if (tabId === 'safespace') {
            switchMainView('influence', document.querySelector('.bottom-nav .nav-item[data-view="influence"]'));
            return;
        } else if (tabId === 'watchdog') {
            loadWatchdogIntoContainer(container);

        } else if (tabId === 'opportunities') {
            loadOpportunitiesIntoContainer(container);

        } else if (tabId === 'contact') {
            container.innerHTML = `
                <div class="outreach-card" style="text-align:center; max-width:650px; margin:0 auto; padding:30px;">
                    <h2 class="card-title" style="font-size:1.8rem; margin-bottom:12px;">Emergency Medical, Addiction &amp; GBV Helplines</h2>
                    <p class="card-desc" style="font-size:0.98rem; margin-bottom:22px; line-height:1.7; color:#ccc;">
                        If a peer is showing signs of acute alcohol poisoning (C.U.P.S.), struggling with substance dependence, or facing Gender-Based Violence, contact these verified Zimbabwean services immediately:
                    </p>
                    <div style="text-align:left; background:rgba(255,255,255,0.05); padding:22px; border-radius:10px; line-height:2.1; border-left:4px solid #e74c3c;">
                        <p><strong>National Ambulance &amp; Medical Emergency:</strong> <span style="color:#e74c3c; font-weight:bold;">999 / 994 / MARS 0800 3222</span></p>
                        <p><strong>Musasa Project (24/7 Toll-Free GBV Helpline):</strong> <span style="color:#2ecc71; font-weight:bold;">0800 4321 / +263 773 843 139</span></p>
                        <p><strong>Youth Helpline &amp; Mental Health Support:</strong> <span style="color:#3498db; font-weight:bold;">116 (Toll-Free)</span></p>
                        <p><strong>Adult Rape Clinic (Parirenyatwa Hospital):</strong> <span style="color:#2ecc71; font-weight:bold;">+263 242 703 823 / 0775 672 770</span></p>
                        <p><strong>ZRP Community Liaison &amp; Victim Friendly Unit:</strong> Report illicit brews ('kambwa') or underage sales at your nearest ZRP Station or via our <strong>Community Watchdog</strong> tab.</p>
                    </div>
                </div>
            `;
        }
    } catch (e) {
        container.innerHTML = '<p style="text-align:center; color:red;">Failed to load data. Ensure backend is running.</p>';
    }
}

// -----------------------------------------
// Confidential Community Watchdog Logic
// -----------------------------------------
async function loadWatchdogIntoContainer(container) {
    container.innerHTML = `
        <div class="outreach-header">
            <h2 style="font-size:1.8rem; margin-bottom:8px;">Confidential Community Watchdog &amp; Reporting</h2>
            <p style="color:#aaa;">Aligned with law enforcement &amp; campus security liaisons: Discreetly report illicit substance distribution ('kambwa'/'musombodhiya'), counterfeit alcohol, or underage selling without exposing your identity.</p>
        </div>
        <div style="display:flex; gap:20px; flex-wrap:wrap; align-items:flex-start;">
            <div style="flex:1 1 45%; min-width:300px;" class="outreach-card">
                <h3 class="card-title" style="color:#e74c3c; margin-bottom:10px;">Submit Anonymous Watchdog Alert</h3>
                <p style="font-size:0.85rem; color:#aaa; margin-bottom:15px;">Zero personal identifiers or IP addresses are displayed. Reports are routed to Campus Security &amp; ZRP Community Liaisons.</p>
                
                <label style="font-size:0.82rem; color:#ccc; display:block; margin-bottom:5px;">Campus / Community Location:</label>
                <input type="text" id="watchdog-location" placeholder="e.g. UZ Mt Pleasant Perimeter, Senga MSU, NUST Gate..." style="width:100%; padding:10px; margin-bottom:12px; border-radius:5px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.3); color:#fff; box-sizing:border-box;" />
                
                <label style="font-size:0.82rem; color:#ccc; display:block; margin-bottom:5px;">Incident Category:</label>
                <select id="watchdog-type" style="width:100%; padding:10px; margin-bottom:12px; border-radius:5px; border:1px solid rgba(255,255,255,0.2); background:#1a2332; color:#fff; box-sizing:border-box;">
                    <option value="Illicit / Unregulated Brew Distribution ('Kambwa')">Illicit / Unregulated Brew Distribution ('Kambwa')</option>
                    <option value="Underage Alcohol Sales (Liquor Act Violation)">Underage Alcohol Sales (Liquor Act Violation)</option>
                    <option value="Counterfeit / Unsealed Spirit Bottles">Counterfeit / Unsealed Spirit Bottles</option>
                    <option value="Unsafe Party Venue / Drink-Spiking Risk">Unsafe Party Venue / Drink-Spiking Risk</option>
                    <option value="Drunk Driving Hazard Near Campus">Drunk Driving Hazard Near Campus</option>
                </select>
                
                <label style="font-size:0.82rem; color:#ccc; display:block; margin-bottom:5px;">What did you observe? (Avoid naming innocent bystanders):</label>
                <textarea id="watchdog-desc" placeholder="Describe the illicit product, vehicle/outlet location, and time observed..." style="width:100%; height:95px; padding:10px; margin-bottom:14px; border-radius:5px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.3); color:#fff; box-sizing:border-box;"></textarea>
                
                <button onclick="submitWatchdogReport()" id="watchdog-submit-btn" style="width:100%; background:#e74c3c; color:#fff; border:none; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer; font-size:0.95rem;">
                    Submit Confidential Report
                </button>
                <p id="watchdog-feedback" style="display:none; color:#2ecc71; font-weight:bold; margin-top:12px; text-align:center;"></p>
            </div>
            
            <div style="flex:1 1 48%; min-width:300px;" class="outreach-card">
                <h3 class="card-title" style="margin-bottom:12px;">Recent Community Watchdog Dispatches</h3>
                <div id="watchdog-feed-list">
                    <p style="color:#aaa;">Loading recent watchdog alerts...</p>
                </div>
            </div>
        </div>
    `;
    fetchWatchdogReports();
}

async function fetchWatchdogReports() {
    const list = document.getElementById('watchdog-feed-list');
    if (!list) return;
    try {
        const res = await fetch(`${API_BASE}/watchdog/reports`);
        const reports = await res.json();
        if (!reports || reports.length === 0) {
            list.innerHTML = '<p style="color:#aaa;">No watchdog alerts logged yet.</p>';
            return;
        }
        let html = '';
        reports.forEach(r => {
            html += `
                <div style="padding:14px; margin-bottom:12px; background:rgba(255,255,255,0.04); border-left:3px solid #e74c3c; border-radius:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
                        <span style="background:rgba(231,76,60,0.2); color:#e74c3c; font-size:0.75rem; font-weight:bold; padding:3px 8px; border-radius:4px;">${r.incident_type}</span>
                        <span style="font-size:0.78rem; color:#aaa;">📍 ${r.campus_or_area}</span>
                    </div>
                    <p style="font-size:0.9rem; color:#ddd; margin:6px 0; line-height:1.5;">${r.description}</p>
                    <div style="font-size:0.75rem; color:#2ecc71; font-weight:600; margin-top:6px;">✓ ${r.status}</div>
                </div>
            `;
        });
        list.innerHTML = html;
    } catch (e) {
        list.innerHTML = '<p style="color:red;">Error loading watchdog dispatches.</p>';
    }
}

async function submitWatchdogReport() {
    const loc = document.getElementById('watchdog-location').value.trim();
    const type = document.getElementById('watchdog-type').value;
    const desc = document.getElementById('watchdog-desc').value.trim();
    const fb = document.getElementById('watchdog-feedback');

    if (!loc || !desc) {
        alert("Please specify both the location/area and what you observed.");
        return;
    }

    const btn = document.getElementById('watchdog-submit-btn');
    btn.disabled = true;
    btn.innerText = 'Encrypting & Submitting...';

    try {
        const res = await fetch(`${API_BASE}/watchdog/reports`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                campus_or_area: loc,
                incident_type: type,
                description: desc
            })
        });
        if (!res.ok) throw new Error("Failed");
        document.getElementById('watchdog-location').value = '';
        document.getElementById('watchdog-desc').value = '';
        fb.style.display = 'block';
        fb.innerText = '✓ Confidential Watchdog Alert logged and routed to Campus Security & ZRP Liaison.';
        fetchWatchdogReports();
    } catch (e) {
        alert("Error submitting report. Please check connection.");
    } finally {
        btn.disabled = false;
        btn.innerText = 'Submit Confidential Report';
    }
}

// -----------------------------------------
// Module Detail Logic
// -----------------------------------------
async function openModuleDetail(moduleId, title, isHomeMode) {
    document.querySelectorAll('.content-view').forEach(v => v.classList.remove('active'));

    if (isHomeMode) {
        markModuleCompleted(title);
        const view = document.getElementById('view-module-detail');
        view.classList.add('active');
        document.getElementById('module-detail-title').textContent = title;
        const list = document.getElementById('module-content-list');
        list.innerHTML = '<div style="text-align:center; padding:30px;"><p>Loading Smart Living module content...</p></div>';

        try {
            const res = await fetch(`${API_BASE}/modules/${moduleId}/content`);
            const contents = await res.json();
            if (contents && contents.length > 0) {
                let html = '';
                contents.forEach(c => {
                    html += `
                        <div class="outreach-card" style="padding:25px; margin-bottom:20px; border-left:4px solid #2ecc71;">
                            <h3 style="color:#2ecc71; margin-bottom:15px; font-size:1.4rem;">${c.title}</h3>
                            <p style="font-size:1.03rem; line-height:1.8; color:#eee; white-space:pre-line;">${c.content_text || 'Reading material pending.'}</p>
                            ${c.content_url ? `<a href="${c.content_url}" target="_blank" style="display:inline-block; margin-top:15px; color:#3498db; font-weight:bold;">External WHO / Health Resource →</a>` : ''}
                        </div>
                    `;
                });
                html += `
                    <div class="outreach-card" style="text-align:center; padding:22px; background:rgba(46,204,113,0.1); border:1px solid rgba(46,204,113,0.4);">
                        <h4 style="color:#2ecc71; margin-bottom:8px;">Module Registered Towards Your Smart Drinking Ambassador Badge!</h4>
                        <p style="color:#ccc; font-size:0.9rem; margin-bottom:14px;">Ready to test how you would apply this in a real campus situation?</p>
                        <button onclick="switchMainView('besure', document.querySelector('.bottom-nav .nav-item[data-view=\'besure\']')); setTimeout(() => switchBeSureTab('real_or_manipulated', document.querySelectorAll('#view-besure .out-tab')[1]), 150);" style="background:#2ecc71; color:#fff; border:none; padding:10px 22px; border-radius:5px; font-weight:bold; cursor:pointer;">
                            Launch Smart Scenario Simulator →
                        </button>
                    </div>
                `;
                list.innerHTML = html;
            } else {
                list.innerHTML = '<p style="text-align:center; padding:20px;">No reading material uploaded yet.</p>';
            }
        } catch (e) {
            list.innerHTML = '<p style="color:red; text-align:center;">Failed to load lesson.</p>';
        }

    } else {
        const view = document.getElementById('view-safespace-detail');
        view.classList.add('active');
        document.getElementById('safespace-detail-title').textContent = title;
        document.getElementById('safespace-peer-topic').textContent = title;
        currentSafeSpaceTopic = title;

        const articleContainer = document.getElementById('safespace-article-container');
        articleContainer.innerHTML = '<div style="text-align:center; padding:20px;"><p>Loading playbook...</p></div>';

        try {
            const res = await fetch(`${API_BASE}/modules/${moduleId}/content`);
            const contents = await res.json();
            if (contents && contents.length > 0) {
                const article = contents[0];
                articleContainer.innerHTML = `
                    <div class="outreach-card" style="border-left:4px solid #2ecc71; padding:22px;">
                        <h3 style="color:#2ecc71; margin-bottom:12px;">Above the Influence Playbook: ${title}</h3>
                        <p style="font-size:1.02rem; line-height:1.8; color:#eee; white-space:pre-line;">${article.content_text}</p>
                    </div>
                `;
            } else {
                articleContainer.innerHTML = '<p style="color:#aaa;">Playbook instructions being prepared.</p>';
            }
        } catch(e) {
            articleContainer.innerHTML = '<p style="color:red;">Error loading playbook.</p>';
        }

        fetchPeerPosts();
    }
}

// -----------------------------------------
// Peer Stories Forum Logic (Support Hub)
// -----------------------------------------
function fetchPeerPosts() {
    const list = document.getElementById('safespace-comments-list');
    if (!list) return;
    list.innerHTML = renderPeerStoriesSkeleton(3);

    fetch(`${API_BASE}/safespace/experiences`)
        .then(res => res.json())
        .then(posts => {
            if (!posts || posts.length === 0) {
                list.innerHTML = '<p style="color:#aaa; text-align:center; padding:15px;">No peer stories shared yet. Be the first to share!</p>';
                return;
            }
            let html = '';
            posts.forEach(post => {
                const initial = post.author_name ? post.author_name.charAt(0).toUpperCase() : 'A';
                const isLiked = !!userLikedStories[post.id];
                const likes = post.likes_count || 5;
                html += `
                    <div class="outreach-card" style="margin-bottom:12px; background:rgba(255,255,255,0.04); border-left:3px solid #3498db; padding:15px;">
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <div style="width:32px; height:32px; background:#3498db; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; color:#fff;">${initial}</div>
                                <span style="font-weight:bold; font-size:0.95rem;">${post.author_name || 'Anonymous Peer'}</span>
                            </div>
                            <span style="font-size:0.75rem; color:#2ecc71; background:rgba(46,204,113,0.12); padding:3px 8px; border-radius:10px;">${post.topic}</span>
                        </div>
                        <p style="font-size:0.95rem; line-height:1.6; color:#ddd; margin-bottom:10px;">${post.content}</p>
                        ${post.image_url ? `<img src="${post.image_url}" style="max-width:100%; border-radius:8px; margin-top:5px; margin-bottom:10px; max-height:250px; object-fit:cover;" />` : ''}
                        
                        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:8px; border-top:1px solid rgba(255,255,255,0.06); margin-top:8px;">
                            <button onclick="likePeerStory(${post.id}, this)" class="like-button-chip optimistic-btn ${isLiked ? 'is-active' : ''}">
                                <span>${isLiked ? '❤️' : '🤍'}</span>
                                <span id="story-likes-${post.id}">${likes}</span>
                                <span>Helpful</span>
                            </button>
                            <span style="font-size:0.75rem; color:#aaa;">Verified Peer Story</span>
                        </div>
                    </div>
                `;
            });
            list.innerHTML = html;
        })
        .catch(err => {
            list.innerHTML = '<p style="color:red; text-align:center;">Failed to load peer stories.</p>';
        });
}

async function likePeerStory(storyId, btn) {
    const countSpan = document.getElementById(`story-likes-${storyId}`);
    if (!btn || !countSpan) return;

    // --- SNAPSHOT PREVIOUS STATE FOR ROLLBACK ---
    const wasLiked = !!userLikedStories[storyId];
    const prevLikes = parseInt(countSpan.innerText, 10) || 0;
    const prevClass = btn.className;
    const prevHTML = btn.innerHTML;

    // --- OPTIMISTIC UI: UPDATE IMMEDIATELY ---
    const isNowLiked = !wasLiked;
    userLikedStories[storyId] = isNowLiked;
    try { localStorage.setItem('userLikedStories', JSON.stringify(userLikedStories)); } catch(e){}

    const newLikes = isNowLiked ? (prevLikes + 1) : Math.max(0, prevLikes - 1);
    countSpan.innerText = newLikes;

    if (isNowLiked) {
        btn.classList.add('is-active', 'liked');
        btn.innerHTML = `<span>❤️</span> <span id="story-likes-${storyId}">${newLikes}</span> <span>Helpful</span>`;
    } else {
        btn.classList.remove('is-active', 'liked');
        btn.innerHTML = `<span>🤍</span> <span id="story-likes-${storyId}">${newLikes}</span> <span>Helpful</span>`;
    }

    // --- BACKGROUND SERVER REQUEST ---
    try {
        const res = await fetch(`${API_BASE}/safespace/experiences/${storyId}/like?user_id=${currentUserId}`, {
            method: 'POST'
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.new_likes_count !== undefined) {
            countSpan.innerText = data.new_likes_count;
        }
    } catch (err) {
        // --- QUIET ROLLBACK TO PREVIOUS VALUE IF REQUEST FAILS ---
        console.warn(`[Optimistic UI Rollback] Like failed on story ${storyId}:`, err);
        userLikedStories[storyId] = wasLiked;
        try { localStorage.setItem('userLikedStories', JSON.stringify(userLikedStories)); } catch(e){}
        countSpan.innerText = prevLikes;
        btn.className = prevClass;
        btn.innerHTML = prevHTML;
    }
}


async function submitSafeSpaceComment() {
    const text = document.getElementById('safespace-post-text').value;
    const isAnon = document.getElementById('safespace-post-anon') ? document.getElementById('safespace-post-anon').checked : true;
    const fileInput = document.getElementById('safespace-post-image');
    const imageFile = fileInput.files[0];

    if (!text.trim() && !imageFile) {
        alert("Please write your story or upload an image.");
        return;
    }

    const btn = document.getElementById('safespace-submit-btn');
    btn.innerText = 'Posting...';
    btn.disabled = true;

    let image_base64 = null;
    if (imageFile) {
        image_base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(imageFile);
        });
    }

    const authorDisplay = isAnon ? "Anonymous Peer" : (`${currentUsername} (${currentUniversity})`);

    fetch(`${API_BASE}/safespace/experiences`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            topic: currentSafeSpaceTopic,
            content: text,
            image_url: image_base64,
            author_name: authorDisplay
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to post");
        return res.json();
    })
    .then(data => {
        document.getElementById('safespace-post-text').value = '';
        fileInput.value = '';
        document.getElementById('safespace-post-form').style.display = 'none';
        document.getElementById('safespace-share-btn').style.display = 'block';
        btn.innerText = 'Post Peer Story';
        btn.disabled = false;
        fetchPeerPosts();
    })
    .catch(err => {
        alert("Error posting your story.");
        btn.innerText = 'Post Peer Story';
        btn.disabled = false;
    });
}

function fetchGlobalPeerFeed(filterTopic = '') {
    const feed = document.getElementById('global-peer-feed');
    if (!feed) return;
    feed.innerHTML = renderPeerStoriesSkeleton(3);

    const url = filterTopic
        ? `${API_BASE}/safespace/experiences?topic=${encodeURIComponent(filterTopic)}`
        : `${API_BASE}/safespace/experiences`;

    fetch(url)
    .then(res => res.json())
    .then(posts => {
        if (!posts || posts.length === 0) {
            feed.innerHTML = '<p style="color:#aaa; font-size:0.9rem;">No peer stories in this category yet. Share yours above!</p>';
            return;
        }
        let html = '';
        posts.forEach(post => {
            const initial = post.author_name ? post.author_name.charAt(0).toUpperCase() : 'A';
            const isLiked = !!userLikedStories[post.id];
            const likes = post.likes_count || 5;
            html += `
                <div style="padding:12px; margin-bottom:12px; background:rgba(255,255,255,0.05); border-radius:8px; border-left:3px solid #2ecc71;">
                    <div style="font-size:0.75rem; color:#2ecc71; margin-bottom:4px; font-weight:bold;">${post.topic}</div>
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                        <div style="width:24px; height:24px; background:#3498db; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; color:#fff; font-weight:bold;">${initial}</div>
                        <span style="font-size:0.85rem; font-weight:bold;">${post.author_name}</span>
                    </div>
                    <p style="font-size:0.88rem; color:#ddd; margin:0 0 8px 0; line-height:1.5;">${post.content}</p>
                    ${post.image_url ? `<img src="${post.image_url}" style="max-width:100%; border-radius:5px; margin-bottom:8px; max-height:150px; object-fit:cover;" />` : ''}
                    <div style="display:flex; justify-content:flex-end;">
                        <button onclick="likePeerStory(${post.id}, this)" class="like-button-chip optimistic-btn ${isLiked ? 'is-active' : ''}" style="padding:3px 10px; font-size:0.75rem;">
                            <span>${isLiked ? '❤️' : '🤍'}</span>
                            <span id="story-likes-${post.id}">${likes}</span>
                        </button>
                    </div>
                </div>
            `;
        });
        feed.innerHTML = html;
    })
    .catch(err => {
        if (feed) feed.innerHTML = '<p style="color:red; font-size:0.9rem;">Failed to load peer stories.</p>';
    });
}

async function submitGlobalExperience() {
    const topic = document.getElementById('global-share-topic').value;
    const text = document.getElementById('global-share-text').value;
    const isAnon = document.getElementById('global-share-anon') ? document.getElementById('global-share-anon').checked : true;
    const fileInput = document.getElementById('global-share-image');
    const imageFile = fileInput.files[0];

    if (!text.trim() && !imageFile) {
        alert("Please write your story or upload an image.");
        return;
    }

    const btn = document.getElementById('global-submit-btn');
    btn.innerText = 'Publishing...';
    btn.disabled = true;

    let image_base64 = null;
    if (imageFile) {
        image_base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(imageFile);
        });
    }

    const authorDisplay = isAnon ? "Anonymous Peer" : (`${currentUsername} (${currentUniversity})`);

    fetch(`${API_BASE}/safespace/experiences`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            topic: topic,
            content: text,
            image_url: image_base64,
            author_name: authorDisplay
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to post");
        return res.json();
    })
    .then(data => {
        document.getElementById('global-share-text').value = '';
        fileInput.value = '';
        document.getElementById('global-share-form').style.display = 'none';
        document.getElementById('global-share-btn').style.display = 'block';
        btn.innerText = 'Publish Peer Story';
        btn.disabled = false;
        fetchGlobalPeerFeed();
    })
    .catch(err => {
        alert("Error publishing your story.");
        btn.innerText = 'Publish Peer Story';
        btn.disabled = false;
    });
}

// -----------------------------------------
// Smart Campus & Health News Hub Logic
// -----------------------------------------
async function filterNews(source, el) {
    document.querySelectorAll('#view-news .filter-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    loadNews(source);
}

async function loadNews(source) {
    const container = document.getElementById('news-feed');
    container.innerHTML = renderNewsSkeleton(4);

    try {
        const url = source === 'All' ? `${API_BASE}/news/today` : `${API_BASE}/news/${encodeURIComponent(source)}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding:20px;">No articles found for this stream.</p>';
            return;
        }

        let html = '';
        data.forEach(item => {
            const badgeColor = item.source === 'Health News' ? '#2ecc71' : (item.source === 'Campus Innovation' ? '#3498db' : '#9b59b6');
            html += `
                <div class="article-card" style="display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                            <span class="card-tag" style="background:${badgeColor}; color:#fff;">${item.source}</span>
                            ${item.descriptive_topic ? `<span style="font-size:0.75rem; color:#aaa;">${item.descriptive_topic}</span>` : ''}
                        </div>
                        <h3 class="card-title" style="margin-top:10px;">${item.title}</h3>
                        <p class="card-desc" style="color:#aaa; font-size:0.9rem; margin-bottom:15px; line-height:1.6;">${item.summary || 'Click below to read full report...'}</p>
                    </div>
                    <div class="card-meta" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:10px;">
                        <span style="font-size:0.8rem; color:#777;">${new Date(item.published_date).toLocaleDateString()}</span>
                        <a href="${item.url}" class="card-action" target="_blank" style="color:#2ecc71; font-weight:bold; font-size:0.85rem; text-decoration:none;">READ BRIEFING ↗</a>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<p style="text-align:center; color:red; grid-column: 1/-1;">Error loading campus news.</p>';
    }
}

// -----------------------------------------
// Campus Voice & Community Radio Hub Logic
// -----------------------------------------
async function filterRadio(station, el) {
    document.querySelectorAll('#view-radio .filter-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    loadRadio(station);
}

async function loadRadio(station) {
    const container = document.getElementById('radio-feed');
    container.innerHTML = '<p style="text-align:center; padding: 20px;">Loading Campus Voice &amp; Radio streams...</p>';

    try {
        const res = await fetch(`${API_BASE}/radio/${encodeURIComponent(station)}`);
        const data = await res.json();

        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align:center;">No broadcasts or podcasts found for this filter.</p>';
            return;
        }

        let html = '';
        data.forEach(item => {
            const isPodcast = item.source === 'Student Panels' || item.source === 'Expert Q&As';
            const tagColor = isPodcast ? '#9b59b6' : '#e67e22';
            const icon = isPodcast ? '🎙️' : '📻';
            html += `
                <div class="radio-card" style="background:var(--card-bg); padding:18px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color); border-left:4px solid ${tagColor};">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                        <span class="card-tag" style="background:${tagColor}; color:#fff; font-size:0.75rem; padding:4px 10px; border-radius:4px; font-weight:bold;">${icon} ${item.source}</span>
                        <span style="font-size:0.8rem; color:#2ecc71; font-weight:600;">${item.descriptive_topic || 'Youth Connect+ Audio Stream'}</span>
                    </div>
                    <h3 class="card-title" style="margin:10px 0 6px 0;">${item.title}</h3>
                    <p class="card-desc" style="color:#aaa; font-size:0.92rem; margin-bottom:14px; line-height:1.5;">${item.summary || 'Smart Drinking dialogue and campus broadcast.'}</p>
                    <div class="card-meta" style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.8rem; color:#777;">${isPodcast ? 'On-Demand Curated Episode' : 'Live Radio Stream'}</span>
                        <a href="${item.url}" class="card-action" target="_blank" style="background:#3498db; color:#fff; padding:7px 16px; border-radius:5px; font-size:0.85rem; text-decoration:none; font-weight:bold;">
                            ${isPodcast ? 'LISTEN TO EPISODE ↗' : 'TUNE IN LIVE ↗'}
                        </a>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<p style="text-align:center; color:red;">Error loading radio &amp; podcast streams.</p>';
    }
}

// -----------------------------------------
// Campus & Community Events Hub Logic
// -----------------------------------------
let currentEventCategory = 'All';

async function filterEvents(category, el) {
    document.querySelectorAll('#view-events .filter-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    currentEventCategory = category;
    loadEvents(category);
}

function toggleEventPostForm() {
    const modal = document.getElementById('event-post-modal');
    if (!modal) return;
    const isHidden = modal.style.display === 'none' || modal.style.display === '';
    modal.style.display = isHidden ? 'block' : 'none';
}

async function loadEvents(category = 'All') {
    const container = document.getElementById('events-feed');
    if (!container) return;
    container.innerHTML = renderEventsSkeleton(3);

    try {
        const url = (category === 'All') ? `${API_BASE}/events` : `${API_BASE}/events?category=${encodeURIComponent(category)}`;
        const res = await fetch(url);
        const events = await res.json();

        if (!events || events.length === 0) {
            container.innerHTML = '<p style="text-align:center; grid-column:1/-1; padding:30px; color:#aaa;">No events scheduled in this category yet. Organizers can post an event above!</p>';
            return;
        }

        let html = '';
        const catColors = {
            'Marathons & Sports': '#e67e22',
            'Campaigns & Pledges': '#3498db',
            'Sober Festivals & Arts': '#9b59b6',
            'Workshops': '#2ecc71'
        };

        events.forEach(evt => {
            const badgeColor = catColors[evt.category] || '#2ecc71';
            const isRSVPed = !!userRSVPs[evt.id];
            html += `
                <div class="article-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:0; overflow:hidden; border:1px solid rgba(255,255,255,0.1); min-height:410px;">
                    ${evt.banner_url ? `<img src="${evt.banner_url}" alt="${evt.title}" style="width:100%; height:180px; object-fit:cover; display:block;" />` : ''}
                    <div style="padding:18px; display:flex; flex-direction:column; flex:1;">
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
                            <span class="card-tag" style="background:${badgeColor}; color:#fff; font-size:0.75rem; padding:3px 9px; border-radius:4px; font-weight:bold;">${evt.category}</span>
                            <span style="font-size:0.78rem; color:#2ecc71; font-weight:700;">👥 <span id="event-rsvp-${evt.id}">${evt.rsvp_count}</span> Attending</span>
                        </div>
                        <h3 class="card-title" style="margin:0 0 8px 0; font-size:1.15rem;">${evt.title}</h3>
                        <div style="font-size:0.83rem; color:#f1c40f; font-weight:600; margin-bottom:6px;">📅 ${evt.date_str}</div>
                        <div style="font-size:0.82rem; color:#3498db; margin-bottom:10px;">📍 ${evt.location}</div>
                        <p class="card-desc" style="color:#aaa; font-size:0.88rem; line-height:1.55; margin-bottom:14px; flex:1;">${evt.description}</p>
                        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:12px; margin-top:auto;">
                            <span style="font-size:0.78rem; color:#888;">By: <strong>${evt.organizer}</strong></span>
                            <button onclick="rsvpEvent(${evt.id})" id="btn-rsvp-${evt.id}" class="optimistic-btn" style="background:${isRSVPed ? '#3498db' : '#2ecc71'}; color:#fff; border:none; padding:7px 16px; border-radius:5px; font-weight:bold; font-size:0.82rem; cursor:pointer;">
                                ${isRSVPed ? '✓ Registered (Attending)' : '✓ RSVP / Join'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<p style="text-align:center; color:red; grid-column:1/-1;">Error loading events. Please check connection.</p>';
    }
}

async function rsvpEvent(eventId) {
    const btn = document.getElementById(`btn-rsvp-${eventId}`);
    const countSpan = document.getElementById(`event-rsvp-${eventId}`);
    if (!btn || !countSpan) return;

    // --- 1. SNAPSHOT PREVIOUS STATE FOR QUIET ROLLBACK ---
    const wasRSVPed = !!userRSVPs[eventId];
    const prevRSVPState = wasRSVPed;
    const prevCount = parseInt(countSpan.innerText, 10) || 0;
    const prevBtnBg = btn.style.background;
    const prevBtnHTML = btn.innerHTML;

    // --- 2. OPTIMISTIC UI: UPDATE IMMEDIATELY ON CLICK ---
    const isNowRSVPed = !wasRSVPed;
    userRSVPs[eventId] = isNowRSVPed;
    try { localStorage.setItem('userRSVPs', JSON.stringify(userRSVPs)); } catch(e){}

    const newCount = isNowRSVPed ? (prevCount + 1) : Math.max(0, prevCount - 1);
    countSpan.innerText = newCount;
    btn.style.background = isNowRSVPed ? '#3498db' : '#2ecc71';
    btn.innerHTML = isNowRSVPed ? '✓ Registered (Attending)' : '✓ RSVP / Join';

    // --- 3. EXECUTE SERVER REQUEST IN BACKGROUND ---
    try {
        const res = await fetch(`${API_BASE}/events/${eventId}/rsvp?user_id=${currentUserId}`, {
            method: 'POST'
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.new_rsvp_count !== undefined) {
            countSpan.innerText = data.new_rsvp_count;
        }
    } catch (err) {
        // --- 4. QUIET ROLLBACK TO PREVIOUS VALUE IF REQUEST FAILS ---
        console.warn(`[Optimistic UI Rollback] Event RSVP failed for ID ${eventId}:`, err);
        userRSVPs[eventId] = prevRSVPState;
        try { localStorage.setItem('userRSVPs', JSON.stringify(userRSVPs)); } catch(e){}
        countSpan.innerText = prevCount;
        btn.style.background = prevBtnBg;
        btn.innerHTML = prevBtnHTML;
    }
}

async function submitNewEvent() {
    const title = document.getElementById('event-input-title').value.trim();
    const organizer = document.getElementById('event-input-organizer').value.trim();
    const category = document.getElementById('event-input-category').value;
    const dateStr = document.getElementById('event-input-date').value.trim();
    const location = document.getElementById('event-input-location').value.trim();
    const desc = document.getElementById('event-input-desc').value.trim();
    const fb = document.getElementById('event-form-feedback');

    if (!title || !organizer || !dateStr || !location || !desc) {
        alert("Please fill in all event details (title, organizer, date, location, and description).");
        return;
    }

    const btn = document.getElementById('btn-submit-event');
    btn.disabled = true;
    btn.innerText = 'Publishing Event...';

    try {
        const res = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: title,
                organizer: organizer,
                category: category,
                date_str: dateStr,
                location: location,
                description: desc
            })
        });

        if (!res.ok) throw new Error("Failed to create event");
        
        document.getElementById('event-input-title').value = '';
        document.getElementById('event-input-organizer').value = '';
        document.getElementById('event-input-date').value = '';
        document.getElementById('event-input-location').value = '';
        document.getElementById('event-input-desc').value = '';

        fb.style.display = 'block';
        fb.innerText = '🎉 Event published successfully to Campus Events Hub!';
        setTimeout(() => {
            fb.style.display = 'none';
            toggleEventPostForm();
            loadEvents(currentEventCategory);
        }, 1200);
    } catch (e) {
        alert("Error publishing event. Please check backend connection.");
    } finally {
        btn.disabled = false;
        btn.innerText = 'Publish Event';
    }
}


// -----------------------------------------
// Opportunities Logic
// -----------------------------------------
async function loadOpportunitiesIntoContainer(container) {
    container.innerHTML = '<div style="text-align:center; padding:30px;"><p>Loading youth innovation opportunities...</p></div>';

    try {
        const res = await fetch(`${API_BASE}/opportunities`);
        const data = await res.json();

        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:30px;">No opportunities found.</p>';
            return;
        }

        let html = '<div class="outreach-header"><h2 style="font-size:1.8rem; margin-bottom:10px;">Smart Drinking Grants, Fellowships &amp; Opportunities</h2><p style="color:#aaa;">Curated innovation challenges, Enactus fellowships, and youth leadership programs.</p></div>';
        html += '<div class="grid-layout">';
        data.forEach(item => {
            html += `
                <div class="outreach-card" style="display:flex; flex-direction:column; justify-content:space-between; height: 100%;">
                    <div>
                        <span class="card-tag" style="background:#9b59b6; color:#fff; font-size:0.75rem; padding:3px 8px; border-radius:4px; font-weight:bold;">${item.source}</span>
                        <h3 class="card-title" style="margin-top:10px;">${item.title}</h3>
                        <p class="card-desc" style="color:#aaa; font-size:0.9rem; margin-bottom:15px;">${item.description || item.summary || 'Click below to review eligibility criteria.'}</p>
                    </div>
                    <a href="${item.url}" class="card-action" target="_blank" style="display:block; text-align:center; background:#3498db; color:#fff; padding:10px; border-radius:5px; text-decoration:none; font-weight:bold;">APPLY / VIEW DETAILS ↗</a>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<p style="text-align:center; color:red;">Error loading opportunities.</p>';
    }
}

// -----------------------------------------
// "BeSmart" Moderation & Decision Toolkit Logic
// -----------------------------------------
function switchBeSureTab(tabId, el) {
    document.querySelectorAll('#view-besure .out-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');

    const container = document.getElementById('besure-feed');

    if (tabId === 'verify') {
        const sampleMyths = [
            "Drinking strong coffee or taking a cold shower sobers you up faster",
            "Mixing energy drinks with alcohol neutralizes the crash and makes driving safer",
            "Unlabelled cheap street spirits ('kambwa') are just strong normal alcohol",
            "A small glass of wine or beer in late pregnancy is safe for the baby",
            "Eating a full meal and alternating with water slows down BAC spikes"
        ];

        container.innerHTML = `
            <div class="outreach-card" style="margin-bottom:20px; padding:25px;">
                <h3 class="card-title" style="font-size:1.4rem; color:#2ecc71;">Alcohol &amp; Health Myth vs. Fact Checker</h3>
                <p class="card-desc" style="margin-bottom:14px; color:#aaa;">
                    Enter any common drinking myth, party rumor, or health claim below—or click a popular campus claim—to evaluate the biological and medical facts.
                </p>
                <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:14px;">
                    <input type="text" id="verify-input" placeholder="e.g., 'Cold showers cure hangovers faster' or 'Mixing energy drinks with alcohol...'" style="flex:1; min-width:250px; padding:12px; background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.2); color:#fff; border-radius:5px;" />
                    <button onclick="submitVerify()" style="background:#2ecc71; color:#fff; border:none; padding:12px 24px; border-radius:5px; font-weight:bold; cursor:pointer;">Check Myth vs. Fact</button>
                </div>
                <div style="margin-bottom:10px;">
                    <span style="font-size:0.78rem; color:#aaa; display:block; margin-bottom:6px;">Quick-Test a Common Campus Claim:</span>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        ${sampleMyths.map(m => `<button onclick="document.getElementById('verify-input').value='${m.replace(/'/g, "\\'")}'; submitVerify();" style="background:rgba(52,152,219,0.15); border:1px solid rgba(52,152,219,0.4); color:#ddd; padding:6px 10px; border-radius:15px; font-size:0.78rem; cursor:pointer;">"${m}"</button>`).join('')}
                    </div>
                </div>
                <div id="verify-result" style="margin-top:20px; display:none; background:rgba(255,255,255,0.05); padding:20px; border-radius:8px; border-left:4px solid #2ecc71;"></div>
            </div>

            <div class="outreach-card" style="padding:22px;">
                <h4 class="card-title" style="margin-bottom:12px;">Recent Campus Myths Verified</h4>
                <div style="display:grid; gap:12px;">
                    <div style="padding:12px; background:rgba(231,76,60,0.08); border-left:3px solid #e74c3c; border-radius:6px;">
                        <span style="background:#e74c3c; color:#fff; font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:4px;">DANGEROUS</span>
                        <strong style="margin-left:8px; color:#fff;">"Mixing energy drinks with alcohol neutralizes the crash."</strong>
                        <p style="font-size:0.86rem; color:#ccc; margin:6px 0 0 0;">High-dose caffeine masks alcohol's sedative warning signs ('wide-awake drunk'), increasing binge consumption and cardiovascular strain without lowering BAC.</p>
                    </div>
                    <div style="padding:12px; background:rgba(230,126,34,0.08); border-left:3px solid #e67e22; border-radius:6px;">
                        <span style="background:#e67e22; color:#fff; font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:4px;">FALSE</span>
                        <strong style="margin-left:8px; color:#fff;">"Cold showers or hot coffee sober you up so you can drive."</strong>
                        <p style="font-size:0.86rem; color:#ccc; margin:6px 0 0 0;">Only liver enzymes (Alcohol Dehydrogenase) eliminate alcohol at ~1 standard drink per hour. Cold showers can trigger shock in intoxicated individuals.</p>
                    </div>
                    <div style="padding:12px; background:rgba(46,204,113,0.08); border-left:3px solid #2ecc71; border-radius:6px;">
                        <span style="background:#2ecc71; color:#fff; font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:4px;">TRUE</span>
                        <strong style="margin-left:8px; color:#fff;">"Eating protein/carbs before drinking and alternating with water slows BAC spikes."</strong>
                        <p style="font-size:0.86rem; color:#ccc; margin:6px 0 0 0;">Food slows gastric emptying into the small intestine, preventing dangerous rapid spikes in Blood Alcohol Concentration.</p>
                    </div>
                </div>
            </div>
        `;

    } else if (tabId === 'real_or_manipulated') {
        container.innerHTML = '<div style="text-align:center; padding:30px;"><p>Loading Smart Scenario Simulator...</p></div>';
        fetch(`${API_BASE}/besmart/scenarios`)
            .then(res => res.json())
            .then(scenarios => {
                if (!scenarios || scenarios.length === 0) {
                    container.innerHTML = '<p style="text-align:center; padding:20px;">No scenarios available.</p>';
                    return;
                }
                let html = `
                    <div class="outreach-header" style="margin-bottom:15px;">
                        <h3 style="font-size:1.5rem; color:#3498db;">Smart Scenario Simulator: What Would You Do?</h3>
                        <p style="color:#aaa; font-size:0.92rem;">Practice high-stakes campus social decisions. Choose your action to see community consensus and expert de-escalation tips.</p>
                    </div>
                    <div class="grid-layout">
                `;
                scenarios.forEach(s => {
                    html += `
                        <div class="outreach-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:20px;">
                            <div>
                                <span class="card-tag" style="background:#3498db; color:#fff; margin-bottom:10px; display:inline-block;">${s.category}</span>
                                ${s.image_url ? `<img src="${s.image_url}" alt="Scenario" style="width:100%; height:170px; object-fit:cover; border-radius:8px; margin-bottom:12px;"/>` : ''}
                                <p style="font-weight:700; font-size:0.98rem; line-height:1.5; color:#fff; margin-bottom:15px;">"${s.scenario_text}"</p>
                                
                                <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;">
                                    <button onclick="submitScenarioChoice(${s.id}, 'A')" id="scen-btn-${s.id}-A" style="text-align:left; padding:10px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:#eee; cursor:pointer; font-size:0.88rem; line-height:1.4;">
                                        <strong>Option A:</strong> ${s.option_a}
                                    </button>
                                    <button onclick="submitScenarioChoice(${s.id}, 'B')" id="scen-btn-${s.id}-B" style="text-align:left; padding:10px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:#eee; cursor:pointer; font-size:0.88rem; line-height:1.4;">
                                        <strong>Option B:</strong> ${s.option_b}
                                    </button>
                                    <button onclick="submitScenarioChoice(${s.id}, 'C')" id="scen-btn-${s.id}-C" style="text-align:left; padding:10px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:#eee; cursor:pointer; font-size:0.88rem; line-height:1.4;">
                                        <strong>Option C:</strong> ${s.option_c}
                                    </button>
                                </div>
                            </div>
                            <div id="scenario-feedback-${s.id}" style="display:none; margin-top:10px; padding:12px; border-radius:8px; background:rgba(0,0,0,0.35); font-size:0.88rem; line-height:1.55;"></div>
                        </div>
                    `;
                });
                html += '</div>';
                container.innerHTML = html;
            })
            .catch(err => {
                container.innerHTML = '<p style="text-align:center; color:red;">Failed to load scenarios.</p>';
            });

    } else if (tabId === 'mil_challenge') {
        loadWeeklyChallengeAndLeaderboard(container);

    } else if (tabId === 'mil_score') {
        container.innerHTML = '<div style="text-align:center; padding:30px;"><p>Loading your Smart Lifestyle &amp; Moderation Score...</p></div>';
        fetch(`${API_BASE}/mil/score/${currentUserId}`)
            .then(res => res.json())
            .then(data => {
                const avg = Math.floor((data.info_verification + data.ai_awareness + data.digital_safety + data.source_evaluation) / 4);
                let html = `
                    <div class="outreach-card" style="text-align:center; max-width:580px; margin:0 auto; padding:30px;">
                        <span style="background:rgba(46,204,113,0.18); color:#2ecc71; padding:4px 12px; border-radius:15px; font-size:0.78rem; font-weight:bold;">
                            University Chapter: ${currentUniversity}
                        </span>
                        <h2 style="font-size:1.35rem; color:#aaa; margin-top:12px; margin-bottom:5px;">YOUR SMART LIFESTYLE &amp; MODERATION SCORE</h2>
                        <h1 style="font-size:58px; color:#2ecc71; margin:10px 0;">${avg}/100</h1>
                        <p style="color:#ccc; font-size:0.9rem; margin-bottom:15px;">Reflects your mastery of BAC limits, refusal skills, party harm-reduction, and Zimbabwe liquor law awareness.</p>
                        
                        <div style="text-align:left; max-width:400px; margin:20px auto; background:rgba(255,255,255,0.04); padding:20px; border-radius:10px; line-height:1.9;">
                            <p style="margin-bottom:10px;"><strong>BAC &amp; Health Limits Knowledge:</strong> ${data.info_verification}%</p>
                            <p style="margin-bottom:10px;"><strong>Peer Pressure &amp; Refusal Skills:</strong> ${data.ai_awareness}%</p>
                            <p style="margin-bottom:10px;"><strong>Harm Reduction &amp; Party Safety:</strong> ${data.digital_safety}%</p>
                            <p style="margin-bottom:0;"><strong>Safe Decision-Making &amp; Law:</strong> ${data.source_evaluation}%</p>
                        </div>
                        
                        <div style="background:rgba(52, 152, 219, 0.12); border:1px solid rgba(52, 152, 219, 0.35); padding:16px; border-radius:10px; margin-top:20px;">
                            <p style="margin-bottom:10px;">Boost your score &amp; earn points for <strong>${currentUniversity}</strong> by completing modules and scenarios!</p>
                            <button onclick="switchMainView('outreach', document.querySelector('.bottom-nav .nav-item[data-view=\'outreach\']'));" style="background:#2ecc71; color:#fff; border:none; padding:10px 22px; border-radius:5px; cursor:pointer; font-weight:bold;">
                                Open Smart Living Academy →
                            </button>
                        </div>
                    </div>
                `;
                container.innerHTML = html;
            })
            .catch(err => {
                container.innerHTML = '<p style="text-align:center; color:red;">Failed to load Smart Lifestyle Score.</p>';
            });
    }
}

async function submitVerify() {
    const text = document.getElementById('verify-input').value;
    const resDiv = document.getElementById('verify-result');
    if (!text.trim()) return;

    resDiv.style.display = 'block';
    resDiv.innerHTML = '<p style="color:#aaa;">Evaluating claim against WHO, Toxicology, and Smart Drinking medical guidelines...</p>';

    try {
        const res = await fetch(`${API_BASE}/safespace/verify`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content: text})
        });
        const data = await res.json();
        const verdict = (data.verdict || 'FALSE').toUpperCase();
        const badgeColor = verdict.includes('TRUE') ? '#2ecc71' : (verdict.includes('DANGER') ? '#e74c3c' : '#e67e22');
        resDiv.style.borderLeftColor = badgeColor;
        resDiv.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                <span style="background:${badgeColor}; color:#fff; font-weight:800; padding:4px 12px; border-radius:4px; font-size:0.85rem;">VERDICT: ${verdict}</span>
                <span style="color:#aaa; font-size:0.9rem;">${data.publisher}</span>
            </div>
            <p style="margin-bottom:10px;"><strong>1. Scientific &amp; Biological Reality:</strong><br><span style="color:#ddd;">${data.original_source}</span></p>
            <p style="margin-bottom:10px;"><strong>2. What WHO &amp; Medical Experts Say:</strong><br><span style="color:#ddd;">${data.credible_sources}</span></p>
            <p style="margin-bottom:0; color:#2ecc71;"><strong>3. Smart Drinking Recommendation:</strong><br><span>${data.recommendation}</span></p>
        `;
    } catch(e) {
        resDiv.innerHTML = '<p style="color:red;">Verification failed. Please check connection.</p>';
    }
}

async function submitScenarioChoice(scenarioId, optionLetter) {
    const fb = document.getElementById(`scenario-feedback-${scenarioId}`);
    if (!fb) return;
    fb.style.display = 'block';
    fb.innerHTML = '<span style="color:#aaa;">Evaluating choice...</span>';

    try {
        const res = await fetch(`${API_BASE}/besmart/scenarios/${scenarioId}/answer`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: currentUserId,
                selected_option: optionLetter,
                reasoning: "Selected via Smart Scenario Simulator"
            })
        });
        const data = await res.json();
        const borderCol = data.correct ? '#2ecc71' : '#e74c3c';
        fb.style.borderLeft = `4px solid ${borderCol}`;
        fb.innerHTML = `
            <div style="font-weight:bold; color:${borderCol}; margin-bottom:6px;">${data.message}</div>
            <div style="font-size:0.82rem; color:#3498db; font-weight:600; margin-bottom:6px;">Community Consensus: ${data.consensus_stats}</div>
            <div style="color:#ddd;"><strong>Expert De-escalation Tip:</strong> ${data.expert_tip}</div>
        `;
    } catch (e) {
        fb.innerHTML = '<span style="color:red;">Error evaluating scenario.</span>';
    }
}

async function loadWeeklyChallengeAndLeaderboard(container) {
    container.innerHTML = '<div style="text-align:center; padding:30px;"><p>Loading Weekly Challenge &amp; Inter-University Leaderboard...</p></div>';
    try {
        const res = await fetch(`${API_BASE}/besmart/leaderboard`);
        const universities = await res.json();

        let html = `
            <div style="display:flex; gap:20px; flex-wrap:wrap; align-items:flex-start;">
                <!-- Left: Interactive Weekly Smart Drinking Quiz & Pledge 18 -->
                <div style="flex:1 1 46%; min-width:300px;" class="outreach-card">
                    <span class="card-tag" style="background:#2ecc71; color:#fff;">Week 1 Challenge • +30 Campus Points</span>
                    <h3 class="card-title" style="margin-top:10px; font-size:1.35rem;">Smart Drinking Weekly Quiz &amp; Pledge 18</h3>
                    <p style="color:#aaa; font-size:0.88rem; margin-bottom:15px;">Answer all 3 situational questions &amp; sign Pledge 18 to boost your university's Enactus ranking!</p>
                    
                    <div style="margin-bottom:14px;">
                        <label style="font-size:0.82rem; color:#3498db; font-weight:bold;">Select Your University Chapter:</label>
                        <select id="quiz-uni-select" onchange="currentUniversity=this.value; sessionStorage.setItem('currentUniversity', this.value);" style="width:100%; padding:9px; margin-top:4px; background:#1a2332; color:#fff; border:1px solid #3498db; border-radius:5px;">
                            ${universities.map(u => `<option value="${u.short_code}" ${u.short_code === currentUniversity ? 'selected' : ''}>${u.university_name} (${u.short_code})</option>`).join('')}
                        </select>
                    </div>

                    <div style="margin-bottom:12px; padding:12px; background:rgba(255,255,255,0.03); border-radius:6px;">
                        <p style="font-size:0.88rem; font-weight:bold; margin:0 0 6px 0;">Q1. How many standard drinks can a healthy human liver metabolize per hour?</p>
                        <select id="quiz-q1" style="width:100%; padding:8px; background:#111824; color:#fff; border:1px solid #444; border-radius:4px;">
                            <option value="wrong1">3 standard drinks per hour if you drink coffee</option>
                            <option value="correct">Roughly 1 standard drink (10–14g pure alcohol) per hour</option>
                            <option value="wrong2">5 standard drinks per hour if you exercise</option>
                        </select>
                    </div>

                    <div style="margin-bottom:12px; padding:12px; background:rgba(255,255,255,0.03); border-radius:6px;">
                        <p style="font-size:0.88rem; font-weight:bold; margin:0 0 6px 0;">Q2. What is the statutory legal age to purchase alcohol under Zimbabwe's Liquor Act (Pledge 18)?</p>
                        <select id="quiz-q2" style="width:100%; padding:8px; background:#111824; color:#fff; border:1px solid #444; border-radius:4px;">
                            <option value="correct">18 years and above (Strictly no sales or supply to under-18s)</option>
                            <option value="wrong1">16 years if accompanied by a cousin</option>
                        </select>
                    </div>

                    <div style="margin-bottom:14px; padding:12px; background:rgba(255,255,255,0.03); border-radius:6px;">
                        <p style="font-size:0.88rem; font-weight:bold; margin:0 0 6px 0;">Q3. If a friend passes out after drinking and is vomiting or breathing slowly, what must you do?</p>
                        <select id="quiz-q3" style="width:100%; padding:8px; background:#111824; color:#fff; border:1px solid #444; border-radius:4px;">
                            <option value="correct">Place them on their side (Recovery Position) and call medical help (999/994) immediately</option>
                            <option value="wrong1">Leave them on their back to sleep it off</option>
                            <option value="wrong2">Put them under a cold shower</option>
                        </select>
                    </div>

                    <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#2ecc71; margin-bottom:14px; cursor:pointer; font-weight:bold;">
                        <input type="checkbox" id="quiz-pledge18" checked />
                        <span>I sign "Pledge 18": I will lead Above the Influence, drink smart, and never supply alcohol to minors.</span>
                    </label>

                    <button onclick="submitWeeklyQuiz()" id="weekly-quiz-btn" style="width:100%; background:#2ecc71; color:#fff; border:none; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer; font-size:0.95rem;">
                        Submit Challenge &amp; Add Points to My University
                    </button>
                    <p id="weekly-quiz-feedback" style="display:none; margin-top:12px; font-weight:bold; text-align:center;"></p>
                </div>

                <!-- Right: Inter-University Enactus Leaderboard -->
                <div style="flex:1 1 48%; min-width:300px;" class="outreach-card">
                    <h3 class="card-title" style="margin-bottom:6px;">Inter-University Smart Drinking Leaderboard</h3>
                    <p style="color:#aaa; font-size:0.85rem; margin-bottom:15px;">Live campus safety &amp; moderation rankings across Zimbabwean Enactus chapters.</p>
                    <div id="leaderboard-table-container">
                        ${renderLeaderboardHTML(universities)}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<p style="text-align:center; color:red;">Failed to load leaderboard.</p>';
    }
}

function renderLeaderboardHTML(universities) {
    if (!universities || universities.length === 0) return '<p>No universities found.</p>';
    const medals = ['🥇', '🥈', '🥉'];
    return universities.map((u, idx) => {
        const rankIcon = idx < 3 ? medals[idx] : `#${idx + 1}`;
        const isUserUni = u.short_code === currentUniversity;
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; margin-bottom:10px; border-radius:8px; background:${isUserUni ? 'rgba(46,204,113,0.14)' : 'rgba(255,255,255,0.04)'}; border:1px solid ${isUserUni ? '#2ecc71' : 'rgba(255,255,255,0.08)'};">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:1.2rem; font-weight:bold; min-width:28px;">${rankIcon}</span>
                    <div>
                        <div style="font-weight:bold; font-size:0.95rem; color:#fff;">${u.university_name} <span style="color:#3498db;">(${u.short_code})</span></div>
                        <div style="font-size:0.78rem; color:#aaa;">${u.ambassadors_count} Ambassadors • ${u.pledge_18_signed} Pledge 18s</div>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:800; color:#2ecc71; font-size:1.05rem;">${u.points.toLocaleString()} pts</div>
                </div>
            </div>
        `;
    }).join('');
}

async function submitWeeklyQuiz() {
    const q1 = document.getElementById('quiz-q1').value;
    const q2 = document.getElementById('quiz-q2').value;
    const q3 = document.getElementById('quiz-q3').value;
    const uniCode = document.getElementById('quiz-uni-select').value;
    const fb = document.getElementById('weekly-quiz-feedback');

    let correctCount = 0;
    if (q1 === 'correct') correctCount++;
    if (q2 === 'correct') correctCount++;
    if (q3 === 'correct') correctCount++;

    const points = (correctCount * 10) + 10; // up to 40 points
    const btn = document.getElementById('weekly-quiz-btn');
    btn.disabled = true;
    btn.innerText = 'Recording Campus Points...';

    try {
        const res = await fetch(`${API_BASE}/besmart/pledge`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: currentUserId,
                university_code: uniCode,
                points_earned: points
            })
        });
        const data = await res.json();
        fb.style.display = 'block';
        fb.style.color = '#2ecc71';
        fb.innerText = `🎉 You scored ${correctCount}/3 on the Quiz! ${data.message}`;

        // Refresh leaderboard table
        const lbRes = await fetch(`${API_BASE}/besmart/leaderboard`);
        const lbData = await lbRes.json();
        const lbContainer = document.getElementById('leaderboard-table-container');
        if (lbContainer) lbContainer.innerHTML = renderLeaderboardHTML(lbData);
    } catch (e) {
        fb.style.display = 'block';
        fb.style.color = 'red';
        fb.innerText = 'Error recording points.';
    } finally {
        btn.disabled = false;
        btn.innerText = 'Submit Challenge & Add Points to My University';
    }
}

// -----------------------------------------
// Login / Ambassador Registration Logic
// -----------------------------------------
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const pwd = document.getElementById('login-password').value;
    const uni = document.getElementById('login-university') ? document.getElementById('login-university').value : 'UZ';
    const msg = document.getElementById('login-message');

    if (!email) {
        msg.innerText = "Please enter your student email address.";
        msg.style.display = 'block';
        msg.style.color = 'red';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: pwd || 'password123',
                university: uni
            })
        });
        const data = await res.json();

        currentUserId = data.user_id;
        currentUsername = data.username;
        currentUniversity = uni;
        sessionStorage.setItem('currentUserId', data.user_id);
        sessionStorage.setItem('currentUsername', data.username);
        sessionStorage.setItem('currentUniversity', uni);

        msg.style.color = '#2ecc71';
        msg.innerText = `Welcome, Ambassador ${data.username} (${uni})! Redirecting...`;
        msg.style.display = 'block';

        document.getElementById('nav-login-text').innerText = data.username;

        setTimeout(() => {
            switchMainView('outreach', document.querySelector('.bottom-nav .nav-item[data-view="outreach"]'));
        }, 1000);
    } catch(e) {
        msg.style.color = 'red';
        msg.innerText = "Login connection failed.";
        msg.style.display = 'block';
    }
}

// Initialize default view
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('currentUsername')) {
        document.getElementById('nav-login-text').innerText = sessionStorage.getItem('currentUsername');
    }
    loadOutreach('home');
});

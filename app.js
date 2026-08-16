// TODO: Before uploading to Vercel/Netlify, replace this with your Render URL
// Example: const API_BASE = 'https://tuned-in-zw-api.onrender.com';
const API_BASE = 'http://localhost:8002';

// -----------------------------------------
// Navigation Logic
// -----------------------------------------
function switchMainView(viewId, el) {
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (el) el.classList.add('active');

    // Update view active state
    document.querySelectorAll('.content-view').forEach(view => view.classList.remove('active'));
    document.getElementById('view-' + viewId).classList.add('active');

    // Trigger loads based on view
    if (viewId === 'outreach') {
        loadOutreach('home');
    } else if (viewId === 'news') {
        loadNews('All');
    } else if (viewId === 'radio') {
        loadRadio('All');
    } else if (viewId === 'opportunities') {
        loadOpportunities();
    }
}

// -----------------------------------------
// Youth Connect+ (Outreach) Logic
// -----------------------------------------
function switchOutreachTab(tabId, el) {
    document.querySelectorAll('.out-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    loadOutreach(tabId);
}

async function loadOutreach(tabId) {
    const container = document.getElementById('outreach-feed');
    container.innerHTML = '<p style="text-align:center; padding: 20px;">Loading...</p>';

    try {
        if (tabId === 'home') {
            const adminRes = await fetch(`${API_BASE}/admin/posts`);
            const adminPosts = adminRes.ok ? await adminRes.json() : [];
            
            if (adminPosts.length > 0) {
                renderOutreachItems(adminPosts, container, "ADMIN POST");
            } else {
                // Adversarial Edge Case: Admin hasn't posted yet. Fallback to Opportunities to keep UI lively.
                const fallbackRes = await fetch(`${API_BASE}/opportunities`);
                const fallbackData = await fallbackRes.json();
                renderOpportunities(fallbackData, container);
            }
        } else if (tabId === 'opportunities') {
            const res = await fetch(`${API_BASE}/opportunities`);
            const data = await res.json();
            renderOpportunities(data, container);
        } else if (tabId === 'safespace') {
            container.innerHTML = '<div class="outreach-card"><h3 class="card-title">Youth Safe Space</h3><p class="card-desc">Join our anonymous peer-to-peer counseling and support groups. Connect with certified counselors available 24/7.</p><a href="#" class="card-action">JOIN A SESSION ></a></div>';
        } else if (tabId === 'contact') {
            container.innerHTML = '<div class="outreach-card"><h3 class="card-title">Contact Directory</h3><p class="card-desc">Toll-free hotline: 0800 4321<br>Email: help@tunedin.zw<br>WhatsApp: +263 77 123 4567</p></div>';
        }
    } catch (e) {
        container.innerHTML = '<p style="text-align:center; color:red;">Failed to load data. Ensure backend is running.</p>';
    }
}

function renderOutreachItems(items, container, badgeText) {
    let html = '';
    items.forEach(item => {
        html += `
            <div class="outreach-card">
                <span class="card-tag">📢 ${badgeText} | ${item.category || 'General'}</span>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-desc">${item.summary || item.content || 'Click to read more...'}</p>
                <div class="card-meta">
                    <span>${new Date(item.published_date || Date.now()).toLocaleDateString()}</span>
                    <a href="${item.url || '#'}" class="card-action" target="_blank">READ MORE ></a>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// -----------------------------------------
// News Logic
// -----------------------------------------
async function filterNews(source, el) {
    document.querySelectorAll('#view-news .filter-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    loadNews(source);
}

async function loadNews(source) {
    const container = document.getElementById('news-feed');
    container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 20px;">Loading news...</p>';
    
    try {
        const url = source === 'All' ? `${API_BASE}/news/today` : `${API_BASE}/news/${source}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.length === 0) {
            container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No news found.</p>';
            return;
        }

        let html = '';
        data.slice(0, 15).forEach(item => {
            html += `
                <div class="article-card">
                    <span class="card-tag">${item.source}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-desc">${item.summary || 'Tap to read the full article...'}</p>
                    <div class="card-meta">
                        <span>${new Date(item.published_date).toLocaleDateString()}</span>
                        <a href="${item.url}" class="card-action" target="_blank">READ ARTICLE</a>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<p style="text-align:center; color:red; grid-column: 1/-1;">Error loading news.</p>';
    }
}

// -----------------------------------------
// Radio Logic
// -----------------------------------------
async function filterRadio(station, el) {
    document.querySelectorAll('#view-radio .filter-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    loadRadio(station);
}

async function loadRadio(station) {
    const container = document.getElementById('radio-feed');
    container.innerHTML = '<p style="text-align:center; padding: 20px;">Loading radio programmes...</p>';
    
    try {
        const res = await fetch(`${API_BASE}/radio/${station}`);
        const data = await res.json();
        
        if (data.length === 0) {
            container.innerHTML = '<p style="text-align:center;">No programmes found.</p>';
            return;
        }

        let html = '';
        data.slice(0, 10).forEach(item => {
            html += `
                <div class="radio-card">
                    <span class="card-tag">📻 ${item.source}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-desc">${item.summary || 'Tap to listen...'}</p>
                    <div class="card-meta">
                        <span>${new Date(item.published_date).toLocaleDateString()}</span>
                        <a href="${item.url}" class="card-action" target="_blank">LISTEN NOW</a>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<p style="text-align:center; color:red;">Error loading radio data.</p>';
    }
}

// -----------------------------------------
// Opportunities Logic
// -----------------------------------------
async function loadOpportunities() {
    const container = document.getElementById('opportunities-feed');
    container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 20px;">Loading opportunities...</p>';
    
    try {
        const res = await fetch(`${API_BASE}/opportunities`);
        const data = await res.json();
        renderOpportunities(data, container);
    } catch (e) {
        container.innerHTML = '<p style="text-align:center; color:red; grid-column: 1/-1;">Error loading opportunities.</p>';
    }
}

function renderOpportunities(items, container) {
    if (items.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No opportunities found.</p>';
        return;
    }
    
    let html = '';
    items.forEach(item => {
        html += `
            <div class="opp-card">
                <span class="card-tag">💼 ${item.source}</span>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-desc">${item.description || item.summary || 'Click to view details.'}</p>
                <div class="card-meta">
                    <a href="${item.url}" class="card-action" target="_blank" style="width:100%; text-align:center; background:var(--hover-bg); padding:8px; border-radius:5px;">VIEW OPPORTUNITY</a>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Initialize default view
document.addEventListener('DOMContentLoaded', () => {
    loadOutreach('home');
});

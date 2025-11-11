// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navLinks = document.querySelectorAll('.nav-links a');
  const pages = document.querySelectorAll('.page-section');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navUL = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const categoryFilter = document.getElementById('categoryFilter');

  // Data (sample). Replace or expand with your actual content
  const posts = [
    { id:1, title:"Sunset at Panambur", author:"Arun", date:"2024-10-01", category:"beaches", img:"panamb-beach.jpg", excerpt:"Golden sands and water sports." , content:"Full article content about Panambur..." },
    { id:2, title:"Kudla Temple Walk", author:"Meera", date:"2024-09-20", category:"temples", img:"Kadri.jpg", excerpt:"Ancient temples & architecture.", content:"Full article about temples..." },
    
    { id:4, title:"Hidden Gems of Kudla", author:"Anu", date:"2024-07-05", category:"hidden-gems", img:"seafood.jpeg", excerpt:"Less-known spots and tips.", content:"Full article about hidden gems..." }
  ];

  const destinations = [
    { id:'d1', name:'Panambur Beach', thumb:'panamb-beach.jpg', description:'Popular beach with events and water sports.'},
    { id:'d2', name:'Kadri Temple', thumb:'Kadri.jpg', description:'Historic temple complex and gardens.'},
    { id:'d3', name:'Local Cuisine Trail', thumb:'seafood.jpeg', description:'Taste authentic Mangalorean dishes.'}
  ];

  const guides = [
    { id:'g1', name:'Suresh', bio:'Local guide with 10+ years experience', img:'guide1.jpg', expertise:'temples, history' },
    { id:'g2', name:'Latha', bio:'Food & culture specialist', img:'guide2.jpeg', expertise:'food tours, markets' }
  ];

  // Routing / Navigation (pages by data-page)
  function showPage(name){
    pages.forEach(p => p.id === name + 'Page' || (p.id === name) ? p.classList.add('active') : p.classList.remove('active'));
    // special case: dashboard uses id 'dashboard' not 'dashboardPage'
    if(name === 'dashboard') {
      document.getElementById('dashboard').classList.add('active');
    }
    // close mobile menu if open
    navUL.classList.remove('active');
  }

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const page = a.dataset.page;
      if (!page) return;
      // mapping: for home/blog/destinations/guides/about/contact we have ids homePage, blogPage...
      if(page === 'home') showPage('home');
      else if(page === 'blog') showPage('blog');
      else if(page === 'destinations') showPage('destinations');
      else if(page === 'guides') showPage('guides');
      else if(page === 'about') showPage('about');
      else if(page === 'contact') showPage('contact');
      else if(page === 'dashboard') showPage('dashboard');
    });
  });

  // mobile
  mobileBtn.addEventListener('click', () => navUL.classList.toggle('active'));

  // Theme toggle
  function setTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('nk-theme', t);
  }
  const savedTheme = localStorage.getItem('nk-theme') || 'light';
  setTheme(savedTheme);
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Populate featured posts & blog grid & sidebar
  const featuredContainer = document.getElementById('featuredPosts');
  const blogGrid = document.getElementById('blogGrid');
  const sidebarRecent = document.getElementById('sidebarRecent');
  const sidebarCategories = document.getElementById('sidebarCategories');
  const destinationsGrid = document.getElementById('destinationsGrid');
  const destinationsGridLarge = document.getElementById('destinationsGridLarge');
  const guidesGrid = document.getElementById('guidesGrid');

  function renderPosts(list){
    featuredContainer.innerHTML = '';
    blogGrid.innerHTML = '';
    sidebarRecent.innerHTML = '';
    list.slice(0,3).forEach(p => {
      const card = document.createElement('article');
      card.className = 'grid-item';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.title}" onerror="this.style.display='none'"/>
        <div class="grid-item-content">
          <h3>${p.title}</h3>
          <p>${p.excerpt}</p>
          <div class="grid-item-meta"><span>${p.author}</span><span>${p.date}</span></div>
        </div>
      `;
      card.addEventListener('click', () => openPost(p));
      featuredContainer.appendChild(card);
    });

    // blog list (all)
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'grid-item';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.title}" onerror="this.style.display='none'"/>
        <div class="grid-item-content">
          <h3>${p.title}</h3>
          <p>${p.excerpt}</p>
          <div class="grid-item-meta"><span>${p.author}</span><span>${p.date}</span></div>
          <button class="cta-button small" data-id="${p.id}">Read More</button>
        </div>
      `;
      card.querySelector('.cta-button')?.addEventListener('click', () => openPost(p));
      blogGrid.appendChild(card);

      // sidebar recent
      const li = document.createElement('li');
      li.textContent = `${p.title} — ${p.author}`;
      sidebarRecent.appendChild(li);
    });

    // categories
    const categories = Array.from(new Set(list.map(p => p.category)));
    sidebarCategories.innerHTML = categories.map(c => `<li>${c}</li>`).join('');
  }

  // destinations & guides
  function renderDestinations(list){
    destinationsGrid.innerHTML = '';
    destinationsGridLarge.innerHTML = '';
    list.forEach(d => {
      const card = document.createElement('div');
      card.className = 'destination-card';
      card.innerHTML = `
        <img src="${d.thumb}" alt="${d.name}" onerror="this.style.display='none'"/>
        <div class="destination-overlay"><h3>${d.name}</h3><p>${d.description}</p></div>
      `;
      destinationsGrid.appendChild(card);
      destinationsGridLarge.appendChild(card.cloneNode(true));
    });
  }

  function renderGuides(list){
    guidesGrid.innerHTML = '';
    list.forEach(g => {
      const card = document.createElement('div');
      card.className = 'guide-card';
      card.innerHTML = `
        <img class="guide-avatar" src="${g.img}" alt="${g.name}" onerror="this.style.display='none'"/>
        <h3>${g.name}</h3>
        <div class="expertise">${g.expertise}</div>
        <p>${g.bio}</p>
        <button class="contact-guide-btn" data-id="${g.id}">Contact</button>
      `;
      guidesGrid.appendChild(card);
    });
  }

  // Open post modal
  const postModal = document.getElementById('postModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  function openPost(p){
    modalBody.innerHTML = `
      <h2>${p.title}</h2>
      <p><em>By ${p.author} — ${p.date}</em></p>
      <img src="${p.img}" alt="${p.title}" style="width:100%;max-height:320px;object-fit:cover;margin:1rem 0;" onerror="this.style.display='none'"/>
      <div>${p.content}</div>
      <div class="comments-section" id="commentsSection">
        <h3>Comments</h3>
        <div id="commentsList"></div>
        <div class="comment-form">
          <textarea id="commentText" placeholder="Write a comment..."></textarea>
          <button id="submitComment">Post Comment</button>
        </div>
      </div>
    `;
    loadComments(p.id);
    postModal.classList.add('active');
  }
  modalClose.addEventListener('click', ()=> postModal.classList.remove('active'));

  // Comments (localStorage)
  function commentsKey(postId){ return `nk-comments-${postId}`; }
  function loadComments(postId){
    const list = JSON.parse(localStorage.getItem(commentsKey(postId)) || '[]');
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = list.map(c=> `<div class="comment"><div class="comment-author">${c.name||'Anon'}</div><div>${c.text}</div></div>`).join('');
    document.getElementById('submitComment').onclick = () => {
      const txt = document.getElementById('commentText').value.trim();
      if(!txt) return alert('Write a comment first');
      const entry = { name: 'Visitor', text: txt, date: new Date().toISOString() };
      list.unshift(entry);
      localStorage.setItem(commentsKey(postId), JSON.stringify(list));
      loadComments(postId);
      document.getElementById('commentText').value = '';
      updateDashboardCounts();
    }
  }

  // Search & filter
  function applySearch(){
    const q = (searchInput.value || '').toLowerCase().trim();
    const cat = categoryFilter.value;
    const filtered = posts.filter(p => {
      const okQ = !q || (p.title + ' ' + p.excerpt + ' ' + p.content).toLowerCase().includes(q);
      const okC = cat === 'all' || p.category === cat;
      return okQ && okC;
    });
    renderPosts(filtered);
    renderBlogGrid(filtered);
  }

  function renderBlogGrid(list){
    // for blogGrid reuse earlier render but simpler (replace content)
    blogGrid.innerHTML = '';
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'grid-item';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.title}" onerror="this.style.display='none'"/>
        <div class="grid-item-content">
          <h3>${p.title}</h3>
          <p>${p.excerpt}</p>
          <div class="grid-item-meta"><span>${p.author}</span><span>${p.date}</span></div>
          <button class="cta-button small" data-id="${p.id}">Read More</button>
        </div>
      `;
      card.querySelector('.cta-button').addEventListener('click', () => openPost(p));
      blogGrid.appendChild(card);
    });
  }

  searchBtn?.addEventListener('click', (e) => { e.preventDefault(); applySearch(); });
  searchInput?.addEventListener('keyup', (e) => { if(e.key === 'Enter') applySearch(); });
  categoryFilter?.addEventListener('change', applySearch);

  // Newsletter submit
  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    if(!email) return alert('Enter email');
    let list = JSON.parse(localStorage.getItem('nk-subscribers') || '[]');
    list = Array.from(new Set([email, ...list]));
    localStorage.setItem('nk-subscribers', JSON.stringify(list));
    alert('Subscribed — thank you!');
    document.getElementById('newsletterEmail').value = '';
    updateDashboardCounts();
  });

  // contact form
  document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks — message sent (local demo).');
    e.target.reset();
  });

  // Populate initial UI
  renderPosts(posts);
  renderDestinations(destinations);
  renderGuides(guides);

  // Dashboard: simple stats & chart
  function updateDashboardCounts(){
    const users = JSON.parse(localStorage.getItem('nk-users') || '[]').length || 1200; // mock fallback
    const postsCount = posts.length;
    const totalComments = posts.reduce((acc,p) => {
      const c = JSON.parse(localStorage.getItem(commentsKey(p.id)) || '[]').length;
      return acc + c;
    }, 0);

    document.getElementById('statUsers').textContent = users;
    document.getElementById('statPosts').textContent = postsCount;
    document.getElementById('statComments').textContent = totalComments;

    // chart (posts by category)
    const ctx = document.getElementById('postsChart');
    if(ctx){
      const catCounts = {};
      posts.forEach(p => catCounts[p.category] = (catCounts[p.category] || 0) + 1);
      const labels = Object.keys(catCounts);
      const data = Object.values(catCounts);
      // destroy previous if exists
      if(window._nkChart) window._nkChart.destroy();
      window._nkChart = new Chart(ctx, {
        type:'doughnut',
        data:{ labels, datasets:[{ data, backgroundColor: labels.map((_,i)=> i%2? '#FF6B6B' : '#4ECDC4' )}] },
        options:{ responsive:true, maintainAspectRatio:false }
      });
    }
  }

  updateDashboardCounts();

  // small helper: show blog page with scroll to top
  function showPageById(pageId){
    pages.forEach(p => {
      if(p.id === pageId) p.classList.add('active'); else p.classList.remove('active');
    });
    window.scrollTo(0,0);
    navUL.classList.remove('active');
    if(pageId === 'blogPage') applySearch();
  }

  // wire simple data-page mapping to function
  document.querySelectorAll('[data-page]').forEach(el=>{
    el.addEventListener('click', (e)=>{
      const page = el.dataset.page;
      e.preventDefault();
      if(['home','blog','destinations','guides','about','contact'].includes(page)){
        showPageById(page + 'Page');
      } else if(page === 'dashboard') {
        showPageById('dashboard');
        updateDashboardCounts();
      }
    });
  });

  // small usability: close modal on background click
  postModal.addEventListener('click', (ev) => {
    if(ev.target === postModal) postModal.classList.remove('active');
  });

  // initial show
  showPageById('homePage');
});


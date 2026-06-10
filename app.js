// State management for LinkCenter
let state = {
  profile: {
    name: "Samuel Lopes",
    bio: "Criador de experiências digitais. Seja bem-vindo ao meu hub!",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    socials: {
      instagram: "samellop3s",
      github: "samellop3s",
      linkedin: "",
      twitter: ""
    }
  },
  links: [
    {
      id: "1",
      title: "Meu Portfólio Premium",
      url: "https://github.com/samellop3s",
      icon: "fa-globe",
      color: "purple",
      active: true
    },
    {
      id: "2",
      title: "Acompanhe meu GitHub",
      url: "https://github.com/samellop3s",
      icon: "fa-github",
      color: "dark",
      active: true
    }
  ],
  appearance: {
    theme: "bg-cyberpunk",
    btnShape: "rounded-full"
  }
};

// Current form selections
let currentNewLinkIcon = "fa-link";
let currentNewLinkColor = "purple";
let currentEditLinkIcon = "fa-link";
let currentEditLinkColor = "purple";
let searchQueryString = "";

// Mapping of color names to CSS classes for rendered links
const colorClasses = {
  purple: "bg-purple-600 text-white hover:bg-purple-500 border border-purple-400/20",
  blue: "bg-blue-600 text-white hover:bg-blue-500 border border-blue-400/20",
  green: "bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-400/20",
  red: "bg-rose-600 text-white hover:bg-rose-500 border border-rose-400/20",
  dark: "bg-gray-900 text-gray-100 hover:bg-gray-800 border border-gray-700/60",
  glass: "bg-white/10 text-white hover:bg-white/20 border border-white/25 backdrop-blur-md"
};

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  
  // Set initial form inputs based on loaded state
  initFormInputs();
  renderApp();

  // Initialize analytics metrics and start the 3-second simulation
  if (typeof updateMetricsDisplay === "function") {
    updateMetricsDisplay();
  }
  if (typeof startMetricsSimulation === "function") {
    startMetricsSimulation();
  }
});

// Load configurations and items from local storage
function loadFromLocalStorage() {
  const savedState = localStorage.getItem("linkcenter_state");
  if (savedState) {
    try {
      state = JSON.parse(savedState);
    } catch (e) {
      console.error("Error loading saved state", e);
    }
  }
}

// Save current configurations and items to local storage
function saveToLocalStorage() {
  localStorage.setItem("linkcenter_state", JSON.stringify(state));
}

// Populate the Sidebar forms with current state
function initFormInputs() {
  document.getElementById("profile-avatar-url").value = state.profile.avatarUrl;
  document.getElementById("profile-name").value = state.profile.name;
  document.getElementById("profile-bio").value = state.profile.bio;
  
  document.getElementById("social-instagram").value = state.profile.socials.instagram || "";
  document.getElementById("social-github").value = state.profile.socials.github || "";
  document.getElementById("social-linkedin").value = state.profile.socials.linkedin || "";
  document.getElementById("social-twitter").value = state.profile.socials.twitter || "";
}

// Switch between Sidebar panel tabs
window.switchTab = function(tabId) {
  const tabs = ["links", "profile", "appearance"];
  tabs.forEach(t => {
    const tabBtn = document.getElementById(`tab-${t}`);
    const panel = document.getElementById(`panel-${t}`);
    
    if (t === tabId) {
      // Active states
      tabBtn.className = "flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 bg-purple-600/10 text-purple-400 border border-purple-500/20";
      panel.classList.remove("hidden");
    } else {
      // Inactive states
      tabBtn.className = "flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 text-gray-400 hover:text-gray-200 hover:bg-gray-800/30";
      panel.classList.add("hidden");
    }
  });
};

// Show/Hide Add Link Form
window.toggleAddForm = function(show) {
  const form = document.getElementById("add-link-form");
  const addBtnContainer = document.getElementById("add-link-btn-container");
  
  if (show) {
    form.classList.remove("hidden");
    addBtnContainer.classList.add("hidden");
  } else {
    form.classList.add("hidden");
    addBtnContainer.classList.remove("hidden");
    form.reset();
    selectIcon("fa-link");
    selectColor("purple");
  }
};

// Select Icon for new Link Form
window.selectIcon = function(iconClass) {
  currentNewLinkIcon = iconClass;
  document.querySelectorAll(".icon-option").forEach(btn => {
    if (btn.getAttribute("data-icon") === iconClass) {
      btn.className = "icon-option p-2 bg-gray-800 hover:bg-gray-700/80 rounded border border-purple-500 text-purple-400";
    } else {
      btn.className = "icon-option p-2 bg-gray-800/40 hover:bg-gray-700/80 rounded border border-transparent text-gray-400";
    }
  });
};

// Select Color for new Link Form
window.selectColor = function(colorName) {
  currentNewLinkColor = colorName;
  document.querySelectorAll(".color-option").forEach(btn => {
    if (btn.getAttribute("data-color") === colorName) {
      btn.classList.add("ring-2", "ring-white");
    } else {
      btn.classList.remove("ring-2", "ring-white");
    }
  });
};

// Handle adding a new link
window.handleAddLink = function(event) {
  event.preventDefault();
  
  const title = document.getElementById("link-title").value.trim();
  const url = document.getElementById("link-url").value.trim();
  
  if (!title || !url) return;

  const newLink = {
    id: Date.now().toString(),
    title: title,
    url: url,
    icon: currentNewLinkIcon,
    color: currentNewLinkColor,
    active: true
  };
  
  state.links.push(newLink);
  saveToLocalStorage();
  renderApp();
  toggleAddForm(false);
  showToast("Link adicionado com sucesso!");
  triggerDynamicIslandAnimation("Link Adicionado");
};

// Toggle active status of a link
window.toggleLinkActive = function(id) {
  const link = state.links.find(l => l.id === id);
  if (link) {
    link.active = !link.active;
    saveToLocalStorage();
    renderApp();
    triggerDynamicIslandAnimation(link.active ? "Link Ativado" : "Link Desativado");
  }
};

// Open editing modal
window.openEditModal = function(id) {
  const link = state.links.find(l => l.id === id);
  if (!link) return;

  document.getElementById("edit-link-id").value = link.id;
  document.getElementById("edit-link-title").value = link.title;
  document.getElementById("edit-link-url").value = link.url;
  
  selectEditIcon(link.icon);
  selectEditColor(link.color);
  
  const modal = document.getElementById("edit-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

// Close editing modal
window.closeEditModal = function() {
  const modal = document.getElementById("edit-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

// Select Icon in Editing Modal
window.selectEditIcon = function(iconClass) {
  currentEditLinkIcon = iconClass;
  document.querySelectorAll(".edit-icon-option").forEach(btn => {
    if (btn.getAttribute("data-edit-icon") === iconClass) {
      btn.className = "edit-icon-option p-2 bg-gray-800 hover:bg-gray-700/80 rounded border border-purple-500 text-purple-400";
    } else {
      btn.className = "edit-icon-option p-2 bg-gray-800/40 hover:bg-gray-700/80 rounded border border-transparent text-gray-400";
    }
  });
};

// Select Color in Editing Modal
window.selectEditColor = function(colorName) {
  currentEditLinkColor = colorName;
  document.querySelectorAll(".edit-color-option").forEach(btn => {
    if (btn.getAttribute("data-edit-color") === colorName) {
      btn.classList.add("ring-2", "ring-white");
    } else {
      btn.classList.remove("ring-2", "ring-white");
    }
  });
};

// Handle saving link edits
window.handleSaveEdit = function(event) {
  event.preventDefault();
  
  const id = document.getElementById("edit-link-id").value;
  const title = document.getElementById("edit-link-title").value.trim();
  const url = document.getElementById("edit-link-url").value.trim();
  
  if (!title || !url) return;

  const link = state.links.find(l => l.id === id);
  if (link) {
    link.title = title;
    link.url = url;
    link.icon = currentEditLinkIcon;
    link.color = currentEditLinkColor;
    
    saveToLocalStorage();
    renderApp();
    closeEditModal();
    showToast("Link atualizado!");
    triggerDynamicIslandAnimation("Link Editado");
  }
};

// Handle deleting a link
window.deleteLink = function(id) {
  if (confirm("Tem certeza que deseja excluir este link?")) {
    state.links = state.links.filter(l => l.id !== id);
    saveToLocalStorage();
    renderApp();
    showToast("Link excluído!");
    triggerDynamicIslandAnimation("Link Excluído");
  }
};

// Update Profile state from Inputs (runs oninput)
window.updateProfileFromInputs = function() {
  state.profile.name = document.getElementById("profile-name").value.trim() || "Sem Nome";
  state.profile.bio = document.getElementById("profile-bio").value.trim();
  
  const avatarUrlInput = document.getElementById("profile-avatar-url").value.trim();
  if (avatarUrlInput) {
    state.profile.avatarUrl = avatarUrlInput;
  } else {
    state.profile.avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
  }

  saveToLocalStorage();
  renderMockupProfile();
};

// Update Social links state from Inputs
window.updateSocialsFromInputs = function() {
  state.profile.socials.instagram = document.getElementById("social-instagram").value.trim();
  state.profile.socials.github = document.getElementById("social-github").value.trim();
  state.profile.socials.linkedin = document.getElementById("social-linkedin").value.trim();
  state.profile.socials.twitter = document.getElementById("social-twitter").value.trim();
  
  saveToLocalStorage();
  renderMockupSocials();
};

// Change Fullscreen Theme Background
window.changeTheme = function(themeClass) {
  state.appearance.theme = themeClass;
  saveToLocalStorage();
  
  const previewMain = document.getElementById("preview-main");
  if (previewMain) {
    // Remove all presets classes
    previewMain.classList.remove("bg-sunset", "bg-cyberpunk", "bg-ocean", "bg-emerald-glow", "bg-aurora", "bg-dark-glass", "bg-light-glass");
    previewMain.classList.add(themeClass);
  }
  
  // Highlight active theme button in Sidebar
  document.querySelectorAll(".theme-select-btn").forEach(btn => {
    if (btn.getAttribute("data-theme") === themeClass) {
      btn.className = "theme-select-btn flex flex-col items-center p-3 rounded-xl border border-purple-500 bg-purple-950/20 transition-all gap-2";
      btn.querySelector("span").className = "text-xs font-semibold text-purple-300";
    } else {
      btn.className = "theme-select-btn flex flex-col items-center p-3 rounded-xl border border-gray-800 hover:border-purple-500/50 bg-gray-900/60 transition-all gap-2";
      btn.querySelector("span").className = "text-xs font-medium";
    }
  });

  // Re-render links to adapt text color in light theme
  renderMockupLinks();
};

// Change Preview button border-radius style
window.changeBtnShape = function(shapeClass) {
  state.appearance.btnShape = shapeClass;
  saveToLocalStorage();
  
  // Highlight active shape button in Sidebar
  document.querySelectorAll(".btn-shape-select-btn").forEach(btn => {
    if (btn.getAttribute("data-shape") === shapeClass) {
      btn.className = "btn-shape-select-btn py-2 px-3 rounded-lg border border-purple-500 bg-purple-950/20 text-xs text-purple-300 font-semibold";
    } else {
      btn.className = "btn-shape-select-btn py-2 px-3 rounded-lg border border-gray-800 bg-gray-900/60 text-xs text-gray-400 font-medium";
    }
  });
  
  renderMockupLinks();
};

// Toggle Left Sidebar Visibility
window.toggleSidebar = function() {
  const sidebar = document.getElementById("sidebar");
  const toggleIcon = document.getElementById("sidebar-toggle-icon");
  if (!sidebar || !toggleIcon) return;
  
  const isCollapsed = sidebar.classList.contains("sidebar-collapsed");
  if (isCollapsed) {
    sidebar.classList.remove("sidebar-collapsed");
    toggleIcon.className = "fa-solid fa-chevron-left text-sm";
  } else {
    sidebar.classList.add("sidebar-collapsed");
    toggleIcon.className = "fa-solid fa-chevron-right text-sm";
  }
};

// Handle input from the search field to filter links
window.handleSearchInput = function(event) {
  searchQueryString = event.target.value.toLowerCase().trim();
  renderMockupLinks();
};

// Copy Shareable Hub Link
window.copyShareLink = function() {
  const fakeUrl = `https://linkcenter.co/${state.profile.name.toLowerCase().replace(/\s+/g, '')}`;
  
  navigator.clipboard.writeText(fakeUrl).then(() => {
    showToast(`Copiado: ${fakeUrl}`);
    triggerDynamicIslandAnimation("URL Copiada!");
  }).catch(err => {
    console.error("Could not copy text", err);
  });
};

// Show temporary notification toast banner
function showToast(message) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toast-message");
  
  msgEl.textContent = message;
  toast.classList.remove("translate-y-20", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");
  
  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-20", "opacity-0");
  }, 2500);
}

// Animate Dashboard Status Badge on changes
function triggerDynamicIslandAnimation(text) {
  const statusBadge = document.getElementById("card-status");
  if (!statusBadge) return;
  
  statusBadge.textContent = text;
  statusBadge.parentElement.classList.remove("text-white/70", "border-white/10");
  statusBadge.parentElement.classList.add("text-emerald-400", "border-emerald-500/30", "bg-emerald-950/40");
  
  setTimeout(() => {
    statusBadge.textContent = "Visualização Ativa";
    statusBadge.parentElement.classList.add("text-white/70", "border-white/10");
    statusBadge.parentElement.classList.remove("text-emerald-400", "border-emerald-500/30", "bg-emerald-950/40");
  }, 2000);
}

// Render the entire app updates
function renderApp() {
  // Update link counter
  document.getElementById("links-count").textContent = `${state.links.length} link${state.links.length !== 1 ? 's' : ''}`;
  
  renderEditorLinks();
  renderMockupProfile();
  renderMockupLinks();
  renderMockupSocials();
  
  // Apply current appearance styles
  changeTheme(state.appearance.theme);
  changeBtnShape(state.appearance.btnShape);

  // Update analytics metrics dynamically
  if (typeof updateMetricsDisplay === "function") {
    updateMetricsDisplay();
  }
}

// Render links within the Sidebar management panel
function renderEditorLinks() {
  const container = document.getElementById("links-list");
  container.innerHTML = "";
  
  if (state.links.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-800/80 rounded-xl">
        <i class="fa-solid fa-link-slash text-2xl mb-2 text-gray-600"></i>
        <p class="text-xs">Nenhum link adicionado ainda.</p>
      </div>
    `;
    return;
  }
  
  state.links.forEach(link => {
    const item = document.createElement("div");
    item.className = "glass-card rounded-xl p-4 flex items-center justify-between gap-3 animate-list-pop";
    
    // Generate icon HTML representation
    let iconHtml = `<i class="fa-solid fa-link text-purple-400"></i>`;
    if (link.icon.startsWith("fa-")) {
      const isBrand = link.icon === "fa-github" || link.icon === "fa-linkedin" || link.icon === "fa-youtube" || link.icon === "fa-whatsapp";
      iconHtml = `<i class="${isBrand ? 'fa-brands' : 'fa-solid'} ${link.icon} text-purple-400"></i>`;
    }

    item.innerHTML = `
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="w-10 h-10 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center justify-center flex-shrink-0">
          ${iconHtml}
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="text-sm font-bold text-gray-200 truncate">${link.title}</h4>
          <p class="text-[11px] text-gray-500 truncate">${link.url}</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- Switch visibility toggle -->
        <button onclick="toggleLinkActive('${link.id}')" class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none ${link.active ? 'bg-purple-600' : 'bg-gray-800'}" aria-label="Toggle link visibility">
          <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${link.active ? 'translate-x-4.5' : 'translate-x-0.75'}"></span>
        </button>
        
        <!-- Action buttons -->
        <button onclick="openEditModal('${link.id}')" title="Editar Link" class="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-purple-400 rounded-lg transition-colors">
          <i class="fa-regular fa-pen-to-square"></i>
        </button>
        <button onclick="deleteLink('${link.id}')" title="Excluir Link" class="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    `;
    container.appendChild(item);
  });
}

// Render Profile updates in Mockup
function renderMockupProfile() {
  const previewAvatar = document.getElementById("preview-avatar");
  if (previewAvatar) previewAvatar.src = state.profile.avatarUrl;
  
  const sidebarAvatar = document.getElementById("profile-preview-avatar");
  if (sidebarAvatar) sidebarAvatar.src = state.profile.avatarUrl;
  
  const previewName = document.getElementById("preview-name");
  if (previewName) previewName.textContent = state.profile.name;
  
  const previewBio = document.getElementById("preview-bio");
  if (previewBio) previewBio.textContent = state.profile.bio;

  // Sync Header dynamic text elements
  const headerTitle = document.getElementById("header-dynamic-title");
  if (headerTitle) headerTitle.textContent = state.profile.name;

  const headerSubtitle = document.getElementById("header-dynamic-subtitle");
  if (headerSubtitle) headerSubtitle.textContent = `Hub de Links de ${state.profile.name}`;
}

// Render dynamic Link Buttons as beautiful hover cards in central grid
function renderMockupLinks() {
  const container = document.getElementById("preview-links-container");
  container.innerHTML = "";
  
  // Filter active links
  let activeLinks = state.links.filter(l => l.active);

  // Apply search query filter if not empty
  if (searchQueryString) {
    activeLinks = activeLinks.filter(link => 
      link.title.toLowerCase().includes(searchQueryString) || 
      link.url.toLowerCase().includes(searchQueryString)
    );
  }
  
  if (activeLinks.length === 0) {
    if (searchQueryString) {
      container.innerHTML = `
        <div class="col-span-full py-12 flex flex-col items-center justify-center text-center text-white/50 border border-dashed border-white/20 rounded-2xl bg-black/10">
          <i class="fa-solid fa-magnifying-glass text-2xl mb-2 text-white/30 animate-pulse"></i>
          <p class="text-xs font-semibold text-zinc-300">Nenhum link correspondente à busca: "${searchQueryString}"</p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="col-span-full py-12 flex flex-col items-center justify-center text-center text-white/50 border border-dashed border-white/20 rounded-2xl bg-black/10">
          <i class="fa-solid fa-ghost text-2xl mb-2 text-white/30"></i>
          <p class="text-xs">Nenhum link ativo no momento.</p>
        </div>
      `;
    }
    return;
  }
  
  activeLinks.forEach(link => {
    const btn = document.createElement("a");
    btn.href = link.url;
    btn.target = "_blank";
    
    // Shape styling class
    const shapeClass = state.appearance.btnShape;
    // Theme color class styling
    const colorBgClass = colorClasses[link.color] || colorClasses.purple;
    
    // Light text styling adjustments if background theme is light
    const isLightTheme = state.appearance.theme === "bg-light-glass";
    const titleTextClass = isLightTheme && link.color === 'glass' ? 'text-gray-900 font-bold' : 'text-inherit font-bold';
    const subTextClass = isLightTheme && link.color === 'glass' ? 'text-gray-600' : 'text-inherit opacity-75';
    
    // Card with full hover animation and scale feedback
    btn.className = `preview-link-btn group w-full p-4 flex items-center justify-between text-left shadow-md hover:-translate-y-1 hover:shadow-xl transition-all active:scale-95 duration-300 ${shapeClass} ${colorBgClass}`;
    
    let iconHtml = "";
    if (link.icon.startsWith("fa-")) {
      const isBrand = link.icon === "fa-github" || link.icon === "fa-linkedin" || link.icon === "fa-youtube" || link.icon === "fa-whatsapp";
      iconHtml = `<i class="${isBrand ? 'fa-brands' : 'fa-solid'} ${link.icon} text-lg"></i>`;
    }
    
    btn.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        <span class="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          ${iconHtml}
        </span>
        <div class="min-w-0">
          <span class="${titleTextClass} block truncate text-[14px] tracking-tight leading-snug">${link.title}</span>
          <span class="${subTextClass} block truncate text-[10px] mt-0.5">${link.url}</span>
        </div>
      </div>
      <div class="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
        <i class="fa-solid fa-arrow-right text-[10px]"></i>
      </div>
    `;
    
    container.appendChild(btn);
  });
}

// Render dynamic Social Media handles on the preview dashboard
function renderMockupSocials() {
  const container = document.getElementById("preview-socials");
  if (!container) return;
  container.innerHTML = "";
  
  const socials = state.profile.socials;
  const isLightTheme = state.appearance.theme === "bg-light-glass";
  const iconColorClass = isLightTheme ? 'text-gray-800 hover:text-purple-600' : 'text-white/80 hover:text-white';
  
  let hasSocials = false;
  
  if (socials.instagram) {
    hasSocials = true;
    container.innerHTML += `
      <a href="https://instagram.com/${socials.instagram}" target="_blank" class="${iconColorClass} transition-colors">
        <i class="fa-brands fa-instagram text-xl"></i>
      </a>
    `;
  }
  if (socials.github) {
    hasSocials = true;
    container.innerHTML += `
      <a href="https://github.com/${socials.github}" target="_blank" class="${iconColorClass} transition-colors">
        <i class="fa-brands fa-github text-xl"></i>
      </a>
    `;
  }
  if (socials.linkedin) {
    hasSocials = true;
    const link = socials.linkedin.startsWith("http") ? socials.linkedin : `https://linkedin.com/in/${socials.linkedin}`;
    container.innerHTML += `
      <a href="${link}" target="_blank" class="${iconColorClass} transition-colors">
        <i class="fa-brands fa-linkedin text-xl"></i>
      </a>
    `;
  }
  if (socials.twitter) {
    hasSocials = true;
    container.innerHTML += `
      <a href="https://twitter.com/${socials.twitter}" target="_blank" class="${iconColorClass} transition-colors">
        <i class="fa-brands fa-x-twitter text-xl"></i>
      </a>
    `;
  }
  
  if (!hasSocials) {
    container.innerHTML = `<span class="text-[10px] text-white/30 italic">Nenhuma rede social configurada</span>`;
  }
}

// ==========================================
// SEÇÃO: ANALYTICS (MÉTRICAS DO HUB)
// ==========================================

// Initial metrics state using descriptive property names
let hubMetrics = {
  totalClicksCount: 1240,
  conversionRatePercent: 68.4,
  errorsCount: 2
};

// Pure-like display updater to sync metrics state with HTML elements
function updateMetricsDisplay() {
  const clicksEl = document.getElementById("metric-clicks");
  if (clicksEl) clicksEl.textContent = hubMetrics.totalClicksCount.toLocaleString("pt-BR");

  const conversionEl = document.getElementById("metric-conversion");
  if (conversionEl) conversionEl.textContent = `${hubMetrics.conversionRatePercent.toFixed(1)}%`;

  const errorsEl = document.getElementById("metric-errors");
  if (errorsEl) errorsEl.textContent = hubMetrics.errorsCount;

  const activeEl = document.getElementById("metric-active");
  if (activeEl && typeof state !== "undefined" && state.links) {
    // Dynamic active links count directly from app state
    const activeCount = state.links.filter(link => link.active).length;
    activeEl.textContent = activeCount;
  }
}

// Simulation loop updating the metrics state every 3 seconds
function startMetricsSimulation() {
  setInterval(() => {
    // Simulate slight natural growth in clicks
    hubMetrics.totalClicksCount += Math.floor(Math.random() * 4);
    
    // Simulate slight fluctuation in conversion rate
    const conversionDelta = (Math.random() - 0.5) * 0.3;
    hubMetrics.conversionRatePercent = Math.max(10, Math.min(100, hubMetrics.conversionRatePercent + conversionDelta));
    
    // Random chance to fluctuate errors count
    const errorChance = Math.random();
    if (errorChance > 0.96) {
      hubMetrics.errorsCount += 1;
    } else if (errorChance < 0.03 && hubMetrics.errorsCount > 0) {
      hubMetrics.errorsCount = Math.max(0, hubMetrics.errorsCount - 1);
    }
    
    updateMetricsDisplay();
  }, 3000);
}

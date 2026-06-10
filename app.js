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
  syncTime();
  setInterval(syncTime, 60000); // update clock every minute
  
  // Set initial form inputs based on loaded state
  initFormInputs();
  renderApp();
});

// Sync clock in the mockup status bar
function syncTime() {
  const clockEl = document.getElementById("phone-time");
  if (clockEl) {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, "0");
    let minutes = now.getMinutes().toString().padStart(2, "0");
    clockEl.textContent = `${hours}:${minutes}`;
  }
}

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

// Change Phone Mockup Theme Background
window.changeTheme = function(themeClass) {
  state.appearance.theme = themeClass;
  saveToLocalStorage();
  
  const phoneScreen = document.getElementById("phone-screen");
  // Remove all presets classes
  phoneScreen.classList.remove("bg-sunset", "bg-cyberpunk", "bg-ocean", "bg-emerald-glow", "bg-aurora", "bg-dark-glass", "bg-light-glass");
  phoneScreen.classList.add(themeClass);
  
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

// Animate Dynamic Island inside Phone on changes
function triggerDynamicIslandAnimation(text) {
  const island = document.querySelector(".dynamic-island");
  if (!island) return;
  
  // Expanded styling
  island.style.width = "170px";
  island.style.height = "28px";
  island.style.borderRadius = "20px";
  island.style.display = "flex";
  island.style.alignItems = "center";
  island.style.justify = "center";
  island.innerHTML = `<span class="text-[9px] font-bold text-white w-full text-center animate-fade-in">${text}</span>`;
  
  setTimeout(() => {
    island.style.width = "85px";
    island.style.height = "25px";
    island.innerHTML = "";
  }, 1800);
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
  document.getElementById("phone-avatar").src = state.profile.avatarUrl;
  document.getElementById("profile-preview-avatar").src = state.profile.avatarUrl;
  document.getElementById("phone-name").textContent = state.profile.name;
  document.getElementById("phone-bio").textContent = state.profile.bio;
}

// Render dynamic Link Buttons in Smartphone screen
function renderMockupLinks() {
  const container = document.getElementById("phone-links-container");
  container.innerHTML = "";
  
  // Filter only active links
  const activeLinks = state.links.filter(l => l.active);
  
  if (activeLinks.length === 0) {
    container.innerHTML = `
      <div class="flex-1 flex flex-col items-center justify-center text-center text-white/40 p-4 border border-dashed border-white/10 rounded-2xl bg-black/20">
        <i class="fa-solid fa-ghost text-lg mb-1.5"></i>
        <p class="text-[10px]">Sem links ativos no momento</p>
      </div>
    `;
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
    const titleTextClass = isLightTheme && link.color === 'glass' ? 'text-gray-900 font-semibold' : 'text-inherit font-semibold';
    
    btn.className = `preview-link-btn w-full py-2.5 px-4 flex items-center justify-between text-xs shadow-sm hover:shadow-md transition-all duration-300 ${shapeClass} ${colorBgClass}`;
    
    let iconHtml = "";
    if (link.icon.startsWith("fa-")) {
      const isBrand = link.icon === "fa-github" || link.icon === "fa-linkedin" || link.icon === "fa-youtube" || link.icon === "fa-whatsapp";
      iconHtml = `<i class="${isBrand ? 'fa-brands' : 'fa-solid'} ${link.icon} text-sm"></i>`;
    }
    
    btn.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="w-5 h-5 flex items-center justify-center opacity-85 flex-shrink-0">
          ${iconHtml}
        </span>
        <span class="${titleTextClass} truncate text-[13px]">${link.title}</span>
      </div>
      <i class="fa-solid fa-chevron-right text-[10px] opacity-50 flex-shrink-0"></i>
    `;
    
    container.appendChild(btn);
  });
}

// Render dynamic Social Media handles on the phone mockup
function renderMockupSocials() {
  const container = document.getElementById("phone-socials");
  container.innerHTML = "";
  
  const socials = state.profile.socials;
  const isLightTheme = state.appearance.theme === "bg-light-glass";
  const iconColorClass = isLightTheme ? 'text-gray-800 hover:text-purple-600' : 'text-white/80 hover:text-white';
  
  let hasSocials = false;
  
  if (socials.instagram) {
    hasSocials = true;
    container.innerHTML += `
      <a href="https://instagram.com/${socials.instagram}" target="_blank" class="${iconColorClass} transition-colors">
        <i class="fa-brands fa-instagram text-lg"></i>
      </a>
    `;
  }
  if (socials.github) {
    hasSocials = true;
    container.innerHTML += `
      <a href="https://github.com/${socials.github}" target="_blank" class="${iconColorClass} transition-colors">
        <i class="fa-brands fa-github text-lg"></i>
      </a>
    `;
  }
  if (socials.linkedin) {
    hasSocials = true;
    // Handle either raw username or direct full URL
    const link = socials.linkedin.startsWith("http") ? socials.linkedin : `https://linkedin.com/in/${socials.linkedin}`;
    container.innerHTML += `
      <a href="${link}" target="_blank" class="${iconColorClass} transition-colors">
        <i class="fa-brands fa-linkedin text-lg"></i>
      </a>
    `;
  }
  if (socials.twitter) {
    hasSocials = true;
    container.innerHTML += `
      <a href="https://twitter.com/${socials.twitter}" target="_blank" class="${iconColorClass} transition-colors">
        <i class="fa-brands fa-x-twitter text-lg"></i>
      </a>
    `;
  }
  
  if (!hasSocials) {
    container.innerHTML = `<span class="text-[9px] text-white/30 italic">Nenhuma rede social configurada</span>`;
  }
}

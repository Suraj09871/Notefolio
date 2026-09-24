// API base URL configuration
const API_BASE_URL = window.location.origin;

// Helper to show toast notifications
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `success-message ${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { document.body.removeChild(toast); }, 300);
    }, 2000);
  }, 100);
}

// ==================== GOOGLE SIGN-IN (REDIRECT FLOW) ====================

// Handle Google OAuth callback on page load
function handleGoogleAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check for successful Google auth
  const googleAuth = urlParams.get('google_auth');
  if (googleAuth) {
    try {
      const userData = JSON.parse(decodeURIComponent(googleAuth));
      currentUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        avatar: userData.avatar,
        authProvider: userData.authProvider,
        token: userData.token,
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('authToken', userData.token);
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      updateUIForUser();
      showToast(`Welcome, ${userData.name}!`);
    } catch (e) {
      console.error('Error parsing Google auth data:', e);
    }
  }
  
  // Check for Google auth error
  const googleError = urlParams.get('google_error');
  if (googleError) {
    window.history.replaceState({}, document.title, window.location.pathname);
    showToast('Google sign-in failed: ' + googleError, 'error');
  }
}

// Attach click handlers to Google Sign-In buttons
function initGoogleButtons() {
  document.querySelectorAll('.google-signin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = `${API_BASE_URL}/api/auth/google`;
    });
  });
}

// Initialize on page load
// Moved to DOMContentLoaded to ensure auth state is ready before rendering
function initGoogleAuth() {
  handleGoogleAuthCallback();
  initGoogleButtons();
}



// Sample notes data
const notesData = [
  {
    id: 1,
    title: "Data Structures and Algorithms",
    subject: "CS",
    price: 299,
    image: "images/Data Structures and Algorithms.jpg",
    description:
      "Comprehensive notes covering arrays, linked lists, trees, graphs, sorting algorithms, and more. Perfect for interview preparation.",
    pdfUrl: "https://fkjxfhgvvbdqpgxhqtxc.supabase.co/storage/v1/object/public/pdfs/dsa-notes.pdf",
    pages: 120,
    chapters: [
      { title: "Introduction to Data Structures", pages: "1-10" },
      { title: "Arrays and Strings", pages: "11-25" },
      { title: "Linked Lists", pages: "26-40" },
      { title: "Stacks and Queues", pages: "41-55" },
      { title: "Trees and Graphs", pages: "56-75" },
      { title: "Sorting Algorithms", pages: "76-95" },
      { title: "Searching Algorithms", pages: "96-110" },
      { title: "Advanced Topics", pages: "111-120" },
    ],
  },
  {
    id: 2,
    title: "Object-Oriented Programming",
    subject: "CS",
    price: 249,
    image: "images/object-Oriented Programming.jpg",
    description:
      "Detailed explanations of OOP concepts including classes, objects, inheritance, polymorphism, and encapsulation. Examples in Java and C++.",
    pdfUrl: "https://fkjxfhgvvbdqpgxhqtxc.supabase.co/storage/v1/object/public/pdfs/oop-notes.pdf",
    pages: 85,
    chapters: [
      { title: "Introduction to OOP", pages: "1-8" },
      { title: "Classes and Objects", pages: "9-20" },
      { title: "Inheritance", pages: "21-35" },
      { title: "Polymorphism", pages: "36-50" },
      { title: "Encapsulation", pages: "51-60" },
      { title: "Abstraction", pages: "61-70" },
      { title: "Design Patterns", pages: "71-85" },
    ],
  },
  {
    id: 3,
    title: "Database Management Systems",
    subject: "CS",
    price: 279,
    image: "images/Database Management Systems.jpg",
    description:
      "Covers relational database design, SQL, normalization, transaction management, and concurrency control. Includes practice problems.",
    pdfUrl: "https://fkjxfhgvvbdqpgxhqtxc.supabase.co/storage/v1/object/public/pdfs/dbms-notes.pdf",
    pages: 95,
    chapters: [
      { title: "Introduction to DBMS", pages: "1-10" },
      { title: "Relational Model", pages: "11-25" },
      { title: "SQL Fundamentals", pages: "26-40" },
      { title: "Normalization", pages: "41-55" },
      { title: "Transaction Management", pages: "56-70" },
      { title: "Concurrency Control", pages: "71-85" },
      { title: "Database Security", pages: "86-95" },
    ],
  },
  {
    id: 4,
    title: "Computer Networks",
    subject: "CS",
    price: 289,
    image: "images/Computer Networks.jpg",
    description:
      "In-depth notes on network layers, protocols, IP addressing, subnetting, and network security. Includes diagrams and real-world examples.",
    pdfUrl: "https://fkjxfhgvvbdqpgxhqtxc.supabase.co/storage/v1/object/public/pdfs/networks-notes.pdf",
    pages: 110,
    chapters: [
      { title: "Introduction to Networks", pages: "1-10" },
      { title: "Physical Layer", pages: "11-25" },
      { title: "Data Link Layer", pages: "26-40" },
      { title: "Network Layer", pages: "41-60" },
      { title: "Transport Layer", pages: "61-80" },
      { title: "Application Layer", pages: "81-95" },
      { title: "Network Security", pages: "96-110" },
    ],
  },
  {
    id: 5,
    title: "Operating Systems",
    subject: "CS",
    price: 269,
    image: "images/Operating Systems.jpg",
    description:
      "Comprehensive coverage of process management, memory management, file systems, and I/O systems. Includes case studies of popular OS.",
    pdfUrl: "https://fkjxfhgvvbdqpgxhqtxc.supabase.co/storage/v1/object/public/pdfs/os-notes.pdf",
    pages: 100,
    chapters: [
      { title: "Introduction to OS", pages: "1-10" },
      { title: "Process Management", pages: "11-30" },
      { title: "Memory Management", pages: "31-50" },
      { title: "File Systems", pages: "51-70" },
      { title: "I/O Systems", pages: "71-85" },
      { title: "Case Studies", pages: "86-100" },
    ],
  },
  {
    id: 6,
    title: "Web Development",
    subject: "CS",
    price: 319,
    image: "images/Web Development.jpg",
    description:
      "Full-stack web development notes covering HTML, CSS, JavaScript, React, Node.js, and database integration. Includes project ideas and best practices.",
    pdfUrl: "https://fkjxfhgvvbdqpgxhqtxc.supabase.co/storage/v1/object/public/pdfs/webdev-notes.pdf",
    pages: 150,
    chapters: [
      { title: "HTML Fundamentals", pages: "1-20" },
      { title: "CSS Styling", pages: "21-40" },
      { title: "JavaScript Basics", pages: "41-60" },
      { title: "DOM Manipulation", pages: "61-80" },
      { title: "React Framework", pages: "81-100" },
      { title: "Node.js Backend", pages: "101-120" },
      { title: "Database Integration", pages: "121-140" },
      { title: "Project Examples", pages: "141-150" },
    ],
  },
  {
    id: 7,
    title: "Artificial Intelligence",
    subject: "AI",
    price: 349,
    image: "images/Artificial Intelligence.jpg",
    description:
      "Explores machine learning algorithms, neural networks, natural language processing, and computer vision. Includes Python code examples.",
    pdfUrl: "https://fkjxfhgvvbdqpgxhqtxc.supabase.co/storage/v1/object/public/pdfs/ai-notes.pdf",
    pages: 130,
    chapters: [
      { title: "Introduction to AI", pages: "1-10" },
      { title: "Machine Learning Basics", pages: "11-30" },
      { title: "Supervised Learning", pages: "31-50" },
      { title: "Unsupervised Learning", pages: "51-70" },
      { title: "Neural Networks", pages: "71-90" },
      { title: "Natural Language Processing", pages: "91-110" },
      { title: "Computer Vision", pages: "111-130" },
    ],
  },
  {
    id: 8,
    title: "Software Engineering",
    subject: "CS",
    price: 299,
    image: "images/Software Engineering.jpg",
    description:
      "Covers software development lifecycle, agile methodologies, design patterns, testing strategies, and project management techniques.",
    pdfUrl: "https://fkjxfhgvvbdqpgxhqtxc.supabase.co/storage/v1/object/public/pdfs/se-notes.pdf",
    pages: 90,
    chapters: [
      { title: "Software Development Lifecycle", pages: "1-15" },
      { title: "Requirements Engineering", pages: "16-30" },
      { title: "Software Design", pages: "31-45" },
      { title: "Testing Strategies", pages: "46-60" },
      { title: "Agile Methodologies", pages: "61-75" },
      { title: "Project Management", pages: "76-90" },
    ],
  },
  {
    id: 9,
    title: "Computer Architecture",
    subject: "CS",
    price: 259,
    image: "images/Computer Architecture.jpg",
    description:
      "Detailed notes on CPU design, memory hierarchy, pipelining, and parallel processing. Includes performance analysis techniques.",
    pdfUrl: "https://fkjxfhgvvbdqpgxhqtxc.supabase.co/storage/v1/object/public/pdfs/arch-notes.pdf",
    pages: 85,
    chapters: [
      { title: "Computer Organization", pages: "1-10" },
      { title: "CPU Design", pages: "11-25" },
      { title: "Memory Hierarchy", pages: "26-40" },
      { title: "Pipelining", pages: "41-55" },
      { title: "Parallel Processing", pages: "56-70" },
      { title: "Performance Analysis", pages: "71-85" },
    ],
  },
  {
    id: 10,
    title: "Cybersecurity",
    subject: "CS",
    price: 329,
    image: "images/Cybersecurity.jpg",
    description:
      "Comprehensive coverage of cryptography, network security, ethical hacking, and security policies. Includes real-world case studies and best practices.",
    pdfUrl: "https://fkjxfhgvvbdqpgxhqtxc.supabase.co/storage/v1/object/public/pdfs/security-notes.pdf",
    pages: 115,
    chapters: [
      { title: "Introduction to Cybersecurity", pages: "1-10" },
      { title: "Cryptography", pages: "11-30" },
      { title: "Network Security", pages: "31-50" },
      { title: "Web Security", pages: "51-70" },
      { title: "Ethical Hacking", pages: "71-90" },
      { title: "Security Policies", pages: "91-105" },
      { title: "Case Studies", pages: "106-115" },
    ],
  },
]

// Available discounts
const discounts = {
  NEW10: { description: "10% off for first-time users", percentage: 10, isValid: true },
  STUDENT20: { description: "20% off for verified students", percentage: 20, isValid: true },
  BUNDLE15: { description: "15% off when purchasing 3+ notes", percentage: 15, minimumItems: 3, isValid: true },
}

// Available subscription plans
// const subscriptionPlans = {
//   BASIC: {
//     name: "Basic Plan",
//     price: 499,
//     description: "Access to 3 notes of your choice",
//     notesLimit: 3,
//     downloadAllowed: false,
//   },
//   STANDARD: {
//     name: "Standard Plan",
//     price: 999,
//     description: "Access to 10 notes of your choice",
//     notesLimit: 10,
//     downloadAllowed: false,
//   },
//   PREMIUM: {
//     name: "Premium Plan",
//     price: 1999,
//     description: "Access to all notes with download capability",
//     notesLimit: -1,
//     downloadAllowed: true,
//   },
// }

// Initialize local storage items
const cart = JSON.parse(localStorage.getItem("cart")) || []
const purchasedNotes = JSON.parse(localStorage.getItem("purchasedNotes")) || []
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null
let appliedDiscount = JSON.parse(localStorage.getItem("appliedDiscount")) || null
let downloadsList = JSON.parse(localStorage.getItem("downloads")) || []
const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || []
const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || []
let highlights = JSON.parse(localStorage.getItem("highlights")) || []
const userNotes = JSON.parse(localStorage.getItem("userNotes")) || []
// let userSubscription = JSON.parse(localStorage.getItem("userSubscription")) || null

// Application Initialization & Lifecycle
async function initApp() {
  // Process Google auth tokens first
  initGoogleAuth()

  // Setup mobile navigation drawer and bottom navigation bar
  setupMobileNavigation()

  // Update UI based on user login status
  updateUIForUser()

  // Update cart count
  updateCartCount()

  // Render appropriate content based on current page
  // Netlify Pretty URLs strips .html from paths and might add trailing slashes
  // So we filter empty segments and normalize
  let pathSegments = window.location.pathname.split("/").filter(Boolean)
  let currentPage = pathSegments.length > 0 ? pathSegments.pop() : "index"
  currentPage = currentPage.replace(".html", "")

  if (currentPage === "index") {
    // Index page needs API notes — fetch first, then render
    await fetchApiNotes()
    renderNotes()
  } else if (currentPage === "cart") {
    // Cart reads from localStorage, no API fetch needed
    renderCart()
    setupPaymentOptions()
    setupPlaceOrderButton()
  } else if (currentPage === "my-notes") {
    // My Notes page needs API notes — fetch first, then render
    await fetchApiNotes()
    renderMyNotes()
    setupTabButtons()
    setupSearchNotes()
    setupDownloadsManager()
    setupUploadNotes()
  } else if (currentPage === "note-viewer") {
    // Note viewer needs API notes to find uploaded handwritten notes
    await fetchApiNotes()
    renderNoteViewer()
    setupScreenshotProtection()
    setupTextbookFeatures()
    initializeTextbookFeatures()
  } else if (currentPage === "my-orders") {
    renderOrderHistory()
  } else if (currentPage === "downloads") {
    renderDownloads()
    setupDownloadsManager()
  } else if (currentPage === "wishlist") {
    renderWishlist()
  } else if (currentPage === "coupons") {
    renderCoupons()
  } else if (currentPage === "profile") {
    renderProfile()
  } else if (currentPage === "help-center") {
    renderHelpCenter()
  }

  // Setup authentication modals
  setupAuthModals()

  // Add event listeners for branch cards
  const branchCards = document.querySelectorAll(".branch-card")
  if (branchCards.length > 0) {
    branchCards.forEach((card) => {
      card.addEventListener("click", function () {
        const branchName = this.querySelector("h3").textContent.trim()
        const subjectFilter = document.getElementById("subject-filter")

        if (subjectFilter) {
          // Set the appropriate filter value based on branch name
          if (branchName === "B.Tech") {
            subjectFilter.value = "CS"
          } else if (branchName === "BBA") {
            subjectFilter.value = "BBA"
          } else if (branchName === "Law") {
            subjectFilter.value = "LAW"
          }

          // Trigger the filter change
          renderNotes()

          // Scroll to notes section
          const notesSection = document.getElementById("notes")
          if (notesSection) {
            notesSection.scrollIntoView({ behavior: "smooth" })
          }
        }
      })
    })
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp)
} else {
  initApp()
}

// Setup mobile navigation drawer and bottom navigation bar
function setupMobileNavigation() {
  const menuToggle = document.getElementById("mobile-menu-toggle")
  const mainNav = document.getElementById("main-nav")
  const drawerCloseBtn = document.getElementById("drawer-close-btn")
  const navBackdrop = document.getElementById("nav-backdrop")

  function openDrawer() {
    if (mainNav) mainNav.classList.add("active")
    if (menuToggle) menuToggle.classList.add("active")
    if (navBackdrop) navBackdrop.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  function closeDrawer() {
    if (mainNav) mainNav.classList.remove("active")
    if (menuToggle) menuToggle.classList.remove("active")
    if (navBackdrop) navBackdrop.classList.remove("active")
    document.body.style.overflow = ""
  }

  if (menuToggle) {
    // Use onclick to guarantee single idempotent handler without duplicates
    menuToggle.onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (mainNav && mainNav.classList.contains("active")) {
        closeDrawer()
      } else {
        openDrawer()
      }
    }
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.onclick = (e) => {
      e.preventDefault()
      closeDrawer()
    }
  }

  if (navBackdrop) {
    navBackdrop.onclick = (e) => {
      e.preventDefault()
      closeDrawer()
    }
  }

  // Close drawer when clicking regular navigation links
  if (mainNav) {
    const navLinks = mainNav.querySelectorAll("ul li a")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeDrawer()
      })
    })
  }

  // Close drawer on Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mainNav && mainNav.classList.contains("active")) {
      closeDrawer()
    }
  })

  // Setup Mobile Bottom Navigation Bar if not already in DOM
  const isExcluded = window.location.pathname.includes("admin-panel")
  if (!document.querySelector(".mobile-bottom-nav") && !isExcluded) {
    const bottomNav = document.createElement("nav")
    bottomNav.className = "mobile-bottom-nav"

    let pathSegments = window.location.pathname.split("/").filter(Boolean)
    let curPage = pathSegments.length > 0 ? pathSegments.pop() : "index"
    curPage = curPage.replace(".html", "")

    const cartCount = cart ? cart.length : 0

    bottomNav.innerHTML = `
      <a href="index.html" class="bottom-nav-item ${curPage === "index" ? "active" : ""}">
        <i class="fas fa-home"></i>
        <span>Home</span>
      </a>
      <a href="my-notes.html" class="bottom-nav-item ${curPage === "my-notes" ? "active" : ""}">
        <i class="fas fa-book-open"></i>
        <span>My Notes</span>
      </a>
      <a href="cart.html" class="bottom-nav-item ${curPage === "cart" ? "active" : ""}">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-badge">${cartCount}</span>
        <span>Cart</span>
      </a>
      <a href="my-orders.html" class="bottom-nav-item ${curPage === "my-orders" ? "active" : ""}">
        <i class="fas fa-receipt"></i>
        <span>Orders</span>
      </a>
      <a href="#" class="bottom-nav-item bottom-nav-account ${curPage === "profile" ? "active" : ""}">
        <i class="fas fa-user-circle"></i>
        <span class="bottom-nav-account-label">${currentUser ? "Account" : "Login"}</span>
      </a>
    `
    document.body.appendChild(bottomNav)
    document.body.classList.add("has-bottom-nav")

    // Account link behavior in bottom bar
    const bottomAccountBtn = bottomNav.querySelector(".bottom-nav-account")
    if (bottomAccountBtn) {
      bottomAccountBtn.addEventListener("click", (e) => {
        e.preventDefault()
        if (currentUser) {
          window.location.href = "profile.html"
        } else {
          openLoginModal()
        }
      })
    }
  }
}

// Update UI based on user login status
function updateUIForUser() {
  const loginBtn = document.getElementById("login-btn")
  const signupBtn = document.getElementById("signup-btn")
  const myOrdersLink = document.querySelector(".my-orders-link")
  const drawerUserName = document.querySelector(".drawer-user-name")
  const drawerUserStatus = document.querySelector(".drawer-user-status")
  const bottomAccountLabel = document.querySelector(".bottom-nav-account-label")

  if (currentUser) {
    if (loginBtn) {
      loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`
      loginBtn.onclick = (e) => {
        e.preventDefault()
        showUserMenu()
      }
    }

    if (signupBtn) {
      signupBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`
      signupBtn.className = "signup-btn logout-active-btn"
      signupBtn.onclick = (e) => {
        e.preventDefault()
        logout()
      }
    }

    // Show My Orders link if logged in
    if (myOrdersLink) {
      myOrdersLink.style.display = "flex"
    }

    // Update mobile drawer greeting
    if (drawerUserName) drawerUserName.textContent = currentUser.name || "Student"
    if (drawerUserStatus) drawerUserStatus.textContent = currentUser.email || "Active Member"
    if (bottomAccountLabel) bottomAccountLabel.textContent = "Account"

    // 1. Mobile Drawer Header Logout Button
    let drawerLogoutBtn = document.getElementById("drawer-logout-btn")
    if (!drawerLogoutBtn) {
      const drawerHeader = document.querySelector(".mobile-drawer-header")
      if (drawerHeader) {
        drawerLogoutBtn = document.createElement("button")
        drawerLogoutBtn.id = "drawer-logout-btn"
        drawerLogoutBtn.className = "drawer-logout-btn"
        drawerLogoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout'
        drawerLogoutBtn.title = "Log out of NoteFolio"
        drawerLogoutBtn.onclick = (e) => {
          e.preventDefault()
          logout()
        }
        const closeBtn = document.getElementById("drawer-close-btn")
        if (closeBtn) {
          drawerHeader.insertBefore(drawerLogoutBtn, closeBtn)
        } else {
          drawerHeader.appendChild(drawerLogoutBtn)
        }
      }
    } else {
      drawerLogoutBtn.style.display = "inline-flex"
    }

    // 2. Mobile Drawer List Logout Item
    let drawerLogoutItem = document.getElementById("drawer-logout-item")
    if (!drawerLogoutItem) {
      const navList = document.querySelector(".main-nav ul")
      if (navList) {
        drawerLogoutItem = document.createElement("li")
        drawerLogoutItem.id = "drawer-logout-item"
        drawerLogoutItem.className = "drawer-logout-item"
        drawerLogoutItem.innerHTML = `
          <a href="#" class="drawer-logout-link" style="color: #ef4444 !important; font-weight: 600;">
            <i class="fas fa-sign-out-alt" style="color: #ef4444 !important;"></i> Logout
          </a>
        `
        drawerLogoutItem.querySelector("a").onclick = (e) => {
          e.preventDefault()
          logout()
        }
        navList.appendChild(drawerLogoutItem)
      }
    } else {
      drawerLogoutItem.style.display = "block"
    }

    // 3. Profile page logout button
    const profileHeader = document.querySelector(".profile-header")
    if (profileHeader && !document.getElementById("profile-logout-btn")) {
      const profileLogoutBtn = document.createElement("button")
      profileLogoutBtn.id = "profile-logout-btn"
      profileLogoutBtn.className = "profile-logout-btn"
      profileLogoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout'
      profileLogoutBtn.onclick = (e) => {
        e.preventDefault()
        logout()
      }
      profileHeader.appendChild(profileLogoutBtn)
    }
  } else {
    if (loginBtn) {
      loginBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`
      loginBtn.onclick = (e) => {
        e.preventDefault()
        openLoginModal()
      }
    }

    if (signupBtn) {
      signupBtn.innerHTML = `<i class="fas fa-user-plus"></i> Sign Up`
      signupBtn.className = "signup-btn"
      signupBtn.onclick = (e) => {
        e.preventDefault()
        openSignupModal()
      }
    }

    // Hide My Orders link if not logged in
    if (myOrdersLink) {
      myOrdersLink.style.display = "none"
    }

    // Update mobile drawer greeting for guest
    if (drawerUserName) drawerUserName.textContent = "Welcome, Guest"
    if (drawerUserStatus) drawerUserStatus.textContent = "Sign in to access your notes"
    if (bottomAccountLabel) bottomAccountLabel.textContent = "Login"

    // Hide mobile drawer logout buttons if logged out
    const drawerLogoutBtn = document.getElementById("drawer-logout-btn")
    if (drawerLogoutBtn) drawerLogoutBtn.style.display = "none"

    const drawerLogoutItem = document.getElementById("drawer-logout-item")
    if (drawerLogoutItem) drawerLogoutItem.style.display = "none"

    const profileLogoutBtn = document.getElementById("profile-logout-btn")
    if (profileLogoutBtn) profileLogoutBtn.remove()
  }

  // Add account section to desktop header if not already present
  const header = document.querySelector("header nav ul")
  if (header && !document.querySelector(".account-section")) {
    const accountSection = document.createElement("li")
    accountSection.className = "account-section nav-desktop-only"
    accountSection.innerHTML = `
      <a href="#" class="account-link">
        <i class="fas fa-user-circle"></i>
        <span>Account</span>
      </a>
    `

    // Insert before cart link
    const cartLink = document.querySelector(".cart-link")
    if (cartLink && cartLink.parentNode) {
      header.insertBefore(accountSection, cartLink.parentNode)
    } else {
      header.appendChild(accountSection)
    }

    // Add event listener to account link
    accountSection.querySelector(".account-link").addEventListener("click", (e) => {
      e.preventDefault()
      if (currentUser) {
        showUserMenu()
      } else {
        openLoginModal()
      }
    })
  }
}

// User menu functionality
function showUserMenu() {
  // Implementation for user dropdown menu
  const userMenu = document.getElementById("user-menu")
  if (userMenu) {
    userMenu.classList.toggle("show")
  } else {
    const menu = document.createElement("div")
    menu.id = "user-menu"
    menu.className = "user-menu flipkart-style"
    menu.innerHTML = `
      <div class="user-menu-header">
        <div class="user-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="user-info">
          <div class="user-name">${currentUser ? currentUser.name : "Guest"}</div>
          <div class="user-email">${currentUser ? currentUser.email : "Please login"}</div>
        </div>
      </div>
      <div class="user-menu-items">
        <div class="menu-section">
          <h4>My Account</h4>
          <a href="my-notes.html"><i class="fas fa-book"></i> My Notes</a>
          <a href="my-orders.html"><i class="fas fa-shopping-bag"></i> My Orders</a>
          <a href="downloads.html"><i class="fas fa-download"></i> Downloads</a>
          <a href="wishlist.html"><i class="fas fa-heart"></i> Wishlist</a>
          <a href="coupons.html"><i class="fas fa-tags"></i> Coupons</a>
          <a href="profile.html"><i class="fas fa-user-edit"></i> Edit Profile</a>
        </div>
        <div class="menu-section">
          <h4>Support & Policies</h4>
          <a href="help-center.html"><i class="fas fa-question-circle"></i> Help Center</a>
          <a href="privacy-policy.html"><i class="fas fa-shield-alt"></i> Privacy Center</a>
          <a href="reviews.html"><i class="fas fa-star"></i> Reviews</a>
          <a href="terms-of-service.html"><i class="fas fa-file-contract"></i> Terms</a>
          <a href="policies.html"><i class="fas fa-clipboard-list"></i> Policies</a>
          <a href="licenses.html"><i class="fas fa-certificate"></i> Licenses</a>
        </div>
        <div class="menu-section">
          <h4>Preferences</h4>
          <div class="language-selector">
            <i class="fas fa-globe"></i> Language:
            <select id="language-select">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="mr">Marathi</option>
              <option value="bn">Bengali</option>
              <option value="gu">Gujarati</option>
              <option value="kn">Kannada</option>
              <option value="ml">Malayalam</option>
              <option value="pa">Punjabi</option>
            </select>
          </div>
          ${
            currentUser
              ? `<a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>`
              : `<a href="#" id="login-redirect-btn"><i class="fas fa-sign-in-alt"></i> Login</a>`
          }
        </div>
      </div>
    `

    document.body.appendChild(menu)

    // Position the menu
    const accountLink = document.querySelector(".account-link")
    if (accountLink) {
      const rect = accountLink.getBoundingClientRect()
      menu.style.top = `${rect.bottom + window.scrollY}px`
      menu.style.right = `20px`
    } else {
      const loginBtn = document.getElementById("login-btn")
      if (loginBtn) {
        const rect = loginBtn.getBoundingClientRect()
        menu.style.top = `${rect.bottom + window.scrollY}px`
        menu.style.right = `20px`
      }
    }

    // Add event listener to logout button
    const logoutBtn = document.getElementById("logout-btn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout)
    }

    // Add event listener to login redirect button
    const loginRedirectBtn = document.getElementById("login-redirect-btn")
    if (loginRedirectBtn) {
      loginRedirectBtn.addEventListener("click", openLoginModal)
    }

    // Add event listener to language selector
    const languageSelect = document.getElementById("language-select")
    if (languageSelect) {
      languageSelect.addEventListener("change", function () {
        // In a real app, this would change the site language
        localStorage.setItem("preferredLanguage", this.value)
        alert(`Language changed to ${this.options[this.selectedIndex].text}`)
      })

      // Set current language if stored
      const storedLanguage = localStorage.getItem("preferredLanguage")
      if (storedLanguage) {
        languageSelect.value = storedLanguage
      }
    }

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#user-menu") && !e.target.closest(".account-link") && !e.target.closest("#login-btn")) {
        const menu = document.getElementById("user-menu")
        if (menu) {
          menu.remove()
        }
      }
    })
  }
}

// Logout functionality
function logout() {
  localStorage.removeItem("currentUser")
  currentUser = null
  updateUIForUser()

  // Remove user menu if it exists
  const userMenu = document.getElementById("user-menu")
  if (userMenu) {
    userMenu.remove()
  }

  // Show logout message
  const successMessage = document.createElement("div")
  successMessage.className = "success-message"
  successMessage.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>You have been logged out successfully!</span>
  `
  document.body.appendChild(successMessage)

  setTimeout(() => {
    successMessage.classList.add("show")
    setTimeout(() => {
      successMessage.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(successMessage)
      }, 300)
    }, 2000)
  }, 100)

  // Redirect to home if on a protected page
  const currentPage = window.location.pathname.split("/").pop()
  if (
    currentPage === "my-notes.html" ||
    currentPage === "note-viewer.html" ||
    currentPage === "my-orders.html" ||
    // currentPage === "subscription.html"
    false
  ) {
    window.location.href = "index.html"
  }
}

// Enhanced renderNotes function to support semester filtering and global search
// Also fetches notes from the backend API (MongoDB)
let apiNotes = [] // Cache API-fetched notes
let apiNotesFetched = false

async function fetchApiNotes() {
  if (apiNotesFetched) return
  try {
    const response = await fetch(`${API_BASE_URL}/api/notes`)
    const data = await response.json()
    if (data.success && data.data) {
      // Map API notes to the same format as notesData, using _id as id
      apiNotes = data.data.map(note => ({
        id: note._id,
        title: note.title,
        subject: note.subject,
        price: note.price,
        image: note.image || 'images/Digital Notes.jpeg',
        description: note.description,
        pdfUrl: note.pdfUrl || '',
        pages: note.pages || 0,
        chapters: note.chapters || [],
        semester: note.semester || '1',
        isHandwritten: note.isHandwritten || false,
        isFromApi: true,
      }))
      apiNotesFetched = true
      console.log(`📚 Fetched ${apiNotes.length} notes from API`)
    }
  } catch (error) {
    console.warn('Could not fetch notes from API:', error.message)
  }
}

function renderNotes() {
  const notesContainer = document.getElementById("notes-container")
  if (notesContainer) {
    notesContainer.innerHTML = ""

    const subjectFilter = document.getElementById("subject-filter")
    const sortFilter = document.getElementById("sort-filter")
    const semesterTabs = document.querySelectorAll(".semester-tab")
    const globalSearchInput = document.getElementById("global-search-input")

    let currentSemester = "1" // Default semester

    // Get current active semester tab
    if (semesterTabs.length > 0) {
      const activeTab = document.querySelector(".semester-tab.active")
      if (activeTab) {
        currentSemester = activeTab.getAttribute("data-semester")
      }

      // Add click event to semester tabs
      semesterTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
          semesterTabs.forEach((t) => t.classList.remove("active"))
          this.classList.add("active")
          currentSemester = this.getAttribute("data-semester")
          renderNotes()
        })
      })
    }

    // Merge hardcoded notes + API notes + user-uploaded notes
    let filteredNotes = [...notesData]

    // Add API notes (from MongoDB — includes handwritten notes)
    if (apiNotes.length > 0) {
      filteredNotes = [...filteredNotes, ...apiNotes]
    }

    // Add user uploaded notes to the filtered notes
    if (userNotes && userNotes.length > 0) {
      filteredNotes = [...filteredNotes, ...userNotes]
    }

    // Apply global search filter if there's a search term
    if (globalSearchInput && globalSearchInput.value.trim() !== "") {
      const searchTerm = globalSearchInput.value.toLowerCase().trim()
      filteredNotes = filteredNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm) ||
          note.subject.toLowerCase().includes(searchTerm) ||
          note.description.toLowerCase().includes(searchTerm),
      )
    }

    // Apply subject filter if selected and not "all"
    if (subjectFilter && subjectFilter.value !== "all") {
      filteredNotes = filteredNotes.filter((note) => note.subject === subjectFilter.value)
    }

    // Apply semester filter if on semester view
    if (currentSemester) {
      // Filter notes by semester (assume notes have semester property)
      filteredNotes = filteredNotes.filter((note) => {
        // If note doesn't have semester property, assign it to semester 1 by default
        if (!note.semester) {
          note.semester = "1"
        }
        return note.semester === currentSemester
      })
    }

    // Apply sorting if selected
    if (sortFilter) {
      switch (sortFilter.value) {
        case "price-low":
          filteredNotes.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filteredNotes.sort((a, b) => b.price - a.price)
          break
        case "newest":
          // For demo purposes, we'll just reverse the array
          filteredNotes.reverse()
          break
        // 'popular' is default, no sorting needed
      }
    }

    if (filteredNotes.length === 0) {
      notesContainer.innerHTML = `
        <div class="empty-notes-message">
          <i class="fas fa-search"></i>
          <h3>No notes found</h3>
          <p>Try different search terms or filters</p>
        </div>
      `
      return
    }

    filteredNotes.forEach((note) => {
      const isPurchased = purchasedNotes.some((purchased) => purchased.id === note.id || String(purchased.id) === String(note.id))
      const noteImage = note.image || 'images/Digital Notes.jpeg'
      const noteCard = document.createElement("div")
      noteCard.className = "note-card"

      noteCard.innerHTML = `
        <div class="note-image">
          <img src="${noteImage}" alt="${note.title}" onerror="this.src='images/Digital Notes.jpeg'">
          ${note.isHandwritten ? '<span style="position:absolute;top:8px;left:8px;background:#fbbf24;color:#000;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">✍ Handwritten</span>' : ''}
          <button class="wishlist-btn" data-id="${note.id}"><i class="far fa-heart"></i></button>
        </div>
        <div class="note-card-content">
          <h3>${note.title}</h3>
          <div class="note-card-subject">Subject: ${note.subject}</div>
          <div class="note-card-description">${note.description}</div>
          <div class="note-card-footer">
            <div class="note-card-price">₹${note.price}</div>
            ${
              isPurchased
                ? `<a href="note-viewer.html?id=${note.id}" class="btn">Read Now</a>`
                : `<button class="btn add-to-cart" data-id="${note.id}">Add to Cart</button>`
            }
          </div>
        </div>
      `
      notesContainer.appendChild(noteCard)
    })

    const addToCartButtons = document.querySelectorAll(".add-to-cart")
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", addToCart)
    })

    // Setup wishlist buttons
    const wishlistButtons = document.querySelectorAll(".wishlist-btn")
    wishlistButtons.forEach((button) => {
      const noteId = Number.parseInt(button.getAttribute("data-id"))
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

      // Check if already in wishlist
      if (wishlist.some((item) => item.id === noteId)) {
        button.innerHTML = '<i class="fas fa-heart"></i>'
        button.classList.add("active")
      }

      button.addEventListener("click", function (e) {
        e.preventDefault()
        toggleWishlist(noteId, this)
      })
    })

    // Add event listeners for filters
    if (subjectFilter) {
      subjectFilter.addEventListener("change", renderNotes)
    }

    if (sortFilter) {
      sortFilter.addEventListener("change", renderNotes)
    }
  }
}

// Add event listener for global search form
document.addEventListener("DOMContentLoaded", () => {
  const globalSearchForm = document.getElementById("global-search-form")
  const globalSearchInput = document.getElementById("global-search-input")

  if (globalSearchForm) {
    globalSearchForm.addEventListener("submit", (e) => {
      e.preventDefault()
      renderNotes()

      // Scroll to notes section
      const notesSection = document.getElementById("notes")
      if (notesSection) {
        notesSection.scrollIntoView({ behavior: "smooth" })
      }
    })
  }

  if (globalSearchInput) {
    globalSearchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        renderNotes()

        // Scroll to notes section
        const notesSection = document.getElementById("notes")
        if (notesSection) {
          notesSection.scrollIntoView({ behavior: "smooth" })
        }
      }
    })
  }
})

// Toggle wishlist function
function toggleWishlist(noteId, button) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
  const note = [...notesData, ...userNotes].find((note) => note.id === noteId)

  if (!note) return

  // Check if already in wishlist
  const index = wishlist.findIndex((item) => item.id === noteId)

  if (index === -1) {
    // Add to wishlist
    wishlist.push(note)
    button.innerHTML = '<i class="fas fa-heart"></i>'
    button.classList.add("active")

    // Show success message
    const successMessage = document.createElement("div")
    successMessage.className = "success-message"
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${note.title} added to wishlist!</span>
    `
    document.body.appendChild(successMessage)

    setTimeout(() => {
      successMessage.classList.add("show")
      setTimeout(() => {
        successMessage.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(successMessage)
        }, 300)
      }, 2000)
    }, 100)
  } else {
    // Remove from wishlist
    wishlist.splice(index, 1)
    button.innerHTML = '<i class="far fa-heart"></i>'
    button.classList.remove("active")

    // Show success message
    const successMessage = document.createElement("div")
    successMessage.className = "success-message"
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>Removed from wishlist!</span>
    `
    document.body.appendChild(successMessage)

    setTimeout(() => {
      successMessage.classList.add("show")
      setTimeout(() => {
        successMessage.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(successMessage)
        }, 300)
      }, 2000)
    }, 100)
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist))
}

// Add to cart functionality
function addToCart(event) {
  const rawId = event.target.getAttribute("data-id")
  const numericId = Number.parseInt(rawId)
  // Search in all note sources: hardcoded + API + userNotes
  const allNotes = [...notesData, ...apiNotes, ...userNotes]
  const note = allNotes.find((note) => note.id === numericId || String(note.id) === rawId)

  if (note) {
    // Ensure the note has a valid image for display in cart
    const cartNote = { ...note, image: note.image || 'images/Digital Notes.jpeg' }
    // Check if already in cart
    if (!cart.some((item) => String(item.id) === String(cartNote.id))) {
      cart.push(cartNote)
      updateCartCount()
      localStorage.setItem("cart", JSON.stringify(cart))

      // Show success message
      const successMessage = document.createElement("div")
      successMessage.className = "success-message"
      successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${note.title} added to cart!</span>
      `
      document.body.appendChild(successMessage)

      setTimeout(() => {
        successMessage.classList.add("show")
        setTimeout(() => {
          successMessage.classList.remove("show")
          setTimeout(() => {
            document.body.removeChild(successMessage)
          }, 300)
        }, 2000)
      }, 100)
    } else {
      alert("This note is already in your cart!")
    }
  }
}

// Update cart count in all locations (desktop header, mobile header, bottom nav)
function updateCartCount() {
  const count = cart ? cart.length : 0
  const cartCountElements = document.querySelectorAll(".cart-count, #cart-count, #cart-count-header, .cart-badge")
  cartCountElements.forEach((el) => {
    el.textContent = count
  })

  const priceItemCount = document.getElementById("price-item-count")
  if (priceItemCount) {
    priceItemCount.textContent = count
  }
}

// Calculate discount amount
function calculateDiscountAmount(total) {
  if (!appliedDiscount) return 0

  // Check if the discount is applicable
  const discount = discounts[appliedDiscount]
  if (!discount || !discount.isValid) return 0

  // Check minimum items requirement if applicable
  if (discount.minimumItems && cart.length < discount.minimumItems) return 0

  // Calculate discount amount
  return Math.round((total * discount.percentage) / 100)
}

// Render cart page
function renderCart() {
  const cartItems = document.getElementById("cart-items")
  const cartTotal = document.getElementById("cart-total")
  const priceTotal = document.getElementById("price-total")
  const gstAmount = document.getElementById("gst-amount")
  const discountAmount = document.getElementById("discount-amount")
  const totalSavings = document.getElementById("total-savings")
  const paymentAmount = document.getElementById("payment-amount")

  // Add Flipkart-style classes
  if (cartItems) {
    cartItems.classList.add("flipkart-style-cart")
  }

  if (cartItems && cartTotal) {
    cartItems.innerHTML = ""

    let total = 0

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <img src="https://fkjxfhgvvbdqpgxhqtxc.supabase.co/storage/v1/object/public/images/empty-cart.png" alt="Empty Cart">
          <h3>Your cart is empty!</h3>
          <p>Looks like you haven't added any notes to your cart yet.</p>
          <a href="index.html" class="btn">Shop Now</a>
        </div>
      `

      // Reset discount if cart is empty
      appliedDiscount = null
      localStorage.setItem("appliedDiscount", null)
    } else {
      cart.forEach((item, index) => {
        const itemImage = item.image || 'images/Digital Notes.jpeg'
        const cartItem = document.createElement("div")
        cartItem.className = "cart-item flipkart-style"
        cartItem.innerHTML = `
    <div class="cart-item-left">
      <img src="${itemImage}" alt="${item.title}" class="cart-item-image" onerror="this.src='images/Digital Notes.jpeg'">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-subject">Subject: ${item.subject}</div>
        <div class="cart-item-pages">${item.pages} pages</div>
        <div class="cart-item-delivery">
          <span class="delivery-date">Delivery by ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
          <span class="delivery-free">Free</span>
        </div>
      </div>
    </div>
    <div class="cart-item-right">
      <div class="cart-item-price">₹${item.price}</div>
      <div class="cart-item-actions">
        <button class="save-for-later" data-index="${index}">Save for later</button>
        <button class="remove-from-cart" data-index="${index}">Remove</button>
      </div>
    </div>
  `
        cartItems.appendChild(cartItem)
        total += item.price
      })
    }

    // Calculate discount if any
    const discount = calculateDiscountAmount(total)

    // Calculate GST (18%)
    const gst = Math.round((total - discount) * 0.18)
    const finalTotal = total - discount + gst

    if (discountAmount) {
      discountAmount.textContent = discount > 0 ? `-₹${discount}` : "₹0"
    }

    if (totalSavings) {
      totalSavings.textContent = `₹${discount}`
    }

    if (gstAmount) {
      gstAmount.textContent = `₹${gst}`
    }

    if (cartTotal) {
      cartTotal.textContent = `₹${finalTotal}`
    }

    if (priceTotal) {
      priceTotal.textContent = `₹${total}`
    }

    if (paymentAmount) {
      paymentAmount.textContent = `₹${finalTotal}`
    }

    const removeButtons = document.querySelectorAll(".remove-from-cart")
    removeButtons.forEach((button) => {
      button.addEventListener("click", removeFromCart)
    })

    const saveForLaterButtons = document.querySelectorAll(".save-for-later")
    saveForLaterButtons.forEach((button) => {
      button.addEventListener("click", saveForLater)
    })
  }

  // Set up coupon code functionality
  setupCouponCode()
}

// Save for later functionality
function saveForLater(event) {
  const index = Number.parseInt(event.target.getAttribute("data-index"))
  const item = cart[index]

  // Get wishlist from localStorage or initialize empty array
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  // Add to wishlist if not already there
  if (!wishlist.some((wishItem) => wishItem.id === item.id)) {
    wishlist.push(item)
    localStorage.setItem("wishlist", JSON.stringify(wishlist))

    // Remove from cart
    cart.splice(index, 1)
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()

    // Show success message
    const successMessage = document.createElement("div")
    successMessage.className = "success-message"
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${item.title} saved for later!</span>
    `
    document.body.appendChild(successMessage)

    setTimeout(() => {
      successMessage.classList.add("show")
      setTimeout(() => {
        successMessage.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(successMessage)
        }, 300)
      }, 2000)
    }, 100)

    // Re-render cart
    renderCart()
  } else {
    alert("This item is already in your wishlist!")
  }
}

// Setup coupon code functionality
function setupCouponCode() {
  const applyButton = document.getElementById("apply-coupon-btn")
  if (applyButton) {
    applyButton.addEventListener("click", () => {
      const couponInput = document.getElementById("coupon-code")
      const couponCode = couponInput.value.trim().toUpperCase()

      if (!couponCode) {
        alert("Please enter a coupon code")
        return
      }

      if (!discounts[couponCode]) {
        alert("Invalid coupon code")
        return
      }

      const discount = discounts[couponCode]

      if (!discount.isValid) {
        alert("This coupon code is no longer valid")
        return
      }

      if (discount.minimumItems && cart.length < discount.minimumItems) {
        alert(`This coupon requires a minimum of ${discount.minimumItems} items in your cart`)
        return
      }

      // Apply the discount
      appliedDiscount = couponCode
      localStorage.setItem("appliedDiscount", JSON.stringify(couponCode))

      alert(`Coupon ${couponCode} applied! ${discount.description}`)

      // Re-render the cart to update prices
      renderCart()
    })
  }
}

// Remove from cart functionality
function removeFromCart(event) {
  const index = Number.parseInt(event.target.getAttribute("data-index"))
  cart.splice(index, 1)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  renderCart()
}

// Render My Notes page
function renderMyNotes() {
  const myNotesContainer = document.getElementById("my-notes-container")
  if (myNotesContainer) {
    // Check if user is logged in
    if (!currentUser) {
      myNotesContainer.innerHTML = `
        <div class="empty-notes-message">
          <i class="fas fa-lock"></i>
          <h3>Please login to view your notes</h3>
          <p>You need to be logged in to access your purchased notes</p>
          <button id="login-redirect-btn" class="btn">Login</button>
        </div>
      `

      const loginRedirectBtn = document.getElementById("login-redirect-btn")
      if (loginRedirectBtn) {
        loginRedirectBtn.addEventListener("click", openLoginModal)
      }
      return
    }

    if (purchasedNotes.length === 0) {
      myNotesContainer.innerHTML = `
        <div class="empty-notes-message">
          <i class="fas fa-book-open"></i>
          <h3>No notes purchased yet</h3>
          <p>Explore our collection and purchase notes to see them here</p>
          <a href="index.html" class="btn">Browse Notes</a>
        </div>
      `
    } else {
      myNotesContainer.innerHTML = ""

      // Get active tab
      const activeTab = document.querySelector(".tab-btn.active")?.getAttribute("data-tab") || "all"
      let filteredNotes = [...purchasedNotes]

      // Filter based on tab
      switch (activeTab) {
        case "recent":
          // For demo, just show the last 3 purchased
          filteredNotes = filteredNotes.slice(-3)
          break
        case "downloaded":
          // Filter notes that have been downloaded
          filteredNotes = filteredNotes.filter((note) => {
            return downloadsList.some((download) => download.id === note.id)
          })
          break
        case "bookmarked":
          // Filter bookmarked notes
          filteredNotes = filteredNotes.filter((note) => {
            return bookmarks.includes(note.id)
          })
          break
        case "expiring":
          // Filter notes that will expire in the next 30 days
          filteredNotes = filteredNotes.filter((note) => {
            const download = downloadsList.find((dl) => dl.id === note.id)
            if (!download || !download.purchaseDate) return false

            const purchaseDate = new Date(download.purchaseDate)
            const expiryDate = new Date(purchaseDate)
            expiryDate.setFullYear(expiryDate.getFullYear() + 1) // 1 year validity

            const today = new Date()
            const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))

            return daysToExpiry <= 30 && daysToExpiry > 0
          })
          break
        // 'all' is default, no filtering needed
      }

      // Apply search filter if any
      const searchInput = document.getElementById("search-notes")
      if (searchInput && searchInput.value.trim() !== "") {
        const searchTerm = searchInput.value.toLowerCase().trim()
        filteredNotes = filteredNotes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.subject.toLowerCase().includes(searchTerm) ||
            note.description.toLowerCase().includes(searchTerm),
        )
      }

      if (filteredNotes.length === 0) {
        myNotesContainer.innerHTML = `
          <div class="empty-notes-message">
            <i class="fas fa-search"></i>
            <h3>No notes found</h3>
            <p>Try a different search term or filter</p>
          </div>
        `
        return
      }

      filteredNotes.forEach((note) => {
        const download = downloadsList.find((dl) => dl.id === note.id)
        const isBookmarked = bookmarks.includes(note.id)

        // Calculate expiry date if purchased
        let expiryDateText = ""
        let purchaseDateText = ""
        
        // Use note.purchaseDate or fallback to download.purchaseDate, or default to a safe past date if missing
        const rawDate = note.purchaseDate || (download && download.purchaseDate) || new Date().toISOString()

        if (rawDate) {
          const purchaseDate = new Date(rawDate)
          const expiryDate = new Date(purchaseDate)
          expiryDate.setMonth(expiryDate.getMonth() + 6) // 6 months validity

          purchaseDateText = `<div class="note-purchase-date">Purchased on: ${purchaseDate.toLocaleDateString()}</div>`

          const today = new Date()
          const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))

          if (daysToExpiry <= 30 && daysToExpiry > 0) {
            expiryDateText = `<div class="note-expiry warning" style="color: #fbbf24;">Expires in ${daysToExpiry} days (${expiryDate.toLocaleDateString()})</div>`
          } else if (daysToExpiry <= 0) {
            expiryDateText = `<div class="note-expiry" style="color: #ef4444;">Expired on: ${expiryDate.toLocaleDateString()}</div>`
          } else {
            expiryDateText = `<div class="note-expiry">Valid until: ${expiryDate.toLocaleDateString()}</div>`
          }
        }

        const noteCard = document.createElement("div")
        noteCard.className = "note-card"
        noteCard.innerHTML = `
          <div class="protected-content">
            <img src="${note.image}" alt="${note.title}">
          </div>
          <div class="note-card-content">
            <h3>${note.title}</h3>
            <div class="note-card-subject">Subject: ${note.subject}</div>
            ${purchaseDateText}
            ${expiryDateText}
            <div class="note-card-description">${note.description}</div>
            <div class="note-card-footer">
              <div class="note-card-pages">${note.pages} pages</div>
              <div class="note-actions">
                ${
                  (rawDate && (new Date(rawDate).setMonth(new Date(rawDate).getMonth() + 6) < new Date().getTime()))
                  ? `<button class="btn" style="background-color: #6c757d; cursor: not-allowed;" title="Subscription Expired">Expired</button>`
                  : `<a href="note-viewer.html?id=${note.id}" class="btn">Read</a>`
                }
                ${
                  download
                    ? `<button class="btn delete-download-btn" style="background-color: #dc3545;" data-id="${note.id}">
                      <i class="fas fa-trash"></i> Delete
                    </button>`
                    : `<button class="btn download-note-btn" style="background-color: #28a745;" data-id="${note.id}">
                      <i class="fas fa-download"></i> Download
                    </button>`
                }
                <button class="btn bookmark-btn" style="background-color: ${isBookmarked ? "#ffc107" : "#6c757d"};" data-id="${note.id}" title="Bookmark">
                  <i class="fas fa-bookmark"></i>
                </button>
                <button class="btn remove-library-btn" style="background-color: #ef4444;" data-id="${note.id}" title="Remove from Library">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        `
        myNotesContainer.appendChild(noteCard)
      })

      // Add event listeners for download, delete, and bookmark buttons
      const downloadBtns = document.querySelectorAll(".download-note-btn")
      downloadBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const rawId = this.getAttribute("data-id")
          const noteId = Number.parseInt(rawId)
          const note = purchasedNotes.find((note) => note.id === noteId || String(note.id) === rawId)
          if (note) downloadNote(note)
        })
      })

      const deleteBtns = document.querySelectorAll(".delete-download-btn")
      deleteBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const rawId = this.getAttribute("data-id")
          const noteId = Number.parseInt(rawId)
          deleteDownload(isNaN(noteId) ? rawId : noteId)
        })
      })

      const bookmarkBtns = document.querySelectorAll(".bookmark-btn")
      bookmarkBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const rawId = this.getAttribute("data-id")
          const noteId = Number.parseInt(rawId)
          toggleBookmark(isNaN(noteId) ? rawId : noteId)
        })
      })
      const removeBtns = document.querySelectorAll(".remove-library-btn")
      removeBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const rawId = this.getAttribute("data-id")
          const noteId = Number.parseInt(rawId)
          removeLibraryNote(isNaN(noteId) ? rawId : noteId)
        })
      })
    }
  }
}

// Remove note from library permanently
async function removeLibraryNote(noteId) {
  if (!confirm("Are you sure you want to permanently remove this note from your library? You will need to purchase it again to regain access.")) {
    return;
  }

  const token = localStorage.getItem("token")
  if (!token) return

  try {
    const res = await fetch(`/api/auth/purchased/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    const data = await res.json()
    if (res.ok && data.success) {
      alert("Note removed from library successfully");
      // Remove from frontend state
      purchasedNotes = purchasedNotes.filter(n => String(n.id) !== String(noteId));
      renderMyNotes();
    } else {
      alert(data.message || "Failed to remove note");
    }
  } catch (error) {
    console.error("Error removing note:", error);
    alert("Network error while removing note");
  }
}

// Setup tab buttons in My Notes page
function setupTabButtons() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  if (tabButtons.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        tabButtons.forEach((btn) => btn.classList.remove("active"))

        // Add active class to clicked button
        button.classList.add("active")

        // Re-render notes based on selected tab
        renderMyNotes()
      })
    })
  }
}

// Setup search functionality in My Notes page
function setupSearchNotes() {
  const searchInput = document.getElementById("search-notes")
  const searchBtn = document.querySelector(".search-btn")

  if (searchInput && searchBtn) {
    searchBtn.addEventListener("click", () => {
      renderMyNotes()
    })

    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        renderMyNotes()
      }
    })
  }
}

// Download note functionality
function downloadNote(note) {
  if (!currentUser) {
    alert("Please login to access notes")
    openLoginModal()
    return
  }

  // Check if already in downloads list
  if (downloadsList.some((download) => download.id === note.id)) {
    alert("This note is already in your downloads")
    return
  }

  // Add to downloads list with purchase date
  const download = {
    id: note.id,
    title: note.title,
    purchaseDate: new Date().toISOString(),
    downloadDate: new Date().toISOString(),
  }

  downloadsList.push(download)
  localStorage.setItem("downloads", JSON.stringify(downloadsList))

  // Show success message
  const successMessage = document.createElement("div")
  successMessage.className = "success-message"
  successMessage.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${note.title} added to your downloads! Access it anytime on our site.</span>
  `
  document.body.appendChild(successMessage)

  setTimeout(() => {
    successMessage.classList.add("show")
    setTimeout(() => {
      successMessage.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(successMessage)
      }, 300)
    }, 2000)
  }, 100)

  // Re-render notes to update UI
  renderMyNotes()
}

// Delete download functionality
function deleteDownload(noteId) {
  if (confirm("Are you sure you want to delete this download? You can download it again later.")) {
    const index = downloadsList.findIndex((download) => download.id === noteId)
    if (index !== -1) {
      downloadsList.splice(index, 1)
      localStorage.setItem("downloads", JSON.stringify(downloadsList))

      // Show success message
      const successMessage = document.createElement("div")
      successMessage.className = "success-message"
      successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Download deleted successfully!</span>
      `
      document.body.appendChild(successMessage)

      setTimeout(() => {
        successMessage.classList.add("show")
        setTimeout(() => {
          successMessage.classList.remove("show")
          setTimeout(() => {
            document.body.removeChild(successMessage)
          }, 300)
        }, 2000)
      }, 100)

      // Re-render notes to update UI
      renderMyNotes()
    }
  }
}

// Toggle bookmark functionality
function toggleBookmark(noteId) {
  const index = bookmarks.indexOf(noteId)

  if (index === -1) {
    // Add bookmark
    bookmarks.push(noteId)
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
  } else {
    // Remove bookmark
    bookmarks.splice(index, 1)
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
  }

  // Re-render notes to update UI
  renderMyNotes()
}

// Setup downloads manager
function setupDownloadsManager() {
  const manageDownloadsBtn = document.getElementById("manage-downloads-btn")
  const downloadsModal = document.getElementById("downloads-modal")
  const closeBtn = downloadsModal?.querySelector(".close")
  const deleteSelectedBtn = document.getElementById("delete-selected")
  const deleteAllBtn = document.getElementById("delete-all")

  if (manageDownloadsBtn && downloadsModal) {
    manageDownloadsBtn.addEventListener("click", () => {
      // Populate downloads list
      const downloadList = document.getElementById("download-list")
      if (downloadList) {
        downloadList.innerHTML = ""

        if (downloadsList.length === 0) {
          downloadList.innerHTML = `
            <div class="empty-downloads">
              <p>You haven't downloaded any notes yet.</p>
            </div>
          `
        } else {
          downloadsList.forEach((download) => {
            const downloadItem = document.createElement("div")
            downloadItem.className = "download-item"

            const downloadDate = new Date(download.downloadDate)

            downloadItem.innerHTML = `
              <input type="checkbox" class="download-checkbox" data-id="${download.id}">
              <div class="download-info">
                <div class="download-title">${download.title}</div>
                <div class="download-date">Downloaded on: ${downloadDate.toLocaleDateString()}</div>
              </div>
              <button class="delete-download" data-id="${download.id}"><i class="fas fa-trash"></i></button>
            `

            downloadList.appendChild(downloadItem)
          })

          // Add event listeners to delete buttons
          const deleteButtons = downloadList.querySelectorAll(".delete-download")
          deleteButtons.forEach((btn) => {
            btn.addEventListener("click", function () {
              const noteId = Number.parseInt(this.getAttribute("data-id"))
              deleteDownload(noteId)
              // Close and reopen modal to refresh
              downloadsModal.style.display = "none"
              setTimeout(() => {
                manageDownloadsBtn.click()
              }, 100)
            })
          })
        }
      }

      downloadsModal.style.display = "block"
    })

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        downloadsModal.style.display = "none"
      })
    }

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === downloadsModal) {
        downloadsModal.style.display = "none"
      }
    })

    // Delete selected downloads
    if (deleteSelectedBtn) {
      deleteSelectedBtn.addEventListener("click", () => {
        const selectedCheckboxes = document.querySelectorAll(".download-checkbox:checked")
        if (selectedCheckboxes.length === 0) {
          alert("Please select at least one download to delete.")
          return
        }

        if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected download(s)?`)) {
          selectedCheckboxes.forEach((checkbox) => {
            const noteId = Number.parseInt(checkbox.getAttribute("data-id"))
            const index = downloadsList.findIndex((download) => download.id === noteId)
            if (index !== -1) {
              downloadsList.splice(index, 1)
            }
          })

          localStorage.setItem("downloads", JSON.stringify(downloadsList))

          // Show success message
          const successMessage = document.createElement("div")
          successMessage.className = "success-message"
          successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Selected downloads deleted successfully!</span>
          `
          document.body.appendChild(successMessage)

          setTimeout(() => {
            successMessage.classList.add("show")
            setTimeout(() => {
              successMessage.classList.remove("show")
              setTimeout(() => {
                document.body.removeChild(successMessage)
              }, 300)
            }, 2000)
          }, 100)

          // Close modal and re-render notes
          downloadsModal.style.display = "none"
          renderMyNotes()
        }
      })
    }

    // Delete all downloads
    if (deleteAllBtn) {
      deleteAllBtn.addEventListener("click", () => {
        if (downloadsList.length === 0) {
          alert("You don't have any downloads to delete.")
          return
        }

        if (confirm("Are you sure you want to delete all downloads? This action cannot be undone.")) {
          downloadsList = []
          localStorage.setItem("downloads", JSON.stringify(downloadsList))

          // Show success message
          const successMessage = document.createElement("div")
          successMessage.className = "success-message"
          successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>All downloads deleted successfully!</span>
          `
          document.body.appendChild(successMessage)

          setTimeout(() => {
            successMessage.classList.add("show")
            setTimeout(() => {
              successMessage.classList.remove("show")
              setTimeout(() => {
                document.body.removeChild(successMessage)
              }, 300)
            }, 2000)
          }, 100)

          // Close modal and re-render notes
          downloadsModal.style.display = "none"
          renderMyNotes()
        }
      })
    }
  }
}

// Setup upload notes functionality
function setupUploadNotes() {
  const uploadForm = document.getElementById("upload-form")
  const fileInput = document.getElementById("note-file")
  const previewContainer = document.getElementById("upload-preview")

  if (uploadForm && fileInput) {
    // Show file preview when selected
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0]

        // Check if file is PDF
        if (file.type !== "application/pdf") {
          alert("Please upload a PDF file.")
          fileInput.value = ""
          return
        }

        // Show preview
        previewContainer.innerHTML = `
          <div class="preview-item">
            <i class="fas fa-file-pdf"></i>
            <div class="preview-item-details">
              <div class="preview-item-name">${file.name}</div>
              <div class="preview-item-size">${(file.size / (1024 * 1024)).toFixed(2)} MB</div>
            </div>
            <button type="button" class="preview-item-remove"><i class="fas fa-times"></i></button>
          </div>
        `
        previewContainer.classList.add("show")

        // Add event listener to remove button
        const removeBtn = previewContainer.querySelector(".preview-item-remove")
        if (removeBtn) {
          removeBtn.addEventListener("click", () => {
            fileInput.value = ""
            previewContainer.innerHTML = ""
            previewContainer.classList.remove("show")
          })
        }
      }
    })

    // Handle form submission
    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault()

      if (!currentUser) {
        alert("Please login to upload notes.")
        openLoginModal()
        return
      }

      const title = document.getElementById("note-title").value
      const subject = document.getElementById("note-subject").value
      const price = Number.parseInt(document.getElementById("note-price").value)
      const description = document.getElementById("note-description").value

      if (!title || !subject || !price || !description || !fileInput.files[0]) {
        alert("Please fill in all fields and upload a PDF file.")
        return
      }

      // For demo purposes, we'll create a mock upload
      // In a real application, you would upload the file to a server

      // Generate a unique ID for the note
      const newId = Date.now()

      // Create a new note object
      const newNote = {
        id: newId,
        title: title,
        subject: subject,
        price: price,
        description: description,
        image: "https://fkjxfhgvvbdqpgxhqtxc.supabase.co/storage/v1/object/public/images/user-uploaded.jpg",
        pdfUrl: URL.createObjectURL(fileInput.files[0]), // This is temporary and will not persist after page reload
        pages: Math.floor(Math.random() * 50) + 20, // Random page count for demo
        uploadedBy: currentUser.email,
        uploadDate: new Date().toISOString(),
        isUserUploaded: true,
        chapters: [
          { title: "Chapter 1", pages: "1-10" },
          { title: "Chapter 2", pages: "11-20" },
        ],
      }

      // Add to user notes
      userNotes.push(newNote)
      localStorage.setItem("userNotes", JSON.stringify(userNotes))

      // Show success message
      const successMessage = document.createElement("div")
      successMessage.className = "success-message"
      successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Note uploaded successfully!</span>
      `
      document.body.appendChild(successMessage)

      setTimeout(() => {
        successMessage.classList.add("show")
        setTimeout(() => {
          successMessage.classList.remove("show")
          setTimeout(() => {
            document.body.removeChild(successMessage)
          }, 300)
        }, 2000)
      }, 100)

      // Reset form
      uploadForm.reset()
      previewContainer.innerHTML = ""
      previewContainer.classList.remove("show")

      // Add to purchased notes so user can access it
      purchasedNotes.push(newNote)
      localStorage.setItem("purchasedNotes", JSON.stringify(purchasedNotes))

      // Re-render notes
      renderMyNotes()
    })
  }
}

// Render note viewer page
function renderNoteViewer() {
  const urlParams = new URLSearchParams(window.location.search)
  const rawId = urlParams.get("id")
  const noteId = Number.parseInt(rawId)

  if (!rawId) {
    window.location.href = "index.html"
    return
  }

  // Find the note in all available notes (including user uploaded)
  const allNotes = [...notesData, ...apiNotes, ...userNotes]
  const note = allNotes.find((note) => note.id === noteId || String(note.id) === rawId)
  
  if (!note) {
    alert("Note not found")
    window.location.href = "index.html"
    return
  }

  // Check if user has purchased this note
  // In a real app, this would be a server-side check. 
  // For uploaded handwritten notes (which might be free/owned by user) or purchased notes
  const isPurchased = purchasedNotes.some((pn) => pn.id === noteId || String(pn.id) === rawId)
  
  // If it's a user's own uploaded handwritten note, they should be able to view it without purchasing
  const isOwnNote = userNotes.some((un) => un.id === noteId || String(un.id) === rawId)
  const isFromApi = apiNotes.some((an) => an.id === noteId || String(an.id) === rawId)
  
  // If it's not purchased, not an owned note, and not an API note that we allow them to view...
  if (!isPurchased && !isOwnNote && !isFromApi) {
    alert("You need to purchase this note to view it")
    window.location.href = "index.html"
    return
  }

  // Check if subscription has expired (for purchased notes)
  if (isPurchased && !isOwnNote) {
    const purchasedNoteData = purchasedNotes.find((pn) => pn.id === noteId || String(pn.id) === rawId);
    if (purchasedNoteData && purchasedNoteData.purchaseDate) {
      const purchaseDate = new Date(purchasedNoteData.purchaseDate);
      const expiryDate = new Date(purchaseDate);
      expiryDate.setMonth(expiryDate.getMonth() + 6); // 6 months validity
      if (expiryDate.getTime() < new Date().getTime()) {
        alert("Your 6-month subscription to this note has expired. Please purchase it again to regain access.");
        window.location.href = "index.html";
        return;
      }
    }
  }

  // Get note viewer elements
  const noteTitle = document.getElementById("note-title")
  const noteSubject = document.getElementById("note-subject")
  const pdfContainer = document.getElementById("pdf-container")
  const chaptersList = document.getElementById("chapters-list")
  const currentPage = document.getElementById("current-page")
  const totalPages = document.getElementById("total-pages")
  const prevPageBtn = document.getElementById("prev-page")
  const nextPageBtn = document.getElementById("next-page")
  const subscriptionValidity = document.getElementById("subscription-validity")
  const bookmarkBtn = document.getElementById("bookmark-note")
  const downloadBtn = document.getElementById("download-note")
  const highlighterBtn = document.getElementById("highlighter-btn")
  const zoomInBtn = document.getElementById("zoom-in")
  const zoomOutBtn = document.getElementById("zoom-out")
  const zoomLevel = document.getElementById("zoom-level")

  // Set note title and subject
  if (noteTitle) noteTitle.textContent = note.title
  if (noteSubject) noteSubject.textContent = `Subject: ${note.subject}`

  // Set total pages
  if (totalPages) totalPages.textContent = note.pages
  if (currentPage) currentPage.textContent = "1"

  // Display purchase and expiry date
  if (subscriptionValidity) {
    const download = downloadsList.find((dl) => dl.id === note.id)
    if (download && download.purchaseDate) {
      const purchaseDate = new Date(download.purchaseDate)
      const expiryDate = new Date(purchaseDate)
      expiryDate.setMonth(expiryDate.getMonth() + 6) // 6 months validity

      subscriptionValidity.textContent = `Valid until: ${expiryDate.toLocaleDateString()}`
    } else {
      subscriptionValidity.textContent = "Valid for 6 months from purchase"
    }
  }

  // Setup bookmark button
  if (bookmarkBtn) {
    const isBookmarked = bookmarks.includes(note.id)
    bookmarkBtn.innerHTML = isBookmarked
      ? '<i class="fas fa-bookmark"></i> Bookmarked'
      : '<i class="far fa-bookmark"></i> Bookmark'

    bookmarkBtn.addEventListener("click", () => {
      toggleBookmark(note.id)
      const isNowBookmarked = bookmarks.includes(note.id)
      bookmarkBtn.innerHTML = isNowBookmarked
        ? '<i class="fas fa-bookmark"></i> Bookmarked'
        : '<i class="far fa-bookmark"></i> Bookmark'
    })
  }

  // Setup download button
  if (downloadBtn) {
    const isDownloaded = downloadsList.some((dl) => dl.id === note.id)

    downloadBtn.innerHTML = isDownloaded
      ? '<i class="fas fa-check"></i> Downloaded'
      : '<i class="fas fa-download"></i> Download'

    downloadBtn.addEventListener("click", () => {
      if (!isDownloaded) {
        downloadNote(note)
        downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded'
      } else {
        alert("This note is already in your downloads")
      }
    })
  }

  // Populate chapters list
  if (chaptersList && note.chapters) {
    chaptersList.innerHTML = ""
    note.chapters.forEach((chapter, index) => {
      const li = document.createElement("li")
      li.className = "chapter-item"
      li.innerHTML = `
        <span class="chapter-title">${chapter.title}</span>
        <span class="chapter-pages">Pages ${chapter.pages}</span>
      `
      li.addEventListener("click", () => {
        // In a real app, this would navigate to the specific page
        if (currentPage) currentPage.textContent = chapter.pages.split("-")[0]
        // Simulate page change
        simulatePageChange()
      })
      chaptersList.appendChild(li)
    })
  }

  // Global PDF JS variables
  window.pdfDoc = null;
  window.pdfPageNum = 1;
  window.pdfPageRendering = false;
  window.pdfPageNumPending = null;
  window.currentZoom = 100;

  // Load PDF into viewer
  if (pdfContainer) {
    pdfContainer.innerHTML = '<div class="pdf-loading"><i class="fas fa-spinner fa-spin fa-3x"></i><p>Loading PDF...</p></div>';
    
    // Check if we have a valid PDF URL
    if (note.pdfUrl) {
      // Build the URL (handle relative vs absolute)
      let url = note.pdfUrl;
      if (!url.startsWith('http') && !url.startsWith('data:')) {
        url = url.startsWith('/') ? url : `/${url}`;
      }

      // Add watermark immediately
      addWatermark();

      // Fetch PDF
      pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
        window.pdfDoc = pdfDoc_;
        if (totalPages) totalPages.textContent = window.pdfDoc.numPages;
        
        // Initial page render
        renderPage(window.pdfPageNum);
      }).catch(err => {
        console.error('Error loading PDF:', err);
        pdfContainer.innerHTML = `
          <div class="pdf-error" style="text-align:center; padding: 40px;">
            <i class="fas fa-exclamation-triangle fa-3x" style="color: #dc3545; margin-bottom: 15px;"></i>
            <h3>Error loading PDF</h3>
            <p>${err.message || 'Could not load the PDF document. Please try again later.'}</p>
          </div>
        `;
      });
    } else {
      // Fallback for notes without PDFs
      pdfContainer.innerHTML = `
        <div class="pdf-placeholder">
          <div class="pdf-page" id="pdf-page-1" style="background:#fff; padding:40px; min-height:800px;">
            <h2>${note.title}</h2>
            <p>No PDF document has been attached to this note.</p>
          </div>
        </div>
      `;
      addWatermark();
    }
  }

  // Setup page navigation
  if (prevPageBtn && nextPageBtn && currentPage && totalPages) {
    prevPageBtn.addEventListener("click", () => {
      if (window.pdfPageNum <= 1) return;
      window.pdfPageNum--;
      queueRenderPage(window.pdfPageNum);
    });

    nextPageBtn.addEventListener("click", () => {
      if (window.pdfDoc && window.pdfPageNum >= window.pdfDoc.numPages) return;
      window.pdfPageNum++;
      queueRenderPage(window.pdfPageNum);
    });
  }

  // Setup zoom controls
  if (zoomInBtn && zoomOutBtn && zoomLevel) {
    zoomInBtn.addEventListener("click", () => {
      if (window.currentZoom < 200) {
        window.currentZoom += 10;
        zoomLevel.textContent = `${window.currentZoom}%`;
        queueRenderPage(window.pdfPageNum);
      }
    });

    zoomOutBtn.addEventListener("click", () => {
      if (window.currentZoom > 50) {
        window.currentZoom -= 10;
        zoomLevel.textContent = `${window.currentZoom}%`;
        queueRenderPage(window.pdfPageNum);
      }
    });
  }
}

/**
 * Render PDF page
 */
function renderPage(num) {
  window.pdfPageRendering = true;
  const pdfContainer = document.getElementById("pdf-container");
  const currentPage = document.getElementById("current-page");
  
  if (currentPage) currentPage.textContent = num;

  // Fetch page
  window.pdfDoc.getPage(num).then(page => {
    const scale = window.currentZoom / 100 * 1.5; // Base scale 1.5 for better quality
    const viewport = page.getViewport({ scale: scale });

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    canvas.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    canvas.style.marginBottom = '20px';
    canvas.className = 'pdf-render-canvas';

    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    const renderTask = page.render(renderContext);

    // Wait for render to finish
    renderTask.promise.then(() => {
      window.pdfPageRendering = false;
      
      // Update DOM
      if (pdfContainer) {
        pdfContainer.innerHTML = '';
        pdfContainer.appendChild(canvas);
        
        // Make sure watermark stays on top
        addWatermark();
      }

      if (window.pdfPageNumPending !== null) {
        renderPage(window.pdfPageNumPending);
        window.pdfPageNumPending = null;
      }
    });
  });
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
  if (window.pdfPageRendering) {
    window.pdfPageNumPending = num;
  } else {
    renderPage(num);
  }
}

// Keep simulatePageChange for backward compatibility if called elsewhere
function simulatePageChange() {
  if (window.pdfDoc) {
    const currentPageStr = document.getElementById("current-page")?.textContent;
    if (currentPageStr) {
      window.pdfPageNum = parseInt(currentPageStr, 10);
      queueRenderPage(window.pdfPageNum);
      
      // Re-apply highlighting features if needed
      setupHighlighter();
      restoreHighlights(window.pdfPageNum);
    }
  }
}

// Add watermark to PDF viewer
function addWatermark() {
  if (!currentUser) return

  const watermarkContainer = document.createElement("div")
  watermarkContainer.className = "watermark-container"

  // Create dynamic watermark with user info and timestamp
  const watermark = document.createElement("div")
  watermark.className = "watermark"
  watermark.innerHTML = `${currentUser.name} • ${currentUser.email} • ${new Date().toLocaleString()}`

  watermarkContainer.appendChild(watermark)

  // Add multiple watermarks across the page
  for (let i = 0; i < 5; i++) {
    const clone = watermark.cloneNode(true)
    clone.style.top = `${20 + i * 20}%`
    watermarkContainer.appendChild(clone)
  }

  const pdfContainer = document.querySelector(".pdf-container")
  if (pdfContainer) {
    pdfContainer.appendChild(watermarkContainer)
  }
}

// Setup highlighter functionality
let isHighlighterActive = false
let currentHighlightColor = "#ffff00"

function setupHighlighter() {
  const highlighterBtn = document.getElementById("highlighter-btn")
  const pdfContainer = document.getElementById("pdf-container")
  const colorPicker = document.getElementById("highlight-color-picker")

  if (highlighterBtn && pdfContainer) {
    // Setup color picker if available
    if (colorPicker) {
      colorPicker.addEventListener("change", function () {
        currentHighlightColor = this.value
      })
    }

    highlighterBtn.addEventListener("click", () => {
      isHighlighterActive = !isHighlighterActive

      if (isHighlighterActive) {
        highlighterBtn.classList.add("active")
        highlighterBtn.innerHTML = '<i class="fas fa-highlighter"></i> Highlighter (ON)'
        pdfContainer.classList.add("highlighter-active")
      } else {
        highlighterBtn.classList.remove("active")
        highlighterBtn.innerHTML = '<i class="fas fa-highlighter"></i> Highlighter'
        pdfContainer.classList.remove("highlighter-active")
      }
    })

    // Add click event to highlightable elements
    const highlightableElements = pdfContainer.querySelectorAll(".highlightable")
    highlightableElements.forEach((element) => {
      element.addEventListener("click", function () {
        if (isHighlighterActive) {
          // Toggle highlight with current color
          if (this.classList.contains("highlighted")) {
            this.classList.remove("highlighted")
            this.style.backgroundColor = ""
          } else {
            this.classList.add("highlighted")
            this.style.backgroundColor = currentHighlightColor
          }

          // Save highlight state
          saveHighlight(this, currentHighlightColor)
        }
      })
    })

    // Add text selection highlighting
    pdfContainer.addEventListener("mouseup", () => {
      if (!isHighlighterActive) return

      const selection = window.getSelection()
      if (selection.toString().trim() === "") return

      const range = selection.getRangeAt(0)
      const span = document.createElement("span")
      span.className = "text-highlight"
      span.style.backgroundColor = currentHighlightColor

      try {
        range.surroundContents(span)
        // Save the highlighted text
        saveTextHighlight(selection.toString(), currentHighlightColor)
        // Clear selection
        selection.removeAllRanges()
      } catch (e) {
        console.error("Highlighting failed:", e)
        // Show a user-friendly message
        alert("Could not highlight this selection. Try selecting a smaller portion of text.")
      }
    })
  }
}

// Setup textbook features
function setupTextbookFeatures() {
  // Setup table of contents toggle
  const tocToggle = document.getElementById("toc-toggle")
  const chaptersContainer = document.getElementById("chapters-container")

  if (tocToggle && chaptersContainer) {
    tocToggle.addEventListener("click", () => {
      chaptersContainer.classList.toggle("show")

      if (chaptersContainer.classList.contains("show")) {
        tocToggle.innerHTML = '<i class="fas fa-times"></i> Close Contents'
      } else {
        tocToggle.innerHTML = '<i class="fas fa-list"></i> Table of Contents'
      }
    })
  }

  // Setup notes feature
  const addNoteBtn = document.getElementById("add-note-btn")
  const notesContainer = document.getElementById("notes-container")

  if (addNoteBtn && notesContainer) {
    addNoteBtn.addEventListener("click", () => {
      const urlParams = new URLSearchParams(window.location.search)
      const noteId = Number.parseInt(urlParams.get("id"))
      const pageNumber = document.getElementById("current-page")?.textContent || "1"

      const noteInput = document.createElement("div")
      noteInput.className = "note-input"
      noteInput.innerHTML = `
        <textarea placeholder="Add your note here..."></textarea>
        <div class="note-actions">
          <button class="save-note-btn">Save</button>
          <button class="cancel-note-btn">Cancel</button>
        </div>
      `

      notesContainer.appendChild(noteInput)

      // Focus on the textarea
      const textarea = noteInput.querySelector("textarea")
      textarea.focus()

      // Add event listeners to buttons
      const saveBtn = noteInput.querySelector(".save-note-btn")
      const cancelBtn = noteInput.querySelector(".cancel-note-btn")

      saveBtn.addEventListener("click", () => {
        const noteText = textarea.value.trim()

        if (noteText) {
          // Save the note
          const userNote = {
            id: Date.now(),
            noteId: noteId,
            page: pageNumber,
            text: noteText,
            timestamp: new Date().toISOString(),
          }

          userNotes.push(userNote)
          localStorage.setItem("userNotes", JSON.stringify(userNotes))

          // Replace input with saved note
          const savedNote = document.createElement("div")
          savedNote.className = "user-note"
          savedNote.innerHTML = `
            <div class="note-text">${noteText}</div>
            <div class="note-meta">
              <span>Page ${pageNumber}</span>
              <span>${new Date().toLocaleString()}</span>
            </div>
            <button class="delete-note-btn" data-id="${userNote.id}">
              <i class="fas fa-trash"></i>
            </button>
          `

          notesContainer.replaceChild(savedNote, noteInput)

          // Add event listener to delete button
          const deleteBtn = savedNote.querySelector(".delete-note-btn")
          deleteBtn.addEventListener("click", function () {
            const noteId = Number.parseInt(this.getAttribute("data-id"))
            deleteUserNote(noteId, savedNote)
          })
        } else {
          notesContainer.removeChild(noteInput)
        }
      })

      cancelBtn.addEventListener("click", () => {
        notesContainer.removeChild(noteInput)
      })
    })

    // Load existing notes for this page
    loadUserNotes()
  }
}

// Initialize textbook features
function initializeTextbookFeatures() {
  // Setup highlighter
  setupHighlighter()

  // Restore highlights for current page
  const currentPage = document.getElementById("current-page")?.textContent || "1"
  restoreHighlights(currentPage)

  // Setup search functionality
  const searchBtn = document.getElementById("note-search-btn")
  const searchInput = document.getElementById("note-search-input")
  const searchResults = document.getElementById("search-results")

  if (searchBtn && searchInput && searchResults) {
    searchBtn.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim()
      if (!searchTerm) return

      // Search in current page content
      const pdfContainer = document.getElementById("pdf-container")
      if (pdfContainer) {
        const content = pdfContainer.textContent
        const matches = content.match(new RegExp(searchTerm, "gi"))

        if (matches && matches.length > 0) {
          searchResults.innerHTML = `
            <div class="search-results-count">Found ${matches.length} matches for "${searchTerm}"</div>
          `
          searchResults.classList.add("show")

          // Highlight matches in the content
          highlightSearchMatches(pdfContainer, searchTerm)
        } else {
          searchResults.innerHTML = `
            <div class="search-results-count">No matches found for "${searchTerm}"</div>
          `
          searchResults.classList.add("show")
        }
      }
    })

    // Clear search when input is cleared
    searchInput.addEventListener("input", () => {
      if (!searchInput.value.trim()) {
        searchResults.innerHTML = ""
        searchResults.classList.remove("show")

        // Remove search highlights
        const highlights = document.querySelectorAll(".search-highlight")
        highlights.forEach((highlight) => {
          const parent = highlight.parentNode
          parent.replaceChild(document.createTextNode(highlight.textContent), highlight)
          parent.normalize()
        })
      }
    })

    // Search on Enter key
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        searchBtn.click()
      }
    })
  }

  // Setup fullscreen button
  const fullscreenBtn = document.getElementById("fullscreen-btn")
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      const pdfContainer = document.getElementById("pdf-container")
      if (!pdfContainer) return

      if (!document.fullscreenElement) {
        pdfContainer.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>'
      } else {
        document.exitFullscreen()
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>'
      }
    })

    // Update button icon when exiting fullscreen
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>'
      }
    })
  }

  // Setup print button
  const printBtn = document.getElementById("print-btn")
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print()
    })
  }

  // Setup export highlights button
  const exportHighlightsBtn = document.getElementById("export-highlights-btn")
  if (exportHighlightsBtn) {
    exportHighlightsBtn.addEventListener("click", () => {
      exportHighlights()
    })
  }

  // Setup clear highlights button
  const clearHighlightsBtn = document.getElementById("clear-highlights-btn")
  if (clearHighlightsBtn) {
    clearHighlightsBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all highlights? This action cannot be undone.")) {
        clearAllHighlights()
      }
    })
  }

  // Update reading progress
  updateReadingProgress()
}

// Load user notes for current page
function loadUserNotes() {
  const urlParams = new URLSearchParams(window.location.search)
  const noteId = Number.parseInt(urlParams.get("id"))
  const pageNumber = document.getElementById("current-page")?.textContent || "1"
  const notesContainer = document.getElementById("notes-container")

  if (notesContainer) {
    // Clear existing notes
    notesContainer.innerHTML = "<h3>Your Notes</h3>"

    // Get notes for this page
    const pageNotes = userNotes.filter((note) => note.noteId === noteId && note.page === pageNumber)

    if (pageNotes.length > 0) {
      pageNotes.forEach((note) => {
        const savedNote = document.createElement("div")
        savedNote.className = "user-note"
        savedNote.innerHTML = `
          <div class="note-text">${note.text}</div>
          <div class="note-meta">
            <span>Page ${note.page}</span>
            <span>${new Date(note.timestamp).toLocaleString()}</span>
          </div>
          <button class="delete-note-btn" data-id="${note.id}">
            <i class="fas fa-trash"></i>
          </button>
        `

        notesContainer.appendChild(savedNote)

        // Add event listener to delete button
        const deleteBtn = savedNote.querySelector(".delete-note-btn")
        deleteBtn.addEventListener("click", function () {
          const noteId = Number.parseInt(this.getAttribute("data-id"))
          deleteUserNote(noteId, savedNote)
        })
      })
    }
  }
}

// Delete user note
function deleteUserNote(id, element) {
  if (confirm("Are you sure you want to delete this note?")) {
    const index = userNotes.findIndex((note) => note.id === id)

    if (index !== -1) {
      userNotes.splice(index, 1)
      localStorage.setItem("userNotes", JSON.stringify(userNotes))

      // Remove from DOM
      if (element && element.parentNode) {
        element.parentNode.removeChild(element)
      }
    }
  }
}

// Save highlight state with color
function saveHighlight(element, color) {
  const urlParams = new URLSearchParams(window.location.search)
  const noteId = Number.parseInt(urlParams.get("id"))
  const pageNumber = document.getElementById("current-page")?.textContent || "1"

  // Get existing highlights for this note
  const noteHighlights = highlights.filter((h) => h.noteId === noteId) || []

  // Create a unique identifier for this element
  const elementText = element.textContent
  const isHighlighted = element.classList.contains("highlighted")

  // Find if this highlight already exists
  const existingHighlightIndex = noteHighlights.findIndex(
    (h) => h.noteId === noteId && h.page === pageNumber && h.text === elementText,
  )

  if (existingHighlightIndex !== -1) {
    if (!isHighlighted) {
      // Remove highlight if it's toggled off
      noteHighlights.splice(existingHighlightIndex, 1)
    } else {
      // Update color
      noteHighlights[existingHighlightIndex].color = color
    }
  } else if (isHighlighted) {
    // Add new highlight
    noteHighlights.push({
      noteId: noteId,
      page: pageNumber,
      text: elementText,
      color: color,
      timestamp: new Date().toISOString(),
    })
  }

  // Update highlights in localStorage
  highlights = highlights.filter((h) => h.noteId !== noteId)
  highlights = [...highlights, ...noteHighlights]
  localStorage.setItem("highlights", JSON.stringify(highlights))
}

// Save text selection highlight
function saveTextHighlight(text, color) {
  const urlParams = new URLSearchParams(window.location.search)
  const noteId = Number.parseInt(urlParams.get("id"))
  const pageNumber = document.getElementById("current-page")?.textContent || "1"

  // Add new highlight
  highlights.push({
    noteId: noteId,
    page: pageNumber,
    text: text,
    color: color,
    isTextSelection: true,
    timestamp: new Date().toISOString(),
  })

  // Update highlights in localStorage
  localStorage.setItem("highlights", JSON.stringify(highlights))
}

// Restore highlights for current page
function restoreHighlights(pageNumber) {
  const urlParams = new URLSearchParams(window.location.search)
  const noteId = Number.parseInt(urlParams.get("id"))
  if (!pageNumber) {
    pageNumber = document.getElementById("current-page")?.textContent || "1"
  }

  // Get highlights for this note and page
  const pageHighlights = highlights.filter((h) => h.noteId === noteId && h.page === pageNumber.toString())

  if (pageHighlights.length > 0) {
    // First handle element highlights
    const highlightableElements = document.querySelectorAll(".highlightable")
    highlightableElements.forEach((element) => {
      const elementText = element.textContent

      // Check if this element should be highlighted
      const highlight = pageHighlights.find((h) => h.text === elementText && !h.isTextSelection)

      if (highlight) {
        element.classList.add("highlighted")
        element.style.backgroundColor = highlight.color || "#ffff00"
      }
    })

    // Then handle text selection highlights
    const textHighlights = pageHighlights.filter((h) => h.isTextSelection)
    if (textHighlights.length > 0) {
      const pdfContainer = document.getElementById("pdf-container")
      if (pdfContainer) {
        // This is a simplified approach - in a real app, you'd need more sophisticated text matching
        textHighlights.forEach((highlight) => {
          highlightTextInContainer(pdfContainer, highlight.text, highlight.color)
        })
      }
    }
  }
}

// Highlight text occurrences in a container
function highlightTextInContainer(container, text, color) {
  if (!text || text.length < 3) return // Skip very short texts

  // Create a text node search
  const textNodes = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false)

  let node
  while ((node = walker.nextNode())) {
    textNodes.push(node)
  }

  // Search for the text in text nodes
  textNodes.forEach((textNode) => {
    const content = textNode.nodeValue
    const index = content.indexOf(text)

    if (index >= 0) {
      // Split the text node and insert highlight
      const before = content.substring(0, index)
      const after = content.substring(index + text.length)

      const span = document.createElement("span")
      span.className = "text-highlight"
      span.style.backgroundColor = color || "#ffff00"
      span.textContent = text

      const fragment = document.createDocumentFragment()
      if (before) {
        fragment.appendChild(document.createTextNode(before))
      }
      fragment.appendChild(span)
      if (after) {
        fragment.appendChild(document.createTextNode(after))
      }

      textNode.parentNode.replaceChild(fragment, textNode)
    }
  })
}

// Highlight search matches in the container
function highlightSearchMatches(container, searchTerm) {
  // Remove existing search highlights
  const existingHighlights = container.querySelectorAll(".search-highlight")
  existingHighlights.forEach((highlight) => {
    const parent = highlight.parentNode
    parent.replaceChild(document.createTextNode(highlight.textContent), highlight)
    parent.normalize()
  })

  // Create a text node search
  const textNodes = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false)

  let node
  while ((node = walker.nextNode())) {
    textNodes.push(node)
  }

  // Create regex for case-insensitive search
  const regex = new RegExp(searchTerm, "gi")

  // Search for matches in text nodes
  textNodes.forEach((textNode) => {
    const content = textNode.nodeValue
    const matches = content.match(regex)

    if (matches) {
      // Replace all occurrences with highlighted spans
      const fragment = document.createDocumentFragment()
      let lastIndex = 0

      content.replace(regex, (match, index) => {
        // Add text before the match
        if (index > lastIndex) {
          fragment.appendChild(document.createTextNode(content.substring(lastIndex, index)))
        }

        // Add the highlighted match
        const span = document.createElement("span")
        span.className = "search-highlight"
        span.style.backgroundColor = "#ffeb3b"
        span.textContent = match
        fragment.appendChild(span)

        lastIndex = index + match.length
        return match
      })

      // Add any remaining text
      if (lastIndex < content.length) {
        fragment.appendChild(document.createTextNode(content.substring(lastIndex)))
      }

      textNode.parentNode.replaceChild(fragment, textNode)
    }
  })
}

// Export highlights
function exportHighlights() {
  const urlParams = new URLSearchParams(window.location.search)
  const noteId = Number.parseInt(urlParams.get("id"))

  // Get all highlights for this note
  const noteHighlights = highlights.filter((h) => h.noteId === noteId)

  if (noteHighlights.length === 0) {
    alert("No highlights to export.")
    return
  }

  // Group highlights by page
  const highlightsByPage = {}
  noteHighlights.forEach((highlight) => {
    if (!highlightsByPage[highlight.page]) {
      highlightsByPage[highlight.page] = []
    }
    highlightsByPage[highlight.page].push(highlight)
  })

  // Create export content
  let exportContent = "# Highlights\n\n"
  const note = [...notesData, ...userNotes].find((note) => note.id === noteId)
  if (note) {
    exportContent += `Title: ${note.title}\n`
    exportContent += `Subject: ${note.subject}\n\n`
  }

  // Add highlights by page
  Object.keys(highlightsByPage)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((page) => {
      exportContent += `## Page ${page}\n\n`
      highlightsByPage[page].forEach((highlight) => {
        exportContent += `- "${highlight.text}"\n`
      })
      exportContent += "\n"
    })

  // Create a download link
  const blob = new Blob([exportContent], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `highlights_${note ? note.title.replace(/\s+/g, "_") : "note"}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Clear all highlights
function clearAllHighlights() {
  const urlParams = new URLSearchParams(window.location.search)
  const noteId = Number.parseInt(urlParams.get("id"))

  // Remove highlights from localStorage
  highlights = highlights.filter((h) => h.noteId !== noteId)
  localStorage.setItem("highlights", JSON.stringify(highlights))

  // Remove highlights from DOM
  const highlightedElements = document.querySelectorAll(".highlighted, .text-highlight")
  highlightedElements.forEach((element) => {
    if (element.classList.contains("highlighted")) {
      element.classList.remove("highlighted")
      element.style.backgroundColor = ""
    } else if (element.classList.contains("text-highlight")) {
      const parent = element.parentNode
      parent.replaceChild(document.createTextNode(element.textContent), element)
      parent.normalize()
    }
  })
}

// Update reading progress
function updateReadingProgress() {
  const currentPage = document.getElementById("current-page")
  const totalPages = document.getElementById("total-pages")
  const progressBar = document.getElementById("reading-progress-bar")

  if (currentPage && totalPages && progressBar) {
    const current = Number.parseInt(currentPage.textContent)
    const total = Number.parseInt(totalPages.textContent)
    const progress = (current / total) * 100

    progressBar.style.width = `${progress}%`
  }
}

// Enhanced setupScreenshotProtection function with better detection
function setupScreenshotProtection() {
  const pdfContainer = document.querySelector(".pdf-container")
  const screenshotAlert = document.getElementById("screenshot-alert")

  if (!pdfContainer) return

  // Add watermark
  addWatermark()

  // Create a protected content overlay
  const protectionOverlay = document.createElement("div")
  protectionOverlay.className = "protection-overlay"
  protectionOverlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    pointer-events: none;
    z-index: 10;
  `
  pdfContainer.style.position = "relative"
  pdfContainer.appendChild(protectionOverlay)

  // Detect screenshot attempts using various methods

  // 1. Detect Print Screen key
  document.addEventListener("keyup", (e) => {
    if (e.key === "PrintScreen" || e.keyCode === 44) {
      showScreenshotAlert()
    }
  })

  // 2. Detect Ctrl+P, Ctrl+S and F12 keys
  document.addEventListener("keydown", (e) => {
    if (
      (e.ctrlKey && (e.key === "p" || e.key === "s")) ||
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key === "i")
    ) {
      e.preventDefault()
      showScreenshotAlert()
      return false
    }
  })

  // 3. Detect visibility change (when user switches tabs to use screenshot tools)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // User might be taking screenshot from another app
      setTimeout(() => {
        if (document.visibilityState === "visible") {
          showScreenshotAlert()
        }
      }, 1000)
    }
  })

  // 4. Detect context menu (right-click)
  document.addEventListener("contextmenu", (e) => {
    if (e.target.closest(".pdf-container, .note-content")) {
      e.preventDefault()
      showScreenshotAlert()
      return false
    }
  })

  // 5. Mobile device detection for screenshots
  let lastTouchEnd = 0
  document.addEventListener("touchstart", (e) => {
    if (e.touches.length > 1) {
      // Multiple fingers - could be a screenshot gesture on some devices
      e.preventDefault()
      showScreenshotAlert()
    }
  })

  document.addEventListener("touchend", (e) => {
    const now = new Date().getTime()
    if (now - lastTouchEnd <= 300) {
      // Double-tap detected, some devices use this for screenshots
      e.preventDefault()
      showScreenshotAlert()
    }
    lastTouchEnd = now
  })

  // Function to show screenshot alert
  function showScreenshotAlert() {
    // Hide content temporarily as a protective measure
    if (pdfContainer) {
      pdfContainer.classList.add("content-protected")

      // Show alert
      if (screenshotAlert) {
        screenshotAlert.classList.add("show")

        setTimeout(() => {
          screenshotAlert.classList.remove("show")
          pdfContainer.classList.remove("content-protected")
        }, 3000)
      }

      // Log the attempt (in a real app, you might want to send this to server)
      console.log("Screenshot attempt detected at", new Date().toISOString())
    }
  }

  // Additional CSS for screenshot protection
  const style = document.createElement("style")
  style.textContent = `
    .content-protected::before {
      content: "Screenshot detected! Content protected.";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.9);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      z-index: 1000;
    }
    
    @media print {
      body * {
        visibility: hidden;
      }
      .pdf-container::after {
        visibility: visible;
        content: "Printing is disabled for copyright protection.";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
      }
    }
  `
  document.head.appendChild(style)
}

// Show protection message
function showProtectionMessage() {
  const message = document.createElement("div")
  message.className = "protection-message"
  message.innerHTML = `
    <i class="fas fa-shield-alt"></i>
    <h3>Content Protected</h3>
    <p>Screenshots and downloads are not allowed to protect intellectual property.</p>
  `

  document.body.appendChild(message)

  setTimeout(() => {
    message.classList.add("show")
    setTimeout(() => {
      message.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(message)
      }, 300)
    }, 3000)
  }, 100)
}

// Assign semester to notes — FIXED: no longer overwrites subjects
function assignSemesterToNotes() {
  // Subject-to-semester mapping for realistic distribution
  const subjectSemesterMap = {
    'CS': ['1', '2', '3', '4', '5', '6', '7', '8'],
    'BBA': ['1', '2', '3', '4', '5', '6'],
    'LAW': ['1', '2', '3', '4', '5'],
    'MED': ['1', '2', '3', '4', '5', '6', '7', '8'],
    'COM': ['1', '2', '3', '4', '5', '6'],
  }

  notesData.forEach((note, index) => {
    // Only assign semester if not already set
    if (!note.semester) {
      const semesters = subjectSemesterMap[note.subject] || ['1', '2', '3', '4']
      note.semester = semesters[index % semesters.length]
    }
    // DO NOT overwrite note.subject — it must stay as the original subject code
  })
}

// Setup authentication modals
function setupAuthModals() {
  // Login modal
  const loginBtn = document.getElementById("login-btn")
  const loginModal = document.getElementById("login-modal")
  const loginForm = document.getElementById("login-form")

  // Signup modal
  const signupBtn = document.getElementById("signup-btn")
  const signupModal = document.getElementById("signup-modal")
  const signupForm = document.getElementById("signup-form")

  // Close buttons
  const closeButtons = document.querySelectorAll(".close")

  // Open login modal
  if (loginBtn && loginModal && !currentUser) {
    loginBtn.addEventListener("click", openLoginModal)
  }

  // Open signup modal
  if (signupBtn && signupModal && !currentUser) {
    signupBtn.addEventListener("click", openSignupModal)
  }

  // Close modals
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (loginModal) loginModal.style.display = "none"
      if (signupModal) signupModal.style.display = "none"
    })
  })

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.style.display = "none"
    if (e.target === signupModal) signupModal.style.display = "none"
  })

  // Switch between login and signup
  const switchToSignup = document.getElementById("switch-to-signup")
  const switchToLogin = document.getElementById("switch-to-login")

  if (switchToSignup) {
    switchToSignup.addEventListener("click", (e) => {
      e.preventDefault()
      if (loginModal) loginModal.style.display = "none"
      if (signupModal) signupModal.style.display = "block"
    })
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", (e) => {
      e.preventDefault()
      if (signupModal) signupModal.style.display = "none"
      if (loginModal) loginModal.style.display = "block"
    })
  }

  // Handle login form submission — connected to backend API
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const submitBtn = loginForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.textContent = 'Logging in...'
      submitBtn.disabled = true

      try {
        // Try backend API first
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (response.ok && data.success) {
          currentUser = {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            phone: data.data.phone,
            role: data.data.role,
            token: data.data.token,
          }
          localStorage.setItem('currentUser', JSON.stringify(currentUser))
          localStorage.setItem('authToken', data.data.token)
        } else {
          throw new Error(data.message || 'Login failed')
        }
      } catch (error) {
        console.warn('Backend auth failed, using local fallback:', error.message)
        // Fallback to localStorage-based auth for offline/demo mode
        currentUser = {
          name: 'Demo User',
          email: email,
        }
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }

      submitBtn.textContent = originalText
      submitBtn.disabled = false

      // Close modal
      if (loginModal) loginModal.style.display = 'none'

      // Update UI
      updateUIForUser()
      showToast('Login successful!')

      // Reload current page if it's a protected page
      const currentPage = window.location.pathname.split('/').pop()
      if (['my-notes.html', 'note-viewer.html', 'my-orders.html'].includes(currentPage)) {
        window.location.reload()
      }
    })
  }

  // Handle signup form submission — connected to backend API
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const name = document.getElementById("signup-name").value
      const email = document.getElementById("signup-email").value
      const password = document.getElementById("signup-password").value
      const confirmPassword = document.getElementById("signup-confirm-password").value

      if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error')
        return
      }

      const submitBtn = signupForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.textContent = 'Creating account...'
      submitBtn.disabled = true

      try {
        // Try backend API first
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })

        const data = await response.json()

        if (response.ok && data.success) {
          currentUser = {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            phone: data.data.phone,
            role: data.data.role,
            token: data.data.token,
          }
          localStorage.setItem('currentUser', JSON.stringify(currentUser))
          localStorage.setItem('authToken', data.data.token)
        } else {
          throw new Error(data.message || 'Registration failed')
        }
      } catch (error) {
        console.warn('Backend registration failed, using local fallback:', error.message)
        // Fallback to localStorage-based auth
        currentUser = {
          name: name,
          email: email,
        }
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }

      submitBtn.textContent = originalText
      submitBtn.disabled = false

      // Close modal
      if (signupModal) signupModal.style.display = 'none'

      // Update UI
      updateUIForUser()
      showToast('Sign up successful!')
    })
  }
}

// Open login modal
function openLoginModal() {
  const loginModal = document.getElementById("login-modal")
  if (loginModal) {
    loginModal.style.display = "block"
  }
}

// Open signup modal
function openSignupModal() {
  const signupModal = document.getElementById("signup-modal")
  if (signupModal) {
    signupModal.style.display = "block"
  }
}

// Setup payment options
function setupPaymentOptions() {
  const paymentOptions = document.querySelectorAll(".payment-option")
  const paymentModal = document.getElementById("payment-modal")
  const closeBtn = paymentModal?.querySelector(".close")
  const placeOrderBtn = document.getElementById("place-order-btn")
  const payNowBtn = document.getElementById("pay-now-btn")

  if (paymentOptions.length > 0) {
    paymentOptions.forEach((option) => {
      const radio = option.querySelector("input[type='radio']")
      const method = option.getAttribute("data-method")
      const details = document.querySelector(`.payment-details[data-method="${method}"]`)

      if (radio) {
        radio.addEventListener("change", () => {
          // Hide all payment details
          document.querySelectorAll(".payment-details").forEach((detail) => {
            detail.style.display = "none"
          })

          // Show selected payment details
          if (details) {
            details.style.display = "block"
          }
        })
      }
    })
  }

  // Open payment modal when clicking place order
  if (placeOrderBtn && paymentModal) {
    placeOrderBtn.addEventListener("click", () => {
      if (!currentUser) {
        alert("Please login to place an order")
        openLoginModal()
        return
      }

      if (cart.length === 0) {
        alert("Your cart is empty")
        return
      }

      paymentModal.style.display = "block"

      // Select first payment option by default
      const firstOption = document.querySelector(".payment-option input[type='radio']")
      if (firstOption) {
        firstOption.checked = true
        const method = firstOption.closest(".payment-option").getAttribute("data-method")
        const details = document.querySelector(`.payment-details[data-method="${method}"]`)
        if (details) {
          details.style.display = "block"
        }
      }
    })
  }

  // Close payment modal
  if (closeBtn && paymentModal) {
    closeBtn.addEventListener("click", () => {
      paymentModal.style.display = "none"
    })

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === paymentModal) {
        paymentModal.style.display = "none"
      }
    })
  }

  // Handle payment submission
  if (payNowBtn && paymentModal) {
    payNowBtn.addEventListener("click", () => {
      const selectedMethod = document.querySelector(".payment-option input[type='radio']:checked")
      if (!selectedMethod) {
        alert("Please select a payment method")
        return
      }

      // For demo purposes, we'll just create a mock order
      // In a real application, you would process the payment with a payment gateway

      // Calculate total
      let total = 0
      cart.forEach((item) => {
        total += item.price
      })

      // Calculate discount if any
      const discount = calculateDiscountAmount(total)

      // Calculate GST (18%)
      const gst = Math.round((total - discount) * 0.18)
      const finalTotal = total - discount + gst

      // Create order
      const order = {
        id: `ORD-${Date.now()}`,
        items: [...cart],
        total: finalTotal,
        subtotal: total,
        discount: discount,
        gst: gst,
        paymentMethod: selectedMethod.value,
        paymentId: `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        date: new Date().toISOString(),
        status: "completed",
      }

      // Add to order history
      orderHistory.push(order)
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory))

      // Add to purchased notes
      cart.forEach((item) => {
        if (!purchasedNotes.some((note) => note.id === item.id)) {
          // Explicitly attach purchaseDate so validity can be tracked even before offline download
          const itemWithDate = { ...item, purchaseDate: new Date().toISOString() };
          purchasedNotes.push(itemWithDate);
        }
      })
      localStorage.setItem("purchasedNotes", JSON.stringify(purchasedNotes))

      // Clear cart
      cart.length = 0
      localStorage.setItem("cart", JSON.stringify(cart))

      // Close modal
      paymentModal.style.display = "none"

      // Show success message
      const successMessage = document.createElement("div")
      successMessage.className = "success-message"
      successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Payment successful! Your order has been placed.</span>
      `
      document.body.appendChild(successMessage)

      setTimeout(() => {
        successMessage.classList.add("show")
        setTimeout(() => {
          successMessage.classList.remove("show")
          setTimeout(() => {
            document.body.removeChild(successMessage)
          }, 300)
        }, 2000)
      }, 100)

      // Redirect to my notes page after a delay
      setTimeout(() => {
        window.location.href = "my-notes.html"
      }, 3000)
    })
  }
}

// Setup place order button
function setupPlaceOrderButton() {
  const placeOrderBtn = document.getElementById("place-order-btn")

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
      if (!currentUser) {
        alert("Please login to place an order")
        openLoginModal()
        return
      }

      if (cart.length === 0) {
        alert("Your cart is empty")
        return
      }

      // Open payment modal
      const paymentModal = document.getElementById("payment-modal")
      if (paymentModal) {
        paymentModal.style.display = "block"
      }
    })
  }
}

// Render order history
function renderOrderHistory() {
  const ordersContainer = document.getElementById("orders-container")

  if (ordersContainer) {
    // Check if user is logged in
    if (!currentUser) {
      ordersContainer.innerHTML = `
        <div class="empty-notes-message">
          <i class="fas fa-lock"></i>
          <h3>Please login to view your orders</h3>
          <p>You need to be logged in to access your order history</p>
          <button id="login-redirect-btn" class="btn">Login</button>
        </div>
      `

      const loginRedirectBtn = document.getElementById("login-redirect-btn")
      if (loginRedirectBtn) {
        loginRedirectBtn.addEventListener("click", openLoginModal)
      }
      return
    }

    if (!orderHistory || orderHistory.length === 0) {
      ordersContainer.innerHTML = `
        <div class="empty-notes-message">
          <i class="fas fa-shopping-bag"></i>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders yet</p>
          <a href="index.html" class="btn">Shop Now</a>
        </div>
      `
    } else {
      ordersContainer.innerHTML = `
        <h2>Your Order History</h2>
        <div class="orders-list"></div>
      `

      const ordersList = ordersContainer.querySelector(".orders-list")

      // Sort orders by date (newest first)
      const sortedOrders = [...orderHistory].sort((a, b) => new Date(b.date) - new Date(a.date))

      sortedOrders.forEach((order) => {
        const orderDate = new Date(order.date)
        const orderCard = document.createElement("div")
        orderCard.className = "order-card"

        orderCard.innerHTML = `
          <div class="order-header">
            <div class="order-id">Order ID: ${order.id}</div>
            <div class="order-date">Placed on: ${orderDate.toLocaleDateString()} at ${orderDate.toLocaleTimeString()}</div>
            <div class="order-status ${order.status}">Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
          </div>
          <div class="order-items">
            ${order.items
              .map(
                (item) => `
              <div class="order-item">
                <img src="${item.image}" alt="${item.title}" class="order-item-image">
                <div class="order-item-details">
                  <div class="order-item-title">${item.title}</div>
                  <div class="order-item-subject">Subject: ${item.subject}</div>
                </div>
                <div class="order-item-price">₹${item.price}</div>
              </div>
            `,
              )
              .join("")}
          </div>
          <div class="order-footer">
            <div class="order-payment">
              <div class="payment-method">Payment Method: ${order.paymentMethod}</div>
              <div class="payment-id">Payment ID: ${order.paymentId}</div>
            </div>
            <div class="order-summary">
              <div class="order-subtotal">Subtotal: ₹${order.subtotal}</div>
              <div class="order-discount">Discount: -₹${order.discount}</div>
              <div class="order-gst">GST (18%): ₹${order.gst}</div>
              <div class="order-total">Total: ₹${order.total}</div>
            </div>
          </div>
        `

        ordersList.appendChild(orderCard)
      })
    }
  }
}

// Setup FAQ toggle
function setupFAQToggle() {
  const faqItems = document.querySelectorAll(".faq-item")
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
      if (question) {
        question.addEventListener("click", () => {
          item.classList.toggle("active")
        })
      }
    })
  }
}

// Render downloads page
function renderDownloads() {
  const downloadsContainer = document.getElementById("downloads-container")

  if (downloadsContainer) {
    // Check if user is logged in
    if (!currentUser) {
      downloadsContainer.innerHTML = `
        <div class="empty-notes-message">
          <i class="fas fa-lock"></i>
          <h3>Please login to view your downloads</h3>
          <p>You need to be logged in to access your downloaded notes</p>
          <button id="login-redirect-btn" class="btn">Login</button>
        </div>
      `

      const loginRedirectBtn = document.getElementById("login-redirect-btn")
      if (loginRedirectBtn) {
        loginRedirectBtn.addEventListener("click", openLoginModal)
      }
      return
    }

    if (downloadsList.length === 0) {
      downloadsContainer.innerHTML = `
        <div class="empty-notes-message">
          <i class="fas fa-download"></i>
          <h3>No downloads yet</h3>
          <p>Download notes to access them offline</p>
          <a href="my-notes.html" class="btn">My Notes</a>
        </div>
      `
    } else {
      downloadsContainer.innerHTML = ""

      downloadsList.forEach((download) => {
        const note = [...notesData, ...userNotes].find((note) => note.id === download.id)
        if (!note) return

        const downloadDate = new Date(download.downloadDate)

        const downloadCard = document.createElement("div")
        downloadCard.className = "download-card"
        downloadCard.innerHTML = `
          <div class="download-card-header">
            <h3>${note.title}</h3>
          </div>
          <div class="download-card-content">
            <p>${note.subject} • ${note.pages} pages</p>
            <div class="download-progress">
              <div class="download-progress-bar"></div>
            </div>
            <div class="download-actions">
              <button class="download-btn view-btn" data-id="${note.id}">
                <i class="fas fa-eye"></i> View
              </button>
              <button class="download-btn delete-btn" data-id="${note.id}">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
          <div class="download-card-footer">
            <span>Downloaded: ${downloadDate.toLocaleDateString()}</span>
          </div>
        `

        downloadsContainer.appendChild(downloadCard)
      })

      // Add event listeners to buttons
      const viewButtons = document.querySelectorAll(".view-btn")
      viewButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const noteId = Number.parseInt(this.getAttribute("data-id"))
          window.location.href = `note-viewer.html?id=${noteId}`
        })
      })

      const deleteButtons = document.querySelectorAll(".delete-btn")
      deleteButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const noteId = Number.parseInt(this.getAttribute("data-id"))
          deleteDownload(noteId)
        })
      })
    }

    // Setup download all button
    const downloadAllBtn = document.getElementById("download-all-btn")
    if (downloadAllBtn) {
      downloadAllBtn.addEventListener("click", () => {
        alert("All notes are ready for offline access!")
      })
    }
  }
}

// Render wishlist page
function renderWishlist() {
  const wishlistContainer = document.getElementById("wishlist-container")

  if (wishlistContainer) {
    // Check if user is logged in
    if (!currentUser) {
      wishlistContainer.innerHTML = `
        <div class="empty-notes-message">
          <i class="fas fa-lock"></i>
          <h3>Please login to view your wishlist</h3>
          <p>You need to be logged in to access your saved items</p>
          <button id="login-redirect-btn" class="btn">Login</button>
        </div>
      `

      const loginRedirectBtn = document.getElementById("login-redirect-btn")
      if (loginRedirectBtn) {
        loginRedirectBtn.addEventListener("click", openLoginModal)
      }
      return
    }

    // Get wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = `
        <div class="empty-notes-message">
          <i class="fas fa-heart"></i>
          <h3>Your wishlist is empty</h3>
          <p>Save items for later to see them here</p>
          <a href="index.html" class="btn">Browse Notes</a>
        </div>
      `
    } else {
      wishlistContainer.innerHTML = ""

      wishlist.forEach((item) => {
        const noteCard = document.createElement("div")
        noteCard.className = "note-card"

        noteCard.innerHTML = `
          <div class="protected-content">
            <img src="${item.image}" alt="${item.title}">
          </div>
          <div class="note-card-content">
            <h3>${item.title}</h3>
            <div class="note-card-subject">Subject: ${item.subject}</div>
            <div class="note-card-description">${item.description}</div>
            <div class="note-card-footer">
              <div class="note-card-price">₹${item.price}</div>
              <div class="note-actions">
                <button class="btn move-to-cart-btn" data-id="${item.id}">
                  <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn remove-from-wishlist-btn" data-id="${item.id}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `

        wishlistContainer.appendChild(noteCard)
      })

      // Add event listeners to buttons
      const moveToCartButtons = document.querySelectorAll(".move-to-cart-btn")
      moveToCartButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const noteId = Number.parseInt(this.getAttribute("data-id"))
          moveToCart(noteId)
        })
      })

      const removeButtons = document.querySelectorAll(".remove-from-wishlist-btn")
      removeButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const noteId = Number.parseInt(this.getAttribute("data-id"))
          removeFromWishlist(noteId)
        })
      })
    }

    // Setup wishlist action buttons
    const moveAllToCartBtn = document.getElementById("move-all-to-cart-btn")
    if (moveAllToCartBtn) {
      moveAllToCartBtn.addEventListener("click", moveAllToCart)
    }

    const clearWishlistBtn = document.getElementById("clear-wishlist-btn")
    if (clearWishlistBtn) {
      clearWishlistBtn.addEventListener("click", clearWishlist)
    }
  }
}

// Move item from wishlist to cart
function moveToCart(noteId) {
  // Get wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  // Find the item in the wishlist
  const itemIndex = wishlist.findIndex((item) => item.id === noteId)
  if (itemIndex === -1) return

  const item = wishlist[itemIndex]

  // Add to cart if not already there
  if (!cart.some((cartItem) => cartItem.id === item.id)) {
    cart.push(item)
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()

    // Remove from wishlist
    wishlist.splice(itemIndex, 1)
    localStorage.setItem("wishlist", JSON.stringify(wishlist))

    // Show success message
    const successMessage = document.createElement("div")
    successMessage.className = "success-message"
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${item.title} moved to cart!</span>
    `
    document.body.appendChild(successMessage)

    setTimeout(() => {
      successMessage.classList.add("show")
      setTimeout(() => {
        successMessage.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(successMessage)
        }, 300)
      }, 2000)
    }, 100)

    // Re-render wishlist
    renderWishlist()
  } else {
    alert("This item is already in your cart!")
  }
}

// Remove item from wishlist
function removeFromWishlist(noteId) {
  // Get wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  // Find and remove the item
  const itemIndex = wishlist.findIndex((item) => item.id === noteId)
  if (itemIndex !== -1) {
    wishlist.splice(itemIndex, 1)
    localStorage.setItem("wishlist", JSON.stringify(wishlist))

    // Show success message
    const successMessage = document.createElement("div")
    successMessage.className = "success-message"
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>Item removed from wishlist!</span>
    `
    document.body.appendChild(successMessage)

    setTimeout(() => {
      successMessage.classList.add("show")
      setTimeout(() => {
        successMessage.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(successMessage)
        }, 300)
      }, 2000)
    }, 100)

    // Re-render wishlist
    renderWishlist()
  }
}

// Move all items from wishlist to cart
function moveAllToCart() {
  // Get wishlist from localStorage
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  if (wishlist.length === 0) {
    alert("Your wishlist is empty!")
    return
  }

  // Add each item to cart if not already there
  let itemsAdded = 0
  wishlist = wishlist.filter((item) => {
    if (!cart.some((cartItem) => cartItem.id === item.id)) {
      cart.push(item)
      itemsAdded++
      return false // Remove from wishlist
    }
    return true // Keep in wishlist
  })

  // Update localStorage
  localStorage.setItem("cart", JSON.stringify(cart))
  localStorage.setItem("wishlist", JSON.stringify(wishlist))
  updateCartCount()

  // Show success message
  const successMessage = document.createElement("div")
  successMessage.className = "success-message"
  successMessage.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${itemsAdded} item(s) moved to cart!</span>
  `
  document.body.appendChild(successMessage)

  setTimeout(() => {
    successMessage.classList.add("show")
    setTimeout(() => {
      successMessage.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(successMessage)
      }, 300)
    }, 2000)
  }, 100)

  // Re-render wishlist
  renderWishlist()
}

// Clear entire wishlist
function clearWishlist() {
  // Get wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  if (wishlist.length === 0) {
    alert("Your wishlist is already empty!")
    return
  }

  if (confirm("Are you sure you want to clear your entire wishlist?")) {
    // Clear wishlist
    localStorage.setItem("wishlist", JSON.stringify([]))

    // Show success message
    const successMessage = document.createElement("div")
    successMessage.className = "success-message"
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>Wishlist cleared successfully!</span>
    `
    document.body.appendChild(successMessage)

    setTimeout(() => {
      successMessage.classList.add("show")
      setTimeout(() => {
        successMessage.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(successMessage)
        }, 300)
      }, 2000)
    }, 100)

    // Re-render wishlist
    renderWishlist()
  }
}

function renderCoupons() {
  const couponsContainer = document.getElementById("coupons-container")

  if (couponsContainer) {
    // Check if user is logged in
    if (!currentUser) {
      couponsContainer.innerHTML = `
        <div class="empty-notes-message">
          <i class="fas fa-lock"></i>
          <h3>Please login to view your coupons</h3>
          <p>You need to be logged in to access your coupons</p>
          <button id="login-redirect-btn" class="btn">Login</button>
        </div>
      `

      const loginRedirectBtn = document.getElementById("login-redirect-btn")
      if (loginRedirectBtn) {
        loginRedirectBtn.addEventListener("click", openLoginModal)
      }
      return
    }

    // Display available coupons
    couponsContainer.innerHTML = `
      <h2>Available Coupons</h2>
      <div class="coupons-list"></div>
    `

    const couponsList = couponsContainer.querySelector(".coupons-list")

    // Add coupons
    Object.keys(discounts).forEach((code) => {
      const discount = discounts[code]
      if (discount.isValid) {
        const couponCard = document.createElement("div")
        couponCard.className = "coupon-card"
        couponCard.innerHTML = `
          <div class="coupon-code">${code}</div>
          <div class="coupon-details">
            <div class="coupon-description">${discount.description}</div>
            ${discount.minimumItems ? `<div class="coupon-minimum">Minimum ${discount.minimumItems} items required</div>` : ""}
            <div class="coupon-expiry">Valid until: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
          </div>
          <button class="copy-coupon-btn" data-code="${code}">Copy Code</button>
        `
        couponsList.appendChild(couponCard)
      }
    })

    // Add event listeners to copy buttons
    const copyButtons = document.querySelectorAll(".copy-coupon-btn")
    copyButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const code = this.getAttribute("data-code")
        navigator.clipboard.writeText(code).then(() => {
          this.textContent = "Copied!"
          setTimeout(() => {
            this.textContent = "Copy Code"
          }, 2000)
        })
      })
    })
  }
}

function renderProfile() {
  const profileContainer = document.getElementById("profile-container")

  if (profileContainer) {
    // Check if user is logged in
    if (!currentUser) {
      profileContainer.innerHTML = `
        <div class="empty-notes-message">
          <i class="fas fa-lock"></i>
          <h3>Please login to view your profile</h3>
          <p>You need to be logged in to access your profile</p>
          <button id="login-redirect-btn" class="btn">Login</button>
        </div>
      `

      const loginRedirectBtn = document.getElementById("login-redirect-btn")
      if (loginRedirectBtn) {
        loginRedirectBtn.addEventListener("click", openLoginModal)
      }
      return
    }

    // Display profile information
    profileContainer.innerHTML = `
      <div class="profile-header">
        <div class="profile-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="profile-info">
          <h2>${currentUser.name}</h2>
          <p>${currentUser.email}</p>
        </div>
        <button id="profile-logout-btn" class="profile-logout-btn" style="margin-left:auto;">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
      
      <div class="profile-form">
        <h3>Edit Profile</h3>
        <form id="edit-profile-form">
          <div class="form-group">
            <label for="profile-name">Name</label>
            <input type="text" id="profile-name" value="${currentUser.name}" required>
          </div>
          <div class="form-group">
            <label for="profile-email">Email</label>
            <input type="email" id="profile-email" value="${currentUser.email}" required>
          </div>
          <div class="form-group">
            <label for="profile-phone">Phone Number</label>
            <input type="tel" id="profile-phone" value="${currentUser.phone || ""}">
          </div>
          <div class="form-group">
            <label for="profile-password">New Password</label>
            <input type="password" id="profile-password" placeholder="Leave blank to keep current password">
          </div>
          <div class="form-group">
            <label for="profile-confirm-password">Confirm New Password</label>
            <input type="password" id="profile-confirm-password" placeholder="Confirm new password">
          </div>
          <button type="submit" class="btn">Save Changes</button>
        </form>
      </div>
      
      <div class="profile-stats">
        <h3>Account Statistics</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <i class="fas fa-book"></i>
            <div class="stat-value">${purchasedNotes.length}</div>
            <div class="stat-label">Purchased Notes</div>
          </div>
          <div class="stat-card">
            <i class="fas fa-download"></i>
            <div class="stat-value">${downloadsList.length}</div>
            <div class="stat-label">Downloads</div>
          </div>
          <div class="stat-card">
            <i class="fas fa-bookmark"></i>
            <div class="stat-value">${bookmarks.length}</div>
            <div class="stat-label">Bookmarks</div>
          </div>
          <div class="stat-card">
            <i class="fas fa-shopping-bag"></i>
            <div class="stat-value">${orderHistory.length}</div>
            <div class="stat-label">Orders</div>
          </div>
        </div>
      </div>
    `

    // Add event listener to profile logout button
    const profileLogoutBtn = document.getElementById("profile-logout-btn")
    if (profileLogoutBtn) {
      profileLogoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        logout()
      })
    }

    // Add event listener to form submission
    const editProfileForm = document.getElementById("edit-profile-form")
    if (editProfileForm) {
      editProfileForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const name = document.getElementById("profile-name").value
        const email = document.getElementById("profile-email").value
        const phone = document.getElementById("profile-phone").value
        const password = document.getElementById("profile-password").value
        const confirmPassword = document.getElementById("profile-confirm-password").value

        // Validate passwords if provided
        if (password && password !== confirmPassword) {
          alert("Passwords do not match!")
          return
        }

        // Update user information
        currentUser.name = name
        currentUser.email = email
        currentUser.phone = phone

        if (password) {
          currentUser.password = password
        }

        localStorage.setItem("currentUser", JSON.stringify(currentUser))

        // Show success message
        const successMessage = document.createElement("div")
        successMessage.className = "success-message"
        successMessage.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <span>Profile updated successfully!</span>
        `
        document.body.appendChild(successMessage)

        setTimeout(() => {
          successMessage.classList.add("show")
          setTimeout(() => {
            successMessage.classList.remove("show")
            setTimeout(() => {
              document.body.removeChild(successMessage)
            }, 300)
          }, 2000)
        }, 100)

        // Update UI
        updateUIForUser()
      })
    }
  }
}

function renderHelpCenter() {
  const helpCenterContainer = document.getElementById("help-center-container")

  if (helpCenterContainer) {
    helpCenterContainer.innerHTML = `
      <div class="help-center-header">
        <h1>Help Center</h1>
        <p>Find answers to common questions and get support</p>
        <div class="help-search">
          <input type="text" id="help-search-input" placeholder="Search for help...">
          <button id="help-search-btn"><i class="fas fa-search"></i></button>
        </div>
      </div>
      
      <div class="help-categories">
        <div class="help-category">
          <h2><i class="fas fa-shopping-cart"></i> Orders & Payments</h2>
          <div class="help-items">
            <div class="help-item">
              <h3>How do I place an order?</h3>
              <div class="help-content">
                <p>To place an order, browse our collection of notes, add the desired notes to your cart, and proceed to checkout. You can pay using various payment methods including credit/debit cards, UPI, and net banking.</p>
              </div>
            </div>
            <div class="help-item">
              <h3>What payment methods are accepted?</h3>
              <div class="help-content">
                <p>We accept various payment methods including credit/debit cards, UPI, and net banking. All payments are processed securely.</p>
              </div>
            </div>
            <div class="help-item">
              <h3>How can I track my order?</h3>
              <div class="help-content">
                <p>You can track your orders in the "My Orders" section of your account. This will show all your past orders and their current status.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="help-category">
          <h2><i class="fas fa-book"></i> Notes & Downloads</h2>
          <div class="help-items">
            <div class="help-item">
              <h3>How do I access my purchased notes?</h3>
              <div class="help-content">
                <p>After purchasing notes, you can access them in the "My Notes" section of your account. You can read them online or download them for offline access on our platform.</p>
              </div>
            </div>
            <div class="help-item">
              <h3>Can I download notes to my device?</h3>
              <div class="help-content">
                <p>For copyright protection, notes can only be downloaded within our platform and cannot be saved to your device. This ensures the intellectual property of our content creators is protected.</p>
              </div>
            </div>
            <div class="help-item">
              <h3>How long can I access my purchased notes?</h3>
              <div class="help-content">
                <p>You can access your purchased notes for 1 year from the date of purchase. After that, you may need to repurchase them if you still need access.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="help-category">
          <h2><i class="fas fa-user"></i> Account & Profile</h2>
          <div class="help-items">
            <div class="help-item">
              <h3>How do I create an account?</h3>
              <div class="help-content">
                <p>You can create an account by clicking on the "Sign Up" button in the top right corner of the page. Fill in your details and submit the form to create your account.</p>
              </div>
            </div>
            <div class="help-item">
              <h3>How do I reset my password?</h3>
              <div class="help-content">
                <p>If you've forgotten your password, click on the "Login" button, then click on "Forgot Password". Follow the instructions sent to your email to reset your password.</p>
              </div>
            </div>
            <div class="help-item">
              <h3>How do I update my profile information?</h3>
              <div class="help-content">
                <p>You can update your profile information in the "Edit Profile" section of your account. Here you can change your name, email, phone number, and password.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="contact-support">
        <h2>Still need help?</h2>
        <p>Contact our support team and we'll get back to you as soon as possible.</p>
        <form id="support-form">
          <div class="form-group">
            <label for="support-subject">Subject</label>
            <input type="text" id="support-subject" required>
          </div>
          <div class="form-group">
            <label for="support-message">Message</label>
            <textarea id="support-message" rows="5" required></textarea>
          </div>
          <button type="submit" class="btn">Send Message</button>
        </form>
      </div>
    `

    // Add event listeners to help items for toggle
    const helpItems = document.querySelectorAll(".help-item h3")
    helpItems.forEach((item) => {
      item.addEventListener("click", function () {
        this.parentElement.classList.toggle("active")
      })
    })

    // Add event listener to search button
    const searchBtn = document.getElementById("help-search-btn")
    const searchInput = document.getElementById("help-search-input")

    if (searchBtn && searchInput) {
      searchBtn.addEventListener("click", searchHelp)
      searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          searchHelp()
        }
      })
    }

    // Add event listener to support form
    const supportForm = document.getElementById("support-form")
    if (supportForm) {
      supportForm.addEventListener("submit", function (e) {
        e.preventDefault()

        // Show success message
        const successMessage = document.createElement("div")
        successMessage.className = "success-message"
        successMessage.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <span>Your message has been sent! We'll get back to you soon.</span>
        `
        document.body.appendChild(successMessage)

        setTimeout(() => {
          successMessage.classList.add("show")
          setTimeout(() => {
            successMessage.classList.remove("show")
            setTimeout(() => {
              document.body.removeChild(successMessage)
            }, 300)
          }, 2000)
        }, 100)

        // Reset form
        this.reset()
      })
    }

    function searchHelp() {
      const searchTerm = searchInput.value.toLowerCase().trim()
      if (!searchTerm) return

      const helpItems = document.querySelectorAll(".help-item")
      let matchFound = false

      helpItems.forEach((item) => {
        const title = item.querySelector("h3").textContent.toLowerCase()
        const content = item.querySelector(".help-content").textContent.toLowerCase()

        if (title.includes(searchTerm) || content.includes(searchTerm)) {
          item.classList.add("active")
          item.classList.add("highlight")
          matchFound = true

          // Scroll to the first match
          if (!matchFound) {
            item.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        } else {
          item.classList.remove("highlight")
        }
      })

      if (!matchFound) {
        alert("No results found for: " + searchTerm)
      }
    }
  }
}

// Remove subscription-related code from renderNoteViewer function
// In renderNoteViewer function, replace the download button code with:
// Update the download button in renderNoteViewer function:

// In renderNoteViewer function, replace the download button code with:

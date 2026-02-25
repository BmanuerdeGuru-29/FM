// DOM Elements
const playBtn = document.getElementById('playBtn');
const volumeBtn = document.getElementById('volumeBtn');
const volumeSlider = document.getElementById('volumeSlider');
const songTitle = document.querySelector('.song-title');
const artistName = document.querySelector('.artist-name');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const songRequestForm = document.getElementById('songRequestForm');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const announcements = document.getElementById('announcements');
const alerts = document.getElementById('alerts');

// Audio Player State
let isPlaying = false;
let currentVolume = 0.7;
let audioStream = null;

// Mock playlist data
const playlist = [
    { title: "Summer Vibes", artist: "DJ Sunshine", duration: "3:45" },
    { title: "Night Drive", artist: "Luna Beats", duration: "4:12" },
    { title: "Electric Dreams", artist: "Neon Pulse", duration: "3:28" },
    { title: "City Lights", artist: "Urban Flow", duration: "3:56" },
    { title: "Ocean Waves", artist: "Coastal Sound", duration: "4:33" }
];

let currentSongIndex = 0;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializePlayer();
    setupEventListeners();
    updateNowPlaying();
    startLiveSimulation();
    setupScrollAnimations();
    registerServiceWorker();
    setupInstallPrompt();
});

// Initialize Audio Player
function initializePlayer() {
    // Create audio element for streaming
    audioStream = new Audio();
    audioStream.crossOrigin = "anonymous";
    
    // Set initial volume
    audioStream.volume = currentVolume;
    
    // Mock streaming URL (replace with actual streaming URL)
    audioStream.src = 'https://stream.example.com/radio.mp3';
    
    // Handle audio events
    audioStream.addEventListener('loadstart', () => {
        songTitle.textContent = 'Connecting...';
        artistName.textContent = 'Please wait...';
    });
    
    audioStream.addEventListener('canplay', () => {
        songTitle.textContent = 'Connected';
        artistName.textContent = 'Live Stream';
    });
    
    audioStream.addEventListener('error', () => {
        songTitle.textContent = 'Connection Error';
        artistName.textContent = 'Please try again';
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Play/Pause button
    playBtn.addEventListener('click', togglePlayPause);
    
    // Volume controls
    volumeBtn.addEventListener('click', toggleVolumeSlider);
    volumeSlider.querySelector('input').addEventListener('input', updateVolume);
    
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Song request form
    if (songRequestForm) {
        songRequestForm.addEventListener('submit', handleSongRequest);
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });
}

// Toggle Play/Pause
function togglePlayPause() {
    const icon = playBtn.querySelector('i');
    
    if (isPlaying) {
        // Pause
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        playBtn.style.background = 'var(--primary-color)';
        playBtn.setAttribute('aria-pressed', 'false');
        
        if (audioStream) {
            audioStream.pause();
        }
        
        announceToScreenReader('Music paused');
    } else {
        // Play
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        playBtn.style.background = '#4CAF50';
        playBtn.setAttribute('aria-pressed', 'true');
        
        if (audioStream) {
            // For demo purposes, we'll simulate playback
            simulatePlayback();
        }
        
        announceToScreenReader('Music playing');
    }
    
    isPlaying = !isPlaying;
}

// Simulate playback (since we don't have actual stream)
function simulatePlayback() {
    updateNowPlaying();
    
    // Simulate song progression
    setInterval(() => {
        if (isPlaying) {
            // Randomly change songs every few seconds for demo
            if (Math.random() > 0.95) {
                nextSong();
            }
        }
    }, 2000);
}

// Toggle Volume Slider
function toggleVolumeSlider() {
    volumeSlider.style.display = volumeSlider.style.display === 'flex' ? 'none' : 'flex';
}

// Update Volume
function updateVolume(e) {
    currentVolume = e.target.value / 100;
    if (audioStream) {
        audioStream.volume = currentVolume;
    }
    
    // Update volume icon
    const volumeIcon = volumeBtn.querySelector('i');
    if (currentVolume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (currentVolume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Update Now Playing
function updateNowPlaying() {
    const currentSong = playlist[currentSongIndex];
    songTitle.textContent = currentSong.title;
    artistName.textContent = `Artist: ${currentSong.artist}`;
}

// Next Song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    updateNowPlaying();
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Handle Song Request Form
function handleSongRequest(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        song: document.getElementById('song').value,
        artist: document.getElementById('artist').value,
        message: document.getElementById('message').value
    };
    
    // Simulate form submission with loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Add loading state to button
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
    submitBtn.disabled = true;
    
    // Add loading state to form
    e.target.classList.add('loading');
    
    setTimeout(() => {
        // Remove loading state
        e.target.classList.remove('loading');
        submitBtn.innerHTML = '✓ Request Sent!';
        submitBtn.style.background = '#4CAF50';
        
        // Reset form
        e.target.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
        
        // Show success message
        showNotification('Your song request has been sent successfully!');
    }, 2000);
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Start Live Simulation
function startLiveSimulation() {
    // Update current show based on time
    updateCurrentShow();
    setInterval(updateCurrentShow, 60000); // Update every minute
    
    // Simulate live listener count
    updateListenerCount();
    setInterval(updateListenerCount, 30000); // Update every 30 seconds
}

// Update Current Show
function updateCurrentShow() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Simple schedule logic
    let currentShow = '';
    let currentHost = '';
    
    if (hour >= 6 && hour < 10) {
        currentShow = 'Morning Drive';
        currentHost = 'DJ Sarah';
    } else if (hour >= 10 && hour < 14) {
        currentShow = day === 2 ? 'Jazz Lounge' : 'Midday Mix';
        currentHost = day === 2 ? 'DJ Mike' : 'DJ Alex';
    } else if (hour >= 14 && hour < 18) {
        currentShow = day === 2 ? 'Rock Hour' : 'Afternoon Flow';
        currentHost = day === 2 ? 'DJ Emma' : 'DJ Alex';
    } else if (hour >= 18 && hour < 22) {
        currentShow = 'Evening Sessions';
        currentHost = 'DJ Emma';
    } else {
        currentShow = 'Late Night Mix';
        currentHost = 'DJ Alex';
    }
    
    // Update current show display
    const showCard = document.querySelector('.show-card h3');
    const showHost = document.querySelector('.show-host span');
    const showTime = document.querySelector('.show-time');
    
    if (showCard) showCard.textContent = currentShow;
    if (showHost) showHost.textContent = currentHost;
    if (showTime) showTime.textContent = `${hour}:00 - ${(hour + 2) % 24}:00`;
}

// Update Listener Count
function updateListenerCount() {
    const listenerCount = Math.floor(Math.random() * 500) + 1000;
    
    // You could display this somewhere in the UI
    console.log(`Current listeners: ${listenerCount}`);
}

// Setup Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Spacebar to play/pause
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlayPause();
    }
    
    // Arrow keys for volume
    if (e.code === 'ArrowUp') {
        e.preventDefault();
        const volumeInput = volumeSlider.querySelector('input');
        volumeInput.value = Math.min(100, parseInt(volumeInput.value) + 5);
        updateVolume({ target: volumeInput });
    }
    
    if (e.code === 'ArrowDown') {
        e.preventDefault();
        const volumeInput = volumeSlider.querySelector('input');
        volumeInput.value = Math.max(0, parseInt(volumeInput.value) - 5);
        updateVolume({ target: volumeInput });
    }
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize lazy loading for images
    initializeLazyLoading();
    
    // Add hover effects to DJ cards
    const djCards = document.querySelectorAll('.dj-card');
    djCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click to play demo for news items
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add loading state
            this.classList.add('loading');
            
            setTimeout(() => {
                this.classList.remove('loading');
                showNotification('Opening full article...');
            }, 1000);
        });
    });
    
    // Add dynamic time display
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        
        // You could display this somewhere in the UI
        console.log(`Current time: ${timeString}`);
    }
    
    updateTime();
    setInterval(updateTime, 1000);
});

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('lazy-image');
                
                img.onload = () => {
                    img.classList.add('loaded');
                };
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Show Loading Overlay
function showLoadingOverlay(message = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner large"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(overlay);
    
    return overlay;
}

// Hide Loading Overlay
function hideLoadingOverlay(overlay) {
    if (overlay && overlay.parentNode) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }
}

// Create Skeleton Loading for Content
function createSkeletonCard(type = 'default') {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    
    switch(type) {
        case 'dj':
            skeleton.innerHTML = `
                <div class="skeleton skeleton-avatar"></div>
                <div class="skeleton skeleton-text title"></div>
                <div class="skeleton skeleton-text subtitle"></div>
                <div class="skeleton skeleton-button"></div>
            `;
            break;
        case 'news':
            skeleton.innerHTML = `
                <div class="skeleton" style="height: 200px; margin-bottom: 1rem;"></div>
                <div class="skeleton skeleton-text title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text" style="width: 40%;"></div>
            `;
            break;
        default:
            skeleton.innerHTML = `
                <div class="skeleton skeleton-text title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
            `;
    }
    
    return skeleton;
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('An error occurred. Please refresh the page.');
});

// Performance optimization
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Handle responsive adjustments
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
        }
    }, 250);
});

// Theme Management Functions
function initializeTheme() {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme icon
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Update ARIA attributes
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'false' : 'true');
    }
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Show notification and announce to screen readers
    const themeName = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    showNotification(`${themeName} activated`);
    announceToScreenReader(`${themeName} activated`);
}

// Accessibility Functions
function announceToScreenReader(message, priority = 'polite') {
    const announcement = priority === 'assertive' ? alerts : announcements;
    if (announcement) {
        announcement.textContent = message;
        
        // Clear the announcement after a short delay
        setTimeout(() => {
            announcement.textContent = '';
        }, 1000);
    }
}

function manageFocus(element, trap = false) {
    if (element) {
        element.focus();
        
        if (trap) {
            // Trap focus within element (for modals, etc.)
            const focusableElements = element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        }
    }
}

// Enhanced keyboard navigation
function setupKeyboardNavigation() {
    // Escape key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.focus();
                announceToScreenReader('Menu closed');
            }
        }
    });
    
    // Tab navigation for mobile menu
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // Enhanced volume slider accessibility
    const volumeInput = volumeSlider.querySelector('input');
    volumeInput.addEventListener('input', function(e) {
        const value = e.target.value;
        volumeSlider.setAttribute('aria-valuenow', value);
        announceToScreenReader(`Volume ${value}%`);
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
    setupKeyboardNavigation();
    
    // Add loading announcement for screen readers
    announceToScreenReader('Kasambabezi FM website loaded');
    
    // Monitor dynamic content changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Announce new content if needed
                const newContent = Array.from(mutation.addedNodes).find(node => 
                    node.nodeType === Node.ELEMENT_NODE && 
                    (node.classList.contains('notification') || node.classList.contains('loading-overlay'))
                );
                
                if (newContent) {
                    // Let the specific functions handle announcements
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// PWA Functions
let deferredPrompt;
let installButton;

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('Service Worker updating...');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

function setupInstallPrompt() {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });
    
    // Listen for app installed
    window.addEventListener('appinstalled', () => {
        console.log('PWA installed successfully');
        hideInstallButton();
        showNotification('Kasambabezi FM installed successfully!');
        announceToScreenReader('App installed successfully');
    });
}

function showInstallButton() {
    if (installButton) return;
    
    installButton = document.createElement('button');
    installButton.className = 'install-btn';
    installButton.innerHTML = '<i class="fas fa-download"></i> Install App';
    installButton.setAttribute('aria-label', 'Install Kasambabezi FM app');
    
    installButton.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted install prompt');
        } else {
            console.log('User dismissed install prompt');
        }
        
        deferredPrompt = null;
        hideInstallButton();
    });
    
    // Add to navigation
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.appendChild(installButton);
    }
}

function hideInstallButton() {
    if (installButton && installButton.parentNode) {
        installButton.parentNode.removeChild(installButton);
        installButton = null;
    }
}

function showUpdateNotification() {
    const updateBtn = document.createElement('button');
    updateBtn.className = 'update-btn';
    updateBtn.innerHTML = '<i class="fas fa-sync"></i> Update Available';
    updateBtn.setAttribute('aria-label', 'Update app to latest version');
    
    updateBtn.addEventListener('click', () => {
        window.location.reload();
    });
    
    // Add to header
    const header = document.querySelector('.header');
    if (header) {
        header.appendChild(updateBtn);
    }
    
    // Show notification
    showNotification('A new version is available! Click to update.');
    announceToScreenReader('New version available');
}

// Check if app is running in standalone mode
function isPWAInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true || 
           document.referrer.includes('android-app://');
}

// Add PWA-specific styles if installed
if (isPWAInstalled()) {
    document.body.classList.add('pwa-installed');
    console.log('App running in standalone mode');
}

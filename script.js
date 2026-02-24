// DOM Elements
const playBtn = document.getElementById('playBtn');
const volumeBtn = document.getElementById('volumeBtn');
const volumeSlider = document.getElementById('volumeSlider');
const songTitle = document.querySelector('.song-title');
const artistName = document.querySelector('.artist-name');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const songRequestForm = document.getElementById('songRequestForm');

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
    initializePlayer();
    setupEventListeners();
    updateNowPlaying();
    startLiveSimulation();
    setupScrollAnimations();
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
        playBtn.style.background = '#ff6b35';
        
        if (audioStream) {
            audioStream.pause();
        }
    } else {
        // Play
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        playBtn.style.background = '#4CAF50';
        
        if (audioStream) {
            // For demo purposes, we'll simulate playback
            simulatePlayback();
        }
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
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Request Sent!';
        submitBtn.style.background = '#4CAF50';
        
        // Reset form
        e.target.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '#ff6b35';
            submitBtn.disabled = false;
        }, 3000);
        
        // Show success message
        showNotification('Your song request has been sent successfully!');
    }, 1500);
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
            showNotification('Opening full article...');
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

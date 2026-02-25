# Kasambabezi FM - Kariba's Voice of Empowerment and Development

A modern, responsive web application for Kasambabezi radio station featuring live streaming, show schedules, DJ profiles, song requests, and more.

## Features

### 🎵 Audio Player
- Live streaming audio player with play/pause controls
- Volume control with slider
- Now playing display with song and artist information
- Keyboard shortcuts (Space to play/pause, Arrow keys for volume)

### 📅 Schedule Management
- Weekly show schedule with time slots
- Dynamic current show display based on actual time
- Responsive grid layout for different screen sizes

### 🎤 DJ Profiles
- Interactive DJ/host cards with photos
- Social media links for each DJ
- Hover effects and animations

### 📝 Song Requests
- Form for users to request songs
- Dedication/message field
- Form validation and submission feedback
- Success notifications

### 📰 News & Updates
- News grid with image previews
- Article dates and descriptions
- Responsive card layout

### 📞 Contact & Social
- Contact information display
- Social media integration
- Interactive social links

## Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with animations and transitions
- **JavaScript (ES6+)** - Interactive functionality and DOM manipulation
- **Font Awesome** - Icon library
- **Google Fonts** - Typography (Inter font family)

## File Structure

```
Kasambabezi FM/
├── index.html          # Main HTML file
├── styles.css          # Complete styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # Documentation
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for testing audio streaming)

### Installation

1. **Clone or download** the project files to your local machine

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - For best results, use a local web server:
     ```bash
     # Using Python
     python -m http.server 8000
     # Then navigate to http://localhost:8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server
     ```

3. **Configure audio streaming** (optional):
   - Edit `script.js` and replace the mock streaming URL with your actual radio stream URL
   - Update the playlist data with your actual song information

## Configuration

### Audio Stream Setup
To connect to a real audio stream, modify the `initializePlayer()` function in `script.js`:

```javascript
// Replace this line with your actual streaming URL
audioStream.src = 'https://your-streaming-server.com/stream.mp3';
```

### Customization Options

1. **Station Information**:
   - Update station name in the logo section of `index.html`
   - Modify contact information in the contact section
   - Station motto: "Kariba's Voice of Empowerment and Development"

2. **Schedule**:
   - Edit the schedule data in `index.html` or modify the `updateCurrentShow()` function in `script.js`

3. **DJ Profiles**:
   - Replace placeholder images with actual DJ photos
   - Update DJ names, shows, and social media links

4. **Styling**:
   - Modify color scheme by changing CSS variables in `styles.css`
   - Adjust fonts, spacing, and animations as needed

## Features Breakdown

### Audio Player Controls
- **Play/Pause**: Toggle audio playback
- **Volume**: Adjust audio volume with slider
- **Visual Feedback**: Button states and animations

### Responsive Design
- **Mobile-first approach** with breakpoints at 768px and 480px
- **Hamburger menu** for mobile navigation
- **Flexible grids** that adapt to screen size
- **Touch-friendly** controls and buttons

### Interactive Elements
- **Smooth scrolling** navigation
- **Hover effects** on cards and buttons
- **Form validation** and submission handling
- **Notification system** for user feedback
- **Scroll animations** for content reveal

### Accessibility Features
- **Semantic HTML** structure
- **Keyboard navigation** support
- **ARIA-friendly** markup
- **High contrast** design elements

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Considerations

- **Optimized images** using placeholder service
- **Lazy loading** for content sections
- **Efficient CSS** with minimal reflows
- **Debounced resize events** for better performance

## Troubleshooting

### Audio Not Playing
- Check browser autoplay policies
- Ensure audio stream URL is accessible
- Verify CORS headers for cross-origin requests

### Mobile Menu Not Working
- Check for JavaScript errors in console
- Ensure hamburger menu is visible on small screens

### Styling Issues
- Clear browser cache
- Check for CSS conflicts
- Verify all CSS files are loading correctly

## Future Enhancements

- **Admin panel** for managing schedule and content
- **Live chat** functionality
- **Podcast integration**
- **Analytics dashboard**
- **Push notifications** for show reminders
- **Multi-language support**

## License

This project is open source and available under the MIT License.

## Support

For support or questions:
- Email: studio@kasambabezi.fm
- Phone: +263 XXX XXX XXX

---

**Enjoy your Kasambabezi FM web system!** 🎧

*Kariba's Voice of Empowerment and Development*

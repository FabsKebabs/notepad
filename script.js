
document.addEventListener('DOMContentLoaded', () => {
  // Home page elements
  const canvas = document.getElementById('drawingCanvas');
  const ctx = canvas.getContext('2d');
  const textDisplay = document.getElementById('convertedText');
  const colorPicker = document.getElementById('colorPicker');
  colorPicker.value = '#8e54e9'; // Set default color to purple
  const thicknessSlider = document.getElementById('thicknessSlider');
  const convertBtn = document.getElementById('convertBtn');
  const clearCanvasBtn = document.getElementById('clearCanvasBtn');
  const clearTextBtn = document.getElementById('clearTextBtn');
  const statusTime = document.getElementById('statusTime');
  
  // Drawing studio elements
  const drawingStudioCanvas = document.getElementById('drawingStudioCanvas');
  const drawingCtx = drawingStudioCanvas.getContext('2d');
  const backgroundImage = document.getElementById('backgroundImage');
  const imageUploader = document.getElementById('imageUploader');
  const imageOpacitySlider = document.getElementById('imageOpacitySlider');
  const drawingColorPicker = document.getElementById('drawingColorPicker');
  const drawingThicknessSlider = document.getElementById('drawingThicknessSlider');
  const undoBtn = document.getElementById('undoBtn');
  const clearDrawingBtn = document.getElementById('clearDrawingBtn');
  const clearImageBtn = document.getElementById('clearImageBtn');
  const saveDrawingBtn = document.getElementById('saveDrawingBtn');
  
  // Menu elements
  const menuButton = document.getElementById('menuButton');
  const sidebar = document.getElementById('sidebar');
  const closeSidebar = document.getElementById('closeSidebar');
  const overlay = document.getElementById('overlay');
  const themeToggle = document.getElementById('themeToggle');
  const settingsThemeToggle = document.getElementById('settingsThemeToggle');
  
  // Settings elements
  const defaultColorSetting = document.getElementById('defaultColorSetting');
  const defaultThicknessSetting = document.getElementById('defaultThicknessSetting');
  const thicknessValue = document.getElementById('thicknessValue');
  const autoSaveSetting = document.getElementById('autoSaveSetting');
  const savedTextsCount = document.getElementById('savedTextsCount');
  const historyItemsCount = document.getElementById('historyItemsCount');
  const clearAllDataBtn = document.getElementById('clearAllDataBtn');
  
  // History and Saved Texts elements
  const savedTextsList = document.getElementById('savedTextsList');
  const historyList = document.getElementById('historyList');
  const noSavedTexts = document.getElementById('noSavedTexts');
  const noHistory = document.getElementById('noHistory');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  
  // Page navigation
  const pages = {
    home: document.getElementById('home-page'),
    drawing: document.getElementById('drawing-page'),
    myTexts: document.getElementById('my-texts-page'),
    history: document.getElementById('history-page'),
    settings: document.getElementById('settings-page'),
    help: document.getElementById('help-page'),
    about: document.getElementById('about-page')
  };
  
  // Set dark mode as default
  if (localStorage.getItem('darkMode') === null || localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
  }
  
  // Save default preference if not already set
  if (localStorage.getItem('darkMode') === null) {
    localStorage.setItem('darkMode', 'enabled');
  }
  
  // Theme toggle functionality
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  });
  
  // Mobile menu functionality
  menuButton.addEventListener('click', () => {
    // Hide menu button immediately first
    menuButton.style.visibility = 'hidden';
    // Then open sidebar and activate overlay
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  });
  
  function closeSidebarMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    menuButton.style.visibility = 'visible'; // Show menu button when sidebar is closed
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  closeSidebar.addEventListener('click', closeSidebarMenu);
  overlay.addEventListener('click', closeSidebarMenu);
  
  // Scroll to top when navigating between pages
  function scrollToTop() {
    window.scrollTo(0, 0);
    document.querySelector('.container').scrollTo(0, 0);
  }
  
  // Storage for saved texts and history
  let savedTexts = JSON.parse(localStorage.getItem('savedTexts')) || [];
  let textHistory = JSON.parse(localStorage.getItem('textHistory')) || [];
  
  // Settings
  let settings = JSON.parse(localStorage.getItem('appSettings')) || {
    defaultColor: '#8e54e9',
    defaultThickness: 3,
    autoSave: false
  };
  
  // Update settings UI
  function updateSettingsUI() {
    defaultColorSetting.value = settings.defaultColor;
    defaultThicknessSetting.value = settings.defaultThickness;
    thicknessValue.textContent = settings.defaultThickness;
    autoSaveSetting.checked = settings.autoSave;
    
    // Update storage counts
    savedTextsCount.textContent = savedTexts.length;
    historyItemsCount.textContent = textHistory.length;
  }
  
  // Save settings
  function saveSettings() {
    settings.defaultColor = defaultColorSetting.value;
    settings.defaultThickness = defaultThicknessSetting.value;
    settings.autoSave = autoSaveSetting.checked;
    
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Apply settings to the drawing tools
    colorPicker.value = settings.defaultColor;
    thicknessSlider.value = settings.defaultThickness;
    drawingColorPicker.value = settings.defaultColor;
    drawingThicknessSlider.value = settings.defaultThickness;
  }
  
  // Settings event listeners
  defaultThicknessSetting.addEventListener('input', function() {
    thicknessValue.textContent = this.value;
  });
  
  defaultColorSetting.addEventListener('change', saveSettings);
  defaultThicknessSetting.addEventListener('change', saveSettings);
  autoSaveSetting.addEventListener('change', saveSettings);
  
  // Clear all data
  clearAllDataBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all saved texts and history? This cannot be undone.')) {
      savedTexts = [];
      textHistory = [];
      localStorage.setItem('savedTexts', JSON.stringify(savedTexts));
      localStorage.setItem('textHistory', JSON.stringify(textHistory));
      updateSavedTextsList();
      updateHistoryList();
      updateSettingsUI();
    }
  });
  
  // Add to history
  function addToHistory(text) {
    if (!text || text === 'Your converted text will appear here' || text === 'No text detected. Try again.' || text === 'Error converting to text. Try again.') {
      return;
    }
    
    const historyItem = {
      id: Date.now(),
      text: text,
      date: new Date().toISOString(),
      saved: false
    };
    
    textHistory.unshift(historyItem); // Add to beginning of array
    
    // Limit history size
    if (textHistory.length > 50) {
      textHistory.pop();
    }
    
    localStorage.setItem('textHistory', JSON.stringify(textHistory));
    updateHistoryList();
    updateSettingsUI();
    
    // Auto-save if enabled
    if (settings.autoSave) {
      saveText(historyItem);
    }
  }
  
  // Save text
  function saveText(historyItem) {
    // Check if already saved
    const existingIndex = savedTexts.findIndex(item => item.id === historyItem.id);
    
    if (existingIndex === -1) {
      const savedItem = {
        id: historyItem.id || Date.now(),
        text: historyItem.text,
        date: historyItem.date || new Date().toISOString()
      };
      
      savedTexts.unshift(savedItem);
      
      // Mark as saved in history
      const historyIndex = textHistory.findIndex(item => item.id === historyItem.id);
      if (historyIndex !== -1) {
        textHistory[historyIndex].saved = true;
      }
      
      localStorage.setItem('savedTexts', JSON.stringify(savedTexts));
      localStorage.setItem('textHistory', JSON.stringify(textHistory));
      
      updateSavedTextsList();
      updateHistoryList();
      updateSettingsUI();
    }
  }
  
  // Delete saved text
  function deleteSavedText(id) {
    savedTexts = savedTexts.filter(item => item.id !== id);
    localStorage.setItem('savedTexts', JSON.stringify(savedTexts));
    updateSavedTextsList();
    updateSettingsUI();
  }
  
  // Delete history item
  function deleteHistoryItem(id) {
    textHistory = textHistory.filter(item => item.id !== id);
    localStorage.setItem('textHistory', JSON.stringify(textHistory));
    updateHistoryList();
    updateSettingsUI();
  }
  
  // Update saved texts list
  function updateSavedTextsList() {
    if (savedTexts.length === 0) {
      noSavedTexts.style.display = 'flex';
      savedTextsList.style.display = 'none';
      return;
    }
    
    noSavedTexts.style.display = 'none';
    savedTextsList.style.display = 'flex';
    savedTextsList.innerHTML = '';
    
    savedTexts.forEach(item => {
      const date = new Date(item.date).toLocaleString();
      
      const textItem = document.createElement('div');
      textItem.className = 'text-item';
      textItem.innerHTML = `
        <div class="text-content">${item.text}</div>
        <div class="text-meta">
          <span>${date}</span>
          <div class="text-actions">
            <button class="text-action-btn copy-btn" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></path>
              </svg>
            </button>
            <button class="text-action-btn delete-btn" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
      
      savedTextsList.appendChild(textItem);
      
      // Add event listeners
      const copyBtn = textItem.querySelector('.copy-btn');
      const deleteBtn = textItem.querySelector('.delete-btn');
      
      copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(item.text).then(() => {
          // Show brief "Copied" message
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
            </svg>
          `;
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
          }, 1000);
        });
      });
      
      deleteBtn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        deleteSavedText(id);
      });
    });
  }
  
  // Update history list
  function updateHistoryList() {
    if (textHistory.length === 0) {
      noHistory.style.display = 'flex';
      historyList.style.display = 'none';
      return;
    }
    
    noHistory.style.display = 'none';
    historyList.style.display = 'flex';
    historyList.innerHTML = '';
    
    textHistory.forEach(item => {
      const date = new Date(item.date).toLocaleString();
      
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <div class="history-content">${item.text}</div>
        <div class="history-meta">
          <span>${date}</span>
          <div class="history-actions">
            <button class="history-action-btn copy-btn" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></path>
              </svg>
            </button>
            ${!item.saved ? `
              <button class="history-action-btn save-btn" data-id="${item.id}">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M17,3H7A2,2 0 0,0 5,5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V5A2,2 0 0,0 17,3M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M7,5H17V8H7V5Z"></path>
                </svg>
              </button>
            ` : ''}
            <button class="history-action-btn delete-btn" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
      
      historyList.appendChild(historyItem);
      
      // Add event listeners
      const copyBtn = historyItem.querySelector('.copy-btn');
      const deleteBtn = historyItem.querySelector('.delete-btn');
      const saveBtn = historyItem.querySelector('.save-btn');
      
      copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(item.text).then(() => {
          // Show brief "Copied" message
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
            </svg>
          `;
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
          }, 1000);
        });
      });
      
      if (saveBtn) {
        saveBtn.addEventListener('click', function() {
          const id = parseInt(this.getAttribute('data-id'));
          const itemToSave = textHistory.find(histItem => histItem.id === id);
          if (itemToSave) {
            saveText(itemToSave);
          }
        });
      }
      
      deleteBtn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        deleteHistoryItem(id);
      });
    });
  }
  
  // Clear history button
  clearHistoryBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear your history? This cannot be undone.')) {
      textHistory = [];
      localStorage.setItem('textHistory', JSON.stringify(textHistory));
      updateHistoryList();
      updateSettingsUI();
    }
  });
  
  // Sync theme toggles
  themeToggle.addEventListener('change', function() {
    settingsThemeToggle.checked = this.checked;
  });
  
  settingsThemeToggle.addEventListener('change', function() {
    themeToggle.checked = this.checked;
    themeToggle.dispatchEvent(new Event('change'));
  });
  
  // Close sidebar when clicking a menu item and switch pages
  document.querySelectorAll('.sidebar-menu a').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default behavior
      
      // Remove active class from all links
      document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
      });
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Get the page to show
      const pageToShow = this.getAttribute('data-page');
      
      // Hide all pages
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
      });
      
      // Show the selected page
      if (pages[pageToShow]) {
        pages[pageToShow].classList.add('active');
        scrollToTop();
        
        // Resize canvas if needed
        if (pageToShow === 'home') {
          resizeCanvas();
        } else if (pageToShow === 'drawing') {
          resizeDrawingCanvas();
        } else if (pageToShow === 'myTexts') {
          updateSavedTextsList();
        } else if (pageToShow === 'history') {
          updateHistoryList();
        } else if (pageToShow === 'settings') {
          updateSettingsUI();
        }
      } else {
        // Fallback to home page
        pages.home.classList.add('active');
        resizeCanvas();
      }
      
      closeSidebarMenu();
    });
  });
  
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  
  // Update status bar time
  function updateStatusTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    statusTime.textContent = `${hours}:${minutes} ${ampm}`;
  }
  
  updateStatusTime();
  setInterval(updateStatusTime, 60000); // Update every minute
  
  // Set canvas size for home page
  function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    clearCanvas(); // Clear canvas on resize
  }
  
  // Set canvas size for drawing studio
  function resizeDrawingCanvas() {
    const container = drawingStudioCanvas.parentElement;
    drawingStudioCanvas.width = container.clientWidth;
    drawingStudioCanvas.height = container.clientHeight;
    redrawDrawingStudio(); // Redraw canvas content after resize
  }
  
  // Drawing studio state
  let drawingHistory = [];
  let currentDrawing = { 
    lines: [],
    currentLine: null 
  };
  
  function saveDrawingState() {
    // Save current drawing state to history
    drawingHistory.push(JSON.parse(JSON.stringify(currentDrawing.lines)));
    // Limit history size to prevent memory issues
    if (drawingHistory.length > 20) {
      drawingHistory.shift();
    }
  }
  
  function redrawDrawingStudio() {
    // Clear the canvas
    drawingCtx.clearRect(0, 0, drawingStudioCanvas.width, drawingStudioCanvas.height);
    
    // Redraw all lines
    currentDrawing.lines.forEach(line => {
      drawingCtx.beginPath();
      drawingCtx.moveTo(line.points[0].x, line.points[0].y);
      
      for (let i = 1; i < line.points.length; i++) {
        drawingCtx.lineTo(line.points[i].x, line.points[i].y);
      }
      
      drawingCtx.strokeStyle = line.color;
      drawingCtx.lineWidth = line.thickness;
      drawingCtx.lineJoin = 'round';
      drawingCtx.lineCap = 'round';
      drawingCtx.stroke();
    });
  }
  
  // Initialize
  function init() {
    resizeCanvas();
    window.addEventListener('resize', () => {
      if (pages.home.classList.contains('active')) {
        resizeCanvas();
      } else if (pages.drawing.classList.contains('active')) {
        resizeDrawingCanvas();
      }
    });
    
    // Home Canvas Mouse Events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Home Canvas Touch Events
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Home Button Events
    convertBtn.addEventListener('click', convertToText);
    clearCanvasBtn.addEventListener('click', clearCanvas);
    clearTextBtn.addEventListener('click', clearText);
    
    // Drawing Studio Canvas Events
    drawingStudioCanvas.addEventListener('mousedown', startDrawingStudio);
    drawingStudioCanvas.addEventListener('mousemove', drawOnStudio);
    drawingStudioCanvas.addEventListener('mouseup', stopDrawingStudio);
    drawingStudioCanvas.addEventListener('mouseout', stopDrawingStudio);
    
    // Drawing Studio Touch Events
    drawingStudioCanvas.addEventListener('touchstart', handleDrawingTouchStart);
    drawingStudioCanvas.addEventListener('touchmove', handleDrawingTouchMove);
    drawingStudioCanvas.addEventListener('touchend', stopDrawingStudio);
    
    // Drawing Studio Button Events
    undoBtn.addEventListener('click', undoLastDrawing);
    clearDrawingBtn.addEventListener('click', clearDrawingStudio);
    clearImageBtn.addEventListener('click', clearBackgroundImage);
    saveDrawingBtn.addEventListener('click', saveDrawingToDevice);
    
    // Image Upload
    imageUploader.addEventListener('change', handleImageUpload);
    imageOpacitySlider.addEventListener('input', updateImageOpacity);
    
    // Set initial image opacity
    updateImageOpacity();
  }
  
  // Drawing Studio Functions
  function startDrawingStudio(e) {
    const [currentX, currentY] = getDrawingStudioPointerPosition(e);
    currentDrawing.currentLine = {
      color: drawingColorPicker.value,
      thickness: drawingThicknessSlider.value,
      points: [{ x: currentX, y: currentY }]
    };
    isDrawing = true;
  }
  
  function drawOnStudio(e) {
    if (!isDrawing) return;
    e.preventDefault();
    
    const [currentX, currentY] = getDrawingStudioPointerPosition(e);
    
    if (currentDrawing.currentLine) {
      currentDrawing.currentLine.points.push({ x: currentX, y: currentY });
      
      // Clear and redraw
      drawingCtx.clearRect(0, 0, drawingStudioCanvas.width, drawingStudioCanvas.height);
      redrawDrawingStudio();
      
      // Draw current line
      drawingCtx.beginPath();
      drawingCtx.moveTo(currentDrawing.currentLine.points[0].x, currentDrawing.currentLine.points[0].y);
      
      for (let i = 1; i < currentDrawing.currentLine.points.length; i++) {
        drawingCtx.lineTo(currentDrawing.currentLine.points[i].x, currentDrawing.currentLine.points[i].y);
      }
      
      drawingCtx.strokeStyle = currentDrawing.currentLine.color;
      drawingCtx.lineWidth = currentDrawing.currentLine.thickness;
      drawingCtx.lineJoin = 'round';
      drawingCtx.lineCap = 'round';
      drawingCtx.stroke();
    }
  }
  
  function stopDrawingStudio() {
    if (isDrawing && currentDrawing.currentLine) {
      saveDrawingState(); // Save the state before adding the new line
      currentDrawing.lines.push(currentDrawing.currentLine);
      currentDrawing.currentLine = null;
    }
    isDrawing = false;
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  function undoLastDrawing() {
    if (drawingHistory.length > 0) {
      currentDrawing.lines = drawingHistory.pop();
      redrawDrawingStudio();
    }
  }
  
  function clearDrawingStudio() {
    saveDrawingState(); // Save state before clearing
    currentDrawing.lines = [];
    drawingCtx.clearRect(0, 0, drawingStudioCanvas.width, drawingStudioCanvas.height);
  }
  
  function clearBackgroundImage() {
    backgroundImage.style.display = 'none';
    backgroundImage.src = '';
  }
  
  function saveDrawingToDevice() {
    // Create a temporary canvas to combine the drawing and background
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = drawingStudioCanvas.width;
    tempCanvas.height = drawingStudioCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw background image if present
    if (backgroundImage.src && backgroundImage.style.display !== 'none') {
      tempCtx.globalAlpha = imageOpacitySlider.value / 100;
      
      // Calculate scaled dimensions to maintain aspect ratio
      const imgWidth = backgroundImage.naturalWidth;
      const imgHeight = backgroundImage.naturalHeight;
      const canvasRatio = tempCanvas.width / tempCanvas.height;
      const imgRatio = imgWidth / imgHeight;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imgRatio > canvasRatio) {
        // Image is wider than canvas
        drawWidth = tempCanvas.width;
        drawHeight = tempCanvas.width / imgRatio;
        drawX = 0;
        drawY = (tempCanvas.height - drawHeight) / 2;
      } else {
        // Image is taller than canvas
        drawHeight = tempCanvas.height;
        drawWidth = tempCanvas.height * imgRatio;
        drawX = (tempCanvas.width - drawWidth) / 2;
        drawY = 0;
      }
      
      tempCtx.drawImage(backgroundImage, drawX, drawY, drawWidth, drawHeight);
      tempCtx.globalAlpha = 1.0;
    }
    
    // Draw the drawing
    currentDrawing.lines.forEach(line => {
      tempCtx.beginPath();
      tempCtx.moveTo(line.points[0].x, line.points[0].y);
      
      for (let i = 1; i < line.points.length; i++) {
        tempCtx.lineTo(line.points[i].x, line.points[i].y);
      }
      
      tempCtx.strokeStyle = line.color;
      tempCtx.lineWidth = line.thickness;
      tempCtx.lineJoin = 'round';
      tempCtx.lineCap = 'round';
      tempCtx.stroke();
    });
    
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = tempCanvas.toDataURL('image/png');
    downloadLink.download = 'drawing-' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
      backgroundImage.src = event.target.result;
      backgroundImage.style.display = 'block';
      updateImageOpacity();
    };
    reader.readAsDataURL(file);
  }
  
  function updateImageOpacity() {
    if (backgroundImage) {
      backgroundImage.style.opacity = imageOpacitySlider.value / 100;
    }
  }
  
  function getDrawingStudioPointerPosition(e) {
    const rect = drawingStudioCanvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    return [x, y];
  }
  
  function handleDrawingTouchStart(e) {
    e.preventDefault();
    document.body.style.overflow = 'hidden'; // Prevent scrolling while drawing
    
    const touch = e.touches[0];
    const rect = drawingStudioCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    currentDrawing.currentLine = {
      color: drawingColorPicker.value,
      thickness: drawingThicknessSlider.value,
      points: [{ x, y }]
    };
    
    isDrawing = true;
  }
  
  function handleDrawingTouchMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = drawingStudioCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (currentDrawing.currentLine) {
      currentDrawing.currentLine.points.push({ x, y });
      
      // Clear and redraw
      drawingCtx.clearRect(0, 0, drawingStudioCanvas.width, drawingStudioCanvas.height);
      redrawDrawingStudio();
      
      // Draw current line
      drawingCtx.beginPath();
      drawingCtx.moveTo(currentDrawing.currentLine.points[0].x, currentDrawing.currentLine.points[0].y);
      
      for (let i = 1; i < currentDrawing.currentLine.points.length; i++) {
        drawingCtx.lineTo(currentDrawing.currentLine.points[i].x, currentDrawing.currentLine.points[i].y);
      }
      
      drawingCtx.strokeStyle = currentDrawing.currentLine.color;
      drawingCtx.lineWidth = currentDrawing.currentLine.thickness;
      drawingCtx.lineJoin = 'round';
      drawingCtx.lineCap = 'round';
      drawingCtx.stroke();
    }
  }
  
  // Drawing Functions
  function startDrawing(e) {
    isDrawing = true;
    // Prevent page scrolling while drawing
    document.body.style.overflowY = 'hidden';
    [lastX, lastY] = getPointerPosition(e);
  }
  
  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    
    const [currentX, currentY] = getPointerPosition(e);
    
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = thicknessSlider.value;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    [lastX, lastY] = [currentX, currentY];
  }
  
  function stopDrawing() {
    isDrawing = false;
    // Allow default scrolling behavior when not drawing
    document.body.style.overflowY = 'auto';
  }
  
  // Enhanced Touch Event Handlers
  function handleTouchStart(e) {
    e.preventDefault();
    document.body.style.overflow = 'hidden'; // Prevent scrolling while drawing
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
    isDrawing = true;
  }
  
  function handleTouchMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = thicknessSlider.value;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    lastX = currentX;
    lastY = currentY;
  }
  
  // Helper Functions
  function getPointerPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return [x, y];
  }
  
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  function clearText() {
    textDisplay.textContent = 'Your converted text will appear here';
  }
  
  // OCR Function with loading indicator
  function convertToText() {
    const loadingHTML = 'Converting... <span class="loading-indicator"></span>';
    textDisplay.innerHTML = loadingHTML;
    
    // Disable button during conversion
    convertBtn.disabled = true;
    convertBtn.style.opacity = '0.7';
    
    // Use Tesseract.js for OCR
    Tesseract.recognize(
      canvas.toDataURL('image/png'),
      'eng',
      { logger: info => console.log(info) }
    ).then(({ data: { text } }) => {
      const result = text.trim();
      const displayText = result.length > 0 ? result : 'No text detected. Try again.';
      textDisplay.innerHTML = displayText;
      
      // Add successful conversions to history
      if (result.length > 0) {
        addToHistory(result);
      }
      
    }).catch(error => {
      console.error('Error during text recognition:', error);
      textDisplay.innerHTML = 'Error converting to text. Try again.';
    }).finally(() => {
      // Re-enable button after conversion
      convertBtn.disabled = false;
      convertBtn.style.opacity = '1';
    });
  }
  
  // Fix for iOS Safari
  document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
  });
  
  // Add button feedback
  [convertBtn, clearCanvasBtn, clearTextBtn].forEach(button => {
    button.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.97)';
    });
    
    button.addEventListener('touchend', function() {
      this.style.transform = '';
    });
  });
  
  // Initialize the app
  init();
  
  // Initialize saved texts, history, and settings
  updateSavedTextsList();
  updateHistoryList();
  updateSettingsUI();
  
  // Apply settings to the drawing tools
  colorPicker.value = settings.defaultColor;
  thicknessSlider.value = settings.defaultThickness;
  drawingColorPicker.value = settings.defaultColor;
  drawingThicknessSlider.value = settings.defaultThickness;
});

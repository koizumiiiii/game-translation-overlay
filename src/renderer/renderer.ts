const { ipcRenderer } = require('electron');

let isDragging = false;
let currentX: number;
let currentY: number;
let initialX: number;
let initialY: number;

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    const box = document.createElement('div');
    box.className = 'translation-box';
    box.style.left = '50px';
    box.style.top = '50px';
    box.textContent = '翻訳ボックス';
    
    box.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    
    overlay.appendChild(box);

    const status = document.createElement('div');
    status.className = 'status-indicator enabled';
    status.textContent = 'Click-through: ON';
    document.body.appendChild(status);
  }
});

function startDragging(e: MouseEvent) {
  const box = e.target as HTMLElement;
  const rect = box.getBoundingClientRect();
  
  isDragging = true;
  initialX = e.clientX - rect.left;
  initialY = e.clientY - rect.top;
}

function drag(e: MouseEvent) {
  if (!isDragging) return;
  
  e.preventDefault();
  currentX = e.clientX - initialX;
  currentY = e.clientY - initialY;
  
  const box = document.querySelector('.translation-box') as HTMLElement;
  if (box) {
    box.style.left = `${currentX}px`;
    box.style.top = `${currentY}px`;
  }
}

function stopDragging() {
  isDragging = false;
}

ipcRenderer.on('overlay-visibility-changed', (_event: any, isVisible: boolean) => {
  console.log('Overlay visibility changed:', isVisible);
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.style.display = isVisible ? 'block' : 'none';
  }
});

ipcRenderer.on('click-through-changed', (_event: any, isClickThrough: boolean) => {
  console.log('Click-through changed:', isClickThrough);
  const status = document.querySelector('.status-indicator');
  if (status) {
    status.textContent = `Click-through: ${isClickThrough ? 'ON' : 'OFF'}`;
    status.className = `status-indicator ${isClickThrough ? 'enabled' : 'disabled'}`;
  }
});
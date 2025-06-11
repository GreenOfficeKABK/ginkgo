// js/popup.js
// Generic popup logic for all pages
window.addEventListener('DOMContentLoaded', function() {
  var popupBtn = document.getElementById('popup-btn');
  var popupModal = document.getElementById('popup-modal');
  var closePopup = document.getElementById('close-popup');
  var ginkgoLogo = document.querySelector('.ginkgo-logo');
  if (popupBtn && popupModal && closePopup) {
    popupBtn.onclick = function() {
      popupModal.style.display = 'flex';
    };
    closePopup.onclick = function() {
      popupModal.style.display = 'none';
    };
    // Allow closing popup by clicking anywhere, even on the content box
    popupModal.addEventListener('click', function() {
      popupModal.style.display = 'none';
    });
  }
  // Always show popup on page load
  if (popupModal) {
    popupModal.style.display = 'flex';
  }
  // Show popup when clicking the ginkgo logo
  if (ginkgoLogo && popupModal) {
    ginkgoLogo.style.cursor = 'pointer';
    ginkgoLogo.addEventListener('click', function() {
      popupModal.style.display = 'flex';
    });
  }
});
// --- Dedicated Welcome Popup for Archive Page ---
window.addEventListener('DOMContentLoaded', function() {
  var welcomeModal = document.getElementById('welcome-modal');
  var closeWelcome = document.getElementById('close-welcome');
  var popupBtn = document.getElementById('popup-btn');
  var popupModal = document.getElementById('popup-modal');
  var closePopup = document.getElementById('close-popup');
  var ginkgoLogo = document.querySelector('.ginkgo-logo');

  // Show both popups on first load if present
  if (welcomeModal) {
    welcomeModal.style.display = 'flex';
    if (closeWelcome) closeWelcome.style.display = 'none';
    // Click anywhere (overlay or content) closes the welcome modal
    welcomeModal.addEventListener('click', function(e) {
      if (e.target === welcomeModal || e.target.classList.contains('popup-modal-content')) {
        welcomeModal.style.display = 'none';
      }
    });
    // Remove stopPropagation so clicking inside also closes
    // (No need for extra event listener)
  }
  if (popupModal && closePopup) {
    popupModal.style.display = 'flex';
    closePopup.style.display = 'none';
    // Click anywhere (overlay or content) closes the popup, but only if welcome modal is not open
    popupModal.addEventListener('click', function(e) {
      if (e.target === popupModal || e.target.classList.contains('popup-modal-content')) {
        if (welcomeModal && welcomeModal.style.display === 'flex') {
          welcomeModal.style.display = 'none';
        } else {
          popupModal.style.display = 'none';
        }
      }
    });
    // Remove stopPropagation so clicking inside also closes
    // (No need for extra event listener)
  }

  // Info button always opens the page-specific popup
  if (popupBtn && popupModal) {
    popupBtn.onclick = function(e) {
      e.stopPropagation();
      popupModal.style.display = 'flex';
    };
  }

  // Ginkgo logo always opens the welcome modal if present
  if (ginkgoLogo && welcomeModal) {
    ginkgoLogo.style.cursor = 'pointer';
    ginkgoLogo.addEventListener('click', function(e) {
      e.stopPropagation();
      welcomeModal.style.display = 'flex';
    });
  }
});
// Close the welcome modal if clicking anywhere on it (including the center container)
document.addEventListener('DOMContentLoaded', function() {
  var welcomeModal = document.getElementById('welcome-modal');
  if (welcomeModal) {
    welcomeModal.addEventListener('click', function() {
      welcomeModal.style.display = 'none';
    });
  }
});

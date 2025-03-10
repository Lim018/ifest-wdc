

document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi AOS jika tersedia
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }

    // Buka filter "Type" secara default
    const typeDropdownMobile = document.getElementById('dropdownList5'); // Mobile
    const typeArrowMobile = document.getElementById('arrowIcon5'); // Mobile
    const typeDropdownDesktop = document.getElementById('dropdownList1'); // Desktop
    const typeArrowDesktop = document.getElementById('arrowIcon1'); // Desktop

    // Untuk Mobile Sidebar
    if (typeDropdownMobile && typeArrowMobile) {
        typeDropdownMobile.classList.add('open');
        typeArrowMobile.classList.add('rotated');
    }

    // Untuk Desktop Sidebar
    if (typeDropdownDesktop && typeArrowDesktop) {
        typeDropdownDesktop.classList.add('open');
        typeArrowDesktop.classList.add('rotated');
    }

    // Logika toggle untuk semua dropdown
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const dropdownId = this.getAttribute('data-target');
            const dropdown = document.getElementById(dropdownId);
            const arrow = this.querySelector('.arrow-icon');

            if (dropdown) {
                dropdown.classList.toggle('open');
                if (arrow) {
                    arrow.classList.toggle('rotated');
                }
            } else {
                console.error(`Dropdown dengan ID ${dropdownId} tidak ditemukan!`);
            }
        });
    });
});
// >>>>>>> 314b79e5f0da74eb8f503641ceeb982426f54506

// Update the wishlist functionality
document.addEventListener("DOMContentLoaded", () => {
    const wishlistButtons = document.querySelectorAll(".wishlist-btn")
    const wishlist = new Set(JSON.parse(localStorage.getItem("wishlist") || "[]"))
  
    // Update initial states
    wishlistButtons.forEach((button, index) => {
      if (wishlist.has(index)) {
        button.classList.add("active")
      }
  
      button.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()
  
        // Toggle active state
        this.classList.toggle("active")
  
        // Reset animation
        const heart = this.querySelector(".heart")
        heart.style.animation = "none"
        heart.offsetHeight // Trigger reflow
        heart.style.animation = null
  
        // Update wishlist
        if (this.classList.contains("active")) {
          wishlist.add(index)
          heart.style.animation = "heartBeat 0.3s ease-out"
        } else {
          wishlist.delete(index)
        }
  
        localStorage.setItem("wishlist", JSON.stringify([...wishlist]))
      })
  
      // Add keyboard support for accessibility
      button.addEventListener("keypress", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          this.click()
        }
      })
    })
  })
  
  
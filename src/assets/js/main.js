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

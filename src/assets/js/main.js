// const slider = document.getElementById('product-slider');
// const boxWidth = slider.children[0].offsetWidth + 20; // Lebar box + gap

// function scrollRight() {
//     slider.scrollBy({ left: boxWidth, behavior: 'smooth' });

//     // Tunggu sampai scroll selesai, baru pindahkan elemen
//     setTimeout(() => {
//         if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
//             slider.appendChild(slider.firstElementChild);
//             slider.scrollLeft -= boxWidth;
//         }
//     }, 300);
// }

// function scrollLeft() {
//     if (slider.scrollLeft <= 0) {
//         slider.prepend(slider.lastElementChild);
//         slider.scrollLeft += boxWidth;
//     }

//     slider.scrollBy({ left: -boxWidth, behavior: 'smooth' });
// }


// AOS.init();

// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener("click", function (e) {
//         e.preventDefault();

//         const target = document.querySelector(this.getAttribute("href"));
//         if (target) {
//             window.scrollTo({
//                 top: target.offsetTop - 50, // Bisa disesuaikan jika ada header fixed
//                 behavior: "smooth"
//             });
//         }
//     });
// });

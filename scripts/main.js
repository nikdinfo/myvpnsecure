console.log('Main.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate closing
            navMenu.classList.toggle('active');

            // Icon toggle
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            console.log('Menu toggled:', navMenu.classList.contains('active'));
        });
    } else {
        console.error('Mobile menu elements not found:', { mobileMenuBtn, navMenu });
    }

    // Mobile Dropdown Toggle
    const dropdowns = document.querySelectorAll('.nav-item-dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');

        if (link) {
            link.addEventListener('click', (e) => {
                // Only on mobile screens
                if (window.innerWidth < 1024) {
                    console.log('Dropdown clicked on mobile');
                    // Check if it has a dropdown menu sibling
                    const menu = dropdown.querySelector('.dropdown-menu');
                    if (menu) {
                        e.preventDefault(); // Prevent navigation
                        e.stopPropagation(); // Prevent menu closing
                        dropdown.classList.toggle('active');
                        console.log('Dropdown toggled:', dropdown.classList.contains('active'));
                    }
                }
            });
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                console.log('Menu closed by outside click');
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerOffset = document.querySelector('header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });

            const navLinks = document.querySelector('.nav-links');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    // Copyright year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Carousel functionality
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => {
        const track = container.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = container.querySelector('.next-btn');
        const prevButton = container.querySelector('.prev-btn');
        const dotsContainer = container.querySelector('.carousel-dots');

        if (!track || slides.length === 0 || !nextButton || !prevButton || !dotsContainer) {
            if (nextButton) nextButton.style.display = 'none';
            if (prevButton) prevButton.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        let slideWidth = 0;

        const updateCarousel = () => {
            // Recalculate slideWidth on update for responsiveness
            if (slides.length > 0) {
                slideWidth = slides[0].getBoundingClientRect().width;
                track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

                const dots = Array.from(dotsContainer.children);
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });

                // Ensure arrows are correctly hidden/shown if only one slide
                if (slides.length <= 1) {
                    nextButton.style.display = 'none';
                    prevButton.style.display = 'none';
                } else {
                    nextButton.style.display = 'block';
                    prevButton.style.display = 'block';
                }
            } else {
                nextButton.style.display = 'none';
                prevButton.style.display = 'none';
                dotsContainer.style.display = 'none';
            }
        };

        if (slides.length > 1) {
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => moveToSlide(index));
                dotsContainer.appendChild(dot);
            });
        } else {
            nextButton.style.display = 'none';
            prevButton.style.display = 'none';
            dotsContainer.style.display = 'none';
        }

        const moveToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        // Initialize and listen for resize
        window.addEventListener('resize', updateCarousel);
        // Use a small timeout to ensure images are loaded and dimensions are correct
        setTimeout(updateCarousel, 100);
        track.addEventListener('load', updateCarousel, true); // Listen for image loads within the track
    });


    // Contact form
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (formStatus) {
                formStatus.textContent = 'Sending message...';
                formStatus.style.color = '#3498db';
            }

            setTimeout(() => {
                const formData = new FormData(contactForm);
                const name = formData.get('name');
                const email = formData.get('email');
                const subject = formData.get('subject');
                const message = formData.get('message');
                console.log('Form Submitted:', { name, email, subject, message });

                if (formStatus) {
                    formStatus.textContent = 'Message sent successfully! Thank you.';
                    formStatus.style.color = 'green';
                }
                contactForm.reset();
            }, 2000);
        });
    }

    // Skill stars
    document.querySelectorAll('.stars').forEach(starsContainer => {
        const rating = parseInt(starsContainer.dataset.rating, 10);
        starsContainer.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const starIcon = document.createElement('i');
            if (i <= rating) {
                starIcon.classList.add('fas', 'fa-star');
            } else {
                starIcon.classList.add('far', 'fa-star');
            }
            starsContainer.appendChild(starIcon);
        }
    });

    // Scroll down arrow logic
    const scrollDownArrow = document.getElementById('scroll-down-arrow');
    const aboutSection = document.getElementById('about');
    function checkAboutScrollArrowVisibility() {
        if (!scrollDownArrow || !aboutSection) return;

        // Get the bottom position of the about section relative to the viewport
        const aboutSectionBottom = aboutSection.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;

        // If the bottom of the about section is within the viewport, hide the arrow.
        // Or if the user has scrolled significantly past the top of the about section.
        if (aboutSectionBottom < windowHeight || window.scrollY > (aboutSection.offsetTop + aboutSection.offsetHeight / 2)) {
            scrollDownArrow.classList.add('hidden');
        } else {
            scrollDownArrow.classList.remove('hidden');
        }
    }


    if (scrollDownArrow && aboutSection) {
        scrollDownArrow.addEventListener('click', function () {
            const headerOffset = document.querySelector('header')?.offsetHeight || 0;
            const offsetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        });
    }
    window.addEventListener('scroll', checkAboutScrollArrowVisibility);
    checkAboutScrollArrowVisibility(); // Initial check on load

    updateArrowImage();
    window.addEventListener('resize', updateArrowImage);
    setupTimelineScrollArrows();
});

function updateArrowImage() {
    const arrowImage = document.querySelector('.arrow-image-wrapper img');
    if (arrowImage) {
        if (window.innerWidth <= 768) {
            arrowImage.src = 'images/Arrow_Vertical.svg';
            arrowImage.alt = 'Decorative Vertical Arrow Element';
        } else {
            arrowImage.src = 'images/arrow.svg';
            arrowImage.alt = 'Decorative Arrow Element';
        }
    }
}

function setupTimelineScrollArrows() {
    const timelineWrappers = document.querySelectorAll('.timeline-content-wrapper');
    timelineWrappers.forEach(wrapper => {
        const timeline = wrapper.querySelector('.timeline');
        if (!timeline) return;

        const leftArrow = document.createElement('div');
        leftArrow.classList.add('timeline-scroll-arrow', 'left', 'hidden');
        leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
        wrapper.appendChild(leftArrow);

        const rightArrow = document.createElement('div');
        rightArrow.classList.add('timeline-scroll-arrow', 'right');
        rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
        wrapper.appendChild(rightArrow);

        const updateArrows = () => {
            // Check if scrollWidth is greater than clientWidth to determine if scrolling is possible
            if (timeline.scrollWidth <= timeline.clientWidth) {
                leftArrow.classList.add('hidden');
                rightArrow.classList.add('hidden');
                return;
            }

            const scrollTolerance = 5; // A small buffer for floating point inaccuracies
            if (timeline.scrollLeft <= scrollTolerance) {
                leftArrow.classList.add('hidden');
            } else {
                leftArrow.classList.remove('hidden');
            }

            if (timeline.scrollLeft + timeline.clientWidth >= timeline.scrollWidth - scrollTolerance) {
                rightArrow.classList.add('hidden');
            } else {
                rightArrow.classList.remove('hidden');
            }
        };

        timeline.addEventListener('scroll', updateArrows);
        leftArrow.addEventListener('click', () => {
            timeline.scrollBy({ left: -300, behavior: 'smooth' });
        });
        rightArrow.addEventListener('click', () => {
            timeline.scrollBy({ left: 300, behavior: 'smooth' });
        });
        window.addEventListener('resize', updateArrows);
        updateArrows(); // Initial update
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (document.body.classList.contains('menu-open')) {
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }

    // Update copyright year
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

        let slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        // Duplicate slides for infinite loop effect
        slides.slice(0, 2).forEach(slide => track.appendChild(slide.cloneNode(true)));
        slides.slice(-2).reverse().forEach(slide => track.prepend(slide.cloneNode(true)));

        const allSlides = Array.from(track.children);
        // Set initial position to account for prepended clones
        track.style.transform = `translateX(-${slideWidth * 2}px)`;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        const updateDots = () => {
            dots.forEach(dot => dot.classList.remove('active'));
            if (currentIndex >= 0 && currentIndex < dots.length) {
                dots[currentIndex].classList.add('active');
            }
        };

        const moveToSlide = (index) => {
            track.style.transition = 'transform 0.5s ease-in-out';
            currentIndex = index;
            track.style.transform = `translateX(-${slideWidth * (currentIndex + 2)}px)`;
            updateDots();
        };

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length) {
                currentIndex++;
                track.style.transform = `translateX(-${slideWidth * (currentIndex + 2)}px)`;
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > -1) {
                currentIndex--;
                track.style.transform = `translateX(-${slideWidth * (currentIndex + 2)}px)`;
            }
        });

        // Infinite loop logic
        track.addEventListener('transitionend', () => {
            if (currentIndex === slides.length) {
                track.style.transition = 'none';
                currentIndex = 0;
                track.style.transform = `translateX(-${slideWidth * 2}px)`;
                updateDots();
            }
            if (currentIndex === -1) {
                track.style.transition = 'none';
                currentIndex = slides.length - 1;
                track.style.transform = `translateX(-${slideWidth * (currentIndex + 2)}px)`;
                updateDots();
            }
        });

        // Recalculate slide width on resize
        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transition = 'none';
            track.style.transform = `translateX(-${slideWidth * (currentIndex + 2)}px)`;
        });
    });

    // Skills star rating generation
    document.querySelectorAll('.stars').forEach(starsContainer => {
        const rating = parseInt(starsContainer.dataset.rating);
        for (let i = 1; i <= 10; i++) {
            const star = document.createElement('i');
            star.classList.add('fas', 'fa-star'); // Default to solid star
            if (i > rating) {
                star.classList.remove('fas');
                star.classList.add('far'); // Use regular star for empty
            }
            starsContainer.appendChild(star);
        }
    });

    // Scroll Down Arrow functionality
    const scrollDownArrow = document.getElementById('scroll-down-arrow');
    if (scrollDownArrow) {
        let scrollTimeout;

        const checkScrollPosition = () => {
            const heroSection = document.getElementById('home'); // Assuming 'home' is your hero section ID
            if (heroSection) {
                const heroBottom = heroSection.getBoundingClientRect().bottom;
                if (heroBottom <= 0) { // If hero section is completely scrolled out of view
                    scrollDownArrow.classList.add('hidden');
                } else {
                    scrollDownArrow.classList.remove('hidden');
                }
            }
        };

        // Initial check on load
        checkScrollPosition();

        // Check on scroll, with a debounce
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(checkScrollPosition, 50); // Debounce to prevent too many calls
        });

        // Smooth scroll on arrow click
        scrollDownArrow.addEventListener('click', () => {
            const heroSection = document.getElementById('home');
            if (heroSection) {
                const targetScroll = heroSection.offsetHeight; // Scroll to the end of the hero section
                window.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Function to update the arrow image based on screen width
    function updateArrowImage() {
        const arrowImage = document.querySelector('.arrow-image-wrapper img');
        if (arrowImage) {
            if (window.innerWidth <= 768) { // Mobile breakpoint
                arrowImage.src = 'images/Arrow_Vertical.svg';
                arrowImage.alt = 'Decorative Vertical Arrow Element';
            } else {
                arrowImage.src = 'images/arrow.svg';
                arrowImage.alt = 'Decorative Arrow Element';
            }
        }
    }

    // Run on page load
    updateArrowImage();

    // Run on window resize
    window.addEventListener('resize', updateArrowImage);

});
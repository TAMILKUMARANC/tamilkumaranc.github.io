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
            // Hide buttons/dots if there are no or single slides
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

    // Contact form (simulated submission) - REMOVED FORM HTML, so this block is now effectively commented out.
    // Kept for reference if the form was ever re-added.
    /*
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
            }, 2000); // 2-second delay for demonstration
        });
    }
    */

    // Skill stars rendering
    document.querySelectorAll('.stars').forEach(starsContainer => {
        const rating = parseInt(starsContainer.dataset.rating, 10);
        starsContainer.innerHTML = ''; // Clear existing content
        for (let i = 1; i <= 10; i++) {
            const starIcon = document.createElement('i');
            if (i <= rating) {
                starIcon.classList.add('fas', 'fa-star'); // Filled star
            } else {
                starIcon.classList.add('far', 'fa-star'); // Empty star
            }
            starsContainer.appendChild(starIcon);
        }
    });

    // Scroll indicator logic (Show/hide arrow with JS-driven fade)
    const scrollIndicator = document.getElementById('scrollIndicator');
    const heroSection = document.getElementById('home'); // The hero section
    const aboutSection = document.getElementById('about'); // The target section for clicking the arrow

    // Function to animate opacity (ease-out effect in JS)
    // This is a generic animation helper that can be used for any element's opacity
    function animateFade(element, targetOpacity, duration) {
        if (!element) return;

        // Stop any ongoing animation to prevent conflicts
        if (element.animationFrameId) {
            cancelAnimationFrame(element.animationFrameId);
        }

        const startOpacity = parseFloat(element.style.opacity || 1); // Get current opacity, default to 1
        const startTime = performance.now();

        function step(currentTime) {
            const elapsedTime = currentTime - startTime;
            let progress = Math.min(elapsedTime / duration, 1);

            // Apply ease-out function (Cubic ease-out)
            // This is a common easing function that starts fast and slows down.
            progress = 1 - Math.pow(1 - progress, 3);

            const newOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
            element.style.opacity = newOpacity;

            if (progress < 1) {
                element.animationFrameId = requestAnimationFrame(step); // Store ID to cancel later
            } else {
                // Animation finished: ensure final state is exact and clean up
                element.style.opacity = targetOpacity;
                if (targetOpacity === 0) {
                    element.style.pointerEvents = 'none'; // Disable clicks when fully hidden
                    element.classList.add('hidden'); // Add class for semantic state/other CSS properties
                } else {
                    element.style.pointerEvents = 'auto'; // Enable clicks when visible
                    element.classList.remove('hidden'); // Remove class
                }
                element.animationFrameId = null; // Clear animation ID
            }
        }
        element.animationFrameId = requestAnimationFrame(step); // Start the animation
    }

    let isIndicatorVisible = true; // Track the current visual state of the indicator

    const handleScrollIndicatorVisibility = () => {
        if (!scrollIndicator || !heroSection) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroSectionRect = heroSection.getBoundingClientRect();

        // Calculate the absolute bottom position of the hero section
        const heroSectionBottomAbsolute = heroSectionRect.bottom + window.pageYOffset;

        // Determine if the indicator *should* be visible based on scroll position.
        // It should be visible if the top of the viewport is within the hero section,
        // allowing for a small buffer near the bottom of the hero section.
        const bufferHeight = window.innerHeight * 0.2; // 20% of viewport height as buffer
        const shouldBeVisible = (scrollTop < (heroSectionBottomAbsolute - bufferHeight));

        if (shouldBeVisible && !isIndicatorVisible) {
            // If it should be visible but is currently hidden, fade it in
            animateFade(scrollIndicator, 1, 300); // Fade in over 300ms
            isIndicatorVisible = true;
        } else if (!shouldBeVisible && isIndicatorVisible) {
            // If it should be hidden but is currently visible, fade it out
            animateFade(scrollIndicator, 0, 300); // Fade out over 300ms
            isIndicatorVisible = false;
        }
    };

    if (scrollIndicator && heroSection && aboutSection) {
        // Initial setup for the indicator's style before any scrolling or animation
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
        scrollIndicator.classList.remove('hidden'); // Ensure it starts visible

        // Scroll to the "About Me" section when the indicator is clicked
        scrollIndicator.addEventListener('click', () => {
            const headerOffset = document.querySelector('header')?.offsetHeight || 0;
            // Scroll to the top of the 'about' section, adjusted for fixed header
            const offsetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });

        // Add the scroll event listener and perform an initial check on load
        window.addEventListener('scroll', handleScrollIndicatorVisibility);
        handleScrollIndicatorVisibility();
    }


    // Function to update arrow image based on screen size (Vertical for mobile, Horizontal for desktop)
    function updateArrowImage() {
        const arrowImage = document.querySelector('.arrow-image-wrapper img');
        if (arrowImage) {
            if (window.innerWidth <= 768) { // Assuming 768px as the breakpoint for mobile
                arrowImage.src = 'images/Arrow_Vertical.svg';
                arrowImage.alt = 'Decorative Vertical Arrow Element';
            } else {
                arrowImage.src = 'images/arrow.svg';
                arrowImage.alt = 'Decorative Arrow Element';
            }
        }
    }
    // Call on load and on window resize
    window.addEventListener('resize', updateArrowImage);
    updateArrowImage(); // Initial call
});

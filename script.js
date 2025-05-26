document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            // Calculate offset for sticky header
            const headerOffset = document.querySelector('header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // -20 for a little extra padding

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // Close mobile menu if open
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
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
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

        if (!track || slides.length === 0 || !nextButton || !prevButton || !dotsContainer) {
            // console.warn("Skipping carousel initialization for a container due to missing elements or no slides.");
            // Hide buttons and dots if carousel is not functional or has only one slide
            if (nextButton) nextButton.style.display = 'none';
            if (prevButton) prevButton.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        let slideWidth = slides[0].getBoundingClientRect().width;

        // Create dots
        if (slides.length > 1) {
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => moveToSlide(index));
                dotsContainer.appendChild(dot);
            });
        } else {
            // Hide buttons and dots if only one slide
            if (nextButton) nextButton.style.display = 'none';
            if (prevButton) prevButton.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
        }

        const dots = Array.from(dotsContainer.children);

        const updateCarousel = () => {
            slideWidth = slides[0].getBoundingClientRect().width; // Recalculate on update
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            // Update active dot
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

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

        // Recalculate slide width on window resize
        window.addEventListener('resize', updateCarousel);
        // Initial update
        updateCarousel();
    });

    // Basic Contact Form Handling (Frontend Only)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent actual form submission

            if (formStatus) {
                formStatus.textContent = 'Sending message...';
                formStatus.style.color = '#3498db'; // Primary color for pending
            }

            // Simulate network request
            setTimeout(() => {
                const formData = new FormData(contactForm);
                const name = formData.get('name');
                const email = formData.get('email');
                const subject = formData.get('subject');
                const message = formData.get('message');

                console.log('Form Submitted (for demonstration):', { name, email, subject, message });

                if (formStatus) {
                    formStatus.textContent = 'Message sent successfully! Thank you.';
                    formStatus.style.color = 'green';
                }
                contactForm.reset(); // Clear form fields
            }, 2000); // Simulate 2-second delay
        });
    }

    // Skill Star Rating Generation
    document.querySelectorAll('.stars').forEach(starsContainer => {
        const rating = parseInt(starsContainer.dataset.rating, 10); // Get rating from data-rating attribute
        starsContainer.innerHTML = ''; // Clear existing content

        const totalStars = 10; // Assuming a 1-10 rating system

        for (let i = 1; i <= totalStars; i++) {
            const starIcon = document.createElement('i');
            if (i <= rating) {
                starIcon.classList.add('fas', 'fa-star'); // Solid star for filled rating
            } else {
                starIcon.classList.add('far', 'fa-star'); // Outline star for empty rating
            }
            starsContainer.appendChild(starIcon);
        }
    });

    // --- Scroll Down Arrow Logic ---
    const scrollDownArrow = document.getElementById('scroll-down-arrow');
    const heroSection = document.getElementById('home'); 

    function checkScrollArrowVisibility() {
        if (!scrollDownArrow || !heroSection) return;

        const heroHeight = heroSection.offsetHeight; 
        const scrollPosition = window.scrollY;

        if (scrollPosition > heroHeight - 50) { 
            scrollDownArrow.classList.add('hidden');
        } else {
            scrollDownArrow.classList.remove('hidden');
        }
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

    // Attach the scroll event listener
    window.addEventListener('scroll', checkScrollArrowVisibility);
    // Run the check once on page load to set initial visibility
    checkScrollArrowVisibility();

    // Run arrow image update on page load and resize
    updateArrowImage();
    window.addEventListener('resize', updateArrowImage);
});

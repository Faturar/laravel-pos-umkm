document.querySelectorAll('.password-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const passwordInput = btn.previousElementSibling; // The input associated with this button
        const hideIcon = btn.querySelector('#hide-pass');
        const showIcon = btn.querySelector('#show-pass');

        // Toggle the input type
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            hideIcon.classList.add('hidden');
            showIcon.classList.remove('hidden');
        } else {
            passwordInput.type = 'password';
            hideIcon.classList.remove('hidden');
            showIcon.classList.add('hidden');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    let currentSlideIndex = 0;
    const slideDuration = 5000; // 10 seconds

    // Function to show a specific slide
    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.remove('hidden');
                setTimeout(() => {
                    slide.style.opacity = '1';
                }, 10); // Slight delay to trigger CSS transition
            } else {
                slide.style.opacity = '0';
                slide.addEventListener('transitionend', () => {
                    if (slide.style.opacity === '0') {
                        slide.classList.add('hidden');
                    }
                }, { once: true }); // Ensure the event listener is called only once
            }
        });
    };

    // Show the initial slide
    showSlide(currentSlideIndex);

    // Function to go to the next slide
    const nextSlide = () => {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    };

    // Function to go to the previous slide
    const prevSlide = () => {
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        showSlide(currentSlideIndex);
    };

    // Event listeners for buttons
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Auto-play functionality
    let autoplayInterval = setInterval(nextSlide, slideDuration);

    // Reset autoplay on manual interaction
    [nextButton, prevButton].forEach((button) =>
        button.addEventListener('click', () => {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(nextSlide, slideDuration);
        })
    );
});

document.addEventListener('DOMContentLoaded', () => {
    const closeAlertButton = document.getElementById('close-alert');
    const alertBox = document.getElementById('wrong-pass-alert');

    closeAlertButton.addEventListener('click', () => {
        alertBox.remove(); // Removes the alert box from the DOM
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const scrollProgress = document.getElementById('scroll-progress');
    const form = document.querySelector('form[name="submit-to-google-sheet"]');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const formMessage = document.getElementById('form-message');

    // Sticky Navbar & Scroll Progress
    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";
    });

    // Mobile Menu Toggle
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenu.classList.remove('active');
    }));

    // Fade In Animation on Scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Form Submission Logic
    // REPLACE 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL' WITH THE ACTUAL URL AFTER DEPLOYMENT
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzGwzVeRh61I4vI6UsO3HFzRHgmUVNZd2cNpd1tBC3s9cGr_ND12SPc1CeuiXQkxMg5/exec';

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic Validation (HTML5 handles most)
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Show Loading State
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            formMessage.textContent = '';
            formMessage.className = 'form-message';

            // IMPORTANT: Since we don't have the real script URL yet, we will mimic a success response
            // ONLY IF the placeholder is still there. If user replaced it, we try to fetch.

            if (scriptURL === '1kFuP4BDMzuylNJiuAu8Vy7CIhv0jwg3HgT2ih2E8NrI') {
                // Simulate delay for demo purposes
                setTimeout(() => {
                    handleSuccess();
                }, 1500);
            } else {
                fetch(scriptURL, { method: 'POST', body: new FormData(form) })
                    .then(response => {
                        handleSuccess();
                    })
                    .catch(error => {
                        handleError(error);
                    });
            }
        });
    }

    function handleSuccess() {
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoading.style.display = 'none';

        formMessage.className = 'form-message success-message';
        formMessage.innerHTML = 'Thank you for registering for SUNBEAM InnovX Hackathon.<br>Your official hackathon login details will be shared soon.';

        form.reset();
    }

    function handleError(error) {
        console.error('Error!', error.message);
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoading.style.display = 'none';

        formMessage.className = 'form-message error-message';
        formMessage.textContent = 'Something went wrong. Please try again later.';
    }
});

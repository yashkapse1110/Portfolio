/* ==========================================================================
   YASH KAPSE PORTFOLIO INTERACTIVITY & SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Drawer Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            const isOpen = navLinks.classList.contains('mobile-open');
            mobileToggle.innerHTML = isOpen ? '✕' : '☰';
            mobileToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close mobile drawer when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                mobileToggle.innerHTML = '☰';
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 2. Dynamic Typing Effect for Hero Subtitle
    const typingElement = document.getElementById('typing-role');
    const roles = [
        "Software Development Engineer (SDE)",
        "Final Year Computer Engineering Student",
        "Full-Stack & Cloud Systems Architect",
        "Data Structures & Algorithms Enthusiast"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        if (!typingElement) return;
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 45;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 400; // Pause before typing new word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();

    // 3. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNav);

    // 4. Skills Filtering Tabs
    const skillFilters = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    skillFilters.forEach(button => {
        button.addEventListener('click', () => {
            skillFilters.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 5. One-Click Copy Email with Tooltip & Toast (with robust clipboard fallback)
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailToCopy = "yashkapse11102005@gmail.com";

    function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((resolve, reject) => {
                const successful = document.execCommand('copy');
                textArea.remove();
                if (successful) resolve();
                else reject(new Error('execCommand copy failed'));
            });
        }
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            copyTextToClipboard(emailToCopy).then(() => {
                const originalText = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = '✓ Copied!';
                copyEmailBtn.style.color = '#10b981';
                showToast('Email address copied to clipboard!');

                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalText;
                    copyEmailBtn.style.color = '';
                }, 2500);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                showToast('Email: ' + emailToCopy);
            });
        });
    }

    // 6. Resume Modal Controls
    const resumeModal = document.getElementById('resume-modal');
    const openResumeBtns = document.querySelectorAll('.open-resume-btn');
    const closeResumeBtn = document.getElementById('close-resume-btn');
    const printResumeBtn = document.getElementById('print-resume-btn');

    openResumeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (resumeModal) {
                resumeModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeResumeBtn && resumeModal) {
        closeResumeBtn.addEventListener('click', () => {
            resumeModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close on background click
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                resumeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
                resumeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (printResumeBtn) {
        printResumeBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // 7. Interactive Contact Form Submission & Toast
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate Network Request
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            if (!nameInput.value || !emailInput.value || !messageInput.value) {
                showToast('Please fill out all required fields.');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="pulse-dot"></span> Sending Message...';
            }

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message 🚀';
                }
                showToast(`Thank you, ${nameInput.value}! Your message has been received.`);
                contactForm.reset();
            }, 1200);
        });
    }

    // 8. Toast Notification Utility
    function showToast(message) {
        let toast = document.getElementById('portfolio-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'portfolio-toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }

        toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }
});

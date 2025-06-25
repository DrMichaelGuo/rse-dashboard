// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation clicks
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.insight-card, .app-card, .challenge-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for stats
    const animateCounter = (element, target) => {
        let count = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                element.textContent = target + (target === 85 ? '%' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(count) + (target === 85 ? '%' : '');
            }
        }, 20);
    };

    // Trigger counter animation when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    if (text === '6') {
                        animateCounter(stat, 6);
                    } else if (text === '2025') {
                        animateCounter(stat, 2025);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // Application card filtering (interactive feature)
    const createFilterButtons = () => {
        const applicationsSection = document.querySelector('.applications-section .container');
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        filterContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        `;

        const categories = ['all', 'automation', 'analysis', 'strategy', 'compliance', 'emerging', 'implementation'];
        const categoryLabels = {
            'all': 'All',
            'automation': 'Automation',
            'analysis': 'Analytics',
            'strategy': 'Strategy',
            'compliance': 'Compliance',
            'emerging': 'Emerging',
            'implementation': 'Implementation'
        };

        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = categoryLabels[category];
            button.className = 'filter-btn' + (category === 'all' ? ' active' : '');
            button.style.cssText = `
                padding: 0.5rem 1rem;
                border: 2px solid #007AFF;
                background: ${category === 'all' ? '#007AFF' : 'transparent'};
                color: ${category === 'all' ? 'white' : '#007AFF'};
                border-radius: 20px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            `;

            button.addEventListener('click', () => filterApplications(category, button));
            filterContainer.appendChild(button);
        });

        const sectionTitle = applicationsSection.querySelector('.section-title');
        sectionTitle.insertAdjacentElement('afterend', filterContainer);
    };

    const filterApplications = (category, activeButton) => {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'transparent';
            btn.style.color = '#007AFF';
        });
        
        activeButton.classList.add('active');
        activeButton.style.background = '#007AFF';
        activeButton.style.color = 'white';

        // Filter cards
        const cards = document.querySelectorAll('.app-card');
        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    };

    // Initialize filter buttons
    createFilterButtons();

    // Add scroll progress indicator
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 70px;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #007AFF, #30D158);
            z-index: 1000;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.scrollY;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercentage + '%';
        });
    };

    createScrollProgress();

    // Add interactive hover effects for cards
    const addHoverEffects = () => {
        const cards = document.querySelectorAll('.insight-card, .app-card, .challenge-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    };

    addHoverEffects();

    // Add particle animation background (subtle)
    const createParticles = () => {
        const particlesContainer = document.createElement('div');
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(0, 122, 255, 0.1);
                border-radius: 50%;
                animation: float-particle ${5 + Math.random() * 10}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }

        document.body.appendChild(particlesContainer);

        // Add CSS animation for particles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-particle {
                0% {
                    transform: translateY(0px) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    };

    createParticles();

    // Add loading animation
    const showLoadingComplete = () => {
        setTimeout(() => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        }, 100);
    };

    showLoadingComplete();
});

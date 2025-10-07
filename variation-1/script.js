// Interactive functionality for the comparison table

class ComparisonTableCarousel {
    constructor() {
        this.currentIndex = 0;
        this.totalPlans = 4;
        this.plansPerView = this.getPlansPerView();

        // DOM elements
        this.headerTrack = document.querySelector('.header-track');
        this.dataTracks = document.querySelectorAll('.data-track');
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        this.indicatorsContainer = document.querySelector('.carousel-indicators');

        this.init();
    }

    getPlansPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 2;  // Mobile
        if (width <= 1024) return 2; // Tablet - show 2
        return 3; // Desktop - show 3
    }

    init() {
        this.createIndicators();
        this.updateView();
        this.attachEventListeners();

        // Handle window resize
        window.addEventListener('resize', () => {
            const newPlansPerView = this.getPlansPerView();
            if (newPlansPerView !== this.plansPerView) {
                this.plansPerView = newPlansPerView;
                this.currentIndex = Math.min(this.currentIndex, this.getMaxIndex());
                this.updateView();
                this.createIndicators();
            }
        });
    }

    createIndicators() {
        const numPages = Math.ceil(this.totalPlans / this.plansPerView);
        this.indicatorsContainer.innerHTML = '';

        for (let i = 0; i < numPages; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            indicator.dataset.page = i;
            indicator.addEventListener('click', () => this.goToPage(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    getMaxIndex() {
        return Math.max(0, this.totalPlans - this.plansPerView);
    }

    updateView() {
        // Calculate transform offset based on screen size
        const width = window.innerWidth;
        let cellWidth = 264; // Default desktop

        if (width <= 768) {
            // Mobile: calculate based on viewport width
            const viewportWidth = window.innerWidth - 32; // Account for padding
            cellWidth = (viewportWidth / 2) + 4; // 50% width + gap
        } else if (width <= 1024) {
            cellWidth = 264; // Tablet
        }

        const offset = -this.currentIndex * cellWidth;

        // Update header track
        if (this.headerTrack) {
            this.headerTrack.style.transform = `translateX(${offset}px)`;
        }

        // Update all data tracks
        this.dataTracks.forEach(track => {
            track.style.transform = `translateX(${offset}px)`;
        });

        // Update buttons
        this.updateButtons();

        // Update indicators
        this.updateIndicators();
    }

    updateButtons() {
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
            this.nextBtn.disabled = this.currentIndex >= this.getMaxIndex();
        }
    }

    updateIndicators() {
        const indicators = this.indicatorsContainer.querySelectorAll('.carousel-indicator');
        const currentPage = Math.floor(this.currentIndex / this.plansPerView);

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentPage);
        });

        // Update pagination text
        this.updatePaginationText();
    }

    updatePaginationText() {
        const paginationText = document.getElementById('paginationText');
        const mobilePaginationText = document.getElementById('mobilePaginationText');
        const startCover = this.currentIndex + 1;
        const endCover = Math.min(this.currentIndex + this.plansPerView, this.totalPlans);
        const text = `Showing covers ${startCover}-${endCover} of ${this.totalPlans}`;

        if (paginationText) {
            paginationText.textContent = text;
        }
        if (mobilePaginationText) {
            mobilePaginationText.textContent = text;
        }
    }

    goToPage(pageIndex) {
        this.currentIndex = pageIndex * this.plansPerView;
        this.currentIndex = Math.min(this.currentIndex, this.getMaxIndex());
        this.updateView();
    }

    next() {
        if (this.currentIndex < this.getMaxIndex()) {
            this.currentIndex++;
            this.updateView();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateView();
        }
    }

    attachEventListeners() {
        // Button navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        };

        const tracks = [this.headerTrack, ...this.dataTracks].filter(Boolean);

        tracks.forEach(track => {
            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.next();
            }
        });
    }
}

// Accordion functionality
class AccordionManager {
    constructor() {
        this.init();
    }

    init() {
        const triggers = document.querySelectorAll('.accordion-trigger');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAccordion(trigger);
            });
        });
    }

    toggleAccordion(trigger) {
        const accordionId = trigger.getAttribute('data-accordion');
        const content = document.getElementById(accordionId);
        const contentData = document.getElementById(accordionId + '-data');

        // Toggle active class on trigger
        trigger.classList.toggle('active');

        // Toggle active class on content
        if (content) {
            content.classList.toggle('active');
        }

        // Toggle active class on content data
        if (contentData) {
            contentData.classList.toggle('active');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    const carousel = new ComparisonTableCarousel();

    // Initialize accordion
    const accordion = new AccordionManager();

    // Add click handlers to "Select cover" buttons
    const selectButtons = document.querySelectorAll('.btn-primary');
    selectButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            console.log(`Selected plan ${index + 1}`);
            alert(`You selected plan ${index + 1}: Basic Care Hospital Plus`);
        });
    });

    // Add click handlers to "Inclusion" links
    const inclusionLinks = document.querySelectorAll('.link-button');
    inclusionLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Clicked inclusion link ${index + 1}`);
            alert(`Learn more about inclusion ${index + 1}`);
        });
    });

    // Add click handlers to restricted links
    const restrictedLinks = document.querySelectorAll('.restricted-link');
    restrictedLinks.forEach((link, index) => {
        link.addEventListener('click', function() {
            console.log(`Clicked restricted link ${index + 1}`);
            alert(`Learn more about restrictions`);
        });
        link.style.cursor = 'pointer';
    });

    console.log('Comparison table initialized with responsive carousel');
});

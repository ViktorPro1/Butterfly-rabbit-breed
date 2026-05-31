'use strict';

(function () {

    // ============================================================
    // STICKY NAV — підсвічування активного розділу при скролі
    // ============================================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');

    function getActiveSectionId() {
        const scrollY = window.scrollY;
        const navHeight = document.getElementById('sticky-nav')?.offsetHeight || 0;
        const offset = navHeight + 20;

        let activeId = null;

        sections.forEach(function (section) {
            const top = section.getBoundingClientRect().top + scrollY - offset;
            if (scrollY >= top) {
                activeId = section.id;
            }
        });

        return activeId;
    }

    function updateActiveNav() {
        const activeId = getActiveSectionId();

        navLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === '#' + activeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    let scrollTimer = null;

    window.addEventListener('scroll', function () {
        if (scrollTimer) return;
        scrollTimer = requestAnimationFrame(function () {
            updateActiveNav();
            scrollTimer = null;
        });
    }, { passive: true });

    // Початкова перевірка
    updateActiveNav();

    // ============================================================
    // ПЛАВНИЙ СКРОЛ для посилань навігації
    // ============================================================
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const navHeight = document.getElementById('sticky-nav')?.offsetHeight || 0;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        });
    });

    // ============================================================
    // HERO — зміщення фону при скролі (parallax)
    // ============================================================
    const hero = document.querySelector('.hero');

    if (hero && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        window.addEventListener('scroll', function () {
            const scrolled = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrolled < heroHeight) {
                hero.style.backgroundPositionY = Math.round(scrolled * 0.35) + 'px';
            }
        }, { passive: true });
    }

    // ============================================================
    // FADE-IN анімація для секцій при появі у viewport
    // ============================================================
    const animTargets = document.querySelectorAll(
        '.stat-card, .char-card, .variety-card, .feed-card, .timeline__item, .rule-item, .schedule-item'
    );

    if ('IntersectionObserver' in window) {
        animTargets.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(18px)';
            el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        animTargets.forEach(function (el) {
            observer.observe(el);
        });
    }

    // ============================================================
    // STICKY NAV — автоскрол активного пункту в зону видимості
    // ============================================================
    function scrollNavToActive() {
        const activeLink = document.querySelector('.nav-link.active');
        if (!activeLink) return;

        const navList = document.querySelector('.sticky-nav__list');
        if (!navList) return;

        const linkLeft = activeLink.offsetLeft;
        const linkWidth = activeLink.offsetWidth;
        const listWidth = navList.offsetWidth;
        const scrollLeft = navList.scrollLeft;

        if (linkLeft < scrollLeft || linkLeft + linkWidth > scrollLeft + listWidth) {
            navList.scrollTo({
                left: linkLeft - listWidth / 2 + linkWidth / 2,
                behavior: 'smooth'
            });
        }
    }

    window.addEventListener('scroll', function () {
        scrollNavToActive();
    }, { passive: true });

    // ============================================================
    // ЗОБРАЖЕННЯ — fallback якщо файл відсутній
    // ============================================================
    const allImages = document.querySelectorAll('img');

    allImages.forEach(function (img) {
        img.addEventListener('error', function () {
            img.style.background = '#e8e4dc';
            img.style.minHeight = '200px';
            img.alt = img.alt || 'Зображення відсутнє';
            img.removeAttribute('src');

            const placeholder = document.createElement('span');
            placeholder.textContent = '[ ' + (img.alt || 'фото') + ' ]';
            placeholder.style.cssText =
                'display:flex;align-items:center;justify-content:center;' +
                'height:200px;color:#9a9890;font-size:0.8125rem;text-align:center;padding:1rem;';

            if (img.parentNode) {
                img.parentNode.insertBefore(placeholder, img);
                img.style.display = 'none';
            }
        });
    });

})();
/**
 * Радио Грязный Ли — JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===================================
    // Аудиоплеер
    // ===================================
    const audio = document.getElementById('radio-audio');
    const playBtn = document.querySelector('.player-play');
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');
    const volumeBtn = document.querySelector('.volume-btn');
    const volumeSlider = document.querySelector('.volume-slider');
    const coverIcon = document.querySelector('.cover-icon');

    // ===========================================
    // ⚠️ ВСТАВЬ ССЫЛКУ НА СВОЙ РАДИОПОТОК ⚠️
    // ===========================================
    const streamUrl = 'https://myradio24.org/63652';
    // ===========================================

    // Список джинглов в папке jingles
    const jingles = [
        'jingles/jingle1.mp3',
        'jingles/jingle2.mp3',
        'jingles/jingle3.mp3'
    ];

    let isPlaying = false;
    let isSourceSet = false;
    let jinglePlayed = false; // Флаг: был ли сыгран джингл
    let firstPlay = true; // Флаг: первое ли нажатие Play

    // Случайный джингл
    function getRandomJingle() {
        const randomIndex = Math.floor(Math.random() * jingles.length);
        return jingles[randomIndex];
    }

    // Восстанавливаем состояние из localStorage
    function restoreState() {
        const savedTime = localStorage.getItem('radioTime');
        const savedVolume = localStorage.getItem('radioVolume');

        // Восстанавливаем громкость
        if (savedVolume) {
            audio.volume = parseFloat(savedVolume);
            volumeSlider.value = savedVolume * 100;
        }
    }

    // Сохраняем состояние в localStorage
    function saveState() {
        localStorage.setItem('radioTime', audio.currentTime.toString());
        localStorage.setItem('radioVolume', audio.volume.toString());
        localStorage.setItem('radioPlaying', isPlaying.toString());
    }

    // Воспроизведение/пауза
    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            coverIcon.style.animation = 'none';
        } else {
            // При первом нажатии — играем случайный джингл
            if (firstPlay && jingles.length > 0) {
                const jingleUrl = getRandomJingle();
                audio.src = jingleUrl;
                firstPlay = false;
                console.log('🎵 Играет джингл:', jingleUrl);

                // После окончания джингла переключаемся на основной поток без задержки
                audio.addEventListener('ended', function onJingleEnd() {
                    audio.src = streamUrl;
                    audio.load(); // Предзагружаем поток
                    audio.play().catch(error => {
                        console.log('Ошибка воспроизведения потока:', error);
                    });
                    audio.removeEventListener('ended', onJingleEnd);
                }, { once: true });
            } else {
                if (!isSourceSet) {
                    audio.src = streamUrl;
                    isSourceSet = true;
                }
            }
            audio.play().catch(error => {
                console.log('Ошибка воспроизведения:', error);
                simulatePlayback();
            });
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            coverIcon.style.animation = 'bounce 0.5s ease infinite alternate';
        }
        isPlaying = !isPlaying;
        saveState();
    }

    // Имитация для демо
    function simulatePlayback() {
        console.log('Playing live stream...');
    }

    // Обработчики событий плеера
    playBtn.addEventListener('click', togglePlay);

    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value / 100;
        saveState();
    });

    volumeBtn.addEventListener('click', function() {
        if (audio.muted) {
            audio.muted = false;
            volumeSlider.value = audio.volume * 100;
        } else {
            audio.muted = true;
            volumeSlider.value = 0;
        }
        saveState();
    });

    // Сохраняем состояние при изменении времени воспроизведения
    audio.addEventListener('timeupdate', function() {
        saveState();
    });

    // Восстанавливаем состояние при загрузке страницы
    restoreState();

    // Кнопка Play в hero секции
    const heroPlayBtn = document.querySelector('.play-btn');
    if (heroPlayBtn) {
        heroPlayBtn.addEventListener('click', function() {
            if (!isPlaying) {
                togglePlay();
            }
        });
    }
    
    // ===================================
    // Мобильное меню
    // ===================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Блокируем скролл для iOS
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }

    if (mobileMenuBtn) {
        // Используем touchstart для быстрого отклика на мобильных
        mobileMenuBtn.addEventListener('click', openMobileMenu);
        mobileMenuBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            openMobileMenu();
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
        mobileMenuClose.addEventListener('touchend', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('touchend', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    }

    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
        link.addEventListener('touchend', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    });

    // Закрытие меню при свайпе
    let touchStartY = 0;
    let touchEndY = 0;

    const mobileMenuContent = document.querySelector('.mobile-menu-content');
    if (mobileMenuContent) {
        mobileMenuContent.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        mobileMenuContent.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].clientY;
            const swipeDistance = touchStartY - touchEndY;
            // Если свайп вверх на 100px и больше — закрываем меню
            if (swipeDistance > 100) {
                closeMobileMenu();
            }
        }, { passive: true });
    }
    
    // ===================================
    // Плавный скролл к якорям
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 70;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ===================================
    // Анимация шапки при скролле
    // ===================================
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
    
    // ===================================
    // Анимация появления элементов
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.about-card, .contact-btn');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===================================
    // Параллакс эффект для hero
    // ===================================
    const heroVisual = document.querySelector('.hero-visual');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        if (heroVisual && scrolled < window.innerHeight) {
            heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
    
    console.log('🎸 Радио Грязный Ли — on air!');
});

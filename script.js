/**
 * ════════════════════════════════════════════════════════════════
 * MTechCore / Losungs — Главный JavaScript файл
 * ════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// КОНФИГУРАЦИЯ
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
    projectsFile: 'data/projects.json',
    typewriterTexts: [
        'Создаём будущее кодом',
        'Open Source энтузиасты',
        'Технологии для людей',
        'Делимся знаниями'
    ],
    typewriterSpeed: 100,
    typewriterPause: 2000
};

// ═══════════════════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initTypewriter();
    loadProjects();
    initSmoothScroll();
    initCounterAnimation();
    setCurrentYear();
});

// ═══════════════════════════════════════════════════════════════
// МОБИЛЬНОЕ МЕНЮ (бургер)
// ═══════════════════════════════════════════════════════════════

function initMobileMenu() {
    const burger = document.getElementById('burger');
    const navList = document.getElementById('navList');
    
    if (!burger || !navList) return;
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navList.classList.toggle('active');
    });
    
    // Закрываем меню при клике на ссылку
    navList.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navList.classList.remove('active');
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ
// ═══════════════════════════════════════════════════════════════

function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;
    
    const texts = CONFIG.typewriterTexts;
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let delay = CONFIG.typewriterSpeed;
        
        if (!isDeleting && charIndex === currentText.length) {
            delay = CONFIG.typewriterPause;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            delay = 500;
        } else if (isDeleting) {
            delay = 50;
        }
        
        setTimeout(type, delay);
    }
    
    type();
}

// ═══════════════════════════════════════════════════════════════
// ЗАГРУЗКА ПРОЕКТОВ ИЗ JSON
// ═══════════════════════════════════════════════════════════════

async function loadProjects() {
    const container = document.getElementById('projectsGrid');
    if (!container) return;
    
    try {
        const response = await fetch(CONFIG.projectsFile);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const projects = await response.json();
        renderProjects(projects, container);
        
    } catch (error) {
        console.warn('Не удалось загрузить projects.json:', error);
        console.info('Используем тестовые данные...');
        
        // Fallback данные (если JSON не доступен)
        const fallbackProjects = [
            {
                "id": 1,
                "icon": "🚀",
                "title": "Sample Project",
                "description": "Это тестовый проект. Создайте файл data/projects.json чтобы загрузить ваши проекты.",
                "tags": ["Demo", "Test"],
                "github": "https://github.com",
                "demo": null
            }
        ];
        
        renderProjects(fallbackProjects, container);
    }
}

/**
 * Рендерит карточки проектов в контейнер
 * @param {Array} projects - Массив проектов
 * @param {HTMLElement} container - Контейнер для карточек
 */
function renderProjects(projects, container) {
    // Очищаем контейнер (удаляем лоадер)
    container.innerHTML = '';
    
    projects.forEach((project, index) => {
        const card = createProjectCard(project);
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
        container.appendChild(card);
    });
}

/**
 * Создаёт HTML-элемент карточки проекта
 * @param {Object} project - Данные проекта
 * @returns {HTMLElement} - DOM элемент карточки
 */
function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    
    // Иконка
    const icon = project.icon || '📦';
    
    // Теги
    const tagsHtml = project.tags 
        ? project.tags.map(tag => `<span class="project-card__tag">${tag}</span>`).join('')
        : '';
    
    // Ссылки
    let linksHtml = '';
    
    if (project.github) {
        linksHtml += `
            <a href="${project.github}" target="_blank" class="project-card__link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
            </a>
        `;
    }
    
    if (project.demo) {
        linksHtml += `
            <a href="${project.demo}" target="_blank" class="project-card__link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Demo
            </a>
        `;
    }
    
    card.innerHTML = `
        <div class="project-card__icon">${icon}</div>
        <h3 class="project-card__title">${project.title}</h3>
        <p class="project-card__desc">${project.description}</p>
        <div class="project-card__tags">${tagsHtml}</div>
        <div class="project-card__links">${linksHtml}</div>
    `;
    
    return card;
}

// ═══════════════════════════════════════════════════════════════
// ПЛАВНЫЙ СКРОЛЛ К ЯКОРЯМ
// ═══════════════════════════════════════════════════════════════

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// АНИМАЦИЯ СЧЁТЧИКОВ
// ═══════════════════════════════════════════════════════════════

function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat__number[data-count]');
    
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count, 10);
    const duration = 2000; // 2 секунды
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ═══════════════════════════════════════════════════════════════
// УСТАНОВКА ТЕКУЩЕГО ГОДА В ФУТЕРЕ
// ═══════════════════════════════════════════════════════════════

function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

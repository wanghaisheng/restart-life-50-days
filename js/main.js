document.addEventListener('DOMContentLoaded', function() {
    // 初始化多语言支持
    initializeI18n();
    
    // 导航菜单切换
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        
        // 更新汉堡菜单样式
        const spans = this.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // 关闭移动菜单
            mobileMenu.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return; // 如果是空锚点，直接返回
            
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动效果
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 标签切换
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有活动类
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加活动类到当前元素
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // App 风格切换
    const styleButtons = document.querySelectorAll('.style-btn');
    const styleContents = document.querySelectorAll('.style-content');
    
    styleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有活动类
            styleButtons.forEach(btn => btn.classList.remove('active'));
            styleContents.forEach(content => content.classList.remove('active'));
            
            // 添加活动类到当前元素
            this.classList.add('active');
            const styleId = this.getAttribute('data-style');
            document.getElementById(styleId).classList.add('active');
        });
    });
    
    // 轮播图
    const carousel = document.querySelector('.testimonials-carousel');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentSlide = 0;
    const slideCount = document.querySelectorAll('.testimonial-card').length;
    
    function updateCarousel() {
        const slideWidth = carousel.offsetWidth;
        carousel.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        // 更新指示点
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    prevBtn.addEventListener('click', function() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateCarousel();
    });
    
    nextBtn.addEventListener('click', function() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            updateCarousel();
        });
    });
    
    // 自动轮播
    setInterval(function() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
    }, 5000);
    
    // FAQ 折叠
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // 关闭其他 FAQ 项
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 切换当前 FAQ 项的状态
            item.classList.toggle('active');
        });
    });
    
    // 语言切换
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
            
            // 更新所有语言按钮的状态
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
            });
        });
    });
    
    // 初始化窗口大小调整事件
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
        
        // 重置轮播图位置
        currentSlide = 0;
        updateCarousel();
    });
    
    // 初始加载时进行一次更新
    updateCarousel();
});

// 这个函数将在 i18n.js 中实现
function changeLanguage(lang) {
    setLanguage(lang);
}


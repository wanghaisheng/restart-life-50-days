// 全局变量用于存储当前语言
let currentLanguage = 'zh';

// 存储翻译内容的对象
const translations = {
    zh: null,
    en: null
};

// 初始化多语言支持
function initializeI18n() {
    // 根据浏览器语言或用户偏好设置初始语言
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
        currentLanguage = savedLanguage;
    } else {
        // 默认中文
        currentLanguage = 'zh';
    }
    
    // 加载当前语言的翻译文件
    loadTranslation(currentLanguage).then(() => {
        // 更新 UI 元素
        updateLanguageUI();
        // 应用翻译
        applyTranslations();
    });
    
    // 预加载其他语言文件
    if (currentLanguage === 'zh') {
        loadTranslation('en');
    } else {
        loadTranslation('zh');
    }
}

// 加载翻译文件
function loadTranslation(lang) {
    return new Promise((resolve, reject) => {
        // 如果已经加载过此语言，直接返回
        if (translations[lang]) {
            resolve();
            return;
        }
        
        // 异步加载翻译文件
        fetch(`locale/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                translations[lang] = data;
                resolve();
            })
            .catch(error => {
                console.error('加载翻译文件失败:', error);
                reject(error);
            });
    });
}

// 切换语言
function setLanguage(lang) {
    if (lang !== 'zh' && lang !== 'en') {
        console.error('不支持的语言:', lang);
        return;
    }
    
    // 如果语言未变更，无需操作
    if (currentLanguage === lang) {
        return;
    }
    
    // 加载新语言的翻译文件（如果尚未加载）
    loadTranslation(lang).then(() => {
        // 更新当前语言
        currentLanguage = lang;
        // 保存用户语言偏好
        localStorage.setItem('language', lang);
        // 更新 UI 元素
        updateLanguageUI();
        // 应用翻译
        applyTranslations();
    });
}

// 更新语言 UI 状态
function updateLanguageUI() {
    // 更新所有语言按钮的状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        if (btnLang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 应用翻译到所有元素
function applyTranslations() {
    // 确保翻译文件已加载
    if (!translations[currentLanguage]) {
        console.error('翻译文件尚未加载:', currentLanguage);
        return;
    }
    
    // 获取所有带有 data-i18n 属性的元素
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[currentLanguage], key);
        
        if (translation) {
            // 根据元素类型应用翻译
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translation;
            } else {
                element.innerHTML = translation;
            }
        } else {
            console.warn(`未找到翻译键: ${key}`);
        }
    });
}

// 获取嵌套对象中的值
function getNestedTranslation(obj, path) {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
        if (current[key] === undefined) {
            return undefined;
        }
        current = current[key];
    }
    
    return current;
}


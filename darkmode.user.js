// ==UserScript==
// @name         Dark Mode
// @name:zh-CN   通用深色模式
// @namespace    https://github.com/RaffeYang/darkmode
// @version      1.2.0
// @description  Automatically converts all webpages to dark mode with intelligent content detection
// @description:zh-CN 自动将所有网页转换为深色模式，智能检测内容
// @author       RaffeYang
// @match        *://*/*
// @exclude      *://localhost/*
// @exclude      *://127.0.0.1/*
// @exclude      *://[::1]/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    
    // Configuration
    const config = {
        intensity: 0.9,
        contrast: 1.1,
        brightness: 0.9,
        sepia: 0.1,
        excludeHosts: 'github.com,google.com,bilibili.com,youtube.com,x.com,zhihu.com,coinglass.com,yahoo.com',
        excludeSelectors: [
            'img[src*="logo"]',
            'img[alt*="logo"]',
            'img[class*="logo"]',
            'img[id*="logo"]',
            '.logo img',
            'video',
            'canvas',
            'iframe[src*="youtube"]',
            'iframe[src*="vimeo"]',
            'svg[class*="icon"]',
            '.icon svg',
            'img[src$=".svg"]'
        ],
        mediaExcludeSelectors: [
            'img',
            'video',
            'canvas',
            'svg',
            'picture',
            'object',
            'embed'
        ]
    };
    
    // Main CSS for dark mode
    const darkModeCSS = `
        /* Universal dark mode base - more conservative approach */
        body:not([data-theme="dark"]):not(.dark):not(.dark-mode) {
            filter: invert(${config.intensity}) hue-rotate(180deg) contrast(${config.contrast}) brightness(${config.brightness}) sepia(${config.sepia}) !important;
        }
        
        /* Fallback for html if body doesn't work */
        html:not([data-theme="dark"]):not(.dark):not(.dark-mode) body:not([data-theme="dark"]):not(.dark):not(.dark-mode) {
            filter: invert(${config.intensity}) hue-rotate(180deg) contrast(${config.contrast}) brightness(${config.brightness}) sepia(${config.sepia}) !important;
        }
        
        /* Comprehensive media exclusions - restore original appearance */
        img:not(.icon):not([class*="icon"]):not([src*="icon"]):not([alt*="icon"]),
        video, canvas, svg:not(.icon):not([class*="icon"]), 
        picture, object, embed,
        img *, video *, picture *,
        [style*="background-image"]:not(.icon):not([class*="icon"]),
        .avatar, .profile-pic, .thumbnail, .preview,
        .image-container img, .video-container video,
        .media img, .media video, .cover img, .poster img,
        .photo img, .gallery img, .content-image,
        [role="img"]:not(.icon):not([class*="icon"]) {
            filter: invert(1) hue-rotate(180deg) contrast(${1 / config.contrast}) brightness(${1 / config.brightness}) sepia(-${config.sepia}) !important;
        }
        
        /* Specific logo and icon protection */
        img[src*="logo"], img[alt*="logo"], img[class*="logo"], img[id*="logo"],
        .logo, .logo *, .brand, .brand *, 
        svg[class*="icon"], .icon svg, .icon,
        img[src$=".svg"], img[src*="icon"] {
            filter: invert(1) hue-rotate(180deg) contrast(${1 / config.contrast}) brightness(${1 / config.brightness}) sepia(-${config.sepia}) !important;
        }
        
        /* Fix for video iframes */
        iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="bilibili"],
        iframe[src*="youku"], iframe[src*="iqiyi"], iframe[src*="video"] {
            filter: invert(1) hue-rotate(180deg) !important;
        }
        
        /* Form elements - proper dark mode styling */
        input:not([type="checkbox"]):not([type="radio"]), textarea, select {
            filter: invert(1) hue-rotate(180deg) !important;
            background: #1e1e1e !important;
            color: #e0e0e0 !important;
            border: 1px solid #3a3a3a !important;
            border-radius: 6px !important;
            padding: 10px 12px !important;
            transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
        }
        
        /* Input focus state - modern design */
        input:focus:not([type="checkbox"]):not([type="radio"]), textarea:focus, select:focus {
            border-color: #4a90e2 !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1) !important;
        }
        
        /* Placeholder text */
        input::placeholder, textarea::placeholder {
            color: #888 !important;
            opacity: 1 !important;
        }
        
        /* Button elements - modern dark mode */
        button, input[type="button"], input[type="submit"], input[type="reset"] {
            filter: invert(1) hue-rotate(180deg) !important;
            background: #2a2a2a !important;
            color: #e0e0e0 !important;
            border: 1px solid #444 !important;
            border-radius: 6px !important;
            padding: 8px 16px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            background-image: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
        }
        
        /* Button hover state */
        button:hover, input[type="button"]:hover, 
        input[type="submit"]:hover, input[type="reset"]:hover {
            background: #3a3a3a !important;
            border-color: #555 !important;
        }
        
        /* Button active state */
        button:active, input[type="button"]:active,
        input[type="submit"]:active, input[type="reset"]:active {
            background: #1a1a1a !important;
        }
        
        /* Fix for already dark themes */
        [data-theme="dark"], [data-bs-theme="dark"],
        .dark, .dark-mode, .theme-dark, .night-mode,
        html[data-theme="dark"], body[data-theme="dark"],
        html.dark, body.dark {
            filter: none !important;
        }
        
        /* Modern scrollbar styling */
        ::-webkit-scrollbar {
            width: 8px !important;
            height: 8px !important;
            background: transparent !important;
        }
        
        ::-webkit-scrollbar-track {
            background: #1a1a1a !important;
            border-radius: 4px !important;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #444 !important;
            border-radius: 4px !important;
            border: 1px solid #2a2a2a !important;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #555 !important;
        }
        
        ::-webkit-scrollbar-thumb:active {
            background: #666 !important;
        }
        
        /* Selection styling - improved contrast */
        ::selection {
            background: rgba(74, 144, 226, 0.3) !important;
            color: #ffffff !important;
        }
        
        ::-moz-selection {
            background: rgba(74, 144, 226, 0.3) !important;
            color: #ffffff !important;
        }
        
        /* Code syntax highlighting - restore original colors */
        .hljs, .highlight, .codehilite, .code-block, pre code,
        .highlight *, .hljs *, pre code * {
            filter: invert(1) hue-rotate(180deg) !important;
        }
    `;
    
    // Enhanced CSS for better compatibility
    const enhancedCSS = `
        /* Dynamic image handling for lazy-loaded content */
        img[data-src], img[data-lazy], img[loading="lazy"],
        .lazy-image, .lazyload, .lazy-loaded {
            filter: invert(1) hue-rotate(180deg) contrast(${1 / config.contrast}) brightness(${1 / config.brightness}) sepia(-${config.sepia}) !important;
        }
        
        /* Fix for background images in CSS */
        div[style*="background-image"], span[style*="background-image"],
        section[style*="background-image"], header[style*="background-image"] {
            filter: invert(1) hue-rotate(180deg) !important;
        }
        
        /* Ensure text remains readable */
        body, p, span, div, h1, h2, h3, h4, h5, h6, a, li, td, th {
            text-shadow: none !important;
        }
        
        /* Fix modal overlays but not their content */
        .modal-backdrop, .overlay-backdrop, .mask, .backdrop {
            filter: invert(1) hue-rotate(180deg) !important;
        }
        
        /* Special handling for Bilibili - comprehensive image selectors */
        .bili-video-card__cover img, .bili-video-card__cover picture img,
        .video-card__cover img, .cover img, .b-img__inner, .b-img img,
        .bili-avatar img, .bili-avatar .b-img img, .up-avatar img,
        .pgc-item__cover img, .feed-card .cover img, .card-box .cover img,
        img[src*="i0.hdslb.com"], img[src*="i1.hdslb.com"], img[src*="i2.hdslb.com"],
        img[alt*="封面"], img[alt*="头像"], img[class*="cover"], img[class*="avatar"],
        .dynamic-card img, .bili-rich-text img, .reply-item img,
        /* Zhihu images */
        .zhihu-avatar img, .zhihu-question img, .RichContent img,
        /* Weibo images */
        .weibo-avatar img, .weibo-media img {
            filter: invert(1) hue-rotate(180deg) contrast(${1 / config.contrast}) brightness(${1 / config.brightness}) sepia(-${config.sepia}) !important;
        }
    `;
    
    // Function to inject CSS
    function injectCSS() {
        const style = document.createElement('style');
        style.id = 'universal-darkmode-style';
        style.textContent = darkModeCSS + enhancedCSS;
        (document.head || document.documentElement).appendChild(style);
    }
    
    // Function to check if system is in dark mode
    function isSystemDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Function to check if current site should be excluded
    function isExcludedHost() {
        if (!config.excludeHosts || config.excludeHosts.trim() === '') {
            return false;
        }
        
        const currentHost = window.location.hostname;
        const excludeList = config.excludeHosts.split(',').map(host => host.trim());
        
        return excludeList.some(excludeHost => {
            if (excludeHost === '') return false;
            if (excludeHost.includes('*')) {
                const pattern = excludeHost.replace(/\*/g, '.*');
                const regex = new RegExp(`^${pattern}$`, 'i');
                return regex.test(currentHost);
            }
            return currentHost === excludeHost || currentHost.endsWith('.' + excludeHost);
        });
    }
    
    // Function to check if dark mode is already applied
    function isDarkModeAlready() {
        const body = document.body || document.documentElement;
        if (!body) return false;
        
        const computedStyle = window.getComputedStyle(body);
        const bgColor = computedStyle.backgroundColor;
        
        // Check if background is already dark
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                return brightness < 128; // Consider it dark if brightness < 128
            }
        }
        
        // Check for dark theme indicators
        const darkIndicators = [
            '[data-theme="dark"]',
            '[data-bs-theme="dark"]',
            '.dark',
            '.dark-mode',
            '.theme-dark',
            'body[class*="dark"]',
            'html[class*="dark"]'
        ];
        
        return darkIndicators.some(selector => document.querySelector(selector));
    }
    
    // Function to handle dynamic content
    function observeChanges() {
        const observer = new MutationObserver((mutations) => {
            let needsUpdate = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    needsUpdate = true;
                }
            });
            
            if (needsUpdate && !document.getElementById('universal-darkmode-style')) {
                injectCSS();
            }
        });
        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    
    // Function to handle page URL changes (for SPAs)
    function handleUrlChange() {
        setTimeout(() => {
            if (!isDarkModeAlready() && !document.getElementById('universal-darkmode-style')) {
                injectCSS();
            }
        }, 100);
    }
    
    // Main initialization
    function init() {
        // Check if current host should be excluded
        if (isExcludedHost()) {
            return;
        }
        
        // Only run when system is in dark mode
        if (!isSystemDarkMode()) {
            return;
        }
        
        // Skip if already dark
        if (isDarkModeAlready()) {
            return;
        }
        
        // Inject CSS immediately
        injectCSS();
        
        // Handle dynamic content
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                observeChanges();
            });
        } else {
            observeChanges();
        }
        
        // Handle SPA navigation
        if (typeof window.addEventListener === 'function') {
            window.addEventListener('popstate', handleUrlChange);
            window.addEventListener('pushstate', handleUrlChange);
            window.addEventListener('replacestate', handleUrlChange);
        }
        
        // AdGuard-specific SPA handling
        if (typeof window.onurlchange !== 'undefined') {
            window.addEventListener('onurlchange', handleUrlChange);
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (e.matches && !document.getElementById('universal-darkmode-style')) {
                    // System switched to dark mode, apply our dark mode
                    if (!isDarkModeAlready()) {
                        injectCSS();
                    }
                } else if (!e.matches && document.getElementById('universal-darkmode-style')) {
                    // System switched to light mode, remove our dark mode
                    const style = document.getElementById('universal-darkmode-style');
                    if (style) {
                        style.remove();
                    }
                }
            });
        }
    }
    
    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Fallback for very early execution
    setTimeout(init, 0);
    
})();
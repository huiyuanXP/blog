export const defaultLang = 'zh';

export const ui = {
  zh: {
    'site.title': 'HuiYuan',
    'site.subtitle': '心流 / Agent 时代的思考',
    'nav.home': '首页',
    'nav.about': '关于',
    'post.back': '返回',
    'post.readMore': '阅读全文',
    'footer.copyright': '保留所有权利',
    'lang.switch': 'EN',
  },
  en: {
    'site.title': 'HuiYuan',
    'site.subtitle': 'Flow States / Thoughts on the Agent Era',
    'nav.home': 'Home',
    'nav.about': 'About',
    'post.back': 'Back',
    'post.readMore': 'Read more',
    'footer.copyright': 'All rights reserved',
    'lang.switch': '中文',
  },
} as const;

export type Lang = keyof typeof ui;

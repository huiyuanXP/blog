export const defaultLang = 'zh';

export const ui = {
  zh: {
    'site.title': 'HuiYuan',
    'site.subtitle': '心流 / Agent 时代的思考',
    'nav.home': '首页',
    'nav.about': '关于',
    'nav.diary': '日记',
    'post.back': '返回',
    'post.readMore': '阅读全文',
    'footer.copyright': '保留所有权利',
    'lang.switch': 'EN',
    'diary.title': '日记',
    'diary.subtitle': '每天写一点，记录真实的自己。',
    'diary.totalWords': '字',
    'diary.streak': '天连续',
    'diary.entries': '篇',
    'diary.back': '返回日记',
  },
  en: {
    'site.title': 'HuiYuan',
    'site.subtitle': 'Flow States / Thoughts on the Agent Era',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.diary': 'Diary',
    'post.back': 'Back',
    'post.readMore': 'Read more',
    'footer.copyright': 'All rights reserved',
    'lang.switch': '中文',
    'diary.title': 'Diary',
    'diary.subtitle': 'A little every day, recording the real self.',
    'diary.totalWords': 'characters',
    'diary.streak': 'day streak',
    'diary.entries': 'entries',
    'diary.back': 'Back to Diary',
  },
} as const;

export type Lang = keyof typeof ui;

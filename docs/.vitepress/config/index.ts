import { defineConfig } from 'vitepress'
import { shared } from './shared'
import { zh } from './zh'
import { en } from './en'
import { ja } from './ja'
import { ko } from './ko'

export default defineConfig({
  ...shared,
  locales: {
    root: { label: '简体中文', ...zh },
    en: { label: 'English', ...en },
    ja: { label: '日本語', ...ja },
    ko: { label: '한국어', ...ko },
  },
})

# React + Vite + Tailwind CSS

Статическое приложение на React, собираемое в один HTML-файл (Vite + `vite-plugin-singlefile`).

## Локальный запуск

```bash
npm install
npm run dev      # режим разработки
npm run build    # сборка в папку dist/
npm run preview  # предпросмотр собранной версии
```

## Деплой на Vercel

1. Зарегистрируйтесь на [vercel.com](https://vercel.com) (можно войти через GitHub).
2. **Add New Project** → импортируйте репозиторий (или загрузите папку через Vercel CLI).
3. Настройки уже прописаны в `vercel.json`:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Framework: `vite`
4. Нажмите **Deploy**.

После первого деплоя каждое обновление в репозиторий (`git push`) автоматически пересобирает сайт.

## Итоговая ссылка

Vercel выдаст адрес вида `https://имя-проекта.vercel.app`. Свой домен привязывается в разделе **Settings → Domains**.

## Примечание

Благодаря `vite-plugin-singlefile` весь сайт собирается в один файл `dist/index.html` (~205 KB, gzip ~64 KB). Это упрощает хостинг — можно загрузить этот файл куда угодно.

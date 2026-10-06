# LOLLY EPK — инструкции для Claude Code

Проект: сайт-презентация (press kit) DJ LOLLY. Перед любой работой прочитай:
1. `docs/TZ.md` — техническое задание (структура, этапы, acceptance)
2. `docs/DESIGN_SYSTEM.md` — дизайн-система (обязательна)
3. `docs/CONTENT.md` — все тексты и данные (ничего не выдумывать сверх него)

Правила:
- ОБЯЗАТЕЛЬНО использовать скиллы **impeccable** и **taste-skill (design-taste-frontend)**. Как именно — см. TZ §2. Дайлы taste: VARIANCE 8 / MOTION 9 / DENSITY 3.
- После КАЖДОГО изменения: `git add -A`, `git commit`, `git push origin main` и `npm run deploy` (см. «Деплой»). Разрешения на пуш не спрашивать. Заказчик следит за процессом.
- Все 5 видео, все 10 резидентств, все 32 клуба и все 7 релизов должны быть на сайте (TZ §6).
- Исходники (тяжёлые видео, оригиналы фото) лежат в родительской папке `C:\Users\G13\Desktop\CLAUDE\DJ LOLLY`. В git их не класть.
- Язык сайта: английский. Общение с заказчиком: русский.

## Первый шаг: подготовить ассеты из исходников
Готовые ассеты из облачной сессии не доехали (медленная передача), поэтому собери `assets/` (в репозитории он лежит как `public/assets/`, чтобы Vite отдавал файлы) сам из `..\` (папка DJ LOLLY), по раскладке из `docs/CONTENT.md`:
- `assets/img/hero/`: `hero-4-main.jpg` ← `hero 4.jpg`, `hero-3-alt-red.jpg` ← `Hero 3.jpg` (ужать до 2752px), `hero-2-alt-white.jpg` ← `Hero 2 .jpg`
- `assets/img/press/press-01..08.jpg` ← `Photo/` по порядку имён: 1790761486190294, …486508616, …489419298, …505472733, …505954458, …537776094, …667581794, …667942841 (длинная сторона 2400px, q82)
- `assets/img/live/live-01..04.jpg` ← картинки image2, image3, image5, image6 из `BIO.docx` (распаковать как zip: `word/media/`)
- `assets/logo/lolly-logo-white.png` ← `Logo/1790761668944509.png`, `lolly-logo-black.png` ← `Logo/1790761690406437.png`
- `assets/img/fx/gradient-mask-vertical.png` ← `Photo/Без имени-1.png`
- `assets/img/releases/`: 7 обложек вырезать из `Old presentation.jpg` (полоса RELEASE TRACKS, y≈347–418), это временные заглушки
- `assets/video/`: имена aftermovie-h ← IMG_8004.MP4, club-set-h ← IMG_9848.MOV, booth-pov-v ← IMG_5554.MOV, teaser-no-rule-v ← IMG_8006.MP4, extra-2009 ← IMG_2009.MOV. Для каждого сделай полную версию, `-loop.mp4` и `-poster.jpg`, команды ffmpeg в TZ §8
- `docs/references/` ← `Referens/*`, `docs/source/old-presskit.jpg` ← `Old presentation.jpg`

## Деплой
Сайт: https://stasjuicytrax-arch.github.io/LOLLY/ — GitHub Pages, источник **ветка `gh-pages`**.
- Vite `base: '/LOLLY/'`. Скрипт `npm run deploy` = `vite build && gh-pages -d dist --dotfiles` (собирает и публикует `dist` в ветку `gh-pages`).
- Порядок после каждого изменения: `git push origin main`, затем `npm run deploy`. Проверить живую ссылку.
- Полные видео (`aftermovie-h.mp4` и др.) в `main` не лежат (gitignore), но `npm run deploy` публикует их в ветку `gh-pages` вместе с сайтом, и лайтбокс играет их со звуком (решение заказчика). Исключить: `STRIP_FULL_VIDEOS=1 npm run deploy`.
- Превью продакшн-сборки: `npm run build && npx vite preview` (в Git Bash `--base` не передавать: путь `/LOLLY/` превращается в путь Windows).
- В настройках репозитория: Pages → Source = «Deploy from a branch» → `gh-pages` / root (однократно, вручную).

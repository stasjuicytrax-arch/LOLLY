# ТЕХНИЧЕСКОЕ ЗАДАНИЕ — LOLLY EPK (сайт-презентация)

Версия 1.0 · 05.10.2026 · Репозиторий: https://github.com/stasjuicytrax-arch/LOLLY

Связанные файлы (читать ВСЕ перед стартом):
- `docs/DESIGN_SYSTEM.md` — дизайн-система (цвет, шрифты, сетка, ритм, motion)
- `docs/CONTENT.md` — все тексты, клубы, резидентства, релизы, видео, ссылки, контакты
- `docs/references/` — референсы стиля · `docs/source/old-presskit.jpg` — старый PDF-промокит

---

## 1. Цель

Electronic Press Kit для DJ/продюсера **LOLLY** (Мьянма). Ссылку рассылают букинг-агентствам и промоутерам вместо PDF. За 10 секунд промоутер должен понять: **кто она, как звучит, где играла, как забукать** — и захотеть забукать.

Аудитория насмотренная → уровень Awwwards / SOTD. Тон: ультрасовременно, модно, много анимации, вау-эффект с первого экрана.

## 2. ОБЯЗАТЕЛЬНЫЕ СКИЛЛЫ

Установлены у заказчика, использовать на каждом этапе:

1. **Impeccable** (https://impeccable.style) — анти-«AI slop».
   - Старт: `/impeccable init`
   - По ходу: `/impeccable typeset`, `/impeccable layout`, `/impeccable colorize`, `/impeccable animate`
   - Перед каждым пушем крупного блока: `/impeccable audit`
   - Финал: `/impeccable polish`
   - Включить `/impeccable hooks on`
2. **Taste Skill** (https://www.tasteskill.dev, `design-taste-frontend`) — дизайн-вкус.
   - Дайлы: `DESIGN_VARIANCE = 8`, `MOTION_INTENSITY = 9`, `VISUAL_DENSITY = 3`
   - Pre-flight проверка перед выдачей каждого раздела.

Если скилл предлагает решение, противоречащее `DESIGN_SYSTEM.md`, побеждает дизайн-система. Исключение — правила против slop.

## 3. Процесс и Git

- Пушить **после каждого завершённого блока** (заказчик наблюдает процесс): `feat(hero): …`, `feat(residencies): …`.
- Ветка `main`, деплой превью — GitHub Pages или Vercel (ссылка в README).
- После финальной вёрстки — **PDF-версия презентации** того же дизайна (отдельный этап, см. §11). Закладывать с самого начала: print-стили / отдельные «слайды» 1920×1080 на тех же токенах.

## 4. Стек

- **Vite** + vanilla TS (или Astro). Без React, если не нужен. Один лендинг, статика.
- **GSAP** (ScrollTrigger, SplitText) + **Lenis**.
- Опционально: **OGL**/three для шейдера в hero (дисторсия/жидкий красный свет по курсору).
- Шрифты: Archivo (variable wdth+wght), Geist, Geist Mono. Self-host, `font-display: swap`, preload display-шрифта.
- Изображения: AVIF/WebP + JPG fallback, `srcset`, lazy. Видео: `preload="none"` вне первого экрана, `playsinline muted loop`.

## 5. Структура страницы (один скролл)

| # | Секция | Содержание | Главный приём |
|---|---|---|---|
| 0 | **Preloader** | Спираль-леденец из логотипа вращается, счётчик 000→100 | Красная шторка уходит вверх и открывает hero |
| 1 | **HERO** | `hero-4-main.jpg` full-bleed. Мега-слово **LOLLY** (Archivo, wdth 125) ЗА фигурой артиста. Для этого фигуру вырезать в PNG (rembg) и положить слоем поверх текста. Внизу: `DJ / PRODUCER — YANGON, MYANMAR`, `EST. 2015`, CTA `BOOK LOLLY ↗` | Вау-эффект: параллакс трёх слоёв (фон, текст, фигура) по курсору и скроллу. Буквы появляются по одной с маской. Шейдер-«жар» по красному фону. Grain |
| 2 | **Marquee жанров** | BASS · DRUM & BASS · JERSEY CLUB · TRAP · BOUNCE · MIDTEMPO · HOUSE | Две ленты навстречу, скорость от скролла |
| 3 | **About / манифест** | Ступенчатый заголовок в стиле ref-8: «BASS-DRIVEN ⬭ SETS FROM / MYANMAR TO THE ⬭ REGION». В пилюлях `booth-pov-v-loop` и `press-04`. Ниже bio из CONTENT.md, 2 колонки асимметрично + `live-01` | SplitText по строкам, wdth-дыхание, пилюли раскрываются |
| 4 | **Статистика (светлая «вспышка»)** | 10+ / 10 / 32 / 8 / 2 / 7, подписи из CONTENT.md | Фон `--bone`. Мега-цифры с count-up и прокруткой цифр как на табло |
| 5 | **SHOWREEL** | `aftermovie-h`: пилюля в центре раскрывается в full-bleed на скролле (clip-path). Курсор `PLAY`, по клику лайтбокс со звуком | Pinned scrub-сцена |
| 6 | **Видео-стена** | Остальные 4 видео: `booth-pov-v`, `teaser-no-rule-v`, `club-set-h`, `IMG_2009`. Масонри или горизонтальный drag-слайдер разной высоты | Hover включает луп, клик открывает лайтбокс |
| 7 | **Residencies 2015→2024** | Все 10 резидентств из CONTENT.md | Горизонтальный pinned-таймлайн: годы мега-цифрами, клуб под ними, красная линия прогресса |
| 8 | **Clubs & Tours** | Все 32 площадки по 8 городам и 2 странам. Фон — `club-set-h-loop`, затемнённый. Слева список городов (Yangon 16 … Laukkai 1, Thailand 3), справа клубы выбранного города | Hover по клубу показывает превью-фото за курсором. Опционально: стилизованная схема-карта Мьянма + Таиланд, точки городов загораются |
| 9 | **Releases** | 7 треков, обложки, кнопка SoundCloud | Горизонтальная лента карточек 20px radius, tilt по курсору. Встроенный SoundCloud-плеер (lazy) |
| 10 | **THE LOLLYISM** | Ивент-серия: короткий текст + `teaser-no-rule-v` + `live-03`/`live-04` | Контраст: гигантское outline-слово LOLLYISM на фоне |
| 11 | **Gallery / Press assets** | press-01…08 + live-01…04. Кнопки: `Download press photos` (Drive), `Download logo` (PNG), `VJ loops` (Drive), `Biography PDF` | Сетка с разным масштабом. Клик открывает лайтбокс |
| 12 | **BOOKING** | Мега-email `DJ.LOLLY.MT@GMAIL.COM` (копирование по клику с тостом «Copied»), телефон/WhatsApp, IG / FB / TikTok / SoundCloud. Фон `hero-3-alt-red` | Огромный текст, магнитные ссылки |
| 13 | Footer | Логотип, © LOLLY 2026, back to top | — |

Навигация: фиксированный минимальный бар. Слева лого, справа `ABOUT · VIDEO · TOURS · MUSIC · BOOKING` и кнопка `BOOK ↗`. На скролле вниз бар скрывается, на скролле вверх появляется. Индикатор прогресса скролла 1px `--signal`.

## 6. Обязательная проверка полноты (acceptance)

- [ ] **Все 5 видео** задействованы: aftermovie-h, club-set-h, booth-pov-v, teaser-no-rule-v, IMG_2009
- [ ] **Все 10 резидентств** с годами
- [ ] **Все 32 площадки** по 8 городам + Таиланд
- [ ] **Все 7 релизов**
- [ ] Все 8 пресс-фото и 4 live-фото используются хотя бы раз
- [ ] Все ссылки (SoundCloud, IG, FB, TikTok, 3× Drive) кликабельны и открываются в новой вкладке
- [ ] Email и телефон — `mailto:` / `tel:` / WhatsApp `wa.me`
- [ ] Закрыты все пункты ⚠️ из CONTENT.md (или оставлены с согласия заказчика)

## 7. Адаптив

- Breakpoints: 375 / 768 / 1280 / 1680+.
- Mobile: hero — вертикальный кроп (`press-04`/`press-05`, красный фон), мега-слово по вертикали или в 2 строки. Pinned-горизонтали становятся вертикальными свайп-лентами. Кастомный курсор отключён. Видео: только постеры, луп включается по тапу.
- Без горизонтального скролла страницы ни на одной ширине.

## 8. Ассеты: подготовка

- В репозитории уже лежат оптимизированные фото, логотипы, лупы и постеры видео (см. CONTENT.md).
- Полные видео: перекодировать локально из `C:\Users\G13\Desktop\CLAUDE\DJ LOLLY` (нужен ffmpeg):
  ```
  ffmpeg -i IMG_2009.MOV -vf "scale=-2:'min(1080,ih)',fps=30" -c:v libx264 -crf 28 -preset medium -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart assets/video/extra-2009.mp4
  ffmpeg -ss 3 -t 12 -i IMG_2009.MOV -vf "scale=-2:720,fps=30" -an -c:v libx264 -crf 29 -pix_fmt yuv420p -movflags +faststart assets/video/extra-2009-loop.mp4
  ffmpeg -ss 4 -i IMG_2009.MOV -frames:v 1 -q:v 4 assets/video/extra-2009-poster.jpg
  ```
  Остальные 4 полные версии сделать той же первой командой (имена: aftermovie-h, club-set-h, booth-pov-v, teaser-no-rule-v). Если файл больше 50 МБ, вынести на Vimeo/YouTube unlisted или в Git LFS.
- Вырезать фигуру из `hero-4-main.jpg` (rembg / remove.bg) в `assets/img/hero/hero-4-cutout.png`.
- Логотип векторизовать в SVG (для анимации спирали в прелоадере). Спираль — отдельный слой.
- Обложки релизов сейчас низкого разрешения (плейсхолдеры), оригиналы запросить у артиста.

## 9. Производительность и качество

- Lighthouse: Performance ≥ 85 (mobile), Accessibility ≥ 95, SEO ≥ 95.
- LCP меньше 2.5 с: hero-фото с preload, AVIF. Прелоадер не дольше 2 с и не блокирует LCP.
- `prefers-reduced-motion` поддержан.
- Контраст текста AA. Фокус-состояния видимы.
- OG-теги: title «LOLLY — DJ & Producer | Press Kit», description из короткой bio, OG-image 1200×630 (логотип + hero).
- Favicon — спираль из логотипа.

## 10. Порядок работы (этапы = коммиты)

1. Scaffold (Vite, шрифты, токены из DESIGN_SYSTEM → `tokens.css`), `/impeccable init`. Push
2. Preloader + Hero. Push + `/impeccable audit`
3. Marquee + About + Stats. Push
4. Showreel + видео-стена. Push
5. Residencies + Clubs & Tours. Push
6. Releases + LOLLYISM + Gallery. Push
7. Booking + footer + nav. Push
8. Адаптив, reduced-motion, производительность, `/impeccable polish`, чек-лист §6. Push + деплой

## 11. Следующий этап — PDF-презентация

После утверждения сайта: тот же дизайн в PDF, 1920×1080, около 8–10 слайдов (Cover/Hero · About · Stats · Residencies · Clubs & Tours · Releases · Gallery · Booking). Видео заменяются кадрами-постерами и QR-кодами на ссылки. Заказчик запросит отдельно.

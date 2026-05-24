# Lady Glow — Deploy на VPS

## Що потрібно на сервері
- **Node.js 18+** (рекомендовано 20 LTS)
- **PM2** — менеджер процесів (щоб сайт працював постійно)
- **Nginx** — reverse proxy (домен → Node.js)

## Крок 1: Підготовка сервера (Ubuntu/Debian)

```bash
# Оновлення
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2
sudo npm install -g pm2

# Nginx
sudo apt install -y nginx
```

## Крок 2: Завантажити файли

Завантажте `lady-glow-deploy.zip` на сервер через SFTP (FileZilla, WinSCP).

```bash
# На сервері:
mkdir -p /var/www/ladyglow
cd /var/www/ladyglow
unzip ~/lady-glow-deploy.zip

# Встановити залежності (тільки production)
npm install --omit=dev
```

## Крок 3: Запуск через PM2

```bash
cd /var/www/ladyglow
PORT=3000 pm2 start server/index.js --name ladyglow

# Автозапуск при перезавантаженні сервера
pm2 save
pm2 startup
```

### Корисні команди PM2:
```bash
pm2 status          # статус
pm2 logs ladyglow   # логи
pm2 restart ladyglow # перезапуск
pm2 stop ladyglow    # зупинити
```

## Крок 4: Налаштування Nginx

```bash
sudo nano /etc/nginx/sites-available/ladyglow
```

Вміст файлу:
```nginx
server {
    listen 80;
    server_name ladyglow.pl www.ladyglow.pl;  # ваш домен

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Кеш для статичних файлів
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 10M;  # для завантаження фото
}
```

```bash
# Активувати сайт
sudo ln -s /etc/nginx/sites-available/ladyglow /etc/nginx/sites-enabled/
sudo nginx -t          # перевірити конфіг
sudo systemctl reload nginx
```

## Крок 5: SSL сертифікат (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ladyglow.pl -d www.ladyglow.pl
```

Certbot автоматично оновить конфіг Nginx і додасть HTTPS.

## Крок 6: Перевірка

1. Відкрийте `http://ваш-домен/` — публічний сайт
2. Відкрийте `http://ваш-домен/admin` — адмін-панель
3. Логін: `admin` / пароль: `admin123`
4. **ВАЖЛИВО:** Змініть пароль адміна після першого входу!

## Структура файлів на сервері

```
/var/www/ladyglow/
├── package.json          # залежності
├── server/               # Express сервер + API
│   ├── index.js
│   ├── db.js             # SQLite (БД створюється автоматично)
│   ├── middleware/
│   └── routes/
├── dist/                 # зібраний React (фронтенд)
├── public/
│   ├── img/              # зображення
│   ├── uploads/          # завантажені через адмінку фото
│   ├── robots.txt
│   └── sitemap.xml
└── node_modules/         # (створюється після npm install)
```

## Оновлення сайту

1. На своєму ПК: внесіть зміни, запустіть `npm run build`
2. Завантажте нові файли на сервер (SFTP)
3. `pm2 restart ladyglow`

## Рекомендовані хостинги (VPS)

| Хостинг | Мін. ціна | Сервер |
|---------|-----------|--------|
| **Hetzner** | €3.79/міс | Німеччина/Фінляндія |
| **DigitalOcean** | $4/міс | Амстердам |
| **Vultr** | $2.50/міс | Амстердам |
| **TimeWeb** | ~250₽/міс | Росія/Європа |

Для салону краси достатньо мінімального тарифу (1 CPU, 1GB RAM).

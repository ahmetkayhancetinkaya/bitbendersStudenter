# Kurulum ve Supabase

## Yerel geliştirme

Node.js 24 önerilir (en az 22.17, açık TypeScript strip flag'iyle). İki bağımsız Git reposunun her birinde npm ci çalıştır; her repo kendi package-lock.json dosyasını kullanır. Üst çalışma klasöründe npm run install:all ikisini birlikte kurar. [Repo rehberi](REPOSITORIES.md).

frontend/.env.example dosyasını frontend/.env.local, backend/.env.example dosyasını backend/.env.local olarak kopyala. Eski kök .env.local / .env.server.local düzeni kullanılmaz. Supabase değerlerini VITE_ değişkenlerine ekleme.

```dotenv
# frontend/.env.local
VITE_API_BASE_URL=/api
API_PROXY_TARGET=http://127.0.0.1:3001
VITE_GOOGLE_MAPS_API_KEY=YOUR_RESTRICTED_BROWSER_MAPS_KEY
VITE_EMAIL_REMINDERS_ENABLED=false
```

```dotenv
# backend/.env.local
PORT=3001
HOST=127.0.0.1
APP_ORIGIN=http://127.0.0.1:5173
NODE_ENV=development
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_SECRET
GOOGLE_PLACES_API_KEY=YOUR_SERVER_PLACES_KEY
```

SUPABASE_ANON_KEY eski projeler için publishable anahtara alternatif olarak desteklenir. Normal kullanıcı işlemlerinde yalnızca publishable anahtar ve kullanıcının JWT'si kullanılır. Service-role staj importu ve yönetim scriptleri için gereklidir. Bu depoda gerçek anahtar bulunmaz.

```bash
npm run dev
npm test
npm run lint
npm run build
```

Üst çalışma klasöründe npm run dev iki servisi birlikte açar; her repo içinde npm run dev yalnızca kendi servisini açar: http://127.0.0.1:5173 arayüz, http://127.0.0.1:3001 API. Vite /api isteklerini backend'e aktarır. İstersen dev:frontend ve dev:backend komutlarını ayrı terminallerde çalıştır. Supabase ayarları olmadan hesapsız demo çalışır; gerçek kayıt/giriş için backend ve şema kurulmalıdır.

APP_ORIGIN tam origin olmalı; sonunda / bulunmamalı. localhost ve 127.0.0.1 farklıdır. Adresi değiştirirsen APP_ORIGIN, tarayıcı adresi ve Supabase redirect izinlerini birlikte değiştir. Preview portu kullanırken APP_ORIGIN değerini o portla eşleştir. Ortam değiştiğinde backend'i yeniden başlat.

## Veritabanı

Yeni Supabase projesinde sırasıyla uygula:

1. backend/supabase/migrations/202609120001_core.sql
2. backend/supabase/migrations/202609120002_discovery.sql
3. backend/supabase/migrations/202609120003_campus_discovery.sql
4. backend/supabase/seed-catalog.sql

npm run db:prepare tüm migrationları ve katalog seed'ini backend/.artifacts/install-supabase.sql içinde birleştirir. Bu dosya boş proje içindir; kurulu projede çekirdek migrationları tekrar çalıştırma. Katalog seed'i tekrar çalıştırılabilir. Schema/RLS değiştirilmedi; frontend/backend ayrımı yeni bir migration gerektirmez.

GET /api/health configured ve databaseReady durumunu döndürür; ikinci değer public.app_status RPC'sinden gelir. SMTP veya Google hazırlığını kanıtlamaz.

## Auth dönüş adresleri

Supabase Authentication → URL Configuration: Site URL uygulamanın kök adresi, Redirect URLs ise backend callback'i olmalı. SDK akış kimliği query parametresi eklediği için sadece callback yoluna ait query desenini izin listesine ekle:

```text
http://127.0.0.1:5173/api/auth/callback**
https://YOUR_SITE/api/auth/callback**
```

Callback kodu backend'de HttpOnly PKCE verifier çerezleriyle tek sefer tüketilir. Kayıt doğrulaması /#/app, kurtarma /#/sifre-yenile yoluna döner. Bağlantıyı işlemi başlattığın tarayıcıda aç. Başka bir tarayıcı PKCE verifier'ına sahip değildir. Eski doğrudan Supabase tarayıcı oturumları taşınmaz; geçişten sonra yeniden giriş yapılır.

## E-posta ve SMTP

Normal kayıtlar için e-posta doğrulamasını açık bırak. Supabase varsayılan e-posta hizmeti geniş kullanıcı dağıtımı için uygun değildir; kotaları ve alıcı kısıtları vardır. Authentication içindeki SMTP ayarlarına doğrulanmış gönderici sağlayıcını bağla. Resend kullanılacaksa önce alan adının DNS kayıtlarını doğrula, ardından sağlayıcının güncel SMTP bilgilerini gir.

Mevcut sürümde gerçek e-posta hatırlatma işçisi yoktur. `reminder_jobs` ve ilişkili SQL fonksiyonları yalnızca altyapı hazırlığıdır. `VITE_EMAIL_REMINDERS_ENABLED=true` değerini gönderim işçisi, zamanlanmış görev ve gerçek teslim testi tamamlanmadan kullanma. SMTP, hesap doğrulaması ve parola sıfırlama içindir; kişisel tarih hatırlatma işçisi ayrıca gerekir.

## Dosyalar

`notes` ve `listing-images` bucket’ları özeldir. PDF limiti 10 MB, JPEG/PNG/WebP limiti 5 MB’dır. Yol biçimi kullanıcı kimliği ile başlar. İstemci doğrulaması hızlı geri bildirim verir; backend boyut/MIME/dosya imzasını yeniden denetler; RLS politikaları ve bucket limitleri ayrıca uygulanır.

Not dosyası, ilişkili yayınlanmış paylaşımı okuyabilen oturuma açılır. Paylaşıma bağlanmamış dosya başka hesaplara açık değildir. Özel dosyalar için kalıcı herkese açık URL yerine oturumla indirme kullanılır. Kullanıcı iletişim e-postası kendi yazdığı ilan alanından alınır; hesap e-postası otomatik eklenmez.

## Örnek içerik

`npm run seed:examples`, ortak örnek kayıtları sabit kimliklerle upsert eder. Kullanıcıların gerçek kayıtlarını silmez. Örnek tarihleri prova gününe göre yenileyebilir. Google sonuçlarını veritabanına kopyalamaz, gerçek yoğunluk tablosuna yapay rapor göndermez, normal hesaplara bütçe/takvim doldurmaz.

`npm run demo:create`, ayrı bir gerçek demo hesabı ve ona özel bütçe/takvim kayıtları oluşturur. `backend/.artifacts/demo-account.json` mevcutsa aynı hesabı kullanır. Dosyayı silmek uzak hesabı silmez. Script sonuçları normal kullanıcı oturumu açarak kontrol eder. Demo şifresi Git dışında tutulur.

## Üretim ve yayın

npm run build dist/client (arayüz) ve dist/server/index.js (Worker API) üretir. Yalnızca statik frontend yayınlamak gerçek hesap/veri işlemleri için yeterli değildir.

Node sunucusu için NODE_ENV=production, APP_ORIGIN=https://YOUR_SITE ve uygun HOST/PORT değerlerini yapılandırıp npm start çalıştır. HTTPS reverse proxy üzerinden /api ve statik arayüz aynı origin'de sunulur. Node adaptörü yalnızca API sunar; statik frontend ayrı sunucuda bulunur. Backend ortam değerleri runtime'da okunur; VITE_ değerleri derleme anındadır.

Cloudflare/Sites için dist/server/index.js default fetch handler'ı, ASSETS binding'iyle dist/client ve runtime Supabase/Google ortam değerleri gerekir. .openai/hosting.json mevcut proje kimliğini korur; static:null API'nin de yayınlanması gerektiğini belirtir. Sırlar manifest veya frontend paketine eklenmez. Bu depoyu klonlamak mevcut Sites/Supabase proje yetkisini vermez.

Frontend'i farklı origin'de sunmak gerekirse VITE_API_BASE_URL backend'in /api adresini, APP_ORIGIN frontend adresini göstermeli; frontend origin'indeki /api/auth/callback yolu da backend'e yönlendirilmelidir. Tercih edilen yapı aynı origin'dir; farklı siteler arasında SameSite=Lax çerezleri gönderilmez. Farklı site kurulumu çerez/CSRF tasarımının ayrıca değerlendirilmesini gerektirir.

## Sorun giderme

| Sorun | Kontrol |
|---|---|
| Giriş kurulum bekliyor | Backend çalışıyor mu, /api/health, Supabase URL/key, app_status |
| 403 Origin/CSRF | APP_ORIGIN ile tarayıcı origin'i birebir eşleşmeli |
| Doğrulama/kurtarma bağlantısı | Callback izin deseni, PKCE başlatan tarayıcı, APP_ORIGIN |
| Dosya açılamıyor | Geçerli oturum, görünür paylaşım ve Storage RLS |
| Maps çizilmiyor | Frontend browser key, referrer ve Maps JavaScript API |
| Mekan araması yapılandırılmadı | Backend GOOGLE_PLACES_API_KEY ve Places API (New) |
| Staj yenilenmiyor | Service-role, ingestion_runs ve bir saatlik claim kilidi |

Kaynaklar: [Supabase redirect izinleri](https://supabase.com/docs/guides/auth/redirect-urls), [Server Auth](https://supabase.com/docs/guides/auth/server-side/advanced-guide), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

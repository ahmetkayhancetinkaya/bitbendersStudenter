# Kurulum ve Supabase

## Yerel ortam ve anahtarlar

Node.js 24 ve Git kurulu olmalıdır. `npm ci` bağımlılık kilidini kullanır. `.env.local` istemci değerlerini, `.env.server.local` yalnızca yerel yönetim komutlarının sırlarını içerir. İkisi de Git dışında tutulur.

`.env.local`:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
VITE_GOOGLE_MAPS_API_KEY=YOUR_RESTRICTED_BROWSER_KEY
```

`.env.server.local`:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_SECRET
```

Publishable anahtar istemci içindir. `sb_secret_...` veya legacy service_role anahtarı sunucu yetkisidir; frontend’e eklenmez. Google tarayıcı anahtarı görünür olduğundan HTTP referrer ve API kısıtlarıyla korunur. Kendi projen için kendi anahtarlarını kullan; bu depoda canlı anahtar yoktur.

## Veritabanı

Yeni Supabase projesinde SQL Editor üzerinden sırayla uygula:

1. `supabase/migrations/202609120001_core.sql`
2. `supabase/migrations/202609120002_discovery.sql`
3. `supabase/migrations/202609120003_campus_discovery.sql`
4. `supabase/seed-catalog.sql`

Çekirdek dosya tablolar, RLS, özel bucket’lar ve hatırlatma kuyruğunu kurar. İkinci dosya kullanıcı stajları, kaynak bilgileri, mekan önerileri ve toplama kilidini ekler. Üçüncü dosya kampüs referans konumlarını ve sadece şirketlerden alınan ilanları anonime açan sınırlı demo fonksiyonunu ekler. Katalog üniversite, kampüs, ders ve yoğunluk alanlarını oluşturur.

`npm run db:prepare`, tüm migrationları ve katalog seed’ini `.artifacts/install-supabase.sql` içinde birleştirir. Bu dosya boş proje içindir. Kurulu projede çekirdek migrationları tekrar çalıştırma; yalnızca uygulanmamış migrationları uygula. Katalog seed’i tekrar çalıştırılabilir. CLI kullanırken dashboard’da uygulanmış migrationların geçmişini eşitlemeden `supabase db push` çalıştırma.

Kurulum kontrolü:

```sql
select public.app_status();
```

Beklenen yanıt `kampuskit-20260912`. Giriş ekranı aynı sorguyu kullanır. Bu işaret Google veya SMTP’nin kurulduğunu kanıtlamaz.

## Auth dönüş adresleri

Authentication → URL Configuration içinde Site URL’yi yayınlanan kök adres olarak ayarla. Redirect izinlerine kök adresi ve `?flow=recovery` biçimini ekle. Yerelde localhost ve 127.0.0.1 farklı origin’lerdir.

```text
https://YOUR_SITE/
https://YOUR_SITE/?flow=recovery
http://localhost:5173/
http://localhost:5173/?flow=recovery
http://127.0.0.1:5173/
http://127.0.0.1:5173/?flow=recovery
```

PKCE callback’i bir kez tüketilir. Parola kurtarma işareti query string’de tutularak hash yönlendirmesiyle çakışma azaltılır. Doğrulamadan sonra kullanıcı ad, üniversite ve bölümünü tamamlar. Üniversite seçimi resmi öğrencilik kanıtı değildir.

## E-posta ve SMTP

Normal kayıtlar için e-posta doğrulamasını açık bırak. Supabase varsayılan e-posta hizmeti geniş kullanıcı dağıtımı için uygun değildir; kotaları ve alıcı kısıtları vardır. Authentication içindeki SMTP ayarlarına doğrulanmış gönderici sağlayıcını bağla. Resend kullanılacaksa önce alan adının DNS kayıtlarını doğrula, ardından sağlayıcının güncel SMTP bilgilerini gir.

Mevcut sürümde gerçek e-posta hatırlatma işçisi yoktur. `reminder_jobs` ve ilişkili SQL fonksiyonları yalnızca altyapı hazırlığıdır. `VITE_EMAIL_REMINDERS_ENABLED=true` değerini gönderim işçisi, zamanlanmış görev ve gerçek teslim testi tamamlanmadan kullanma. SMTP, hesap doğrulaması ve parola sıfırlama içindir; kişisel tarih hatırlatma işçisi ayrıca gerekir.

## Dosyalar

`notes` ve `listing-images` bucket’ları özeldir. PDF limiti 10 MB, JPEG/PNG/WebP limiti 5 MB’dır. Yol biçimi kullanıcı kimliği ile başlar. İstemci doğrulaması hızlı geri bildirim verir; sunucu politikaları ve bucket limitleri ikinci denetim katmanıdır.

Not dosyası, ilişkili yayınlanmış paylaşımı okuyabilen oturuma açılır. Paylaşıma bağlanmamış dosya başka hesaplara açık değildir. Özel dosyalar için kalıcı herkese açık URL yerine oturumla indirme kullanılır. Kullanıcı iletişim e-postası kendi yazdığı ilan alanından alınır; hesap e-postası otomatik eklenmez.

## Örnek içerik

`npm run seed:examples`, ortak örnek kayıtları sabit kimliklerle upsert eder. Kullanıcıların gerçek kayıtlarını silmez. Örnek tarihleri prova gününe göre yenileyebilir. Google sonuçlarını veritabanına kopyalamaz, gerçek yoğunluk tablosuna yapay rapor göndermez, normal hesaplara bütçe/takvim doldurmaz.

`npm run demo:create`, ayrı bir gerçek demo hesabı ve ona özel bütçe/takvim kayıtları oluşturur. `.artifacts/demo-account.json` mevcutsa aynı hesabı kullanır. Dosyayı silmek uzak hesabı silmez. Script sonuçları normal kullanıcı oturumu açarak kontrol eder. Demo şifresi Git dışında tutulur.

## Yayın

`npm run build` statik `dist/` üretir. HashRouter sayesinde `/#/app/mekanlar` yenilendiğinde sunucunun ayrı route tanımlaması gerekmez. Vite ortam değerleri derleme anında pakete girer; anahtar değişikliğinden sonra yeniden build gerekir.

`.openai/hosting.json` mevcut Sites projesinin kimliğidir. Başka bir hesapta yeni site kuruyorsan kendi Sites proje kimliğini kullan. Depoyu klonlamak backend yönetim yetkisi vermez; geliştirme için kendi Supabase projen ve ortamın gerekir.

## Sorun giderme

| Sorun | Kontrol |
|---|---|
| Giriş kurulum bekliyor | Supabase URL/key, core migration, app_status |
| Doğrulama e-postası yok | SMTP, alan adı DNS, gönderim kotası, alıcı kısıtı |
| Callback yanlış sayfada | Site URL, redirect allowlist ve origin |
| Kayıt hatası | Oturum, profil, RLS ve form alanları |
| Maps hatası | İki Google API’si, referrer, kota, faturalandırma |
| Staj yenilenmiyor | Fonksiyon yayını, JWT, ingestion_runs ve bir saatlik kilit |
| Dosya açılamıyor | Paylaşım görünürlüğü, bucket ve dosya sahipliği |

Kaynaklar: [React/Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-react), [SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage](https://supabase.com/docs/guides/storage/security/access-control), [Resend DNS](https://resend.com/docs/dashboard/domains/introduction).

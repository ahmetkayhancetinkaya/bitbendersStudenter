# KampüsKit — Öğrenci hayatı, bir arada

KampüsKit; öğrencilerin ders, kariyer, bütçe, barınma ve kampüs yaşamı ihtiyaçlarını tek bir web uygulamasında toplamak için geliştirilen bir hackathon projesidir. Bir öğrencinin ilk gününde oda arkadaşı araması, ders notu bulması, bir kulübü keşfetmesi, günlük harcamasını yazması ve kütüphanenin durumuna bakması aynı hesap üzerinden yapılabilir.

**[Canlı uygulama](https://kampuskit.arsenalighieri.chatgpt.site/)** · **[Hesapsız demo](https://kampuskit.arsenalighieri.chatgpt.site/#/demo)** · **[Gerçek hesapla giriş](https://kampuskit.arsenalighieri.chatgpt.site/#/giris)**

Bu çalışma klasörü çalışan arayüzü, Supabase şemasını, staj toplama kodlarını, örnek içerik üretimini, testleri ve kurulum belgelerini içerir. Frontend ve backend artık kendi kilit dosyaları, yerel ortak paketleri ve CI kontrolleri bulunan iki bağımsız Git reposudur. Supabase erişimi backend üzerinden gerçekleşir. [Repo ayrımı ve bağımsız kurulum](docs/REPOSITORIES.md).

## Ayrıntılı belgeler

| Belge | İçerik |
|---|---|
| [Bağımsız repolar](docs/REPOSITORIES.md) | Frontend/backend Git repoları, ayrı kurulum ve API bağlantısı |
| [Kurulum ve Supabase](docs/SETUP.md) | Yerel ortam, migrationlar, Auth, Storage, SMTP ve demo hesabı |
| [Mimari ve veri modeli](docs/ARCHITECTURE.md) | Bileşenler, tablolar, veri akışı ve erişim kuralları |
| [Backend API](docs/API.md) | Uçlar, oturum çerezleri, istek sözleşmeleri ve hata durumları |
| [Yoğunluk ML entegrasyonu](docs/ML.md) | Backend modelleri, kapasite senaryoları, testler ve yeniden eğitim |
| [Staj ve Maps entegrasyonları](docs/INTEGRATIONS.md) | Kaynaklar, algoritmalar, Google Cloud ve zamanlama |
| [Testler ve demo senaryosu](docs/TESTING.md) | Kabul kontrolleri, doğrulanmış davranışlar ve sınırlar |
| [Katkı rehberi](CONTRIBUTING.md) | Geliştirme düzeni, yeni modül ve veri kaynağı ekleme |

## Mevcut durum

12 Eylül 2026 tarihinde çekirdek Supabase şeması ve keşif migrationları uzak projeye uygulandı. E-posta/parola ile oturum, profil, gerçek kayıt saklama ve veritabanı erişim kuralları çalışıyor. Üç geçici hesapla bütçe, takvim, ortak paylaşım ve özel dosya erişimi test edildi; test hesapları temizlendi. Kullanıcı kayıtları sayfa yenilemesinden sonra Supabase üzerinden yeniden yüklenir.

Google haritası tarayıcı Maps anahtarıyla çizilir; mekan araması backend Places anahtarıyla çalışır. Mekanlar kampüs konumu etrafında Google Places API (New) üzerinden aranır. Öğrencilerin kendi önerileri ayrı bir Supabase tablosunda saklanır. Google sonuçları ile temsili mekanlar aynı kaynakmış gibi gösterilmez.

İki staj adaptörü altı şirket panosunu kontrol eder. İlk başarılı toplamada **10 gerçek ilan** alındı: Insider One 3, Lalamove 1, Peak 1, Constructor 5; Dream Games ve Udemy panolarında o kontrolde eşleşen ilan yoktu. Bu sayılar canlı envanter garantisi değildir; kaynak kontrol zamanı ilanlarda gösterilir. Türkiye filtresi varsayılandır, diğer ülkeler ayrıca seçilebilir.

Örnek içerik paketi üç üniversite için **63 ders paylaşımı, 21 yanıt, 63 pazar/barınma ilanı, 18 mekan, 18 değerlendirme, 27 kulüp, 42 etkinlik ve 9 örnek staj** içerir. Bunlar gerçek kişi, işletme, kiralık ev veya resmi etkinlik iddiası taşımaz. Ekranlarda “Örnek içerik” etiketi bulunur. Gerçek kampüs yoğunluğu tablosuna yapay güncel bildirim doldurulmaz.

**E-posta sınırı:** Resend gönderici alan adı, özel SMTP ve e-posta gönderim işçisi tamamlanmamıştır. Veritabanındaki hatırlatma kuyruğu hazırlığı e-posta gönderildiği anlamına gelmez. Mevcut arayüzde e-posta tercihi kapalıdır; uygulama içi yaklaşan tarih hatırlatmaları kullanılabilir. Yeni kullanıcı doğrulama ve şifre sıfırlama e-postalarının geniş kullanıcı kitlesine teslimi için özel SMTP kurulmalıdır.

## Kullanıcı yolculuğu

Tanıtım sayfasından “İçeriyi keşfet” seçildiğinde hesap açmadan demo ekranlarına girilir. Bu mod içerikleri ve filtreleri denemek içindir; kayıt işlemleri giriş gerektirir. Gerçek demo hesabı ise normal bir Supabase kullanıcısıdır ve kendi kayıtlarını değiştirebilir. İki deneyim arayüzde ayrılır.

Girişten sonra ad, üniversite ve bölüm tamamlanır. Masaüstünde gruplanmış yan menü, küçük ekranlarda ana panel, takvim, araçlar ve profil bağlantıları vardır. Üniversite seçimi ortak içeriği filtreler; resmi öğrencilik doğrulaması değildir. Kişisel bütçe ve takvim üniversite değiştirildiğinde kaybolmaz, kullanıcıya bağlı kalır.

## Modüller

### 1. Staj fırsatları

Şirket kaynaklarından getirilen ilanlar ve öğrencilerin eklediği fırsatlar birlikte keşfedilir. Pozisyon/şirket araması, alan, çalışma biçimi, ülke bölgesi ve kaynak türü filtreleri vardır. Kullanıcı ilan kaydedebilir, kendi eklediği ilanı düzenleyebilir veya kapatabilir. Başvuru dış kaynağa yönlenir; uygulama içinde başvuru tamamlanmış gibi sonuç gösterilmez.

Kaynakta son başvuru tarihi veya çalışma biçimi yoksa bilinmeyen değer açıkça gösterilir. Örnek ilanlarda gerçek başvuru alınmaz. Toplayıcı hata aldığında mevcut ilanları silmez; başarılı kaynak kontrolünden sonra artık bulunmayan ilanlar kapatılır.

### 2. Ders notları ve sorular

Paylaşımlar ders etiketiyle ilişkilidir. Öğrenci kendi notunu, kaynak bağlantısını veya en fazla 10 MB PDF dosyasını paylaşabilir. Soru açabilir, yanıt yazabilir ve kendi paylaşımını silebilir. Form bağlantı hatasında kapanmaz. Örnek notlar limit, türev, integral, matrisler, Python, Git, SQL, algoritmalar ve temel fizik konularını kapsar; resmi ders materyali değildir.

### 3. İkinci el pazarı

Kitap, hesap makinesi, çalışma masası ve ders malzemeleri kategori ve fiyatla listelenir. Başlık, açıklama, fiyat, bölge ve isteğe bağlı görsel eklenir. JPEG, PNG ve WebP kabul edilir; üst sınır 5 MB’dır. İlan sahibi düzenleme yapabilir ve satılan ürünü kapatabilir. Ödeme, kargo veya uygulama içi sohbet bulunmaz.

### 4. Kişisel bütçe

Aylık gelir ve giderler kategori bazında kaydedilir. Kalan bütçe toplam gelirden toplam gider çıkarılarak hesaplanır. Tutarlar veritabanında tam sayı kuruş olarak saklanır. Burs, destek ve maaş gelirleri; yemek, ulaşım, barınma, ders ve sosyal giderlerden ayrılır. Kullanıcı kendi hareketlerini silebilir; başka hesaplar bunları okuyamaz.

### 5. Öğrenci dostu mekanlar

Google sekmesi seçilen kampüsün çevresinde gerçek mekan arar. Kampüs, kafe/yemek/kütüphane türü, 1–5 km yarıçap ve fiyat seviyesi seçilir. Bir sonuca tıklanınca uygulama içinde Google haritası açılır; ayrıca Google Maps’e geçilebilir.

Uygunluk skoru fiyatı %40, yakınlığı %35, Google puanını %25 ağırlıkla değerlendirir. Az yorumlu mekanlar için örneklem düzeltmesi yapılır. Fiyatı veya puanı bilinmeyen sonuca skor verilmez. Uzaklık yürüyüş süresi değil, kampüs referans noktasına kuş uçuşu mesafedir. Skor resmi bir kalite veya indirim sertifikası değildir.

Öğrenci önerileri sekmesinde kullanıcı kendi deneyimini, gördüğü ürün/menü fiyatını, gözlem tarihini ve Maps bağlantısını ekler. Kendi önerisini ve 1–5 puanlı değerlendirmesini güncelleyebilir. Google puanları ve öğrenci yorumları ayrı gösterilir. Google’ın geçici arama verisi Supabase’e veya localStorage’a kopyalanmaz.

### 6. Ev devretme

Ev ilanlarında bölge, kira, depozito, oda türü ve müsaitlik tarihi bulunur. Kişi yalnızca kendi ilanını değiştirebilir ve kapatabilir. İletişim bilgisi ayrıca yazdığı alandan alınır; hesap e-postası otomatik yayımlanmaz. Örnek evler gerçek kiralama teklifi değildir.

### 7. Oda arkadaşı

Arayışlar bütçe, bölge, taşınma tarihi ve yaşam alışkanlıklarıyla tanımlanır. Sigara, ortak alan düzeni ve çalışma alışkanlıkları kullanıcı açıklamasına eklenebilir. Otomatik kişi eşleştirme veya mesajlaşma yerine liste filtreleri ve isteğe bağlı iletişim bilgileri kullanılır.

### 8. Kulüpler ve etkinlikler

Kullanıcı kulüp keşfeder, takip eder ve takibi bırakır. Etkinlik kişisel takvime eklenebilir; aynı etkinliğin aynı hesaba tekrar eklenmesi engellenir. Takip resmi üyelik veya rezervasyon değildir. Demo kulüpleri ve örnek etkinlikler bu ayrımı açıklayan metinler taşır.

### 9. Sınav ve teslim takvimi

Kişisel tarihler oluşturulur, düzenlenir, silinir ve tamamlandı işaretlenir. 1 gün, 1 saat veya 5 dakika önce hatırlatma seçilir. Tarihler UTC saklanır, Türkiye saatinde gösterilir. E-posta servisi tamamlanana kadar uygulama içi hatırlatmalar kullanılabilir; sınırlama kullanıcıya gösterilir.

### 10. Kampüs yoğunluğu

Öğrenciler kütüphane/yemekhane için sakin, orta veya kalabalık bildirimi bırakır. Son bir saat içinde her öğrencinin yalnızca son bildirimi sayılır. Katılımcı sayısı, dağılım ve son güncelleme zamanı gösterilir. Güncel rapor yoksa “Veri yok” yazılır; sensör ölçümü veya resmi okul verisi izlenimi verilmez.

**Yoğunluk tahmini · ML** sekmesinde geçmiş COD ofis kayıtları üzerinden mevcut an ve bir saat sonrası Random Forest tahmini denenir. Modeller backend'de çalışır. Şehir/mekân filtreleri, resmî kapasiteye göre manuel senaryolar ve kütüphane sınav haftası varsayımı vardır. Bu açıkça etiketlenmiş bir veri demosudur; canlı kampüs ölçümü değildir. [ML entegrasyonu ve eğitim rehberi](docs/ML.md).

## Teknik yapı

| Katman | Teknoloji | Amaç |
|---|---|---|
| Arayüz | React, TypeScript | Bileşenler ve tipli veri modeli |
| Backend | Node.js / Cloudflare Worker, TypeScript | /api, oturum, CRUD, dosya ve harici servisler |
| Ortak paket | Her repoda packages/shared | Sürümlenmiş yerel veri tipleri, API sözleşmeleri ve saf kurallar |
| Derleme | Vite | Ayrı frontend ve Worker çıktısı |
| Stil | Tailwind CSS, proje CSS’i | Mobil uyum ve ortak görsel dil |
| Yönlendirme | React Router / HashRouter | Statik sunucuda bağlantı yenileme |
| Hesap | Supabase Auth | Oturum, doğrulama ve parola akışları |
| Veri | PostgreSQL + RLS | Kalıcı veri ve sunucuda sahiplik denetimi |
| Dosya | Supabase Storage | Özel PDF ve görsel depoları |
| Harita | Maps JavaScript API, Places API (New) | Yakın mekan araması ve harita |
| Toplayıcı | Lever, Greenhouse | Altı şirket panosundan staj keşfi |
| Yoğunluk ML | Backend TypeScript, Python/scikit-learn eğitim araçları | Mevcut an ve +60 dakika Random Forest tahmini |
| Test | Node test runner, PGlite | Ayrıştırma, sıralama ve veritabanı kuralları |

## Hızlı başlangıç

Node.js 24 önerilir; scraper testlerinde TypeScript modülleri doğrudan çalıştırılır.

Bağımsız kurulum için [frontend README](frontend/README.md) ve [backend README](backend/README.md) belgelerini kullan. İki repo bu çalışma klasöründe hazırsa üst dizinde:

```bash
npm run install:all
```

`frontend/.env.example` → `frontend/.env.local`, `backend/.env.example` → `backend/.env.local` olarak kopyala. Supabase URL ve anahtarlarını yalnızca backend ortamına gir. Google harita tarayıcı anahtarı frontend’de, Places sunucu anahtarı backend’de tutulur. Ayrıntılar [kurulum rehberinde](docs/SETUP.md).

```bash
npm run dev
npm test
npm run build
```

Supabase kurulmadan hesapsız demo gezilebilir. Gerçek işlemler için [kurulum rehberini](docs/SETUP.md) izle. Sunucu anahtarını `VITE_` değişkenlerine koyma: bu değerler tarayıcı paketine dahil edilir.

## İçerikli gerçek demo hesabı

Yönetici ortamını hazırladıktan sonra:

```bash
npm run seed:examples
npm run demo:create
```

Script özel olarak istenen demo hesabını doğrulanmış olarak oluşturur, e-posta göndermez ve normal kullanıcıların doğrulama zorunluluğunu kapatmaz. Şifre yalnızca Git’in yok saydığı `backend/.artifacts/demo-account.json` dosyasına yazılır. Aynı dosya mevcutsa yeni hesap yaratılmaz.

Hesapta 10 gelir/gider hareketi, 6 kişisel tarih, kulüp takibi, üç kaydedilmiş gerçek staj ve kendisine ait örnek soru bulunur. Demo adresi gerçek posta kutusu değildir; parola sıfırlama e-postası almak için kullanılmamalıdır. Şifreyi kamuya açık README veya issue içine koyma.

## Kapsam ve sınırlar

Okul sistemlerine resmi bağlantı, otomatik öğrencilik doğrulaması, ödeme, sohbet, tarayıcı push bildirimi ve canlı sensör verisi yoktur. ML yoğunluk demosu ofis verisiyle sınırlıdır. Gerçek e-posta hatırlatması için Resend/SMTP ile gönderim işçisi tamamlanmalıdır. Google ve ilan sağlayıcılarının erişimi, kotaları ve kaynak yapıları dış bağımlılıklardır. Başarısız işlemler başarılı gibi gösterilmez.

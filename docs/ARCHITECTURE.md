# Mimari ve veri modeli

## İstek ve veri akışı

Tarayıcı React uygulamasını statik sunucudan yükler. HashRouter, tanıtım/kayıt sayfaları ile `/app` ve `/demo` altındaki araçları yönlendirir. `StoreProvider` oturumu izler ve gerçek kullanıcı için Supabase sorgularını yapar. Veritabanı kullanıcı JWT’sini kontrol eder, RLS ile okunabilecek ve değiştirilebilecek satırları sınırlar. Başarılı yazmadan sonra güncel veriler tekrar alınır.

Demo yolu bellekte oluşturulan, açıkça etiketli örnekleri kullanır. Sadece gerçek şirket ilanları için dar kapsamlı `public_imported_internships()` RPC’si çağrılır. Anonim ziyaretçi bütçe, takvim veya öğrenci paylaşımlarını bu fonksiyon üzerinden göremez. Demo modunda form kaydetmek gerçek başarı mesajı üretmez; kullanıcıya oturum açması söylenir.

Google araması farklı bir akıştır: `maps.ts` tarayıcıya resmi Google kütüphanesini yükler, `Place.searchNearby()` seçilen kampüsün etrafını sorgular ve sonuçları yalnızca sayfa belleğinde tutar. Supabase’deki öğrenci önerileri bu sonuçlardan bağımsızdır. Kaynakların puanları karıştırılmaz.

## Kaynak dizini

```text
src/
  App.tsx                   HashRouter, tanıtım ve modül yolları
  components/
    auth.tsx                Kayıt/giriş, callback, profil kapısı
    layout.tsx              Yan menü, mobil gezinme, üniversite seçimi
    ui.tsx                  Form, modal, durum ve hata bileşenleri
    campus-map.tsx          Google haritası ve seçili konum
    webmcp.tsx              İsteğe bağlı salt okunur kampüs özeti
  lib/
    store.tsx               Oturum, veriler, CRUD ve dosyalar
    types.ts                İlişkisel veri tipleri
    domain.ts               Para, tarih, yoğunluk, dosya kontrolleri
    seed.ts / seed-extra.ts  Etiketli ve tekrar üretilebilir örnekler
    maps.ts                 Google yükleyici ve Places adaptörü
    place-ranking.ts        Mesafe ve öğrenci uygunluk skoru
  pages/                    On araç, ana panel, profil ve politika sayfaları
supabase/
  migrations/               Şema ve yetki değişiklikleri
  functions/                Staj toplama fonksiyonu ve kaynak adaptörleri
scripts/                    Kurulum, toplama, örnek hesap ve gerçek testler
tests/                      Node/PGlite testleri
docs/                       Kurulum, mimari, entegrasyon ve kabul rehberleri
```

## Veri tablosu haritası

| Tablo | Görev ve temel ilişki |
|---|---|
| universities | Üniversite adı, kısa adı ve şehir |
| campuses | Üniversiteye bağlı kampüs ve kaynaklı referans koordinatı |
| courses | Üniversiteye bağlı ders etiketleri; demo kodlar resmi katalog değildir |
| profiles | Auth kullanıcısının özel profil kaydı |
| members | Paylaşımlarda gösterilen minimal ad; örnek yazarların oturumu yoktur |
| internships | Öğrenci, örnek veya harici kaynak ilanı; global/üniversite kapsamı |
| saved_internships | Kullanıcının kaydettiği ilanlar |
| posts / replies | Ders paylaşımı ve ona bağlı yanıtlar |
| listings | market, housing, roommate türlerini paylaşan ortak ilan modeli |
| budget_entries | Kullanıcıya özel gelir/gider; kuruş ve tarih |
| places / reviews | Öğrenci mekan önerisi ve kişi başına tek değerlendirme |
| clubs / club_events | Kulüp kataloğu ve etkinlikleri |
| club_follows | Kullanıcı takibi; resmi üyelik değildir |
| calendar_items | Özel sınav, teslim ve etkinlik tarihleri |
| notifications | Sahibine açık uygulama içi bildirim kayıtları |
| reminder_jobs | Revizyonlu e-posta görev kuyruğu hazırlığı |
| crowd_locations / crowd_reports | Kampüs alanı ve öğrencinin son durum bildirimi |
| ingestion_runs | Kaynak kontrol kilidi, sonuç, adet ve hata |

## Sahiplik ve güven sınırları

Kullanıcının arayüzde düğme görmemesi bir güvenlik kuralı değildir. Bütçe, kişisel takvim, takipler ve kaydedilenler veritabanında `auth.uid()` üzerinden filtrelenir. Paylaşılan içerik giriş yapanlara okunabilir; değişiklik yalnızca sahibine izin verir. Profilin minimal görünen adı `members` tablosuna bir trigger ile yansır. Auth e-postaları ortak kimlik tablosuna kopyalanmaz.

Stajlarda kaynak alanları sütun bazlı yetkilerle korunur. Öğrenci kendi ilanını “şirketten toplandı” olarak değiştiremez. Kaynak sağlayıcısı, kaynak anahtarı, kontrol zamanı ve örnek etiketi yönetici tarafından yazılır. Mekan önerilerinde de kullanıcı örnek etiketi gibi yönetici alanlarını seçemez.

Dosya politikaları oturum, kullanıcı klasörü ve bağlı paylaşım görünürlüğünü birlikte denetler. Dosyanın sahibi olmayan biri, henüz yayınlanmamış bir not dosyasını tahmin ederek indiremez. Paylaşılmış dosya yalnızca ilgili içeriği okuyabilen oturumlara açılır.

Sunucu anahtarı yalnızca yönetim scriptlerinde veya Edge Function ortamında kullanılır. İstemci için publishable anahtar yeterlidir. Google tarayıcı anahtarına referrer ve API kısıtları uygulanmalıdır. Google metinleri HTML olarak enjekte edilmez; React metin alanları ve haritada `textContent` kullanılır.

## Sayısal ve zamansal kurallar

Para tam sayı kuruştur. `12,50` veya `12.50` girişleri 1250 kuruşa çevrilir; ikiden fazla ondalık basamak reddedilir. Bütçe yalnızca seçilen ayın hareketlerini toplar. Büyük tutarlarda güvenli tam sayı sınırı ve veritabanı aralık kısıtı vardır.

Saatli tarihler UTC saklanır ve `Europe/Istanbul` ile gösterilir. `datetime-local` girişi Türkiye saati olarak yorumlanır. Sadece gün ifade eden bütçe tarihi `date` olarak tutulur. Yoğunluk hesaplaması gelecekteki ve bir saatten eski raporları dışlar; aynı kişinin en yeni raporunu sayar. Yeni bildirimde zaman sunucuda yenilenir.

## Yarış durumları ve hatalar

Store oturum değişimini bir epoch ile takip eder. Eski kullanıcının geç tamamlanan sorgusu yeni oturuma yazılmaz. Yenileme istekleri sıralanır; eski isteğin yeni veriyi ezmesi engellenir. Auth callback’i çift render nedeniyle tekrar tüketilmez. Form hatasında modal açık kalır; kaydetme sürerken tekrar gönderim kapalıdır.

Google aramasında kampüs/kategori değişince eski sorgunun sonucu geçersiz olur. Aynı sayfadan ayrıldıktan sonra dönen sonuç yeni ekrana yazılmaz. Sağlayıcı hatası anlaşılır mesajla gösterilir. Fiyat veya puan eksikse skor uydurulmaz.

## Hatırlatma kuyruğu hazırlığı

Takvim değişikliği bir revizyon üretir. Önceki bekleyen iş iptal edilir; tamamlanan veya silinen tarih gönderime uygun değildir. Claim işlemi lease ve kilit kullanır. Gönderim payload’ı ilk hazırlamada sabitlenir; yeniden denemede farklı içerikle aynı idempotency anahtarının kullanılması önlenir.

Bu SQL altyapısı test edilmiştir ancak dış e-posta işçisi ve gerçek teslim testi bu sürümde yoktur. `sent` durumu yalnızca sağlayıcının doğrulanmış başarılı yanıtı sonrasında yazılmalıdır. Servis kurulmadan e-posta özelliği açık gösterilmemelidir.

## Ölçek sınırları

Hackathon ölçeğinde ortak tablolar toplu yenilenir. Çok sayıda kullanıcı için sunucu tarafı sayfalama, üniversiteye göre sorgu daraltma ve seçili tablo yenilemesi eklenmelidir. Şu an polling kullanılır; gerçek zamanlı abonelik zorunlu değildir. Google araması en fazla 20 sonuç döndürür ve kapsamlı bir şehir işletme envanteri sayılmaz.

Giriş ekranının servis kontrolü geçici hatalarda üç kez denenir; yine erişilemiyorsa kullanıcı form girdisini kaybetmeden yeniden deneyebilir. Bağlantı hatası veritabanı kesinlikle kurulmamış gibi yorumlanmaz.

# Katkı ve geliştirme rehberi

## Başlangıç

README ve `docs/SETUP.md` üzerinden ortamı kur. Node 24 ve kilit dosyasıyla `npm ci` kullan. Değişikliği küçük, tek amaçlı bir dalda geliştir. Bu depo canlı proje anahtarlarını içermez; kendi geliştirme Supabase projen veya izin verilen yerel ortamı kullan.

## Yeni özellik ekleme

Önce özelliğin ortak mı kişisel mi veri tuttuğunu belirle. `src/lib/types.ts` tiplerini güncelle; gerekiyorsa yeni migration ekle. Daha önce uygulanmış migrationı sessizce değiştirmek yerine yeni dosya oluştur. İlgili RLS ve sütun yetkilerini arayüzden önce düşün: yalnızca buton gizlemek sahiplik denetimi sağlamaz.

Sayfa mevcut `PageHead`, `Modal`, `Field`, `ErrorBox` ve `useFormAction` bileşenlerini kullanabilir. Hata olduğunda kullanıcı girdisini koru. Kaydetme sürerken tekrar gönderimi engelle. Boş, yükleniyor ve hata durumlarını ekle. Form başarılı olmadan kapatma veya başarı bildirimi gösterme.

## İçerik ve örnek veri

Temsili veriyi `seed.ts` veya `seed-extra.ts` içinde açık örnek etiketiyle üret. Gerçek bir işletme, kişi veya resmi etkinlik adına uydurma ilan oluşturma. Örnek hesap yazarları için `members` kimliği yeterlidir; her örnek kişi için Auth hesabı yaratma. Canlı yoğunluk tablosuna yapay taze bildirim doldurma.

Fiyatları kuruş, saatli tarihleri UTC sakla. Üniversite ve kampüs ilişkilerini tutarlı kur. Yeni koordinatın kaynağını kaydet. Örnek ders kodlarını resmi üniversite katalog verisi gibi sunma. Kullanıcı tarafından açıkça girilmeyen hesap iletişim bilgisini ilanlara ekleme.

## Kaynak adaptörü ekleme

Staj kaynağı kamuya açık ve kullanımı uygun bir API/akış olmalıdır. Sağlayıcının resmi belgelerini incele. Sabit alan adı, zaman aşımı, sayfalama üst sınırı, kaynak kimliği ve tekrar önleme kuralı ekle. Hatalı besleme veya eksik sayfalama durumunda mevcut ilanları kapatma. İçeriğin tamamını kopyalamak yerine gerekli olgusal alanları ve kaynağa yönlendirmeyi koru.

Kaynağı `_shared/internships.ts` içine eklediğinde veritabanındaki `claim_ingestion` izin listesini de yeni migrationla genişlet. Adaptör testi, yanlış başlık eşleşmesi, bozuk cevap ve sayfalama davranışını kapsamalıdır. Gerçek sağlayıcıları her testte gereksiz çağırma; otomatik testte fixture kullan.

## Google bağlantısı

Google sonuçlarını kalıcı öğrenci önerisine otomatik kopyalama. Yeni alan istiyorsan fiyatlandırma, atıf ve saklama koşullarını kontrol et. Harita telif/Google atıflarını gizleme. Eksik fiyatı ucuz kabul etme; kullanıcıya bilinmeyen olarak göster. Arama başına sınırlı sonuç ve açık tetikleme kullan.

## Kontroller

```bash
npm test
npm run lint
npm run build
```

Yetki veya veri akışı değiştiğinde izinli test projesinde gerçek entegrasyon testi çalıştır. Test hesabı temizliğini doğrula. Görsel değişikliklerde mobil taşma, klavye odağı, dialog kapanışı ve okunabilir hata mesajını kontrol et.

## Commit ve açıklama

Commit açıklaması somut değişikliği anlatsın. PR veya değişiklik notunda hangi kullanıcı sorununu çözdüğünü, yeni davranışı ve çalıştırılan kontrolleri belirt. Henüz test edilmemiş e-posta, kaynak veya tarayıcı davranışını tamamlanmış yazma. Şifreler, `.env` dosyaları, `.artifacts`, kullanıcı verileri ve build çıktıları commit edilmez.

## Sonraki geliştirmeler

Öncelikli eksikler: Resend/SMTP ve hatırlatma işçisi; periyodik staj görevi; çoklu cihaz kabul testleri; büyüyen içerik için sayfalama; kaynak yönetimi ve moderasyon. Ödeme, mesajlaşma ve resmi okul sistemi bağlantıları ayrı kapsam kararları gerektirir.

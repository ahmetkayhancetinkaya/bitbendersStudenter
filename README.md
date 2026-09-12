# Bitbenders Studenter — KampüsKit Skeleton

Öğrencilerin ders, bütçe, barınma ve kampüs yaşamı ihtiyaçlarına yönelik hackathon projesinin **başlangıç iskeleti**.

## İçerik

- React + TypeScript + Vite + Tailwind CSS
- HashRouter ile tanıtım sayfası, ana panel ve 10 modül rotası
- Mobil uyumlu temel menü, ortak sayfa taslağı ve 404 ekranı
- Takım üyelerinin bağımsız geliştirebileceği özellik klasörleri

Bu repo tam uygulamayı içermez. CRUD, hesaplar, örnek veriler, veritabanı şeması, dosya yükleme ve e-posta gönderimi henüz uygulanmadı. Sayfalardaki “Geliştirilecek” alanları işlevsel özellik değildir.

## Çalıştırma

Node.js 22.12 veya üzeri gerekir.

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
npm run build
npm run preview
```

Başlangıç adresi: Vite'ın terminalde verdiği adres.
Ana panel: `/#/app`. Hash yönlendirmesi ve göreli varlık yolları statik yayında alt dizin kullanımını destekler.

## Klasör yapısı

```text
src/
  components/          # Ortak menü, modül bağlantıları ve boş sayfa bileşeni
  config/modules.ts    # Modül başlıkları, açıklamaları ve rota kimlikleri
  features/            # Her modülün ayrı başlangıç sayfası
  pages/               # Tanıtım, ana panel ve 404
  services/            # Gelecekteki dış servis katmanı
  App.tsx              # HashRouter ve sayfa eşleştirmeleri
  main.tsx             # React giriş noktası
  styles.css           # Temel görünüm ve Tailwind girişi
```

## Planlanan modüller

| Rota | Özellik klasörü |
| --- | --- |
| `/app/stajlar` | `features/internships` |
| `/app/notlar` | `features/notes` |
| `/app/pazar` | `features/marketplace` |
| `/app/butce` | `features/budget` |
| `/app/mekanlar` | `features/places` |
| `/app/evler` | `features/housing` |
| `/app/oda-arkadasi` | `features/roommates` |
| `/app/kulupler` | `features/clubs` |
| `/app/takvim` | `features/calendar` |
| `/app/yogunluk` | `features/crowd` |

Bir modülü geliştirmek için kendi `features/<modül>/index.tsx` dosyasındaki ortak taslağı gerçek bileşenlerle değiştir. Şimdilik uygulama rotaları herkese açıktır; gerçek hesap/veri eklemeden önce oturum kontrolü ve veritabanı erişim kuralları uygulanmalıdır.

## Sonraki entegrasyonlar

Supabase Auth, PostgreSQL ve Storage ile sunucu tarafında Resend bağlantısı planlanır. `.env.example` yalnızca boş değişken adlarını belgeler; mevcut iskelet bunları okumaz. Gerçek bağlantı bilgileri, üretim ortam dosyaları, mevcut uygulamanın kodu ve yayın ayarları bu repoya dahil edilmedi.

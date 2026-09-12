# Bağımsız frontend ve backend repoları

`frontend/` ve `backend/` ayrı Git repolarıdır. Her biri kendi `package.json`, `package-lock.json`, `.gitignore`, README, GitHub Actions ve `packages/shared/` snapshot'unu içerir. Dizinlerden biri tek başına klonlandığında diğerine ihtiyaç duymadan `npm ci`, `npm test`, `npm run lint` ve `npm run build` çalışır.

Üst çalışma klasörü eski Git geçmişini ve birlikte geliştirme/yayın yardımcılarını korur. Uygulama paketleri artık npm workspace değildir. Üst `package.json` yalnızca `npm --prefix frontend` ve `npm --prefix backend` komutlarını çağırır; iki reponun çalışma zamanı bu yardımcıları kullanmaz.

## Bağımsız kullanım

Her repoda:

```bash
npm ci
# .env.example → .env.local
npm run dev
```

Frontend varsayılan 5173, backend 3001 portunu kullanır. Frontend `API_PROXY_TARGET` backend adresini, backend `APP_ORIGIN` frontend origin'ini gösterir. Üretimde frontend origin'indeki `/api/` yolu backend'e reverse proxy edilir. Supabase sırları ve ML modelleri backend'de kalır.

## İki repo birlikte

Üst çalışma klasöründe:

```bash
npm run install:all
npm run contracts:check
npm run dev
npm test
npm run build
```

Frontend kendi `dist/` statik dosyalarını, backend kendi `dist/index.js` Worker API'sini üretir. Üst build yalnızca isteğe bağlı mevcut Sites yapısı için bunları `dist/client/`, `dist/server/` ve kayıtlı `.openai/hosting.json` ile birleştirir. İki reponun bağımsız derlemeleri Sites manifestini veya üst dizini okumaz.

## Ortak sözleşmeler

Üçüncü bir repo/registry zorunluluğunu kaldırmak için `packages/shared` v1.0.0 her repoda yerel paket olarak sürümlenir. Aynı API değişikliğinde iki snapshot'u birlikte güncelle, paket sürümünü artır ve kilit dosyalarını yenile. Üst `contracts:check` sürüm ve kaynak eşleşmesini doğrular. Bağımsız CI yalnızca kendi snapshot'unu kullanır.

## GitHub bağlantısı

Her yeni repodan, ilgili uzak repo oluşturulduktan sonra:

Üst çalışma klasörünü tek başına klonlamak bu iki yeni reponun checkout'unu oluşturmaz. İki uzak repo bağlandıktan sonra onları çalışma klasörünün `frontend/` ve `backend/` dizinlerine ayrı klonla.

```bash
git remote add origin REPO_GIT_URL
git push -u origin main
```

Her repo için kendi uzak URL'sini kullan. Yerel ilk commit'ler kaynakları içerir; `.env`, `.artifacts`, sanal ortam, ham veri ve build çıktıları yok sayılır. Eski proje geçmişi üst depoda korunur.

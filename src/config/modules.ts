export const modules = {
  stajlar: { title: 'Staj ilanları', description: 'Staj fırsatlarını keşfetme ve filtreleme alanı.' },
  notlar: { title: 'Notlar & sorular', description: 'Ders notu, kaynak ve soru paylaşım alanı.' },
  pazar: { title: 'İkinci el pazarı', description: 'Kampüs içi ikinci el ilanları alanı.' },
  butce: { title: 'Bütçe', description: 'Aylık gelir ve gider takibi alanı.' },
  mekanlar: { title: 'Öğrenci dostu mekanlar', description: 'Mekan keşfi ve değerlendirme alanı.' },
  evler: { title: 'Ev devretme', description: 'Öğrenciler arasında ev devretme ilanları alanı.' },
  'oda-arkadasi': { title: 'Oda arkadaşı', description: 'Birlikte yaşamak için oda arkadaşı arama alanı.' },
  kulupler: { title: 'Kulüpler', description: 'Okul kulüpleri ve etkinlik keşif alanı.' },
  takvim: { title: 'Takvim', description: 'Sınav ve son teslim tarihleri alanı.' },
  yogunluk: { title: 'Kampüs yoğunluğu', description: 'Kütüphane ve yemekhane yoğunluk bildirim alanı.' },
} as const

export type ModuleId = keyof typeof modules
export const moduleIds = Object.keys(modules) as ModuleId[]

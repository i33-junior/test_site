import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'database.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS content (
      section TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sort_order INTEGER DEFAULT 0,
      number TEXT,
      eyebrow TEXT,
      name TEXT,
      name_accent TEXT,
      description TEXT,
      full_description TEXT,
      time TEXT,
      price TEXT,
      image TEXT,
      device_image TEXT,
      features TEXT
    );

    CREATE TABLE IF NOT EXISTS pricing_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sort_order INTEGER DEFAULT 0,
      icon TEXT,
      title TEXT,
      title_accent TEXT,
      subtitle TEXT,
      is_first_visit INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS pricing_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER REFERENCES pricing_groups(id) ON DELETE CASCADE,
      sort_order INTEGER DEFAULT 0,
      name TEXT,
      name_small TEXT,
      time TEXT,
      price TEXT,
      old_price TEXT,
      badge TEXT,
      is_highlighted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sort_order INTEGER DEFAULT 0,
      image TEXT,
      caption TEXT
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sort_order INTEGER DEFAULT 0,
      name TEXT,
      initials TEXT,
      service TEXT,
      text TEXT,
      rating INTEGER DEFAULT 5,
      meta TEXT
    );
  `);

  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (userCount === 0) {
    seedData();
  }
}

function seedData() {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('admin', hash);

  const contentSections = {
    hero: {
      eyebrow: 'Łódź · Premium Beauty Atelier',
      line1: 'Twoje', line1_accent: 'piękno',
      line2: 'Twoja', line2_accent: 'pewność',
      line3: 'Twój', line3_accent: 'glow',
      tagline: 'Poczuj się piękną',
      tagline_script: 'każdego dnia',
      tagline_end: '— w sercu Łodzi, w naszym kameralnym atelier urody.',
      btn_primary: 'Zarezerwuj wizytę',
      btn_secondary: 'Poznaj zabiegi',
      side_rating: '5.0 · 69 opinii',
      side_label: 'EST. Łódź'
    },
    services_section: {
      eyebrow: 'Nasze zabiegi',
      title: 'Cztery', title_accent: 'filary', title_end: 'piękna',
      subtitle: 'Indywidualne rytuały pielęgnacyjne — od skóry pełnej blasku po sylwetkę pełną harmonii.'
    },
    master: {
      eyebrow: 'Twój specjalista',
      section_title: 'Mistrzostwo w', section_title_accent: 'każdym detalu',
      section_sub: 'Bo prawdziwe piękno powstaje w rękach prawdziwego eksperta.',
      badge: 'Założycielka',
      name: 'Elena', name_accent: 'Ladna',
      role: 'Certyfikowany kosmetolog · Założycielka Lady Glow',
      bio1: 'Elena to dusza i serce Lady Glow. <strong>Ponad 10 lat doświadczenia</strong> w branży beauty, certyfikaty międzynarodowe i niegasnąca pasja do swojej pracy.',
      bio2: 'Wierzy, że każda kobieta zasługuje na indywidualne podejście i najwyższą jakość usług. Łączy wiedzę ekspercką z troskliwością i ciepłą atmosferą podczas każdej wizyty.',
      quote: 'Każda klientka, która wchodzi do mojego atelier, powinna wyjść stąd promienna i pewna siebie. To moja misja.',
      skills: ['Certyfikat Geneo+', 'Endospheres Therapy', 'Depilacja laserowa', 'Peeling laserowy', 'Masaż klasyczny', 'Indywidualne konsultacje'],
      photo: ''
    },
    gallery_section: {
      eyebrow: 'Galeria',
      title: 'Atmosfera', title_accent: 'naszego', title_end: 'atelier',
      subtitle: 'Eleganckie wnętrza, profesjonalny sprzęt, momenty piękna — przekonaj się sama.'
    },
    pricing_section: {
      eyebrow: 'Cennik usług',
      title: 'Pełna oferta', title_accent: 'zabiegów',
      subtitle: 'Przejrzyste ceny i pakiety dostosowane do Twoich potrzeb. Kliknij kategorię, aby zobaczyć szczegóły.',
      note: 'Ceny <strong>"taniej do 40%"</strong> obowiązują przy zakupie pakietu zabiegów. Każda klientka otrzymuje <strong>indywidualną konsultację</strong> przed pierwszym zabiegiem.'
    },
    about: {
      eyebrow: 'Nasza filozofia',
      title: 'Miejsce, w którym', title_accent: 'piękno', title_end: 'staje się rytuałem.',
      text1: 'Lady Glow to kameralne atelier urody w sercu Łodzi, stworzone z myślą o kobietach, które wybierają <strong>najwyższą jakość</strong> dla siebie.',
      text2: 'Łączymy nowoczesne technologie estetyczne z indywidualnym podejściem do każdej klientki. Każda wizyta to chwila tylko dla Ciebie — ekskluzywna, intymna, pełna troski.',
      stats: [
        { num: '2 000+', label: 'Zadowolonych klientek' },
        { num: '5.0', label: '69 opinii Booksy' },
        { num: '100%', label: 'Premium standard' }
      ]
    },
    testimonials_section: {
      eyebrow: 'Opinie klientek',
      title: 'Słowa naszych', title_accent: 'klientek',
      subtitle: 'Bo zaufanie jest największą formą piękna.',
      rating: '5.0',
      rating_meta: 'na podstawie <strong>69 opinii</strong> z Booksy',
      booksy_url: 'https://booksy.com/pl-pl/247066_ladyglow-by-elena-ladna_depilacja_23280_lodz',
      booksy_text: 'Zobacz wszystkie 69 opinii na Booksy'
    },
    contact: {
      eyebrow: 'Skontaktuj się z nami',
      title: 'Zarezerwuj swój', title_accent: 'moment', title_end: 'piękna.',
      lead: 'Zadzwoń, napisz lub wypełnij formularz — odezwiemy się w ciągu 24 godzin i wspólnie wybierzemy idealny termin.',
      address: 'Łódź, ul. Wigury 7 lokal 02',
      address_note: '(wejście od ul. Sienkiewicza)',
      phone: '+48 884 904 792',
      hours_weekday: 'Pon — Pt  9:00 — 20:00',
      hours_weekend: 'Sob 10:00 — 16:00 · Nd zamknięte',
      form_title: 'Umów', form_title_accent: 'wizytę',
      form_sub: 'Wypełnij formularz — oddzwonimy w ciągu 24h.',
      form_services: ['Geneo+ · Glow skóry', 'Endospheres · Redukcja cellulitu', 'Depilacja laserowa', 'Peeling węglowy · Glow Skin', 'Masaż klasyczny', 'Konsultacja indywidualna']
    },
    footer: {
      tagline: 'Twoje piękno, Twoja pewność, Twój glow — każdego dnia w sercu Łodzi.',
      instagram: '#',
      facebook: '#',
      booksy: 'https://booksy.com/pl-pl/247066_ladyglow-by-elena-ladna_depilacja_23280_lodz',
      copyright: '© 2026 Lady Glow · Laser & Body Atelier · Łódź'
    },
    meta: {
      site_title: 'Lady Glow — Laser & Body Atelier · Łódź',
      site_description: 'Lady Glow Laser & Body Atelier w Łodzi. Geneo+, Endospheres Therapy, depilacja laserowa, masaż klasyczny. Poczuj się piękną każdego dnia.',
      brand_name: 'Lady Glow',
      brand_sub: 'Laser & Body Atelier'
    }
  };

  const insertContent = db.prepare('INSERT OR REPLACE INTO content (section, data) VALUES (?, ?)');
  for (const [section, data] of Object.entries(contentSections)) {
    insertContent.run(section, JSON.stringify(data));
  }

  const insertService = db.prepare(`INSERT INTO services (sort_order, number, eyebrow, name, name_accent, description, full_description, time, price, image, device_image, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  insertService.run(1, '01', 'Geneo+', 'Glow', 'skóry',
    'Trójetapowy zabieg dotleniający i regenerujący skórę od wewnątrz. Promienna, zdrowa i wyraźnie młodsza skóra już po jednej sesji.',
    'Geneo+ to innowacyjny, trójetapowy zabieg, który łączy eksfoliację, dotlenianie i infuzję aktywnych składników. Technologia OxyGeneo™ stymuluje naturalny efekt Bohra, zwiększając dopływ tlenu do komórek skóry. Rezultat? Promienna, zdrowa i wyraźnie młodsza skóra już po jednej sesji. Zabieg jest bezbolesny, bezinwazyjny i odpowiedni dla każdego typu skóry.',
    'od 60 min', 'od 150 zł', '', '',
    JSON.stringify(['Dotlenianie i regeneracja', 'Redukcja zmarszczek', 'Rozświetlenie skóry', 'Bez okresu rekonwalescencji']));

  insertService.run(2, '02', 'Endospheres Therapy', 'Redukcja', 'cellulitu',
    'Mikrowibracyjny masaż 55 silikonowymi sferami — modeluje sylwetkę, redukuje obrzęki i pomarańczową skórkę. Widocznie jędrniejsza skóra.',
    'Endospheres Therapy to zaawansowana terapia mikrowibracyjna z użyciem 55 silikonowych sfer. Zabieg skutecznie modeluje sylwetkę, redukuje cellulit i obrzęki limfatyczne. Kompresyjny mikromasaż poprawia krążenie, stymuluje drenaż limfatyczny i wygładza skórę. Efekty widoczne już po pierwszej sesji — skóra staje się jędrniejsza i gładsza.',
    '60 min', 'od 166 zł', '', '',
    JSON.stringify(['Redukcja cellulitu', 'Modelowanie sylwetki', 'Drenaż limfatyczny', 'Poprawa krążenia']));

  insertService.run(3, '03', 'Depilacja laserowa', 'Gładka', 'skóra',
    'Bezpieczna i trwała depilacja laserem diodowym — dla każdej karnacji i typu włosa. Długotrwała gładkość, komfort i pewność siebie.',
    'Depilacja laserowa laserem diodowym to najskuteczniejsza metoda trwałego usuwania owłosienia. Laser precyzyjnie niszczy mieszki włosowe, nie uszkadzając otaczającej skóry. Zabieg jest bezpieczny dla każdej karnacji i typu włosa. Po serii zabiegów skóra pozostaje gładka na długo, eliminując potrzebę codziennego golenia.',
    'od 10 min', 'od 50 zł', '', '',
    JSON.stringify(['Trwałe usuwanie włosów', 'Bezpieczne dla każdej karnacji', 'Minimalne odczucia bólowe', 'Gładka skóra na długo']));

  insertService.run(4, '04', 'Peeling węglowy laserowy', 'Glow', 'Skin',
    'Laserowy peeling węglowy oczyszcza, rozjaśnia i wygładza skórę. Idealne rozwiązanie dla rozszerzonych porów, niedoskonałości i tłustej cery.',
    'Peeling węglowy laserowy to innowacyjny zabieg oczyszczająco-rozjaśniający. Na skórę nakładana jest specjalna maska węglowa, która wnika w pory. Następnie laser precyzyjnie ją usuwa, jednocześnie oczyszczając skórę, zmniejszając pory i stymulując produkcję kolagenu. Efekt to promienista, gładka i odświeżona skóra.',
    '60-100 min', 'od 150 zł', '', '',
    JSON.stringify(['Głębokie oczyszczanie', 'Zmniejszenie porów', 'Rozjaśnienie skóry', 'Stymulacja kolagenu']));

  // Pricing groups & items
  const insertGroup = db.prepare('INSERT INTO pricing_groups (sort_order, icon, title, title_accent, subtitle, is_first_visit) VALUES (?, ?, ?, ?, ?, ?)');
  const insertItem = db.prepare('INSERT INTO pricing_items (group_id, sort_order, name, name_small, time, price, old_price, badge, is_highlighted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

  // Group 1: First visit packages
  const g1 = insertGroup.run(1, 'ti-wand', 'Gładka Skóra ·', 'Pierwsza wizyta', '9 pakietów · do 40% taniej', 1).lastInsertRowid;
  insertItem.run(g1, 1, 'Pakiet #1  Pachy + Bikini + Nogi', null, '2g', '390 zł', '650 zł', '-40%', 1);
  insertItem.run(g1, 2, 'Pakiet #2  Pachy + Bikini + Łydki', null, '1g 50min', '330 zł', '550 zł', '-40%', 1);
  insertItem.run(g1, 3, 'Pakiet #3  Pachy + Bikini głębokie', null, '1g 10min', '240 zł', '400 zł', '-40%', 1);
  insertItem.run(g1, 4, 'Pakiet #4  Pachy + Całe nogi', null, '1g 30min', '270 zł', '450 zł', '-40%', 1);
  insertItem.run(g1, 5, 'Pakiet #5  Pachy + Łydki z kolanami', null, '1g 10min', '240 zł', '400 zł', '-40%', 1);
  insertItem.run(g1, 6, 'Pakiet #6  Bikini + Całe nogi', null, '1g 30min', '300 zł', '500 zł', '-40%', 1);
  insertItem.run(g1, 7, 'Pakiet #7  Bikini + Łydki z kolanami', null, '1g 20min', '270 zł', '450 zł', '-40%', 1);
  insertItem.run(g1, 8, 'Pakiet #8  Pachy + Bikini + Całe nogi + Ręce', null, '2g 30min', '450 zł', '750 zł', '-40%', 1);
  insertItem.run(g1, 9, 'Pakiet #9  Pachy + Bikini + Łydki + Ręce', null, '2g 20min', '420 zł', '700 zł', '-40%', 1);

  // Group 2: Standard packages
  const g2 = insertGroup.run(2, 'ti-gift', 'Depilacja laserowa ·', 'Pakiety', '10 pakietów · ceny standardowe', 0).lastInsertRowid;
  insertItem.run(g2, 1, 'Pakiet #1  Pachy + Bikini + Całe nogi', null, '2g', '650 zł', null, null, 0);
  insertItem.run(g2, 2, 'Pakiet #2  Pachy + Bikini + Łydki z kolanami', null, '1g 50min', '550 zł', null, null, 0);
  insertItem.run(g2, 3, 'Pakiet #3  Pachy + Bikini głębokie', null, '1g 10min', '400 zł', null, null, 0);
  insertItem.run(g2, 4, 'Pakiet #4  Pachy + Całe nogi', null, '1g 20min', '450 zł', null, null, 0);
  insertItem.run(g2, 5, 'Pakiet #5  Pachy + Łydki z kolanami', null, '1g 10min', '400 zł', null, null, 0);
  insertItem.run(g2, 6, 'Pakiet #6  Bikini + Całe nogi', null, '1g 30min', '500 zł', null, null, 0);
  insertItem.run(g2, 7, 'Pakiet #7  Bikini + Łydki z kolanami', null, '1g 20min', '450 zł', null, null, 0);
  insertItem.run(g2, 8, 'Pakiet #8  Twarz', 'Wąsik + Podbródek + Policzki', '50min', '250 zł', null, null, 0);
  insertItem.run(g2, 9, 'Pakiet #9  Pachy + Bikini + Całe nogi + Ręce', null, '2g 30min', '750 zł', null, null, 0);
  insertItem.run(g2, 10, 'Pakiet #10  Pachy + Bikini + Łydki z kolanami + Ręce', null, '2g 20min', '700 zł', null, null, 0);

  // Group 3: Small areas
  const g3 = insertGroup.run(3, 'ti-sparkles', 'Depilacja ·', 'Małe partie', '18 usług · pojedyncze obszary', 0).lastInsertRowid;
  const smallItems = [
    ['Pachy', null, '30min', '170 zł', null, null],
    ['Bikini głębokie', null, '40min', '270 zł', null, null],
    ['Bikini płytkie', null, '15min', '200 zł', null, null],
    ['Linia brzucha (biała linia)', null, '15min', '60 zł', null, null],
    ['Całe nogi', null, '50min', '140 zł', '400 zł', '-65%'],
    ['Uda', null, '30min', '250 zł', null, null],
    ['Łydki z kolanami', null, '40min', '250 zł', null, null],
    ['Ręce całkowicie', null, '30min', '250 zł', null, null],
    ['Ręce po łokieć', null, '30min', '200 zł', null, null],
    ['Wąsik', null, '10min', '70 zł', null, null],
    ['Podbródek', null, '10min', '70 zł', null, null],
    ['Policzki', null, '30min', '100 zł', null, null],
    ['Dolna część pleców', null, '30min', '150 zł', null, null],
    ['Brzuch', null, '40min', '150 zł', null, null],
    ['Szpara pośladkowa', null, '10min', '60 zł', null, null],
    ['Pośladki', null, '40min', '300 zł', null, null],
    ['Plecy', null, '50min', '200 zł', null, null],
    ['Otoczki sutkowe / Sutki', null, '20min', '50 zł', null, null],
  ];
  smallItems.forEach(([name, small, time, price, old_price, badge], i) => {
    insertItem.run(g3, i + 1, name, small, time, price, old_price, badge, old_price ? 1 : 0);
  });

  // Group 4: Endospheres
  const g4 = insertGroup.run(4, 'ti-grain', 'Redukcja Cellulitu ·', 'Endospheres', '4 zabiegi · do 40% taniej', 0).lastInsertRowid;
  insertItem.run(g4, 1, 'VIP Intensive (pakiet)', null, '1g', '166 zł', '277 zł', '-40%', 1);
  insertItem.run(g4, 2, 'Body Contour (pakiet)', null, '1g', '179 zł', '299 zł', '-40%', 1);
  insertItem.run(g4, 3, 'Start Lymph (pakiet)', null, '1g', '190 zł', '317 zł', '-40%', 1);
  insertItem.run(g4, 4, 'Pojedyncza sesja', null, '1g', '320 zł', null, null, 0);

  // Group 5: Carbon peel
  const g5 = insertGroup.run(5, 'ti-spray', 'Laserowy Peeling Węglowy ·', 'Glow Skin', '6 zabiegów · oczyszczanie i rozjaśnianie', 0).lastInsertRowid;
  insertItem.run(g5, 1, 'Peeling węglowy  Twarz', 'tonik / krem / lampa LED', '1g', '150 zł', '250 zł', '-40%', 1);
  insertItem.run(g5, 2, 'Peeling węglowy  Twarz + Szyja', 'tonik / krem / lampa LED', '1g 30min', '200 zł', '334 zł', '-40%', 1);
  insertItem.run(g5, 3, 'Peeling węglowy  Twarz + Szyja + Dekolt', 'tonik / krem / lampa LED', '1g 40min', '250 zł', null, null, 0);
  insertItem.run(g5, 4, 'Peeling węglowy  Plecy', null, '1g', '250 zł', null, null, 0);
  insertItem.run(g5, 5, 'Peeling węglowy  Ramiona', null, '1g', '250 zł', null, null, 0);
  insertItem.run(g5, 6, 'Maska algowa / alginatowa', 'uzupełnienie zabiegu', '30min', '50 zł', null, null, 0);

  // Group 6: Legacy pricing
  const g6 = insertGroup.run(6, 'ti-rosette', 'Cennik dla stałych klientek', 'przed 16.10.2025', '17 usług · ceny bez zmian', 0).lastInsertRowid;
  const legacyItems = [
    ['Pachy + Bikini', '1g 10min', '320 zł'], ['Pachy + Nogi', '1g 20min', '400 zł'],
    ['Bikini + Nogi', '1g 30min', '450 zł'], ['Pachy + Bikini + Nogi', '2g', '500 zł'],
    ['Pachy + Bikini + Łydki', '1g 50min', '450 zł'], ['Bikini + Łydki', '1g 15min', '350 zł'],
    ['Ręce', '30min', '250 zł'], ['Ręce po łokieć', '20min', '200 zł'],
    ['Nogi', '50min', '300 zł'], ['Łydki', '40min', '250 zł'],
    ['Bikini', '40min', '250 zł'], ['Pachy', '30min', '150 zł'],
    ['Pośladki', '40min', '300 zł'], ['Twarz', '50min', '150 zł'],
    ['Wąsik', '10min', '50 zł'], ['Podbródek', '10min', '50 zł'],
    ['Brzuch', '30min', '50 zł']
  ];
  legacyItems.forEach(([name, time, price], i) => {
    insertItem.run(g6, i + 1, name, null, time, price, null, null, 0);
  });

  // Gallery
  const insertGallery = db.prepare('INSERT INTO gallery (sort_order, image, caption) VALUES (?, ?, ?)');
  const galleryItems = [
    'Recepcja · Powitanie', 'Gabinet zabiegowy', 'Geneo+ · Glow Skóry',
    'Endospheres Therapy', 'Depilacja laserowa', 'Peeling węglowy',
    'Masaż klasyczny', 'Detale wnętrza'
  ];
  galleryItems.forEach((caption, i) => insertGallery.run(i + 1, '', caption));

  // Testimonials
  const insertTest = db.prepare('INSERT INTO testimonials (sort_order, name, initials, service, text, rating, meta) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertTest.run(1, 'Iryna', 'IR', 'Endospheres Therapy',
    'Usługa przebiegła w bardzo przyjemnej atmosferze. Pani Elena bardzo jasno i szczegółowo wyjaśniła mi istotę zabiegu. Zostałam bardzo zadowolona zarówno z wizyty, jak i z efektu. Wszystko dopracowane w najmniejszych szczegółach. Polecam.',
    5, 'Potwierdzona klientka · Booksy');
  insertTest.run(2, 'Alicja', 'AL', 'Depilacja laserowa',
    'Widoczna różnica już po pierwszym zabiegu. Pani Elena ma ogromną wiedzę w zakresie beauty, a swoją pracę wykonuje bardzo starannie. Wizyta mija w świetnej atmosferze, salon jest czysty i zadbany. Nie wyobrażam sobie wrócić do innego salonu.',
    5, 'Potwierdzona klientka · Booksy');
  insertTest.run(3, 'Julia', 'JU', 'Pierwsza wizyta',
    'Od samego wejścia czułam się zaopiekowana i mile widziana. Gabinet jest czysty, przytulny i profesjonalnie wyposażony. Zabiegi przeprowadzone z dokładnością i dbałością o szczegóły. Efekty widoczne już po pierwszym spotkaniu. Właściwa osoba na właściwym miejscu.',
    5, 'Potwierdzona klientka · Booksy');

  console.log('Database seeded successfully.');
}

export default db;

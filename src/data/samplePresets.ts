import { SamplePreset, LostItem } from '../types';

// Helper to generate SVG Data URL for realistic school lost-and-found box preview
export function generateBoxSvgDataUrl(type: 'stationery' | 'gym' | 'library'): string {
  if (type === 'stationery') {
    // A tray filled with school stationery items
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <!-- Background / Wooden surface -->
      <rect width="800" height="600" fill="#f4ebd9"/>
      <path d="M0,0 L800,600 M0,200 L800,800 M0,400 L800,1000" stroke="#ebdcc4" stroke-width="1.5" opacity="0.4"/>
      
      <!-- Plastic Container Tray (Blue School Tray) -->
      <rect x="70" y="60" width="660" height="480" rx="24" fill="#1e3a8a" opacity="0.15"/>
      <rect x="80" y="70" width="640" height="460" rx="20" fill="#3b82f6" stroke="#1d4ed8" stroke-width="6"/>
      <rect x="95" y="85" width="610" height="430" rx="14" fill="#60a5fa" opacity="0.3"/>
      
      <!-- Label on box -->
      <rect x="260" y="75" width="280" height="36" rx="6" fill="#ffffff" stroke="#93c5fd" stroke-width="2"/>
      <text x="400" y="100" font-family="sans-serif" font-size="20" font-weight="bold" fill="#1e40af" text-anchor="middle">昇降口 落とし物トレイ（文房具）</text>

      <!-- Item 1: Navy Blue Zipper Pencil Case (Top Left) -->
      <g transform="translate(130, 140) rotate(-8)">
        <rect width="210" height="85" rx="16" fill="#1e293b" stroke="#0f172a" stroke-width="4"/>
        <line x1="20" y1="42" x2="190" y2="42" stroke="#cbd5e1" stroke-width="5" stroke-dasharray="4,2"/>
        <circle cx="195" cy="42" r="10" fill="#94a3b8"/>
        <!-- Star emblem -->
        <polygon points="50,22 54,32 65,32 56,38 60,48 50,42 40,48 44,38 35,32 46,32" fill="#fbbf24"/>
        <text x="110" y="65" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">STATIONERY</text>
      </g>

      <!-- Item 2: Clear Triangular Ruler (Top Right) -->
      <g transform="translate(420, 140) rotate(15)">
        <polygon points="0,140 180,140 180,0" fill="#38bdf8" opacity="0.75" stroke="#0284c7" stroke-width="3"/>
        <polygon points="35,115 145,115 145,35" fill="#f0f9ff" opacity="0.8"/>
        <!-- Measurement ticks -->
        <line x1="0" y1="140" x2="180" y2="140" stroke="#0369a1" stroke-width="3" stroke-dasharray="8,4"/>
      </g>

      <!-- Item 3: Character Handkerchief / Cloth (Center Left) -->
      <g transform="translate(140, 280) rotate(6)">
        <rect width="180" height="170" rx="8" fill="#fda4af" stroke="#f43f5e" stroke-width="3"/>
        <rect x="15" y="15" width="150" height="140" rx="4" fill="#fff1f2"/>
        <circle cx="90" cy="85" r="38" fill="#fb7185"/>
        <circle cx="78" cy="78" r="5" fill="#ffffff"/>
        <circle cx="102" cy="78" r="5" fill="#ffffff"/>
        <ellipse cx="90" cy="94" rx="8" ry="4" fill="#ffffff"/>
        <!-- Name tag attached -->
        <rect x="25" y="125" width="70" height="22" fill="#ffffff" stroke="#e11d48" stroke-width="1.5"/>
        <text x="60" y="140" font-family="sans-serif" font-size="10" fill="#be123c" text-anchor="middle">記名あり(薄)</text>
      </g>

      <!-- Item 4: Red Folding Umbrella in sleeve (Bottom Right) -->
      <g transform="translate(430, 360) rotate(-12)">
        <rect width="250" height="65" rx="20" fill="#dc2626" stroke="#991b1b" stroke-width="4"/>
        <circle cx="230" cy="32" r="16" fill="#111827"/>
        <path d="M230,32 Q250,45 235,55" stroke="#4b5563" stroke-width="6" fill="none"/>
        <line x1="30" y1="32" x2="200" y2="32" stroke="#fca5a5" stroke-width="3"/>
      </g>

      <!-- Item 5: Plastic Compass Set in transparent case (Center Right) -->
      <g transform="translate(370, 240) rotate(-5)">
        <rect width="160" height="95" rx="10" fill="#e0e7ff" opacity="0.9" stroke="#6366f1" stroke-width="3"/>
        <!-- Compass metal arms -->
        <line x1="40" y1="30" x2="120" y2="70" stroke="#4338ca" stroke-width="5" stroke-linecap="round"/>
        <line x1="40" y1="30" x2="70" y2="80" stroke="#4338ca" stroke-width="5" stroke-linecap="round"/>
        <circle cx="40" cy="30" r="8" fill="#312e81"/>
        <rect x="110" y="20" width="30" height="15" fill="#f59e0b" rx="3"/>
      </g>

      <!-- Item 6: Striped Pass Case with Coil Strap (Bottom Left) -->
      <g transform="translate(180, 430) rotate(-4)">
        <rect width="140" height="90" rx="8" fill="#10b981" stroke="#047857" stroke-width="3"/>
        <rect x="20" y="20" width="100" height="50" rx="4" fill="#d1fae5"/>
        <circle cx="70" cy="45" r="12" fill="#059669"/>
        <!-- Coil spiral strap -->
        <path d="M140,45 Q160,35 150,55 Q170,45 160,65 Q180,55 170,75" stroke="#047857" stroke-width="4" fill="none"/>
      </g>

      <!-- Shadows & highlights -->
      <circle cx="710" cy="90" r="14" fill="#ffffff" opacity="0.4"/>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  } else if (type === 'gym') {
    // Cardboard box with gym clothes, stainless bottle, towel, etc.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <!-- Background / Gym Floor Parquet -->
      <rect width="800" height="600" fill="#e5bb79"/>
      <line x1="0" y1="150" x2="800" y2="150" stroke="#c89650" stroke-width="2"/>
      <line x1="0" y1="300" x2="800" y2="300" stroke="#c89650" stroke-width="2"/>
      <line x1="0" y1="450" x2="800" y2="450" stroke="#c89650" stroke-width="2"/>

      <!-- Cardboard Box / Plastic Tote -->
      <rect x="60" y="50" width="680" height="500" rx="16" fill="#8d5b30" stroke="#5a391d" stroke-width="8"/>
      <rect x="75" y="65" width="650" height="470" rx="12" fill="#bc8753"/>
      
      <!-- Label -->
      <rect x="250" y="70" width="300" height="40" rx="6" fill="#ffffff" stroke="#5a391d" stroke-width="2"/>
      <text x="400" y="96" font-family="sans-serif" font-size="18" font-weight="bold" fill="#78350f" text-anchor="middle">体育館・部活動 落とし物保管箱</text>

      <!-- Item 1: Navy School Gym Jersey Top (Left side) -->
      <g transform="translate(100, 130) rotate(-6)">
        <path d="M30,30 L90,10 L190,10 L250,30 L220,130 L180,120 L180,260 L70,260 L70,120 L30,130 Z" fill="#1e3a5f" stroke="#0f172a" stroke-width="4"/>
        <!-- White shoulder stripes -->
        <path d="M90,10 L30,30 L40,70 L90,30 Z" fill="#ffffff" opacity="0.9"/>
        <path d="M190,10 L250,30 L240,70 L190,30 Z" fill="#ffffff" opacity="0.9"/>
        <!-- Zipper line -->
        <line x1="140" y1="20" x2="140" y2="260" stroke="#94a3b8" stroke-width="4"/>
        <!-- Chest school crest / embroidery -->
        <circle cx="105" cy="80" r="14" fill="#fbbf24"/>
        <text x="105" y="85" font-family="sans-serif" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">校章</text>
      </g>

      <!-- Item 2: Thermos Stainless Steel Water Bottle 800ml (Right top) -->
      <g transform="translate(450, 130) rotate(18)">
        <!-- Bottle body -->
        <rect x="20" y="50" width="85" height="230" rx="20" fill="#0284c7" stroke="#0369a1" stroke-width="4"/>
        <rect x="28" y="70" width="69" height="190" fill="#38bdf8" opacity="0.4"/>
        <!-- Cap with handle ring -->
        <rect x="25" y="20" width="75" height="35" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
        <ellipse cx="62" cy="15" rx="20" ry="12" fill="none" stroke="#64748b" stroke-width="6"/>
        <!-- Brand logo -->
        <text x="62" y="160" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="2">THERMOS</text>
      </g>

      <!-- Item 3: Sports Towel / Blue & Yellow Stripe (Center Bottom) -->
      <g transform="translate(300, 310) rotate(-10)">
        <rect width="260" height="150" rx="14" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
        <!-- Diagonal sports stripes -->
        <polygon points="40,0 80,0 40,150 0,150" fill="#2563eb"/>
        <polygon points="120,0 160,0 120,150 80,150" fill="#2563eb"/>
        <polygon points="200,0 240,0 200,150 160,150" fill="#2563eb"/>
      </g>

      <!-- Item 4: Black Wool Knit Gloves (Bottom Left) -->
      <g transform="translate(130, 390) rotate(12)">
        <ellipse cx="55" cy="50" rx="45" ry="50" fill="#18181b" stroke="#27272a" stroke-width="3"/>
        <rect x="25" y="80" width="60" height="35" rx="6" fill="#3f3f46"/>
        <!-- Finger ribs -->
        <line x1="35" y1="20" x2="40" y2="45" stroke="#52525b" stroke-width="4" stroke-linecap="round"/>
        <line x1="55" y1="12" x2="55" y2="45" stroke="#52525b" stroke-width="4" stroke-linecap="round"/>
        <line x1="75" y1="16" x2="70" y2="45" stroke="#52525b" stroke-width="4" stroke-linecap="round"/>
      </g>

      <!-- Item 5: Digital Stopwatch with Yellow Lanyard (Bottom Right) -->
      <g transform="translate(560, 380) rotate(-8)">
        <circle cx="50" cy="50" r="45" fill="#334155" stroke="#0f172a" stroke-width="4"/>
        <circle cx="50" cy="50" r="32" fill="#94a3b8"/>
        <!-- Digital display -->
        <rect x="30" y="38" width="40" height="20" rx="3" fill="#0f172a"/>
        <text x="50" y="52" font-family="monospace" font-size="11" fill="#4ade80" text-anchor="middle">14:28:05</text>
        <!-- Top button -->
        <rect x="42" y="0" width="16" height="8" rx="2" fill="#ef4444"/>
        <!-- Yellow cord -->
        <path d="M50,95 Q40,140 70,160 Q100,130 90,95" stroke="#eab308" stroke-width="4" fill="none"/>
      </g>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  } else {
    // Library / Study room corner: Textbooks, wireless earbuds, calculator, spectacles
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <!-- Desk wooden top -->
      <rect width="800" height="600" fill="#e2d9cc"/>

      <!-- Plastic tray with label -->
      <rect x="70" y="60" width="660" height="480" rx="18" fill="#14532d" stroke="#166534" stroke-width="6"/>
      <rect x="85" y="75" width="630" height="450" rx="14" fill="#22c55e" opacity="0.2"/>

      <rect x="250" y="75" width="300" height="38" rx="6" fill="#ffffff" stroke="#166534" stroke-width="2"/>
      <text x="400" y="100" font-family="sans-serif" font-size="18" font-weight="bold" fill="#14532d" text-anchor="middle">図書室・自習室 忘れ物置き場</text>

      <!-- Item 1: High School Math Reference Book (Left side) -->
      <g transform="translate(120, 140) rotate(-4)">
        <rect width="210" height="280" rx="6" fill="#0284c7" stroke="#0369a1" stroke-width="4"/>
        <rect x="18" y="20" width="174" height="240" fill="#ffffff" rx="4"/>
        <rect x="35" y="45" width="140" height="30" fill="#bae6fd" rx="4"/>
        <text x="105" y="66" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0369a1" text-anchor="middle">チャート式 数学II+B</text>
        <line x1="40" y1="110" x2="170" y2="110" stroke="#cbd5e1" stroke-width="4"/>
        <line x1="40" y1="130" x2="150" y2="130" stroke="#cbd5e1" stroke-width="4"/>
        <circle cx="105" cy="190" r="30" fill="#f0f9ff" stroke="#38bdf8" stroke-width="2"/>
        <text x="105" y="196" font-family="sans-serif" font-size="18" fill="#0284c7" text-anchor="middle">∫ f(x)dx</text>
        <!-- Sticky notes on top edge -->
        <rect x="30" y="5" width="22" height="25" fill="#f43f5e" rx="2"/>
        <rect x="60" y="5" width="22" height="25" fill="#eab308" rx="2"/>
        <rect x="90" y="5" width="22" height="25" fill="#22c55e" rx="2"/>
      </g>

      <!-- Item 2: Scientific Calculator (Right top) -->
      <g transform="translate(420, 140) rotate(8)">
        <rect width="140" height="200" rx="14" fill="#334155" stroke="#1e293b" stroke-width="4"/>
        <!-- Screen -->
        <rect x="15" y="18" width="110" height="42" rx="4" fill="#84cc16" stroke="#4d7c0f" stroke-width="2"/>
        <text x="115" y="44" font-family="monospace" font-size="16" fill="#14532d" text-anchor="end">3.14159265</text>
        <!-- Keypad buttons -->
        <g fill="#64748b">
          <circle cx="32" cy="80" r="8"/>
          <circle cx="56" cy="80" r="8"/>
          <circle cx="80" cy="80" r="8"/>
          <circle cx="104" cy="80" r="8"/>

          <circle cx="32" cy="105" r="8"/>
          <circle cx="56" cy="105" r="8"/>
          <circle cx="80" cy="105" r="8"/>
          <circle cx="104" cy="105" r="8"/>

          <circle cx="32" cy="130" r="8"/>
          <circle cx="56" cy="130" r="8"/>
          <circle cx="80" cy="130" r="8"/>
          <circle cx="104" cy="130" r="8"/>

          <rect x="25" y="150" width="90" height="30" rx="6" fill="#e2e8f0"/>
        </g>
      </g>

      <!-- Item 3: Wireless Earbuds Charging Case (White pebble) (Bottom Center) -->
      <g transform="translate(380, 380) rotate(-10)">
        <rect width="85" height="65" rx="30" fill="#f8fafc" stroke="#94a3b8" stroke-width="3"/>
        <line x1="5" y1="28" x2="80" y2="28" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="42" cy="40" r="3" fill="#22c55e"/>
      </g>

      <!-- Item 4: Black Eyeglasses in Clear Case (Bottom Left) -->
      <g transform="translate(150, 440) rotate(5)">
        <rect width="180" height="70" rx="14" fill="#f1f5f9" stroke="#64748b" stroke-width="3" opacity="0.9"/>
        <!-- Glasses frame -->
        <circle cx="55" cy="35" r="22" fill="none" stroke="#0f172a" stroke-width="4"/>
        <circle cx="125" cy="35" r="22" fill="none" stroke="#0f172a" stroke-width="4"/>
        <line x1="77" y1="35" x2="103" y2="35" stroke="#0f172a" stroke-width="3"/>
        <path d="M33,35 Q15,35 15,15" stroke="#0f172a" stroke-width="3" fill="none"/>
        <path d="M147,35 Q165,35 165,15" stroke="#0f172a" stroke-width="3" fill="none"/>
      </g>

      <!-- Item 5: Student ID Card on Blue Lanyard (Right Bottom) -->
      <g transform="translate(520, 360) rotate(14)">
        <rect width="130" height="90" rx="8" fill="#ffffff" stroke="#3b82f6" stroke-width="3"/>
        <rect x="12" y="15" width="35" height="42" fill="#bfdbfe" rx="3"/>
        <line x1="55" y1="25" x2="115" y2="25" stroke="#1e40af" stroke-width="4"/>
        <line x1="55" y1="40" x2="100" y2="40" stroke="#94a3b8" stroke-width="3"/>
        <line x1="55" y1="52" x2="90" y2="52" stroke="#94a3b8" stroke-width="2"/>
        <!-- Clip hole and blue ribbon -->
        <ellipse cx="65" cy="8" rx="8" ry="4" fill="#475569"/>
        <path d="M65,4 Q60,-40 90,-70" stroke="#2563eb" stroke-width="6" fill="none"/>
      </g>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'preset-stationery',
    title: 'サンプル1: 昇降口トレイ（文房具・小物）',
    location: '1F生徒昇降口 下駄箱横',
    description: '下駄箱付近で集まったトレイ。筆箱、三角定規、ハンカチ、折りたたみ傘、コンパス、定期入れなど6点。',
    imageUrl: generateBoxSvgDataUrl('stationery'),
    predefinedItems: [
      {
        id: 'item_sample_101',
        tagId: 'LF-101',
        itemName: 'ファスナー式大容量ペンケース',
        category: '文房具・学用品',
        color: 'ネイビー（紺色）',
        features: '星のエンブレム刺繍、ファスナー引手にチャーム、マチ付き',
        nameStatus: '記名なし',
        boxLocation: '手前左側',
        suggestedStorage: '文房具棚A-1',
        priority: '中',
        condition: '良好（汚れ少）',
        status: '保管中',
        dateFound: '2026-09-12', // 25 days ago -> Approaching 1 month alert!
        locationFound: '1F生徒昇降口 下駄箱横',
        box: { ymin: 233, xmin: 162, ymax: 375, xmax: 425 },
      },
      {
        id: 'item_sample_102',
        tagId: 'LF-102',
        itemName: '透明アクリル三角定規（直角二等辺）',
        category: '文房具・学用品',
        color: 'クリア・スカイブルー目盛り',
        features: '15cm目盛り、角に少し使用感あり',
        nameStatus: '記名なし',
        boxLocation: '奥側中央右',
        suggestedStorage: '文房具棚A-2（定規入れ）',
        priority: '低',
        condition: '良好',
        status: '保管中',
        dateFound: '2026-09-03', // 34 days ago -> Over 1 month alert!
        locationFound: '1F生徒昇降口 下駄箱横',
        box: { ymin: 233, xmin: 525, ymax: 466, xmax: 750 },
      },
      {
        id: 'item_sample_103',
        tagId: 'LF-103',
        itemName: 'キャラクター柄ミニタオルハンカチ',
        category: '衣類・防寒具',
        color: 'ピンク・白パイピング',
        features: 'うさぎ風キャラクターのアップリケ刺繍',
        nameStatus: '記名あり（薄くて判読困難）',
        boxLocation: '中央左側',
        suggestedStorage: '衣類ハンガーケースC',
        priority: '中',
        condition: '洗濯済み・少しシワ',
        status: '保管中',
        dateFound: '2026-10-05', // Recent
        locationFound: '1F生徒昇降口 下駄箱横',
        box: { ymin: 466, xmin: 175, ymax: 750, xmax: 400 },
      },
      {
        id: 'item_sample_104',
        tagId: 'LF-104',
        itemName: '軽量折りたたみ傘（ケース入り）',
        category: 'その他・日用品',
        color: '深紅色（ワインレッド）',
        features: '同色の収納袋入り、黒ハンドル、ストラップ付き',
        nameStatus: '記名なし',
        boxLocation: '手前右側',
        suggestedStorage: '傘立てロッカー傘B',
        priority: '中',
        condition: '良好',
        status: '保管中',
        dateFound: '2026-10-06',
        locationFound: '1F生徒昇降口 下駄箱横',
        box: { ymin: 600, xmin: 537, ymax: 708, xmax: 850 },
      },
      {
        id: 'item_sample_105',
        tagId: 'LF-105',
        itemName: '学童用プラスチックケース入りコンパス',
        category: '文房具・学用品',
        color: 'パープル/シルバー',
        features: '替芯ケース付き、安全針カバー付属',
        nameStatus: '記名なし',
        boxLocation: '中央',
        suggestedStorage: '文房具棚A-2',
        priority: '低',
        condition: '良好',
        status: '返却済み',
        dateFound: '2026-10-04',
        locationFound: '1F生徒昇降口 下駄箱横',
        claimedAt: '2026-10-06',
        claimantName: '佐藤 翔太',
        claimantClass: '1年2組',
        claimantStudentId: 'S261023',
        handledByTeacher: '山田 教諭',
        box: { ymin: 400, xmin: 462, ymax: 558, xmax: 662 },
      },
      {
        id: 'item_sample_106',
        tagId: 'LF-106',
        itemName: 'コイルストラップ付き通学用パスケース',
        category: '電子機器・貴重品',
        color: 'エメラルドグリーン',
        features: '伸縮コイルコード、カード窓あり（ICカードは抜出済み）',
        nameStatus: '裏面にイニシャル「K.T」',
        boxLocation: '手前左寄り',
        suggestedStorage: '職員室 貴重品施錠保管庫',
        priority: '高',
        condition: '使用感あり',
        status: '保管中',
        dateFound: '2026-10-07',
        locationFound: '1F生徒昇降口 下駄箱横',
        box: { ymin: 716, xmin: 225, ymax: 866, xmax: 400 },
      },
    ],
  },
  {
    id: 'preset-gym',
    title: 'サンプル2: 体育館前ボックス（衣類・水筒混合）',
    location: '第1体育館 入口下足箱前',
    description: '体育や部活動後の落とし物。体操服ジャージ、サーモス水筒、スポーツタオル、手袋、ストップウォッチなど5点。',
    imageUrl: generateBoxSvgDataUrl('gym'),
    predefinedItems: [
      {
        id: 'item_sample_201',
        tagId: 'LF-201',
        itemName: '学校指定 体操着ジャージ上着',
        category: '衣類・防寒具',
        color: '濃紺（肩に白ライン）',
        features: '左胸に校章刺繍、首元タグにネームペン跡',
        nameStatus: '「2-4 たなか」と記載あり',
        boxLocation: '左側全体',
        suggestedStorage: '体操着・衣類ハンガー段',
        priority: '中',
        condition: '目立つ傷なし・シワあり',
        status: '保管中',
        dateFound: '2026-10-07',
        locationFound: '第1体育館 入口下足箱前',
        box: { ymin: 216, xmin: 125, ymax: 650, xmax: 437 },
      },
      {
        id: 'item_sample_202',
        tagId: 'LF-202',
        itemName: 'サーモス製 ステンレス直飲み水筒 800ml',
        category: '水筒・ランチ用品',
        color: 'ブルーメタリック / 黒キャップ',
        features: 'ワンタッチオープン型、底面にシリコンカバーあり',
        nameStatus: '記名なし',
        boxLocation: '右奥側',
        suggestedStorage: '水筒保管ロッカー（衛生管理）',
        priority: '高',
        condition: '良好（中身は空洗浄済み）',
        status: '保管中',
        dateFound: '2026-10-07',
        locationFound: '第1体育館 入口下足箱前',
        box: { ymin: 216, xmin: 562, ymax: 600, xmax: 762 },
      },
      {
        id: 'item_sample_203',
        tagId: 'LF-203',
        itemName: 'スポーツブランド風マフラータオル',
        category: '衣類・防寒具',
        color: 'イエロー・ブルーストライプ',
        features: '綿100%、厚手、端にフック紐付き',
        nameStatus: '記名なし',
        boxLocation: '中央手前',
        suggestedStorage: '衣類カゴB',
        priority: '中',
        condition: '良好',
        status: '保管中',
        dateFound: '2026-09-14', // 23 days ago -> Approaching 1 month alert!
        locationFound: '第1体育館 入口下足箱前',
        box: { ymin: 516, xmin: 375, ymax: 766, xmax: 700 },
      },
      {
        id: 'item_sample_204',
        tagId: 'LF-204',
        itemName: '通学用ニット手袋（片手のみ）',
        category: '衣類・防寒具',
        color: 'ブラック（黒）',
        features: '右手用のみ、親指・人差し指にスマホ操作用導電糸',
        nameStatus: '記名なし',
        boxLocation: '手前左隅',
        suggestedStorage: '防寒具小物トレイ',
        priority: '低',
        condition: '毛玉少しあり',
        status: '保管中',
        dateFound: '2026-08-30', // 38 days ago -> Over 1 month alert!
        locationFound: '第1体育館 入口下足箱前',
        box: { ymin: 650, xmin: 162, ymax: 850, xmax: 295 },
      },
      {
        id: 'item_sample_205',
        tagId: 'LF-205',
        itemName: '部活練習用 デジタルストップウォッチ',
        category: '電子機器・貴重品',
        color: 'ダークグレー（黄色の首掛け紐）',
        features: 'ラップタイム計測機能付き、画面正常点灯中',
        nameStatus: '裏面に「陸上部備品?」テプラあり',
        boxLocation: '右下隅',
        suggestedStorage: '職員室 体育科保管棚',
        priority: '高',
        condition: '動作良好',
        status: '返却済み',
        dateFound: '2026-10-04',
        locationFound: '第1体育館 入口下足箱前',
        claimedAt: '2026-10-05',
        claimantName: '高橋 健太',
        claimantClass: '2年3組 陸上部',
        claimantStudentId: 'S252011',
        handledByTeacher: '小林 顧問',
        box: { ymin: 633, xmin: 700, ymax: 883, xmax: 862 },
      },
    ],
  },
  {
    id: 'preset-library',
    title: 'サンプル3: 自習室忘れ物コーナー（書籍・電子機器）',
    location: '本館2F 図書自習室 カウンター前',
    description: '放課後の自習机に残されていた物。チャート式数学参考書、関数電卓、ワイヤレスイヤホン、メガネ、学生証など5点。',
    imageUrl: generateBoxSvgDataUrl('library'),
    predefinedItems: [
      {
        id: 'item_sample_301',
        tagId: 'LF-301',
        itemName: 'チャート式 数学II+B（参考書）',
        category: '教科書・ノート・書籍',
        color: '青（カバー装丁）',
        features: 'ページ上部にカラフルな付箋複数あり、蛍光ペン書き込みあり',
        nameStatus: '小口（側面）に印鑑・記名なし',
        boxLocation: '左側全体',
        suggestedStorage: '書籍・教科書返却棚B',
        priority: '中',
        condition: '良好・付箋多数',
        status: '保管中',
        dateFound: '2026-10-07',
        locationFound: '本館2F 図書自習室 カウンター前',
        box: { ymin: 233, xmin: 150, ymax: 700, xmax: 412 },
      },
      {
        id: 'item_sample_302',
        tagId: 'LF-302',
        itemName: '関数電卓（高機能タイプ）',
        category: '電子機器・貴重品',
        color: 'ダークスレートグレー',
        features: '液晶画面付き、ハードスライドカバー装着',
        nameStatus: 'カバー裏に記名シール痕',
        boxLocation: '右奥側',
        suggestedStorage: '職員室 貴重品金庫',
        priority: '高',
        condition: '液晶・ボタン正常',
        status: '保管中',
        dateFound: '2026-10-07',
        locationFound: '本館2F 図書自習室 カウンター前',
        box: { ymin: 233, xmin: 525, ymax: 566, xmax: 700 },
      },
      {
        id: 'item_sample_303',
        tagId: 'LF-303',
        itemName: 'ワイヤレスイヤホン 充電ケース',
        category: '電子機器・貴重品',
        color: 'ピュアホワイト（丸型ケース）',
        features: 'LEDインジケーター緑点灯、イヤホン両耳収納確認済み',
        nameStatus: '記名なし',
        boxLocation: '中央手前',
        suggestedStorage: '職員室 貴重品金庫',
        priority: '高',
        condition: '微細なすり傷あり',
        status: '保管中',
        dateFound: '2026-10-07',
        locationFound: '本館2F 図書自習室 カウンター前',
        box: { ymin: 633, xmin: 475, ymax: 741, xmax: 581 },
      },
      {
        id: 'item_sample_304',
        tagId: 'LF-304',
        itemName: '黒縁度入りメガネ（半透明ケース入り）',
        category: 'その他・日用品',
        color: 'ブラック（黒セルフレーム）',
        features: '軽量樹脂フレーム、スクエア型、ケース内にクロス同封',
        nameStatus: '記名なし',
        boxLocation: '手前左寄り',
        suggestedStorage: '職員室A保管トレイ（破損注意）',
        priority: '高',
        condition: 'レンズ傷なし・良好',
        status: '保管中',
        dateFound: '2026-10-06',
        locationFound: '本館2F 図書自習室 カウンター前',
        box: { ymin: 733, xmin: 187, ymax: 850, xmax: 412 },
      },
      {
        id: 'item_sample_305',
        tagId: 'LF-305',
        itemName: '校内学生証（ブルーネックストラップ付き）',
        category: '電子機器・貴重品',
        color: 'ホワイトカード / 青ストラップ',
        features: '顔写真・学籍番号印字あり（最優先返却）',
        nameStatus: '3年1組 渡辺 蓮 と明記',
        boxLocation: '手前右側',
        suggestedStorage: '担任教諭・職員室即時連絡済',
        priority: '高',
        condition: '極めて良好',
        status: '返却済み',
        dateFound: '2026-10-07',
        locationFound: '本館2F 図書自習室 カウンター前',
        claimedAt: '2026-10-07',
        claimantName: '渡辺 蓮',
        claimantClass: '3年1組',
        claimantStudentId: 'S243088',
        handledByTeacher: '斎藤 司書教諭',
        box: { ymin: 600, xmin: 650, ymax: 750, xmax: 812 },
      },
    ],
  },
];

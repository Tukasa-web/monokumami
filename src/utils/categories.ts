import { LostItemCategory } from '../types';

export interface CategoryMeta {
  name: LostItemCategory;
  shortName: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconName: string;
  accentColor: string;
  description: string;
  examples: string[];
}

export const CATEGORY_META: Record<LostItemCategory, CategoryMeta> = {
  '文房具・学用品': {
    name: '文房具・学用品',
    shortName: '文房具',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    iconName: 'Pencil',
    accentColor: '#d97706',
    description: '筆箱、ペン、定規、消しゴム、ハサミ、コンパス、下敷き等',
    examples: ['ペンケース', '三角定規', '消しゴム', 'コンパスセット', '蛍光ペン'],
  },
  '衣類・防寒具': {
    name: '衣類・防寒具',
    shortName: '衣類',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    badgeBorder: 'border-blue-200',
    iconName: 'Shirt',
    accentColor: '#2563eb',
    description: 'ジャージ、体操服、制服上着、タオル、手袋、マフラー、帽子等',
    examples: ['体操着ジャージ', 'スポーツタオル', 'ニット手袋', 'マフラー', '紅白帽'],
  },
  '水筒・ランチ用品': {
    name: '水筒・ランチ用品',
    shortName: '水筒・弁当',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    iconName: 'Coffee',
    accentColor: '#059669',
    description: '水筒、サーモマグ、お弁当箱、箸箱、ランチクロス、給食袋等',
    examples: ['サーモス水筒', '直飲みステンレスボトル', '弁当箱', 'カトラリーセット'],
  },
  '教科書・ノート・書籍': {
    name: '教科書・ノート・書籍',
    shortName: '書籍・ノート',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
    iconName: 'BookOpen',
    accentColor: '#4f46e5',
    description: '教科書、ワークブック、ノート、単語帳、クリアファイル、文庫本等',
    examples: ['数学参考書', '英語ワーク', 'B5大学ノート', 'プリントファイル'],
  },
  '電子機器・貴重品': {
    name: '電子機器・貴重品',
    shortName: '貴重品・電子',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-200',
    iconName: 'Smartphone',
    accentColor: '#7c3aed',
    description: 'イヤホン、時計、関数電卓、定期券、学生証、鍵、財布等',
    examples: ['ワイヤレスイヤホン', '関数電卓', '学生証', '通学パスケース', '腕時計'],
  },
  'その他・日用品': {
    name: 'その他・日用品',
    shortName: 'その他',
    badgeBg: 'bg-slate-50',
    badgeText: 'text-slate-800',
    badgeBorder: 'border-slate-200',
    iconName: 'Package',
    accentColor: '#475569',
    description: '傘、メガネ、ポーチ、部活道具、キーホルダー、その他日用品',
    examples: ['折りたたみ傘', 'メガネケース', '部活キーホルダー', '縄跳び'],
  },
};

export const ALL_CATEGORIES: LostItemCategory[] = [
  '文房具・学用品',
  '衣類・防寒具',
  '水筒・ランチ用品',
  '教科書・ノート・書籍',
  '電子機器・貴重品',
  'その他・日用品',
];

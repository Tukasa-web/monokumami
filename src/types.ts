export type LostItemCategory =
  | '文房具・学用品'
  | '衣類・防寒具'
  | '水筒・ランチ用品'
  | '教科書・ノート・書籍'
  | '電子機器・貴重品'
  | 'その他・日用品';

export type LostItemStatus = '保管中' | '返却済み' | '廃棄・寄付予定';

export type PriorityLevel = '高' | '中' | '低';

export interface BoundingBox {
  ymin: number; // 0-1000
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface LostItem {
  id: string;
  tagId: string; // e.g. "LF-2401"
  itemName: string;
  category: LostItemCategory;
  color: string;
  features: string;
  nameStatus: string;
  boxLocation: string; // position in box
  suggestedStorage: string; // shelf location
  priority: PriorityLevel;
  condition: string;
  status: LostItemStatus;
  dateFound: string; // YYYY-MM-DD
  locationFound: string; // e.g., "体育館横ボックス", "昇降口トレイ"
  photoUrl?: string; // photo of box or item
  box?: BoundingBox;

  // Return record (when claimed)
  claimedAt?: string;
  claimantName?: string;
  claimantClass?: string;
  claimantStudentId?: string;
  handledByTeacher?: string;
  claimNotes?: string;
}

export interface BoxAnalysisResult {
  summary: string;
  totalCount: number;
  items: Omit<LostItem, 'id' | 'tagId' | 'status' | 'dateFound' | 'locationFound'>[];
}

export interface SamplePreset {
  id: string;
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  predefinedItems: LostItem[];
}

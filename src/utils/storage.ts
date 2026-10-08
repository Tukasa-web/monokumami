import { LostItem } from '../types';
import { SAMPLE_PRESETS } from '../data/samplePresets';

const STORAGE_KEY = 'school_lost_items_data_v2';

export function getInitialItems(): LostItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read from localStorage', e);
  }

  // Flatten sample items as initial seed
  const seeded = SAMPLE_PRESETS.flatMap((p) =>
    p.predefinedItems.map((item) => ({
      ...item,
      photoUrl: p.imageUrl,
    }))
  );
  saveItemsToStorage(seeded);
  return seeded;
}

export function saveItemsToStorage(items: LostItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

// Export items to CSV with Excel UTF-8 BOM
export function exportToCSV(items: LostItem[]) {
  const headers = [
    '管理ID',
    '品名',
    '大分類',
    '色・柄',
    '目立つ特徴',
    '記名有無',
    '発見日',
    '発見場所',
    '保管場所',
    '優先度',
    '状態',
    'ステータス',
    '返却日',
    '受取人生徒氏名',
    '学年クラス',
    '学籍番号',
    '対応教諭',
  ];

  const rows = items.map((it) => [
    it.tagId,
    `"${(it.itemName || '').replace(/"/g, '""')}"`,
    it.category,
    `"${(it.color || '').replace(/"/g, '""')}"`,
    `"${(it.features || '').replace(/"/g, '""')}"`,
    `"${(it.nameStatus || '').replace(/"/g, '""')}"`,
    it.dateFound,
    `"${(it.locationFound || '').replace(/"/g, '""')}"`,
    `"${(it.suggestedStorage || '').replace(/"/g, '""')}"`,
    it.priority,
    `"${(it.condition || '').replace(/"/g, '""')}"`,
    it.status,
    it.claimedAt || '',
    `"${(it.claimantName || '').replace(/"/g, '""')}"`,
    `"${(it.claimantClass || '').replace(/"/g, '""')}"`,
    it.claimantStudentId || '',
    `"${(it.handledByTeacher || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `学校落とし物管理台帳_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

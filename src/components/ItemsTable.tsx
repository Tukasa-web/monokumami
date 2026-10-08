import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  Printer,
  Edit,
  AlertTriangle,
  AlertOctagon,
  Plus,
  MapPin,
  Calendar,
  User,
  ShieldAlert,
  Bell,
} from 'lucide-react';
import { LostItem, LostItemCategory, LostItemStatus } from '../types';
import { ALL_CATEGORIES, CATEGORY_META } from '../utils/categories';
import { exportToCSV } from '../utils/storage';

interface ItemsTableProps {
  items: LostItem[];
  onOpenClaimModal: (item: LostItem) => void;
  onOpenEditModal: (item: LostItem) => void;
  onOpenReceiptModal: (item: LostItem) => void;
  onDeleteItem: (id: string) => void;
  onAddNewItem: () => void;
  onBulkUpdateStatus: (ids: string[], status: LostItemStatus) => void;
  onBulkDelete: (ids: string[]) => void;
}

// Storage alert calculation helper
// 1 month = 30 days
export function getStorageAlertInfo(dateFoundStr: string, status: LostItemStatus) {
  if (status !== '保管中') {
    return { isAlert: false, isOverdue: false, elapsedDays: 0, daysRemaining: 30, text: '', level: 'none' as const };
  }

  const today = new Date();
  const foundDate = new Date(dateFoundStr);
  if (isNaN(foundDate.getTime())) {
    return { isAlert: false, isOverdue: false, elapsedDays: 0, daysRemaining: 30, text: '', level: 'none' as const };
  }

  const elapsedDays = Math.max(
    0,
    Math.floor((today.getTime() - foundDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const daysRemaining = 30 - elapsedDays;

  if (elapsedDays >= 30) {
    // 30 days or more -> Overdue 1 month
    return {
      isAlert: true,
      isOverdue: true,
      elapsedDays,
      daysRemaining: 0,
      text: `保管${elapsedDays}日目（1か月超過）`,
      level: 'danger' as const,
    };
  } else if (elapsedDays >= 20) {
    // 20-29 days -> Approaching 1 month
    return {
      isAlert: true,
      isOverdue: false,
      elapsedDays,
      daysRemaining,
      text: `保管${elapsedDays}日目（残り${daysRemaining}日）`,
      level: 'warning' as const,
    };
  }

  return {
    isAlert: false,
    isOverdue: false,
    elapsedDays,
    daysRemaining,
    text: `保管${elapsedDays}日目`,
    level: 'normal' as const,
  };
}

export const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
  onOpenClaimModal,
  onOpenEditModal,
  onOpenReceiptModal,
  onDeleteItem,
  onAddNewItem,
  onBulkUpdateStatus,
  onBulkDelete,
}) => {
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<LostItemCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<LostItemStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyAlertFilter, setOnlyAlertFilter] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Count items with 1-month alert
  const alertItems = useMemo(() => {
    return items.filter((item) => {
      const alertInfo = getStorageAlertInfo(item.dateFound, item.status);
      return alertInfo.isAlert;
    });
  }, [items]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    ALL_CATEGORIES.forEach((cat) => (counts[cat] = 0));
    items.forEach((it) => {
      counts[it.category] = (counts[it.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Alert filter
        if (onlyAlertFilter) {
          const alertInfo = getStorageAlertInfo(item.dateFound, item.status);
          if (!alertInfo.isAlert) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

        // Status filter
        if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (item.itemName || '').toLowerCase().includes(q);
          const matchLocation = (item.locationFound || '').toLowerCase().includes(q);
          const matchCategory = (item.category || '').toLowerCase().includes(q);
          const matchClaimant = (item.claimantName || '').toLowerCase().includes(q);
          const matchDate = (item.dateFound || '').includes(q);
          if (!matchName && !matchLocation && !matchCategory && !matchClaimant && !matchDate) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Items with alerts or newest dates prioritized
        const alertA = getStorageAlertInfo(a.dateFound, a.status);
        const alertB = getStorageAlertInfo(b.dateFound, b.status);
        if (alertA.isOverdue && !alertB.isOverdue) return -1;
        if (!alertA.isOverdue && alertB.isOverdue) return 1;
        return (b.dateFound || '').localeCompare(a.dateFound || '');
      });
  }, [items, selectedCategory, selectedStatus, searchQuery, onlyAlertFilter]);

  // Select all toggle
  const isAllSelected =
    filteredItems.length > 0 && selectedIds.length === filteredItems.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {/* ⚠️ Prominent 1-Month Storage Period Alert Banner */}
      {alertItems.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white rounded-2xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <span className="p-2 bg-white/20 rounded-xl shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">
                  保管期間アラート（1か月接近・超過）
                </span>
                <span className="bg-white text-rose-700 font-extrabold px-2 py-0.5 rounded-full text-xs">
                  {alertItems.length} 件
                </span>
              </div>
              <p className="text-xs text-white/90 mt-0.5 leading-relaxed">
                拾得から<strong>20日以上経過または1か月（30日）を超過</strong>
                している落とし物があります。持ち主生徒への呼びかけや規定に基づく対応をご確認ください。
              </p>
            </div>
          </div>

          <button
            onClick={() => setOnlyAlertFilter(!onlyAlertFilter)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition shadow-xs whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 ${
              onlyAlertFilter
                ? 'bg-white text-slate-900 ring-2 ring-white/50'
                : 'bg-slate-950/40 text-white hover:bg-slate-950/60 border border-white/30'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{onlyAlertFilter ? 'すべての落とし物を表示' : 'アラート対象のみ絞り込む'}</span>
          </button>
        </div>
      )}

      {/* Control Bar: Search & Category Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="大分類、名前、発見場所、拾得日で検索..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                クリア
              </button>
            )}
          </div>

          {/* Status and Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as LostItemStatus | 'all')}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="all">ステータス: すべて</option>
              <option value="保管中">保管中のみ</option>
              <option value="返却済み">返却済みのみ</option>
              <option value="廃棄・寄付予定">廃棄・寄付予定</option>
            </select>

            {/* Quick 1-month alert filter toggle */}
            <button
              onClick={() => setOnlyAlertFilter(!onlyAlertFilter)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition flex items-center gap-1.5 ${
                onlyAlertFilter
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-300/40'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${onlyAlertFilter ? 'text-amber-700' : 'text-slate-400'}`} />
              <span>1か月アラート</span>
              {alertItems.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                  {alertItems.length}
                </span>
              )}
            </button>

            {/* Add manual item */}
            <button
              onClick={onAddNewItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>単品登録</span>
            </button>

            {/* CSV export */}
            <button
              onClick={() => exportToCSV(filteredItems)}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition shadow-xs"
              title="CSV出力"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 border ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>すべての分類</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                selectedCategory === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {categoryCounts['all']}
            </span>
          </button>

          {ALL_CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 border ${
                  isSelected
                    ? `${meta.badgeBg} ${meta.badgeText} border-emerald-500 ring-2 ring-emerald-500/20 font-bold shadow-xs`
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-white text-emerald-800 shadow-xs' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk action bar if selected */}
      {selectedIds.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
              {selectedIds.length}
            </span>
            <span>件選択中</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onBulkUpdateStatus(selectedIds, '返却済み');
                setSelectedIds([]);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>一括で「返却済み」にする</span>
            </button>

            <button
              onClick={() => {
                if (confirm(`選択した ${selectedIds.length} 点のデータを削除しますか？`)) {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                }
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 font-medium bg-white text-rose-700 border border-rose-300 rounded-lg hover:bg-rose-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>一括削除</span>
            </button>
          </div>
        </div>
      )}

      {/* Simplified, Crystal-Clear Table */}
      {/* Required columns: 大分類, 名前, 発見場所, ステータス, 拾得日 */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold text-xs">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="p-3.5 min-w-[140px]">大分類</th>
                <th className="p-3.5 min-w-[200px]">名前</th>
                <th className="p-3.5 min-w-[160px]">発見場所</th>
                <th className="p-3.5 min-w-[120px]">ステータス</th>
                <th className="p-3.5 min-w-[180px]">拾得日（保管期間）</th>
                <th className="p-3.5 min-w-[140px] text-right">操作</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600 text-sm">
                      条件に一致する落とし物はありません
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      検索条件やカテゴリの選択を変更してください
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const meta = CATEGORY_META[item.category] || CATEGORY_META['その他・日用品'];
                  const alertInfo = getStorageAlertInfo(item.dateFound, item.status);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-emerald-50/40' : ''
                      } ${
                        alertInfo.isOverdue
                          ? 'bg-rose-50/20'
                          : alertInfo.isAlert
                          ? 'bg-amber-50/20'
                          : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(item.id)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>

                      {/* 1. 大分類 */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                        >
                          <span>{item.category}</span>
                        </span>
                      </td>

                      {/* 2. 名前 (Item Name) */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-sm">
                          {item.itemName}
                        </div>
                        {/* Features / Color sub-text */}
                        {(item.color || item.features) && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.color && <span className="font-medium mr-1.5">{item.color}</span>}
                            {item.features && <span className="text-slate-400">{item.features}</span>}
                          </div>
                        )}
                      </td>

                      {/* 3. 発見場所 */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.locationFound || '未指定'}</span>
                        </div>
                        {item.boxLocation && (
                          <div className="text-[10px] text-slate-400 mt-0.5 pl-5">
                            位置: {item.boxLocation}
                          </div>
                        )}
                      </td>

                      {/* 4. ステータス */}
                      <td className="p-3.5">
                        {item.status === '返却済み' ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle className="w-3 h-3" /> 返却完了
                            </span>
                            {item.claimantName && (
                              <div className="text-[11px] text-emerald-900 mt-0.5 font-medium">
                                {item.claimantClass} {item.claimantName}
                              </div>
                            )}
                          </div>
                        ) : item.status === '廃棄・寄付予定' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
                            処分・寄付予定
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3" /> 保管中
                          </span>
                        )}
                      </td>

                      {/* 5. 拾得日 & 保管期間アラート */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.dateFound}</span>
                        </div>

                        {/* Storage Alert Badges */}
                        {item.status === '保管中' && (
                          <div className="mt-1">
                            {alertInfo.isOverdue ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                <AlertOctagon className="w-3 h-3 text-rose-600 animate-pulse" />
                                <span>{alertInfo.text}</span>
                              </span>
                            ) : alertInfo.isAlert ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>{alertInfo.text}</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                {alertInfo.text}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* 操作 (Actions) */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === '保管中' ? (
                            <button
                              onClick={() => onOpenClaimModal(item)}
                              className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-xs flex items-center gap-1"
                              title="返却手続き（受取生徒の記録）"
                            >
                              <User className="w-3 h-3" />
                              <span>返却処理</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenReceiptModal(item)}
                              className="px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1"
                              title="返却受領証を表示・印刷"
                            >
                              <Printer className="w-3 h-3" />
                              <span>受領証</span>
                            </button>
                          )}

                          <button
                            onClick={() => onOpenEditModal(item)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            title="編集"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`「${item.itemName}」を一覧から削除しますか？`)) {
                                onDeleteItem(item.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            表示中: <strong>{filteredItems.length}</strong> 件 / 全 <strong>{items.length}</strong> 件
            （保管中: {items.filter((i) => i.status === '保管中').length}件、返却完了:{' '}
            {items.filter((i) => i.status === '返却済み').length}件）
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-amber-700 font-medium">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              保管20日以上: 黄色警告
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-rose-700 font-medium">
              <AlertOctagon className="w-3 h-3 text-rose-600" />
              保管30日（1か月）超過: 赤色アラート
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

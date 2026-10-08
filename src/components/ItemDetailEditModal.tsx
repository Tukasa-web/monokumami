import React, { useState, useEffect } from 'react';
import { Edit3, Plus, X, Check, Save } from 'lucide-react';
import { LostItem, LostItemCategory, LostItemStatus, PriorityLevel } from '../types';
import { ALL_CATEGORIES } from '../utils/categories';

interface ItemDetailEditModalProps {
  item: LostItem | null;
  isOpen: boolean;
  isNew?: boolean;
  onClose: () => void;
  onSave: (savedItem: LostItem) => void;
}

export const ItemDetailEditModal: React.FC<ItemDetailEditModalProps> = ({
  item,
  isOpen,
  isNew = false,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<Partial<LostItem>>({
    id: item?.id || `lost_manual_${Date.now()}`,
    tagId: item?.tagId || `LF-${Date.now().toString().slice(-4)}`,
    itemName: item?.itemName || '',
    category: item?.category || '文房具・学用品',
    color: item?.color || '',
    features: item?.features || '',
    nameStatus: item?.nameStatus || '記名なし',
    boxLocation: item?.boxLocation || '単品拾得',
    suggestedStorage: item?.suggestedStorage || '職員室保管トレイ',
    priority: item?.priority || '中',
    condition: item?.condition || '良好',
    status: item?.status || '保管中',
    dateFound: item?.dateFound || today,
    locationFound: item?.locationFound || '職員室窓口',
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleChange = (field: keyof LostItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName?.trim()) {
      alert('品名を入力してください。');
      return;
    }

    onSave(formData as LostItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-white/10 rounded-xl">
              {isNew ? <Plus className="w-5 h-5 text-emerald-400" /> : <Edit3 className="w-5 h-5 text-emerald-400" />}
            </span>
            <div>
              <h3 className="font-bold text-base">
                {isNew ? '落とし物 単品手動登録' : '落とし物台帳 詳細編集'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                管理ID: {formData.tagId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                品名 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.itemName}
                onChange={(e) => handleChange('itemName', e.target.value)}
                placeholder="例: ファスナー付き筆箱"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                大分類（カテゴリ） <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value as LostItemCategory)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">色・外観</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                placeholder="例: 紺色、赤と白のツートン"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">記名の有無・内容</label>
              <input
                type="text"
                value={formData.nameStatus}
                onChange={(e) => handleChange('nameStatus', e.target.value)}
                placeholder="例: 記名なし、1年B組 田中"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">特徴・目印・ブランド</label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => handleChange('features', e.target.value)}
              placeholder="例: スヌーピーのチャーム付き、側面にシール跡"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">発見場所</label>
              <input
                type="text"
                value={formData.locationFound}
                onChange={(e) => handleChange('locationFound', e.target.value)}
                placeholder="例: 昇降口、体育館前、自習室"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">発見日</label>
              <input
                type="date"
                value={formData.dateFound}
                onChange={(e) => handleChange('dateFound', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">保管棚・ラック</label>
              <input
                type="text"
                value={formData.suggestedStorage}
                onChange={(e) => handleChange('suggestedStorage', e.target.value)}
                placeholder="例: 文房具棚A-1"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">管理優先度</label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="高">高（水筒・貴重品）</option>
                <option value="中">中（衣類・文具）</option>
                <option value="低">低（消耗品・ハンカチ）</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ステータス</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as LostItemStatus)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="保管中">保管中</option>
                <option value="返却済み">返却済み</option>
                <option value="廃棄・寄付予定">廃棄・寄付予定</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isNew ? '登録する' : '変更を保存'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

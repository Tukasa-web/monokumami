import React, { useState } from 'react';
import { UserCheck, Calendar, School, CheckCircle2, X } from 'lucide-react';
import { LostItem } from '../types';

interface ClaimModalProps {
  item: LostItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmClaim: (
    itemId: string,
    claimant: {
      name: string;
      studentClass: string;
      studentId: string;
      teacher: string;
      notes: string;
    }
  ) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmClaim,
}) => {
  if (!isOpen || !item) return null;

  const today = new Date().toISOString().split('T')[0];
  const [name, setName] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('2年B組');
  const [studentId, setStudentId] = useState<string>('');
  const [teacher, setTeacher] = useState<string>('職員室担当教諭');
  const [notes, setNotes] = useState<string>('本人確認の上、手渡し完了');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('受取人の生徒氏名を入力してください。');
      return;
    }

    onConfirmClaim(item.id, {
      name,
      studentClass,
      studentId,
      teacher,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-white/20 rounded-xl">
              <UserCheck className="w-5 h-5 text-emerald-100" />
            </span>
            <div>
              <h3 className="font-bold text-base">落とし物 返却・引渡手続き</h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                受取人の生徒情報と対応教員を記録し、ステータスを更新します
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Summary Card */}
        <div className="bg-slate-50 p-4 border-b border-slate-200">
          <div className="flex items-start justify-between gap-3 text-xs">
            <div>
              <span className="font-mono text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {item.tagId}
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">{item.itemName}</h4>
              <p className="text-slate-600 mt-0.5">
                【{item.category}】 色: {item.color} / 特徴: {item.features}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">発見場所</span>
              <span className="font-medium text-slate-700">{item.locationFound}</span>
            </div>
          </div>
        </div>

        {/* Claim Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                受取人生徒 氏名 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 山田 太郎"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                学年・クラス <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="例: 1年3組"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                学籍番号 / 生徒番号
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="例: S261042"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                対応教員・受付者 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="例: 佐藤 教諭"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              確認メモ・引き渡し備考
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="特徴の合致確認、記名の一致、保護者受取など"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
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
              <CheckCircle2 className="w-4 h-4" />
              <span>返却完了として登録</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

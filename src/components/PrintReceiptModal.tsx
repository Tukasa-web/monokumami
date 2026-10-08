import React from 'react';
import { Printer, X, ShieldCheck } from 'lucide-react';
import { LostItem } from '../types';

interface PrintReceiptModalProps {
  item: LostItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm">落とし物返却 受領確認証（印刷プレビュー）</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>印刷する</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Sheet */}
        <div className="p-8 bg-white text-slate-900 print:p-0" id="receipt-print-area">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
            <span className="text-[11px] tracking-widest text-slate-500 uppercase block mb-1">
              SCHOOL LOST PROPERTY RECEIPT CONFIRMATION
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              学校落とし物 受領確認証（控え）
            </h2>
            <div className="flex justify-between items-center text-xs text-slate-500 mt-3">
              <span>管理番号: {item.tagId}</span>
              <span>発行日: {item.claimedAt || new Date().toISOString().split('T')[0]}</span>
            </div>
          </div>

          {/* Statement */}
          <p className="text-xs text-slate-700 leading-relaxed mb-6">
            下記の落とし物について、本校規定に基づき本人確認を実施のうえ、受取人生徒に引き渡しを完了したことを証明・記録いたします。
          </p>

          {/* Item Details Table */}
          <table className="w-full text-xs border border-slate-300 mb-6 border-collapse">
            <tbody>
              <tr className="border-b border-slate-200">
                <th className="bg-slate-100 p-2.5 text-left w-28 font-semibold border-r border-slate-200">
                  品 名
                </th>
                <td className="p-2.5 font-bold text-slate-900">{item.itemName}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="bg-slate-100 p-2.5 text-left font-semibold border-r border-slate-200">
                  大分類 / 色
                </th>
                <td className="p-2.5">
                  {item.category} ／ {item.color}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="bg-slate-100 p-2.5 text-left font-semibold border-r border-slate-200">
                  特徴・記名
                </th>
                <td className="p-2.5">{item.features}（{item.nameStatus}）</td>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="bg-slate-100 p-2.5 text-left font-semibold border-r border-slate-200">
                  拾得場所・日時
                </th>
                <td className="p-2.5">
                  {item.locationFound}（{item.dateFound} 拾得）
                </td>
              </tr>
            </tbody>
          </table>

          {/* Claimant Information Table */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-800 mb-2">【受領者（生徒）記録】</h4>
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <th className="bg-slate-100 p-2.5 text-left w-28 font-semibold border-r border-slate-200">
                    学年・クラス
                  </th>
                  <td className="p-2.5">{item.claimantClass || '未記入'}</td>
                  <th className="bg-slate-100 p-2.5 text-left w-24 font-semibold border-r border-slate-200">
                    学籍番号
                  </th>
                  <td className="p-2.5">{item.claimantStudentId || '未記入'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="bg-slate-100 p-2.5 text-left font-semibold border-r border-slate-200">
                    受取人生徒氏名
                  </th>
                  <td colSpan={3} className="p-2.5 font-bold text-slate-900 text-sm">
                    {item.claimantName || '未記入'}
                  </td>
                </tr>
                <tr>
                  <th className="bg-slate-100 p-2.5 text-left font-semibold border-r border-slate-200">
                    対応担当教員
                  </th>
                  <td colSpan={3} className="p-2.5">
                    {item.handledByTeacher || '職員室担当'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures & Seal Box */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
            <div className="border border-slate-300 rounded-lg p-3 text-center">
              <span className="block text-[10px] text-slate-400 mb-6">生徒受取確認サイン</span>
              <div className="border-b border-dashed border-slate-400 mx-4 h-6"></div>
              <span className="text-[10px] text-slate-500 mt-2 block">本人自署</span>
            </div>

            <div className="border border-slate-300 rounded-lg p-3 text-center flex flex-col justify-between items-center">
              <span className="block text-[10px] text-slate-400">学校確認印</span>
              <div className="w-12 h-12 rounded-full border border-dashed border-rose-300 flex items-center justify-center text-[10px] text-rose-300 font-serif my-1">
                校印
              </div>
              <span className="text-[10px] text-slate-500">生活指導部・生徒課</span>
            </div>
          </div>

          <div className="mt-6 text-[10px] text-slate-400 text-center">
            ※ 本受領証は学校落とし物管理システムにより自動生成・記録されました。
          </div>
        </div>
      </div>
    </div>
  );
};

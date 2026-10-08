import React from 'react';
import {
  Camera,
  ClipboardList,
  Download,
  Plus,
  RotateCcw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { LostItem } from '../types';
import { exportToCSV } from '../utils/storage';

interface NavbarProps {
  activeTab: 'scanner' | 'table';
  setActiveTab: (tab: 'scanner' | 'table') => void;
  items: LostItem[];
  onAddNewItem: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  items,
  onAddNewItem,
  onResetData,
}) => {
  const totalCount = items.length;
  const holdingCount = items.filter((i) => i.status === '保管中').length;
  const claimedCount = items.filter((i) => i.status === '返却済み').length;

  // Calculate items approaching or exceeding 1 month (30 days)
  const todayMs = new Date('2026-10-07').getTime();
  const alertItemsCount = items.filter((i) => {
    if (i.status !== '保管中') return false;
    const foundMs = new Date(i.dateFound).getTime();
    if (isNaN(foundMs)) return false;
    const diffDays = Math.floor((todayMs - foundMs) / (1000 * 60 * 60 * 24));
    return diffDays >= 20; // 20 days or more
  }).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-100">
              学校落とし物管理システム
            </span>
            <span className="text-emerald-300">|</span>
            <span className="text-emerald-200">
              落とし物ボックスの写真からAIが自動検出・大まかに分類・台帳化
            </span>
          </div>

          <div className="flex items-center gap-3 text-emerald-200">
            {alertItemsCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full text-[11px] animate-pulse">
                <AlertTriangle className="w-3 h-3 text-slate-900" />
                1か月保管アラート: {alertItemsCount}件
              </span>
            )}
            <span className="hidden sm:inline flex items-center gap-1 text-emerald-200">
              <Sparkles className="w-3 h-3 text-amber-300" /> Powered by Gemini Vision
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-slate-900 tracking-tight">
                  落とし物AIチェッカー
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  学校向け管理システム
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                ボックス写真を撮るだけで一覧表に整理・保管期限（1か月）管理
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">総件数:</span>
              <span className="font-bold text-slate-800">{totalCount}点</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-600 font-medium">保管中:</span>
              <span className="font-bold text-amber-700">{holdingCount}点</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-medium">返却完了:</span>
              <span className="font-bold text-emerald-700">{claimedCount}点</span>
            </div>
            {alertItemsCount > 0 && (
              <>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>期限近・超過: {alertItemsCount}点</span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onAddNewItem}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-xs"
              title="単品を手動で登録"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">単品手動登録</span>
            </button>

            <button
              onClick={() => exportToCSV(items)}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-xs"
              title="一覧表をCSVでダウンロード"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">CSV出力</span>
            </button>

            <button
              onClick={onResetData}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              title="初期デモデータにリセット"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Simplified to 2 core tabs */}
        <nav className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none border-t border-slate-100">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'scanner'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>ボックス写真AI解析</span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-bold">
              AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'table'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>落とし物一覧表</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.2 rounded-full font-semibold">
              {totalCount}
            </span>
            {alertItemsCount > 0 && (
              <span className="text-[11px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                {alertItemsCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

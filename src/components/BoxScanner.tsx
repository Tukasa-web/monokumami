import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  PlusCircle,
  Tag,
  MapPin,
  Box,
  Layers,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { LostItem, LostItemCategory, PriorityLevel } from '../types';
import { SAMPLE_PRESETS } from '../data/samplePresets';
import { CATEGORY_META } from '../utils/categories';

interface BoxScannerProps {
  onRegisterBatch: (items: LostItem[]) => void;
  onGoToTable: () => void;
}

interface DetectedItemPreview {
  tempId: string;
  itemName: string;
  category: LostItemCategory;
  color: string;
  features: string;
  nameStatus: string;
  boxLocation: string;
  suggestedStorage: string;
  priority: PriorityLevel;
  condition: string;
  box?: {
    ymin: number;
    xmin: number;
    ymax: number;
    xmax: number;
  };
}

export const BoxScanner: React.FC<BoxScannerProps> = ({ onRegisterBatch, onGoToTable }) => {
  // Input image state
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_PRESETS[0].imageUrl);
  const [locationName, setLocationName] = useState<string>(SAMPLE_PRESETS[0].location);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SAMPLE_PRESETS[0].id);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(
    '昇降口のプラスチックトレイより文房具・小物計6点を検出しました。定期入れや傘など持ち主が困りやすい物品を早期返却できるよう整理済みです。'
  );
  const [detectedItems, setDetectedItems] = useState<DetectedItemPreview[]>(
    SAMPLE_PRESETS[0].predefinedItems.map((item, idx) => ({
      tempId: `prev_${idx}`,
      itemName: item.itemName,
      category: item.category,
      color: item.color,
      features: item.features,
      nameStatus: item.nameStatus,
      boxLocation: item.boxLocation,
      suggestedStorage: item.suggestedStorage,
      priority: item.priority,
      condition: item.condition,
      box: item.box,
    }))
  );

  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Handle preset selection
  const handleSelectPreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(preset.id);
    setSelectedImage(preset.imageUrl);
    setLocationName(preset.location);
    setIsRegisteredSuccess(false);
    setErrorMsg(null);

    // Load predefined analysis
    setDetectedItems(
      preset.predefinedItems.map((item, idx) => ({
        tempId: `prev_${idx}`,
        itemName: item.itemName,
        category: item.category,
        color: item.color,
        features: item.features,
        nameStatus: item.nameStatus,
        boxLocation: item.boxLocation,
        suggestedStorage: item.suggestedStorage,
        priority: item.priority,
        condition: item.condition,
        box: item.box,
      }))
    );

    if (preset.id === 'preset-stationery') {
      setSummary(
        '昇降口のプラスチックトレイより文房具・小物計6点を検出しました。定期入れや傘など持ち主が困りやすい物品を早期返却できるよう整理済みです。'
      );
    } else if (preset.id === 'preset-gym') {
      setSummary(
        '体育館前保管箱より体操着ジャージ・水筒など計5点を検出しました。水筒は衛生保持のため早期の引き取りを呼びかけてください。'
      );
    } else {
      setSummary(
        '自習室忘れ物コーナーより参考書・関数電卓・学生証など計5点を検出。学生証には氏名記載があるため即時連絡を推奨します。'
      );
    }
  };

  // Handle user uploaded photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSelectedImage(result);
        setSelectedPresetId('custom');
        setIsRegisteredSuccess(false);
        setErrorMsg(null);
        // Automatically start AI analysis
        analyzeWithAI(result, locationName);
      }
    };
    reader.readAsDataURL(file);
  };

  // Run AI analysis through Express endpoint
  const analyzeWithAI = async (imageToAnalyze: string, location: string) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setIsRegisteredSuccess(false);

    try {
      const response = await fetch('/api/analyze-box', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageToAnalyze,
          locationName: location,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `サーバーエラー (${response.status})`);
      }

      const data = await response.json();
      setSummary(data.summary || '解析が完了しました。');

      if (Array.isArray(data.items) && data.items.length > 0) {
        const formatted: DetectedItemPreview[] = data.items.map((it: any, idx: number) => ({
          tempId: `prev_${Date.now()}_${idx}`,
          itemName: it.itemName || '不明な物品',
          category: (it.category as LostItemCategory) || 'その他・日用品',
          color: it.color || '不明',
          features: it.features || '特になし',
          nameStatus: it.nameStatus || '記名なし',
          boxLocation: it.boxLocation || 'ボックス内',
          suggestedStorage: it.suggestedStorage || '未定',
          priority: (it.priority as PriorityLevel) || '中',
          condition: it.condition || '良好',
          box: it.box || {
            ymin: 200 + (idx % 3) * 200,
            xmin: 150 + ((idx * 2) % 4) * 150,
            ymax: 400 + (idx % 3) * 200,
            xmax: 350 + ((idx * 2) % 4) * 150,
          },
        }));
        setDetectedItems(formatted);
      } else {
        setDetectedItems([]);
        setErrorMsg('落とし物が検出されませんでした。より鮮明な写真を撮影してください。');
      }
    } catch (err: any) {
      console.error('AI analysis error:', err);
      // Fallback for demonstration if API fails
      setErrorMsg(
        `Gemini API解析通信: ${err.message || '接続エラー'}。サンプルプリセットで全機能をお試しいただけます。`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Edit item in preview table
  const handleUpdateItem = (index: number, field: keyof DetectedItemPreview, value: any) => {
    const updated = [...detectedItems];
    updated[index] = { ...updated[index], [field]: value };
    setDetectedItems(updated);
  };

  // Delete item from preview
  const handleDeletePreviewItem = (index: number) => {
    setDetectedItems(detectedItems.filter((_, idx) => idx !== index));
  };

  // Register all detected items into Master Table
  const handleRegisterAll = () => {
    if (detectedItems.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const timestamp = Date.now().toString().slice(-4);

    const itemsToSave: LostItem[] = detectedItems.map((item, index) => ({
      id: `lost_${Date.now()}_${index}`,
      tagId: `LF-${timestamp}${index + 1}`,
      itemName: item.itemName,
      category: item.category,
      color: item.color,
      features: item.features,
      nameStatus: item.nameStatus,
      boxLocation: item.boxLocation,
      suggestedStorage: item.suggestedStorage,
      priority: item.priority,
      condition: item.condition,
      status: '保管中',
      dateFound: today,
      locationFound: locationName || '昇降口落とし物トレイ',
      photoUrl: selectedImage,
      box: item.box,
    }));

    onRegisterBatch(itemsToSave);
    setIsRegisteredSuccess(true);
  };

  // Category counts
  const categoryCounts = detectedItems.reduce((acc, it) => {
    acc[it.category] = (acc[it.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Top Introduction & How-to */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                落とし物ボックス 写真一括解析（AI Scanner）
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              学校の「落とし物コーナー」や「かご」の写真を撮るだけで、Gemini
              AIが箱の中の物品を個別に識別。
              <strong>大まかな6分類（文房具、衣類、水筒、書籍、貴重品、その他）</strong>
              に仕分けし、特徴・記名の有無・保管場所を自動で表にまとめます。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition shadow-xs"
            >
              <Camera className="w-4 h-4" />
              <span>カメラで撮影</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition shadow-xs"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>写真ファイルを選択</span>
            </button>
          </div>
        </div>

        {/* 1-Click Test Presets */}
        <div className="mt-4 pt-3 border-t border-emerald-200/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Box className="w-3.5 h-3.5 text-emerald-600" /> すぐ試せるサンプルボックス写真:
          </span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-3 py-1.5 rounded-lg border transition font-medium flex items-center gap-1.5 ${
                selectedPresetId === preset.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'
              }`}
            >
              <span>{preset.title.split(':')[0]}</span>
              <span className="opacity-75 text-[11px]">({preset.title.split(':')[1]?.trim()})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Photo & Bounding Box Viewer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-500">撮影・設置場所:</span>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="例: 1F昇降口 下駄箱横"
                  className="text-xs font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-400">ホバーで位置確認</span>
            </div>

            {/* Interactive Image Container */}
            <div className="relative mt-3 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 aspect-[4/3] flex items-center justify-center group">
              <img
                src={selectedImage}
                alt="落とし物ボックスの写真"
                className="w-full h-full object-contain"
              />

              {/* Bounding Box Overlays */}
              {detectedItems.map((item, idx) => {
                if (!item.box) return null;
                const isHovered = hoveredItemIndex === idx;
                const catMeta = CATEGORY_META[item.category];

                // Coordinates in percent (0-1000 converted to %)
                const top = `${(item.box.ymin / 1000) * 100}%`;
                const left = `${(item.box.xmin / 1000) * 100}%`;
                const height = `${((item.box.ymax - item.box.ymin) / 1000) * 100}%`;
                const width = `${((item.box.xmax - item.box.xmin) / 1000) * 100}%`;

                return (
                  <div
                    key={item.tempId || idx}
                    onMouseEnter={() => setHoveredItemIndex(idx)}
                    onMouseLeave={() => setHoveredItemIndex(null)}
                    style={{ top, left, width, height }}
                    className={`absolute transition-all cursor-pointer pointer-events-auto rounded-md ${
                      isHovered
                        ? 'border-3 border-amber-400 bg-amber-400/25 z-30 shadow-lg scale-102'
                        : 'border-2 border-emerald-400/80 bg-emerald-500/10 hover:border-amber-400 hover:bg-amber-400/20 z-10'
                    }`}
                  >
                    {/* Badge pin on corner */}
                    <div
                      className={`absolute -top-3 -left-3 px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-0.5 transition ${
                        isHovered
                          ? 'bg-amber-500 text-slate-900 ring-2 ring-white scale-110'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      <span>#{idx + 1}</span>
                    </div>

                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-900/95 text-white text-[11px] px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap z-40 pointer-events-none">
                        <p className="font-bold text-amber-300">
                          #{idx + 1} {item.itemName}
                        </p>
                        <p className="text-slate-300 text-[10px]">
                          [{item.category}] {item.color}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Scanning Overlay Spinner when analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex flex-col items-center justify-center text-white z-50">
                  <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Gemini 3.8 Flash がボックス内を解析中...
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    重なり合う物品を分離・6大分類に仕分け中
                  </p>
                </div>
              )}
            </div>

            {/* Photo Action Bar */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                枠線にカーソルを合わせると右の表と連動します
              </span>

              <button
                disabled={isAnalyzing}
                onClick={() => analyzeWithAI(selectedImage, locationName)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>再解析を実行</span>
              </button>
            </div>
          </div>

          {/* AI Observation Summary Box */}
          {summary && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-start gap-2.5">
                <span className="p-1 bg-teal-100 text-teal-800 rounded-md mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    AI概況レポート・アドバイス
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{summary}</p>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right Column: Detected Items Table & Classification (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            {/* Header with counts and register action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">
                    写真から抽出された落とし物一覧
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
                    {detectedItems.length} 点検出
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  内容を確認・修正した上で、本登録ボタンで学校管理台帳へ登録できます
                </p>
              </div>

              {/* Register button */}
              <button
                disabled={detectedItems.length === 0 || isAnalyzing}
                onClick={handleRegisterAll}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition shadow-sm ${
                  isRegisteredSuccess
                    ? 'bg-teal-700 text-white hover:bg-teal-800'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                } disabled:opacity-50`}
              >
                {isRegisteredSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>台帳に登録完了！ (再登録も可)</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>この{detectedItems.length}点を台帳（表）に本登録</span>
                  </>
                )}
              </button>
            </div>

            {/* Broad Category Distribution Pills */}
            <div className="pt-3 pb-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-500 mr-1 text-[11px]">分類内訳:</span>
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const meta = CATEGORY_META[cat as LostItemCategory];
                return (
                  <span
                    key={cat}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium ${
                      meta ? `${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}` : 'bg-slate-100'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="font-bold bg-white/70 px-1.5 py-0.2 rounded-full text-[10px]">
                      {count}点
                    </span>
                  </span>
                );
              })}
            </div>

            {/* Success Banner when registered */}
            {isRegisteredSuccess && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>台帳への登録が完了しました！</strong>「落とし物台帳・一覧表」タブで確認・返却手続きが可能です。
                  </span>
                </div>
                <button
                  onClick={onGoToTable}
                  className="font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 shrink-0"
                >
                  台帳一覧を開く <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* List / Table of Detected Items */}
            <div className="mt-4 overflow-x-auto">
              {detectedItems.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Box className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">落とし物が未検出です</p>
                  <p className="text-xs text-slate-500 mt-1">
                    上部の「サンプルボックス写真」を選択するか、新しい写真をアップロードしてください
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {detectedItems.map((item, idx) => {
                    const isHovered = hoveredItemIndex === idx;
                    const meta = CATEGORY_META[item.category] || CATEGORY_META['その他・日用品'];

                    return (
                      <div
                        key={item.tempId || idx}
                        onMouseEnter={() => setHoveredItemIndex(idx)}
                        onMouseLeave={() => setHoveredItemIndex(null)}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isHovered
                            ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-200/60 shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          {/* Item Title & Category */}
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                                isHovered
                                  ? 'bg-amber-500 text-slate-900'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              #{idx + 1}
                            </span>

                            {/* Category Selector */}
                            <select
                              value={item.category}
                              onChange={(e) =>
                                handleUpdateItem(
                                  idx,
                                  'category',
                                  e.target.value as LostItemCategory
                                )
                              }
                              className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder} focus:outline-none`}
                            >
                              <option value="文房具・学用品">✏️ 文房具・学用品</option>
                              <option value="衣類・防寒具">👕 衣類・防寒具</option>
                              <option value="水筒・ランチ用品">🍶 水筒・ランチ用品</option>
                              <option value="教科書・ノート・書籍">📚 教科書・ノート・書籍</option>
                              <option value="電子機器・貴重品">📱 電子機器・貴重品</option>
                              <option value="その他・日用品">🌂 その他・日用品</option>
                            </select>

                            {/* Item Name Input (Editable inline) */}
                            <input
                              type="text"
                              value={item.itemName}
                              onChange={(e) => handleUpdateItem(idx, 'itemName', e.target.value)}
                              className="font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none px-1"
                            />
                          </div>

                          {/* Delete Item from preview */}
                          <button
                            onClick={() => handleDeletePreviewItem(idx)}
                            className="text-xs text-slate-400 hover:text-rose-600 transition self-end sm:self-auto"
                            title="除外する"
                          >
                            除外
                          </button>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mt-2.5 pt-2 border-t border-slate-200/60 text-xs">
                          <div>
                            <span className="text-[11px] text-slate-500 block">色・外観:</span>
                            <input
                              type="text"
                              value={item.color}
                              onChange={(e) => handleUpdateItem(idx, 'color', e.target.value)}
                              className="w-full text-xs text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 focus:outline-none"
                            />
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-500 block">記名の有無:</span>
                            <input
                              type="text"
                              value={item.nameStatus}
                              onChange={(e) => handleUpdateItem(idx, 'nameStatus', e.target.value)}
                              className="w-full text-xs text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 focus:outline-none"
                            />
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-500 block">
                              ボックス内の位置:
                            </span>
                            <input
                              type="text"
                              value={item.boxLocation}
                              onChange={(e) => handleUpdateItem(idx, 'boxLocation', e.target.value)}
                              className="w-full text-xs text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 focus:outline-none"
                            />
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-500 block">推奨保管棚:</span>
                            <input
                              type="text"
                              value={item.suggestedStorage}
                              onChange={(e) =>
                                handleUpdateItem(idx, 'suggestedStorage', e.target.value)
                              }
                              className="w-full text-xs text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Distinctive Features */}
                        <div className="mt-2 text-xs">
                          <span className="text-[11px] text-slate-500">特徴・備考:</span>
                          <input
                            type="text"
                            value={item.features}
                            onChange={(e) => handleUpdateItem(idx, 'features', e.target.value)}
                            placeholder="キャラクター、キーホルダー、型番など"
                            className="w-full text-xs text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 focus:outline-none mt-0.5"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Register Confirmation Bar */}
            {detectedItems.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  ※ 登録後も台帳からいつでも追記・編集・削除が可能です。
                </p>

                <button
                  disabled={isAnalyzing}
                  onClick={handleRegisterAll}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>検出された全 {detectedItems.length} 点を台帳に登録する</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

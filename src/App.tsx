import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BoxScanner } from './components/BoxScanner';
import { ItemsTable } from './components/ItemsTable';
import { ClaimModal } from './components/ClaimModal';
import { PrintReceiptModal } from './components/PrintReceiptModal';
import { ItemDetailEditModal } from './components/ItemDetailEditModal';
import { LostItem, LostItemStatus } from './types';
import { getInitialItems, saveItemsToStorage } from './utils/storage';
import { SAMPLE_PRESETS } from './data/samplePresets';

export default function App() {
  const [items, setItems] = useState<LostItem[]>(() => getInitialItems());
  const [activeTab, setActiveTab] = useState<'scanner' | 'table'>('table');

  // Modal States
  const [claimItem, setClaimItem] = useState<LostItem | null>(null);
  const [receiptItem, setReceiptItem] = useState<LostItem | null>(null);
  const [editItem, setEditItem] = useState<LostItem | null>(null);
  const [isNewItemModal, setIsNewItemModal] = useState<boolean>(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync with LocalStorage
  useEffect(() => {
    saveItemsToStorage(items);
  }, [items]);

  // Batch register items from Box Scanner
  const handleRegisterBatch = (newItems: LostItem[]) => {
    setItems((prev) => [...newItems, ...prev]);
    showToast(`📸 ${newItems.length}件の落とし物を一覧表に登録しました！`);
  };

  // Confirm claim for student
  const handleConfirmClaim = (
    itemId: string,
    claimant: {
      name: string;
      studentClass: string;
      studentId: string;
      teacher: string;
      notes: string;
    }
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const updated: LostItem = {
            ...it,
            status: '返却済み',
            claimedAt: today,
            claimantName: claimant.name,
            claimantClass: claimant.studentClass,
            claimantStudentId: claimant.studentId,
            handledByTeacher: claimant.teacher,
            claimNotes: claimant.notes,
          };
          // Offer print receipt
          setReceiptItem(updated);
          return updated;
        }
        return it;
      })
    );
    showToast(`✅ 「${claimant.name}」さんへの返却完了を記録しました。受領証を印刷できます。`);
  };

  // Save edited or newly added manual item
  const handleSaveItem = (savedItem: LostItem) => {
    setItems((prev) => {
      const exists = prev.some((it) => it.id === savedItem.id);
      if (exists) {
        return prev.map((it) => (it.id === savedItem.id ? savedItem : it));
      } else {
        return [savedItem, ...prev];
      }
    });
    showToast(`💾 落とし物「${savedItem.itemName}」を保存しました。`);
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    showToast('🗑️ 落とし物データを削除しました。');
  };

  // Bulk update status
  const handleBulkUpdateStatus = (ids: string[], status: LostItemStatus) => {
    const today = new Date().toISOString().split('T')[0];
    setItems((prev) =>
      prev.map((it) => {
        if (ids.includes(it.id)) {
          return {
            ...it,
            status,
            ...(status === '返却済み' && !it.claimedAt ? { claimedAt: today } : {}),
          };
        }
        return it;
      })
    );
    showToast(`⚡ ${ids.length}件のステータスを「${status}」に更新しました。`);
  };

  // Bulk delete
  const handleBulkDelete = (ids: string[]) => {
    setItems((prev) => prev.filter((it) => !ids.includes(it.id)));
    showToast(`🗑️ ${ids.length}件のデータを一括削除しました。`);
  };

  // Reset demo data
  const handleResetData = () => {
    if (confirm('初期デモサンプルデータにリセットしますか？')) {
      const seeded = SAMPLE_PRESETS.flatMap((p) =>
        p.predefinedItems.map((item) => ({
          ...item,
          photoUrl: p.imageUrl,
        }))
      );
      setItems(seeded);
      saveItemsToStorage(seeded);
      showToast('🔄 サンプルデータを初期状態に復元しました。');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        items={items}
        onAddNewItem={() => {
          setEditItem(null);
          setIsNewItemModal(true);
        }}
        onResetData={handleResetData}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'scanner' && (
          <BoxScanner
            onRegisterBatch={handleRegisterBatch}
            onGoToTable={() => setActiveTab('table')}
          />
        )}

        {activeTab === 'table' && (
          <ItemsTable
            items={items}
            onOpenClaimModal={(item) => setClaimItem(item)}
            onOpenEditModal={(item) => {
              setEditItem(item);
              setIsNewItemModal(false);
            }}
            onOpenReceiptModal={(item) => setReceiptItem(item)}
            onDeleteItem={handleDeleteItem}
            onAddNewItem={() => {
              setEditItem(null);
              setIsNewItemModal(true);
            }}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onBulkDelete={handleBulkDelete}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            落とし物AIチェッカー — 学校向け落とし物一括管理システム
          </p>
          <p className="text-slate-400">
            大分類・名前・発見場所・ステータス・拾得日（1か月保管管理）
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ClaimModal
        item={claimItem}
        isOpen={!!claimItem}
        onClose={() => setClaimItem(null)}
        onConfirmClaim={handleConfirmClaim}
      />

      <PrintReceiptModal
        item={receiptItem}
        isOpen={!!receiptItem}
        onClose={() => setReceiptItem(null)}
      />

      <ItemDetailEditModal
        item={editItem}
        isOpen={!!editItem || isNewItemModal}
        isNew={isNewItemModal}
        onClose={() => {
          setEditItem(null);
          setIsNewItemModal(false);
        }}
        onSave={handleSaveItem}
      />
    </div>
  );
}

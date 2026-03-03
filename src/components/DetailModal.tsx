import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckSquare, Square } from 'lucide-react';
import { OrderGroup } from '../types';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: OrderGroup | null;
  isAdmin: boolean;
  onApprove: (idOrder: string, selectedIds: string[]) => void;
  onReject: (idOrder: string) => void;
  loading: boolean;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  group,
  isAdmin,
  onApprove,
  onReject,
  loading,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (group) {
      setSelectedItems(new Set(group.items.map(item => item.iddetil)));
    }
  }, [group]);

  if (!group) return null;

  const toggleItem = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const toggleAll = () => {
    if (selectedItems.size === group.items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(group.items.map(item => item.iddetil)));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <div className="flex items-center justify-between mb-1 gap-4">
                  <p className="text-[11px] font-black text-blue-600 uppercase italic">{group.unit}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{group.tanggal}</p>
                </div>
                <h3 className="text-xl font-black text-slate-800">{group.id}</h3>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
              <table className="w-full text-left">
                <thead className="border-b text-[8px] font-black text-slate-400 uppercase">
                  <tr>
                    {isAdmin && group.status.toLowerCase() === 'pending' && (
                      <th className="pb-3 w-10">
                        <button onClick={toggleAll} className="p-1 hover:bg-slate-100 rounded">
                          {selectedItems.size === group.items.length ? (
                            <CheckSquare size={16} className="text-blue-600" />
                          ) : (
                            <Square size={16} className="text-slate-300" />
                          )}
                        </button>
                      </th>
                    )}
                    <th className="pb-3">Barang</th>
                    <th className="pb-3 text-center">Qty</th>
                    <th className="pb-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {group.items.map((item, idx) => {
                    const isSelected = selectedItems.has(item.iddetil);
                    return (
                      <tr key={item.iddetil || idx} className={isSelected ? '' : 'opacity-50'}>
                        {isAdmin && group.status.toLowerCase() === 'pending' && (
                          <td className="py-3">
                            <button onClick={() => toggleItem(item.iddetil)} className="p-1 hover:bg-slate-100 rounded">
                              {isSelected ? (
                                <CheckSquare size={16} className="text-blue-600" />
                              ) : (
                                <Square size={16} className="text-slate-300" />
                              )}
                            </button>
                          </td>
                        )}
                        <td className="py-3 text-[10px] font-black text-slate-800 uppercase italic">
                          {item.NamaBarang}
                        </td>
                        <td className="py-3 text-center text-[10px] font-bold">{item.Qty}</td>
                        <td className="py-3 text-right text-[10px] font-black text-blue-600">
                          Rp {Number(item.Subtotal).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t bg-slate-50 italic">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Pesanan</span>
                <span className="text-xl font-black text-slate-900">Rp {group.total.toLocaleString('id-ID')}</span>
              </div>
              {isAdmin && group.status.toLowerCase() === 'pending' ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onApprove(group.id, Array.from(selectedItems))}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl text-[9px] tracking-widest uppercase flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="animate-spin" size={12} />}
                    APPROVE {selectedItems.size > 0 && `(${selectedItems.size})`}
                  </button>
                  <button
                    onClick={() => onReject(group.id)}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl text-[9px] tracking-widest uppercase flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="animate-spin" size={12} />}
                    REJECT ALL
                  </button>
                </div>
              ) : (
                <div className="text-center font-black text-[9px] text-slate-400 uppercase tracking-widest">
                  {group.status}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

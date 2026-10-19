'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AccountantShell from '@/components/accountant-shell';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Search,
  Filter,
  X,
  Save,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import {
  FeeStructure,
  FeeItem,
  getAllFeeStructures,
  saveFeeStructures,
  createOrUpdateFeeStructure,
} from '@/lib/accountant-data';
import { PRIMARY_CLASSES_LIST } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

export default function FeeStructuresPage() {
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('Standard 4 (Grade 4)');
  const [selectedTerm, setSelectedTerm] = useState<string>('Term I');

  // Modal State for new/edit Fee Structure
  const [showModal, setShowModal] = useState(false);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);

  // Form State
  const [formYear, setFormYear] = useState('2026');
  const [formTerm, setFormTerm] = useState<'Term I' | 'Term II' | 'All Terms'>('Term I');
  const [formStandard, setFormStandard] = useState(PRIMARY_CLASSES_LIST[3]);
  const [formItems, setFormItems] = useState<FeeItem[]>([
    { id: 'item-1', name: 'Ada ya Mafunzo (Tuition Fee)', category: 'Tuition', amount: 800000, isMandatory: true, description: 'Ada kuu ya masomo' },
    { id: 'item-2', name: 'Ada ya Mitihani (Examinations)', category: 'Examination', amount: 50000, isMandatory: true, description: 'Mitihani ya muhula' },
  ]);

  // New item row inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<FeeItem['category']>('Tuition');
  const [newItemAmount, setNewItemAmount] = useState<number>(50000);
  const [newItemMandatory, setNewItemMandatory] = useState(true);

  useEffect(() => {
    setStructures(getAllFeeStructures());
  }, []);

  const activeStructure = useMemo(() => {
    return (
      structures.find((s) => s.standard === selectedClass && s.term === selectedTerm) ||
      structures.find((s) => s.standard === selectedClass) ||
      structures[0]
    );
  }, [structures, selectedClass, selectedTerm]);

  const handleOpenNewModal = () => {
    setEditingStructure(null);
    setFormYear('2026');
    setFormTerm('Term I');
    setFormStandard(selectedClass);
    setFormItems([
      { id: `item-${Date.now()}-1`, name: 'Ada ya Mafunzo (Tuition Fee)', category: 'Tuition', amount: 800000, isMandatory: true, description: 'Ada kuu ya muhula' },
      { id: `item-${Date.now()}-2`, name: 'Chakula cha Mchana (Meals)', category: 'Meals', amount: 120000, isMandatory: false, description: 'Chakula cha mchana shuleni' },
    ]);
    setShowModal(true);
  };

  const handleOpenEditModal = (struct: FeeStructure) => {
    setEditingStructure(struct);
    setFormYear(struct.academicYear);
    setFormTerm(struct.term);
    setFormStandard(struct.standard);
    setFormItems([...struct.items]);
    setShowModal(true);
  };

  const handleAddItemToForm = () => {
    if (!newItemName.trim() || newItemAmount <= 0) {
      notifyUser('error', 'Kosa', 'Tafadhali ingiza jina la ada na kiasi sahihi.');
      return;
    }

    const newItem: FeeItem = {
      id: `fitem-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      amount: Number(newItemAmount),
      isMandatory: newItemMandatory,
      description: `${newItemCategory} charge`,
    };

    setFormItems([...formItems, newItem]);
    setNewItemName('');
    setNewItemAmount(50000);
  };

  const handleRemoveItemFromForm = (itemId: string) => {
    if (formItems.length <= 1) {
      notifyUser('warning', 'Kizuizi', 'Muundo wa ada lazima uwe na angalau kipengele kimoja.');
      return;
    }
    setFormItems(formItems.filter((i) => i.id !== itemId));
  };

  const handleSaveFeeStructure = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = formItems.reduce((sum, item) => sum + item.amount, 0);

    const struct: FeeStructure = {
      id: editingStructure ? editingStructure.id : `fee-${Date.now()}`,
      academicYear: formYear,
      term: formTerm,
      standard: formStandard,
      items: formItems,
      totalAmount,
      isActive: true,
      institutionId: 'inst-001',
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    createOrUpdateFeeStructure(struct);
    setStructures(getAllFeeStructures());
    setShowModal(false);
    notifyUser('success', 'Muundo Umehifadhiwa', `Muundo wa ada ya ${formStandard} (${formTerm} ${formYear}) umehifadhiwa.`);
  };

  return (
    <AccountantShell
      pageTitle="Miundo ya Ada ya Shule (Fee Structures)"
      pageDescription="Mpangilio rasmi wa ada kwa madarasa yote kuanzia Chekechea/Awali hadi Darasa la Saba kulingana na mihula"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                Ada Zilizoidhinishwa &bull; 2026
              </span>
              <span className="text-xs text-slate-500 font-medium">Madarasa 8 (Awali - La 7)</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              Miundo ya Ada ya Madarasa (Class Fee Structures)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ada zote za mafunzo, mitihani, vitabu, chakula, na basi la shule zinasanidiwa hapa.
            </p>
          </div>

          <button
            onClick={handleOpenNewModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-200" />
            <span>+ Sanidi Muundo Mpya wa Ada</span>
          </button>
        </div>

        {/* Class Selection Tabs */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Chagua Darasa la Kutazama Muundo:</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium">Muhula:</span>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-xl border border-slate-300 font-bold bg-white text-slate-700"
              >
                <option value="Term I">Muhula wa I (Term I)</option>
                <option value="Term II">Muhula wa II (Term II)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {PRIMARY_CLASSES_LIST.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedClass === cls
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cls.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Active Structure Preview Card */}
        {activeStructure ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                  Mwaka wa Masomo: {activeStructure.academicYear} &bull; {activeStructure.term}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{activeStructure.standard}</h3>
                <span className="text-xs text-slate-500 font-medium">
                  Imesasishwa tarehe: {activeStructure.updatedAt}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Jumla ya Ada Kamili</span>
                  <div className="text-xl font-black text-emerald-800">
                    TZS {activeStructure.totalAmount.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEditModal(activeStructure)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                  title="Hariri Muundo Huu wa Ada"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fee Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Kipengele cha Ada (Fee Item)</th>
                    <th className="py-3 px-4">Kategoria</th>
                    <th className="py-3 px-4">Umuhimu (Status)</th>
                    <th className="py-3 px-4 text-right">Kiasi (TZS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {activeStructure.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div>{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{item.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.isMandatory ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Ya Lazima (Mandatory)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            Ya Hiari (Optional)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/80 font-black text-slate-900">
                    <td colSpan={4} className="py-3 px-4 text-right uppercase tracking-wider text-[11px]">
                      Jumla Kuu ya Ada (Total Fee Amount):
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-sm text-emerald-900">
                      TZS {activeStructure.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-300">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">Hakuna muundo wa ada uliowekwa kwa darasa hili</h4>
            <p className="text-xs text-slate-500 mt-1">Bonyeza kitufe cha hapo juu kuanzisha muundo mpya.</p>
          </div>
        )}

        {/* Modal: New / Edit Fee Structure */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingStructure ? 'Hariri Muundo wa Ada' : 'Sanidi Muundo Mpya wa Ada'}
                  </h3>
                  <p className="text-xs text-slate-500">Weka vipengele na viwango vya ada kwa darasa teule</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveFeeStructure} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Darasa *</label>
                    <select
                      value={formStandard}
                      onChange={(e) => setFormStandard(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-800 font-medium"
                    >
                      {PRIMARY_CLASSES_LIST.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Muhula *</label>
                    <select
                      value={formTerm}
                      onChange={(e) => setFormTerm(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-800 font-medium"
                    >
                      <option value="Term I">Muhula wa I (Term I)</option>
                      <option value="Term II">Muhula wa II (Term II)</option>
                      <option value="All Terms">Mwaka Mzima (All Terms)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mwaka wa Masomo *</label>
                    <input
                      type="text"
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-800 font-medium"
                    />
                  </div>
                </div>

                {/* Current Items List */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-700 block">Vipengele vya Ada Vilivyopo:</span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {formItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <div>
                          <strong className="text-slate-900 block">{item.name}</strong>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {item.category} &bull; {item.isMandatory ? 'Ya Lazima' : 'Hiari'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-emerald-800">
                            TZS {item.amount.toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItemFromForm(item.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Item Row */}
                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                  <span className="font-bold text-emerald-950 text-[11px] block">+ Ongeza Kipengele Kipya cha Ada</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Jina la ada (mf. Sare ya Shule)"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <select
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value as any)}
                        className="w-full px-2 py-1.5 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="Tuition">Tuition</option>
                        <option value="Registration">Registration</option>
                        <option value="Examination">Examination</option>
                        <option value="Books">Books</option>
                        <option value="Learning Materials">Materials</option>
                        <option value="Meals">Meals</option>
                        <option value="Transport">Transport</option>
                        <option value="Uniform">Uniform</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Kiasi (TZS)"
                        value={newItemAmount}
                        onChange={(e) => setNewItemAmount(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-xl border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={newItemMandatory}
                        onChange={(e) => setNewItemMandatory(e.target.checked)}
                        className="rounded text-emerald-800"
                      />
                      <span>Kipengele cha lazima (Mandatory)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddItemToForm}
                      className="px-3 py-1 rounded-xl bg-emerald-800 text-white font-bold text-xs"
                    >
                      Ongeza Kwenye Orodha
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-950/20"
                  >
                    Hifadhi Muundo wa Ada
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AccountantShell>
  );
}

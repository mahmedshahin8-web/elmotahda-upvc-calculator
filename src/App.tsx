/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Calculator, 
  Send, 
  Copy, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2,
  RefreshCw,
  Ruler,
  Maximize2,
  DollarSign,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Color Palette Constants
const COLORS = {
  primary: '#1F8BB6',
  accent: '#F4C400',
  background: '#0F1115',
  card: '#1A1D22',
  input: '#0F1115',
  text: '#FFFFFF',
  textMuted: '#B0B3B8',
};

export default function App() {
  const [length, setLength] = useState<string>(localStorage.getItem('last_length') || '');
  const [width, setWidth] = useState<string>(localStorage.getItem('last_width') || '');
  const [price, setPrice] = useState<string>(localStorage.getItem('last_price') || '');
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const lengthRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (lengthRef.current) {
      lengthRef.current.focus();
    }
  }, []);

  // Scroll to result when it appears
  useEffect(() => {
    if (showResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showResult]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('last_length', length);
    localStorage.setItem('last_width', width);
    localStorage.setItem('last_price', price);
  }, [length, width, price]);

  const calculation = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const p = parseFloat(price);

    if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) {
      return null;
    }

    // Logic: panels = width ÷ 1.15, round up, add 5–10% waste
    const panelWidth = 1.15;
    const rawPanels = w / panelWidth;
    const roundedPanels = Math.ceil(rawPanels);
    // Adding 10% safety margin
    const finalPanels = Math.ceil(roundedPanels * 1.1);
    
    const totalPrice = !isNaN(p) ? finalPanels * p : null;

    return {
      length: l,
      width: w,
      panels: finalPanels,
      totalPrice: totalPrice,
    };
  }, [length, width, price]);

  const handleCalculate = () => {
    if (calculation) {
      setShowResult(true);
    }
  };

  const handleWhatsApp = () => {
    if (!calculation) return;
    const priceText = calculation.totalPrice 
      ? `\n✔ التكلفة التقريبية: ${calculation.totalPrice} جنيه` 
      : '';

    const message = encodeURIComponent(
`أهلاً بحضرتك  👋  

بخصوص استفسار حضرتك عن تغطية مساحة (${calculation.length} × ${calculation.width} متر):

✔ الكمية المناسبة حوالي: ${calculation.panels} لوح  
✔ الحساب شامل نسبة أمان لتجنب أي نقص  ${priceText}

ممكن أعرف حضرتك محتاج الكمية دي إمتى؟  
وهنأكد لحضرتك السعر والتوفر فورًا 👍`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleCopy = () => {
    if (!calculation) return;
    const priceText = calculation.totalPrice 
      ? `\n💰 السعر التقريبي: ${calculation.totalPrice} جنيه` 
      : '';

    const text = 
`📏 الطول: ${calculation.length} متر
📐 العرض: ${calculation.width} متر
📦 عدد الألواح: ${calculation.panels} لوح${priceText}

✔ الكمية تشمل نسبة أمان لتجنب أي نقص`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickReply = () => {
    const text = "أهلاً بحضرتك 👋\nممكن تبعتلي الطول والعرض بالمتر علشان أديك حساب دقيق فورًا 👍";
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const isValid = length && width && parseFloat(length) > 0 && parseFloat(width) > 0;

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: COLORS.background, direction: 'rtl', fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <div className="w-full max-w-[420px] flex flex-col gap-6">
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-[#1F8BB6] rounded-[24px] flex items-center justify-center shadow-2xl shadow-[#1F8BB6]/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">حاسبة بديل الصاج – الشركة المتحدة</h1>
            <p className="text-[#B0B3B8] text-sm font-medium opacity-80 uppercase tracking-widest">Internal Sales Tool</p>
          </div>
        </header>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1D22] rounded-[24px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col gap-6"
        >
          {/* Inputs */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#B0B3B8] pr-1">الطول بالمتر</label>
              <div className="relative">
                <Ruler className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B0B3B8]" />
                <input
                  ref={lengthRef}
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={length}
                  onChange={(e) => { setLength(e.target.value); setShowResult(false); }}
                  className="w-full bg-[#0F1115] text-white text-lg font-bold rounded-2xl py-4 pr-12 pl-4 border border-transparent focus:border-[#1F8BB6] focus:ring-4 focus:ring-[#1F8BB6]/10 outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#B0B3B8] pr-1">العرض بالمتر</label>
              <div className="relative">
                <Maximize2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B0B3B8]" />
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={width}
                  onChange={(e) => { setWidth(e.target.value); setShowResult(false); }}
                  className="w-full bg-[#0F1115] text-white text-lg font-bold rounded-2xl py-4 pr-12 pl-4 border border-transparent focus:border-[#1F8BB6] focus:ring-4 focus:ring-[#1F8BB6]/10 outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#B0B3B8] pr-1">سعر اللوح (اختياري)</label>
              <div className="relative">
                <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B0B3B8]" />
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => { setPrice(e.target.value); setShowResult(false); }}
                  className="w-full bg-[#0F1115] text-white text-lg font-bold rounded-2xl py-4 pr-12 pl-4 border border-transparent focus:border-[#1F8BB6] focus:ring-4 focus:ring-[#1F8BB6]/10 outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>
          </div>

          {/* Primary Action */}
          <button
            onClick={handleCalculate}
            disabled={!isValid}
            className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
              isValid 
                ? 'bg-[#1F8BB6] text-white shadow-xl shadow-[#1F8BB6]/20 hover:bg-[#1F8BB6]/90 hover:shadow-[#1F8BB6]/30' 
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            <Calculator className="w-7 h-7" />
            احسب
          </button>

          {/* Result Section */}
          <AnimatePresence>
            {showResult && calculation && (
              <motion.div
                ref={resultRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#242930] rounded-2xl p-6 border border-[#1F8BB6]/30 flex flex-col items-center text-center gap-3">
                  <div className="flex items-center gap-2 text-[#1F8BB6] mb-1">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">النتيجة النهائية</span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-[#B0B3B8]">عدد الألواح المطلوبة</p>
                    <h2 className="text-5xl font-black text-white">
                      {calculation.panels} <span className="text-xl font-bold text-[#1F8BB6]">لوح</span>
                    </h2>
                  </div>

                  {calculation.totalPrice && (
                    <div className="mt-2 pt-4 border-t border-white/5 w-full">
                      <p className="text-sm text-[#B0B3B8] mb-1">التكلفة التقريبية</p>
                      <p className="text-2xl font-bold text-[#F4C400]">{calculation.totalPrice.toLocaleString()} جنيه</p>
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-2 text-xs font-medium text-emerald-500/80 bg-emerald-500/5 px-4 py-2 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    ✔ الكمية تشمل نسبة أمان
                  </div>
                </div>

                {/* Secondary Actions */}
                <div className="grid grid-cols-1 gap-3 mt-6">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-[#25D366]/10 transition-all active:scale-95"
                  >
                    <Send className="w-6 h-6" />
                    إرسال على واتساب
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleCopy}
                      className="bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/5"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                      {copied ? 'تم النسخ' : 'نسخ الرد'}
                    </button>
                    <button
                      onClick={handleQuickReply}
                      className="bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/5"
                    >
                      <MessageSquare className="w-5 h-5" />
                      رد سريع
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reset Action */}
          {!showResult && (
            <button
              onClick={() => { setLength(''); setWidth(''); setPrice(''); lengthRef.current?.focus(); }}
              className="text-[#B0B3B8] hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors opacity-50 hover:opacity-100 py-2"
            >
              <RefreshCw className="w-3 h-3" />
              تفريغ كافة الحقول
            </button>
          )}
        </motion.div>

        {/* Footer */}
        <footer className="text-center opacity-30">
          <p className="text-[10px] text-white uppercase tracking-[0.2em] font-bold">
            United Co. • Internal Sales System
          </p>
        </footer>
      </div>
    </div>
  );
}

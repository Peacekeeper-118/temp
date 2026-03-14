
import React, { useState, useRef } from 'react';
import { X, ArrowRight, AlertTriangle, Loader2, ChevronLeft, Sparkles, Check, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../services/firebase';
import { sanitizeContent } from '../services/moderationService';
import { NeoCamera, NeoSparkles, NeoFire, NeoTag } from './NeoIcons';
import { ImageMetadata } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (data: any) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onPost }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null]);
  const [imageMeta, setImageMeta] = useState<(ImageMetadata | null)[]>([null, null, null]); 
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [itemType, setItemType] = useState('');
  const [brand, setBrand] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [conditionRating, setConditionRating] = useState(2);
  
  const [size, setSize] = useState('');
  const [measurements, setMeasurements] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  
  const [warning, setWarning] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleImageSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...imagePreviews];
        newPreviews[index] = reader.result as string;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);

      const newFiles = [...imageFiles];
      newFiles[index] = file;
      setImageFiles(newFiles);
      
      const newMeta = [...imageMeta];
      newMeta[index] = null;
      setImageMeta(newMeta);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of imageFiles) {
      if (file) {
        try {
          const storageRef = ref(storage, `posts/${auth.currentUser?.uid || 'anonymous'}/${Date.now()}-${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          urls.push(downloadURL);
        } catch (error) {
          console.error("Error uploading image:", error);
          throw error;
        }
      }
    }
    return urls;
  };

  const handlePublish = async () => {
    const { hasViolation, warning: modWarning } = sanitizeContent(description);
    
    if (hasViolation) {
        setWarning(modWarning || "Content blocked by safety filter.");
        return;
    }

    setIsUploading(true);

    try {
        const imageUrls = await uploadImages();
        
        onPost({
            images: imageUrls,
            imageMeta: imageMeta.filter(m => m !== null),
            caption: description,
            price: Number(price),
            itemType,
            size,
            brand,
            material,
            color,
            measurements,
            condition: ['Worn', 'Gently Used', 'Like New', 'New with Tags'][conditionRating],
            location
        });
        
        setStep(1);
        setImageFiles([null, null, null]);
        setImagePreviews([null, null, null]);
        setImageMeta([null, null, null]);
        setDescription('');
        setBrand('');
        setSize('');
        setPrice('');
        setMaterial('');
        setColor('');
        setMeasurements('');
        setItemType('');
        setWarning(null);
        onClose();
    } catch (error) {
        console.error("Upload failed", error);
        setWarning("Failed to upload images. Please try again.");
    } finally {
        setIsUploading(false);
    }
  };

  const conditions = [
      { label: 'Worn', color: 'bg-pop-orange' },
      { label: 'Good', color: 'bg-pop-yellow' },
      { label: 'Great', color: 'bg-brand-500' },
      { label: 'New', color: 'bg-pop-lime' },
  ];

  const itemTypes = ['Top', 'Bottom', 'Outerwear', 'Shoes', 'Dress', 'Accessory'];

  const MagicEditor = ({ index, imageUrl, onClose }: { index: number, imageUrl: string, onClose: () => void }) => {
      const [isProcessing, setIsProcessing] = useState(false);
      const [isCleaned, setIsCleaned] = useState(imageMeta[index]?.isCleaned || false);
      const [background, setBackground] = useState(imageMeta[index]?.backgroundColor || 'transparent');
      const [viewMode, setViewMode] = useState<'original' | 'clean'>(imageMeta[index]?.isCleaned ? 'clean' : 'original');
      
      const [position, setPosition] = useState({ x: 0, y: 0 });
      const dragRef = useRef<{ startX: number, startY: number } | null>(null);

      const runAiProcessing = async () => {
          // AI Processing disabled
          console.log('AI image processing feature has been disabled');
      };

      const handleSave = () => {
          const newMeta = [...imageMeta];
          newMeta[index] = {
              method: 'server',
              durationMs: 1200,
              isCleaned: isCleaned,
              backgroundColor: background,
              qualityScore: 0.99
          };
          setImageMeta(newMeta);
          onClose();
      };

      const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
          const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
          const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
          dragRef.current = { startX: clientX - position.x, startY: clientY - position.y };
      };

      const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
          if (!dragRef.current) return;
          const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
          const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
          setPosition({
              x: clientX - dragRef.current.startX,
              y: clientY - dragRef.current.startY
          });
      };

      const handleTouchEnd = () => {
          dragRef.current = null;
      };

      const bgOptions = [
          { id: 'transparent', color: 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] bg-gray-200' },
          { id: 'white', color: 'bg-white' },
          { id: 'pastel-yellow', color: 'bg-pop-yellow/30' },
          { id: 'pastel-pink', color: 'bg-pop-pink/20' },
          { id: 'pastel-cyan', color: 'bg-pop-cyan/20' }
      ];

      return (
          <div className="absolute inset-0 z-50 bg-white flex flex-col animate-fade-in-up">
              <div className="p-4 border-b border-earth-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-pop-purple text-white rounded-lg flex items-center justify-center">
                          <NeoSparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-lg text-earth-900 leading-none">Magic Studio</h3>
                        <p className="text-[10px] font-bold text-earth-400 uppercase tracking-wide">AI Refresh Powered by Gemini</p>
                      </div>
                  </div>
                  <button onClick={onClose} className="p-2 bg-earth-50 rounded-full hover:bg-earth-100"><X className="w-5 h-5 text-earth-500"/></button>
              </div>

              <div className="flex-1 bg-earth-50 relative overflow-hidden flex items-center justify-center">
                  {isProcessing && (
                      <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                          <div className="relative">
                              <Loader2 className="w-12 h-12 text-pop-purple animate-spin" />
                              <div className="absolute inset-0 animate-ping opacity-20 bg-pop-purple rounded-full"></div>
                          </div>
                          <p className="mt-4 font-bold text-earth-900 animate-pulse">Running Gemini Flash...</p>
                          <p className="text-xs text-earth-500 font-medium text-center px-8">Polishing your listing visuals with AI.</p>
                      </div>
                  )}

                  <div 
                    className={`relative w-full h-full transition-all duration-300 ${viewMode === 'clean' ? bgOptions.find(b => b.id === background)?.color : 'bg-black'}`}
                    onMouseDown={handleTouchStart}
                    onMouseMove={handleTouchMove}
                    onMouseUp={handleTouchEnd}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                        <img 
                            src={imageUrl} 
                            className={`max-w-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 select-none cursor-move ${
                                viewMode === 'clean' 
                                ? 'drop-shadow-2xl' 
                                : '' 
                            }`}
                            style={{
                                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${viewMode === 'clean' ? 0.9 : 1})`,
                            }}
                            draggable={false}
                        />
                        
                        {!isProcessing && isCleaned && viewMode === 'clean' && (
                             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg border border-earth-100 flex gap-4 pointer-events-auto z-10">
                                 <button onClick={() => setViewMode('original')} className="text-xs font-bold text-earth-400 hover:text-earth-900 transition-colors">Original</button>
                                 <div className="w-[1px] h-3 bg-earth-300 self-center"></div>
                                 <button onClick={() => setViewMode('clean')} className="text-xs font-black text-pop-purple flex items-center gap-1"><NeoSparkles className="w-3 h-3"/> Clean</button>
                             </div>
                        )}
                  </div>
              </div>

              <div className="p-6 bg-white border-t border-earth-100">
                  {!isCleaned ? (
                       <div className="text-center">
                           <p className="text-sm text-earth-500 mb-6 font-medium px-4">
                               Make your listing pop! Our Gemini AI will remove the background and center your item automatically.
                           </p>
                           <Button onClick={runAiProcessing} className="w-full py-3 text-base bg-earth-900 text-white shadow-lg">
                               Auto Clean & Crop <Sparkles className="w-5 h-5 ml-2 text-pop-yellow animate-pulse" />
                           </Button>
                       </div>
                  ) : (
                      <div className="space-y-6">
                           <div>
                               <label className="block text-xs font-bold text-earth-400 uppercase tracking-wide mb-3 text-center">Select Background</label>
                               <div className="flex justify-center gap-3">
                                   {bgOptions.map(opt => (
                                       <button 
                                        key={opt.id}
                                        onClick={() => setBackground(opt.id)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${background === opt.id ? 'border-earth-900 scale-110 shadow-md' : 'border-earth-200 hover:scale-105'} ${opt.color} relative`}
                                       >
                                           {background === opt.id && <div className="absolute inset-0 flex items-center justify-center"><Check className="w-4 h-4 text-earth-900"/></div>}
                                       </button>
                                   ))}
                               </div>
                           </div>

                           <div className="flex gap-3">
                               <Button variant="ghost" onClick={() => { setIsCleaned(false); setViewMode('original'); }} className="flex-1">
                                   <RotateCcw className="w-4 h-4 mr-2" /> Undo
                               </Button>
                               <Button onClick={handleSave} className="flex-[2] bg-earth-900 text-white py-3 text-base">
                                   Apply Changes <Check className="w-4 h-4 ml-2" />
                               </Button>
                           </div>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-earth-900/60 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col">
        
        {editingIndex !== null && imagePreviews[editingIndex] && (
            <MagicEditor 
                index={editingIndex} 
                imageUrl={imagePreviews[editingIndex]!} 
                onClose={() => setEditingIndex(null)} 
            />
        )}

        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-earth-50 rounded-full hover:bg-earth-100 transition-colors z-20">
            <X className="w-5 h-5 text-earth-500" />
        </button>

        {step > 1 && (
             <button onClick={() => setStep(prev => Math.max(1, prev - 1) as 1 | 2 | 3)} className="absolute top-6 left-6 p-2 bg-earth-50 rounded-full hover:bg-earth-100 transition-colors z-20">
                <ChevronLeft className="w-5 h-5 text-earth-500" />
             </button>
        )}

        <div className="p-8 pt-20 pb-12 overflow-y-auto no-scrollbar flex-1">
            <div className="flex items-center gap-2 mb-2">
                <h2 className="font-display font-black text-3xl text-earth-900">
                    {step === 1 ? 'Snap It' : step === 2 ? 'The Basics' : 'Fit & Price'}
                </h2>
                {step === 1 ? <NeoCamera className="w-8 h-8"/> : step === 2 ? <NeoTag className="w-8 h-8"/> : <NeoSparkles className="w-8 h-8" />}
            </div>
            
            <div className="flex gap-2 mb-8">
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-earth-900' : 'bg-earth-100'}`}></div>
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-earth-900' : 'bg-earth-100'}`}></div>
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-earth-900' : 'bg-earth-100'}`}></div>
            </div>

            {step === 1 && (
                <div className="space-y-6 animate-slide-up">
                    <p className="text-earth-500 text-sm font-medium">Show off the fit. 3 angles works best.</p>
                    <div className="grid grid-cols-2 gap-3">
                        {imagePreviews.map((img, i) => (
                            <div key={i} className={`relative aspect-[3/4] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all active:scale-95 overflow-hidden group ${img ? 'border-brand-500 bg-earth-50' : 'border-earth-200 hover:bg-earth-50'}`}>
                                {img ? (
                                    <>
                                        <img src={img} className="w-full h-full object-cover" alt="upload" />
                                        
                                        <button 
                                            onClick={() => setEditingIndex(i)}
                                            className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/50 hover:scale-110 transition-transform z-10"
                                        >
                                            <Sparkles className={`w-4 h-4 ${imageMeta[i]?.isCleaned ? 'text-pop-purple fill-pop-purple' : 'text-earth-900'}`} />
                                        </button>
                                        
                                        {imageMeta[i]?.isCleaned && (
                                            <div className="absolute top-2 left-2 bg-pop-purple text-white text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded shadow-md flex items-center gap-1">
                                                <NeoSparkles className="w-3 h-3"/> AI Clean
                                            </div>
                                        )}

                                        <label className="absolute inset-0 cursor-pointer">
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageSelect(i, e)} />
                                        </label>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                        <div className="w-10 h-10 bg-earth-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-earth-200 transition-colors">
                                            <NeoCamera className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-bold text-earth-400 uppercase tracking-wide">
                                            {i === 0 ? 'Front' : i === 1 ? 'Back' : 'Label'}
                                        </span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageSelect(i, e)} />
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex gap-2 items-start bg-blue-50 p-3 rounded-xl">
                        <AlertTriangle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-brand-800 leading-tight">
                            <strong>New:</strong> Use the Magic Wand <Sparkles className="w-3 h-3 inline"/> to auto-remove backgrounds using Gemini AI.
                        </p>
                    </div>

                    <Button onClick={() => setStep(2)} className="w-full py-3 text-base shadow-lg" disabled={!imagePreviews[0]}>
                        Next: Details <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-5 animate-slide-up">
                    <p className="text-earth-500 text-sm font-medium">What are we selling today?</p>
                    
                    <div className="flex flex-wrap gap-2">
                        {itemTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setItemType(type)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${itemType === type ? 'bg-earth-900 text-white border-earth-900' : 'bg-transparent text-earth-500 border-earth-100 hover:border-earth-300'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <input 
                        className="w-full p-4 bg-earth-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand-500" 
                        placeholder="Brand (e.g. Zara, Nike)" 
                        value={brand} 
                        onChange={e => setBrand(e.target.value)} 
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            className="w-full p-4 bg-earth-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand-500" 
                            placeholder="Material (e.g. Cotton)" 
                            value={material} 
                            onChange={e => setMaterial(e.target.value)} 
                        />
                        <input 
                            className="w-full p-4 bg-earth-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand-500" 
                            placeholder="Color (e.g. Black)" 
                            value={color} 
                            onChange={e => setColor(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-earth-400 uppercase mb-2 ml-1">Condition</label>
                        <div className="bg-earth-50 p-1 rounded-2xl flex">
                            {conditions.map((c, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setConditionRating(idx)}
                                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${idx === conditionRating ? 'bg-white shadow-md text-earth-900 scale-105' : 'text-earth-400'}`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button onClick={() => setStep(3)} className="w-full py-3 text-base shadow-lg" disabled={!itemType || !brand}>
                        Next: Fit & Price <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-5 animate-slide-up">
                    <p className="text-earth-500 text-sm font-medium">Help them check the fit.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            className="w-full p-4 bg-earth-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand-500" 
                            placeholder="Size Label (e.g. M)" 
                            value={size} 
                            onChange={e => setSize(e.target.value)} 
                        />
                        <div className="relative">
                            <span className="absolute left-4 top-4 text-earth-400 font-bold">₹</span>
                            <input 
                                type="number" 
                                className="w-full p-4 pl-8 bg-earth-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand-500" 
                                placeholder="Price" 
                                value={price} 
                                onChange={e => setPrice(e.target.value)} 
                            />
                        </div>
                    </div>

                    <input 
                        className="w-full p-4 bg-earth-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand-500" 
                        placeholder="Measurements (Optional, e.g. Pit to pit 20in)" 
                        value={measurements} 
                        onChange={e => setMeasurements(e.target.value)} 
                    />

                    <div>
                         <label className="block text-xs font-bold text-earth-400 uppercase mb-2 ml-1">Description</label>
                         <textarea 
                            className="w-full p-4 bg-earth-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand-500 h-28 resize-none" 
                            placeholder="Tell the story of this item... #Vintage #Streetwear" 
                            value={description} 
                            onChange={e => {
                                setDescription(e.target.value);
                                setWarning(null);
                            }} 
                        />
                        <div className="flex justify-between mt-2">
                             <Button size="sm" variant="ghost" disabled={true}>
                                 ✨ AI Generate Caption
                             </Button>
                        </div>
                    </div>

                    <input 
                        className="w-full p-4 bg-earth-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand-500" 
                        placeholder="Location (e.g. Mumbai)" 
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                    />

                    {warning && (
                        <div className="bg-pop-rose/10 border border-pop-rose/20 p-3 rounded-2xl flex gap-3 items-start animate-bounce-in">
                            <AlertTriangle className="w-5 h-5 text-pop-rose shrink-0" />
                            <p className="text-xs font-bold text-pop-rose">{warning}</p>
                        </div>
                    )}

                    <Button onClick={handlePublish} className="w-full py-3 text-base bg-earth-900 text-white shadow-lg" disabled={!price || !size || isUploading}>
                        {isUploading ? (
                            <span className="flex items-center gap-2">Publishing <Loader2 className="w-5 h-5 animate-spin"/></span>
                        ) : (
                            <span className="flex items-center gap-2">Post Listing <Check className="w-5 h-5"/></span>
                        )}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

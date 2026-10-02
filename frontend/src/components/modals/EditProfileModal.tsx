import React, { useState } from 'react';
import { X, User, Camera, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EditProfileModal: React.FC = () => {
  const { user, updateUser, updateTryOnPhoto, closeModal, logout, theme } = useApp();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOnUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateTryOnPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      username,
      bio,
      location,
      avatar,
    });
    closeModal();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-xl animate-in fade-in duration-200 ${
      theme === 'dark' ? 'bg-slate-950/85' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden max-h-[92vh] flex flex-col transition-colors ${
        theme === 'dark' 
          ? 'bg-[#0c101d] border-slate-700/80 text-slate-100 ring-1 ring-white/10' 
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50 ring-1 ring-slate-900/5'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b backdrop-blur-md flex items-center justify-between transition-colors ${
          theme === 'dark' ? 'border-slate-800 bg-[#121626]/80' : 'border-slate-200 bg-slate-50/90'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              theme === 'dark' 
                ? 'bg-indigo-600/30 text-indigo-400 border-indigo-500/40' 
                : 'bg-indigo-50 text-indigo-600 border-indigo-200'
            }`}>
              <User className="w-4 h-4" />
            </div>
            <h2 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Edit Profile & Try-On Body Photo
            </h2>
          </div>
          <button
            onClick={closeModal}
            className={`p-1.5 rounded-xl transition ${
              theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Avatar Upload */}
          <div className={`flex items-center gap-4 p-3 rounded-2xl border transition-colors ${
            theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-md flex-shrink-0">
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div>
              <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Profile Avatar</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Click camera to upload custom photo</p>
            </div>
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className={`w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl outline-none border transition ${
                theme === 'dark' 
                  ? 'bg-[#141826] border-slate-800 focus:border-indigo-500 text-white' 
                  : 'bg-white border-slate-300 focus:border-indigo-600 text-slate-900 shadow-sm'
              }`}
            />
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">@</span>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className={`w-full pl-8 pr-3.5 py-2.5 text-base sm:text-xs rounded-xl outline-none font-mono border transition ${
                  theme === 'dark' 
                    ? 'bg-[#141826] border-slate-800 focus:border-indigo-500 text-white' 
                    : 'bg-white border-slate-300 focus:border-indigo-600 text-slate-900 shadow-sm'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Bio</label>
            <textarea 
              rows={2}
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              className={`w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl outline-none resize-none border transition ${
                theme === 'dark' 
                  ? 'bg-[#141826] border-slate-800 focus:border-indigo-500 text-white' 
                  : 'bg-white border-slate-300 focus:border-indigo-600 text-slate-900 shadow-sm'
              }`}
            />
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Location</label>
            <input 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className={`w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl outline-none border transition ${
                theme === 'dark' 
                  ? 'bg-[#141826] border-slate-800 focus:border-indigo-500 text-white' 
                  : 'bg-white border-slate-300 focus:border-indigo-600 text-slate-900 shadow-sm'
              }`}
            />
          </div>

          {/* Try-On Body Photo Upload */}
          <div className={`pt-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            <label className={`text-xs font-bold block mb-1.5 flex items-center justify-between ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <span>Default Try-On Body Photo</span>
              <span className="text-[10px] text-emerald-500 font-semibold">Auto-fits all shirts</span>
            </label>
            <label className={`flex items-center gap-3 p-3 rounded-2xl border border-dashed cursor-pointer transition ${
              theme === 'dark' 
                ? 'border-indigo-500/40 hover:border-indigo-400 bg-[#141826]' 
                : 'border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 shadow-sm'
            }`}>
              <Camera className="w-5 h-5 text-indigo-500" />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Upload New Try-On Photo</p>
                <p className="text-[10px] text-slate-500">Used automatically in Virtual Try-On Fitting Room</p>
              </div>
              <input type="file" accept="image/*" onChange={handleTryOnUpload} className="hidden" />
            </label>
          </div>

          <div className={`flex items-center justify-between gap-2 pt-4 border-t ${theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={logout}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition active:scale-95 ${
                theme === 'dark' 
                  ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border-rose-500/30' 
                  : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-300'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeModal}
                className={`px-4 py-2 text-xs font-semibold transition ${
                  theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 active:scale-95"
              >
                Save Profile
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

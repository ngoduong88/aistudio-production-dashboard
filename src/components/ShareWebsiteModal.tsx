import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, X, ExternalLink, Globe } from 'lucide-react';

interface ShareWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareWebsiteModal: React.FC<ShareWebsiteModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);

  // Compute clean public preview URL
  const sharedUrl = typeof window !== 'undefined'
    ? window.location.origin.includes('ais-dev')
      ? window.location.origin.replace('ais-dev', 'ais-pre')
      : window.location.href
    : 'https://ais-pre-zcwnkizf6imrlf7paq4elw-668080273858.asia-east1.run.app';

  const copyShareLink = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Share Production Dashboard
              </h3>
              <p className="text-[11px] text-slate-500">
                Public website URL for line managers & team
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* URL Input with Copy Button */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Website Address (URL)</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">Active & Live</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={sharedUrl}
              onFocus={(e) => e.target.select()}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-mono select-all focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={copyShareLink}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Share guidance & security card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Corporate Protection & Sharing:</span>
          </p>
          <ul className="space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed">
            <li>
              <strong className="text-slate-700 dark:text-slate-300">Protected by Email Gate</strong>: Anyone opening the URL must authenticate with an authorized <strong className="text-blue-600 dark:text-blue-400">@fih-foxconn.com</strong> company email + passcode (<code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded text-slate-900 dark:text-slate-200">FIH-2026</code>). Outsiders cannot view factory data.
            </li>
            <li>
              <strong className="text-slate-700 dark:text-slate-300">Why Restricted Mode gives 404</strong>: In AI Studio's Share setting, setting it to "Restricted" blocks the Cloud Run web server entirely. To keep the website accessible to your staff, keep AI Studio Share set to "Anyone with the link" — the built-in corporate gate guarantees external users are rejected.
            </li>
            <li>
              <strong className="text-slate-700 dark:text-slate-300">Shop-Floor Monitors</strong>: You can open this URL on factory display screens; simply enter company credentials once and check "Keep verified on this device".
            </li>
          </ul>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-1">
          <a
            href={sharedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Open in new tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

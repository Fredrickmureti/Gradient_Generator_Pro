import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { GradientState } from '../types';
import { encodeGradientToUrl } from '../utils/urlSync';

interface ShareButtonProps {
  gradientState: GradientState;
}

export function ShareButton({ gradientState }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = encodeGradientToUrl(gradientState);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied URL!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </>
      )}
    </button>
  );
}
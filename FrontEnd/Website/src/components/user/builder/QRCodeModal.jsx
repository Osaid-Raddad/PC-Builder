import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiX, FiDownload, FiShare2 } from 'react-icons/fi';
import colors from '../../../config/colors';
import toast from 'react-hot-toast';

const QRCodeModal = ({ buildUrl, onClose }) => {
  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = 'pc-build-qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success('QR Code downloaded!');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(buildUrl);
    toast.success('Build link copied to clipboard!');
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-md"
        style={{ border: `3px solid ${colors.mainYellow}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-6 border-b-2 flex items-center justify-between"
          style={{ borderColor: colors.platinum }}
        >
          <div className="flex items-center gap-2">
            <FiShare2 size={24} style={{ color: colors.mainYellow }} />
            <h2 className="text-2xl font-bold" style={{ color: colors.mainBlack }}>
              Share Your Build
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <FiX size={24} style={{ color: colors.jet }} />
          </button>
        </div>

        {/* QR Code Content */}
        <div className="p-8">
          <div className="flex flex-col items-center">
            {/* QR Code */}
            <div 
              className="p-6 rounded-lg mb-6"
              style={{ backgroundColor: colors.mainBeige }}
            >
              <QRCodeSVG
                id="qr-code-svg"
                value={buildUrl}
                size={256}
                level="H"
                includeMargin={true}
                style={{ backgroundColor: 'white' }}
              />
            </div>

            {/* Instructions */}
            <p className="text-center mb-6" style={{ color: colors.jet }}>
              Scan this QR code with your phone to share your PC build with friends!
            </p>

            {/* Build URL */}
            <div 
              className="w-full p-3 rounded-lg mb-6 break-all text-sm text-center"
              style={{ backgroundColor: colors.mainBeige, color: colors.jet }}
            >
              {buildUrl}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={handleDownloadQR}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold border-2 hover:opacity-80 transition-opacity cursor-pointer"
                style={{ 
                  borderColor: colors.mainYellow,
                  color: colors.mainYellow,
                  backgroundColor: 'white'
                }}
              >
                <FiDownload size={20} />
                Download QR
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: colors.mainYellow }}
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;

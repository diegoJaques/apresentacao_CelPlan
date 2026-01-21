import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number; // Default: 520/256 (card image ratio)
  title?: string;
}

export const ImageCropModal = ({
  imageUrl,
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio = 520 / 256, // Proporção do card (largura/altura da imagem no card)
  title = 'Ajustar Enquadramento da Imagem'
}: ImageCropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const image = await createImage(imageUrl);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Set canvas size to cropped area
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // Draw cropped image
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          onCropComplete(blob);
          onClose();
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Erro ao recortar imagem. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  }, [croppedAreaPixels, imageUrl, onCropComplete, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative flex-1 bg-gray-900 min-h-[500px]">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
            style={{
              containerStyle: {
                backgroundColor: '#1a1a1a'
              }
            }}
          />

          {/* Floating Instructions */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <Move className="w-4 h-4" />
            Arraste para posicionar | Use a roda do mouse para zoom
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {/* Zoom Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Zoom
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ZoomOut className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <ZoomIn className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Proporção: {aspectRatio === 520/256 ? '520×256 (Card)' : aspectRatio === 1 ? '1:1 (Quadrado)' : 'Livre'}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={createCroppedImage}
                disabled={isProcessing}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Aplicar Recorte'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to create image element
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

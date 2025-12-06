import React, { useState, useRef, useEffect } from 'react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
  isLoading?: boolean;
}

/**
 * Signature Modal Component
 * Allows users to draw their signature on a canvas
 */
export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize canvas for better mobile support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Set up canvas for drawing
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
    }
    // Reset signature state when modal opens
    if (isOpen) {
      setHasSignature(false);
    }
  }, [isOpen]);

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      // Touch event - use the first touch point
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return { x: 0, y: 0 };
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Calculate scale factor between canvas internal size and displayed size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Convert screen coordinates to canvas coordinates accounting for scale
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleCanvasStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventPos(e);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      // Draw a small dot to ensure something is drawn even if user just taps
      ctx.lineTo(x, y);
      ctx.stroke();
      setHasSignature(true); // Mark that signature has been drawn
    }
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventPos(e);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
      setHasSignature(true); // Mark that signature has been drawn
    }
  };

  const handleCanvasEnd = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false); // Reset signature state
    }
  };

  const isCanvasEmpty = (): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return true;

    const ctx = canvas.getContext('2d');
    if (!ctx) return true;

    // Get image data and check if canvas is empty
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Check if all pixels are transparent (alpha = 0) or white
    for (let i = 3; i < data.length; i += 4) {
      const alpha = data[i];
      if (alpha > 0) {
        // Found a non-transparent pixel
        return false;
      }
    }
    return true;
  };

  const getCanvasData = () => {
    const canvas = canvasRef.current;
    return canvas ? canvas.toDataURL() : '';
  };

  const handleSave = () => {
    // Check if canvas is empty before saving
    if (!hasSignature || isCanvasEmpty()) {
      alert('אנא צייר חתימה לפני השמירה');
      return;
    }

    const signatureData = getCanvasData();
    onSave(signatureData);
    onClose();
  };

  const handleClose = () => {
    clearCanvas();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">הוסף חתימה דיגיטלית</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Signature Drawing */}
        <div className="mb-4 md:mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            צייר את החתימה שלך:
          </label>
          <div className="border-2 border-gray-300 rounded-md p-2 md:p-4">
            <div className="overflow-x-auto">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="border border-gray-200 rounded cursor-crosshair touch-none w-full max-w-full"
                onMouseDown={handleCanvasStart}
                onMouseMove={handleCanvasMove}
                onMouseUp={handleCanvasEnd}
                onMouseLeave={handleCanvasEnd}
                onTouchStart={handleCanvasStart}
                onTouchMove={handleCanvasMove}
                onTouchEnd={handleCanvasEnd}
                style={{ touchAction: 'none', maxWidth: '100%', height: 'auto' }}
              />
            </div>
            <div className="mt-2">
              <button
                onClick={clearCanvas}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
              >
                נקה
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 order-2 sm:order-1"
          >
            ביטול
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            {isLoading ? 'שומר...' : 'שמור חתימה'}
          </button>
        </div>
      </div>
    </div>
  );
};

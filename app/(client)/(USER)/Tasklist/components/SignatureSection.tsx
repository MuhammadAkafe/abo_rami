import React, { useState } from 'react';
import { TaskWithSupplier } from '../../../../hooks/useSupplierTasks';
import { SignatureModal } from './SignatureModal';

interface SignatureSectionProps {
  task: TaskWithSupplier;
  onSignatureUpdate?: (signatureData: string) => void;
  allowEdit?: boolean;
}

/**
 * Signature Section Component
 * Displays the digital signature if available and allows editing
 */
export const SignatureSection: React.FC<SignatureSectionProps> = ({ 
  task, 
  onSignatureUpdate,
  allowEdit = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignatureClick = () => {
    if (allowEdit) {
      setIsModalOpen(true);
    }
  };

  const handleSignatureSave = (signatureData: string) => {
    if (onSignatureUpdate) {
      onSignatureUpdate(signatureData);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <svg className="w-6 h-6 text-purple-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        חתימה דיגיטלית
      </h2>
      
      <div 
        className={`bg-gray-50 rounded-lg p-8 text-center transition-colors ${
          allowEdit ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'
        }`}
        onClick={handleSignatureClick}
      >
        {task.url ? (
          <div>
            <img 
              src={task.url} 
              alt="חתימת ספק" 
              className="max-w-full h-auto mx-auto border border-gray-300 rounded-lg shadow-sm"
              style={{ maxHeight: '300px' }}
            />
            <p className="text-sm text-gray-600 mt-4">חתימה דיגיטלית של המשימה</p>
            {allowEdit && (
              <p className="text-xs text-blue-600 mt-2">לחץ לעריכה</p>
            )}
          </div>
        ) : (
          <div className="text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <p className="text-lg">אין חתימה זמינה</p>
            {allowEdit && (
              <p className="text-sm text-gray-400">לחץ להוספת חתימה דיגיטלית</p>
            )}
          </div>
        )}
      </div>

      {/* Signature Modal - Only show if editing is allowed */}
      {allowEdit && (
        <SignatureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSignatureSave}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { SignatureModal } from './SignatureModal';
import Image from 'next/image';
import { Task } from '@/types/types';
import { updateSignatureViaLink } from '@/app/actions/links/updateSignatureViaLink';
import { toast } from 'react-toastify';

interface SignatureSectionProps {
  task: Task | null;
  onSignatureSaved?: () => void;
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({ 
  task,
  onSignatureSaved,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSignatureClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSignatureSave = async (signatureData: string) => {
    if (!task?.id) {
      toast.error('שגיאה: מזהה משימה לא נמצא', {
        position: 'top-left',
        rtl: true,
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateSignatureViaLink(task.id, signatureData);
      
      if (result.error) {
        toast.error(result.error || 'שגיאה בשמירת החתימה', {
          position: 'top-left',
          rtl: true,
        });
      } else {
        toast.success('החתימה נשמרה בהצלחה', {
          position: 'top-left',
          rtl: true,
        });
        setIsModalOpen(false);
        // Call callback to refresh task data
        if (onSignatureSaved) {
          onSignatureSaved();
        }
      }
    } catch (error) {
      console.error('Error saving signature:', error);
      toast.error('שגיאה בשמירת החתימה', {
        position: 'top-left',
        rtl: true,
      });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
        <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        חתימה דיגיטלית
      </h2>
      
      <div 
        className={`bg-gray-50 rounded-lg p-4 md:p-8 text-center transition-colors ${
          'cursor-pointer hover:bg-gray-100 active:bg-gray-200'
        }`}
        onClick={handleSignatureClick}
      >
        {task?.url ? (
          <div>
            <Image 
              src={task?.url} 
              alt="חתימת ספק" 
              width={400}
              height={300}
              className="max-w-full h-auto mx-auto border border-gray-300 rounded-lg shadow-sm"
              style={{ maxHeight: '300px' }}
            />
            <p className="text-xs md:text-sm text-gray-600 mt-2 md:mt-4">חתימה דיגיטלית של המשימה</p>            
            <p className="text-xs text-blue-600 mt-1 md:mt-2">לחץ לעריכה</p>
          </div>
        ) : (
          <div className="text-gray-500">
            <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <p className="text-base md:text-lg">אין חתימה זמינה</p>
            <p className="text-xs md:text-sm text-gray-400">לחץ להוספת חתימה דיגיטלית</p>
          </div>
        )}
      </div>

      {/* Signature Modal */}
      {isModalOpen && (
        <SignatureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSignatureSave}
          isLoading={isSaving}
        />
      )}
    </div>
  );
};

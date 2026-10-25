import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface EnquiryInitialData {
  product?: string;
  code?: string;
  type?: 'Project Quotation' | 'Dealership Request' | '3D Suite Specification' | 'Product Spec Sheet' | 'General';
  message?: string;
}

interface EnquiryContextType {
  isOpen: boolean;
  initialData: EnquiryInitialData;
  openEnquiry: (data?: EnquiryInitialData) => void;
  closeEnquiry: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export const EnquiryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialData, setInitialData] = useState<EnquiryInitialData>({});

  const openEnquiry = (data?: EnquiryInitialData) => {
    setInitialData(data || {});
    setIsOpen(true);
  };

  const closeEnquiry = () => {
    setIsOpen(false);
    setInitialData({});
  };

  return (
    <EnquiryContext.Provider value={{ isOpen, initialData, openEnquiry, closeEnquiry }}>
      {children}
    </EnquiryContext.Provider>
  );
};

export const useEnquiry = (): EnquiryContextType => {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
};

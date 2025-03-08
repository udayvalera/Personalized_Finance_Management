import React, { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { KeyRound } from 'lucide-react';

export default function EnterOTP() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const otpString = otp.join('');
      console.log(email, otpString);
      await verifyOTP(email, otpString);
      navigate('/signin', { state: { message: "Email verified successfully!"}}); // Redirect after successful verification
    } catch (err) {
      setError(err.message || 'Invalid OTP or verification failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const focusNext = (index: number) => {
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrev = (index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      focusNext(index);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      focusPrev(index);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusPrev(index);
    } else if (e.key === 'ArrowRight' && index < 5) {
      focusNext(index);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(5, pastedData.length - 1)]?.focus();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full">
            <KeyRound className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-600 mb-8">
          We've sent a code to your email. Please enter it below.
        </p>

        <div className="flex gap-3 justify-center mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 border-2 rounded-lg text-center text-xl font-semibold text-gray-800
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
                       transition-all duration-200 ease-in-out
                       disabled:bg-gray-50 disabled:text-gray-400"
              disabled={loading}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || otp.some(digit => !digit)}
          className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 ease-in-out"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying...
            </span>
          ) : (
            'Verify Code'
          )}
        </button>

        <p className="text-center mt-6 text-gray-600">
          Didn't receive the code?{' '}
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => alert('New code sent!')}
            disabled={loading}
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
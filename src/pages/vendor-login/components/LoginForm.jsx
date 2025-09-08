import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { generatePKCECodes } from '../../../utils/pkce';

import userManager from '../../../oidcConfig';

const oidcSettings = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
  response_type: 'code',
  scope: 'api.auth ds.user.read hr.position.readAll hr.user.readAll position.read position.readAll unit.read unit.readAll user.readAll',
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captcha, setCaptcha] = useState({ question: '', answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  function generateCaptcha() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    return { question: `${a} + ${b}`, answer: a + b };
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCaptchaChange = (e) => {
    setCaptchaInput(e.target.value);
    if (errors.captcha) setErrors((prev) => ({ ...prev, captcha: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    if (parseInt(captchaInput) !== captcha.answer) {
      newErrors.captcha = 'Jawaban CAPTCHA salah';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }

    setIsLoading(true);
    try {
      // Contoh fetch API login terbaru, sesuaikan endpoint & payload sesuai backend kamu
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login gagal');

      // Simpan data user dan token
      localStorage.setItem('auth_method', 'local');
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('vendorId', data.vendorId);
      localStorage.setItem('loginTime', new Date().toISOString());

      // Redirect sesuai role
      if (data.role === 'vendor') {
        navigate('/vendor-dashboard');
      } else if (data.role === 'staff') {
        navigate('/internal-staff-dashboard');
      } else if (data.role === 'administrator') {
        navigate('/internal-staff-dashboard');
      } else if (data.role === 'pic') {
        navigate('/internal-staff-dashboard');
      } else if (data.role === 'reviewer') {
        navigate('/reviewer-dashboard');
      } else if (data.role === 'approval') {
        navigate('/approver-dashboard');
      } else if (data.role === 'vendorreview') {
        navigate('/vendor-review-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleOidcLogin = async () => {
  //   const state = crypto.randomUUID();
  //   const { codeVerifier, codeChallenge } = await generatePKCECodes();

  //   sessionStorage.setItem('pkce_code_verifier', codeVerifier);
  //   sessionStorage.setItem('oidc_state', state);

  //   const authorizationUrl =
  //     `${oidcSettings.authority}/connect/authorize?` +
  //     `client_id=${oidcSettings.client_id}&` +
  //     `redirect_uri=${encodeURIComponent(oidcSettings.redirect_uri)}&` +
  //     `response_type=${oidcSettings.response_type}&` +
  //     `scope=${encodeURIComponent(oidcSettings.scope)}&` +
  //     `state=${state}&` +
  //     `code_challenge=${codeChallenge}&` +
  //     `code_challenge_method=S256`;

  //   window.location.href = authorizationUrl;
  // };


  const handleOidcLogin = () => {
    userManager.signinRedirect(); // Wajib pakai ini agar state disimpan
  };


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-card border border-border p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
            Masuk ke Akun
          </h2>
          <p className="text-sm font-body text-muted-foreground">
            Masukkan email dan password Anda
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
              <p className="text-sm font-body text-error">{errors.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Alamat Email"
            type="email"
            name="email"
            placeholder="contoh@perusahaan.com"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
            disabled={isLoading}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
              disabled={isLoading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Verifikasi: {captcha.question} =
            </label>
            <input
              type="number"
              value={captchaInput}
              onChange={handleCaptchaChange}
              className="w-full p-2 border rounded text-sm"
              placeholder="Masukkan jawaban"
              disabled={isLoading}
              required
            />
            {errors.captcha && (
              <p className="text-sm text-error mt-1">{errors.captcha}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            className="mt-6"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={isLoading}
            onClick={handleOidcLogin}
          >
            Login dengan Idaman
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

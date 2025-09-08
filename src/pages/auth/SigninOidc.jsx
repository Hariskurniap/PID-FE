import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userManager from '../../oidcConfig';

const decodeJwtManual = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode JWT manually', e);
    return null;
  }
};

const SigninOidc = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignin = async () => {
      try {
        const user = await userManager.signinRedirectCallback();
        console.log('user access_token', user.access_token);

        const decoded = decodeJwtManual(user.access_token);
        console.log('decoded token payload:', decoded.email);


        if (!user || !user.profile) throw new Error('User profile not found');

        // simpan ke localStorage
        localStorage.setItem('access_token', user.access_token);
        localStorage.setItem('token', user.access_token);
        localStorage.setItem('id_token', user.id_token);
        localStorage.setItem('auth_method', 'oauth2');

        // Ambil email dan display_name dari user.profile
        const email = decoded.email || '';
        const displayName = user.profile.name || decoded.display_name || '';

        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', displayName);
        localStorage.setItem('loginTime', new Date().toISOString());

        // Optional: fetch data user dari backend pakai email dari profile
        try {
          const res = await fetch(`http://localhost:5000/api/users/${email}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            },
          });

          if (!res.ok) throw new Error('User tidak ditemukan');
          const userData = await res.json();

          localStorage.setItem('userId', userData.id);
          localStorage.setItem('vendorId', userData.vendorId || '');
          localStorage.setItem('userRole', userData.role || 'staff');

          // Tentukan role dari backend, fallback ke profile, fallback ke guest
          const role = userData.role || user.profile.role || 'guest';
          if (role === 'vendor') {
            navigate('/vendor-dashboard');
          } else if (role === 'staff') {
            navigate('/internal-staff-dashboard');
          } else if (role === 'administrator') {
            navigate('/internal-staff-dashboard');
          } else if (role === 'pic') {
            navigate('/internal-staff-dashboard');
          } else {
            navigate('/');
          }
        } catch (err) {
          alert('Gagal mendapatkan data user: ' + err.message);
          navigate('/');
        }
      } catch (err) {
        console.error('OIDC callback error:', err);
        // alert('Login gagal: ' + err.message);
        navigate('/');
      }
    };

    handleSignin();
  }, [navigate]);

  return <p className="text-center mt-10">Memproses login...</p>;
};

export default SigninOidc;

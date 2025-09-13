import { useEffect, useState } from 'react';
import BaseButton from '../components/Button/BaseButton';
import { BaseCard } from '../components/Card/BaseCard';
import { BaseLayout } from '../components/Layout/BaseLayout';
import BaseText from '../components/Text/BaseText';
import { useElectron } from '../hooks/useElectron';
import { useNavigate } from 'react-router-dom';

export function AuthScreen() {
  const [isAutenticated, setIsAutenticated] = useState(false);
  const [loginBtnLoading, setLoginBtnLoading] = useState(false);
  const { invoke } = useElectron();
  const navigate = useNavigate();

  async function verifyAuth() {
    const response = await invoke<undefined, boolean>('verifyAutentication');
    setIsAutenticated(!!response);
  }

  async function handleAutentication() {
    setLoginBtnLoading(true);
    try {
      await invoke('oauth');
      await verifyAuth();
    } catch (e) {
      console.log(e);
    } finally {
      setLoginBtnLoading(false);
    }
  }

  useEffect(() => {
    verifyAuth();
  }, []);

  if (isAutenticated) {
    navigate('/dashboard');
  }

  return (
    <BaseLayout>
      <BaseCard className="min-h-[400px] flex flex-col justify-center">
        <div>
          <BaseText className="text-2xl">Click to Autenticate in Twitch</BaseText>
          <BaseText className="text-sm">Click to Autenticate in Twitch</BaseText>
        </div>
        <div className="flex justify-center my-5">
          <BaseButton onClick={handleAutentication} loading={loginBtnLoading}>
            Login
          </BaseButton>
        </div>
      </BaseCard>
    </BaseLayout>
  );
}

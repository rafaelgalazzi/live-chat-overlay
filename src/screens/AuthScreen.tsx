import { useEffect, useState } from 'react';
import BaseButton from '../components/Button/BaseButton';
import { BaseCard } from '../components/Card/BaseCard';
import { BaseLayout } from '../components/Layout/BaseLayout';
import BaseText from '../components/Text/BaseText';
import { useElectron } from '../hooks/useElectron';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AuthScreen() {
  const [loginBtnLoading, setLoginBtnLoading] = useState(false);
  const { invoke } = useElectron();
  const { verifyAuth, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  async function handleAuthentication() {
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
  });

  if (isAuthenticated) {
    navigate('/dashboard');
  }

  function handleUseOnlyTiktok() {
    navigate('/dashboard');
  }

  return (
    <BaseLayout>
      <BaseCard className="min-h-[400px] flex flex-col justify-center">
        <div>
          <BaseText className="text-2xl">Click to Authenticate in Twitch</BaseText>
        </div>
        <div className="flex justify-center my-5">
          <BaseButton onClick={handleAuthentication} loading={loginBtnLoading}>
            Login on Twitch
          </BaseButton>
        </div>
        <div className="flex justify-center my-5">
          <BaseButton onClick={handleUseOnlyTiktok} loading={loginBtnLoading}>
            Use only the Tiktok
          </BaseButton>
        </div>
      </BaseCard>
    </BaseLayout>
  );
}

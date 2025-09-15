import { useEffect, useState } from 'react';
import BaseButton from '../components/Button/BaseButton';
import { BaseCard } from '../components/Card/BaseCard';
import { BaseForm } from '../components/Form/BaseForm';
import { BaseInput } from '../components/Form/BaseInput';
import { BaseLayout } from '../components/Layout/BaseLayout';
import BaseText from '../components/Text/BaseText';
import { useElectron } from '../hooks/useElectron';
import { BaseCheckbox } from '../components/Form/BaseCheckbox';
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const [twitchUserName, setTwitchUsername] = useState('');
  const [tiktokUserName, setTiktokUsername] = useState('');
  const [hasTwitch, setHasTwitch] = useState(true);
  const [hasTiktok, setHasTiktok] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const { invoke } = useElectron();
  const { verifyAuth } = useAuth();

  const twitchNameInputHandler = (name: string) => {
    setTwitchUsername(name);
  };

  const tiktokNameInputHandler = (name: string) => {
    setTiktokUsername(name);
  };

  const handleStartOverlay = async () => {
    try {
      await invoke('start-chat', { username: twitchUserName });
    } catch (e) {
      console.log(e);
    } finally {
      setIsRunning(true);
    }
  };

  const handleStopOverlay = async () => {
    try {
      await invoke('stop-chat');
    } catch (e) {
      console.log(e);
    } finally {
      setIsRunning(false);
    }
  };

  function handleToggleTwitch() {
    setHasTwitch(!hasTwitch);
  }

  function handleToggleTiktok() {
    setHasTiktok(!hasTiktok);
  }

  useEffect(() => {
    verifyAuth();
  });

  return (
    <BaseLayout>
      <BaseCard className="min-h-[400px] flex flex-col justify-center">
        <div className="flex justify-center">
          <BaseCheckbox className="p-2" label="Twitch" checked={hasTwitch} onChange={handleToggleTwitch} />
          <BaseCheckbox className="p-2" label="Tiktok" checked={hasTiktok} onChange={handleToggleTiktok} />
        </div>
        <div>
          <BaseText className="text-2xl mb-5">Enter the Username:</BaseText>
          <BaseText className="text-sm mb-5">
            The usernames are used to find whose chat you want to put in your overlay! Using both will mix the chats
            making easier see.
          </BaseText>
        </div>
        {hasTwitch && (
          <>
            <BaseForm>
              <BaseInput
                value={twitchUserName}
                onChange={twitchNameInputHandler}
                placeholder="Enter the Twitch username"
              ></BaseInput>
            </BaseForm>
          </>
        )}
        {hasTiktok && (
          <>
            <BaseForm>
              <BaseInput
                value={tiktokUserName}
                onChange={tiktokNameInputHandler}
                placeholder="Enter the Tiktok username"
              ></BaseInput>
            </BaseForm>
          </>
        )}
        <div className="flex justify-center my-1">
          <div>
            <div className="my-2">
              <BaseButton onClick={handleStartOverlay} disabled={!twitchUserName.length || isRunning}>
                Start Overlay
              </BaseButton>
            </div>
            <div className="my-2">
              <BaseButton onClick={handleStopOverlay} disabled={!isRunning}>
                Stop Overlay
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseCard>
    </BaseLayout>
  );
}

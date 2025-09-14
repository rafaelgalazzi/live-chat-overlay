import { useState } from 'react';
import BaseButton from '../components/Button/BaseButton';
import { BaseCard } from '../components/Card/BaseCard';
import { BaseForm } from '../components/Form/BaseForm';
import { BaseInput } from '../components/Form/BaseInput';
import { BaseLayout } from '../components/Layout/BaseLayout';
import BaseText from '../components/Text/BaseText';
import { useElectron } from '../hooks/useElectron';

export function Dashboard() {
  const [twitchUserName, setTwitchUsername] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const { invoke } = useElectron();

  const nameInputHandler = (name: string) => {
    setTwitchUsername(name);
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

  return (
    <BaseLayout>
      <BaseCard className="min-h-[400px] flex flex-col justify-center">
        <div>
          <BaseText className="text-2xl mb-5">Enter the Twitch username:</BaseText>
          <BaseText className="text-sm mb-5">The username is used to find who's chat you want to put in your overlay</BaseText>
        </div>
        <BaseForm>
          <BaseInput value={twitchUserName} onChange={nameInputHandler} placeholder='Enter the twitch username'></BaseInput>
        </BaseForm>
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

import BaseButton from '../components/Button/BaseButton';
import { BaseCard } from '../components/Card/BaseCard';
import { BaseLayout } from '../components/Layout/BaseLayout';
import BaseText from '../components/Text/BaseText';

export function AuthScreen() {
  async function handleAutentication() {}
  return (
    <BaseLayout>
      <BaseCard className="min-h-[400px] flex flex-col justify-center">
        <div>
          <BaseText className='text-2xl'>Click to Autenticate in Twitch</BaseText>
          <BaseText className='text-sm'>Click to Autenticate in Twitch</BaseText>
        </div>
        <div className="flex justify-center my-5">
          <BaseButton onClick={handleAutentication}>Login</BaseButton>
        </div>
      </BaseCard>
    </BaseLayout>
  );
}

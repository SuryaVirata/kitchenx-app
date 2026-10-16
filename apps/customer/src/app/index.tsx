import { WelcomeScreen } from '../shell/WelcomeScreen';
import { useAppRouter } from '../shell/AppRouter';
import { useSplashReady } from '../shell/SplashReady';

export default function WelcomeRoute() {
  const { push } = useAppRouter();
  const ready = useSplashReady();
  const openLogin = () => push('/login');
  return <WelcomeScreen ready={ready} onSkip={openLogin} onFinished={openLogin} />;
}

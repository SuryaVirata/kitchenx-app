import { LoginScreen } from '../../features/auth/AuthScreens';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function LoginRoute() {
  const { back, canGoBack, replace, push } = useAppRouter();
  const { setDestination } = useCustomerSession();
  return (
    <LoginScreen
      onBack={() => (canGoBack() ? back() : replace('/'))}
      onCodeSent={(next) => {
        setDestination(next);
        push('/otp');
      }}
    />
  );
}

import { LocationScreen } from '../../features/onboarding/OnboardingScreens';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function LocationRoute() {
  const { back, canGoBack, replace, push } = useAppRouter();
  const { social, setCity } = useCustomerSession();
  return (
    <LocationScreen
      social={social}
      onBack={() => (canGoBack() ? back() : replace('/needs'))}
      onContinue={(next) => {
        setCity(next);
        push('/shop');
      }}
    />
  );
}

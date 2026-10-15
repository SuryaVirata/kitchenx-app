import { BusinessNeedsScreen } from '../../features/onboarding/OnboardingScreens';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function NeedsRoute() {
  const { back, canGoBack, replace, push } = useAppRouter();
  const { social } = useCustomerSession();
  return (
    <BusinessNeedsScreen
      social={social}
      onBack={() => (canGoBack() ? back() : replace('/business'))}
      onContinue={() => push('/location')}
    />
  );
}

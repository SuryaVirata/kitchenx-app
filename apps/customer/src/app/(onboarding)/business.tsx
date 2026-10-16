import { BusinessTypeScreen } from '../../features/onboarding/OnboardingScreens';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function BusinessRoute() {
  const { back, canGoBack, replace, push } = useAppRouter();
  const { businessType, setBusinessType } = useCustomerSession();
  return (
    <BusinessTypeScreen
      initial={businessType}
      onClose={() => (canGoBack() ? back() : replace('/login'))}
      onContinue={(type) => {
        setBusinessType(type);
        push(type === 'registered' ? '/setup' : '/shop');
      }}
    />
  );
}

import { BusinessTypeScreen } from '../../features/onboarding/OnboardingScreens';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function BusinessRoute() {
  const { replace, push } = useAppRouter();
  const { businessType, setBusinessType } = useCustomerSession();
  return (
    <BusinessTypeScreen
      initial={businessType}
      onClose={() => replace('/login')}
      onContinue={(type) => {
        setBusinessType(type);
        push('/needs');
      }}
    />
  );
}

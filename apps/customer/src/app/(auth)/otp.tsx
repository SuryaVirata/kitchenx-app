import { OtpScreen } from '../../features/auth/AuthScreens';
import { Redirect, useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function OtpRoute() {
  const { back, canGoBack, replace, push } = useAppRouter();
  const { destination, businessType, setSocial } = useCustomerSession();
  if (!destination) return <Redirect href="/login" />;
  return (
    <OtpScreen
      destination={destination}
      onBack={() => (canGoBack() ? back() : replace('/login'))}
      onVerifying={() => undefined}
      onVerified={() => {
        setSocial(null);
        push(businessType ? '/needs' : '/business');
      }}
    />
  );
}

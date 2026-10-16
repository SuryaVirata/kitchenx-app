import { RestaurantSetupScreen } from '../../features/setup/RestaurantSetupScreens';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function SetupRoute() {
  const { back, canGoBack, replace, push } = useAppRouter();
  const { setup } = useCustomerSession();
  return (
    <RestaurantSetupScreen
      draft={setup}
      onBack={() => (canGoBack() ? back() : replace('/business'))}
      onRestaurant={() => push('/edit-outlet')}
      onVerify={() => push('/pan')}
      onSkip={() => push('/shop')}
    />
  );
}

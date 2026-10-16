import { PanScreen } from '../../features/setup/RestaurantSetupScreens';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function PanRoute() {
  const { back, canGoBack, replace, push } = useAppRouter();
  const { setup, updateSetup } = useCustomerSession();
  return (
    <PanScreen
      draft={setup}
      onBack={() => (canGoBack() ? back() : replace('/setup'))}
      onChange={updateSetup}
      onContinue={() => push('/gst')}
    />
  );
}

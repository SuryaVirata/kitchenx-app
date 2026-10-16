import { FssaiScreen } from '../../features/setup/RestaurantSetupScreens';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function FssaiRoute() {
  const { back, canGoBack, replace, push } = useAppRouter();
  const { setup, updateSetup } = useCustomerSession();
  return (
    <FssaiScreen
      draft={setup}
      onBack={() => (canGoBack() ? back() : replace('/gst'))}
      onChange={updateSetup}
      onContinue={() => push('/shop')}
      onGst={() => (canGoBack() ? back() : replace('/gst'))}
    />
  );
}

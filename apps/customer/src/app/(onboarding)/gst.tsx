import { GstScreen } from '../../features/setup/RestaurantSetupScreens';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function GstRoute() {
  const { back, canGoBack, replace, push } = useAppRouter();
  const { setup, updateSetup } = useCustomerSession();
  return (
    <GstScreen
      draft={setup}
      onBack={() => (canGoBack() ? back() : replace('/pan'))}
      onChange={updateSetup}
      onContinue={() => push('/shop')}
      onFssai={() => push('/fssai')}
    />
  );
}

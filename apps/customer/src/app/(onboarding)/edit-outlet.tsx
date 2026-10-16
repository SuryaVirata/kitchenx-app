import { EditOutletScreen } from '../../features/setup/RestaurantSetupScreens';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function EditOutletRoute() {
  const { back, canGoBack, replace } = useAppRouter();
  const { setup, updateSetup } = useCustomerSession();
  return (
    <EditOutletScreen
      draft={setup}
      onBack={() => (canGoBack() ? back() : replace('/setup'))}
      onChange={updateSetup}
    />
  );
}

import { EditDetailsScreen } from '../../features/setup/RestaurantSetupScreens';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function EditDetailsRoute() {
  const { back, canGoBack, replace } = useAppRouter();
  const { setup, updateSetup } = useCustomerSession();
  return (
    <EditDetailsScreen
      draft={setup}
      onBack={() => (canGoBack() ? back() : replace('/setup'))}
      onChange={updateSetup}
    />
  );
}

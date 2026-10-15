import { DeliveryLocationFlow } from '../../features/location/DeliveryLocation';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function DeliveryRoute() {
  const { back, canGoBack, replace } = useAppRouter();
  const { setCity } = useCustomerSession();
  return (
    <DeliveryLocationFlow
      onBack={() => (canGoBack() ? back() : replace('/shop'))}
      onSave={(next) => {
        setCity(next);
        replace('/shop');
      }}
    />
  );
}

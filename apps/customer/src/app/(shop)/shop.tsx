import { ShopFlow } from '../../features/catalogue/ShopScreens';
import { useAppRouter } from '../../shell/AppRouter';
import { useCustomerSession } from '../../shell/CustomerSession';

export default function ShopRoute() {
  const { push } = useAppRouter();
  const { city } = useCustomerSession();
  return <ShopFlow city={city} onDeliver={() => push('/delivery')} />;
}

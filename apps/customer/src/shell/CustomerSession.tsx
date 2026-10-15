import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { MobileDestination } from '../features/auth/AuthScreens';
import { BusinessRegistration, SocialSession } from '../features/onboarding/OnboardingScreens';

type CustomerSessionValue = {
  city: string;
  setCity: (city: string) => void;
  social: SocialSession | null;
  setSocial: (social: SocialSession | null) => void;
  destination: MobileDestination | null;
  setDestination: (destination: MobileDestination | null) => void;
  businessType: BusinessRegistration | null;
  setBusinessType: (type: BusinessRegistration | null) => void;
};

const CustomerSessionContext = createContext<CustomerSessionValue | null>(null);

export function CustomerSessionProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState('Hyderabad');
  const [social, setSocial] = useState<SocialSession | null>(null);
  const [destination, setDestination] = useState<MobileDestination | null>(null);
  const [businessType, setBusinessType] = useState<BusinessRegistration | null>(null);
  const value = useMemo(
    () => ({ city, setCity, social, setSocial, destination, setDestination, businessType, setBusinessType }),
    [city, social, destination, businessType],
  );
  return <CustomerSessionContext.Provider value={value}>{children}</CustomerSessionContext.Provider>;
}

export function useCustomerSession() {
  const value = useContext(CustomerSessionContext);
  if (!value) {
    throw new Error('useCustomerSession must be used inside CustomerSessionProvider');
  }
  return value;
}

import { WelcomeCards } from "@/components/welcome/WelcomeCards";
import { isGuestEnabled } from "@/lib/auth/config";

export default function WelcomePage() {
  return <WelcomeCards showGuest={isGuestEnabled()} />;
}

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

interface CookieSettingsButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

// Button to open cookie settings from anywhere in the app
export default function CookieSettingsButton({ 
  variant = "ghost", 
  size = "sm",
  className = ""
}: CookieSettingsButtonProps) {
  const { showConsentSettings } = useCookieConsent();

  return (
    <Button
      onClick={showConsentSettings}
      variant={variant}
      size={size}
      className={`text-xs font-normal ${className}`}
    >
      <Settings className="w-3 h-3 mr-1" />
      Cookie-Einstellungen
    </Button>
  );
}
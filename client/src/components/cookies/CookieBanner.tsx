import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Settings, X } from "lucide-react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export default function CookieBanner() {
  const { 
    showBanner, 
    acceptAll, 
    rejectAll, 
    showConsentSettings, 
    hideConsent 
  } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/50 to-transparent">
      <Card className="max-w-4xl mx-auto bg-white shadow-2xl border-0">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ihre Privatsphäre ist uns wichtig
                </h3>
                <Badge variant="outline" className="text-xs">
                  DSGVO konform
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Wir verwenden Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten. 
                Einige Cookies sind für die Grundfunktionen der Website erforderlich, während andere 
                uns helfen, die Website zu verbessern und Ihnen relevante Inhalte anzuzeigen.
              </p>
              
              <div className="text-xs text-gray-500 mb-4">
                Sie können Ihre Einstellungen jederzeit ändern. Weitere Informationen finden Sie in unserer{" "}
                <a href="/datenschutz" className="text-green-600 hover:underline">
                  Datenschutzerklärung
                </a>.
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={acceptAll}
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
                >
                  Alle Cookies akzeptieren
                </Button>
                
                <Button
                  onClick={rejectAll}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                >
                  Nur notwendige Cookies
                </Button>
                
                <Button
                  onClick={showConsentSettings}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800 px-6"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Einstellungen
                </Button>
              </div>
            </div>
            
            {/* Close Button */}
            <Button
              onClick={hideConsent}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
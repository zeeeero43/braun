import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Info, X, Save, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCookieConsent, CookieConsent, COOKIE_CATEGORIES } from "@/hooks/useCookieConsent";

export default function CookieSettings() {
  const { 
    showSettings, 
    consent,
    setConsent, 
    hideConsent,
    rejectAll,
    acceptAll
  } = useCookieConsent();

  const [localConsent, setLocalConsent] = useState<CookieConsent>(() => 
    consent || {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
  );

  const handleSave = () => {
    setConsent(localConsent);
  };

  const handleToggle = (category: keyof CookieConsent, enabled: boolean) => {
    setLocalConsent(prev => ({
      ...prev,
      [category]: enabled
    }));
  };

  const resetToDefault = () => {
    setLocalConsent({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  };

  if (!showSettings) return null;

  return (
    <Dialog open={showSettings} onOpenChange={hideConsent}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Cookie-Einstellungen</DialogTitle>
              <DialogDescription className="mt-1">
                Verwalten Sie Ihre Cookie-Präferenzen für walterbraun-muenchen.de
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">
            <Button onClick={acceptAll} size="sm" className="bg-green-600 hover:bg-green-700">
              Alle akzeptieren
            </Button>
            <Button onClick={rejectAll} variant="outline" size="sm">
              Nur notwendige
            </Button>
            <Button onClick={resetToDefault} variant="ghost" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Zurücksetzen
            </Button>
          </div>

          {/* Cookie Categories */}
          <div className="space-y-4">
            {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => {
              const categoryKey = key as keyof CookieConsent;
              const isEnabled = localConsent[categoryKey];
              const isRequired = category.required;

              return (
                <Card key={key} className="relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-base">{category.name}</CardTitle>
                          {isRequired && (
                            <Badge variant="secondary" className="text-xs">
                              Erforderlich
                            </Badge>
                          )}
                          {isEnabled && !isRequired && (
                            <Badge className="text-xs bg-green-100 text-green-800">
                              Aktiviert
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm leading-relaxed">
                          {category.description}
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-4">
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(checked) => handleToggle(categoryKey, checked)}
                          disabled={isRequired}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Info className="w-3 h-3" />
                        <span>Beispiele für Cookies in dieser Kategorie:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {category.cookies.map((cookie, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cookie}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* DSGVO Information */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">Ihre Rechte nach DSGVO:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Sie können Ihre Einwilligung jederzeit widerrufen</li>
                    <li>• Ihre Einstellungen werden für 13 Monate gespeichert</li>
                    <li>• Bei Ablehnung werden entsprechende Cookies automatisch gelöscht</li>
                    <li>• Sie haben das Recht auf Auskunft über gespeicherte Daten</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Einstellungen speichern
          </Button>
          <Button onClick={hideConsent} variant="outline" className="flex-1">
            Abbrechen
          </Button>
        </div>

        {/* Footer Links */}
        <div className="text-center pt-2 border-t border-gray-100">
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <a href="/datenschutz" className="hover:text-green-600 transition-colors">
              Datenschutzerklärung
            </a>
            <a href="/impressum" className="hover:text-green-600 transition-colors">
              Impressum
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
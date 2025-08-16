import Navigation from "@/components/navigation";
import { WhatsAppButton } from "@/components/whatsapp-button";
import SEOHead from "@/components/seo/SEOHead";
import CookieSettingsButton from "@/components/cookies/CookieSettingsButton";
import { Link } from "wouter";
import { Shield, Eye, Database, Cookie, Mail, Phone, Settings } from "lucide-react";

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Datenschutzerklärung - Walter Braun Umzüge München"
        description="DSGVO-konforme Datenschutzerklärung von Walter Braun Umzüge München. Informationen über Datenverarbeitung, Cookies und Ihre Rechte."
        url="https://walterbraun-muenchen.de/datenschutz"
        type="website"
      />
      
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Datenschutzerklärung</h1>
            <p className="text-lg text-gray-600">
              DSGVO-konforme Informationen zur Datenverarbeitung
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-12">
            
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-green-600" />
                Datenschutz auf einen Blick
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. 
                  Diese Datenschutzerklärung informiert Sie darüber, wie wir mit Ihren 
                  personenbezogenen Daten umgehen, wenn Sie unsere Website besuchen.
                </p>
                <p>
                  <strong>Verantwortlicher im Sinne der DSGVO:</strong><br />
                  Jawan Bakhat<br />
                  Walter Braun Umzüge München<br />
                  Landsberger Str. 302<br />
                  80687 München<br />
                  E-Mail: info@walterbraun-umzuege.de<br />
                  Telefon: +49 176 724 883 32
                </p>
              </div>
            </div>

            {/* Data Collection */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Database className="w-6 h-6 mr-3 text-green-600" />
                Welche Daten erheben wir?
              </h2>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Automatisch erhobene Daten</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• IP-Adresse (anonymisiert)</li>
                    <li>• Browser-Typ und Version</li>
                    <li>• Betriebssystem</li>
                    <li>• Referrer URL</li>
                    <li>• Hostname des zugreifenden Rechners</li>
                    <li>• Uhrzeit der Serveranfrage</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Kontaktformular</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Name</li>
                    <li>• E-Mail-Adresse</li>
                    <li>• Telefonnummer (optional)</li>
                    <li>• Nachrichteninhalt</li>
                    <li>• Zeitpunkt der Anfrage</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                  </p>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Cookie className="w-6 h-6 mr-3 text-green-600" />
                Cookies und Tracking
              </h2>
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  Unsere Website verwendet Cookies, um die Nutzererfahrung zu verbessern und 
                  anonymisierte Statistiken zu erstellen. Sie können Ihre Cookie-Einstellungen 
                  jederzeit anpassen.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Notwendige Cookies</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Erforderlich für die Grundfunktionen der Website. Können nicht deaktiviert werden.
                    </p>
                    <ul className="text-sm text-gray-600">
                      <li>• Session-Management</li>
                      <li>• Sicherheitstoken</li>
                      <li>• Cookie-Einstellungen</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Analyse Cookies</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Helfen uns zu verstehen, wie Besucher mit der Website interagieren.
                    </p>
                    <ul className="text-sm text-gray-600">
                      <li>• Google Analytics (opt-in)</li>
                      <li>• Performance-Monitoring</li>
                      <li>• Anonymisierte Statistiken</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Settings className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Cookie-Einstellungen verwalten</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Sie können Ihre Cookie-Einstellungen jederzeit ändern oder widerrufen:
                  </p>
                  <CookieSettingsButton 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Google Analytics */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-green-600" />
                Google Analytics
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Wir verwenden Google Analytics nur mit Ihrer ausdrücklichen Einwilligung. 
                  Die Datenverarbeitung erfolgt anonymisiert und DSGVO-konform:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• IP-Anonymisierung aktiviert</li>
                  <li>• Advertising Features deaktiviert</li>
                  <li>• Cookie-Laufzeit auf 90 Tage begrenzt (statt 2 Jahre)</li>
                  <li>• Datenübertragung in die USA nur mit Angemessenheitsbeschluss</li>
                </ul>
                <p>
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                </p>
                <p>
                  <strong>Datenübertragung:</strong> Google Ireland Limited, Gordon House, 
                  Barrow Street, Dublin 4, Irland
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ihre Rechte</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Auskunft</h3>
                    <p className="text-sm text-gray-700">
                      Recht auf Auskunft über gespeicherte personenbezogene Daten (Art. 15 DSGVO)
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Berichtigung</h3>
                    <p className="text-sm text-gray-700">
                      Recht auf Berichtigung unrichtiger Daten (Art. 16 DSGVO)
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Löschung</h3>
                    <p className="text-sm text-gray-700">
                      Recht auf Löschung personenbezogener Daten (Art. 17 DSGVO)
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Einschränkung</h3>
                    <p className="text-sm text-gray-700">
                      Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Datenübertragbarkeit</h3>
                    <p className="text-sm text-gray-700">
                      Recht auf Datenübertragbarkeit (Art. 20 DSGVO)
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Widerspruch</h3>
                    <p className="text-sm text-gray-700">
                      Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Beschwerderecht</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren, 
                  wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen 
                  Daten gegen die DSGVO verstößt.
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <strong>Zuständige Aufsichtsbehörde:</strong><br />
                  Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg<br />
                  Königstraße 10a, 70173 Stuttgart<br />
                  E-Mail: poststelle@lfdi.bwl.de
                </p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Mail className="w-6 h-6 mr-3 text-green-600" />
                Kontakt Datenschutz
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie sich an:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href="mailto:info@walterbraun-umzuege.de" className="text-green-600 hover:underline">
                      info@walterbraun-umzuege.de
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href="tel:+4917672488332" className="text-green-600 hover:underline">
                      +49 176 724 883 32
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Updates */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Aktualität der Datenschutzerklärung</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Diese Datenschutzerklärung ist aktuell gültig und hat den Stand August 2025. 
                Durch die Weiterentwicklung unserer Website und Angebote oder aufgrund 
                geänderter gesetzlicher Bestimmungen kann es notwendig werden, diese 
                Datenschutzerklärung zu ändern.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 text-center">
            <div className="inline-flex gap-4 text-sm">
              <Link href="/" className="text-green-600 hover:underline">
                Zur Startseite
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/impressum" className="text-green-600 hover:underline">
                Impressum
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-800 pt-6 lg:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm lg:text-base text-gray-400">
                &copy; 2025 Walter Braun Umzüge. Alle Rechte vorbehalten.
              </p>
              <div className="flex items-center gap-4">
                <CookieSettingsButton 
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                />
                <span className="text-xs text-gray-500">DSGVO-konform</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}
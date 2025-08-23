import Navigation from "@/components/navigation";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { GoogleAdsTracking } from "@/components/tracking/GoogleAdsTracking";
import SEOHead from "@/components/seo/SEOHead";
import CookieSettingsButton from "@/components/cookies/CookieSettingsButton";
import { Link } from "wouter";
import { Mail, Phone, MapPin, Building, CreditCard } from "lucide-react";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Impressum - Walter Braun Umzüge München"
        description="Impressum und rechtliche Angaben von Walter Braun Umzüge München. Kontaktdaten, Umsatzsteuer-ID und weitere gesetzlich vorgeschriebene Informationen."
        url="https://walterbraun-muenchen.de/impressum"
        type="website"
      />
      
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Impressum</h1>
            <p className="text-lg text-gray-600">
              Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            {/* Company Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Building className="w-6 h-6 mr-3 text-green-600" />
                Firmenangaben
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="text-xl font-semibold text-gray-900">
                  Jawan Bakhat
                </div>
                <div className="text-lg text-green-600 font-medium">
                  Walter Braun Umzüge München
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <div>Landsberger Str. 302</div>
                    <div>80687 München</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Phone className="w-6 h-6 mr-3 text-green-600" />
                Kontakt
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-gray-600">Telefon: </span>
                    <a href="tel:+4917672488332" className="text-green-600 hover:underline font-medium">
                      +49 176 724 883 32
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-gray-600">E-Mail: </span>
                    <a href="mailto:info@walterbraun-umzuege.de" className="text-green-600 hover:underline font-medium">
                      info@walterbraun-umzuege.de
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-green-600" />
                Kontodaten
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Bank: </span>
                  <span className="text-gray-900">Sparkasse Rhein Neckar Nord</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Kontoinhaber: </span>
                  <span className="text-gray-900">Jawan Bakhat</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">IBAN: </span>
                  <span className="text-gray-900 font-mono">DE30 6705 0505 0039 7924 51</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">BIC: </span>
                  <span className="text-gray-900 font-mono">MANSDE66XXX</span>
                </div>
              </div>
            </div>

            {/* VAT ID */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Umsatzsteuer-ID</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="text-gray-700 mb-2">
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
                </div>
                <div className="text-xl font-mono font-bold text-blue-800">
                  DE319248990
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Rechtliche Hinweise</h2>
              <div className="text-gray-600 space-y-4 text-sm leading-relaxed">
                <p>
                  <strong>Haftung für Inhalte:</strong> Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG 
                  für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. 
                  Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, 
                  übermittelte oder gespeicherte fremde Informationen zu überwachen.
                </p>
                <p>
                  <strong>Haftung für Links:</strong> Unser Angebot enthält Links zu externen Websites Dritter, 
                  auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte 
                  auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige 
                  Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
                <p>
                  <strong>Urheberrecht:</strong> Die durch die Seitenbetreiber erstellten Inhalte und Werke 
                  auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, 
                  Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen 
                  der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 text-center">
            <div className="inline-flex gap-4 text-sm">
              <Link href="/" className="text-green-600 hover:underline">
                Zur Startseite
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/datenschutz" className="text-green-600 hover:underline">
                Datenschutzerklärung
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
      <GoogleAdsTracking />
    </div>
  );
}
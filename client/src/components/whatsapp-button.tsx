import whatsappLogo from "@assets/[CITYPNG.COM]Outline Whatsapp Wa Watsup Green Logo Icon Symbol Sign PNG - 800x800 (1)_1754835567434.png";

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    // Walter Braun Umzüge WhatsApp Nummer (Beispiel - sollte durch echte Nummer ersetzt werden)
    const phoneNumber = "4989123456789"; // Format: Ländercode + Nummer ohne führende 0
    const message = encodeURIComponent("Hallo, ich interessiere mich für Ihre Umzugsdienstleistungen in München.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group"
        aria-label="WhatsApp Kontakt"
      >
        <img 
          src={whatsappLogo} 
          alt="WhatsApp" 
          className="w-8 h-8 filter brightness-0 invert group-hover:scale-110 transition-transform duration-300"
        />
      </button>
      
      {/* Pulse Animation */}
      <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 whatsapp-pulse"></div>
    </div>
  );
}
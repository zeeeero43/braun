import whatsappLogo from "@assets/[CITYPNG.COM]Outline Whatsapp Wa Watsup Green Logo Icon Symbol Sign PNG - 800x800 (1)_1754835567434.png";

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const url = "https://wa.me/01743861652?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20Ihre%20Umzugsdienstleistungen%20in%20M%C3%BCnchen.";
    console.log('Opening WhatsApp:', url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Pulse Animation - behind button */}
      <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 whatsapp-pulse pointer-events-none"></div>
      
      <button
        onClick={handleWhatsAppClick}
        className="relative z-10 bg-green-500 hover:bg-green-600 rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group cursor-pointer"
        aria-label="WhatsApp Kontakt"
        style={{ pointerEvents: 'auto' }}
      >
        <img 
          src={whatsappLogo} 
          alt="WhatsApp" 
          className="w-8 h-8 filter brightness-0 invert group-hover:scale-110 transition-transform duration-300 pointer-events-none"
        />
      </button>
    </div>
  );
}
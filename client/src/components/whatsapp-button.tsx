import whatsappLogo from "@assets/[CITYPNG.COM]Outline Whatsapp Wa Watsup Green Logo Icon Symbol Sign PNG - 800x800 (1)_1754835567434.png";

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const url = "https://web.whatsapp.com/send?phone=491743861652&text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20Ihre%20Umzugsdienstleistungen%20in%20M%C3%BCnchen.";
    console.log('Opening WhatsApp:', url);
    window.open(url, '_blank', 'noopener,noreferrer');
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
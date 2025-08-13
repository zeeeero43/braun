import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ServiceData {
  title: string;
  content: {
    description: string;
    details: string[];
    conclusion: string;
  };
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData: ServiceData | null;
}

export default function ServiceModal({ isOpen, onClose, serviceData }: ServiceModalProps) {
  const scrollToContact = () => {
    onClose();
    setTimeout(() => {
      const element = document.getElementById("kontakt");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  if (!serviceData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {serviceData.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-gray-600 space-y-4">
          <p className="mb-4">{serviceData.content.description}</p>
          
          <div>
            <h4 className="font-semibold mb-2 text-gray-900">Leistungen im Detail:</h4>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {serviceData.content.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
          
          <p>{serviceData.content.conclusion}</p>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <Button 
            onClick={scrollToContact}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Angebot anfordern
          </Button>
          <Button 
            onClick={onClose}
            variant="outline"
            className="px-6 py-3 rounded-lg font-semibold"
          >
            Schließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

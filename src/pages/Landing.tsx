
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2D2654] via-[#8B2E68] to-[#2D2654] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="hidden md:flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white rounded-lg"></div>
          <span className="text-xl font-bold">Loading loogo</span>
        </div>
        <div className="flex items-center space-x-8">
          <a href="#" className="hover:text-yellow-300 transition-colors">GAMIFIED</a>
          <a href="#" className="hover:text-yellow-300 transition-colors">ABOUT US</a>
          <a href="#" className="hover:text-yellow-300 transition-colors">STROUT TES</a>
          <a href="#" className="hover:text-yellow-300 transition-colors">HoJo</a>
          <a href="#" className="hover:text-yellow-300 transition-colors">TopGng</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-16 relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg">
              <span className="block text-yellow-300">LEVEL UP</span>
              <span className="block">YOUR</span>
              <span className="block">FINANCES</span>
            </h1>
            
            <p className="text-lg opacity-90 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. 
              Praesent libero. Sed cursus ante dapibus diam.
            </p>

            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2 rounded-full text-lg font-semibold"
            >
              LPTO! MOER
            </Button>

            <Progress value={60} className="h-3 bg-purple-900/50" />

            <p className="text-sm opacity-80 max-w-md mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Praesent libero sed cursus ante dapibus diam.
            </p>
          </div>

          {/* Right Column */}
          <div className="relative">
            {/* Character Image */}
            <div className="relative z-10 flex justify-center">
              <div className="w-64 h-[500px] bg-purple-900 rounded-3xl relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/32014c5f-a2c8-4121-be0c-52880beb2f30.png" 
                    alt="Pixel Character" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <Card className="absolute top-10 right-0 p-6 bg-purple-900/90 backdrop-blur text-white rounded-xl max-w-xs">
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">REWARDS</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Level</span>
                  <span className="text-yellow-300">231 CRG</span>
                </div>
                <Button className="w-full bg-red-500 hover:bg-red-600">
                  REWARDS
                </Button>
              </div>
            </Card>

            {/* Learning Section */}
            <div className="mt-8 space-y-2">
              <h3 className="text-2xl font-bold">Learning accets</h3>
              <p className="text-lg opacity-90">
                Pecomined coures to interatied chalemgre interactive challenges environnmeat.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
      </main>
    </div>
  );
};

export default Landing;

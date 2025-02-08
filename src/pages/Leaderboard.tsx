
import { Trophy, Medal, Award } from "lucide-react";
import PageContainer from "@/components/ui/page-container";

const Leaderboard = () => {
  return (
    <PageContainer className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600">See how you stack up against other investors</p>
      </div>

      {/* Top 3 Winners */}
      <div className="flex justify-center items-end gap-4 py-8">
        {/* Second Place */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur border-2 border-gray-200 mb-2 mx-auto overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="2nd Place" className="w-full h-full" />
          </div>
          <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-gray-200 text-center">
            <Medal className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <div className="font-semibold">Sarah K.</div>
            <div className="text-sm text-gray-600">4,890 XP</div>
          </div>
        </div>

        {/* First Place */}
        <div className="text-center -mt-8">
          <div className="w-24 h-24 rounded-full bg-white/80 backdrop-blur border-2 border-primary mb-2 mx-auto overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="1st Place" className="w-full h-full" />
          </div>
          <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-xl text-white text-center">
            <Trophy className="w-8 h-8 mx-auto mb-1" />
            <div className="font-semibold">John D.</div>
            <div className="text-sm opacity-90">5,230 XP</div>
          </div>
        </div>

        {/* Third Place */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur border-2 border-gray-200 mb-2 mx-auto overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" alt="3rd Place" className="w-full h-full" />
          </div>
          <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-gray-200 text-center">
            <Award className="w-6 h-6 text-amber-600 mx-auto mb-1" />
            <div className="font-semibold">Emma R.</div>
            <div className="text-sm text-gray-600">4,550 XP</div>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="space-y-4">
          {[4, 5, 6, 7, 8, 9, 10].map((position) => (
            <LeaderboardItem
              key={position}
              position={position}
              name={`Player ${position}`}
              xp={5230 - position * 100}
              image={`https://api.dicebear.com/7.x/avataaars/svg?seed=Player${position}`}
            />
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

const LeaderboardItem = ({ position, name, xp, image }: { position: number; name: string; xp: number; image: string }) => (
  <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="w-8 text-center font-semibold text-gray-600">#{position}</div>
    <div className="w-10 h-10 rounded-full overflow-hidden">
      <img src={image} alt={name} className="w-full h-full" />
    </div>
    <div className="flex-1">
      <div className="font-medium">{name}</div>
      <div className="text-sm text-gray-600">{xp.toLocaleString()} XP</div>
    </div>
  </div>
);

export default Leaderboard;

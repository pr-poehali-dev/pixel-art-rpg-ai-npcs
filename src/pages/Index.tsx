import { useState, useEffect } from 'react';
import GameWorld from '../components/GameWorld';
import Inventory from '../components/Inventory';
import DialogSystem from '../components/DialogSystem';
import TimeDisplay from '../components/TimeDisplay';

const Index = () => {
  const [gameTime, setGameTime] = useState(480);
  const [inventory, setInventory] = useState({
    quickSlots: [null, null, null, null],
    backpack: [],
    maxWeight: 50,
    currentWeight: 0
  });
  const [selectedNPC, setSelectedNPC] = useState(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 400, y: 300 });

  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(prev => (prev + 1) % 1440);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #1a1f2c 0%, #0a0e1a 100%)',
      fontFamily: '"Press Start 2P", cursive'
    }}>
      <TimeDisplay gameTime={gameTime} />
      <GameWorld 
        gameTime={gameTime}
        playerPosition={playerPosition}
        setPlayerPosition={setPlayerPosition}
        onNPCInteract={setSelectedNPC}
      />
      <Inventory 
        inventory={inventory}
        setInventory={setInventory}
      />
      {selectedNPC && (
        <DialogSystem 
          npc={selectedNPC}
          onClose={() => setSelectedNPC(null)}
          playerPosition={playerPosition}
        />
      )}
    </div>
  );
};

export default Index;

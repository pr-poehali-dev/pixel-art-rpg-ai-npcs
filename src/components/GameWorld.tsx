import { useEffect, useRef, useState } from 'react';
import { Building, NPC, Player } from '../types/game';

interface GameWorldProps {
  gameTime: number;
  playerPosition: { x: number; y: number };
  setPlayerPosition: (pos: { x: number; y: number }) => void;
  onNPCInteract: (npc: NPC) => void;
}

const GameWorld = ({ gameTime, playerPosition, setPlayerPosition, onNPCInteract }: GameWorldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [buildings] = useState<Building[]>([
    { id: 1, x: 100, y: 100, width: 80, height: 100, type: 'house', floors: 2, color: '#4a5568' },
    { id: 2, x: 250, y: 100, width: 100, height: 100, type: 'shop', floors: 1, color: '#9b87f5' },
    { id: 3, x: 420, y: 100, width: 80, height: 120, type: 'house', floors: 3, color: '#6366f1' },
    { id: 4, x: 100, y: 280, width: 90, height: 90, type: 'factory', floors: 1, color: '#f97316' },
    { id: 5, x: 250, y: 280, width: 100, height: 80, type: 'house', floors: 2, color: '#8b5cf6' },
  ]);

  const [npcs, setNpcs] = useState<NPC[]>([
    {
      id: 1,
      name: 'Алекс',
      x: 150,
      y: 250,
      color: '#ea384c',
      personality: 'friendly',
      memory: [],
      relationshipToPlayer: 0,
      currentAction: 'walking'
    },
    {
      id: 2,
      name: 'Мария',
      x: 300,
      y: 200,
      color: '#0ea5e9',
      personality: 'merchant',
      memory: [],
      relationshipToPlayer: 0,
      currentAction: 'standing'
    },
    {
      id: 3,
      name: 'Виктор',
      x: 450,
      y: 300,
      color: '#22c55e',
      personality: 'suspicious',
      memory: [],
      relationshipToPlayer: 0,
      currentAction: 'walking'
    }
  ]);

  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      keys.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      const speed = 2;
      let newX = playerPosition.x;
      let newY = playerPosition.y;

      if (keys.current['ArrowUp'] || keys.current['KeyW']) newY -= speed;
      if (keys.current['ArrowDown'] || keys.current['KeyS']) newY += speed;
      if (keys.current['ArrowLeft'] || keys.current['KeyA']) newX -= speed;
      if (keys.current['ArrowRight'] || keys.current['KeyD']) newX += speed;

      newX = Math.max(20, Math.min(canvas.width - 20, newX));
      newY = Math.max(20, Math.min(canvas.height - 20, newY));

      setPlayerPosition({ x: newX, y: newY });

      ctx.imageSmoothingEnabled = false;
      
      const isDaytime = gameTime >= 360 && gameTime < 840;
      const skyColor = isDaytime 
        ? `hsl(200, 50%, ${50 + Math.sin((gameTime - 360) / 480 * Math.PI) * 20}%)`
        : `hsl(220, 40%, ${10 + Math.sin(gameTime / 1440 * Math.PI) * 5}%)`;
      
      ctx.fillStyle = skyColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#2d3748';
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

      buildings.forEach(building => {
        const wallThickness = 3;
        const floorHeight = building.height / building.floors;
        
        for (let floor = 0; floor < building.floors; floor++) {
          const floorY = building.y + floor * floorHeight;
          
          ctx.fillStyle = '#3a3f4a';
          ctx.fillRect(building.x, floorY, building.width, floorHeight);
          
          ctx.strokeStyle = '#6b7280';
          ctx.lineWidth = wallThickness;
          ctx.strokeRect(building.x, floorY, building.width, floorHeight);
          
          if (floor === building.floors - 1) {
            ctx.fillStyle = '#525863';
            ctx.fillRect(building.x + wallThickness, floorY + wallThickness, building.width - wallThickness * 2, wallThickness);
          }
          
          if (floor < building.floors - 1) {
            ctx.fillStyle = '#525863';
            ctx.fillRect(building.x + wallThickness, floorY + floorHeight - wallThickness, building.width - wallThickness * 2, wallThickness);
            
            const stairX = building.x + building.width - 16;
            const stairY = floorY + floorHeight / 2 - 8;
            const stepCount = 4;
            const stepWidth = 12;
            const stepHeight = 4;
            
            for (let i = 0; i < stepCount; i++) {
              ctx.fillStyle = '#8b7355';
              ctx.fillRect(stairX - i * 2, stairY + i * stepHeight, stepWidth, stepHeight);
              ctx.strokeStyle = '#6b5940';
              ctx.lineWidth = 1;
              ctx.strokeRect(stairX - i * 2, stairY + i * stepHeight, stepWidth, stepHeight);
            }
          }
        }
        
        const doorWidth = 14;
        const doorHeight = 20;
        const doorX = building.x + building.width / 2 - doorWidth / 2;
        const doorY = building.y + building.height - doorHeight - wallThickness;
        
        ctx.fillStyle = '#2d1810';
        ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
        ctx.strokeStyle = '#1a0f08';
        ctx.lineWidth = 2;
        ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);
        
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(doorX + doorWidth - 3, doorY + doorHeight / 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#1a0f08';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(doorX + doorWidth / 2, doorY);
        ctx.lineTo(doorX + doorWidth / 2, doorY + doorHeight);
        ctx.stroke();
      });

      npcs.forEach(npc => {
        if (npc.currentAction === 'walking') {
          npc.x += Math.sin(Date.now() / 1000 + npc.id) * 0.5;
          npc.y += Math.cos(Date.now() / 1000 + npc.id) * 0.3;
          npc.x = Math.max(20, Math.min(canvas.width - 20, npc.x));
          npc.y = Math.max(20, Math.min(canvas.height - 70, npc.y));
        }

        ctx.fillStyle = npc.color;
        ctx.fillRect(npc.x - 6, npc.y - 12, 12, 16);
        
        ctx.fillStyle = '#ffd8be';
        ctx.fillRect(npc.x - 5, npc.y - 18, 10, 8);

        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(npc.name, npc.x, npc.y - 22);

        const distance = Math.sqrt(
          Math.pow(playerPosition.x - npc.x, 2) + 
          Math.pow(playerPosition.y - npc.y, 2)
        );
        
        if (distance < 30) {
          ctx.strokeStyle = '#9b87f5';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(npc.x, npc.y, 20, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      ctx.fillStyle = '#22c55e';
      ctx.fillRect(playerPosition.x - 6, playerPosition.y - 12, 12, 16);
      
      ctx.fillStyle = '#ffd8be';
      ctx.fillRect(playerPosition.x - 5, playerPosition.y - 18, 10, 8);

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(playerPosition.x, playerPosition.y, 15, 0, Math.PI * 2);
      ctx.stroke();
    };

    const interval = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(interval);
  }, [gameTime, playerPosition, buildings, npcs, setPlayerPosition]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    npcs.forEach(npc => {
      const distance = Math.sqrt(
        Math.pow(clickX - npc.x, 2) + 
        Math.pow(clickY - npc.y, 2)
      );
      
      if (distance < 30) {
        onNPCInteract(npc);
      }
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={650}
      onClick={handleCanvasClick}
      tabIndex={0}
      className="pixel-border"
      style={{
        position: 'absolute',
        top: '58%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '4px solid #9b87f5',
        boxShadow: '0 0 20px rgba(155, 135, 245, 0.5)',
        cursor: 'crosshair',
        outline: 'none'
      }}
    />
  );
};

export default GameWorld;
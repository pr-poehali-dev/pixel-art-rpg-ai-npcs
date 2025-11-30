export interface Building {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'house' | 'shop' | 'factory';
  floors: number;
  color: string;
}

export interface NPC {
  id: number;
  name: string;
  x: number;
  y: number;
  color: string;
  personality: string;
  memory: Array<{ action: string; content: string; timestamp: number }>;
  relationshipToPlayer: number;
  currentAction: string;
}

export interface Player {
  x: number;
  y: number;
  inventory: Item[];
  money: number;
}

export interface Item {
  id: number;
  name: string;
  weight: number;
  size: string;
  icon: string;
}

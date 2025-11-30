import { useState, useEffect } from 'react';
import Icon from './ui/icon';
import { NPC } from '../types/game';

interface DialogSystemProps {
  npc: NPC;
  onClose: () => void;
  playerPosition: { x: number; y: number };
}

const DialogSystem = ({ npc, onClose, playerPosition }: DialogSystemProps) => {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [input, setInput] = useState('');
  const [npcMood, setNpcMood] = useState(npc.relationshipToPlayer || 0);

  useEffect(() => {
    const preventGameKeys = (e: KeyboardEvent) => {
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.stopPropagation();
      }
    };
    
    window.addEventListener('keydown', preventGameKeys, true);
    return () => window.removeEventListener('keydown', preventGameKeys, true);
  }, []);

  useEffect(() => {
    const greetings = {
      friendly: 'Привет! Как дела?',
      merchant: 'Здравствуй, хочешь что-то купить?',
      suspicious: 'Что тебе нужно?',
      default: 'Привет.'
    };
    
    const greeting = greetings[npc.personality as keyof typeof greetings] || greetings.default;
    setMessages([{ sender: npc.name, text: greeting }]);
  }, [npc]);

  const generateResponse = (playerMessage: string) => {
    const lowerMessage = playerMessage.toLowerCase();
    
    if (lowerMessage.includes('привет') || lowerMessage.includes('здравств')) {
      setNpcMood(prev => prev + 5);
      return 'Приятно видеть!';
    }
    
    if (lowerMessage.includes('работ') || lowerMessage.includes('подработ')) {
      if (npc.personality === 'merchant') {
        return 'У меня есть работа на складе. Заплачу 50 монет за час.';
      }
      return 'Попробуй спросить у Марии в магазине.';
    }
    
    if (lowerMessage.includes('купи') || lowerMessage.includes('прода')) {
      if (npc.personality === 'merchant') {
        return 'У меня есть хлеб (10₽), вода (5₽) и инструменты (50₽).';
      }
      return 'Я ничего не продаю. Иди к Марии.';
    }
    
    if (lowerMessage.includes('помощ') || lowerMessage.includes('помог')) {
      setNpcMood(prev => prev - 3);
      if (npcMood > 20) {
        return 'Хорошо, но ты должен мне услугу!';
      }
      return 'Не знаю, можно ли тебе доверять...';
    }

    if (lowerMessage.includes('где') || lowerMessage.includes('как найти')) {
      return 'Я видел кое-что интересное на восточной улице.';
    }

    const neutralResponses = [
      'Интересно...',
      'Понятно.',
      'Может быть.',
      'Я подумаю об этом.',
      'Посмотрим.'
    ];
    
    return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: 'Игрок', text: input }]);
    
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages(prev => [...prev, { sender: npc.name, text: response }]);
      npc.memory.push({ action: 'dialog', content: input, timestamp: Date.now() });
    }, 500);

    setInput('');
  };

  const getMoodColor = () => {
    if (npcMood >= 30) return '#22c55e';
    if (npcMood >= 0) return '#0ea5e9';
    if (npcMood >= -20) return '#f97316';
    return '#ea384c';
  };

  const getMoodText = () => {
    if (npcMood >= 30) return 'Друг';
    if (npcMood >= 0) return 'Нейтрально';
    if (npcMood >= -20) return 'Настороженно';
    return 'Враждебно';
  };

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: 20,
      transform: 'translateY(-50%)',
      width: 350,
      height: 450,
      background: 'rgba(26, 31, 44, 0.98)',
      border: '3px solid #9b87f5',
      borderRadius: 12,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(155, 135, 245, 0.6)',
      color: '#fff'
    }}
    className="animate-scale-in">
      <div style={{
        padding: 15,
        borderBottom: '2px solid #4a5568',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ fontSize: 12, color: '#9b87f5', marginBottom: 5 }}>{npc.name}</h3>
          <div style={{ 
            fontSize: 8, 
            color: getMoodColor(),
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}>
            <Icon name="Heart" size={12} />
            {getMoodText()} ({npcMood})
          </div>
        </div>
        <Icon 
          name="X" 
          size={20} 
          onClick={onClose}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div style={{
        flex: 1,
        padding: 15,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === 'Игрок' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: 10,
              background: msg.sender === 'Игрок' ? '#9b87f5' : '#2d3748',
              borderRadius: 8,
              fontSize: 9,
              wordWrap: 'break-word'
            }}
            className="animate-fade-in"
          >
            <div style={{ fontWeight: 'bold', marginBottom: 3, opacity: 0.8 }}>
              {msg.sender}
            </div>
            {msg.text}
          </div>
        ))}
      </div>

      <div style={{
        padding: 15,
        borderTop: '2px solid #4a5568',
        display: 'flex',
        gap: 10
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Написать сообщение..."
          style={{
            flex: 1,
            padding: 10,
            background: '#1a1f2c',
            border: '2px solid #4a5568',
            borderRadius: 6,
            color: '#fff',
            fontSize: 9,
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '10px 15px',
            background: '#9b87f5',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="hover:scale-105"
        >
          <Icon name="Send" size={16} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default DialogSystem;
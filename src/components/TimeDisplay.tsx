import Icon from './ui/icon';

interface TimeDisplayProps {
  gameTime: number;
}

const TimeDisplay = ({ gameTime }: TimeDisplayProps) => {
  const hours = Math.floor(gameTime / 60);
  const minutes = gameTime % 60;
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  const isDaytime = hours >= 6 && hours < 20;
  const period = isDaytime ? 'День' : 'Ночь';
  
  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      padding: 15,
      background: 'rgba(26, 31, 44, 0.95)',
      border: '3px solid #9b87f5',
      borderRadius: 12,
      color: '#fff',
      minWidth: 180,
      boxShadow: '0 4px 20px rgba(155, 135, 245, 0.4)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 10,
        marginBottom: 10
      }}>
        <Icon name={isDaytime ? 'Sun' : 'Moon'} size={24} color={isDaytime ? '#fbbf24' : '#9b87f5'} />
        <div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#9b87f5' }}>
            {timeString}
          </div>
          <div style={{ fontSize: 8, opacity: 0.7 }}>
            {period}
          </div>
        </div>
      </div>
      
      <div style={{
        fontSize: 8,
        padding: 8,
        background: '#1a1f2c',
        borderRadius: 6,
        marginTop: 10
      }}>
        <div style={{ marginBottom: 5, opacity: 0.8 }}>Управление:</div>
        <div style={{ opacity: 0.6, lineHeight: 1.6 }}>
          WASD - движение<br />
          Клик по NPC - диалог<br />
          1-4 - быстрые слоты
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;

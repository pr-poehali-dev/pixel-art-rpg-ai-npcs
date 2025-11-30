import { useState } from 'react';
import Icon from './ui/icon';

interface InventoryProps {
  inventory: {
    quickSlots: any[];
    backpack: any[];
    maxWeight: number;
    currentWeight: number;
  };
  setInventory: (inventory: any) => void;
}

const Inventory = ({ inventory, setInventory }: InventoryProps) => {
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);

  const sampleItems = [
    { id: 1, name: 'Телефон', weight: 0.2, size: 'small', icon: 'Smartphone' },
    { id: 2, name: 'Бумажник', weight: 0.1, size: 'small', icon: 'Wallet' },
    { id: 3, name: 'Ключи', weight: 0.05, size: 'small', icon: 'Key' },
    { id: 4, name: 'Хлеб', weight: 0.5, size: 'medium', icon: 'Beef' },
  ];

  return (
    <>
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 10,
        padding: 12,
        background: 'rgba(26, 31, 44, 0.95)',
        border: '3px solid #9b87f5',
        borderRadius: 8,
        boxShadow: '0 4px 20px rgba(155, 135, 245, 0.4)'
      }}>
        {inventory.quickSlots.map((item, index) => (
          <div
            key={index}
            style={{
              width: 50,
              height: 50,
              background: item ? '#9b87f5' : '#2d3748',
              border: '2px solid #4a5568',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 10,
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            className="hover:scale-105"
          >
            {item ? (
              <Icon name={item.icon} size={24} />
            ) : (
              <span style={{ opacity: 0.3 }}>{index + 1}</span>
            )}
          </div>
        ))}
        
        <div
          onClick={() => setIsBackpackOpen(!isBackpackOpen)}
          style={{
            width: 50,
            height: 50,
            background: '#f97316',
            border: '2px solid #ea580c',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginLeft: 10
          }}
          className="hover:scale-105"
        >
          <Icon name="Backpack" size={24} color="#fff" />
        </div>
      </div>

      {isBackpackOpen && (
        <div style={{
          position: 'absolute',
          top: '50%',
          right: 20,
          transform: 'translateY(-50%)',
          width: 300,
          maxHeight: 500,
          background: 'rgba(26, 31, 44, 0.98)',
          border: '3px solid #9b87f5',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 8px 32px rgba(155, 135, 245, 0.6)',
          color: '#fff'
        }}
        className="animate-slide-in-right">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3 style={{ fontSize: 12, color: '#9b87f5' }}>РЮКЗАК</h3>
            <Icon 
              name="X" 
              size={20} 
              onClick={() => setIsBackpackOpen(false)}
              style={{ cursor: 'pointer' }}
            />
          </div>

          <div style={{
            marginBottom: 15,
            padding: 10,
            background: '#1a1f2c',
            borderRadius: 6,
            fontSize: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span>Вес:</span>
              <span style={{ color: inventory.currentWeight > inventory.maxWeight * 0.8 ? '#ea384c' : '#22c55e' }}>
                {inventory.currentWeight.toFixed(1)} / {inventory.maxWeight} кг
              </span>
            </div>
            <div style={{
              width: '100%',
              height: 8,
              background: '#2d3748',
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(inventory.currentWeight / inventory.maxWeight) * 100}%`,
                height: '100%',
                background: inventory.currentWeight > inventory.maxWeight * 0.8 
                  ? 'linear-gradient(90deg, #ea384c, #f97316)'
                  : 'linear-gradient(90deg, #22c55e, #0ea5e9)',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            maxHeight: 300,
            overflowY: 'auto'
          }}>
            {inventory.backpack.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: 30, 
                opacity: 0.5,
                fontSize: 10
              }}>
                Рюкзак пуст
              </div>
            ) : (
              inventory.backpack.map((item: any, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: 12,
                    background: '#2d3748',
                    border: '2px solid #4a5568',
                    borderRadius: 6,
                    fontSize: 9,
                    cursor: 'pointer'
                  }}
                  className="hover:scale-105"
                >
                  <Icon name={item.icon} size={20} style={{ marginBottom: 5 }} />
                  <div style={{ fontWeight: 'bold', marginBottom: 3 }}>{item.name}</div>
                  <div style={{ opacity: 0.7 }}>{item.weight} кг</div>
                </div>
              ))
            )}
          </div>

          <div style={{ 
            marginTop: 15, 
            paddingTop: 15, 
            borderTop: '1px solid #4a5568',
            fontSize: 8,
            opacity: 0.6
          }}>
            Подсказка: используйте цифры 1-4 для быстрого доступа
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory;

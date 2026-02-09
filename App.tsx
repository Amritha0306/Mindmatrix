
import React, { useState, useEffect, useRef } from 'react';
import { Medication, ViewState } from './types';
import Dashboard from './components/Dashboard';
import MedicationForm from './components/MedicationForm';
import MedicationDetail from './components/MedicationDetail';
import Header from './components/Header';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // Track notified slots for the current day to avoid duplicate alerts
  const notifiedTodayRef = useRef<Set<string>>(new Set());

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('medsense_meds');
    if (saved) {
      try {
        setMedications(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load medications", e);
      }
    }
    
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('medsense_meds', JSON.stringify(medications));
  }, [medications]);

  // Reminder Logic Loop
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const todayKey = now.toDateString();

      medications.forEach(med => {
        med.times.forEach(time => {
          const alertKey = `${todayKey}-${med.id}-${time}`;
          
          if (time === currentTime && !notifiedTodayRef.current.has(alertKey)) {
            triggerAlarm(med, time);
            notifiedTodayRef.current.add(alertKey);
          }
        });
      });

      // Clear the set at midnight to reset for the next day
      if (currentTime === "00:00") {
        notifiedTodayRef.current.clear();
      }
    };

    const interval = setInterval(checkSchedule, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [medications, notificationsEnabled]);

  const triggerAlarm = (med: Medication, time: string) => {
    if (Notification.permission === 'granted') {
      new Notification(`Time for ${med.name}!`, {
        body: `Dosage: ${med.dosage}. Take now for your health.`,
        icon: 'https://cdn-icons-png.flaticon.com/512/822/822143.png'
      });
    } else {
      alert(`⏰ REMINDER: It's ${time}. Time to take ${med.dosage} of ${med.name}.`);
    }
    
    // Play a gentle beep
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log("Audio alert blocked by browser policy");
    }
  };

  const handleRequestNotifications = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
    }
  };

  const handleAddMedication = (newMeds: Omit<Medication, 'id' | 'createdAt'>[]) => {
    const medsWithIds = newMeds.map(m => ({
      ...m,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }));
    setMedications(prev => [...prev, ...medsWithIds]);
    setView('dashboard');
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    setSelectedMedId(null);
    setView('dashboard');
  };

  const handleToggleTaken = (id: string) => {
    setMedications(prev => prev.map(m => 
      m.id === id ? { ...m, lastTaken: new Date().toISOString() } : m
    ));
  };

  const currentMed = medications.find(m => m.id === selectedMedId);

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-xl relative overflow-hidden">
      <Header 
        setView={setView} 
        currentView={view} 
        notificationsEnabled={notificationsEnabled}
        onRequestNotifications={handleRequestNotifications}
      />
      
      <main className="flex-1 overflow-y-auto pb-24">
        {view === 'dashboard' && (
          <Dashboard 
            medications={medications} 
            onSelectMed={(id) => { setSelectedMedId(id); setView('detail'); }}
            onToggleTaken={handleToggleTaken}
          />
        )}
        
        {view === 'add' && (
          <MedicationForm 
            onSave={handleAddMedication} 
            onCancel={() => setView('dashboard')} 
          />
        )}
        
        {view === 'detail' && currentMed && (
          <MedicationDetail 
            medication={currentMed} 
            onDelete={handleDeleteMedication}
            onBack={() => setView('dashboard')}
          />
        )}
      </main>

      {view !== 'add' && (
        <button 
          onClick={() => setView('add')}
          className="fixed bottom-6 right-6 md:right-[calc(50%-180px)] w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-transform active:scale-95 z-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;

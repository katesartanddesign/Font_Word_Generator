import React, { useState } from 'react';
import { Shuffle, RefreshCw, Play, Pause, RotateCcw, Clock } from 'lucide-react';

function App() {
  const wordCategories = {
    style: [
      'elegant', 'bold', 'playful', 'geometric', 'organic', 'mechanical', 
      'handwritten', 'minimalist', 'ornate', 'futuristic', 'vintage', 'modern', 
      'rustic', 'sleek', 'whimsical', 'textured', 'decorative', 'brutalist', 
      'utilitarian', 'expressive', 'structured', 'artistic', 'technical', 
      'experimental', 'traditional', 'eclectic', 'refined', 'raw'
    ],
    mood: [
      'cheerful', 'serious', 'mysterious', 'energetic', 'calm', 'dramatic', 
      'friendly', 'professional', 'rebellious', 'sophisticated', 'quirky', 
      'luxurious', 'casual', 'melancholic', 'optimistic', 'aggressive', 
      'authoritative', 'intimate', 'nostalgic', 'romantic', 'confident', 
      'subtle', 'bold', 'warm', 'cool', 'intense', 'gentle'
    ],
    texture: [
      'smooth', 'rough', 'sharp', 'rounded', 'angular', 'flowing', 'stiff', 
      'loose', 'tight', 'delicate', 'heavy', 'light', 'textured', 'clean', 
      'crisp', 'soft', 'jagged', 'polished', 'raw', 'refined', 'dynamic', 
      'static', 'fluid', 'rigid', 'organic', 'precise', 'handcrafted', 
      'digital', 'layered', 'flat'
    ],
    era: [
      'retro', 'contemporary', 'ancient', 'medieval', 'industrial', 'art-deco', 
      'victorian', 'western', 'gothic', 'cosmic', 'prehistoric', 'renaissance', 
      'modernist', 'postmodern', 'cyberpunk', 'steampunk', 'space-age', 'atomic', 
      'art-nouveau', 'baroque', 'minimalist', 'maximalist', 'mid-century', 
      'brutalist', 'classical', 'avant-garde'
    ],
    physical: [
      'narrow', 'wide', 'tall', 'compact', 'extended', 'condensed', 'monospaced', 
      'proportional', 'slanted', 'upright', 'weighted', 'airy', 'dense', 'open', 
      'closed', 'expanded', 'compressed', 'balanced', 'asymmetric', 'uniform', 
      'variable', 'contrast', 'low-contrast', 'high-contrast'
    ]
  };

  const [currentWords, setCurrentWords] = useState([]);
  const [history, setHistory] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [timerDuration, setTimerDuration] = useState(300);

  // Timer effect
  React.useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  const startTimer = () => {
    setTimeRemaining(timerDuration);
    setTimerActive(true);
  };

  const stopTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    setTimeRemaining(timerDuration);
    setTimerActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const areWordsCompatible = (word1, word2) => {
    const conflicts = {
      'narrow': ['wide', 'extended', 'expanded'],
      'wide': ['narrow', 'condensed', 'compact', 'compressed'],
      'tall': ['compact'],
      'compact': ['extended', 'tall'],
      'extended': ['compact', 'condensed', 'narrow'],
      'condensed': ['wide', 'extended'],
      'sharp': ['rounded', 'smooth', 'flowing'],
      'rounded': ['sharp', 'angular'],
      'angular': ['rounded', 'flowing', 'smooth'],
      'smooth': ['rough', 'sharp', 'angular'],
      'rough': ['smooth', 'sleek', 'clean'],
      'flowing': ['stiff', 'sharp', 'angular'],
      'stiff': ['flowing', 'loose', 'organic', 'fluid'],
      'loose': ['tight', 'stiff', 'rigid', 'precise'],
      'tight': ['loose', 'open', 'airy'],
      'heavy': ['light', 'delicate', 'airy'],
      'light': ['heavy', 'bold', 'dense'],
      'bold': ['light', 'delicate', 'minimalist', 'subtle'],
      'delicate': ['heavy', 'bold', 'rough', 'aggressive'],
      'minimalist': ['ornate', 'bold', 'decorative', 'maximalist'],
      'ornate': ['minimalist', 'clean', 'sleek', 'simple'],
      'sleek': ['rough', 'ornate', 'rustic', 'textured'],
      'modern': ['vintage', 'ancient', 'medieval', 'victorian', 'classical'],
      'vintage': ['modern', 'futuristic', 'contemporary', 'avant-garde'],
      'futuristic': ['vintage', 'ancient', 'retro', 'classical'],
      'ancient': ['modern', 'futuristic', 'contemporary', 'space-age'],
      'dense': ['airy', 'open', 'light', 'spacious'],
      'airy': ['dense', 'heavy', 'compressed', 'tight'],
      'open': ['closed', 'tight', 'compressed'],
      'closed': ['open', 'airy', 'expanded']
    };

    const word1Lower = word1.toLowerCase();
    const word2Lower = word2.toLowerCase();

    if (conflicts[word1Lower]?.includes(word2Lower)) return false;
    if (conflicts[word2Lower]?.includes(word1Lower)) return false;

    return true;
  };

  const generateWords = () => {
    const categories = Object.keys(wordCategories);
    let attempts = 0;
    let selectedWords = [];
    
    const maxAttempts = difficulty === 'easy' ? 200 : difficulty === 'medium' ? 100 : 50;

    while (selectedWords.length < 3 && attempts < maxAttempts) {
      attempts++;
      selectedWords = [];
      const usedCategories = new Set();

      while (selectedWords.length < 3) {
        const availableCategories = categories.filter(c => !usedCategories.has(c));
        if (availableCategories.length === 0) break;

        const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        const words = wordCategories[category];
        const word = words[Math.floor(Math.random() * words.length)];

        let isCompatible;
        if (difficulty === 'easy') {
          isCompatible = selectedWords.every(w => areWordsCompatible(w, word));
        } else if (difficulty === 'medium') {
          isCompatible = selectedWords.every(w => areWordsCompatible(w, word));
        } else {
          const otherWords = selectedWords;
          isCompatible = otherWords.every(w => {
            const w1Lower = w.toLowerCase();
            const w2Lower = word.toLowerCase();
            const hardConflicts = {
              'narrow': ['wide'],
              'wide': ['narrow'],
              'smooth': ['rough'],
              'rough': ['smooth'],
              'heavy': ['light'],
              'light': ['heavy'],
              'open': ['closed'],
              'closed': ['open'],
              'dense': ['airy'],
              'airy': ['dense']
            };
            if (hardConflicts[w1Lower]?.includes(w2Lower)) return false;
            if (hardConflicts[w2Lower]?.includes(w1Lower)) return false;
            return true;
          });
        }

        if (isCompatible) {
          selectedWords.push(word);
          usedCategories.add(category);
        }
      }

      if (selectedWords.length === 3) break;
    }

    setCurrentWords(selectedWords);
    setHistory(prev => [selectedWords, ...prev].slice(0, 10));
  };

  const regenerateWord = (index) => {
    const newWords = [...currentWords];
    const categories = Object.keys(wordCategories);
    let attempts = 0;

    while (attempts < 50) {
      attempts++;
      const category = categories[Math.floor(Math.random() * categories.length)];
      const words = wordCategories[category];
      const newWord = words[Math.floor(Math.random() * words.length)];

      const otherWords = newWords.filter((_, i) => i !== index);
      const isCompatible = otherWords.every(w => areWordsCompatible(w, newWord));

      if (isCompatible && !newWords.includes(newWord)) {
        newWords[index] = newWord;
        break;
      }
    }

    setCurrentWords(newWords);
    setHistory(prev => [newWords, ...prev].slice(0, 10));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Font Word Generator</h1>
          <p className="text-gray-600">Get three compatible descriptive words for your font design challenge</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-6 pb-6 border-b">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map(level => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      difficulty === level
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {difficulty === 'easy' && 'Very compatible words'}
                {difficulty === 'medium' && 'Balanced challenge'}
                {difficulty === 'hard' && 'Push your creativity!'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Timer</label>
              <div className="flex gap-2 items-center">
                <select
                  value={timerDuration}
                  onChange={(e) => {
                    setTimerDuration(Number(e.target.value));
                    setTimeRemaining(Number(e.target.value));
                  }}
                  disabled={timerActive}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value={180}>3 min</option>
                  <option value={300}>5 min</option>
                  <option value={600}>10 min</option>
                  <option value={900}>15 min</option>
                  <option value={1200}>20 min</option>
                </select>
                
                <div className="flex gap-1">
                  {!timerActive ? (
                    <button
                      onClick={startTimer}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      title="Start timer"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={stopTimer}
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                      title="Pause timer"
                    >
                      <Pause className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    title="Reset timer"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className={`mt-2 text-center font-mono text-2xl font-bold ${
                timeRemaining <= 60 && timerActive ? 'text-red-600 animate-pulse' : 'text-gray-700'
              }`}>
                <Clock className="w-5 h-5 inline mr-1" />
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            {currentWords.length > 0 ? (
              <>
                <div className="flex gap-4 flex-wrap justify-center">
                  {currentWords.map((word, index) => (
                    <div key={index} className="relative group">
                      <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white px-8 py-6 rounded-xl text-2xl font-bold shadow-lg min-w-[180px] text-center">
                        {word}
                      </div>
                      <button
                        onClick={() => regenerateWord(index)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                        title="Regenerate this word"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={generateWords}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Shuffle className="w-5 h-5" />
                  Generate New Set
                </button>
              </>
            ) : (
              <button
                onClick={generateWords}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-6 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-3"
              >
                <Shuffle className="w-6 h-6" />
                Generate Words
              </button>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Combinations</h2>
            <div className="space-y-3">
              {history.map((words, index) => (
                <div key={index} className="flex gap-3 text-gray-700 items-center">
                  <span className="text-gray-400 font-mono text-sm w-6">{index + 1}.</span>
                  <div className="flex gap-2 flex-wrap">
                    {words.map((word, i) => (
                      <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Words are automatically filtered based on difficulty level</p>
          <p className="mt-1">Hover over any word to regenerate just that one!</p>
          <p className="mt-1">Use the timer for timed challenges!</p>
        </div>
      </div>
    </div>
  );
}

export default App;
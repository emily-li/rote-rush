import './RainyBackground.css';

// Use "シト" (shito) for rain - onomatopoeia for light drizzle
const rainChar = 'シト';

const RainyBackground = () => {
  const drops = Array.from({ length: 30 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    };
    const streakLength = Math.floor(Math.random() * 5) + 1; // 1 to 5 characters
    const streakChars = Array.from({ length: streakLength }).map(
      () => rainChar,
    );

    return (
      <div key={i} className="raindrop" style={style}>
        {streakChars.map((char, index) => (
          <div key={index} className="rain-char">
            {char}
          </div>
        ))}
      </div>
    );
  });

  return <div className="rainy-background">{drops}</div>;
};

export default RainyBackground;

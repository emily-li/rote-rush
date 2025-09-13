import './RainyBackground.css';

const RainyBackground = () => {
  const drops = Array.from({ length: 100 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${0.5 + Math.random() * 0.5}s`,
    };
    return <div key={i} className="raindrop" style={style}></div>;
  });

  return <div className="rainy-background">{drops}</div>;
};

export default RainyBackground;

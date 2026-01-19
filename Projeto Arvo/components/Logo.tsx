
import React, { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  type?: 'symbol' | 'full' | 'horizontal';
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", type = 'symbol', size = 40 }) => {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState('./logo_arvo.png');

  // Tenta caminhos alternativos caso o primeiro falhe (comum em diferentes servidores)
  const handleError = () => {
    if (imgSrc === './logo_arvo.png') {
      setImgSrc('/logo_arvo.png'); // Tenta na raiz absoluta
    } else {
      setHasError(true);
    }
  };

  const LogoImage = () => (
    <img 
      src={imgSrc} 
      alt="Arvo Logo"
      style={{ 
        width: size, 
        height: size, 
        objectFit: 'contain',
        minWidth: size,
        minHeight: size
      }}
      className={`transition-all duration-500 hover:brightness-110 ${className}`}
      onError={handleError}
    />
  );

  const Fallback = () => (
    <div 
      style={{ width: size, height: size }} 
      className={`bg-gradient-to-br from-[#71c4be] to-[#0A1E32] rounded-xl flex items-center justify-center shadow-inner ${className}`}
    >
      <i className="fas fa-leaf text-white" style={{ fontSize: size * 0.45 }}></i>
    </div>
  );

  const renderLogo = () => (hasError ? <Fallback /> : <LogoImage />);

  if (type === 'symbol') {
    return <div className="inline-flex items-center justify-center">{renderLogo()}</div>;
  }

  if (type === 'full') {
    return (
      <div className={`flex flex-col items-center text-center space-y-4 ${className}`}>
        <div className="p-3 bg-white/5 rounded-[2rem] backdrop-blur-sm border border-white/10 shadow-2xl">
           {renderLogo()}
        </div>
        <div>
          <h1 
            className="font-extrabold tracking-tighter leading-none" 
            style={{ fontSize: size * 0.9, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Arvo
          </h1>
          <p 
            className="font-black uppercase tracking-[0.3em] mt-2" 
            style={{ fontSize: size * 0.12, color: "#C4953D" }}
          >
            Wealth Intelligence
          </p>
        </div>
      </div>
    );
  }

  // Estilo Horizontal (usado na Sidebar/Navbar)
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="p-1.5 bg-white/5 rounded-xl border border-white/5">
        {renderLogo()}
      </div>
      <div className="flex flex-col justify-center">
        <h1 
          className="font-extrabold tracking-tighter leading-none text-white" 
          style={{ fontSize: size * 0.65, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Arvo
        </h1>
        <p 
          className="font-black uppercase tracking-[0.15em] mt-1 opacity-80" 
          style={{ fontSize: size * 0.1, color: "#C4953D" }}
        >
          Mais controle. Mais crescimento.
        </p>
      </div>
    </div>
  );
};

export default Logo;

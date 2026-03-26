import { useState, useEffect, ReactNode } from 'react';
import { 
  Calculator, Book, User, Briefcase, Shield, Zap, Heart, Brain, Star, Move, 
  Users, DollarSign, PenTool, Camera, ScrollText, AlertCircle, Info,
  Backpack, Coins, UserPlus, TrendingUp
} from 'lucide-react';

interface StepCardProps {
  number: string;
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

function StepCard({ number, title, children, className = "", icon }: StepCardProps) {
  return (
    <section className={`investigative-panel p-6 flex flex-col bracket-border ${className}`}>
      <h2 className="terminal-header text-headline-small font-bold flex items-center gap-3 tracking-tight mb-4">
        <span className="emerald-accent font-mono">{number}.</span> 
        <span className="glow-text">{title}</span>
        {icon && <span className="ml-auto emerald-accent opacity-70">{icon}</span>}
      </h2>
      <div className="text-body-medium text-[#80cbc4] leading-relaxed flex-grow space-y-4">
        {children}
      </div>
    </section>
  );
}

export default function App() {
  const [baseVal, setBaseVal] = useState(50);
  const [fue, setFue] = useState(50);
  const [tam, setTam] = useState(50);
  const [db, setDb] = useState('0');
  const [build, setBuild] = useState(0);

  useEffect(() => {
    const suma = fue + tam;
    if (suma <= 64) { setDb('-2'); setBuild(-2); }
    else if (suma <= 84) { setDb('-1'); setBuild(-1); }
    else if (suma <= 124) { setDb('0'); setBuild(0); }
    else if (suma <= 164) { setDb('+1D4'); setBuild(1); }
    else if (suma <= 204) { setDb('+1D6'); setBuild(2); }
    else if (suma <= 284) { setDb('+2D6'); setBuild(3); }
    else if (suma <= 364) { setDb('+3D6'); setBuild(4); }
    else { 
      const extra = Math.floor((suma - 364) / 80) + 1;
      setDb(`+${3 + extra}D6`); 
      setBuild(4 + extra); 
    }
  }, [fue, tam]);

  return (
    <div className="min-h-screen bg-[#050808] text-[#e0f2f1] font-sans p-4 md:p-8 selection:bg-[#00ffcc] selection:text-black relative overflow-hidden">
      {/* Scanline Effect */}
      <div className="scanline"></div>
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[60%] h-[40%] bg-[#00ffcc] opacity-[0.03] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-[#00ffcc] opacity-[0.02] blur-[100px] rounded-full"></div>
      </div>

      <main className="max-w-6xl mx-auto relative space-y-12">
        {/* Main Header */}
        <header className="text-center py-16 investigative-panel rounded-lg border-b-2 border-[#00ffcc]/30 overflow-hidden bracket-border">
          <div className="absolute top-4 right-4 font-mono text-[10px] text-[#00ffcc]/40 uppercase tracking-widest hidden md:block">
            System Status: Active // Terminal: Miskatonic-1924-B
          </div>
          <div className="absolute top-12 left-12 text-[#00ffcc]/5 rotate-[-15deg] hidden lg:block">
            <ScrollText size={180} />
          </div>
          <h1 className="text-display-medium md:text-display-large font-bold text-[#e0f2f1] uppercase tracking-tighter mb-4 leading-none glow-text">
            Guía de Creación <br />
            <span className="text-headline-large md:text-display-small text-[#00ffcc]">de Investigadores</span>
          </h1>
          <p className="text-title-medium md:text-title-large italic text-[#80cbc4] max-w-2xl mx-auto font-medium">
            Referencia Rápida para la 7ª Edición de La Llamada de Cthulhu
          </p>
          <div className="mt-8 flex justify-center gap-4 opacity-60">
            <div className="circular-frame p-2 bg-black/40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Miskatonic_University_seal.svg/1200px-Miskatonic_University_seal.svg.png" alt="MU Seal" className="w-16 h-16 grayscale brightness-150 sepia-[0.5] hue-rotate-[120deg]" />
            </div>
          </div>
        </header>

        {/* 11 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. Características */}
          <StepCard number="1" title="Características" icon={<Brain size={24} />}>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#00ffcc]/5 border border-[#00ffcc]/20 rounded-sm">
                <p className="font-bold text-[#00ffcc] uppercase text-[10px] mb-1 tracking-widest">3D6 x 5</p>
                <p className="text-xs text-[#80cbc4] italic">FUE, CON, DES, APA, POD</p>
              </div>
              <div className="p-3 bg-[#00ffcc]/5 border border-[#00ffcc]/20 rounded-sm">
                <p className="font-bold text-[#00ffcc] uppercase text-[10px] mb-1 tracking-widest">2D6+6 x 5</p>
                <p className="text-xs text-[#80cbc4] italic">TAM, INT, EDU</p>
              </div>
            </div>
            <p className="text-xs text-[#80cbc4]/80 italic border-l-2 border-[#00ffcc]/20 pl-3">
              Tira los dados y multiplica por 5 para obtener el valor porcentual.
            </p>
          </StepCard>

          {/* 2. Edad */}
          <StepCard number="2" title="Determina la Edad" icon={<TrendingUp size={24} />}>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#00ffcc]/10 pb-1">
                <span className="font-bold text-[#00ffcc]">15-19</span>
                <span className="text-[#80cbc4]">FUE/TAM -5, EDU -5, Suerte x2</span>
              </div>
              <div className="flex justify-between border-b border-[#00ffcc]/10 pb-1">
                <span className="font-bold text-[#00ffcc]">20-39</span>
                <span className="text-[#80cbc4]">1 tirada mejora EDU</span>
              </div>
              <div className="flex justify-between border-b border-[#00ffcc]/10 pb-1">
                <span className="font-bold text-[#00ffcc]">40-49</span>
                <span className="text-[#80cbc4]">FUE/CON/DES -5, EDU x2</span>
              </div>
              <div className="flex justify-between border-b border-[#00ffcc]/10 pb-1">
                <span className="font-bold text-[#00ffcc]">50-59</span>
                <span className="text-[#80cbc4]">FUE/CON/DES -10, EDU x3</span>
              </div>
              <p className="font-mono text-[10px] mt-2 text-[#00ffcc]/60">
                &gt; Tiradas mejora EDU: 1D100 &gt; EDU? +1D10 EDU.
              </p>
            </div>
          </StepCard>

          {/* 3. Atributos Derivados */}
          <StepCard number="3" title="Atributos Derivados" icon={<Zap size={24} />}>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 border border-[#00ffcc]/10 rounded bg-[#00ffcc]/5">
                <p className="text-[10px] uppercase opacity-60 text-[#80cbc4]">Cordura</p>
                <p className="font-bold text-[#00ffcc]">POD</p>
              </div>
              <div className="p-2 border border-[#00ffcc]/10 rounded bg-[#00ffcc]/5">
                <p className="text-[10px] uppercase opacity-60 text-[#80cbc4]">Vida</p>
                <p className="font-bold text-[#00ffcc]">(TAM+CON)/10</p>
              </div>
              <div className="p-2 border border-[#00ffcc]/10 rounded bg-[#00ffcc]/5">
                <p className="text-[10px] uppercase opacity-60 text-[#80cbc4]">Magia</p>
                <p className="font-bold text-[#00ffcc]">POD/5</p>
              </div>
              <div className="p-2 border border-[#00ffcc]/10 rounded bg-[#00ffcc]/5">
                <p className="text-[10px] uppercase opacity-60 text-[#80cbc4]">Suerte</p>
                <p className="font-bold text-[#00ffcc]">3D6 x 5</p>
              </div>
            </div>
          </StepCard>

          {/* 4. Movimiento */}
          <StepCard number="4" title="Movimiento (MOV)" icon={<Move size={24} />}>
            <div className="space-y-2 text-xs">
              <p className="text-[#80cbc4]">/ DES y FUE &lt; TAM: <span className="font-bold text-[#00ffcc]">MOV 7</span></p>
              <p className="text-[#80cbc4]">/ DES o FUE &ge; TAM: <span className="font-bold text-[#00ffcc]">MOV 8</span></p>
              <p className="text-[#80cbc4]">/ DES y FUE &gt; TAM: <span className="font-bold text-[#00ffcc]">MOV 9</span></p>
              <p className="text-[9px] opacity-40 italic mt-2 text-[#80cbc4]">Modificadores por edad aplican (-1 a los 40+, -2 a los 50+).</p>
            </div>
          </StepCard>

          {/* 5. Ocupación */}
          <StepCard number="5" title="Ocupación" icon={<Briefcase size={24} />}>
            <p className="text-xs text-[#80cbc4]">
              Elige una profesión y calcula tus puntos de habilidad:
            </p>
            <div className="p-3 bg-[#00ffcc]/10 border-l-4 border-[#00ffcc] rounded-r">
              <p className="font-bold text-[#00ffcc] uppercase text-[10px] mb-1 tracking-widest">Puntos de Ocupación</p>
              <p className="text-xs italic text-[#80cbc4]">Varía según EDU y otras características (ej. EDU x 4).</p>
            </div>
            <p className="text-xs text-[#80cbc4]">Define tu límite de <strong className="text-[#00ffcc]">Crédito</strong>.</p>
          </StepCard>

          {/* 6. Interés Particular */}
          <StepCard number="6" title="Interés Particular" icon={<Star size={24} />}>
            <div className="p-4 border border-[#00ffcc]/20 bg-[#00ffcc]/5 rounded text-center">
              <p className="text-[10px] uppercase opacity-60 mb-1 text-[#80cbc4]">Puntos Disponibles</p>
              <p className="text-headline-small font-bold text-[#00ffcc] glow-text">INT x 2</p>
            </div>
            <p className="text-xs italic text-[#80cbc4]">
              Distribuye estos puntos en cualquier habilidad excepto Mitos de Cthulhu.
            </p>
          </StepCard>

          {/* 7. Valores de Combate */}
          <StepCard number="7" title="Valores de Combate" className="lg:col-span-2" icon={<Shield size={24} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-[#00ffcc]/60 tracking-widest">Fuerza (FUE)</label>
                    <input 
                      type="number" 
                      value={fue} 
                      onChange={(e) => setFue(parseInt(e.target.value) || 0)}
                      className="w-full bg-black/40 border-b-2 border-[#00ffcc]/30 font-mono text-headline-medium focus:outline-none focus:border-[#00ffcc] text-[#00ffcc] px-2 py-1 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-[#00ffcc]/60 tracking-widest">Tamaño (TAM)</label>
                    <input 
                      type="number" 
                      value={tam} 
                      onChange={(e) => setTam(parseInt(e.target.value) || 0)}
                      className="w-full bg-black/40 border-b-2 border-[#00ffcc]/30 font-mono text-headline-medium focus:outline-none focus:border-[#00ffcc] text-[#00ffcc] px-2 py-1 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#00ffcc]/10 rounded text-center border border-[#00ffcc]/20">
                    <p className="text-[10px] uppercase opacity-60 text-[#80cbc4]">Bonif. Daño</p>
                    <p className="text-title-large font-bold text-[#00ffcc]">{db}</p>
                  </div>
                  <div className="p-3 bg-[#00ffcc]/10 rounded text-center border border-[#00ffcc]/20">
                    <p className="text-[10px] uppercase opacity-60 text-[#80cbc4]">Corpulencia</p>
                    <p className="text-title-large font-bold text-[#00ffcc]">{build}</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/60 p-6 rounded-lg text-[#e0f2f1] space-y-4 border border-[#00ffcc]/30 shadow-[0_0_15px_rgba(0,255,204,0.1)]">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#00ffcc] border-b border-[#00ffcc]/30 pb-2">Calculadora de Éxitos</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase opacity-60 text-[#80cbc4]">Habilidad:</span>
                  <input 
                    type="number" 
                    value={baseVal} 
                    onChange={(e) => setBaseVal(parseInt(e.target.value) || 0)}
                    className="bg-transparent border-b border-[#00ffcc] w-16 text-center font-mono text-title-large focus:outline-none text-[#00ffcc]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div><p className="opacity-40 text-[9px]">NORM</p><p>{baseVal}</p></div>
                  <div><p className="opacity-40 text-[9px]">DIF</p><p className="text-[#00ffcc]">{Math.floor(baseVal/2)}</p></div>
                  <div><p className="opacity-40 text-[9px]">EXT</p><p className="text-[#00ffcc] font-bold">{Math.floor(baseVal/5)}</p></div>
                </div>
              </div>
            </div>
          </StepCard>

          {/* 8. Trasfondo */}
          <StepCard number="8" title="Trasfondo" icon={<User size={24} />}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <p className="flex items-center gap-2 text-[#80cbc4]"><Info size={14} className="text-[#00ffcc]" /> Descripción</p>
              <p className="flex items-center gap-2 text-[#80cbc4]"><Info size={14} className="text-[#00ffcc]" /> Creencias</p>
              <p className="flex items-center gap-2 text-[#80cbc4]"><Info size={14} className="text-[#00ffcc]" /> Allegados</p>
              <p className="flex items-center gap-2 text-[#80cbc4]"><Info size={14} className="text-[#00ffcc]" /> Lugares</p>
              <p className="flex items-center gap-2 text-[#80cbc4]"><Info size={14} className="text-[#00ffcc]" /> Posesiones</p>
              <p className="flex items-center gap-2 text-[#80cbc4]"><Info size={14} className="text-[#00ffcc]" /> Rasgos</p>
            </div>
            <div className="mt-4 p-3 bg-[#00ffcc]/10 text-[#e0f2f1] rounded-sm text-[10px] flex gap-2 items-center border border-[#00ffcc]/30">
              <AlertCircle size={16} className="shrink-0 text-[#00ffcc]" />
              <p>Marca un <strong className="text-[#00ffcc]">Vínculo Fundamental</strong> para recuperar Cordura.</p>
            </div>
          </StepCard>

          {/* 9. Equipo */}
          <StepCard number="9" title="Equipo" icon={<Backpack size={24} />}>
            <p className="text-xs text-[#80cbc4]">
              Anota los objetos, armas y equipo que tu investigador lleva consigo.
            </p>
            <div className="border border-dashed border-[#00ffcc]/30 p-4 rounded h-24 flex items-center justify-center italic text-[#80cbc4]/40 text-xs bg-black/20">
              Espacio para inventario...
            </div>
          </StepCard>

          {/* 10. Ingresos */}
          <StepCard number="10" title="Ingresos y Bienes" icon={<Coins size={24} />}>
            <p className="text-xs text-[#80cbc4]">
              Determina tu nivel de vida según tu <strong className="text-[#00ffcc]">Crédito</strong>:
            </p>
            <ul className="text-xs space-y-1 list-disc list-inside opacity-80 text-[#80cbc4]">
              <li>0: Indigente</li>
              <li>1-9: Pobre</li>
              <li>10-49: Medio</li>
              <li>50-89: Acomodado</li>
              <li>90-98: Rico</li>
              <li>99: Millonario</li>
            </ul>
          </StepCard>

          {/* 11. Compañeros */}
          <StepCard number="11" title="Compañeros" icon={<UserPlus size={24} />}>
            <p className="text-xs text-[#80cbc4]">
              Anota los nombres de los otros investigadores. ¡La supervivencia depende del grupo!
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/30 flex items-center justify-center text-[10px] font-bold text-[#00ffcc]">
                  {i}
                </div>
              ))}
            </div>
          </StepCard>

        </div>

        {/* Footer Quote */}
        <footer className="py-16 text-center investigative-panel rounded-lg border-t-2 border-[#00ffcc]/20 bracket-border">
          <p className="text-headline-small italic mb-6 text-[#e0f2f1] font-serif glow-text">"Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn."</p>
          <div className="flex justify-center items-center gap-8 text-[10px] uppercase tracking-[0.4em] font-bold text-[#00ffcc]/60 font-mono">
            <span className="flex items-center gap-2"><Camera size={14} /> Miskatonic Terminal</span>
            <span className="text-[#00ffcc]/20">|</span>
            <span>Est. 1924</span>
          </div>
        </footer>
      </main>

      {/* Decorative Corner Elements */}
      <div className="fixed top-0 left-0 w-48 h-48 border-t-[2px] border-l-[2px] border-[#00ffcc]/10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-48 h-48 border-b-[2px] border-r-[2px] border-[#00ffcc]/10 pointer-events-none"></div>
    </div>
  );
}

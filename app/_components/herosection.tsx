'use client';
import React, { useState, useEffect, useRef } from 'react';
import GamingCarousel from './carousel/leftComponents';

// ---- Modal participation tournoi ----

const TournamentModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({ nom: '', prenom: '', age: '', telephone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Échec inscription');
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue, réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-[rgba(5,5,10,0.85)] backdrop-blur-md z-[1000] flex items-center justify-center px-4 py-6"
    >
      <div className="gc-modal relative bg-[#12121a] border border-[#2a2a3a] rounded-2xl w-full max-w-[500px] px-8 pt-9 pb-7 font-sans">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 bg-[rgba(127,119,221,0.08)] border border-[#2a2a3a] rounded-lg w-[34px] h-[34px] flex items-center justify-center cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14 4L4 14M4 4l10 10" stroke="#9d97c4" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {success ? (
          <div className="text-center pt-2 pb-1">
            <div className="flex justify-center mb-5">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="rgba(127,119,221,0.15)" />
                <path d="M14 24.5l7 7L34 16" stroke="#7f77dd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 id="modal-title" className="font-['Orbitron'] text-[22px] font-extrabold text-[#f4f3fb] mb-2">
              Inscription confirmée !
            </h2>
            <p className="text-[#9d97c4] text-sm leading-relaxed">
              Bienvenue dans le tournoi, <strong className="text-[#afa9ec]">{form.prenom}</strong>. Tu recevras les détails de la compétition très bientôt.
            </p>
            <button onClick={onClose} className="mt-6 bg-[#7f77dd] text-[#0a0a0f] border-none rounded-lg py-3.5 text-sm font-bold cursor-pointer w-full tracking-wide">
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="block mb-2.5 font-mono text-[10px] tracking-[2px] text-[#7f77dd] uppercase">
                🏆 TOURNOI HEBDOMADAIRE
              </span>
              <h2 id="modal-title" className="font-['Orbitron'] text-[22px] font-extrabold text-[#f4f3fb] mb-2 mt-0">
                Formulaire de participation
              </h2>
              <p className="text-[#9d97c4] text-sm leading-relaxed m-0">
                Remplis le formulaire pour t&rsquo;inscrire à la compétition de cette semaine.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="prenom" className="text-[#afa9ec] text-xs font-medium tracking-wide">Prénom</label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    placeholder="Jean"
                    value={form.prenom}
                    onChange={handleChange}
                    required
                    autoComplete="given-name"
                    className="gc-input bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg px-3.5 py-2.5 text-sm text-[#f4f3fb] w-full box-border transition-[border-color,box-shadow] duration-150"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="nom" className="text-[#afa9ec] text-xs font-medium tracking-wide">Nom</label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    placeholder="Dupont"
                    value={form.nom}
                    onChange={handleChange}
                    required
                    autoComplete="family-name"
                    className="gc-input bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg px-3.5 py-2.5 text-sm text-[#f4f3fb] w-full box-border transition-[border-color,box-shadow] duration-150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="age" className="text-[#afa9ec] text-xs font-medium tracking-wide">Âge</label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="18"
                    min="12"
                    max="99"
                    value={form.age}
                    onChange={handleChange}
                    required
                    className="gc-input bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg px-3.5 py-2.5 text-sm text-[#f4f3fb] w-full box-border transition-[border-color,box-shadow] duration-150"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="telephone" className="text-[#afa9ec] text-xs font-medium tracking-wide">Numéro de téléphone</label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    placeholder="+33 6 00 00 00 00"
                    value={form.telephone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    className="gc-input bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg px-3.5 py-2.5 text-sm text-[#f4f3fb] w-full box-border transition-[border-color,box-shadow] duration-150"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
                className="mt-2 bg-[#7f77dd] text-[#0a0a0f] border-none rounded-lg py-3.5 text-sm font-bold cursor-pointer w-full tracking-wide"
              >
                {loading ? 'Envoi en cours…' : 'Confirmer ma participation'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// ---- Composant principal ----

const Herosection = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative bg-[#0a0a0f] rounded-xl overflow-hidden font-sans px-5 sm:px-8 md:px-12 py-10 md:py-16 lg:py-[72px]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800&display=swap');

        @keyframes gc-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #7f77dd; }
          50% { opacity: 0.4; box-shadow: 0 0 2px #7f77dd; }
        }
        @keyframes gc-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -16px); }
        }
        @keyframes gc-modal-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .gc-pulse-dot { animation: gc-pulse 1.8s ease-in-out infinite; }
        .gc-orb { animation: gc-drift 9s ease-in-out infinite; }
        .gc-btn { transition: transform 0.15s ease, filter 0.15s ease; }
        .gc-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .gc-btn:focus-visible { outline: 2px solid #afa9ec; outline-offset: 3px; }
        .gc-modal { animation: gc-modal-in 0.22s ease both; }
        .gc-input:focus { outline: none; border-color: #7f77dd !important; box-shadow: 0 0 0 3px rgba(127,119,221,0.18); }
        .gc-input::placeholder { color: #3e3c5a; }
        @media (prefers-reduced-motion: reduce) {
          .gc-pulse-dot, .gc-orb, .gc-modal { animation: none; }
        }
      `}</style>

      <div className="gc-orb absolute w-[360px] h-[360px] rounded-full opacity-[0.18] blur-[110px] pointer-events-none z-0 bg-[#534ab7]" style={{ top: -120, left: -100 }} />
      <div
        className="gc-orb absolute w-[360px] h-[360px] rounded-full opacity-[0.18] blur-[110px] pointer-events-none z-0 bg-[#7f77dd]"
        style={{ bottom: -140, right: -120, animationDelay: '3s' }}
      />

      <div className="relative z-10 max-w-[720px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-[#afa9ec] bg-[rgba(127,119,221,0.1)] border border-[#534ab7] rounded-full px-3.5 py-1.5 mb-7">
          <span className="gc-pulse-dot w-1.5 h-1.5 rounded-full bg-[#7f77dd]" />
          SALLE DE JEUX — EN LIGNE
        </div>

    <h1 className="font-['Orbitron'] uppercase text-[30px] sm:text-[38px] md:text-[50px] font-extrabold text-[#f4f3fb] mb-[18px] tracking-wide leading-[1.15]">
  BIENVENUE  à  <span className="text-[#7f77dd]">ALBENOS LE BELL</span>
</h1>

        <p className="text-sm md:text-base text-[#9d97c4] leading-[1.7] mx-auto mb-9 max-w-[560px]">
          Une salle de jeux pensée pour les joueurs qui veulent plus qu&rsquo;une partie : choisis ton jeu,
          affronte d&rsquo;autres joueurs et grimpe au classement à chaque session.
        </p>

        <div className="flex justify-center gap-4 mb-10 md:mb-16 flex-wrap">
          <button className="gc-btn bg-[#7f77dd] text-[#0a0a0f] border-none rounded-lg px-7 py-3.5 text-sm font-semibold cursor-pointer">
            Découvrir les jeux
          </button>
          <button className="gc-btn bg-transparent text-[#e0dff8] border-[1.5px] border-[#534ab7] rounded-lg px-7 py-3.5 text-sm font-semibold cursor-pointer">
            Voir les compétitions
          </button>
        </div>
      </div>

      <div className="relative z-10 mb-8">
        <GamingCarousel />
      </div>

      <div className="relative z-10 flex items-center justify-between gap-6 bg-gradient-to-r from-[rgba(127,119,221,0.12)] to-[rgba(83,74,183,0.04)] border border-[#2a2a3a] rounded-xl px-6 sm:px-8 py-6 flex-wrap">
        <div className="flex-[1_1_320px]">
          <span className="font-mono text-[11px] tracking-[2px] text-[#7f77dd] uppercase">
            PROCHAINE COMPÉTITION
          </span>
          <h3 className="text-[#f4f3fb] text-xl font-bold my-2">
            Tournoi hebdomadaire — inscriptions ouvertes
          </h3>
          <p className="text-[#9d97c4] text-sm m-0">
            Inscris-toi pour participer aux compétitions de jeux et tenter de remporter des récompenses chaque semaine.
          </p>
        </div>
        <button
          className="gc-btn bg-[#7f77dd] text-[#0a0a0f] border-none rounded-lg px-6 py-3.5 text-sm font-semibold cursor-pointer whitespace-nowrap"
          onClick={() => setShowModal(true)}
        >
          Participer maintenant
        </button>
      </div>

      {showModal && <TournamentModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Herosection;
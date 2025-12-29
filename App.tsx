
import React, { useState } from 'react';
import { DayOfWeek, AppState, PostContent } from './types';
import { generatePostText, generatePostImage } from './services/geminiService';

const DAYS: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    posts: DAYS.reduce((acc, day) => {
      acc[day] = { day, text: '', imageUrl: null, loading: false, error: null };
      return acc;
    }, {} as Record<DayOfWeek, PostContent>),
    selectedDay: 'Lunes'
  });

  const handleGenerate = async (day: DayOfWeek) => {
    setState(prev => ({
      ...prev,
      posts: {
        ...prev.posts,
        [day]: { ...prev.posts[day], loading: true, error: null }
      }
    }));

    try {
      const text = await generatePostText(day);
      const imageUrl = await generatePostImage(day);
      
      setState(prev => ({
        ...prev,
        posts: {
          ...prev.posts,
          [day]: { ...prev.posts[day], text, imageUrl, loading: false }
        }
      }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        posts: {
          ...prev.posts,
          [day]: { ...prev.posts[day], loading: false, error: "Error al generar el contenido. Inténtalo de nuevo." }
        }
      }));
    }
  };

  const currentPost = state.posts[state.selectedDay];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Radio Cartaya 107.2 FM</h1>
              <p className="text-sm text-gray-500">Gestor de Redes Sociales</p>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Modelo Estándar Activo (Alta Velocidad)
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Day Selector Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Programación Semanal</h2>
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setState(prev => ({ ...prev, selectedDay: day }))}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                state.selectedDay === day
                  ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100 shadow-sm'
              }`}
            >
              <span className="font-medium">{day}</span>
              {state.posts[day].imageUrl && (
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-9">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{state.selectedDay}</h3>
                <p className="text-gray-500 text-sm">Post de las 14:00 (Música)</p>
              </div>
              <button
                disabled={currentPost.loading}
                onClick={() => handleGenerate(state.selectedDay)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50"
              >
                {currentPost.loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                {currentPost.loading ? 'Generando...' : currentPost.text ? 'Regenerar Todo' : 'Generar Post'}
              </button>
            </div>

            <div className="p-8">
              {currentPost.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3">
                  <span>{currentPost.error}</span>
                </div>
              )}

              {currentPost.loading ? (
                <div className="space-y-8 animate-pulse">
                  <div className="aspect-square bg-slate-100 rounded-2xl w-full max-w-sm mx-auto"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                  </div>
                </div>
              ) : currentPost.text ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    {currentPost.imageUrl && (
                      <img 
                        src={currentPost.imageUrl} 
                        className="w-full h-auto aspect-square object-cover rounded-2xl shadow-sm border"
                      />
                    )}
                    <p className="text-center text-xs text-gray-400">Estudio Radio Cartaya (IA)</p>
                  </div>

                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-700 text-sm">Texto para copiar:</h4>
                      <button 
                        onClick={() => navigator.clipboard.writeText(currentPost.text)}
                        className="text-xs text-blue-600 font-bold uppercase tracking-wider hover:underline"
                      >
                        Copiar
                      </button>
                    </div>
                    <div className="flex-1 p-6 bg-slate-50 border rounded-2xl whitespace-pre-wrap text-gray-800 leading-relaxed text-sm md:text-base">
                      {currentPost.text}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-400">Selecciona un día y pulsa generar para crear el contenido.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 text-center text-gray-400 text-xs">
        <p>© {new Date().getFullYear()} Radio Cartaya 107.2 FM</p>
      </footer>
    </div>
  );
};

export default App;

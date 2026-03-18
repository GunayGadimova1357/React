import './App.css'
import AuthModal from './components/AuthModal';
import MovieGrid from './components/MovieGrid';
import Navbar from './components/Navbar';
import SearchForm from './components/SearchForm';

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="space-y-8">
          <SearchForm />
          <MovieGrid />
        </section>
      </main>
      <AuthModal />
    </div>
  )
}

export default App;

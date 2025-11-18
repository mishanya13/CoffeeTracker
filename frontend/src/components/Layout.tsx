import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Layout = () => {
  const { t } = useTranslation();

  const navLinks = [
    { to: '/', label: t('nav.dashboard') },
    { to: '/inventory', label: t('nav.inventory') },
    { to: '/usage', label: t('nav.usage') },
    { to: '/machine', label: t('nav.machine') },
    { to: '/recipes', label: t('nav.recipes') },
    { to: '/quick-brew', label: t('nav.quickBrew') },
    { to: '/statistics', label: t('nav.stats') },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header / Navigation */}
      <header className="bg-coffee-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-3xl">☕</div>
              <h1 className="text-2xl font-serif font-bold">{t('app.title')}</h1>
            </div>

            {/* Language Selector */}
            <LanguageSelector />
          </div>

          {/* Navigation */}
          <nav className="mt-4">
            <ul className="flex flex-wrap gap-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-coffee-600 text-white'
                          : 'text-cream-100 hover:bg-coffee-700'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-coffee-800 text-cream-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm">{t('app.tagline')}</p>
          <p className="text-xs mt-2 text-cream-300">© 2024 CoffeeTracker</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

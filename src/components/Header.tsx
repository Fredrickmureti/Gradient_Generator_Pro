import { useState } from 'react';
import { Palette, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-background border-b border-border shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Palette className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-foreground">Gradient Generator Pro</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a 
              href="https://github.com/Fredrickmureti"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a 
              href="https://devfredrick.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
          >
            <span className="sr-only">Open menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-background border-b border-border shadow-lg z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <a
              href="https://github.com/Fredrickmureti"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              GitHub
            </a>
            <a
              href="https://devfredrick.me"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              About
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
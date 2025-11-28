import { Github, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              Created by{' '}
              <a 
                href="https://devfredrick.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Fredrick Mureti
              </a>
            </p>
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a
              href="https://github.com/Fredrickmureti"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://mureti.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Website</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
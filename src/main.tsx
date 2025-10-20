import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Single Page Apps for GitHub Pages
// https://github.com/rafgraph/spa-github-pages
// Handle redirects from 404.html
(function() {
  const l = window.location;
  if (l.search[1] === '/') {
    const decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    window.history.replaceState(null, '', l.pathname.slice(0, -1) + decoded + l.hash);
  }
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Tắt tính năng tự động ghi nhớ vị trí cuộn cũ của trình duyệt khi F5 / reload trang
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


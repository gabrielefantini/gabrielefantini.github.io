import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@fontsource-variable/inter';
import './styles.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Organizations from './pages/Organizations';
import NotFound from './pages/NotFound';
import { Blog, BlogPost, Life, LifePost, Sponsoring } from './pages/Sections';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="organizations" element={<Organizations />} />
          <Route path="sponsoring" element={<Sponsoring />} />
          <Route path="life" element={<Life />} />
          <Route path="life/:slug" element={<LifePost />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

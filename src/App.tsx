import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Organizations from './pages/Organizations';
import NotFound from './pages/NotFound';
import { Blog, BlogPost, Lab, Life, LifePost } from './pages/Sections';
import { DailyHome, IssuePage, PaperArchive, Programme } from './pages/Daily';

/** Route table shared by the browser entry and the build-time pre-renderer. */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="lab" element={<Lab />} />
        <Route path="sponsoring" element={<Navigate to="/lab" replace />} />
        <Route path="life" element={<Life />} />
        <Route path="life/:slug" element={<LifePost />} />
        <Route path="daily" element={<DailyHome />} />
        <Route path="daily/:paper" element={<PaperArchive />} />
        <Route path="daily/:paper/programme" element={<Programme />} />
        <Route path="daily/:paper/:date" element={<IssuePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

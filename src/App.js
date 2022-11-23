import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, EditorPage } from './pages';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <div>
        <Toaster position="top-right" toastOptions={{ success: { theme: { primary: '#4aed88', }, }, }} ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </>
    // <div className="App">
    //   <h1>Hello</h1>
    // </div>
  );
}

export default App;

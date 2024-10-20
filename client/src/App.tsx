import { Routes, Route } from "react-router-dom";
import MuseumDisplay from "./MuseumDisplay";
import AiArtMirror from "./mirror/AiArtMirror";

export default function App() {
  return (
    <Routes>
      <Route index path='/' element={<AiArtMirror />} />
      <Route path='/museum' element={<MuseumDisplay />} />
    </Routes>
  );
}

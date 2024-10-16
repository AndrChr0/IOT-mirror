import { Routes, Route } from "react-router-dom";
import FaceDetection from "./mirror/FaceDetection";
import MuseumDisplay from "./MuseumDisplay";

export default function App() {
  return (
    <Routes>
      <Route index path='/' element={<FaceDetection />} />
      <Route path='/museum' element={<MuseumDisplay />} />
    </Routes>
  );
}

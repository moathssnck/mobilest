import { Loader } from "lucide-react";
import './loader.css'
// components/Loader.js
export default function LoaderApp() {
  const loaderStyle:React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // for the black overlay
    zIndex: 50,
  };

  const loaderIconStyle = {
    animation: 'spin 1s infinite linear',
  };

  return (
    <div style={loaderStyle}>
      <Loader style={loaderIconStyle} />
    </div>
  );
}
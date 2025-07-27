import { useState } from "react";
import CameraFeed from "./CameraFeed";
import PhotoStrip from "./PhotoStrip";

export default function Photobooth() {
    const [capturing, setCapturing] = useState(false);
    const [photoCount, setPhotoCount] = useState(0);
    const [capturedImages, setCapturedImages] = useState<HTMLImageElement[]>(
        []
    );

    const handleStart = () => {
        setCapturing(true);
    };

    const handleCapture = (image: HTMLImageElement) => {
        setCapturedImages((prev) => [...prev, image]);
        setPhotoCount((prev) => prev + 1);
        if (photoCount === 3) {
            setCapturing(false);
        }
    };

    return (
        <>
            {!capturing && capturedImages.length === 0 && (
                <>
                    <h1 className="text-3xl font-playfair italic">
                        My Photobooth
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleStart}
                            className="bg-[#744d28] text-white py-2 px-4 rounded hover:bg-[#5e3d1f] transition"
                        >
                            Use Camera
                        </button>
                    </div>
                </>
            )}
            {capturing && capturedImages.length !== 3 && (
                <CameraFeed
                    onCapture={handleCapture}
                    capturing={capturing}
                    photoCount={photoCount}
                />
            )}
            {capturedImages.length === 3 && (
                <PhotoStrip images={capturedImages} />
            )}
        </>
    );
}

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
                    <h1 className="text-4xl font-italiana italic">my</h1>
                    <h2 className="text-6xl font-asset mt-[-0.5rem]">
                        PHOTO BOOTH
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={handleStart}
                            className="mt-6 bg-crimson-pastel hover:bg-crimson-pastel-dark text-white px-6 py-2 rounded-full font-italiana tracking-wide text-sm cursor-pointer"
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

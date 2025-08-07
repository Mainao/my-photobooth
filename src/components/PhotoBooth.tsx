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
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            {/* Landing Section */}
            {!capturing && capturedImages.length === 0 && (
                <>
                    <h1 className="text-6xl font-cormorant tracking-tight">
                        <span className="font-normal italic">My&nbsp;</span>
                        <span className="font-light">Photo Booth</span>
                    </h1>

                    <button
                        onClick={handleStart}
                        className="mt-8 bg-brown hover:bg-gray text-white uppercase px-6 py-4 rounded-full font-red-hat font-light tracking-wide text-sm cursor-pointer transition duration-300"
                    >
                        Use Camera
                    </button>
                </>
            )}

            {/* Camera Section */}
            {capturing && capturedImages.length !== 3 && (
                <CameraFeed
                    onCapture={handleCapture}
                    capturing={capturing}
                    photoCount={photoCount}
                />
            )}

            {/* Final Photostrip */}
            {capturedImages.length === 3 && (
                <PhotoStrip images={capturedImages} />
            )}
        </div>
    );
}

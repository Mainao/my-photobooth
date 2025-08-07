import { useEffect, useRef, useState } from "react";

interface CameraFeedProps {
    onCapture: (image: HTMLImageElement) => void;
    capturing: boolean;
    photoCount: number;
}

export default function CameraFeed({
    onCapture,
    capturing,
    photoCount,
}: CameraFeedProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const hasFlashedRef = useRef(false);

    const [showGetReady, setShowGetReady] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        if (capturing) startCamera();
        else stopCamera();

        return () => stopCamera();
    }, [capturing]);

    useEffect(() => {
        if (capturing && photoCount < 3) {
            setShowGetReady(true);
            setCountdown(null);

            const readyTimer = setTimeout(() => {
                setShowGetReady(false);
                setCountdown(3);
            }, 2000);

            return () => clearTimeout(readyTimer);
        }
    }, [photoCount, capturing]);

    useEffect(() => {
        if (countdown === null || countdown < 0) return;

        if (countdown > 1) {
            const timer = setTimeout(() => {
                setCountdown((prev) => (prev ?? 1) - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (countdown === 1 && !hasFlashedRef.current) {
            hasFlashedRef.current = true;

            let cleanupFlashTimeout: ReturnType<typeof setTimeout>;

            const waitBeforeFlash = setTimeout(() => {
                setFlash(true);

                cleanupFlashTimeout = setTimeout(() => {
                    setFlash(false);
                    setCountdown(0);
                }, 150);
            }, 1000);

            return () => {
                clearTimeout(waitBeforeFlash);
                clearTimeout(cleanupFlashTimeout);
            };
        }

        if (countdown === 0) {
            captureImage();
            hasFlashedRef.current = false;
        }
    }, [countdown]);

    const startCamera = async () => {
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = streamRef.current;
                await videoRef.current.play();
            }
        } catch (error) {
            console.error("Camera access error:", error);
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    };

    const captureImage = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(videoRef.current, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];
            const avg = 0.3 * red + 0.59 * green + 0.11 * blue;
            data[i] = data[i + 1] = data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);

        const img = new Image();
        img.onload = () => {
            onCapture(img);
            if (photoCount === 3) stopCamera();
        };
        img.src = canvas.toDataURL("image/png");
    };

    const getOrdinal = (n: number) => {
        const suffixes = ["th", "st", "nd", "rd"];
        const value = n >= 13 && n <= 19 ? 0 : n % 10;
        return n + suffixes[value];
    };

    return (
        <div className="relative w-[450px] h-[600px]">
            <video
                ref={videoRef}
                className="w-full h-full border object-cover rounded filter grayscale"
                autoPlay
                muted
                playsInline
            />

            {flash && (
                <div className="absolute inset-0 bg-white opacity-80 z-50 pointer-events-none animate-fade-out" />
            )}

            {(showGetReady || countdown !== null) && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white bg-black/50 text-center px-4">
                    {showGetReady ? (
                        <span className="text-xl font-cormorant italic">
                            {`Get ready for the ${getOrdinal(
                                photoCount + 1
                            )} photo`}
                        </span>
                    ) : countdown === 0 ? null : (
                        <span className="text-7xl font-red-hat">
                            {countdown}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

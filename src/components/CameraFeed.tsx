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

    const [showGetReady, setShowGetReady] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

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

        if (countdown === 0) {
            captureImage();
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => (prev ?? 1) - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    const startCamera = async () => {
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
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
    };

    const captureImage = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(videoRef.current, 0, 0);

        const img = new Image();
        img.onload = () => {
            onCapture(img);
            if (photoCount >= 2) {
                stopCamera();
            }
        };
        img.src = canvas.toDataURL("image/png");
    };

    return (
        <div className="relative w-[375px] h-[500px]">
            <video
                ref={videoRef}
                className="w-full h-full border object-cover rounded"
                autoPlay
                muted
                playsInline
            />

            {(showGetReady || countdown !== null) && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-bold text-white bg-black/50 text-center px-4">
                    {showGetReady ? (
                        <span className="text-xs">
                            {`Get ready for photo ${photoCount + 1}`}
                        </span>
                    ) : countdown === 0 ? null : (
                        <span className="text-4xl">{countdown}</span>
                    )}
                </div>
            )}
        </div>
    );
}

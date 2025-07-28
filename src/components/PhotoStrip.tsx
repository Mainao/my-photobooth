import { useEffect, useRef, useState } from "react";

interface PhotoStripProps {
    images: HTMLImageElement[];
}

export default function PhotoStrip({ images }: PhotoStripProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [stripUrl, setStripUrl] = useState<string | null>(null);

    useEffect(() => {
        if (images.length === 3) {
            const timeout = setTimeout(() => {
                if (!canvasRef.current) return;

                const canvas = canvasRef.current!;
                const canvasWidth = 500;
                const canvasHeight = 1200;
                const ctx = canvas.getContext("2d")!;

                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

                const topPadding = 30;
                const spacing = 30;

                const photoHeight = 280;
                const photoWidth = canvasWidth - 60;

                ctx.fillStyle = "#FEE7EA";
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                images.forEach((img, i) => {
                    const x = (canvasWidth - photoWidth) / 2;
                    const y = topPadding + i * (photoHeight + spacing);
                    ctx.drawImage(img, x, y, photoWidth, photoHeight);
                });

                setStripUrl(canvas.toDataURL("image/png"));
            }, 0);

            return () => clearTimeout(timeout);
        }
    }, [images]);

    return (
        <div className="flex flex-col items-center gap-6 mt-10">
            <canvas ref={canvasRef} className="hidden" />

            {stripUrl && (
                <>
                    <div className="bg-white border border-gray-300 rounded-md p-3 shadow-md">
                        <img
                            src={stripUrl}
                            alt="Photostrip"
                            className="w-[250px] sm:w-[280px] object-cover rounded-sm border border-gray-200"
                        />
                    </div>

                    <a
                        href={stripUrl}
                        download="photostrip.png"
                        className="bg-[#8f2547] hover:bg-[#8f2547] text-white font-italiana px-4 py-2 rounded-md shadow transition duration-200 flex items-center gap-2"
                    >
                        Download Photostrip
                    </a>
                </>
            )}
        </div>
    );
}

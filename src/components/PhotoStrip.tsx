import { useEffect, useRef, useState } from "react";

interface PhotoStripProps {
    images: HTMLImageElement[];
}

function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function PhotoStrip({ images }: PhotoStripProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [stripUrl, setStripUrl] = useState<string | null>(null);
    const [slideIn, setSlideIn] = useState(false);

    useEffect(() => {
        if (images.length === 3) {
            const timeout = setTimeout(() => {
                if (!canvasRef.current) return;

                const canvas = canvasRef.current!;
                const canvasWidth = 300;
                const photoHeight = 180;
                const photoWidth = canvasWidth - 40;
                const spacing = 30;
                const topPadding = 30;
                const bottomPadding = 80;

                const canvasHeight =
                    topPadding +
                    (photoHeight + spacing) * images.length -
                    spacing +
                    bottomPadding;

                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

                const ctx = canvas.getContext("2d")!;
                ctx.fillStyle = "#FEE7EA";
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                images.forEach((img, i) => {
                    const x = (canvasWidth - photoWidth) / 2;
                    const y = topPadding + i * (photoHeight + spacing);
                    ctx.drawImage(img, x, y, photoWidth, photoHeight);
                });

                ctx.fillStyle = "#8f2547";
                ctx.font = "bold 20px Italiana, serif";
                ctx.textAlign = "center";
                ctx.fillText(
                    formatDate(new Date()),
                    canvasWidth / 2,
                    canvasHeight - 30
                );

                setStripUrl(canvas.toDataURL("image/png"));
                setTimeout(() => setSlideIn(true), 50);
            }, 0);

            return () => clearTimeout(timeout);
        }
    }, [images]);

    return (
        <div className="flex flex-col items-center justify-center mt-10 gap-6">
            <canvas ref={canvasRef} className="hidden" />

            {stripUrl && (
                <>
                    {/* Outer card */}
                    <div className="bg-white rounded-xl shadow-md p-4 w-[300px] sm:w-[280px] border border-gray-200">
                        <div className="rounded-md p-4">
                            <img
                                src={stripUrl}
                                alt="Photostrip"
                                className={`w-full rounded-sm object-cover transform transition-all duration-1500 ease-out ${
                                    slideIn
                                        ? "translate-y-0 opacity-100"
                                        : "-translate-y-20 opacity-0"
                                }`}
                            />
                        </div>
                    </div>

                    {/* Download button */}
                    <a
                        href={stripUrl}
                        download="photostrip.png"
                        className="bg-crimson hover:bg-crimson-rose text-white font-italiana px-6 py-2 rounded-md shadow transition duration-200"
                    >
                        Download Photostrip
                    </a>
                </>
            )}
        </div>
    );
}

import "./App.css";
import PhotoBooth from "./components/PhotoBooth";

function App() {
    return (
        <>
            <div className="min-h-screen bg-[#f6f2e7] text-[#6e3d14] flex items-center justify-center">
                {/* Main Content */}
                <main className="flex flex-col items-center gap-6">
                    <PhotoBooth />
                </main>
            </div>
        </>
    );
}

export default App;

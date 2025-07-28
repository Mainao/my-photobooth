import "./App.css";
import PhotoBooth from "./components/PhotoBooth";

function App() {
    return (
        <>
            <div className="min-h-screen bg-[#fde2e7] text-[#8f2547] flex items-center justify-center">
                {/* Main Content */}
                <main className="flex flex-col items-center gap-6">
                    <PhotoBooth />
                </main>
            </div>
        </>
    );
}

export default App;

import PhotoBooth from "./components/PhotoBooth";

function App() {
    return (
        <>
            <div className="min-h-screen bg-peach-cream flex items-center justify-center">
                {/* Main Content */}
                <main className="flex flex-col items-center gap-6">
                    <PhotoBooth />
                </main>
            </div>
        </>
    );
}

export default App;

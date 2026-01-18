import "./loading.css";

export default function LoadingPage() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 9999,
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" // Premium Dark Theme
        }}>
            <div className="loader-container">
                <div className="neural-spinner">
                    <div className="pulse-core"></div>
                    <div className="node node-1"></div>
                    <div className="node node-2"></div>
                    <div className="node node-3"></div>
                </div>
                <div className="loading-text">INITIALIZING KB</div>
            </div>
        </div>
    );
}



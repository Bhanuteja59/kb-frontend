import "./loading.css";

export default function LoadingPage() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-secondary" style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 9999 }}>
            <div className="loader">
                <div className="text"><span>Loading</span></div>
                <div className="text"><span>Loading</span></div>
                <div className="text"><span>Loading</span></div>
                <div className="text"><span>Loading</span></div>
                <div className="text"><span>Loading</span></div>
                <div className="text"><span>Loading</span></div>
                <div className="text"><span>Loading</span></div>
                <div className="text"><span>Loading</span></div>
                <div className="text"><span>Loading</span></div>
                <div className="line"></div>
            </div>
        </div>
    );
}



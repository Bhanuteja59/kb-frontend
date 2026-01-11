export default function DeleteModal({ isOpen, title, body, onConfirm, onCancel, isDeleting }) {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-danger">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {title}
                            </h5>
                            <button type="button" className="btn-close" onClick={onCancel} disabled={isDeleting}></button>
                        </div>
                        <div className="modal-body">
                            <p>{body}</p>
                            <div className="alert alert-warning small">
                                <i className="bi bi-info-circle me-1"></i>
                                This action cannot be undone. The document and its search index will be permanently removed.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isDeleting}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
                                {isDeleting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Permanently"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}

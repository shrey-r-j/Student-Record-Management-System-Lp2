function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" id="confirm-modal" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel} id="modal-cancel-btn">
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} id="modal-confirm-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

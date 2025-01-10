import "./modal.css"
export default function Modal({isOpen,onClose,children}){
    if(!isOpen){
        return null;
    }
    return(
        <div className="modal">
            <div className="modal-container">
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
                <div className="modal-contents">{children}</div>
            </div>
        </div>
    )
}
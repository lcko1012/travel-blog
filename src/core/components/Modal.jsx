import React from 'react'
import "../styles/Modal.scss"

function Modal({ setIsOpen, handleAccept }) {
    return (
        <>
            <div className='darkBG' onClick={() => setIsOpen(false)} />
            
            <div className='modal__centered'>
                <div className='modal__header'>
                    <h5 className='modal__heading '>Alert</h5>
                </div>
                <button className="modal__close-btn" onClick={() => setIsOpen(false)}>
                    <i className="fal fa-times" style={{ marginBottom: "-3px" }}></i>
                </button>
                <div className="modalContent">
                    Are you sure you want to delete this post?
                </div>
                <div className="modalActions">
                    <div className="actionsContainer">
                        <button className="modal__delete-btn" onClick={handleAccept}>
                            Delete
                        </button>
                        <button
                            className='modal__cancel-btn'
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal

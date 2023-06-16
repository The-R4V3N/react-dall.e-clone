import { useState, useRef } from 'react'

// Modal component that displays the selected image and a button to generate variations
const Modal = ({ setModalOpen, setSelectedImage, selectedImage, generateVariations }) => {
    const [error, setError] = useState(null)
    const ref = useRef(null)

    //This console.log is for debugging purposes
console.log('selectedImage', selectedImage)

// Close modal and reset selected image
    const closeModal = () => {
        setModalOpen(false)
        setSelectedImage(null)
    }

    // Check image size and generate variations
    const checkSize = () => {
        if (ref.current.width == 256 && ref.current.height == 256 || ref.current.width == 512 && ref.current.height == 512 || ref.current.width == 1024 && ref.current.height == 1024) {
            generateVariations()
        } else {
            setError('ERROR! Image size must be 256x256, 512x512, or 1024x1024 px.')
        }
    }

    // Display selected image and button to generate variations
    return(
        <div className='modal'>
            <div className='close' onClick={closeModal}>❌</div>
            <div className='image-container'>
                {selectedImage && <img ref={ref} src={URL.createObjectURL(selectedImage)} alt='uploaded image'/>}
            </div>
            <p className='error'>{error || '* Image must be exactly 256 x 256, 512 x 512 or 1024 x 1024 px.'}</p>
            {! error && <button onClick={checkSize}>Generate</button>}
            {error && <button onClick={closeModal}>Close this and try again</button>}
        </div>
    )
}

export default Modal

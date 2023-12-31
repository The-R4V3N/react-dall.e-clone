import { useState, useRef, useEffect } from "react"
import Modal from "./components/Modal"

//This switchTheme function is for the dark mode toggle button (not yet implemented)
// const switchTheme = (e) => {
//   console.log(Switching theme)
//   const theme = e.target.checked ? "dark" : "light"
//   localStorage.setItem("theme", theme)
//   document.documentElement.setAttribute("data-theme", theme)
// }

const App = () => {
  const [images, setImages] = useState(null)
  const [value, setValue] = useState("")
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  // This is the array of surprise options
  const surpriseOptions = [
    "A blue ostrich eating melon",
    "A red panda eating bamboo",
    "A matrisse style shark on the telephone",
    "A pineapple sunbathing on the north pole",
    "A purple elephant playing the piano",
    "A green giraffe eating a banana",
    "A yellow cat playing with a ball of yarn",
    "A pink dog playing with a bone",
  ]

  // This function is called when the user clicks the Surprise me link
  const surpriseMe = () => {
    setImages(null)
    const randonValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randonValue)
  }

  const [selectedImageCount, setSelectedImageCount] = useState(6) // Default value of 6
  const sliderRef = useRef(null)

  // This function is called when the user clicks the Generate button
  const getImages = async () => {
    setImages(null)
    if (value === null) {
      setError("ERROR! A description is required")
      return
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value,
          numImages: sliderRef.current.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
      const response = await fetch("http://localhost:8000/images", options)
      const data = await response.json()
      console.log(data) // This console.log is for debugging purposes
      setImages(data)
    } catch (error) {
      console.error(error)
    }
  }

  const uploadImage = async (e) => {
    console.log(e.target.files[0])

    const formData = new FormData()
    formData.append("file", e.target.files[0])
    setModalOpen(true)
    setSelectedImage(e.target.files[0])
    e.target.value = null
    try {
      const options = {
        method: "POST",
        body: formData,
      }
      const response = await fetch("http://localhost:8000/upload", options)
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  const generateVariations = async () => {
    setImages(null)
    if (selectedImage === null) {
      setError("ERROR! An image is required")
      setModalOpen(false)
      return
    }
    try {
      const options = {
        method: "POST",
      }
      const response = await fetch("http://localhost:8000/variations", options)
      const data = await response.json()
      console.log(data) // This console.log is for debugging purposes
      if (response.ok) {
        setImages(data)
        setError(null)
        setModalOpen(false)
      } else {
        setError("Error generating image variations")
        console.error(data.error) // Log the specific error for debugging
      }
    } catch (error) {
      console.error(error)
      setError("Error generating image variations")
    }
  }

  const handleSliderChange = () => {
    setSelectedImageCount(sliderRef.current.value)
  }

  // This function is for the future dark mode feature (not yet implemented)
  // useEffect(() => {
  //   const toggleSwitch = document.querySelector(.dark-mode-button)

  //   if (toggleSwitch) {
  //     toggleSwitch.addEventListener(click, switchTheme, false)

  //     const currentTheme = localStorage.getItem(theme) ? localStorage.getItem(theme) : null

  //     if (currentTheme) {
  //       document.documentElement.setAttribute(data-theme, currentTheme)
  //     }
  //   } else {
  //     console.error(Toggle switch not found in DOM)
  //   }

  //   return () => {
  //     toggleSwitch.removeEventListener(click, switchTheme, false)
  //   }
  // }, [])

  return (
    <div className="app">
      <section className="header">
        <h1>Image Generator powered by DALL·E</h1>
        {/* This button tis for the future dark mode feature */}
        {/* <section className="dark-mode-toggle">
          <button className="dark-mode-button">Dark Mode</button>
        </section> */}
      </section>
      <section className="search-section">
        <p className="info">
          <h3>Start with a detailed description</h3>
        </p>
        <p className="surprise-button">
          <span className="surprise" onClick={surpriseMe}>
            Surprise me
          </span>
        </p>
        <div className="image-slider">
          <label htmlFor="imageSlider">Number of Images:</label>
          <input
            className="slider"
            type="range"
            id="imageSlider"
            min="1"
            max="10"
            defaultValue="6"
            ref={sliderRef}
            onChange={handleSliderChange}
          />
          <p className="image-count">Selected Images: {selectedImageCount}</p>
        </div>
        <div className="input-container">
          <input
            value={value}
            placeholder="An impressionist oil painting of a sunflower in a purple vase..."
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={getImages}>Generate</button>
        </div>
        <div className="upload-button-container">
          <button className="upload-button">
            <p className="extra-info">
              Or,
              <span>
                <label htmlFor="files"> upload an image </label>
                <input
                  onChange={uploadImage}
                  id="files"
                  accept="image/*"
                  type="file"
                  hidden
                />
              </span>
              to edit.
            </p>
          </button>
        </div>
        {error && <p>{error}</p>}

        {modalOpen && (
          <div className="overlay">
            <Modal
              setModalOpen={setModalOpen}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              generateVariations={generateVariations}
            />
          </div>
        )}
      </section>
      <section className="image-section">
        {images?.map((image, _index) => (
          <img
            key={_index}
            src={image.url}
            alt={`Generated image of ${value}`}
          />
        ))}
      </section>
      <section className="footer">
        <p>Made by <a href="https://github.com/The-R4V3N">The-R4V3N</a></p>
      </section>
    </div>
  )
}

export default App

import "./App.scss"; // Importing the App.scss file to apply the styling
import { useRef, useState } from "react"; // Importing the useRef and useState hooks provided by react

function App() {
  // Defining a Blank Note Object
  const blankNote = {
    id: null,
    text: "",
    createdOn: null,
    pinned: false,
    top: 120,
    left: 20,
  };

  // By using the useRef hook, refrencing the list of TextArea element
  const textAreaRefs = useRef([]);

  // Defined the notesList Array, setting the initialState either to empty array or getting the array from local stroage if the array exists
  const [notesList, setNotesList] = useState(
    JSON.parse(localStorage.getItem("notes-list")) || []
  );

  // This is the addNote handler, with the blankNote as the argument.
  // Creating a new copy of notesList array, updating the createdOn and id of the blankNote object.
  // Pushing the updated object to the newNotesList array and then updating the notesList state array, with newNotesList array
  const addNote = (note) => {
    let newNotesList = [...notesList];
    note.createdOn = new Date().toDateString();
    note.id = newNotesList.length + 1;
    newNotesList.push(note);
    setNotesList(newNotesList);
  };

  // This is the update handler, with arguments - input value of the note and index value of that particular note from the notesList array
  // Creating a new copy of notesList array, updating the text value of the object using the index value passed as an argument
  // Updating the notesList state array, with newNotesList array
  const updateNote = (value, index) => {
    let newNotesList = [...notesList];
    newNotesList[index].text = value;
    setNotesList(newNotesList);
  };

  // This is DragOver handler, to handle the synthetic events
  const handleDrageOver = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  // This is the DropNote handler
  // According to users mouse postion, which is accessed through the event object using properties pageX and pageY
  // The function updates the notes left and top CSS property
  const handleDropNote = (event) => {
    event.target.style.left = `${event.pageX - 50}px`;
    event.target.style.top = `${event.pageY - 50}px`;
  };

  // This is Delete Note handler
  // The notesList is filtered according to the index, which is passed as an argument
  // Updating the notesList state array, with filteredNotesList array
  const handleDelete = (i) => {
    const filteredNotesList = notesList.filter((note, index) => {
      return index !== i;
    });
    setNotesList(filteredNotesList);
  };

  const handleCursor = (index) => {
    // Access the refrence to the text area, using the index
    const textAreaRef = textAreaRefs.current[index];
    // Set the selection range to the beginning of the text area
    textAreaRef.setSelectionRange(0, 0);
    // Focus on the text area to ensure the cursor is visible
    textAreaRef.focus();
  };

  // This is Pin Note handler
  // Creating a new copy of notesList array, toggling the pinned property of the object using the index value passed as an argument
  // Updating the notesList state array, with newNotesList array
  const handlePin = (index) => {
    let newNotesList = [...notesList];
    newNotesList[index].pinned = !newNotesList[index].pinned;
    setNotesList(newNotesList);
  };

  // This handler is to Clear Local Storage and to reload the page again
  const handleClearBoard = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Setting the local storage, with then notesList array
  localStorage.setItem("notes-list", JSON.stringify(notesList));

  return (
    <div className="App" onDragOver={handleDrageOver}>
      <div className="title-section">
        <h2 className="title">Sticky Notes</h2>
        <button className="add-note-btn" onClick={() => addNote(blankNote)}>
          Add Note ➕ {/* Calling the addNote handler on click of button */}
        </button>
        <button className="clear-board-btn" onClick={handleClearBoard}>
          Clear Board 🔄
          {/* Calling the clear board handler on click of button */}
        </button>
      </div>
      <div className="main-container">
        {/* Conditionally Rendering the notesList array by mapping through the array*/}
        {notesList.length > 0 &&
          /* Passing each note and its index as parameters in the map function */
          notesList.map((note, index) => {
            return (
              <div
                /* Calculating and Applyinf the top and left CSS property of each note on subsequent addition odf the notes */
                style={{
                  top: `${Math.ceil(note.id / 5) * note.top}px`,
                  left: `${
                    Math.ceil(note.id % 5) === 0
                      ? note.left + 4 * 250
                      : note.left + (Math.ceil(note.id % 5) - 1) * 250
                  }px`,
                  zIndex: `${note.pinned ? 1 : 0}`, //Applying z-index CSS property to stack the pinned note over the top
                }}
                key={note.id}
                className="note-container"
                draggable={note.pinned ? false : true} //Setting the draggable property according to pinned value of each note
                onDragEnd={handleDropNote} //on Drag End event executing the DropNote handler
              >
                <div className="btn-container">
                  {/* Button Container having 3 buttons - Edit, Pin, and Delete */}
                  <button
                    className="edit-btn"
                    onClick={() => handleCursor(index)}
                  >
                    Edit
                    {/* On click of Edit button, execute the cursor handler to point the cursor to the beginning of the text */}
                  </button>
                  <button
                    className="pin-btn"
                    onClick={() => {
                      handlePin(index);
                    }}
                  >
                    Note# {note.id} 📌
                    {/* on click of Pin button, execute the Pin Note handler to toggle the pinned value of each note */}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    ✖
                    {/* on click of Delete button, execute the Delete Note handler to delete the note */}
                  </button>
                </div>
                <textarea
                  /* Text area were the note text can be entered */
                  className={`text-area-${index}`}
                  ref={(ele) => (textAreaRefs.current[index] = ele)} //Providing the reference to each textArea element
                  value={note.text}
                  placeholder="type here..!!"
                  onChange={(e) => updateNote(e.target.value, index)} //On change event handler to handle the change in the input value of textArea
                ></textarea>
                <div className="footer-container">
                  {/* Footer Container to display the createdOn value and if the note is pinned or not */}
                  <span>{note.createdOn}</span>
                  <span>{note.pinned ? "Pinned" : ""}</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;

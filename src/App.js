import "./App.scss";
import { useRef, useState } from "react";

function App() {
  const blankNote = {
    id: null,
    text: "",
    createdOn: null,
    pinned: null,
    top: 120,
    left: 20,
  };

  const textAreaRefs = useRef([]);

  const [notesList, setNotesList] = useState(
    JSON.parse(localStorage.getItem("notes-list")) || []
  );

  const addNote = (note) => {
    let newNotesList = [...notesList];
    note.createdOn = new Date().toDateString();
    note.id = newNotesList.length + 1;
    newNotesList.push(note);
    setNotesList(newNotesList);
  };

  const updateNote = (value, index) => {
    let newNotesList = [...notesList];
    newNotesList[index].text = value;
    setNotesList(newNotesList);
  };

  const handleDrageOver = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const handleDropNote = (event) => {
    event.target.style.left = `${event.pageX - 50}px`;
    event.target.style.top = `${event.pageY - 50}px`;
  };

  const handleDelete = (i) => {
    const filteredNotesList = notesList.filter((note, index) => {
      return index !== i;
    });
    setNotesList(filteredNotesList);
  };

  const handleCursor = (index) => {
    const textAreaRef = textAreaRefs.current[index];
    // Set the selection range to the beginning of the text area
    textAreaRef.setSelectionRange(0, 0);
    // Focus on the text area to ensure the cursor is visible
    textAreaRef.focus();
  };

  const handlePin = (index) => {
    let newNotesList = [...notesList];
    newNotesList[index].pinned = !newNotesList[index].pinned;
    setNotesList(newNotesList);
  };

  const handleClearBoard = () => {
    localStorage.clear();
    window.location.reload();
  };

  localStorage.setItem("notes-list", JSON.stringify(notesList));

  return (
    <div className="App" onDragOver={handleDrageOver}>
      <div className="title-section">
        <h2 className="title">Sticky Notes</h2>
        <button className="add-note-btn" onClick={() => addNote(blankNote)}>
          Add Note ➕
        </button>
        <button className="clear-board-btn" onClick={handleClearBoard}>
          Clear Board 🔄
        </button>
      </div>
      <div className="main-container">
        {notesList.length > 0 &&
          notesList.map((note, index) => {
            return (
              <div
                style={{
                  top: `${Math.ceil(note.id / 5) * note.top}px`,
                  left: `${
                    Math.ceil(note.id % 5) === 0
                      ? note.left + 4 * 250
                      : note.left + (Math.ceil(note.id % 5) - 1) * 250
                  }px`,
                  zIndex: `${note.pinned ? 1 : 0}`,
                }}
                key={index}
                className="note-container"
                draggable={note.pinned ? false : true}
                onDragEnd={handleDropNote}
              >
                <div className="btn-container">
                  <button
                    className="edit-btn"
                    onClick={() => handleCursor(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="pin-btn"
                    onClick={() => {
                      handlePin(index);
                    }}
                  >
                    Note# {note.id} 📌
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    ✖
                  </button>
                </div>
                <textarea
                  className={`text-area-${index}`}
                  ref={(ele) => (textAreaRefs.current[index] = ele)}
                  value={note.text}
                  placeholder="type here..!!"
                  onChange={(e) => updateNote(e.target.value, index)}
                >
                  {" "}
                </textarea>
                <div className="footer-container">
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

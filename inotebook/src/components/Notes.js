import React ,{useContext,useEffect,useState,useRef}from 'react'
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/notes/noteContext'
import AddNote from './AddNote';
import NoteItem from './NoteItem'
const Notes = (props) => {
  let navigate= useNavigate();
  const context = useContext(noteContext);
  const {notes,getNotes,editNote} = context;
  const [note, setNote] = useState({id:"",etitle : "", edescription:"",etag:""});
  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes();
    }
    else{
      navigate('/login');
    }
    // eslint-disable-next-line
  }, [])
  const ref = useRef(null);
  const refClose = useRef(null);
  const updateNote = (currentNote) =>{
    ref.current.click();
    setNote({
      id: currentNote._id,
      etitle:currentNote.title,
      edescription:currentNote.description,
      etag:currentNote.tag
    });
  }
  const handleUpdate = (e) =>{
    e.preventDefault();
    refClose.current.click();
    editNote(
      note.id,
      note.etitle,
      note.edescription,
      note.etag
    )
    props.showAlert("Updated Successfully","success")
  }
  const onChange = (e) =>{
      setNote({...note, [e.target.name]:e.target.value})
  }
  return (
    <>
    <AddNote showAlert={props.showAlert} />
    <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Launch demo modal
    </button>
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form className="my-3">
                  <div className="mb-3"> 
                      <label htmlFor="title" className="form-label">Title</label>
                      <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onChange} minLength={3} required/>
                  </div>
                  <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required/>
                  </div>
                  <div className="mb-3">
                  <label htmlFor="tag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange}/>
                  </div>
            </form>
          </div>
          <div className="modal-footer">
            <button onClick={handleUpdate} type="button" className="btn btn-primary">Update</button>
            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container mx-3">
          {notes.length===0 && 'No notes to display'}
        </div>
        {notes.map((note)=>{
          return <NoteItem key={note._id} note={note} updateNote = {updateNote} showAlert={props.showAlert}/>;
        })}
      </div>
    </>
  )
}

export default Notes
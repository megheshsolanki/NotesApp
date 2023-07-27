import { useState } from "react";
import NoteContext from './noteContext';

const NoteState = (props) =>{
      const host = 'http://localhost:5000'
      const [notes, setNotes] = useState([]);
      const getNotes = async () => {
        const response = await fetch(`${host}/api/notes/getAllNotes`,{
          method : 'GET',
          headers : {
            'Content-Type' : 'application/json',
            'auth-token' : localStorage.getItem('token')
          }
        });
        const json = await response.json();
        setNotes(json);
      }
      //Add
      const addNote = async (title,description,tag) =>{
        // eslint-disable-next-line
        const response = await fetch(`${host}/api/notes/addNote`,{
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json',
            'auth-token' : localStorage.getItem('token')
          },
          body: JSON.stringify({title,description,tag})
        });
        const note = await response.json();
        setNotes(notes.concat(note));
      }
      //Edit
      const editNote = async(id, title, description,tag) =>{
        const response = await fetch(`${host}/api/notes/updateNote/${id}`,{
          method : 'PUT',
          headers : {
            'Content-Type' : 'application/json',
            'auth-token' : localStorage.getItem('token')
          }
        });
        const json = await response.json();
        let newNotes = JSON.parse(JSON.stringify(notes));
        for (let index = 0; index < newNotes.length; index++) {
          if(newNotes[index]._id === id){
            newNotes[index].title=title;
            newNotes[index].description=description;
            newNotes[index].tag=tag;
            break;
          }
        }
        setNotes(newNotes);
      }
      //Delete
      const deleteNote = async (id) =>{
        const response = await fetch(`${host}/api/notes/deleteNote/${id}`,{
          method : 'DELETE',
          headers : {
            'Content-Type' : 'application/json',
            'auth-token' : localStorage.getItem('token')
          }
        });
        const json = await response.json();
        const newNotes = notes.filter((note)=>{
          return note._id !== id
        });
        setNotes(newNotes);
      }
      return (
        <NoteContext.Provider value={{notes,setNotes,addNote,deleteNote,editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
      )
}

export default NoteState;
import React,{useState,useEffect} from 'react';
import { projectStorage, projectFirestore, timestamp } from "../firebase/config";
import ProgressBar2 from '../components/ProgressBar2';
import './ModalForm.css'


const ModalForm = ()=>{
    const[file,setFile] = useState(null);
    const[error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState(null);
    const [uploading, setUploading]=useState(false)

    const imgTypes = ['image/png','image/jpeg'];
    useEffect(()=>{
        setFile(null)
        setUploading(false)
    },[url])


    const changeFileHandler=(e)=>{
        let selected = e.target.files[0];
     
        if(selected && imgTypes.includes(selected.type)){
            setFile(selected)
            setError('')
        }else{
            setFile(null);
            setError('Please select an image file (png or jpeg)')
        }
    }

    const handleUpload = () => {
        setUploading(true)
        const collectionRef = projectFirestore.collection("images");
        const storageRef = projectStorage.ref(`images/${file.name}`);
        storageRef.put(file).on('state_changed', (snap)=>{
            let percentage = (snap.bytesTransferred/snap.totalBytes)*100;
            setProgress(percentage);
            
          
        },(err)=>{
            setError(err)
            console.log(error)
        },()=>{
            projectStorage.ref("images").child(file.name).getDownloadURL().then(url=>{
                const createdAt = timestamp();
                collectionRef.add({url, createdAt})
                setUrl(url)
            })
     
        })
    }
        return (
            <div>
                <form>
                <div>
                        <label for="heroname" className="labelHero">Hero Name:</label>
                        <input type="text" id="heroname" className="inputHero" placeholder="   Write Hero Name"></input>
                    </div>
                    <div>
                        <label for="heroalias" className="labelHero">Hero Alias:</label>
                        <input type="text" id="heroalias" className="inputHero" placeholder="   Write Hero Alias"></input>
                    </div>
                    <div>
                        <label for="heroplace" className="labelHero">Place of Birth:</label>
                        <input type="text" id="heroplace" className="inputHero" placeholder="   City or Country"></input>
                    </div>
                    <div>
                        <label for="heroage" className="labelHero">Age:</label>
                        <input type="number" id="heroage" className="inputHero"  min="0" maxlength="5" ></input>
                    </div>
                    <div>
                        <label for="herostrength" className="labelHero">Strength:</label>
                        <input type="number" id="herostrength" className="inputHero" min="0" maxlength="5" ></input>
                    </div>
                    <div>
                        <label for="heroint" className="labelHero">Intelligence:</label>
                        <input type="number" id="heroint" className="inputHero" min="0" maxLength="5"></input>
                    </div>
                    <div>
                        <label for="herodur" className="labelHero">durability</label>
                        <input type="number" id="herodur" className="inputHero" min="0" maxLength="5"></input>
                    </div>
                    <div>
                        <label for="herospeed" className="labelHero">Speed:</label>
                        <input type="number" id="herospeed" className="inputHero" min="0" maxLength="5"></input>
                    </div> 
                    <div>
                        <label for="heropower" className="labelHero">Power:</label>
                        <input type="number" id="heropower" className="inputHero" min="0" maxLength="5"></input>
                    </div> 
                    <div>
                        <label for="herocombat" className="labelHero">Combat:</label>
                        <input type="number" id="herocombat" className="inputHero" min="0" maxLength="5"></input>
                    </div>
                    <div>
                        <input type="file" onChange={changeFileHandler}/>
                    </div>
                    <div>
                        <button type="button" onClick={handleUpload}>Create hero</button>
                    </div>
                    {error&&<div className="error">{error}</div>}
                    {file&& <div>{file.name}</div>}
                    {uploading&& <ProgressBar2 progress={progress}/>}                   
                </form>
            </div>
        )
          
}

export default ModalForm



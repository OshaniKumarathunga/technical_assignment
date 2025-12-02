import React, {useState, useEffect} from 'react';

const API_BASE = "http://127.0.0.1:8000/api/stories";

function App(){
  const [emojiInput, setEmojiInput] = useState('');
  const [author, setAuthor] = useState('');
  const [preview, setPreview] = useState('');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    loadStories();
  }, []);

  useEffect(()=> {
    const t = setTimeout(()=> {
      previewTranslation();
    }, 400);
    return ()=> clearTimeout(t);
  }, );

  function parseEmojiInput(text){
    const trimmed = text.trim();
    if(!trimmed) return [];
    return trimmed.split(/\s+/);
  }

  async function previewTranslation(){
    const seq = parseEmojiInput(emojiInput);
    if(seq.length === 0){
      setPreview('');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/translate/`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({emoji_sequence: seq, author_nickname: author || "Someone"})
      });
      const data = await res.json();
      setPreview(data.translation);
    } catch (err){
      setPreview("Could not load preview.");
    }
  }

  async function loadStories(){
    setLoading(true);
    try {
      const res = await fetch(API_BASE + '/');
      const data = await res.json();
      setStories(data);
    } catch (e){
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function createStory(e){
    e.preventDefault();
    const seq = parseEmojiInput(emojiInput);
    if(seq.length === 0) return alert("Add some emojis (space separated).");
    const payload = {emoji_sequence: seq, author_nickname: author || "Anonymous"};
    try {
      const res = await fetch(`${API_BASE}/create/`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      if(res.ok){
        await res.json();
        setEmojiInput('');
        setPreview('');
        loadStories();
      } else {
        const err = await res.json();
        alert("Error: " + JSON.stringify(err));
      }
    } catch (err){
      alert("Network error");
    }
  }

  async function likeStory(id){
    try {
      await fetch(`${API_BASE}/${id}/like/`, {method: "POST"});
      loadStories();
    } catch(e){
      console.error(e);
    }
  }

  return (
    <div style={{maxWidth:900, margin:'20px auto', fontFamily: 'Arial, sans-serif'}}>
      <h1>Emoji Story Generator</h1>

      <form onSubmit={createStory}>
        <div>
          <label>Author nickname </label><br/>
          <input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Your nickname" />
        </div>
        <div >
          <label>Compose (type emojis separated by spaces)</label><br/>
          <input value={emojiInput} onChange={e=>setEmojiInput(e.target.value)} style={{width:'100%', fontSize:20}} placeholder="🐱 🐟" />
        </div>

        <div >
          <strong>Live translation preview:</strong>
          <div >{preview || <em>Type emojis to preview...</em>}</div>
        </div>

        <button type="submit">Save Story</button>
      </form>

      <hr/>

      <h2>Stories {loading ? "(loading...)" : ""}</h2>
      <div>
        {stories.length === 0 && <div>No stories yet.</div>}
        {stories.map(s => (
          <div key={s.id} style={{padding:10, borderBottom: '1px solid #ddd'}}>
            <div style={{fontSize:22}}>{s.emoji_sequence}</div>
            <div style={{marginTop:6}}><em>{s.translation}</em></div>
            <div style={{marginTop:6}}>
              <strong>By:</strong> {s.author_nickname} &nbsp; • &nbsp;
              <strong>Likes:</strong> {s.likes}
              <button onClick={()=>likeStory(s.id)} style={{marginLeft:10}}>Like </button>
            </div>
            <div style={{fontSize:12, color:'#666'}}>{new Date(s.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;


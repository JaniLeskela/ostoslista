import './App.css';
import {useState, useEffect} from 'react';

const URL = "http://localhost/lista/"

function App() {

  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const[description, setDescription] = useState('');
  const[amount,setAmount] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [editDescription,setEditDescription] = useState('');
  const [editAmount,setEditAmount] = useState('');

  useEffect(() => {
    let status = 0;
    fetch(URL + "index.php")
    .then (res => {
     status = parseInt(res.status);
     return res.json();
    })
    .then(
      (res) => {
 
        if(status === 200) {
       setItems(res);
       } else {
         alert(res.error);
       }
 
      }, (error) => {
       alert("An error has occurred, please try again later.");
      }
    )
  }, [])

  function save(e) {
    e.preventDefault();
    let status = 0;
    fetch(URL + 'create.php',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        description: description,
        amount: amount
      })
    })
    .then (res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          setItems(items=>[...items,res]);
          setItem('');
        }else {
          alert(res.error);
        }
      }, (error) => {
        alert('Häiriö järjestelmässä, yritä kohta uudelleen');
      }
    )
   }

   function remove(id) {
    let status = 0;
    fetch(URL + 'delete.php', {
      method: 'POST',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        id: id
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error);
      }
    )
  }

  function update(e) {
    e.preventDefault();
    let status = 0;
    fetch(URL + 'update.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: editItem.id,
        description: editDescription,
        amount: editAmount
      })
    })
    .then(res=> {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          items[(items.findIndex(item=> item.id === editItem.id))].description = editDescription;
          items[(items.findIndex(item=> item.id === editItem.id))].amount = editAmount;
          setItems([...items]); 
          setEditItem(null);
          setEditDescription('');
          setEditAmount('');
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error);
      }
    )
  }

  function setEditedItem(item) {
    setEditItem(item);
    setEditDescription(item?.description);
    setEditAmount(item?.amount);
  }

  return (
    <div className="container">
      <h3>Shopping list</h3>
      <form onSubmit={save}>
      <label>New item</label>
      <input value={description} onChange={e => setDescription(e.target.value)}/>
      <label>Amount</label>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)}/>
      <button>Save</button>
      </form>
      <hr/>

      <table>
        <tr>
          <th>Item</th>
          <th>Amount</th>
        </tr>

        {items.map(item => (
          <tr key={item.id}>

            <td>
            {editItem?.id !==  item.id &&
            item.description
            }
            {editItem?.id === item.id && 
              <input value={editDescription} onChange={e => setEditDescription(e.target.value)}/>
            }
            </td>

            <td>
            {editItem?.id !==  item.id &&
            item.amount
            }

           {editItem?.id === item.id && 
            <form onSubmit={update}>
              <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)}/>
              <button>Save</button>
              <button type="button" onClick={() => setEditedItem(null)}>Cancel</button>
            </form>
            }
            </td>

            <a onClick={() => remove(item.id)} href="#">
              <button>
              Delete
              </button>
            </a>&nbsp;

            {editItem === null && 
            <a onClick={() => setEditedItem(item)} href="#">
              <button>
              Edit
              </button>
            </a>}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;

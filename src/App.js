import './App.css';
import Plotting from './Components/Plotting';
import data from './data/db.json';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: 'white' }}>
        <Plotting points={data.points} curves={data.curves} />
      </header>

    </div>
  );
}

export default App;

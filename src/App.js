import './App.css';
import {BrowserRouter as Router} from 'react-router-dom'
import Header from './components/header/Header'
import Body from './components/Body';
import Footer from './components/footer/Footer';
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Body />
        <Footer />
      </div>
    </Router>
    
  );
}

export default App;

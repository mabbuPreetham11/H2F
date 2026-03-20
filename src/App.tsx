import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Body from './components/Dashboard/Body'
import Dashboard from './Dashboard';
import Home from './Home';

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/home' element={<Home/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App

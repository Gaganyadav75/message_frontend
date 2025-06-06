
import { Provider } from 'react-redux';
import './App.css'
import Applcation from './pages/main/Application'

import store from './redux/store';

function App() {


  return (
    <>
      <Provider store={store}>
        <Applcation/>
      </Provider>
    
    </>
  )
}

export default App

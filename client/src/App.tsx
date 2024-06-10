
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Assessments from './screens/Assessments';
import CreateTemplate from './screens/CreateTemplate';
import Templates from './screens/Templates';

function App() {
  return (
    <>
    <Routes>
      <Route element={<Layout/>} >
        <Route path='/create-template' element={<CreateTemplate/>} />
        <Route path='/assessments' element={<Assessments/>} />
        <Route path='/templates' element={<Templates/>} />
        <Route path='/add-template' element={<CreateTemplate/>} />
      </Route>
    </Routes>
    </>
  )
}

export default App;

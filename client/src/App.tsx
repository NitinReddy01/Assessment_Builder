
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Assessments from './screens/Assessments';
import CreateTemplate from './screens/CreateTemplate';
import Templates from './screens/Templates';
import CreateAssessment from './screens/CreateAssessment';
import ViewTemplate from './screens/ViewTemplate';
import ViewAssessment from './screens/ViewAssessment';

function App() {
  return (
    <>
    <Routes>
      <Route element={<Layout/>} >
        <Route path='/' element={<Assessments/>} />
        <Route path='/templates' element={<Templates/>} />
        <Route path='/create-template' element={<CreateTemplate/>} />
        <Route path='/view-template/:id' element={<ViewTemplate/>} />
        <Route path='/view-assessment/:id' element={<ViewAssessment/>} />
        <Route path='/create-assessment/:template' element={<CreateAssessment/>} />
      </Route>
    </Routes>
    </>
  )
}

export default App;

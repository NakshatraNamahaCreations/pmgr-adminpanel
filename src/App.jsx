import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';
import BlogPage from './components/Blog';
import AddBlog from './components/AddBlog';
import EditBlog from './components/EditBlog';



function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage/>}/>
          <Route path='/blog' element={<BlogPage/>}/>
          <Route path='/add-blog' element={<AddBlog/>}/>
     <Route path="/edit-blog/:id" element={<EditBlog />} />

        </Routes>
      </Router>
    </>
  )
}

export default App

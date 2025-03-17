
import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage/HomePage'
import Create from './pages/Create/Create'
import Container from './components/Container/Container'
import Run from './pages/Run/Run'

function App() {


  return (

    <Container>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<Create />} />
        <Route path="/run/:id" element={<Run />} />
        <Route path="/edit/:id" element={<Create />} />
      </Routes>
    </Container>




  )
}

export default App

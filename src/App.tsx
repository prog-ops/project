import './App.css'
import MySelect from "./components/MySelect.tsx";

const options = [
    {label: 'Option 1',                             value: 1},
    {label: 'Option with icon',                     value: 2},
    {label: 'Long Long Option 3',                     value: 3},
    {label: 'Long Long Long Option 4',         value: 4},
    {label: 'Long Long Long Long Option 5',    value: 5},
    {label: 'Long Long Long Long Long Option 6',    value: 6},
]

function App() {
  return (
    <>
      <MySelect
          options={options}
          onSelect={(option) => console.log('Selected:', option)}
          searchable
      />
    </>
  )
}

export default App

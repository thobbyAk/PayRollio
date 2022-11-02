import "./App.css";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalState";
import Index from "./pages/Index";
import AddEmployee from "./pages/AddEmployee";
import Credit from "./pages/Credit";
import EmployeePage from "./pages/Employee";

function App() {
	return (
		<Router>
			<GlobalProvider>
				<Layout>
					<Routes>
						<Route path="/" element={<Index />} />
						<Route path="/employee" element={<EmployeePage />} />
						<Route path="/add-employee" element={<AddEmployee />} />
						<Route path="/credits" element={<Credit />} />
					</Routes>
				</Layout>
			</GlobalProvider>
		</Router>
	);
}

export default App;

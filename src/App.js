import "./App.css";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalState";
import Index from "./pages/Index";
import AddEmployee from "./pages/AddEmployee";
import Credit from "./pages/Credit";
import EmployeePage from "./pages/Employee";
import Voting from "./pages/Voting";
import EmployeeView from "./components/Modals/EmployeeView";
import AddProposal from "./pages/AddProposal";

function App() {
	return (
		<Router>
			<GlobalProvider>
				<Layout>
					<Routes>
						<Route exact path="/" element={<Index />} />
						<Route path="/employee" element={<EmployeePage />} />
						<Route path="/add-employee" element={<AddEmployee />} />
						<Route path="/credits" element={<Credit />} />
						<Route path="/voting" element={<Voting />} />
						<Route path="/add-proposal" element={<AddProposal />} />
					</Routes>
				</Layout>
			</GlobalProvider>
		</Router>
	);
}

export default App;

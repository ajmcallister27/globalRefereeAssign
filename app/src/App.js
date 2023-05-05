import './App.css';
import gameData from './data/allGames.json'
import { DataGrid } from '@mui/x-data-grid';
import { Link } from '@mui/material';

console.log(gameData);

const columns = [
	{ field: 'source', headerName: 'Source', width: 100 },
	{
		field: 'id',
		headerName: 'Game ID',
		width: 100,
		renderCell: (params) => (
			<Link href={`https://www.ekcsra.org/refereeinquiry?action=Display&key=${params.value}`}>{params.value}</Link>
		)
	},
	{ field: 'date', headerName: 'Date', width: 200 },
	{ field: 'time', headerName: 'Time', width: 100 },
	{ field: 'field', headerName: 'Field', width: 150 },
	{ field: 'gender', headerName: 'Gender', width: 70 },
	{ field: 'level', headerName: 'Level', width: 70 },
	{ field: 'home', headerName: 'Home Team', width: 230 },
	{ field: 'away', headerName: 'Away Team', width: 230 },
	{ field: 'ref', headerName: 'Ref', width: 130 },
	{ field: 'refPay', headerName: 'Ref Pay', width: 100 },
	{ field: 'ar1', headerName: 'AR 1', width: 130 },
	{ field: 'ar1Pay', headerName: 'AR 1 Pay', width: 100 },
	{ field: 'ar2', headerName: 'AR 2', width: 130 },
	{ field: 'ar2Pay', headerName: 'AR 2 Pay', width: 100 },
];

function Links() {
	return (
		<div className='Links'>
			<h2>Available Games:</h2>
		</div>
	);
}


function Data() {
	return (
		<div style={{ height: 555, width: '100%' }}>
			<DataGrid
				showCellVerticalBorder={true}
				rows={gameData}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5]}
			/>
		</div>
	);
}

function App() {
	return (
		<div className="App">
			<div className='App-header'>
				<h1>Global Referee Assigning Site</h1>
				<h2>GRASS</h2>
			</div>
			<Links />
			<Data />
		</div>
	);
}

export default App;

import './App.css';
import gameData from './data/allGames.json'
import { DataGrid } from '@mui/x-data-grid';
import { Link, Button, ButtonGroup } from '@mui/material';
import { useState } from 'react';

const columns = [
	{
		field: 'source',
		headerName: 'Source',
		width: 100,
		renderCell: (params) => {
			if (params.value === 'EKCSRA') {
				return <Link href='https://www.ekcsra.org'>EKCSRA</Link>
			}
			if (params.value === 'GameOfficials') {
				return <Link href='https://www.gameofficials.net'>GameOfficials</Link>
			}
			if (params.value === 'NSO') {
				return <Link href='https://www.nso.arbitersports.com'>NSO</Link>
			}
		}
	},
	{
		field: 'id',
		headerName: 'Game ID',
		width: 90,
		renderCell: (params) => (
			<Link href={`https://www.ekcsra.org/refereeinquiry?action=Display&key=${params.value}`}>{params.value}</Link>

		)
	},
	{ field: 'date', headerName: 'Date', width: 200 },
	{ field: 'time', headerName: 'Time', width: 100 },
	{
		field: 'field',
		headerName: 'Field',
		width: 150,
		renderCell: (params) => {
			if (params.value) {
				return <Link href={`https://www.ekcsra.org/fields.php?filKey=&filName=${params.value.split(' ')[0]}`}>{params.value}</Link>
			}
		}
	},
	{ field: 'gender', headerName: 'Gender', width: 70 },
	{ field: 'level', headerName: 'Level', width: 70 },
	{ field: 'home', headerName: 'Home Team', width: 230 },
	{ field: 'away', headerName: 'Away Team', width: 230 },
	{ field: 'notes', headerName: 'Notes', width: 240 },
	{
		field: 'ref',
		headerName: 'Ref',
		width: 230,
		renderCell: (params) => {
			console.log(params);
			if (params.value === ' ' || !params.value) {
				if (params.row.source === 'EKCSRA') {
					return <Link href={`https://www.ekcsra.org/selfassign.php?x_formdata_form=&match=${params.row.id}&position=Ref&action=Request&r_xmatch=${params.row.id}+&r_xposition=Ref`}>Assign</Link>
				}
			}
		}
	},
	{ field: 'refPay', headerName: 'Ref Pay', width: 100 },
	{
		field: 'ar1',
		headerName: 'AR 1',
		width: 230,
		renderCell: (params) => {
			console.log(params);
			if (params.value === ' ' || !params.value) {
				if (params.row.source === 'EKCSRA') {
					return <Link href={`https://www.ekcsra.org/selfassign.php?x_formdata_form=&match=${params.row.id}&position=AR1&action=Request&r_xmatch=${params.row.id}+&r_xposition=Ref`}>Assign</Link>
				}
			}
		}
	},
	{ field: 'ar1Pay', headerName: 'AR 1 Pay', width: 100 },
	{
		field: 'ar2',
		headerName: 'AR 2',
		width: 230,
		renderCell: (params) => {
			console.log(params);
			if (params.value === ' ' || !params.value) {
				if (params.row.source === 'EKCSRA') {
					return <Link href={`https://www.ekcsra.org/selfassign.php?x_formdata_form=&match=${params.row.id}&position=AR2&action=Request&r_xmatch=${params.row.id}+&r_xposition=Ref`}>Assign</Link>
				}
			}
		}
	},
	{ field: 'ar2Pay', headerName: 'AR 2 Pay', width: 100 },
];

function Data() {
	return (
		<div style={{ height: 555, width: '75%' }}>
			<h2>Available Games:</h2>
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


function GameData() {
	const [gdDisplay, setgdDisplay] = useState(false);

	function handleDetailClick() {
		setgdDisplay(!gdDisplay);
	}

	return (
		<div className='GameData box'>
			<h2>Game Details</h2>
			<div className='Links'>
				<ButtonGroup variant="contained" aria-label="outlined primary button group">
					<Button onClick={handleDetailClick}>{gdDisplay ? 'Less' : 'More'} details</Button>
				</ButtonGroup>
			</div>
			{gdDisplay ? <p>Details that are super cool</p> : <p>No details to display</p>}
		</div>
	)
}

function App() {
	return (
		<div className="App">
			<div className='App-header'>
				<h1>Global Referee Assigning Site</h1>
				<h2>GRASS</h2>
			</div>
			<div className='flex'>
				<Data />
				<GameData />
			</div>
		</div>
	);
}

export default App;

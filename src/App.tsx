import { MultiSelectUnstyled } from '@mui/base';
import {
	Box,
	Chip,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactSelect, { MultiValue } from 'react-select';
import './App.scss';
import { Agent } from './interfaces/Agents';
import { Department } from './interfaces/Companies';
import { ServiceItem } from './interfaces/ServiceItem';
import { ServiceCategory } from './interfaces/ServicePackage';
import axiosConfig from './Utils/axiosConfig.js';

function App() {
	const [optionSelected, setOptionSelected] = useState<any>(null);
	const [selectedID, setSelectedID] = useState<Number>(0);
	const [items, setItems] = useState<any>([]);
	const [multiSelectOptions, setMultiSelectOptions] = useState<any>([]);
	const [listOfCompanies, setListOfCompanies] = useState<[] | Department[]>(
		[]
	);

	const [listOfServicePackage, setListOfServicePackage] = useState<
		[] | ServiceCategory[]
	>([]);
	const [listOfServiceItem, setlistOfServiceItem] = useState<
		[] | ServiceItem[]
	>([]);
	const [listOfAgents, setListOfAgents] = useState<[] | Agent[]>([]);
	const [serviceItem, setserviceItem] = useState<string[]>([]);
	const [number, setNumber] = useState(0);
	useEffect(() => {
		const getCompanies = async () => {
			return axiosConfig.get('/api/v1/getCompanies');
		};
		const getServicePackage = async () => {
			return axiosConfig.get('/api/v1/getServicePackage');
		};
		const getServiceItem = async () => {
			return axiosConfig.get('/api/v1/getServiceItem');
		};
		const getAgents = async () => {
			return axiosConfig.get('/api/v1/getAgents');
		};

		const getData = async () => {
			axios
				.all([
					getCompanies(),
					getServicePackage(),
					getServiceItem(),
					getAgents(),
				])
				.then((res) => {
					if (res[0].data['ok']) {
						setListOfCompanies(
							res[0].data['companies']['departments']
						);
					}
					if (res[1].data['ok']) {
						setListOfServicePackage(
							res[1].data['servicePackage']['service_categories']
						);
					}
					if (res[2].data['ok']) {
						setlistOfServiceItem(
							res[2].data['servicePackage']['service_items']
						);
					}
					if (res[3].data['ok']) {
						setListOfAgents(res[3].data['data']['agents']);
					}
				});
		};
		getData();
	}, []);

	// const getServiceItemByID = async (id: Number) => {
	// 	const selectedDisplayID = listOfServiceItem.filter(
	// 		(service_item: ServiceItem) => {
	//
	// 				'selectedID:',
	// 				id,
	// 				'service_item.id',
	// 				service_item.id
	// 			);

	// 			if (id.toString() === service_item.category_id.toString()) {
	// 				return service_item.display_id;
	// 			}
	// 		}
	// 	);
	//

	// 	const response = await axiosConfig.get(
	// 		`/api/v1/getServiceItemByID/${selectedDisplayID[0].display_id}`
	// 	);
	// 	if (response.data['ok']) {
	//
	// 		setSelectedServiceItem(
	// 			response.data['servicePackage']['service_item']
	// 		);
	// 	}
	// };
	const colourOptions = [
		{ value: 'ocean1', label: 'Ocean' },
		{ value: 'blue', label: 'Blue' },
		{ value: 'purple', label: 'Purple' },
		{ value: 'red', label: 'Red' },
		{ value: 'orange', label: 'Orange' },
		{ value: 'yellow', label: 'Yellow' },
		{ value: 'green', label: 'Green' },
		{ value: 'forest', label: 'Forest' },
		{ value: 'slate', label: 'Slate' },
		{ value: 'silver', label: 'Silver' },
	];
	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
				width: 250,
			},
		},
	};

	const handleChange = (event: SelectChangeEvent<typeof serviceItem>) => {
		const {
			target: { value },
		} = event;
		setserviceItem(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value
		);
	};
	// const Option = (props:any) => {
	//   return (
	//     <div>
	//       <components.Option {...props}>
	//         <input
	//           type="checkbox"
	//           checked={props.isSelected}
	//           onChange={() => null}
	//         />{" "}
	//         <label>{props.label}</label>
	//       </components.Option>
	//     </div>
	//   );
	// };
	return (
		<div>
			<h2>{JSON.stringify(selectedID)}</h2>
			<h2>List of companies</h2>
			<form>
				<select name="" id="">
					<option defaultValue={'default'}>Select Companies</option>
					{listOfCompanies.map((department: Department) => {
						return (
							<option
								key={department.id}
								value={department.name}
								aria-label={department.name}
							>
								{department.name}
							</option>
						);
					})}
				</select>
				<br />
				<h2>List of Service Package</h2>
				<select
					name="List of Service Package"
					id="List of Service Package"
					onChange={async (e) => {
						setOptionSelected([]);
						const id = parseInt(e.target.value);
						setMultiSelectOptions(
							listOfServiceItem
								.map((serviceItem) => {
									if (
										serviceItem.category_id === 19000244408
									) {
										return {
											label: serviceItem.name,
											value: serviceItem.name,
										};
									}
								})
								.filter(function (el) {
									return el != null;
								})
						);
						setserviceItem([]);
						setSelectedID(id);
					}}
				>
					<option defaultValue={'default'}>
						Select Service Package
					</option>
					{listOfServicePackage.map(
						(ServiceCategory: ServiceCategory) => {
							return (
								<option
									key={ServiceCategory.id}
									value={ServiceCategory.id}
									aria-label={ServiceCategory.name}
								>
									{ServiceCategory.name}
								</option>
							);
						}
					)}
				</select>
				<br />
				{/* <h2>List of Service Item</h2>
				{JSON.stringify(listOfServiceItem)}
				<h1>ID</h1>
				{JSON.stringify(selectedID)} */}

				<h1>Service Item by ID</h1>
				<select name="" id="">
					<option defaultValue={'default'}>
						Please Select Service Package
					</option>
					{listOfServiceItem.map((serviceItem: ServiceItem) => {
						if (serviceItem.category_id === selectedID) {
							return (
								<option
									key={serviceItem.id}
									value={serviceItem.name}
								>
									{serviceItem.name}
								</option>
							);
						}
					})}
				</select>
				<InputLabel id="demo-multiple-chip-label">
					Please select Service Item
				</InputLabel>
				<Select
					labelId="demo-multiple-chip-label"
					id="demo-multiple-chip"
					multiple
					placeholder="Select Service item"
					value={serviceItem}
					style={{
						minWidth: 200,
					}}
					onChange={handleChange}
					input={
						<OutlinedInput
							id="select-multiple-chip"
							label="Chip"
							placeholder="Chip"
						/>
					}
					renderValue={(selected) => (
						<div>
							{selected.map((value) => (
								<Chip
									key={value}
									label={value}
									onClick={() => {
										console.log('HI');
									}}
								/>
							))}
						</div>
					)}
					MenuProps={MenuProps}
				>
					{listOfServiceItem.map((serviceItem: ServiceItem) => {
						if (serviceItem.category_id === selectedID) {
							return (
								<MenuItem
									key={serviceItem.id}
									value={serviceItem.name}
								>
									{serviceItem.name}
								</MenuItem>
							);
						}
					})}
				</Select>

				<ReactSelect
					isMulti
					className="multi_select"
					options={listOfServiceItem
						.map((serviceItem) => {
							if (serviceItem.category_id === selectedID) {
								return {
									label: serviceItem.name,
									value: serviceItem.name,
								};
							}
						})
						.filter(function (el) {
							return el != null;
						})}
					closeMenuOnSelect={false}
					hideSelectedOptions={false}
					onChange={(selected) => {
						console.log('selected', selected);
						setOptionSelected(selected);
					}}
					value={optionSelected}
				/>
				<select
					name="Select Agents"
					id="Agents"
					onChange={(e) => {
						console.log(e.target.value);
					}}
				>
					{listOfAgents.map((agent: Agent) => {
						return (
							<option
								key={agent.id}
								value={agent.first_name + ' ' + agent.last_name}
								aria-label={
									agent.first_name + ' ' + agent.last_name
								}
							>
								{agent.first_name + ' ' + agent.last_name}
							</option>
						);
					})}
				</select>
			</form>
		</div>
	);
}

export default App;

import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.scss';
import { Companies, Department } from './interfaces/Companies';
import { ServiceItem } from './interfaces/ServiceItem';
import { ServiceCategory, ServicePackage } from './interfaces/ServicePackage';
import axiosConfig from './Utils/axiosConfig.js';
function App() {
	const [selectedID, setSelectedID] = useState<Number>(0);
	const [selectedServiceItem, setSelectedServiceItem] =
		useState<ServiceItem>();
	const [listOfCompanies, setListOfCompanies] = useState<[] | Department[]>(
		[]
	);
	const [listOfServicePackage, setListOfServicePackage] = useState<
		[] | ServiceCategory[]
	>([]);
	const [listOfServiceItem, setlistOfServiceItem] = useState<
		[] | ServiceItem[]
	>([]);

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

		const getData = async () => {
			axios
				.all([getCompanies(), getServicePackage(), getServiceItem()])
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
				});
		};
		getData();
	}, []);

	// const getServiceItemByID = async (id: Number) => {
	// 	const selectedDisplayID = listOfServiceItem.filter(
	// 		(service_item: ServiceItem) => {
	// 			console.log(
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
	// 	console.log('display id', selectedDisplayID[0].display_id);

	// 	const response = await axiosConfig.get(
	// 		`/api/v1/getServiceItemByID/${selectedDisplayID[0].display_id}`
	// 	);
	// 	if (response.data['ok']) {
	// 		console.log(response.data['servicePackage']['service_item']);
	// 		setSelectedServiceItem(
	// 			response.data['servicePackage']['service_item']
	// 		);
	// 	}
	// };

	return (
		<div>
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
						const id = parseInt(e.target.value);
						console.log(e.target);
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
			</form>
		</div>
	);
}

export default App;

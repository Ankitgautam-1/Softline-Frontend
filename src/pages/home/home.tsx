import { SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Agent } from '../../interfaces/Agents';
import { Department } from '../../interfaces/Companies';
import { ServiceItem } from '../../interfaces/ServiceItem';
import { ServiceCategory } from '../../interfaces/ServicePackage';
import axiosConfig from '../../Utils/axiosConfig.js';
import 'antd/dist/antd.css';

import './home.scss';
import { useDispatch, useSelector } from 'react-redux';
import userReducer, {
	unAuth,
	userState,
} from '../../store/userAuth/userAuthSlice';
import { Navigate } from 'react-router-dom';
import Table from '../../components/table/Table';
function Home() {
	const dispatch: any = useDispatch();
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
	const authReducer = useSelector((state: { userReducer: userState }) => {
		return state.userReducer;
	});
	useEffect(() => {
		const getCompanies = async () => {
			return axiosConfig.get('/api/v1/getCompanies', {
				headers: {
					authorization: authReducer.accessToken.toString(),
				},
			});
		};
		const getServicePackage = async () => {
			return axiosConfig.get('/api/v1/getServicePackage', {
				headers: {
					authorization: authReducer.accessToken.toString(),
				},
			});
		};
		const getServiceItem = async () => {
			return axiosConfig.get('/api/v1/getServiceItem', {
				headers: {
					authorization: authReducer.accessToken.toString(),
				},
			});
		};
		const getAgents = async () => {
			return axiosConfig.get('/api/v1/getAgents', {
				headers: {
					authorization: authReducer.accessToken.toString(),
				},
			});
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
				})
				.catch((res) => {
					if (res.response.status === 403) {
						dispatch(unAuth());

						window.location.reload();
					}
				});
		};
		if (authReducer.auth) {
			getData();
		}
	}, []);
	if (!authReducer.auth) {
		return <Navigate to="/" replace />;
	}

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

	return (
		<div className="homepage_container">
			<Table />
		</div>
	);
}

export default Home;

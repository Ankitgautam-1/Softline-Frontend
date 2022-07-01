import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import './Table.scss';
import 'antd/dist/antd.css';
const { RangePicker } = DatePicker;

import axiosConfig from '../../Utils/axiosConfig';
import { Contract } from '../../interfaces/Contracts';
import { useDispatch, useSelector } from 'react-redux';
import { unAuth, userState } from '../../store/userAuth/userAuthSlice';
import { Box, Typography, Button } from '@mui/material';

import { CloseOutlined } from '@mui/icons-material';
import { DatePicker, Input, Space } from 'antd';
import moment, { Moment } from 'moment';
import { ServiceCategory } from '../../interfaces/ServicePackage';
import { ServiceItem } from '../../interfaces/ServiceItem';
import { Agent } from '../../interfaces/Agents';
import axios from 'axios';
import { Button as AntdButton } from 'antd';
import { Department } from '../../interfaces/Companies';
import ReactSelect from 'react-select';
import ModalComponents from '../Modal/Modal';

export default function Table() {
	const [openModel, setOpenModel] = useState(false);
	const authReducer = useSelector((state: { userReducer: userState }) => {
		return state.userReducer;
	});
	const dispatch: any = useDispatch();
	const [contracts, setContracts] = useState<[] | Contract[]>([]);
	const [optionSelected, setOptionSelected] = useState<any>(null);
	const [assets, setAssets] = useState<any>(null);
	const [selectedID, setSelectedID] = useState<Number>(0);
	const [selectedCompanyID, setselectedCompanyID] = useState<Number>(0);
	const [items, setItems] = useState<any>([]);
	const [multiSelectOptions, setMultiSelectOptions] = useState<any>([]);
	const [listOfCompanies, setListOfCompanies] = useState<[] | Department[]>(
		[]
	);
	const [contractPeriod, setContractPeriod] = useState('');
	const [listOfServicePackage, setListOfServicePackage] = useState<
		[] | ServiceCategory[]
	>([]);
	const [listOfServiceItem, setlistOfServiceItem] = useState<
		[] | ServiceItem[]
	>([]);
	const [listOfAgents, setListOfAgents] = useState<[] | Agent[]>([]);
	const [serviceItem, setserviceItem] = useState<string[]>([]);
	const [number, setNumber] = useState(0);
	//contract details
	const [contractID, setContractID] = useState('');
	const [contractName, setContractName] = useState('');
	const [selectedAgent, setSelectedAgent] = useState('');

	useEffect(() => {
		const getContracts = async () => {
			const result = await axiosConfig.get('/api/v1/getContract', {
				headers: {
					authorization: authReducer.accessToken.toString(),
				},
			});
			if (result.status === 200) {
				setContracts(result.data.contracts);
			}
		};
		getContracts();
	}, []);
	const asstesOptions = [
		{ value: 'CL1', label: 'CL1' },
		{ value: 'CL2', label: 'CL2' },
		{ value: 'CL3', label: 'CL3' },
		{ value: 'CL4', label: 'CL4' },
		{ value: 'CL5', label: 'CL5' },
		{ value: 'CL6', label: 'CL6' },
		{ value: 'CL7', label: 'CL7' },
	];
	const handleClose = () => {
		setOpenModel(false);
	};
	const handleOpen = () => {
		setOpenModel(true);
	};

	return (
		<div style={{ width: '100%' }} className="contanier">
			<br />
			<Button className="createButton" onClick={handleOpen}>
				Create Contract
			</Button>
			<ModalComponents handelCancel={handleClose} openModal={openModel} />
			{contracts.length > 0 && (
				<DataGrid
					className="table_container"
					autoHeight
					initialState={{
						pagination: {
							pageSize: 25,
						},
					}}
					key="table"
					columns={[
						{
							field: 'id',
							headerName: 'ID',
							width: 35,
							filterable: true,
						},
						{
							field: 'contractName',
							headerName: 'Contract Name',
							width: 150,
							filterable: true,
						},
						{
							field: 'company',
							headerName: 'Company',
							width: 150,
						},
						{
							field: 'servicePackage',
							headerName: 'Service Package',
							width: 200,
						},
						{
							field: 'serviceItem',
							headerName: 'Service Item',
							width: 200,
						},
						{
							field: 'assets',
							headerName: 'Assets',
							width: 100,
						},

						{
							field: 'startDate',
							headerName: 'Start Date',
							width: 200,
							renderCell(params) {
								return moment(params.value).format('ll');
							},
						},
						{
							field: 'endDate',
							headerName: 'End Date',
							width: 200,
							renderCell(params) {
								return moment(params.row.endDate).format('ll');
							},
						},

						{
							field: 'typeOfHours',
							headerName: 'Type Of Hours',
							width: 120,
						},
						{
							field: 'totalEntitlement',
							headerName: 'Total Entitlement',
							width: 120,
						},
						{
							field: 'projectManager',
							headerName: 'Manager',
							width: 120,
						},
						{
							field: 'remarks',
							headerName: 'Remarks',
							width: 120,
						},
					]}
					rows={contracts}
				/>
			)}
		</div>
	);
}

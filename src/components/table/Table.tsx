import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './Table.scss';
import 'antd/dist/antd.css';

import Cookies from 'js-cookie';
import { Contract } from '../../interfaces/Contracts';
import { useDispatch, useSelector } from 'react-redux';
import { unAuth, userState } from '../../store/userAuth/userAuthSlice';
import { Box, Typography, Button, Popover } from '@mui/material';

import { DatePicker, Input, Space } from 'antd';
import moment, { Moment } from 'moment';
import { ServiceCategory } from '../../interfaces/ServicePackage';
import { ServiceItem } from '../../interfaces/ServiceItem';
import { Agent } from '../../interfaces/Agents';

import { Department } from '../../interfaces/Companies';
import ModalComponents from '../Modal/Modal';
import { getContracts, resetContract } from '../../store/contracts';
import { AiFillEye, AiFillDelete, AiOutlinePoweroff } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import ViewContract from '../viewContract/viewContract';
import { dateDiff } from '../../Utils/helperFunction';
import { DeleteForever } from '@mui/icons-material';
import EditContract from '../editContract/editContract';
interface ViewContractProps {
	contract: Contract | null;
	openModal: boolean;
}
interface EditContractProps {
	contract: Contract | null;
	openModal: boolean;
}
export default function Table() {
	const [openModel, setOpenModel] = useState(false);
	const authReducer = useSelector((state: { userReducer: userState }) => {
		return state.userReducer;
	});
	const contractState = useSelector(
		(state: { contractState: Contract[] }) => {
			return state.contractState;
		}
	);
	const dispatch: any = useDispatch();
	const [contracts, setContracts] = useState<[] | Contract[]>([]);
	const [optionSelected, setOptionSelected] = useState<any>(null);
	const [viewContract, setViewContract] = useState<ViewContractProps>({
		openModal: false,
		contract: null,
	});
	const [editContract, seteditContract] = useState<EditContractProps>({
		openModal: false,
		contract: null,
	});
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
	const [pageSize, setpageSize] = useState(20);
	//contract details
	const [contractID, setContractID] = useState('');
	const [contractName, setContractName] = useState('');
	const [selectedAgent, setSelectedAgent] = useState('');
	const [editContractModal, setEditContractModal] = useState(true);

	useEffect(() => {
		if (authReducer.auth) {
			dispatch(getContracts());
		}
	}, [authReducer.auth]);
	const handleOpenViewContract = (contract: Contract) => {
		setViewContract({ contract: contract, openModal: true });
	};
	const handleCloseViewContract = () => {
		setViewContract({ contract: null, openModal: false });
	};
	const handleClose = () => {
		setOpenModel(false);
	};
	const handleOpen = () => {
		setOpenModel(true);
	};
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const [value, setValue] = React.useState<any>(null);
	const handleOpenEditContract = (contract: Contract) => {
		seteditContract({ contract: contract, openModal: true });
	};
	const handleCloseEditContract = () => {
		seteditContract({ contract: null, openModal: false });
	};
	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		const field = event.currentTarget.dataset.field!;
		const id = event.currentTarget.parentElement!.dataset.id!;

		const row = contractState.find((r) => r.id === id)!;
		if (field === 'endDate' || field === 'startDate') {
			setValue(moment(row[field as keyof typeof row]).format('ll'));
		}
		if (field === 'actions') {
			setValue('');
		} else {
			setValue(row[field as keyof typeof row]);
		}
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};
	const handleLogout = () => {
		dispatch(unAuth());
		dispatch(resetContract());
		Cookies.remove('accessToken', {
			path: '/',
			domain: 'localhost',
		});
	};
	const open = Boolean(anchorEl);

	return (
		<div style={{ width: '100%' }} className="contanier">
			<div className="buttons">
				<Button className="createButton" onClick={handleOpen}>
					Create Contract
				</Button>
				<Button className="logoutBtn" onClick={handleLogout}>
					Logout
				</Button>
			</div>

			<ModalComponents handelCancel={handleClose} openModal={openModel} />
			{editContract.openModal ? (
				<EditContract
					openModal={editContract.openModal}
					contract={editContract.contract}
					handelCancel={handleCloseEditContract}
				/>
			) : null}
			<ViewContract
				contract={viewContract.contract}
				openModal={viewContract.openModal}
				handelCancel={handleCloseViewContract}
			/>
			{contractState.length > 0 && (
				<>
					<DataGrid
						autoHeight
						key="table"
						// componentsProps={{
						// 	cell: {
						// 		onMouseEnter: handlePopoverOpen,
						// 		onMouseLeave: handlePopoverClose,
						// 	},
						// }}
						columns={[
							{
								field: 'actions',
								headerName: 'Actions',
								width: 130,
								renderCell(params) {
									return (
										<div
											style={{
												width: '120px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}
										>
											{' '}
											<AiFillEye
												style={{
													cursor: 'pointer',

													borderRadius: 5,
													border: 'none',
													padding: '5px',
													backgroundColor: '#06bb30',
													color: '#f3f3f3',
												}}
												size="30"
												onClick={(e) => {
													handleOpenViewContract(
														params.row
													);
												}}
											/>
											<FiEdit
												style={{
													cursor: 'pointer',

													borderRadius: 5,
													border: 'none',
													padding: '5px',
													backgroundColor: '#06bb30',
													color: '#f3f3f3',
												}}
												size="30"
												onClick={(e) => {
													handleOpenEditContract(
														params.row
													);
												}}
											/>
											<AiFillDelete
												style={{
													cursor: 'pointer',
													borderRadius: 5,
													border: 'none',
													padding: '5px',
													backgroundColor: '#d42c2c',
													color: '#f3f3f3',
												}}
												size="30"
											/>
										</div>
									);
								},
							},
							{
								field: 'state',
								headerName: 'State',
								width: 130,
								renderCell(params) {
									const startDate = moment(
										params.row.startDate
									);
									const endDate = moment(params.row.endDate);
									const diff = dateDiff(startDate, endDate);
									const dateDifference = endDate.diff(
										new Date(),
										'days'
									);

									const days =
										dateDifference > 0
											? `${dateDifference} days `
											: '';

									if (dateDifference > 20) {
										return (
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													height: '100%',
													width: '100%',
												}}
											>
												<div
													style={{
														backgroundColor:
															'#06bb30',
														minWidth: '80px',
														color: 'white',
														borderRadius: '6px',
														display: 'flex',
														alignItems: 'center',
														justifyContent:
															'center',

														padding: '5px 9px',
													}}
												>
													Active
												</div>
											</div>
										);
									} else if (
										dateDifference > 0 &&
										dateDifference <= 20
									) {
										return (
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													height: '100%',
													width: '100%',
												}}
											>
												<div
													style={{
														backgroundColor:
															'#ed940f',
														minWidth: '80px',
														color: 'white',
														borderRadius: '6px',
														display: 'flex',
														alignItems: 'center',
														justifyContent:
															'center',

														padding: '5px 9px',
													}}
												>
													Expring
												</div>
											</div>
										);
									} else {
										return (
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													height: '100%',
													width: '100%',
												}}
											>
												<div
													style={{
														backgroundColor:
															'#d42c2c',
														minWidth: '80px',
														color: 'white',
														borderRadius: '6px',
														display: 'flex',
														alignItems: 'center',
														justifyContent:
															'center',

														padding: '5px 9px',
													}}
												>
													Expiring
												</div>
											</div>
										);
									}
								},
							},
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
								width: 150,
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
									return moment(params.row.endDate).format(
										'll'
									);
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
						rows={contractState}
						pageSize={pageSize}
						onPageSizeChange={(e) => {
							setpageSize(e);
						}}
						rowsPerPageOptions={[20, 30, 40, 50]}
						checkboxSelection
						disableSelectionOnClick
					/>
					{value && (
						<Popover
							sx={{
								pointerEvents: 'none',
							}}
							open={open}
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							onClose={handlePopoverClose}
							disableRestoreFocus
						>
							<Typography sx={{ p: 1 }}>{`${value} `}</Typography>
						</Popover>
					)}
				</>
			)}
		</div>
	);
}

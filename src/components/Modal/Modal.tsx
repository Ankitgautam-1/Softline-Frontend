import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
const { RangePicker } = DatePicker;
import './Modal.scss';
import axiosConfig from '../../Utils/axiosConfig';
import { Contract } from '../../interfaces/Contracts';
import { useDispatch, useSelector } from 'react-redux';
import { unAuth, userState } from '../../store/userAuth/userAuthSlice';
import { Box, Typography, Button } from '@mui/material';

import { Modal } from 'antd';
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
import { asstesOptions } from '../../Utils/constData';
import { dateDiff } from '../../Utils/helperFunction';
type Props = {
	handelCancel: () => void;
	openModal: boolean;
};
const ModalComponents: React.FC<Props> = ({ handelCancel, openModal }) => {
	const authReducer = useSelector((state: { userReducer: userState }) => {
		return state.userReducer;
	});
	const dispatch: any = useDispatch();
	const [optionSelected, setOptionSelected] = useState<any>(null);
	const [assets, setAssets] = useState<any>(null);
	const [selectedID, setSelectedID] = useState<Number>(0);
	const [selectedCompanyID, setselectedCompanyID] = useState<Number>(0);
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
	//contract details
	const [contractID, setContractID] = useState('');
	const [contractName, setContractName] = useState('');
	const [selectedAgent, setSelectedAgent] = useState('');

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

	return (
		<Modal
			visible={openModal}
			onOk={handelCancel}
			footer={[
				<AntdButton key="btn" className="createButton">
					Create Contract
				</AntdButton>,
			]}
			className="modal_container"
			onCancel={handelCancel}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
			style={{ top: 10 }}
		>
			<div className="contract_container">
				<div className="form_container">
					<div className="left_side">
						<Typography className="label">Contract ID</Typography>
						<Input
							className="textInput"
							aria-label="contract"
							onChange={(e) => setContractID(e.target.value)}
						/>

						<Typography className="label">Company</Typography>
						<select
							name="select Company"
							className="selectInput"
							onChange={(e) => {
								setselectedCompanyID(parseInt(e.target.value));
							}}
						>
							<option defaultValue={'default'} key="default">
								Select Companies
							</option>
							{listOfCompanies.map((department: Department) => {
								return (
									<option
										key={department.id}
										value={department.id}
										aria-label={department.name}
									>
										{department.name}
									</option>
								);
							})}
						</select>
						<Typography className="label">Service Item</Typography>
						<ReactSelect
							isMulti
							className="multiSelect"
							options={listOfServiceItem
								.map((serviceItem) => {
									if (
										serviceItem.category_id === selectedID
									) {
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
						<Typography className="label">
							Contract Period{' '}
							{contractPeriod !== '' && (
								<div className="contractPeriod">
									{contractPeriod}
								</div>
							)}
						</Typography>

						<RangePicker
							className="datePicker"
							onChange={(e) => {
								const datediff = dateDiff(
									moment(e?.[0]),
									moment(e?.[1])
								);
								const years =
									datediff.years > 0
										? `${datediff.years} year `
										: '';
								const months =
									datediff.months > 0
										? `${datediff.months} month `
										: '';
								const days =
									datediff.days > 0
										? `${datediff.days} days `
										: '';

								setContractPeriod(years + months + days);
							}}
							disabledDate={(current) => {
								let customDate = moment().format('YYYY-MM-DD');
								return (
									current &&
									current < moment(customDate, 'YYYY-MM-DD')
								);
							}}
						/>
						<Typography className="label">Type of Hours</Typography>
						<select
							name="typeOfHours"
							className="selectInput"
							id=""
						>
							<option value="Proactive">Proactive</option>
							<option value="Reactive">Reactive</option>
							<option value="Both">Both</option>
						</select>
						<Typography className="label">Service Item</Typography>
						<ReactSelect
							isMulti
							menuPlacement="top"
							className="multiSelect"
							options={asstesOptions}
							closeMenuOnSelect={false}
							hideSelectedOptions={false}
							onChange={(selected) => {
								console.log('selected', selected);
								setAssets(selected);
							}}
							value={assets}
						/>
					</div>
					<div className="right_side">
						<Typography className="label">Contract Name</Typography>
						<Input
							className="textInput"
							required
							type={'text'}
							onChange={(e) => {
								setContractName(e.target.value);
							}}
						/>
						<Typography className="label">
							Service Package
						</Typography>

						<select
							className="selectInput"
							name="List of Service Package"
							id="List of Service Package"
							onChange={async (e) => {
								setOptionSelected([]);
								const id = parseInt(e.target.value);
								setMultiSelectOptions(
									listOfServiceItem
										.map((serviceItem) => {
											if (
												serviceItem.category_id ===
												selectedCompanyID
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
						<Typography className="label">Agents</Typography>
						{selectedAgent}
						<select
							className="selectInput"
							name="Select Agents"
							id="Agents"
							onChange={(e) => {
								setSelectedAgent(e.target.value);
							}}
						>
							{listOfAgents.map((agent: Agent) => {
								return (
									<option
										key={agent.id}
										value={
											agent.first_name +
											' ' +
											agent.last_name
										}
										aria-label={
											agent.first_name +
											' ' +
											agent.last_name
										}
									>
										{agent.first_name +
											' ' +
											agent.last_name}
									</option>
								);
							})}
						</select>
						<Typography className="label">
							Contract Hours
						</Typography>
						<Input
							className="textInput"
							type="number"
							min={1}
							required
						/>
						<Typography className="label">Remarks</Typography>
						<Input
							className="textInput"
							type="number"
							min={1}
							required
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalComponents;

import { Input, Typography } from '@mui/material';
import { DatePicker, Modal } from 'antd';
import moment from 'moment';
import React from 'react';
import ReactSelect from 'react-select';
import { Contract } from '../../interfaces/Contracts';
import { asstesOptions } from '../../Utils/constData';
import './viewContract.scss';
const { RangePicker } = DatePicker;
type Props = {
	handelCancel: () => void;
	openModal: boolean;
	contract: Contract | null;
};
const dateFormat = 'YYYY/MM/DD';
const ViewContract: React.FC<Props> = ({
	handelCancel,
	openModal,
	contract,
}) => {
	return (
		<Modal
			visible={openModal}
			onOk={handelCancel}
			footer={[]}
			style={{ top: 50 }}
			className="modal_container"
			onCancel={handelCancel}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<div className="contract_container">
				<div className="form_container">
					<div className="left_side" onSubmit={(e) => {}}>
						<Typography className="label">Contract ID</Typography>
						<Input
							className="textInput"
							aria-label="contract"
							disabled
							value={contract?.id}
						/>

						<Typography className="label">Company</Typography>

						<Input
							className="textInput"
							aria-label="contract"
							disabled
							value={contract?.company}
						/>
						<Typography className="label">Service Item</Typography>
						<ReactSelect
							isMulti
							className="multiSelect"
							isDisabled
							value={contract?.serviceItem.map((val) => {
								return { value: val, label: val };
							})}
						/>
						<Typography className="label">
							Contract Period
						</Typography>
						<RangePicker
							className="datePicker"
							defaultValue={[
								moment(contract?.startDate, dateFormat),
								moment(contract?.endDate, dateFormat),
							]}
						/>
						<Typography className="label">Type of Hours</Typography>
						<Input
							className="textInput"
							required
							type={'text'}
							disabled
							value={contract?.typeOfHours}
						/>
						<Typography className="label">Service Asset</Typography>
						<ReactSelect
							isMulti
							menuPlacement="top"
							className="multiSelect"
							closeMenuOnSelect={false}
							hideSelectedOptions={false}
							isDisabled
							value={contract?.assets.map((val) => {
								return { value: val, label: val };
							})}
						/>
					</div>
					<div className="right_side">
						<Typography className="label">Contract Name</Typography>
						<Input
							className="textInput"
							required
							type={'text'}
							disabled
							value={contract?.contractName}
						/>
						<Typography className="label">
							Service Package
						</Typography>

						<Input
							className="textInput"
							required
							type={'text'}
							disabled
							value={contract?.servicePackage}
						/>
						<Typography className="label">Agents</Typography>

						<Input
							className="textInput"
							required
							type={'text'}
							disabled
							value={contract?.projectManager}
						/>
						<Typography className="label">
							Contract Hours
						</Typography>
						<Input
							className="textInput"
							type="number"
							defaultValue={contract?.totalEntitlement}
							disabled
						/>
						<Typography className="label">Remarks</Typography>
						<Input
							className="textInput"
							type="text"
							defaultValue={contract?.remarks}
							disabled
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ViewContract;

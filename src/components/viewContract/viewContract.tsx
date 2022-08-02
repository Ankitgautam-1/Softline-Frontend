import { Input, Typography } from "@mui/material";
import { DatePicker, Modal } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import ReactSelect from "react-select";
import { Contract as C } from "../../interfaces/Contract";
import { asstesOptions } from "../../Utils/constData";
import "./viewContract.scss";
const { RangePicker } = DatePicker;
type Props = {
  handelCancel: () => void;
  openModal: boolean;
  contract: C | null;
};
const dateFormat = "YYYY/MM/DD";
const ViewContract: React.FC<Props> = ({
  handelCancel,
  openModal,
  contract,
}) => {
  useEffect(() => {
    if (contract) {
    }
  }, [contract]);

  console.log("contract", contract?.contractOwnerName);
  return (
    <Modal
      visible={openModal}
      onOk={handelCancel}
      footer={null}
      style={{ top: 0 }}
      className="modal_container"
      onCancel={handelCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="contract_container">
        <div className="form_container">
          <div className="left_side" onSubmit={(e) => {}}>
            <Typography className="label">Contract ID</Typography>
            <input
              className="textInput"
              aria-label="contract"
              readOnly
              value={contract?.id}
            />

            <Typography className="label">Company</Typography>

            <input
              className="textInput"
              aria-label="contract"
              readOnly
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
            <Typography className="label">Contract Period</Typography>
            <RangePicker
              className="datePicker"
              disabled
              value={[
                moment(contract?.startDate, dateFormat),
                moment(contract?.endDate, dateFormat),
              ]}
            />
            <Typography className="label">Type of Hours</Typography>
            <input
              className="textInput"
              required
              type={"text"}
              readOnly
              value={contract?.typeOfHours}
            />
            <Typography className="label">Remarks</Typography>
            <input
              className="textInput"
              required
              type={"text"}
              readOnly
              value={contract?.remarks}
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
            <input
              className="textInput"
              required
              type={"text"}
              readOnly
              value={contract?.contractName}
            />
            <Typography className="label">Service Package</Typography>

            <input
              className="textInput"
              required
              type={"text"}
              readOnly
              value={contract?.servicePackage}
            />
            <Typography className="label">Project Manager</Typography>

            <input
              className="textInput"
              required
              type={"text"}
              readOnly
              value={contract?.projectManager}
            />
            <Typography className="label">Contract Hours</Typography>
            <input
              className="textInput"
              type="number"
              value={contract?.contractHours}
              readOnly
            />
            <Typography className="label">SLA</Typography>
            <input
              className="textInput"
              type="text"
              value={contract?.sla ?? ""}
              readOnly
            />
            <Typography className="label">Support Time</Typography>
            <input
              className="textInput"
              type="text"
              value={contract?.supportTime ?? ""}
              readOnly
            />
            <Typography className="label">Consumed Hours</Typography>
            <input
              className="textInput"
              type="text"
              value={contract?.consumedHours ?? "NA"}
              readOnly
            />
          </div>
          <div className="right_side">
            <Typography className="label">Netsuite Project ID</Typography>
            <input
              className="textInput"
              required
              type={"text"}
              readOnly
              value={contract?.netSuiteProjectID}
            />
            <Typography className="label">First assignment Group</Typography>

            <input
              className="textInput"
              required
              type={"text"}
              readOnly
              value={contract?.firstAssignmentGroup}
            />
            <Typography className="label">First assignment agent</Typography>

            <input
              className="textInput"
              required
              type={"text"}
              readOnly
              value={contract?.firstAssigmentAgent}
            />
            <Typography className="label">Contract Owner</Typography>
            <input
              type="text"
              name="contractOwner"
              className="textInput"
              readOnly
              value={contract?.contractOwnerName}
            />
            <Typography className="label">Country</Typography>
            <input
              className="textInput"
              type="text"
              value={contract?.country ?? "NA"}
              readOnly
            />
            <Typography className="label">Customer User</Typography>
            <input
              className="textInput"
              type="text"
              value={contract?.customerUser ?? "NA"}
              readOnly
            />
            <Typography className="label">Remaining Time</Typography>
            <input
              className="textInput"
              type="text"
              value={contract?.remainingHours ?? "NA"}
              readOnly
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewContract;

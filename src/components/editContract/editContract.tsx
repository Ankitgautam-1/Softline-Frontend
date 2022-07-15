import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
const { RangePicker } = DatePicker;
import "./editContract.scss";
import axiosConfig from "../../Utils/axiosConfig";
import { Contract, NewContract } from "../../interfaces/Contracts";
import { useDispatch, useSelector } from "react-redux";
import { unAuth, userState } from "../../store/userAuth/userAuthSlice";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";

import { Modal, notification } from "antd";
import { CloseOutlined } from "@mui/icons-material";
import { DatePicker, Input, Space } from "antd";
import moment, { Moment } from "moment";
import { ServiceCategory } from "../../interfaces/ServicePackage";
import { ServiceItem } from "../../interfaces/ServiceItem";
import { Agent } from "../../interfaces/Agents";
import axios from "axios";
import { Button as AntdButton } from "antd";
import { Department } from "../../interfaces/Companies";
import ReactSelect from "react-select";
import { asstesOptions } from "../../Utils/constData";
import { dateDiff } from "../../Utils/helperFunction";
import { createContract, editContract } from "../../store/contracts";
const initialValues: Contract = {
  __v: 0,
  _id: "",
  assets: [""],
  company: "",
  contractName: "",
  endDate: "",
  id: "",
  ownerId: "",
  projectManager: "",
  remarks: "",
  serviceItem: [""],
  servicePackage: "",
  startDate: "",
  totalEntitlement: 0,
  typeOfHours: "",
};
type Props = {
  handelCancel: () => void;
  openModal: boolean;
  contract: Contract | null;
  handelRefresh: () => void;
};
type notifications = {
  shownotification: boolean;
  message: string;
};
const EditContract: React.FC<Props> = ({
  handelCancel,
  openModal,
  contract,
  handelRefresh,
}) => {
  const authReducer = useSelector((state: { userReducer: userState }) => {
    return state.userReducer;
  });

  const dispatch: any = useDispatch();
  const [initialContract, setInitialContract] =
    useState<Contract>(initialValues);
  const [selectedserviceItem, setselectedserviceItem] = useState<any>(null);
  const [assets, setAssets] = useState<any>(null);
  const [selectedID, setSelectedID] = useState<number>(0);
  const [selectedCompanyID, setselectedCompanyID] = useState<Number>(0);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [multiSelectOptions, setMultiSelectOptions] = useState<any>([]);
  const [listOfCompanies, setListOfCompanies] = useState<[] | Department[]>([]);
  const [contractPeriod, setContractPeriod] = useState("");
  const [listOfServicePackage, setListOfServicePackage] = useState<
    [] | ServiceCategory[]
  >([]);
  const [listOfServiceItem, setlistOfServiceItem] = useState<
    [] | ServiceItem[]
  >([]);
  const [listOfAgents, setListOfAgents] = useState<[] | Agent[]>([]);
  const [serviceItem, setserviceItem] = useState<string[]>([]);
  //contract details
  const [contractID, setContractID] = useState("");
  const [contractName, setContractName] = useState("");
  const [startDate, setstartDate] = useState<string>("");
  const [endDate, setendDate] = useState<string>("");
  const [typeHours, setTypeHours] = useState("Proactive");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedServicePkg, setSelectedServicePkg] = useState("");
  const [remarks, setRemarks] = useState("");
  const [hours, setHours] = useState(0);
  const [noftification, setNoftification] = useState<notifications>({
    message: "",
    shownotification: false,
  });
  const dateFormat = "YYYY/MM/DD";
  useEffect(() => {
    if (contract) {
      console.log("contract", contract);

      setContractID(contract.id);

      setstartDate(contract.startDate + "");

      setendDate(contract.endDate);
      setSelectedAgent(contract.projectManager);
      setHours(contract.totalEntitlement);
      const assetsData = contract.assets.map((asset: string) => {
        return { value: asset, label: asset };
      });
      setContractName(contract.contractName);
      setserviceItem(contract.serviceItem);
      setAssets(assetsData);
      const serviceItem = contract.serviceItem.map((asset: string) => {
        return { value: asset, label: asset };
      });

      setselectedserviceItem(serviceItem);
      setHours(contract.totalEntitlement);
      setSelectedCompany(contract.company);
      setRemarks(contract.remarks);
      setSelectedServicePkg(contract.servicePackage);
      setTypeHours(contract.typeOfHours);
      const getServicePackage = async () => {
        return axiosConfig.get("/api/v1/getServicePackage", {
          headers: {
            authorization: authReducer.accessToken.toString(),
          },
        });
      };

      getServicePackage().then((result) => {
        console.log(result.data.servicePackage);

        if (Array.isArray(result.data.servicePackage.service_categories)) {
          const data = result.data.servicePackage.service_categories.filter(
            (service: ServiceCategory) => {
              return service.name === contract.servicePackage;
            }
          );

          setSelectedServicePkg(data[0].name);
          setSelectedID(data[0].id);
        }
      });
    }
  }, []);
  useEffect(() => {
    if (contract) {
      setInitialContract(contract);
    }
  }, []);
  useEffect(() => {
    const getCompanies = async () => {
      return axiosConfig.get("/api/v1/getCompanies", {
        headers: {
          authorization: authReducer.accessToken.toString(),
        },
      });
    };
    const getServicePackage = async () => {
      return axiosConfig.get("/api/v1/getServicePackage", {
        headers: {
          authorization: authReducer.accessToken.toString(),
        },
      });
    };
    const getServiceItem = async () => {
      return axiosConfig.get("/api/v1/getServiceItem", {
        headers: {
          authorization: authReducer.accessToken.toString(),
        },
      });
    };
    const getAgents = async () => {
      return axiosConfig.get("/api/v1/getAgents", {
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
          if (res[0].data["ok"]) {
            setListOfCompanies(res[0].data["companies"]["departments"]);
          }
          if (res[1].data["ok"]) {
            setListOfServicePackage(
              res[1].data["servicePackage"]["service_categories"]
            );
          }
          if (res[2].data["ok"]) {
            setlistOfServiceItem(
              res[2].data["servicePackage"]["service_items"]
            );
          }
          if (res[3].data["ok"]) {
            setListOfAgents(res[3].data["data"]["agents"]);
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
  function arraysEqual(a: any, b: any) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  const openNotification = (msg: string) => {
    notification.error({
      message: "Contract",
      description: msg,
    });
  };
  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedCompany === "") {
      setNoftification({
        shownotification: true,
        message: "Select a Company",
      });

      setTimeout(() => {
        setNoftification({ shownotification: false, message: "" });
      }, 5000);
    } else if (selectedServicePkg === "") {
      setNoftification({
        shownotification: true,
        message: "Select a Service Package",
      });

      setTimeout(() => {
        setNoftification({ shownotification: false, message: "" });
      }, 5000);
    } else if (selectedserviceItem.length < 1) {
      setNoftification({
        shownotification: true,
        message: "Select a Service item",
      });

      setTimeout(() => {
        setNoftification({ shownotification: false, message: "" });
      }, 5000);
    } else if (startDate === "" || endDate === "") {
      setNoftification({
        shownotification: true,
        message: "Select a contract period",
      });
      setTimeout(() => {
        setNoftification({ shownotification: false, message: "" });
      }, 5000);
    } else if (!Array.isArray(assets) || assets.length < 1) {
      setNoftification({
        shownotification: true,
        message: "Select a assets",
      });
      setTimeout(() => {
        setNoftification({ shownotification: false, message: "" });
      }, 5000);
    } else {
      if (Array.isArray(assets)) {
        const data = assets.map((asset) => {
          return asset.value;
        });
        if (Array.isArray(selectedserviceItem)) {
          const Items = selectedserviceItem.map((items) => {
            return items.value;
          });
          if (contract !== null) {
            const asset = assets.map((asset) => {
              return asset.label;
            });
            const serviceItems = selectedserviceItem.map((item) => {
              return item.label;
            });
            const updatedContract: Contract = {
              __v: contract.__v,
              _id: contract._id,
              assets: asset,
              company: selectedCompany,
              contractName: contractName,
              endDate: endDate,
              id: contractID,
              ownerId: contract.ownerId,
              projectManager: selectedAgent,
              remarks: remarks,
              serviceItem: serviceItems,
              servicePackage: selectedServicePkg,
              startDate: startDate,
              totalEntitlement: hours,
              typeOfHours: typeHours,
            };
            let updatedValues: any = {};
            Object.keys(updatedContract).forEach((key) => {
              type ObjectKey = keyof typeof updatedContract;
              const variable = key as ObjectKey;

              if (
                variable.toString() === "assets" ||
                variable.toString() === "serviceItem"
              ) {
                if (Array.isArray(initialContract[variable])) {
                  if (
                    !arraysEqual(
                      initialContract[variable],
                      updatedContract[variable]
                    )
                  ) {
                    updatedValues[variable] = updatedContract[variable];
                  }
                }
              } else {
                if (updatedContract[variable] !== initialContract[variable]) {
                  updatedValues[variable] = updatedContract[variable];
                }
              }
            });

            console.log("updateValues", updatedValues);

            if (Object.keys(updatedValues).length !== 0) {
              updatedValues["id"] = initialContract.id;
              console.log("final updatedValues", updatedValues);

              const result = await dispatch(editContract(updatedValues));
              if (result.payload.ok) {
                handelCancel();
                handelRefresh();
              }
            }
          }
          // const newContract: NewContract = {
          // 	id: contractID,
          // 	company: selectedCompany,
          // 	contractName: contractName,
          // 	ownerId: authReducer.userId.toString(),
          // 	typeOfHours: typeHours,
          // 	startDate: startDate.toString(),
          // 	endDate: endDate.toString(),
          // 	serviceItem: Items,
          // 	servicePackage: selectedServicePkg,
          // 	projectManager: selectedAgent,
          // 	remarks: remarks,
          // 	totalEntitlement: hours.toString(),
          // 	assets: data,
          // };
          // let distictValue = {};

          // Object.keys(initialContract).forEach((key: string) => {
          // 	// console.log(initialContract[key]);

          // 	type ObjectKey = keyof typeof initialContract;
          // 	const keys = key as ObjectKey;

          // 	if (contract !== null) {
          // 		console.log(contract[keys]);
          // 	}
          // });

          // const result = await dispatch(createContract(newContract));
          // if (result.payload.ok) {
          // 	handelCancel();
          // } else {
          // 	if (
          // 		result.payload.message ===
          // 		'User Authentication faild'
          // 	) {
          // 		dispatch(unAuth());
          // 		setNoftification({
          // 			shownotification: true,
          // 			message: result.payload.response.data.message,
          // 		});
          // 		setTimeout(() => {
          // 			setNoftification({
          // 				shownotification: false,
          // 				message: '',
          // 			});
          // 		}, 5000);
          // 	} else {
          // 		setNoftification({
          // 			shownotification: true,
          // 			message: result.payload.response.data.message,
          // 		});
          // 		setTimeout(() => {
          // 			setNoftification({
          // 				shownotification: false,
          // 				message: '',
          // 			});
          // 		}, 5000);
          // 	}
          // }
        }
      }
    }
  }

  return (
    <Modal
      visible={openModal}
      onOk={handelCancel}
      footer={[]}
      style={{ top: 20 }}
      className="modal_container"
      onCancel={handelCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="contract_container">
        <form onSubmit={handleSubmit} className="formClass">
          <div className="form_container">
            <Snackbar
              open={noftification.shownotification}
              autoHideDuration={5000}
            >
              <Alert
                sx={{
                  backgroundColor: "#a22e37",
                  color: "whitesmoke",
                }}
                severity="error"
              >
                {noftification.message}
              </Alert>
            </Snackbar>
            <div className="left_side" onSubmit={(e) => {}}>
              <Typography className="label">Contract ID</Typography>
              <Input
                className="textInput"
                aria-label="contract"
                required
                defaultValue={contract?.id}
                disabled
                onChange={(e) => setContractID(e.target.value)}
              />

              <Typography className="label">Selected Company</Typography>
              <select
                name="select Company"
                className="selectInput"
                value={selectedCompany}
                onChange={(e) => {
                  const selectedCompany =
                    listOfCompanies[e.target.options.selectedIndex - 1];
                  setSelectedCompany(selectedCompany.name);
                }}
              >
                <option defaultValue={"default"} key="key">
                  Select Companies
                </option>
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
              <Typography className="label">Service Item</Typography>
              <ReactSelect
                isMulti
                className="multiSelect"
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
                  setselectedserviceItem(selected);
                }}
                value={selectedserviceItem}
              />
              <div className="label">
                Contract Period{" "}
                {contractPeriod && (
                  <span className="period">{`( ${contractPeriod} ) `}</span>
                )}
              </div>

              {startDate !== "" && endDate !== "" && (
                <>
                  <RangePicker
                    className="datePicker"
                    defaultValue={[moment(startDate), moment(endDate)]}
                    allowClear={false}
                    onChange={(e) => {
                      const startDate = e?.[0]?.toDate().toString() ?? "";
                      const endDate = e?.[1]?.toDate().toString() ?? "";
                      setstartDate(startDate);
                      setendDate(endDate);
                      const datediff = dateDiff(moment(e?.[0]), moment(e?.[1]));
                      const years =
                        datediff.years > 0 ? `${datediff.years} year ` : "";
                      const months =
                        datediff.months > 0 ? `${datediff.months} month ` : "";
                      const days =
                        datediff.days > 0 ? `${datediff.days} days ` : "";

                      setContractPeriod(years + months + days);
                    }}
                    disabledDate={(current) => {
                      let customDate = moment().format("YYYY-MM-DD");
                      return (
                        current && current < moment(customDate, "YYYY-MM-DD")
                      );
                    }}
                  />
                </>
              )}
              <Typography className="label">Type of Hours</Typography>
              <select
                name="typeOfHours"
                className="selectInput"
                onChange={(e) => {
                  setTypeHours(e.target.value.toString());
                }}
              >
                <option value="Proactive" id="Proactive">
                  Proactive
                </option>
                <option value="Reactive" id="Reactive">
                  Reactive
                </option>
                <option value="Both" id="Both">
                  Both
                </option>
              </select>
              <Typography className="label">Service Asset</Typography>
              <ReactSelect
                isMulti
                menuPlacement="top"
                className="multiSelect"
                options={asstesOptions}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                onChange={(selected) => {
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
                type={"text"}
                value={contractName}
                onChange={(e) => {
                  setContractName(e.target.value);
                }}
              />
              <Typography className="label">Service Package</Typography>

              <select
                className="selectInput"
                name="List of Service Package"
                id="List of Service Package"
                value={selectedID + "" ?? "0"}
                onChange={async (e) => {
                  setselectedserviceItem([]);

                  const id = parseInt(e.target.value);
                  setMultiSelectOptions(
                    listOfServiceItem
                      .map((serviceItem) => {
                        if (serviceItem.category_id === selectedCompanyID) {
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
                  const selectedPkg =
                    listOfServicePackage[e.target.options.selectedIndex - 1];

                  setSelectedServicePkg(selectedPkg.name);
                  setSelectedID(id);
                }}
              >
                <option defaultValue={"default"} value="0">
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

              <select
                className="selectInput"
                name="Select Agents"
                id="Agents"
                value={selectedAgent}
                onChange={(e) => {
                  setSelectedAgent(e.target.value);
                }}
              >
                {listOfAgents.map((agent: Agent) => {
                  return (
                    <option
                      key={agent.id}
                      value={agent.first_name + " " + agent.last_name}
                      aria-label={agent.first_name + " " + agent.last_name}
                    >
                      {agent.first_name + " " + agent.last_name}
                    </option>
                  );
                })}
              </select>
              <Typography className="label">Contract Hours</Typography>
              <Input
                className="textInput"
                type="number"
                min={1}
                required
                value={hours}
                onChange={(e) => {
                  setHours(parseInt(e.target.value));
                }}
              />
              <Typography className="label">Remarks</Typography>
              <Input
                className="textInput"
                type="text"
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                }}
              />
            </div>
          </div>

          <button key="btn" type="submit" className="createContractBtn">
            Update Contract
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default EditContract;

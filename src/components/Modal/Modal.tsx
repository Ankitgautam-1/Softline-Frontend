import React, { useEffect, useRef, useState } from "react";
import "antd/dist/antd.css";
const { RangePicker } = DatePicker;
import "./Modal.scss";
import download from "downloadjs";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../../Utils/axiosConfig";
import { NewContract } from "../../interfaces/Contracts";
import { NewContract as NC } from "../../interfaces/Contract";
import { useDispatch, useSelector } from "react-redux";
import { unAuth, userState } from "../../store/userAuth/userAuthSlice";
import { Typography, Snackbar, Alert } from "@mui/material";

import { Modal, notification } from "antd";
import { DatePicker, Input } from "antd";
import moment from "moment";
import { ServiceCategory } from "../../interfaces/ServicePackage";
import { ServiceItem } from "../../interfaces/ServiceItem";
import { ProjectManager } from "../../interfaces/Agents";
import axios from "axios";

import { Department } from "../../interfaces/Companies";
import ReactSelect from "react-select";

import { dateDiff } from "../../Utils/helperFunction";
import { createContract } from "../../store/contracts";
import { AgentGroups } from "../../interfaces/AgentGroups";
import { FirstAssigmentAgent } from "../../interfaces/FirstAssigmentAgent";
import { ContractOwner } from "../../interfaces/ContractOwners";
import { Location } from "../../interfaces/Location";
import { SLA } from "../../interfaces/SLA";
import { SupportTime } from "../../interfaces/SupportTime";
import { Asset } from "../../interfaces/Assets";
import { AssetsOption } from "../../interfaces/AssetsOption";
type Props = {
  handelCancel: () => void;
  openModal: boolean;
  updateContract: () => void;
};
type notifications = {
  shownotification: boolean;
  message: string;
};
const ModalComponents: React.FC<Props> = ({
  handelCancel,
  openModal,
  updateContract,
}) => {
  const navigate = useNavigate();
  const authReducer: any = useSelector((state: { userReducer: userState }) => {
    return state.userReducer;
  });
  const formData = new FormData();
  const dispatch: any = useDispatch();
  const [selectedserviceItem, setselectedserviceItem] = useState<any>(null);

  const [selectedID, setSelectedID] = useState<Number>(0);
  const [selectedCompanyID, setselectedCompanyID] = useState<Number>(0);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [multiSelectOptions, setMultiSelectOptions] = useState<any>([]);
  const [listOfCompanies, setListOfCompanies] = useState<[] | Department[]>([]);
  const [contractPeriod, setContractPeriod] = useState("");
  const [listOfServicePackage, setListOfServicePackage] = useState<
    [] | ServiceCategory[]
  >([]);
  const [listOfAssets, setListOfAssets] = useState<[] | Asset>([]);
  const [assetsOptions, setAssetsOptions] = useState<[] | AssetsOption[]>([]);
  const [listOfContractOwner, setListOfContractOwner] = useState<
    [] | ContractOwner[]
  >([]);
  const [selectedContractOwner, setSelectedContractOwner] = useState<{
    id: number;
    name: string;
    email: string;
  }>({ id: 0, name: "", email: "" });
  const [listOfServiceItem, setlistOfServiceItem] = useState<
    [] | ServiceItem[]
  >([]);

  const [serviceItem, setserviceItem] = useState<string[]>([]);
  const [listOfCustomerUser, setListOfCustomerUser] = useState<
    [] | ContractOwner[]
  >([]);
  const [selectedCustomerUser, setSelectedCustomerUser] = useState("");
  //contract details
  const [listOfSLA, setListOfSLA] = useState<[] | SLA[]>([]);
  const [selectedSLA, setSelectedSLA] = useState("");
  const [listOfSupportTime, setListOfSupportTime] = useState<
    SupportTime[] | []
  >([]);
  const [selectedSupportTime, setSelectedSupportTime] = useState("");
  const [contractID, setContractID] = useState("");
  const [contractName, setContractName] = useState("");
  const [startDate, setstartDate] = useState<string | null>("");
  const [endDate, setendDate] = useState<string | null>("");
  const [typeHours, setTypeHours] = useState("Proactive");
  const [listOfProjectManger, setListOfProjectManager] = useState<
    [] | ProjectManager[]
  >([]);
  const [selectedProjectManger, setSelectedProjectManager] = useState("");
  const [listOfAgentGroups, setListOfAgentGroups] = useState<
    [] | AgentGroups[]
  >([]);
  const [contractOwnerLocation, setContractOwnerLocation] = useState<
    { name: string } | Location
  >({ name: "NA" });
  const [selectedAgentGroupIDs, setSelectedAgentGroupIDs] = useState<any[]>([]);
  const [firstAssignmentAgent, setFirstAssignmentAgent] = useState([]);
  const [selectedAgentGroup, setSelectedAgentGroup] = useState<{
    name: string;
    id: string;
  }>({ name: "", id: "" });
  const [selectedServicePkg, setSelectedServicePkg] = useState("");
  const [remarks, setRemarks] = useState("");
  const [netSuiteProjectID, setNetSuiteProjectID] = useState("");
  const [selectedFirstAssigmentAgent, setSelectedFirstAssigmentAgent] =
    useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [contractHours, setcontractHours] = useState(0);
  const formref = useRef<HTMLFormElement>(null);
  const [assetLabel, setAssetLabel] = useState<string[]>([]);
  const datePickerRef = useRef<any>();
  const [selectedAssets, setSelectedAssets] = useState<any>(null);
  const [noftification, setNoftification] = useState<notifications>({
    message: "",
    shownotification: false,
  });

  const getLoctionByID = async (locationID: string) => {
    const locationResponse = await axiosConfig.get(
      `/api/v1/getLocationByID?locationID=${locationID}`
    );
    console.log("locationResponse", locationResponse);

    if (locationResponse.status === 200) {
      setContractOwnerLocation(locationResponse.data["location"]);
    } else {
      setContractOwnerLocation({ name: "NA" });
    }
  };
  const getFirstAssignmentAgent = async (arrayOfSelectedIDs: any[]) => {
    if (arrayOfSelectedIDs.length > 0) {
      const agentsReponse = await axiosConfig.post("/api/v1/getAgentByID", {
        arrayOfAgentID: arrayOfSelectedIDs,
      });
      console.log("agentsReponse", agentsReponse.data);

      if (agentsReponse.data["ok"]) {
        setFirstAssignmentAgent(agentsReponse.data["firstAssignmentGroup"]);
        setSelectedFirstAssigmentAgent(
          agentsReponse.data["firstAssignmentGroup"][0]["first_name"] +
            " " +
            agentsReponse.data["firstAssignmentGroup"][0]["last_name"]
        );
      } else {
        setFirstAssignmentAgent([]);
      }
    } else {
      setFirstAssignmentAgent([]);
    }
  };
  const getCustomer = async () => {
    return axiosConfig.get("/api/v1/getCustomer");
  };
  const getSLA = async () => {
    return axiosConfig.get("/api/v1/getSLA");
  };
  const getContractOwner = async () => {
    return axiosConfig.get("/api/v1/getContractOwner");
  };
  const getSupportTime = async () => {
    return axiosConfig.get("/api/v1/getSupportTime");
  };
  const getAssets = async () => {
    return axiosConfig.get("/api/v1/getAssets");
  };
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
    const getProjectManager = async () => {
      return axiosConfig.get("/api/v1/getProjectManager", {
        headers: {
          authorization: authReducer.accessToken.toString(),
        },
      });
    };
    const getAgentGroups = async () => {
      return axiosConfig.get("/api/v1/getAgentGroups", {
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
          getProjectManager(),
          getAgentGroups(),
          getContractOwner(),
          getCustomer(),
          getSLA(),
          getSupportTime(),
          getAssets(),
        ])
        .then(async (res) => {
          if (res[0].data["ok"]) {
            setListOfCompanies(res[0].data["companies"]["departments"]);
            setSelectedCompany(
              res[0].data["companies"]["departments"][0]["name"]
            );
          }
          if (res[1].data["ok"]) {
            setListOfServicePackage(
              res[1].data["servicePackage"]["service_categories"]
            );

            const id =
              res[1].data["servicePackage"]["service_categories"][0]["id"];

            setMultiSelectOptions(
              res[2].data["servicePackage"]["service_items"]
                .map((serviceItem: ServiceItem) => {
                  if (serviceItem.category_id === id) {
                    return {
                      label: serviceItem.name,
                      value: serviceItem.name,
                    };
                  }
                })
                .filter(function (el: any) {
                  return el != null;
                })
            );

            setserviceItem([]);
            const selectedPkg =
              res[2].data["servicePackage"]["service_items"][0];

            setSelectedServicePkg(selectedPkg.name);
            setSelectedID(id);
          }
          if (res[2].data["ok"]) {
            setlistOfServiceItem(
              res[2].data["servicePackage"]["service_items"]
            );
          }
          if (res[3].data["ok"]) {
            setListOfProjectManager(res[3].data["projectManger"]);
            setSelectedProjectManager(
              res[3].data["projectManger"][0]["first_name"] +
                " " +
                res[3].data["projectManger"][0]["last_name"] +
                " " +
                `${res[3].data["projectManger"][0]["email"]}`
            );
            // console.log(
            //   "projectManager",

            // );
          }
          if (res[4].data["ok"]) {
            console.log("res 4", res[4].data["agentsGroups"]);

            setListOfAgentGroups(res[4].data["agentsGroups"]);
            setSelectedAgentGroup({
              name: res[4].data["agentsGroups"][0]["name"],
              id: res[4].data["agentsGroups"][0]["id"],
            });
            setSelectedAgentGroupIDs(
              res[4].data["agentsGroups"][0]["agent_ids"]
            );
            await getFirstAssignmentAgent(
              res[4].data["agentsGroups"][0]["agent_ids"]
            );
          }
          if (res[5].data["ok"]) {
            setListOfContractOwner(res[5].data["contractOwner"]);
            setSelectedContractOwner({
              id: res[5].data["contractOwner"][0].id,
              name:
                res[5].data["contractOwner"][0].first_name +
                " " +
                res[5].data["contractOwner"][0].last_name,
              email: res[5].data["contractOwner"][0].last_name.primary_email,
            });

            await getLoctionByID(
              res[5].data["contractOwner"][0]["location_id"]
            );
          }
          if (res[6].data["ok"]) {
            setListOfCustomerUser(res[6].data["customer"]);
            console.log("res", res[6].data["customer"]);
            setSelectedCustomerUser(
              res[6].data["customer"][0]["first_name"] +
                " " +
                res[6].data["customer"][0]["last_name"]
            );
          }
          if (res[7].data["ok"]) {
            setListOfSLA(res[7].data["sla"]);
            setSelectedSLA(res[7].data["sla"][0]["name"]);
          }
          if (res[8].data["ok"]) {
            setListOfSupportTime(res[8].data["supportTime"]);
            setSelectedSupportTime(res[8].data["supportTime"][0]["name"]);
          }
          if (res[9].data["ok"]) {
            setListOfAssets(res[9].data["assets"]);
            const option = res[9].data["assets"].map((asset: Asset) => {
              return {
                value: asset.id,
                label: asset.name + " " + `(${asset.id})`,
              };
            });
            setAssetsOptions(option);
            console.log("option", option);
          }
        })
        .catch((res) => {
          if (res.response.status === 403) {
            dispatch(unAuth());
            navigate("/", { replace: true });
          }
        });
    };
    if (authReducer.auth) {
      getData();
    }
  }, []);
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
    } else if (!Array.isArray(selectedAssets) || selectedAssets.length < 1) {
      setNoftification({
        shownotification: true,
        message: "Select a assets",
      });
      setTimeout(() => {
        setNoftification({ shownotification: false, message: "" });
      }, 5000);
    } else {
      if (Array.isArray(selectedAssets)) {
        if (Array.isArray(selectedserviceItem)) {
          let Items: any[] = selectedserviceItem.map((items) => {
            return items.value;
          });
          console.log("files", files);

          const newContract: NC = {
            id: contractID,
            company: selectedCompany,
            contractName: contractName,
            contractOwner: selectedContractOwner.id.toString(),
            contractOwnerName:
              selectedContractOwner.name +
              " " +
              `(${selectedContractOwner.email})`,
            netSuiteProjectID: netSuiteProjectID,
            firstAssigmentAgent: selectedFirstAssigmentAgent,
            firstAssignmentGroup: selectedAgentGroup.name,
            country: contractOwnerLocation.name,
            sla: selectedSLA,
            customerUser: selectedCustomerUser,
            supportTime: selectedSupportTime,
            typeOfHours: typeHours,
            startDate: startDate ?? "".toString(),
            endDate: endDate ?? "".toString(),
            serviceItem: Items,
            servicePackage: selectedServicePkg,
            projectManager: selectedProjectManger,
            remarks: remarks,
            contractHours: contractHours,
            assets: assetLabel,
            createdDate: new Date(),
            files: files ? (files.length > 0 ? true : false) : false,
          };
          //const result = await dispatch(createContract(newContract));
          if (true) {
            const id = listOfServicePackage[0]["id"];
            console.log("Id", id);

            setMultiSelectOptions(
              listOfServiceItem
                .map((serviceItem: ServiceItem) => {
                  if (serviceItem.category_id === id) {
                    return {
                      label: serviceItem.name,
                      value: serviceItem.name,
                    };
                  }
                })
                .filter(function (el: any) {
                  return el != null;
                })
            );
            setserviceItem([]);
            const selectedPkg = listOfServicePackage[0];

            setSelectedServicePkg(selectedPkg.name);
            setSelectedID(id);
            formref.current!.reset();
            setContractID("");
            setContractName("");
            setstartDate(null);
            setendDate(null);

            setTypeHours("Proactive");
            setselectedserviceItem([]);
            setNetSuiteProjectID("");
            setserviceItem([]);

            setSelectedAssets(null);
            setcontractHours(1);
            setSelectedProjectManager(
              listOfProjectManger[0].first_name +
                " " +
                listOfProjectManger[0].last_name
            );
            setRemarks("");
            setstartDate("");
            setendDate("");

            Items = [];

            updateContract();
            handelCancel();
            if (newContract.id !== null && newContract.id !== "") {
              formData.append("id", newContract.id);

              if (files) {
                if (files.length > 0) {
                  for (let i = 0; i < files.length; i++) {
                    formData.append(files[i].name, files[i]);
                  }
                }
                const file = await axiosConfig.post(
                  `/api/v1/uploadFile?id=${newContract.id}`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
                console.log("response", file);

                if (file.data.message === "User Authentication faild") {
                  dispatch(unAuth());
                  setNoftification({
                    shownotification: true,
                    message: file.data.message,
                  });
                  setTimeout(() => {
                    setNoftification({
                      shownotification: false,
                      message: "",
                    });
                  }, 5000);
                } else if (file.data["ok"]) {
                } else {
                }
              } else {
                console.log("No files were selected");
              }
            }
          }
          //  else {
          //   if (result.payload.message === "User Authentication faild") {
          //     dispatch(unAuth());
          //     setNoftification({
          //       shownotification: true,
          //       message: result.payload.response.data.message,
          //     });
          //     setTimeout(() => {
          //       setNoftification({
          //         shownotification: false,
          //         message: "",
          //       });
          //     }, 5000);
          //   } else {
          //     setNoftification({
          //       shownotification: true,
          //       message: result.payload.response.data.message,
          //     });
          //     setTimeout(() => {
          //       setNoftification({
          //         shownotification: false,
          //         message: "",
          //       });
          //     }, 5000);
          //   }
          // }

          console.log("new Contract ", newContract);
        }
      }
    }
  }
  const dataType: any = "";
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
        <form onSubmit={handleSubmit} ref={formref} className="formClass">
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
            <div className="left_side">
              <Typography className="label">Contract ID</Typography>
              <Input
                className="textInput"
                aria-label="contract"
                required
                value={contractID}
                onChange={(e) => setContractID(e.target.value)}
              />

              <Typography className="label">Company</Typography>

              <select
                name="select Company"
                className="selectInput"
                onChange={(e) => {
                  const selectedCompany =
                    listOfCompanies[e.target.options.selectedIndex];

                  setSelectedCompany(selectedCompany.name);

                  setselectedCompanyID(parseInt(e.target.value));
                }}
              >
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

              <RangePicker
                className="datePicker"
                format="DD/MM/YYYY"
                ref={datePickerRef}
                defaultPickerValue={[
                  startDate !== "" ? dataType : startDate,
                  endDate !== "" ? dataType : endDate,
                ]}
                value={
                  startDate && endDate
                    ? [moment(new Date(startDate)), moment(new Date(endDate))]
                    : null
                }
                allowClear={true}
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
              />
              <Typography className="label">Type of Hours</Typography>
              <select
                name="typeOfHours"
                className="selectInput"
                onChange={(e) => {
                  setTypeHours(e.target.value.toString());
                }}
              >
                <option value="Proactive" id="Proactive" key="Proactive">
                  Proactive
                </option>
                <option value="Reactive" id="Reactive" key="Reactive">
                  Reactive
                </option>
                <option value="Both" id="Both" key="Both">
                  Both
                </option>
              </select>
              <Typography className="label">Service Asset</Typography>
              <ReactSelect
                isMulti
                menuPlacement="auto"
                isSearchable={true}
                className="multiSelect"
                options={assetsOptions}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                onChange={(selected) => {
                  console.log("selected", selected);
                  if (selected.length > 0) {
                    const label = selected.map((asset) => {
                      return asset.label;
                    });
                    console.log(" asset.value", label);

                    setAssetLabel(label);
                  } else {
                    setAssetLabel([]);
                  }

                  setSelectedAssets(selected);
                }}
                value={selectedAssets}
              />

              <Typography className="label">Remarks</Typography>
              <textarea
                className="textArea"
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                }}
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
                onChange={async (e) => {
                  console.log("e.target.value", e.target.value);
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
                    listOfServicePackage[e.target.options.selectedIndex];

                  setSelectedServicePkg(selectedPkg.name);
                  setSelectedID(id);
                }}
              >
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
              <Typography className="label">Project Manager</Typography>
              <select
                className="selectInput"
                name="Select Agents"
                id="Agents"
                value={selectedProjectManger}
                onChange={(e) => {
                  setSelectedProjectManager(e.target.value);
                }}
              >
                {listOfProjectManger.map((agent: ProjectManager) => {
                  return (
                    <option
                      key={agent.id}
                      value={agent.first_name + " " + agent.last_name}
                      aria-label={agent.first_name + " " + agent.last_name}
                    >
                      {agent.first_name +
                        " " +
                        agent.last_name +
                        " " +
                        `(${agent.email})`}
                    </option>
                  );
                })}
              </select>
              <Typography className="label">Contract Hours</Typography>
              <input
                className="textInput"
                type="number"
                min={1}
                step={"any"}
                value={contractHours}
                required
                placeholder="Contract Hours in hr"
                onChange={(e) => {
                  try {
                    // console.log("data:", e.target.value);
                    setcontractHours(parseFloat(e.target.value));
                  } catch (e) {
                    console.log("e", e);
                  }
                }}
              />

              <Typography className="label">SLA</Typography>

              <select
                name="sla"
                className="selectInput"
                onChange={(e) => {
                  setSelectedSLA(e.target.value);
                  console.log("e", e.target.value);
                }}
              >
                {listOfSLA.map((sla: SLA) => {
                  return (
                    <option key={sla.id.toString()} value={sla.name}>
                      {sla.name}
                    </option>
                  );
                })}
              </select>
              <Typography className="label">Support Time</Typography>

              <select
                name="supportTime"
                className="selectInput"
                onChange={(e) => {
                  setSelectedSupportTime(e.target.value);
                  console.log("e", e.target.value);
                }}
              >
                {listOfSupportTime.map((supportTime: SupportTime) => {
                  return (
                    <option
                      key={supportTime.id.toString()}
                      value={supportTime.name}
                    >
                      {supportTime.name}
                    </option>
                  );
                })}
              </select>
              <Typography className="label">Files</Typography>
              <input
                type={"file"}
                minLength={1}
                multiple={false}
                onChange={(e) => {
                  console.log("e.target.files", e.target.files);

                  if (e.target.files) {
                    console.log(e.target.files);
                    setFiles(e.target.files);
                  }
                }}
              />
            </div>
            <div className="right_side">
              <Typography className="label">Netsuite Project ID</Typography>
              <input
                className="textInput"
                required
                type={"text"}
                value={netSuiteProjectID}
                onChange={(e) => {
                  setNetSuiteProjectID(e.target.value);
                }}
              />
              <Typography className="label">First assignment Group</Typography>
              {/* {selectedAgentGroup} */}
              <select
                className="selectInput"
                name="Select Agents Group"
                id="selectedAgentGroup"
                value={selectedAgentGroup.name}
                onChange={async (e) => {
                  setSelectedFirstAssigmentAgent("");
                  console.log("e.traget.value");

                  setSelectedAgentGroup({ name: e.target.value, id: "" });
                  const newselected = listOfAgentGroups.filter((agent) => {
                    return agent.name === e.target.value;
                  });
                  if (newselected.length > 0) {
                    setSelectedAgentGroupIDs(newselected[0].agent_ids);
                    await getFirstAssignmentAgent(newselected[0].agent_ids);
                  }
                  console.log(newselected[0].agent_ids);
                }}
              >
                {listOfAgentGroups.map((agent: AgentGroups) => {
                  return (
                    <option
                      key={agent.id}
                      value={agent.name}
                      aria-label={agent.name}
                    >
                      {agent.name}
                    </option>
                  );
                })}
              </select>
              <Typography className="label">First assignment agent</Typography>
              {/* {JSON.stringify(selectedFirstAssigmentAgent)} */}
              <select
                value={selectedFirstAssigmentAgent}
                className="selectInput"
                onChange={(e) => {
                  setSelectedFirstAssigmentAgent(e.target.value);
                }}
              >
                {firstAssignmentAgent.map((agent: FirstAssigmentAgent) => {
                  return (
                    <option key={agent.id}>
                      {agent.first_name +
                        " " +
                        agent.last_name +
                        " " +
                        `(${agent.email})`}
                    </option>
                  );
                })}
              </select>

              <Typography className="label">Contract Owner</Typography>

              <select
                className="selectInput"
                name="List of Service Package"
                value={selectedContractOwner.name}
                id="List of Service Package"
                onChange={async (e) => {
                  const newId = e.target.value;
                  const newSelectedContractOwner = listOfContractOwner.filter(
                    (contractOwner: ContractOwner) => {
                      return contractOwner.id === parseInt(newId);
                    }
                  );
                  setSelectedContractOwner({
                    name:
                      newSelectedContractOwner[0].first_name +
                      " " +
                      newSelectedContractOwner[0].last_name,
                    id: newSelectedContractOwner[0].id,
                    email: newSelectedContractOwner[0].primary_email,
                  });
                  await getLoctionByID(
                    newSelectedContractOwner[0].location_id.toString()
                  );
                }}
              >
                {listOfContractOwner.map((contractOwner: ContractOwner) => {
                  return (
                    <option key={contractOwner.id} value={contractOwner.id}>
                      {contractOwner.first_name +
                        " " +
                        contractOwner.last_name +
                        " " +
                        `(${contractOwner.primary_email})`}
                    </option>
                  );
                })}
              </select>
              <Typography className="label">Country</Typography>

              <Input
                className="textInput"
                required
                disabled
                value={contractOwnerLocation.name}
              />
              <Typography className="label">Customer User</Typography>
              <select
                name="customer_user"
                className="selectInput"
                onChange={(e) => {
                  setSelectedCustomerUser(e.target.value);
                  console.log("e", e.target.value);
                }}
              >
                {listOfCustomerUser.map((customer: ContractOwner) => {
                  return (
                    <option
                      key={customer.id.toString()}
                      value={customer.first_name + " " + customer.last_name}
                    >
                      {customer.first_name + " " + customer.last_name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button key="btn" type="submit" className="createContractBtn">
            Create Contract
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalComponents;

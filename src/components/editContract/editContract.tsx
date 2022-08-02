import React, { useEffect, useRef, useState } from "react";
import "antd/dist/antd.css";
const { RangePicker } = DatePicker;
import "./editContract.scss";
import axiosConfig from "../../Utils/axiosConfig";
import { Contract, NewContract } from "../../interfaces/Contracts";
import { useDispatch, useSelector } from "react-redux";
import { unAuth, userState } from "../../store/userAuth/userAuthSlice";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";

import { Modal, notification } from "antd";
import { CloseOutlined, Details } from "@mui/icons-material";
import { DatePicker, Input, Space } from "antd";
import moment, { Moment } from "moment";
import {
  ServiceCategory,
  ServicePackage,
} from "../../interfaces/ServicePackage";
import { ServiceItem } from "../../interfaces/ServiceItem";
import { ProjectManager } from "../../interfaces/Agents";
import axios from "axios";
import { Button as AntdButton } from "antd";
import { Companies, Department } from "../../interfaces/Companies";
import ReactSelect from "react-select";
import { asstesOptions } from "../../Utils/constData";
import { dateDiff } from "../../Utils/helperFunction";
import { createContract, editContract } from "../../store/contracts";
import { Contract as C } from "../../interfaces/Contract";
import { Asset } from "../../interfaces/Assets";
import { SLA } from "../../interfaces/SLA";
import { SupportTime } from "../../interfaces/SupportTime";
import { AgentGroups } from "../../interfaces/AgentGroups";
import { FirstAssigmentAgent } from "../../interfaces/FirstAssigmentAgent";
import { ContractOwner } from "../../interfaces/ContractOwners";
import { CustomerUser } from "../../interfaces/CustomerUser";
const initialValues: C = {
  __v: 0,
  contractHours: 1,
  contractOwner: "",
  contractOwnerName: "",
  country: "",
  customerUser: "",
  firstAssigmentAgent: "",
  firstAssignmentGroup: "",
  netSuiteProjectID: "",
  sla: "",
  supportTime: "",
  _id: "",
  assets: [""],
  company: "",
  contractName: "",
  endDate: "",
  id: "",
  projectManager: "",
  remarks: "",
  serviceItem: [""],
  servicePackage: "",
  startDate: "",
  typeOfHours: "",
  createdDate: new Date(),
  files: false,
};
type Props = {
  handelCancel: () => void;
  openModal: boolean;
  contract: C | null;
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
  const [initialContract, setInitialContract] = useState<C>(initialValues);
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
  const [listOfSLA, setListOfSLA] = useState<SLA[] | []>([]);
  const [listOfServiceItem, setlistOfServiceItem] = useState<
    [] | ServiceItem[]
  >([]);
  const [listOfProjectManager, setListOfProjectManager] = useState<
    [] | ProjectManager[]
  >([]);
  const [serviceItem, setserviceItem] = useState<string[]>([]);
  //contract details
  const [selectedServiceItem, setSelectedServiceItem] = useState<any>([]);
  const [contractID, setContractID] = useState("");
  const [contractName, setContractName] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedSLA, setSelectedSLA] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedServicePkg, setSelectedServicePkg] = useState("");
  const [remarks, setRemarks] = useState("");
  const [contractHours, setContractHours] = useState<number | "">(0);
  const [consumedHours, setConsumedHours] = useState<number | "">(0);
  const [netSuiteProjectID, setNetSuiteProjectID] = useState("");
  const [serviceItemOption, setServiceItemOption] = useState([]);
  const [typeOfHours, setTypeOfHours] = useState("Proactive");
  const [noftification, setNoftification] = useState<notifications>({
    message: "",
    shownotification: false,
  });
  const [remainingTime, setRemainingTime] = useState<number | "">(0);
  const [selectedAssets, setSelectedAssets] = useState<
    [{ value: ""; label: "" }] | []
  >([]);
  const [listOfAssets, setListOfAssets] = useState([]);
  const [selectedProjectManager, setSelectedProjectManager] = useState("");
  const [assetsOptions, setAssetsOptions] = useState([]);
  const [listOfSupportTime, setListOfSupportTime] = useState<
    SupportTime[] | []
  >([]);
  const [selectedSupportTime, setSelectedSupportTime] = useState("");
  const dateFormat = "YYYY/MM/DD";
  const [listOfFirstAssignmentAgent, setListOfFirstAssignmentAgent] = useState<
    FirstAssigmentAgent[] | []
  >([]);
  const [selectedFirstAssigmentAgent, setSelectedFirstAssigmentAgent] =
    useState("init");
  const [listOfFirstAssignmentGroup, setListOfFirstAssignmentGroup] = useState<
    AgentGroups[] | []
  >([]);
  const [selectedFirstAssignmentGroup, setSelectedFirstAssignmentGroup] =
    useState("");
  const [listOfContractOwner, setListOfContractOwner] = useState<
    ContractOwner[] | []
  >([]);
  const [selectedContractOwnerID, setSelectedContractOwnerID] = useState("");
  const [selectedContractOwnerDetails, setSelectedContractOwnerDetails] =
    useState("");
  const [contractOwnerLocation, setContractOwnerLocation] = useState("");
  const [listOfCustomerUser, setListOfCustomerUser] = useState<
    CustomerUser[] | []
  >([]);
  const [selectedCustomerUser, setSelectedCustomerUser] = useState("");
  const formref = useRef(null);
  const [selectedCustomerUserID, setselectedCustomerUserID] = useState("da");
  useEffect(() => {
    if (contract) {
      console.log("contract", contract);

      setContractID(contract.id);

      setStartDate(contract.startDate + "");
      console.log("contract.firstAssigmentAgent", contract.firstAssigmentAgent);
      setSelectedContractOwnerID(contract.contractOwner);
      setSelectedFirstAssigmentAgent(contract.firstAssigmentAgent);
      setEndDate(contract.endDate);

      setSelectedSupportTime(contract.supportTime);
      setSelectedAgent(contract.projectManager);
      setContractHours(parseFloat(contract.contractHours.toString()));
      setTypeOfHours(contract.typeOfHours);
      setNetSuiteProjectID(contract.netSuiteProjectID);
      console.log("contract.serviceItem", contract.serviceItem);

      const assetsData = contract.assets.map((asset: string) => {
        return { value: asset, label: asset };
      });
      setContractOwnerLocation(contract.country);
      if (contract && contract.consumedHours !== undefined) {
        setConsumedHours(parseFloat(1.53 + ""));
      }
      setSelectedProjectManager(contract.projectManager);
      setContractName(contract.contractName);
      setserviceItem(contract.serviceItem);
      setSelectedSLA(contract.sla);
      const items = contract.serviceItem.map((item: string) => {
        return { value: item, label: item };
      });
      setSelectedServiceItem(items);
      setAssets(assetsData);
      console.log("assets", assetsData);

      const serviceItem = contract.serviceItem.map((asset: string) => {
        return { value: asset, label: asset };
      });
      setSelectedFirstAssignmentGroup(contract.firstAssignmentGroup);
      setselectedserviceItem(serviceItem);
      setContractHours(parseFloat(contract.contractHours.toString()));
      setSelectedCompany(contract.company);
      setRemarks(contract.remarks);
      setSelectedServicePkg(contract.servicePackage);

      const datediff = dateDiff(
        moment(contract.startDate),
        moment(contract.endDate)
      );
      const years = datediff.years > 0 ? `${datediff.years} year ` : "";
      const months = datediff.months > 0 ? `${datediff.months} month ` : "";
      const days = datediff.days > 0 ? `${datediff.days} days ` : "";

      setContractPeriod(years + months + days);
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
  const getAssets = async () => {
    return axiosConfig.get("/api/v1/getAssets");
  };
  const getSla = async () => {
    return axiosConfig.get("/api/v1/getSLA");
  };
  const getSupportTime = async () => {
    return axiosConfig.get("/api/v1/getSupportTime");
  };
  const getAgentGroups = async () => {
    return axiosConfig.get("/api/v1/getAgentGroups");
  };
  const getLocationByID = async (id: string) => {
    const location = await axiosConfig.get(
      `/api/v1/getLocationByID?locationID=${id}`
    );
    if (location.status === 200) {
      console.log("location", location.data.location.name);
    }
  };
  const getFirstAssignmentAgentByID = async (arrayOfSelectedIDs: any[]) => {
    if (arrayOfSelectedIDs.length > 0) {
      const agentsReponse = await axiosConfig.post("/api/v1/getAgentByID", {
        arrayOfAgentID: arrayOfSelectedIDs,
      });
      console.log("agentsReponse", agentsReponse.data["firstAssignmentGroup"]);

      if (agentsReponse.data["ok"]) {
        const listOfAgents = agentsReponse.data["firstAssignmentGroup"];
        let selectedAgent;
        setListOfFirstAssignmentAgent(listOfAgents);
        if (selectedFirstAssigmentAgent === "init") {
          selectedAgent = contract?.firstAssigmentAgent.split(" ");
        } else if (selectedFirstAssigmentAgent === "") {
          selectedAgent = null;
        } else {
          selectedAgent = selectedFirstAssigmentAgent.split(" ");
        }
        if (selectedAgent && selectedAgent.length > 0) {
          console.log("selectedAgent", selectedAgent[0]);

          const selectedAgentFirstName = selectedAgent[0];
          const selectedAgentLastName = selectedAgent[1];
          const selectedAgentEmail = selectedAgent[2].substring(
            1,
            selectedAgent[2].length - 1
          );

          if (listOfAgents.length > 0) {
            for (let i = 0; i < listOfAgents.length; i++) {
              console.log("name", selectedAgentFirstName);

              console.log(
                "name-condition",
                i,
                listOfAgents[i].first_name,
                selectedAgentFirstName
              );
              console.log(
                "lastName-condition",
                listOfAgents[i].last_name,
                selectedAgentLastName
              );
              console.log(
                "email-condition",
                listOfAgents[i].email,
                selectedAgentEmail
              );

              if (
                listOfAgents[i].first_name === selectedAgentFirstName &&
                listOfAgents[i].last_name === selectedAgentLastName &&
                listOfAgents[i].email === selectedAgentEmail
              ) {
                console.log(" match", listOfAgents[i].email);
                setSelectedFirstAssigmentAgent(
                  listOfAgents[i].first_name +
                    " " +
                    listOfAgents[i].last_name +
                    " " +
                    `(${listOfAgents[i].email})`
                );

                break;
              } else {
                if (i === listOfAgents.length - 1) {
                  console.log("not match");
                  setSelectedFirstAssigmentAgent(
                    listOfAgents[0].first_name +
                      " " +
                      listOfAgents[0].last_name +
                      " " +
                      `(${listOfAgents[0].email})`
                  );
                }
              }
            }
          }
        } else {
          if (listOfAgents.length > 0) {
            setSelectedFirstAssigmentAgent(
              listOfAgents[0].first_name +
                " " +
                listOfAgents[0].last_name +
                " " +
                `(${listOfAgents[0].email})`
            );
          } else {
            setSelectedFirstAssigmentAgent("");
          }
        }

        // for (let i = 0; i < listOfAgents.length; i++) {
        //   console.log("listOfAgents[i].first_name", listOfAgents[i].first_name);

        //   if (
        //     selectedAgent[0] === listOfAgents[i].first_name &&
        //     selectedAgent[1] === listOfAgents[i].last_name &&
        //     selectedAgent[2] === listOfAgents[i].email
        //   ) {
        //     console.log("in if");

        //     setSelectedFirstAssigmentAgent(
        //       listOfAgents[i].first_name +
        //         " " +
        //         listOfAgents[i].last_name +
        //         " " +
        //         `${listOfAgents[i].email}`
        //     );
        //     break;
        //   } else {
        //     if (i === listOfAgents.length - 1) {
        //       setSelectedFirstAssigmentAgent(
        //         listOfAgents[0].first_name +
        //           " " +
        //           listOfAgents[0].last_name +
        //           " " +
        //           `${listOfAgents[0].email}`
        //       );
        //     }
        //   }
        // }
      } else {
        setListOfFirstAssignmentAgent([]);
      }
    } else {
      setListOfFirstAssignmentAgent([]);
    }
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
    const getContractOwner = async () => {
      return axiosConfig.get("/api/v1/getContractOwner");
    };
    const getCustomerUser = async () => {
      return axiosConfig.get("/api/v1/getCustomer");
    };

    const getData = async () => {
      axios
        .all([
          getCompanies(),
          getServicePackage(),
          getServiceItem(),
          getProjectManager(),
          getAssets(),
          getSla(),
          getSupportTime(),
          getAgentGroups(),
          getContractOwner(),
          getCustomerUser(),
        ])
        .then((res) => {
          if (res[0].data["ok"]) {
            setListOfCompanies(res[0].data["companies"]["departments"]);
          }
          if (res[1].data["ok"]) {
            setListOfServicePackage(
              res[1].data["servicePackage"]["service_categories"]
            );
            console.log(
              "res[1]",
              res[1].data["servicePackage"]["service_categories"]
            );
          }
          if (res[2].data["ok"]) {
            setlistOfServiceItem(
              res[2].data["servicePackage"]["service_items"]
            );
            const servicePackage =
              res[1].data["servicePackage"]["service_categories"];
            const servicePackageID = servicePackage
              .filter((service: ServiceCategory) => {
                return service.name === contract?.servicePackage;
              })
              .map((service: ServiceCategory) => {
                return service.id;
              });
            console.log("res[2]:", servicePackageID[0]);
            const listOfServiceItem =
              res[2].data["servicePackage"]["service_items"];
            const serviceItem = listOfServiceItem
              .filter((service: ServiceItem) => {
                return service.category_id === servicePackageID[0];
              })
              .map((service: ServiceItem) => {
                return {
                  value: service.name,
                  label: service.name,
                };
              });
            console.log("serviceItem", serviceItem.length);

            setServiceItemOption(serviceItem);
          }
          if (res[3].data["ok"]) {
            setListOfProjectManager(res[3].data["projectManger"]);
            console.log("projectManager", res[3].data["projectManger"]);
          }
          if (res[4].data["ok"]) {
            setListOfAssets(res[4].data["assets"]);
            const option = res[4].data["assets"].map((asset: Asset) => {
              return {
                value: asset.id,
                label: asset.name,
              };
            });
            console.log("asset-option", option);
            console.log("asset", contract?.assets);
            // const selectedAssetID=contract?.assets.map((asset:Asset)=>{
            //   return asset.id;
            // })
            setAssetsOptions(option);
          }
          if (res[5].data["ok"]) {
            setListOfSLA(res[5].data["sla"]);
          }
          if (res[6].data["ok"]) {
            setListOfSupportTime(res[6].data["supportTime"]);
          }
          if (res[7].data["ok"]) {
            const listOfData = res[7].data["agentsGroups"];
            setListOfFirstAssignmentGroup(listOfData);
            try {
              const ids = listOfData
                .filter((agentGroup: AgentGroups) => {
                  return agentGroup.name === contract?.firstAssignmentGroup;
                })
                .map((agentGroup: AgentGroups) => {
                  return agentGroup.agent_ids;
                });

              console.log("agentGroups", ids[0]);
              if (ids.length > 0) {
                getFirstAssignmentAgentByID(ids[0]);
              }
            } catch (error) {}
          }
          if (res[8].data["ok"]) {
            const listOfData = res[8].data["contractOwner"];
            setListOfContractOwner(listOfData);
            listOfData.map((contractOwner: ContractOwner) => {
              if (
                contractOwner.id == parseInt(contract?.contractOwner ?? "0")
              ) {
                setSelectedContractOwnerDetails(
                  contractOwner.first_name +
                    " " +
                    contractOwner.last_name +
                    " " +
                    `(${contractOwner.primary_email})`
                );
              }
            });
          }
          if (res[9].data["ok"]) {
            const listOfData = res[9].data["customer"];
            setListOfCustomerUser(listOfData);
            setListOfCustomerUser(listOfData);
            listOfData.map((customerUser: CustomerUser) => {
              console.log("customerUserID", customerUser.id);
              console.log("ID", contract?.customerUser);
              if (customerUser) {
                if (customerUser.id.toString() == contract?.customerUser) {
                  setselectedCustomerUserID(customerUser.id.toString());
                  setSelectedCustomerUser(
                    `${customerUser.first_name} ${customerUser.last_name} (${customerUser.primary_email})`
                  );
                }
              }
            });
          }
        })
        .catch((res) => {
          if (res.response.status === 403) {
            dispatch(unAuth());
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
      if (Array.isArray(assets) && assets.length > 0) {
        const data = assets.map((asset) => {
          return asset.value;
        });
        if (Array.isArray(selectedserviceItem)) {
          const Items = selectedServiceItem.map(
            (items: { label: string; value: string }) => {
              return items.value;
            }
          );
          if (contract) {
            const asset = assets.map((asset) => {
              return asset.label;
            });
            console.log("selectedServiceItem", Items);

            const serviceItems = selectedserviceItem.map((item) => {
              return item.label;
            });
            const updatedContract: C = {
              __v: contract.__v,
              _id: contract._id,
              assets: asset,
              company: selectedCompany,
              contractName: contractName,
              endDate: endDate,
              id: contractID,
              contractHours:
                contractHours > 0 ? contractHours : contract.contractHours,
              typeOfHours: typeOfHours,

              projectManager: selectedAgent,
              remarks: remarks,
              serviceItem: Items,
              servicePackage: selectedServicePkg,
              startDate: startDate,
              contractOwner: selectedContractOwnerID,
              contractOwnerName: selectedContractOwnerDetails,
              country: contractOwnerLocation,
              customerUser: selectedCustomerUser,
              firstAssigmentAgent: selectedFirstAssigmentAgent,
              firstAssignmentGroup: selectedFirstAssignmentGroup,
              netSuiteProjectID: netSuiteProjectID,
              sla: selectedSLA,
              supportTime: selectedSupportTime,
              createdDate: contract.createdDate,
              files: contract.files,
            };
            let updatedValues: any = {};
            Object.keys(updatedContract).forEach((key) => {
              type ObjectKey = keyof typeof updatedContract;
              const variable = key as ObjectKey;

              if (
                variable.toString() === "assets" ||
                variable.toString() === "serviceItem"
              ) {
                console.log("variable", variable);
                if (variable.toString() === "serviceItem") {
                  console.log("variable", variable);

                  console.log("updatedContract", updatedContract[variable]);
                  console.log("updatedContract", initialContract[variable]);
                }
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
                if (updatedContract[variable] != initialContract[variable]) {
                  console.log("not equal", variable);
                  console.log("initial", initialContract[variable]);
                  console.log("updated", updatedContract[variable]);

                  updatedValues[variable] = updatedContract[variable];
                }
              }
            });

            console.log("updateValues", updatedValues);

            if (Object.keys(updatedValues).length !== 0) {
              updatedValues["id"] = initialContract.id;
              console.log("final updatedValues", updatedValues);

              // const result = await dispatch(editContract(updatedValues));
              // if (result.payload.ok) {
              //   handelCancel();
              //   handelRefresh();
              // }
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
      footer={null}
      style={{ top: 20 }}
      className="modal_container"
      onCancel={handelCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="contract_container">
        <form onSubmit={handleSubmit} ref={formref} className="formClass">
          <div className="form_container">
            <div className="left_side" onSubmit={(e) => {}}>
              <Typography className="label">Contract ID</Typography>
              <input
                className="textInput"
                aria-label="contract"
                value={contractID}
                onChange={(e) => {
                  setContractID(e.target.value);
                }}
              />

              <Typography className="label">Company</Typography>
              <select
                className="selectInput"
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                }}
              >
                {listOfCompanies.map((company: Department) => {
                  return (
                    <option key={company.id} value={company.name}>
                      {company.name}
                    </option>
                  );
                })}
              </select>

              <Typography className="label">Service Item</Typography>

              <ReactSelect
                isMulti
                className="multiSelect"
                isSearchable
                isClearable={false}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                menuPlacement={"bottom"}
                options={serviceItemOption}
                onChange={(e) => {
                  setSelectedServiceItem(e);
                }}
                value={selectedServiceItem}
              />
              <Typography className="label">
                Contract Period {contractPeriod}
              </Typography>

              <RangePicker
                className="datePicker"
                format={"MM/DD/YYYY"}
                allowClear={false}
                onChange={(e) => {
                  if (e !== null && e?.[0] !== null && e?.[1] !== null) {
                    setStartDate(e[0].toString());
                    setEndDate(e[1].toString());
                    const datediff = dateDiff(moment(e?.[0]), moment(e?.[1]));
                    const years =
                      datediff.years > 0 ? `${datediff.years} year ` : "";
                    const months =
                      datediff.months > 0 ? `${datediff.months} month ` : "";
                    const days =
                      datediff.days > 0 ? `${datediff.days} days ` : "";

                    setContractPeriod(years + months + days);
                  }
                }}
                defaultValue={[
                  moment(contract?.startDate, dateFormat),
                  moment(contract?.endDate, dateFormat),
                ]}
              />
              <Typography className="label">Type of Hours</Typography>
              <select
                name="typeOfHours"
                id="typeOfHours"
                value={typeOfHours}
                onChange={(e) => {
                  setTypeOfHours(e.target.value);
                }}
                className="selectInput"
              >
                <option key={"Proactive"} value="Proactive">
                  Proactive
                </option>
                <option key={"Reactive"} value="Reactive">
                  Reactive
                </option>
                <option key={"Both"} value="Both">
                  Both
                </option>
              </select>
              <Typography className="label">Remarks</Typography>

              <input
                className="textInput"
                required
                type={"text"}
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                }}
              />
              <Typography className="label">Service Asset</Typography>
              <ReactSelect
                isMulti
                menuPlacement="top"
                className="multiSelect"
                isDisabled
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                options={assetsOptions}
                value={assets}
              />
            </div>

            <div className="right_side">
              <Typography className="label">Contract Name</Typography>
              <input
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
                value={selectedServicePkg}
                onChange={(e) => {
                  setSelectedServicePkg(e.target.value);
                  console.log("selectedServicePkg", selectedServicePkg);

                  // const serviceItem = listOfServiceItem
                  //   .filter((service: ServiceItem) => {
                  //     return service.category_id === e.target.value;
                  //   })
                  //   .map((service: ServiceItem) => {
                  //     return {
                  //       value: service.name,
                  //       label: service.name,
                  //     };
                  //   });
                  // console.log("serviceItem", serviceItem);
                }}
              >
                {listOfServicePackage.map(
                  (ServiceCategory: ServiceCategory) => {
                    return (
                      <option
                        key={ServiceCategory.id}
                        value={ServiceCategory.name}
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
                value={selectedProjectManager}
                onChange={(e) => {
                  setSelectedProjectManager(e.target.value);
                }}
              >
                {listOfProjectManager.map((projectManager: ProjectManager) => {
                  return (
                    <option
                      key={projectManager.id}
                      value={`${projectManager.first_name} ${projectManager.last_name} (${projectManager.email})`}
                      aria-label={
                        projectManager.first_name +
                        " " +
                        projectManager.last_name
                      }
                    >
                      {`${projectManager.first_name} ${projectManager.last_name} (${projectManager.email})`}
                    </option>
                  );
                })}
              </select>
              <Typography className="label">Contract Hours</Typography>
              <input
                className="textInput"
                type="number"
                step={"any"}
                value={contractHours}
                onChange={(e) => {
                  try {
                    if (e.target.value === "") {
                      setContractHours("");
                    }
                    setContractHours(parseFloat(e.target.value));
                  } catch (e) {}
                }}
              />
              <Typography className="label">SLA</Typography>
              <select
                className="textInput"
                value={selectedSLA}
                onChange={(e) => {
                  setSelectedSLA(e.target.value);
                }}
              >
                {listOfSLA.map((sla: SLA) => {
                  return (
                    <option key={sla.id} value={sla.name}>
                      {sla.name}
                    </option>
                  );
                })}
              </select>
              <Typography className="label">Support Time</Typography>
              <select
                className="textInput"
                value={selectedSupportTime}
                onChange={(e) => {
                  setSelectedSLA(e.target.value);
                }}
              >
                {listOfSupportTime.map((supportTime: SupportTime) => {
                  return (
                    <option key={supportTime.id} value={supportTime.name}>
                      {supportTime.name}
                    </option>
                  );
                })}
              </select>
              <Typography className="label">Consumed Hours</Typography>
              <input
                className="textInput"
                type="number"
                step={"any"}
                onChange={(e) => {
                  try {
                    if (e.target.value === "") {
                      setConsumedHours("");
                    }
                    setConsumedHours(parseFloat(e.target.value));
                  } catch (e) {}
                }}
                value={consumedHours}
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

              <select
                name="firstAssignmentGroup"
                id="firstAssignmentGroup"
                className="selectInput"
                value={selectedFirstAssignmentGroup}
                onChange={(e) => {
                  setSelectedFirstAssignmentGroup(e.target.value);
                  const ids = listOfFirstAssignmentGroup
                    .filter((agent: AgentGroups) => {
                      return agent.name === e.target.value;
                    })
                    .map((agent: AgentGroups) => {
                      return agent.agent_ids;
                    });

                  if (ids[0].length > 0) {
                    getFirstAssignmentAgentByID(ids[0]);
                  } else {
                    setSelectedFirstAssigmentAgent("");
                    setListOfFirstAssignmentAgent([]);
                  }
                }}
              >
                {listOfFirstAssignmentGroup.map(
                  (firstAssignmentGroup: AgentGroups) => {
                    return (
                      <option
                        key={firstAssignmentGroup.id}
                        value={firstAssignmentGroup.name}
                        aria-label={firstAssignmentGroup.name}
                      >
                        {firstAssignmentGroup.name}
                      </option>
                    );
                  }
                )}
              </select>
              <Typography className="label">First assignment agent</Typography>

              <select
                name="firstAssignmentAgent"
                id="firstAssignmentAgent"
                className="selectInput"
                value={selectedFirstAssigmentAgent}
                onChange={(e) => {
                  setSelectedFirstAssigmentAgent(e.target.value);
                }}
              >
                {listOfFirstAssignmentAgent.map(
                  (firstAssigmentAgent: FirstAssigmentAgent) => {
                    return (
                      <option
                        key={firstAssigmentAgent.id}
                        value={`${firstAssigmentAgent.first_name} ${firstAssigmentAgent.last_name} (${firstAssigmentAgent.email})`}
                        aria-label={`${firstAssigmentAgent.first_name} ${firstAssigmentAgent.last_name} (${firstAssigmentAgent.email})`}
                      >
                        {`${firstAssigmentAgent.first_name} ${firstAssigmentAgent.last_name} (${firstAssigmentAgent.email})`}
                      </option>
                    );
                  }
                )}
              </select>
              <Typography className="label">Contract Owner</Typography>

              <select
                className="selectInput"
                value={selectedContractOwnerID}
                onChange={async (e) => {
                  setSelectedContractOwnerID(e.target.value);
                  listOfContractOwner.map((contractOwner: ContractOwner) => {
                    if (contractOwner.id === parseInt(e.target.value)) {
                      setSelectedContractOwnerDetails(
                        `${contractOwner.first_name} ${contractOwner.last_name} (${contractOwner.primary_email})`
                      );
                    }
                    console.log(
                      "Details",
                      `${contractOwner.first_name} ${contractOwner.last_name} (${contractOwner.primary_email})`
                    );
                  });
                  const contractOwnerLocation = await getLocationByID(
                    e.target.value
                  );
                  console.log("Contract Owner Location", contractOwnerLocation);
                }}
              >
                {listOfContractOwner.map((contractOwner: ContractOwner) => {
                  return (
                    <option
                      key={contractOwner.id}
                      value={`${contractOwner.id}`}
                      aria-label={`${contractOwner.first_name} ${contractOwner.last_name} (${contractOwner.primary_email})`}
                    >
                      {`${contractOwner.first_name} ${contractOwner.last_name} (${contractOwner.primary_email})`}
                    </option>
                  );
                })}
              </select>
              <Typography className="label">Country</Typography>
              <input
                className="textInput"
                type="text"
                readOnly
                defaultValue={contractOwnerLocation}
              />
              <Typography className="label">Customer User</Typography>

              <select
                name="customerUser"
                className="selectInput"
                id="customerUser"
                value={selectedCustomerUserID}
                onChange={(e) => {
                  setselectedCustomerUserID(e.target.value);
                  listOfCustomerUser.map((customerUser: CustomerUser) => {
                    if (customerUser.id === parseInt(e.target.value)) {
                      setSelectedCustomerUser(
                        `${customerUser.first_name} ${customerUser.last_name} (${customerUser.primary_email})`
                      );
                    }
                  });
                }}
              >
                {listOfCustomerUser.map((customerUser: CustomerUser) => {
                  return (
                    <option
                      key={customerUser.id}
                      value={customerUser.id}
                      aria-label={customerUser.first_name}
                    >
                      {customerUser.first_name +
                        " " +
                        customerUser.last_name +
                        ` (${customerUser.primary_email})`}
                    </option>
                  );
                })}
              </select>
              <Typography className="label">Remaining Time</Typography>
              <input
                className="textInput"
                type="number"
                step={"any"}
                value={contract?.remainingHours ?? "NA"}
                onChange={(e) => {
                  try {
                    if (e.target.value === "") {
                      setRemainingTime("");
                    }
                    setRemainingTime(parseFloat(e.target.value));
                  } catch (e) {}
                }}
              />
            </div>
          </div>
          <div className="button_container">
            <button key="btn" type="submit" className="createContractBtn">
              Update Contract
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditContract;

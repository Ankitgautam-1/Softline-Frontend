import React, { Suspense, useEffect, useState } from "react";
import { DataGrid, GridFilterModel } from "@mui/x-data-grid";
import "./Table.scss";
import "antd/dist/antd.css";

import Cookies from "js-cookie";
import { Contract } from "../../interfaces/Contracts";
import { useDispatch, useSelector } from "react-redux";
import { unAuth, userState } from "../../store/userAuth/userAuthSlice";
import { Box, Typography, Button, Popover } from "@mui/material";

import { DatePicker, Input, Space, Tooltip } from "antd";
import moment, { Moment } from "moment";
import { ServiceCategory } from "../../interfaces/ServicePackage";
import { ServiceItem } from "../../interfaces/ServiceItem";
import { ProjectManager } from "../../interfaces/Agents";

import { Department } from "../../interfaces/Companies";
import ModalComponents from "../Modal/Modal";
import { getContracts, resetContract } from "../../store/contracts";
import { AiFillEye, AiFillDelete, AiOutlinePoweroff } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import ViewContract from "../viewContract/viewContract";
import { dateDiff } from "../../Utils/helperFunction";
import { DeleteForever } from "@mui/icons-material";
import download from "downloadjs";
import axiosConfig from "../../Utils/axiosConfig";
import { useNavigate } from "react-router-dom";

interface ViewContractProps {
  contract: Contract | null;
  openModal: boolean;
}
interface EditContractProps {
  contract: Contract | null;
  openModal: boolean;
}
interface DataTableProps {
  listOfContract: Contract[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  totalRow: number;
}
const intialDataTableProps: DataTableProps = {
  currentPage: 1,
  isLoading: false,
  listOfContract: [],
  totalPages: 0,
  totalRow: 0,
};

export default function Table() {
  const EditContract = React.lazy(() => import("../editContract/editContract"));
  const [openModel, setOpenModel] = useState(false);
  const authReducer = useSelector((state: { userReducer: userState }) => {
    return state.userReducer;
  });
  const contractState = useSelector((state: { contractState: Contract[] }) => {
    return state.contractState;
  });
  const dispatch: any = useDispatch();
  const [viewContract, setViewContract] = useState<ViewContractProps>({
    openModal: false,
    contract: null,
  });
  const [editContract, seteditContract] = useState<EditContractProps>({
    openModal: false,
    contract: null,
  });
  const downloadFiles = (folder: string) => {
    axiosConfig
      .get(`api/v1/getFiles?folder=018`, {
        headers: {
          "Content-Type": "application/zip",
        },
      })
      .then((res) => {
        console.log("file1", res);

        download(res.data, `018.zip`);
      });
  };
  const [pageSize, setpageSize] = useState(10);
  //contract details

  // useEffect(() => {
  // 	const getPaginatedData = async () => {
  // 		setContractsData((prev: DataTableProps) => {
  // 			return { ...prev, isLoading: true };
  // 		});
  // 		console.log('getPaginatedData');

  // 		const result = await axiosConfig.post(
  // 			'http://localhost:3001/api/v1/paginated'
  // 		);

  // 		if (result.data.ok) {
  // 			setContractsData({
  // 				isLoading: false,
  // 				listOfContract: result.data.contract,
  // 				currentPage: result.data.currentPage,
  // 				totalPages: result.data.totalPages,
  // 			});
  // 			console.log('result.data.contract', result.data);
  // 		} else {
  // 			console.log(result.statusText);
  // 		}
  // 	};
  // 	getPaginatedData();
  // }, []);
  interface queryProps {
    field: string;
    value: string;
  }
  const navigate = useNavigate();
  const initialQueryProps = { field: "", value: "" };
  const [pageNumber, setPageNumber] = useState(1);

  const [queryOptions, setQueryOptions] =
    useState<queryProps>(initialQueryProps);

  const [pageState, setPageState] =
    useState<DataTableProps>(intialDataTableProps);
  const [pastPageState, setpastPageState] =
    useState<DataTableProps>(intialDataTableProps);
  const fetchDataForNewPageSize = async (
    custompageSize?: number,
    filterData?: string,
    filterColumn?: string,
    pgN: number = 1
  ) => {
    let url;
    if (filterData && filterColumn) {
      url = `/api/v1/paginated?page=${pgN}&limit=${pageSize}&filterValue=${filterData}&filterColumn=${filterColumn}`;
    } else {
      url = `/api/v1/paginated?page=1&limit=${custompageSize}`;
    }
    const response = await axiosConfig.get(url);
    const resultData = await response.data;
    console.log("resultData", resultData);

    setPageState((old) => ({
      ...old,
      isLoading: false,
      listOfContract: resultData.contract,
      currentPage: parseInt(resultData.currentPage),
      totalPages: resultData.totalPages,
      totalRow: resultData.totalRow,
    }));
  };
  const fetchData = async (
    filterData?: string,
    filterColumn?: string,
    pgN: number = 1
  ) => {
    if (isNaN(pgN)) {
      pgN = 1;
    }
    setPageState((old) => ({ ...old, isLoading: true }));
    let url;
    console.log("pgN", pgN);

    if (filterData && filterColumn) {
      url = `/api/v1/paginated?page=${pgN}&limit=${pageSize}&filterValue=${filterData}&filterColumn=${filterColumn}`;
      console.log("getting this data", url);
    } else {
      url = `/api/v1/paginated?page=${pgN}&limit=${pageSize}`;
    }
    const response = await axiosConfig.get(url);
    const resultData = await response.data;
    if (resultData.contract.length > 0) {
      const newList = resultData.contract.map((item: Contract) => {
        const currentDate = moment();
        const startDate = moment(item.startDate);

        if (startDate.isAfter(currentDate)) {
          return { ...item, state: "Not Started" };
        } else {
          const endDate = moment(item.endDate);

          const diff = endDate.diff(currentDate, "days");
          console.log("diff", diff);

          if (diff > 20) {
            return { ...item, state: "Active" };
          } else if (diff > 0 && diff < 20) {
            return { ...item, state: "Expiring" };
          } else {
            return { ...item, state: "Expired" };
          }
        }
      });
      setPageState((old) => ({
        ...old,
        isLoading: false,
        listOfContract: newList,
        currentPage: parseInt(resultData.currentPage),
        totalPages: resultData.totalPages,
        totalRow: resultData.totalRow,
      }));
    } else {
      setPageState((old) => ({
        ...old,
        isLoading: false,
        listOfContract: resultData.contract,
        currentPage: parseInt(resultData.currentPage),
        totalPages: resultData.totalPages,
        totalRow: resultData.totalRow,
      }));
    }
    console.log("resultData", resultData);
  };

  useEffect(() => {
    if (authReducer.auth) {
      fetchData(queryOptions.value, queryOptions.field, pageNumber);
    }
  }, []);
  console.log("pageState", pageState);
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
  const handleOpenEditContract = (contract: Contract) => {
    seteditContract({ contract: contract, openModal: true });
  };
  const handleCloseEditContract = () => {
    seteditContract({ contract: null, openModal: false });
  };
  const handelRefresh = () => {
    fetchData();
  };

  const handleLogout = () => {
    dispatch(unAuth());
    dispatch(resetContract());
    Cookies.remove("accessToken", {
      path: "/",
      domain: "localhost",
    });

    navigate("/", { replace: true });
  };
  const updateContract = async () => {
    fetchData();
  };
  console.log("rendering");

  return (
    <div style={{ width: "100%" }} className="contanier">
      <div className="buttons">
        <Button className="createButton" onClick={handleOpen}>
          Create Contract
        </Button>
        <Button className="logoutBtn" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <ModalComponents
        handelCancel={handleClose}
        openModal={openModel}
        updateContract={updateContract}
      />
      {editContract.openModal ? (
        <Suspense fallback={<span></span>}>
          <EditContract
            openModal={editContract.openModal}
            contract={editContract.contract}
            handelCancel={handleCloseEditContract}
            handelRefresh={handelRefresh}
          />
        </Suspense>
      ) : null}
      <ViewContract
        contract={viewContract.contract}
        openModal={viewContract.openModal}
        handelCancel={handleCloseViewContract}
      />

      <>
        <DataGrid
          autoHeight
          onFilterModelChange={(filterMode: GridFilterModel) => {
            if (filterMode.items && filterMode.items.length > 0) {
              fetchData(
                filterMode.items[0].value,
                filterMode.items[0].columnField,
                1
              );
              setQueryOptions({
                field: filterMode.items[0].columnField,
                value: filterMode.items[0].value,
              });
            } else {
              fetchData();
            }
          }}
          rowCount={pageState.totalRow}
          rows={
            pageState.listOfContract.length > 0 ? pageState.listOfContract : []
          }
          loading={pageState.isLoading}
          rowsPerPageOptions={[10, 30, 50, 70, 100]}
          pagination
          page={pageState.currentPage - 1}
          pageSize={pageSize}
          disableSelectionOnClick
          filterMode="server"
          paginationMode="server"
          onPageChange={(oldpage) => {
            setPageNumber(oldpage + 1);
            fetchData(queryOptions.value, queryOptions.field, oldpage + 1);
          }}
          onPageSizeChange={(newPageSize) => {
            setpageSize(newPageSize);
            if (queryOptions.field && queryOptions.value) {
              console.log("if called");

              fetchDataForNewPageSize(
                newPageSize,
                queryOptions.value,
                queryOptions.field
              );
            } else {
              console.log("else called");

              fetchDataForNewPageSize(newPageSize);
            }
          }}
          columns={[
            {
              field: "actions",
              headerName: "Actions",
              width: 130,
              renderCell(params) {
                return (
                  <div
                    style={{
                      width: "120px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {" "}
                    <Tooltip title="View" color={"#2e2d2d"}>
                      <AiFillEye
                        style={{
                          cursor: "pointer",

                          borderRadius: 5,
                          border: "none",
                          padding: "5px",
                          backgroundColor: "#06bb30",
                          color: "#f3f3f3",
                        }}
                        size="30"
                        onClick={(e) => {
                          handleOpenViewContract(params.row);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Edit" color={"#2e2d2d"}>
                      <FiEdit
                        style={{
                          cursor: "pointer",

                          borderRadius: 5,
                          border: "none",
                          padding: "5px",
                          backgroundColor: "#06bb30",
                          color: "#f3f3f3",
                        }}
                        size="30"
                        onClick={(e) => {
                          handleOpenEditContract(params.row);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Deactive" color={"#2e2d2d"}>
                      <AiFillDelete
                        style={{
                          cursor: "pointer",
                          borderRadius: 5,
                          border: "none",
                          padding: "5px",
                          backgroundColor: "#d42c2c",
                          color: "#f3f3f3",
                        }}
                        size="30"
                      />
                    </Tooltip>
                  </div>
                );
              },
            },
            {
              field: "state",
              headerName: "State",
              width: 110,
              renderCell(params) {
                if (params.value === "Active") {
                  return (
                    <span style={{ color: "#06bb30", fontSize: "16px" }}>
                      {params.value}
                    </span>
                  );
                } else if (params.value === "Not Started") {
                  return (
                    <span style={{ color: "#78ac7d", fontSize: "16px" }}>
                      {params.value}
                    </span>
                  );
                } else if (params.value === "Expiring") {
                  return (
                    <span style={{ color: "#f1ae14", fontSize: "16px" }}>
                      {params.value}
                    </span>
                  );
                } else {
                  return (
                    <span
                      style={{
                        color: "red",
                        fontSize: "16px",
                      }}
                    >
                      {params.value}
                    </span>
                  );
                }
              },
            },
            {
              field: "id",
              headerName: "ID",
              width: 85,
              filterable: true,
            },
            {
              field: "contractName",
              headerName: "Contract Name",
              width: 150,
              filterable: true,
            },
            {
              field: "company",
              headerName: "Company",
              width: 150,
            },
            {
              field: "servicePackage",
              headerName: "Service Package",
              width: 200,
            },
            {
              field: "serviceItem",
              headerName: "Service Item",
              width: 200,
            },
            {
              field: "assets",
              headerName: "Assets",
              width: 150,
            },

            {
              field: "startDate",
              headerName: "Start Date",
              width: 200,
              renderCell(params) {
                return moment(params.value).format("ll");
              },
            },
            {
              field: "endDate",
              headerName: "End Date",
              width: 200,
              renderCell(params) {
                return moment(params.row.endDate).format("ll");
              },
            },

            {
              field: "typeOfHours",
              headerName: "Type Of Hours",
              width: 120,
            },
            {
              field: "totalEntitlement",
              headerName: "Total Entitlement",
              width: 120,
            },
            {
              field: "projectManager",
              headerName: "Project Manager",
              width: 150,
            },
            {
              field: "remarks",
              headerName: "Remarks",
              width: 120,
            },
            {
              field: "files",
              headerName: "Files",
              width: 120,
              renderCell(params) {
                return (
                  params.value && (
                    <div>
                      <Tooltip title="Download Files" color={"#2e2d2d"}>
                        <button
                          style={{
                            cursor: "pointer",
                            borderRadius: 5,
                            border: "none",
                            padding: "5px 10px",
                            backgroundColor: "#06bb30",
                            color: "#f3f3f3",
                          }}
                          onClick={(e) => {
                            downloadFiles(params.row.id);
                          }}
                        >
                          Download
                        </button>
                      </Tooltip>{" "}
                    </div>
                  )
                );
              },
            },
          ]}
        />
      </>
    </div>
  );
}

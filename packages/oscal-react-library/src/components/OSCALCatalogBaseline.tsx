import React, { useState, useEffect } from "react";
import { EditableFieldProps } from "./OSCALEditableTextField";
import { Button, ButtonGroup, NativeSelect, TextField, Tooltip } from "@mui/material";
import BreadCrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import { Divider, TooltipProps } from "@mui/material";
import { Stack, styled } from "@mui/system";
import { useFetchers } from "./Fetchers";
import { OSCALDialogTitle, OSCALEditingDialog } from "./styles/OSCALDialog";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepConnector from "@mui/material/StepConnector";
import StepLabel from "@mui/material/StepLabel";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Theme } from "@mui/system/createTheme/createTheme";

import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import FileIcon from "./images/icons/filebucket.svg";
import UploadIcon from "./images/icons/fileUpload.svg";
import GreenCircle from "./images/icons/greenCircle.svg";
import GreenCheck from "./images/icons/greenCheck.svg";
import RedCircle from "./images/icons/redCircle.svg";
import RedCheck from "./images/icons/redX.svg";
import BlueCircle from "./images/icons/blueCircle.svg";
import SemiCircle from "./images/icons/semiCircleOrange.svg";
import CloseIcon from "@mui/icons-material/Close";
import { OSCALDialogActions, OSCALWarningDialog } from "./styles/OSCALDialog";

import { Typography, Container, Grid } from "@mui/material";
import {
  OSCALPrimaryButton,
  OSCALSecondaryButton,
  OSCALTertiaryButton,
  OSCALTertiaryGrayscaleButton,
  OSCALPrimaryDestructiveButton,
} from "./styles/OSCALButtons";
import { OSCALTextField, OSCALRadio, OSCALFormLabel } from "./styles/OSCALInputs";

import { FormatBold, FormatItalic, FormatQuote, Subscript, Superscript } from "@mui/icons-material";

import { CodeOffSharp } from "@mui/icons-material";
import { OSCALError } from "./styles/OSCALAlerts";

const MainImage = styled("img")`
  margin-right: 1em;
`;

const StackBox = styled(Box)`
  position: absolute;
  top: 186px;
  left: 40px;
  width: 1188px;
  height: 800px;
`;

const ItemBox = styled(Box)(({ theme }) => ({
  background: theme.palette.white.main,
  height: 187.11,
  width: 331,
  borderRadius: "0px",
  border: "1px solid",
  borderColor: theme.palette.lightMagenta.main,
  boxShadow: `0px 0px 10px 0px ${theme.palette.smokyWhite.main}`,
  position: "relative",
}));

const CTab = styled(Tab)(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.lightGray.main,
}));

const ItemResult = styled(Typography)(({ theme }) => ({
  fontFamily: "Source Sans Pro",
  fontWeight: 700,
  fontSize: 14,
  color: theme.palette.black.main,
  position: "absolute",
}));
const ItemTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "Source Sans Pro",
  fontWeight: 400,
  fontSize: 14,
  color: theme.palette.black.main,
  position: "absolute",
}));
const ItemDivider = styled(Divider)(({ theme }) => ({
  height: 0,
  width: 331,
  borderRadius: 0,
  position: "absolute",
  left: "0%",
  right: "53.35%",
  top: "25.91%",
  bottom: "74.09%",
  border: "1px solid",
  borderColor: theme.palette.shadyGray.main,
}));
const StepperBar = styled(Stepper)(({ theme }) => ({
  width: 506,
  height: 80,
  border: 1,
  fontFamily: "Source Sans Pro",
  fontSize: 20,
  fontWeight: 700,
  lineHeight: 25,
  letterSpacing: "0em",
  textAlign: "left",
  color: theme.palette.white.main,
}));
const StepItemLabel = styled(StepLabel)(({ theme }) => ({
  width: 35,
  height: 30,
  top: 40,
  left: 10,
  fontFamily: "Source Sans Pro",
  fontSize: 20,
  fontWeight: 700,
  lineHeight: 25,
  letterSpacing: "0em",
  textAlign: "left",
  background: theme.palette.white.main,
}));

const SecondLabel = styled(Typography)`
  font-family: "Source Sans Pro";
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: "left";
`;
const OSCALBreadCrumbs = styled(BreadCrumbs)(({ theme }) => ({
  fontFamily: "Source Sans Pro",
  position: "absolute",
  width: 800,
  height: 100,
  top: 96,
  left: 40,
  ":hover": {
    color: theme.palette.primaryAccent.main,
  },
}));
const CatalogTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  fontSize: 20,
  boxShadow: `0px 0px 10px 0px ${theme.palette.smokyWhite.main}`,
}));

const ButtonTypography = styled(Typography)`
  font-family: Source Sans Pro;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
`;
export interface ContactInfo extends EditableFieldProps {
  name?: string;
  phone?: string;
  email?: string;
  address?: Address;
}
export interface Address extends EditableFieldProps {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
}
interface CatalogBaseline extends EditableFieldProps {
  isVisible: boolean;
  isCatalog?: boolean;
  title?: string;
  lastModified?: string;
  publicationDate?: string;
  projectUUID?: string;
  documentVersion?: string;
  description?: string;
  orgContactInfo?: ContactInfo;
  authorContactInfo?: ContactInfo;
}
export interface OSCALModel extends EditableFieldProps {
  model: CatalogBaseline;
  startCollectingOrgDetails?: boolean;
  startCollectingAuthorDetails?: boolean;
}

interface OSCALModelMetadataInfo extends EditableFieldProps {
  readonly title?: string;
  readonly lastModified?: string;
  readonly version?: string;
  readonly publicationDate?: string;
  projectUUID?: string;
  isCatalog?: boolean;
}

export interface ItemList {
  readonly Items: Array<OSCALModelMetadataInfo>;
}
export interface Project {
  readonly ProjectUUID: string;
  readonly model: string;
}
export interface ProjectUUIDs {
  readonly CatalogUUIDS: Array<string>;
  readonly ProfileUUIDS: Array<string>;
}

export function CatalogBaselineTabs(_data: OSCALModel) {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        typography: "body1",
        minHeight: 650,
        minWidth: 600,
        top: 200,
        left: 40,
        right: 110,
        position: "absolute",
        background: (theme) => theme.palette.white.main,
      }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            sx={{ background: (theme) => theme.palette.backgroundGray.main }}
          >
            <CTab
              label="Controls"
              value="1"
              sx={{
                background:
                  value === "1"
                    ? (theme: Theme) => theme.palette.white.main
                    : (theme: Theme) => theme.palette.lightGray.main,
              }}
            />
            <CTab
              label="Catalog Details"
              value="2"
              sx={{
                background:
                  value === "2"
                    ? (theme: Theme) => theme.palette.white.main
                    : (theme: Theme) => theme.palette.lightGray.main,
              }}
            />
            <CTab
              label="Directory"
              value="3"
              sx={{
                background:
                  value === "3"
                    ? (theme: Theme) => theme.palette.white.main
                    : (theme: Theme) => theme.palette.lightGray.main,
              }}
            />
            <CTab
              label="Resources"
              value="4"
              sx={{
                background:
                  value === "4"
                    ? (theme: Theme) => theme.palette.white.main
                    : (theme: Theme) => theme.palette.lightGray.main,
              }}
            />
          </TabList>
        </Box>
        <TabPanel value="1">Control</TabPanel>
        <TabPanel value="2">Catalog Details</TabPanel>
        <TabPanel value="3">Directory</TabPanel>
        <TabPanel value="4">Back Matter</TabPanel>
      </TabContext>
    </Box>
  );
}
export function OSCALDateTimeConversion(oscalTime: string): string {
  let regularTime = oscalTime;
  if (oscalTime.includes("-") && oscalTime.includes("T") && oscalTime.includes(":")) {
    const vector = oscalTime.split("-");
    const year = vector[0];
    const month = vector[1];
    const nextStep = vector[2].split("T");
    const day = nextStep[0];
    const time = nextStep[1];
    const lastStep = time.split(":");
    const hourString = lastStep[0];
    const min = lastStep[1];
    const hourInt = parseInt(hourString);
    const meridian = hourInt < 12 ? "AM" : "PM";
    const realHour = hourInt % 12;
    regularTime =
      month + "/" + day + "/" + year + ", " + realHour.toString() + ":" + min + " " + meridian;
  }
  return regularTime;
}
export default function OSCALCatalogBaseline() {
  const fetchers = useFetchers();
  const fetchTransaction = fetchers["fetchTransaction"];
  const fetchRest = fetchers["fetchRest"];
  const fetchUploadFile = fetchers["fetchUploadFile"];

  let Model = "Catalog";
  const [AddNewCatalogBaseline, setAddNewCatalogBaseline] = useState(false);
  const [uploadNewCatalogBaseline, setUploadNewCatalogBaseline] = useState(false);
  const [AddOrgDetails, setAddOrgDetails] = useState(false);
  const [createdNewCatalogBaseline, setCreatedNewCatalogBaseline] = useState(false);
  const [AddAuthorDetails, setAddAuthorDetails] = useState(false);
  const [catalogIds, setCatalogIds] = useState<string[]>([]);
  const [baselineIds, setBaselineIds] = useState<string[]>([]);
  const Data: CatalogBaseline = {
    isCatalog: true,
    isVisible: true,
  };
  const [mainData, setMainData] = useState<CatalogBaseline>(Data);
  const [orgAddress, setOrgAddress] = useState<Address>({});
  const [orgContact, setOrgContact] = useState<ContactInfo>({});
  const [authorAddress, setAuthorAddress] = useState<Address>({});
  const [authorContact, setAuthorContact] = useState<ContactInfo>({});
  const [openCatalogBaseline, setOpenCatalogBaseline] = useState(false);
  const [noUploadCreateHug, setNoUploadCreatedHug] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newOSCALModel, setNewOSCALModel] = useState<CatalogBaseline | undefined>(undefined);
  let newModelCreationDone = false;
  let address: Address = orgAddress;
  let contact: ContactInfo = {};
  address = authorAddress;
  const createdModel = newOSCALModel === undefined ? Data : newOSCALModel;
  const LabelText = openCatalogBaseline
    ? createdModel.title
    : uploadNewCatalogBaseline
    ? " Upload a Catalog or Baseline "
    : " Catalogs & Baselines";
  Model = createdModel.isCatalog ? "Catalog" : "Baseline";

  useEffect(() => {
    getCatalogIds();
    getBaselineIds();
  }, []);

  function getCatalogIds() {
    const request_json = {
      method: "GET",
    };
    fetchRest(
      "/catalog",
      request_json,
      getCatalogProjectsStatusSuccess,
      getCatalogProjectsStatusFail
    );

    function getCatalogProjectsStatusSuccess(response: {
      [x: string]: React.SetStateAction<string[]>;
    }) {
      setCatalogIds(response["projects"]);
    }
    function getCatalogProjectsStatusFail(e: any) {
      console.log("Operation fail " + e.statusText);
    }
  }

  function renderTabs(data: OSCALModel) {
    if (openCatalogBaseline) return <CatalogBaselineTabs model={data.model}></CatalogBaselineTabs>;
    else return null;
  }

  function getBaselineIds() {
    const request_json = {
      method: "GET",
    };
    fetchRest(
      "/profile",
      request_json,
      getProfileProjectsStatusSuccess,
      getProfileProjectsStatusFail
    );

    function getProfileProjectsStatusSuccess(response: {
      [x: string]: React.SetStateAction<string[]>;
    }) {
      setBaselineIds(response["projects"]);
    }
    function getProfileProjectsStatusFail(e: any) {
      console.log("Operation fail " + e.statusText);
    }
  }
  function loadPage() {
    setNewOSCALModel(undefined);
    setOpenCatalogBaseline(false);
    setUploadNewCatalogBaseline(false);
    setNoUploadCreatedHug(false);
    getCatalogIds();
    getBaselineIds();
    return { renderFilledItemBox };
  }
  const CatalogBreadCrumbsMenu: React.FC<OSCALModel | undefined> = (item) => {
    const usedTitle = item?.model.title ?? "";
    const trunckatedTitle = usedTitle.length > 30 ? usedTitle.substring(0, 29) + "..." : usedTitle;
    if (item !== undefined && item.model.title !== undefined && item.model.title.length > 0)
      return (
        <BreadCrumbs
          maxItems={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={2}
          aria-label="breadcrumb"
          sx={{
            position: "absolute",
            width: 800,
            height: 100,
            top: 96,
            left: 40,
            ":hover": {
              color: (theme) => theme.palette.primaryAccent.main,
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: (theme) => theme.palette.black.main,
              ":hover": {
                color: (theme) => theme.palette.primaryAccent.main,
              },
            }}
            onClick={loadPage}
          >
            Home
          </Typography>

          <Typography
            variant="h3"
            sx={{
              color: (theme) => theme.palette.lightBlack.main,
              ":hover": {
                color: (theme) => theme.palette.primaryAccent.main,
              },
            }}
            onClick={loadPage}
          >
            CATALOGS & BASELINES
          </Typography>
          <CatalogTooltip title={usedTitle.toUpperCase()}>
            <Typography
              color="primary"
              variant={"h2"}
              sx={{
                width: 400,
                ":hover": {
                  color: (theme) => theme.palette.primaryAccent.main,
                },
              }}
            >
              {trunckatedTitle.toUpperCase()}
            </Typography>
          </CatalogTooltip>
        </BreadCrumbs>
      );
    else if (uploadNewCatalogBaseline) {
      return (
        <OSCALBreadCrumbs
          aria-label="breadcrumb"
          maxItems={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={2}
        >
          <Typography
            variant="h3"
            sx={{
              color: (theme) => theme.palette.black.main,
              ":hover": {
                color: (theme) => theme.palette.primaryAccent.main,
              },
            }}
            onClick={loadPage}
          >
            Home
          </Typography>
          <OSCALTertiaryGrayscaleButton>
            <Typography
              variant="h3"
              sx={{
                color: (theme) => theme.palette.lightBlack.main,
                ":hover": {
                  color: (theme) => theme.palette.primaryAccent.main,
                },
              }}
              onClick={loadPage}
            >
              CATALOGS & BASELINES
            </Typography>
          </OSCALTertiaryGrayscaleButton>
          <Typography
            color="primary"
            variant={"h2"}
            sx={{
              fontWeight: (theme) => theme.typography.fontWeightBold,
              textTransform: "uppercase",
              ":hover": {
                color: (theme) => theme.palette.primaryAccent.main,
              },
              fontFamily: "Source Sans Pro",
            }}
          >
            UPLOAD
          </Typography>
        </OSCALBreadCrumbs>
      );
    }
    return (
      <OSCALBreadCrumbs
        aria-label="breadcrumb"
        maxItems={3}
        itemsBeforeCollapse={1}
        itemsAfterCollapse={2}
      >
        <Typography
          variant="h3"
          sx={{
            ":hover": {
              color: (theme) => theme.palette.primaryAccent.main,
            },
          }}
          onClick={loadPage}
        >
          Home
        </Typography>

        <Typography
          color="primary"
          variant={"h2"}
          sx={{
            textTransform: "uppercase",
            ":hover": {
              color: (theme) => theme.palette.primaryAccent.main,
            },
          }}
        >
          CATALOGS & BASELINES
        </Typography>
      </OSCALBreadCrumbs>
    );
  };
  function RenderUpload() {
    const [upload, setUpload] = useState(false);
    const [uploadSuccessful, setUploadSuccessfulStatus] = useState(false);
    const [startDropping, setStartDropping] = useState(false);
    const [fileName, setFileName] = useState("");
    const [newOSCALFilePath, setNewOSCALFilePath] = useState("");
    const [endUploading, setEndUploading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    function handleUpload() {
      setUpload(true);
      setNoUploadCreatedHug(true);
    }

    const onUpload = (event: any) => {
      if (!event.target.files || event.target.files.length === 0) {
        console.log("Issues handling file import. Browser may not support file system upload.");
        return;
      }
      //const file = event.target.files[0];
      //  const fileUrl = URL.createObjectURL(file);  TODO Keeping this line of code if later we need to upload a file from a url.
      const files = event.target.files;
      doSubmitUploadFile(files[0]);
    };
    const handleDrag = (event: any) => {
      setStartDropping(true);
      setEndUploading(false);
      event.preventDefault();
      event.stopPropagation();
    };
    const handleDrop = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      event.target.style.border = `1px solid 0028675E`;
      if (event.dataTransfer && event.dataTransfer.files.length !== 0) {
        const files = event.dataTransfer.files;
        console.log("File Successfully from, now uploading the file to the server");
        doSubmitUploadFile(files[0]);
      } else {
        console.log("Issues handling file import. Browser may not support drag and drop.");
      }
    };

    function doSubmitUploadFile(filename: File) {
      if (filename === null) {
        return;
      }
      setFileName(filename.name);
      console.log("Main File", filename.name);
      fetchUploadFile(filename, uploadFileSuccess, uploadFileFail);
    }
    function uploadFileSuccess(response: any) {
      const filename = response["filename"];
      console.log(
        "File " + filename + " uploaded successfully. Response was " + JSON.stringify(response)
      );

      const request_json = {
        file: filename,
      };
      fetchTransaction(
        "/create_oscal_project",
        request_json,
        createOscalProjectSuccess,
        createOscalProjectFail
      );
    }

    function uploadFileFail(e: any) {
      console.log("upload failed", e);
      setUploadSuccessfulStatus(false);
      setStartDropping(false);
      setShowAlert(true);
    }

    function createOscalProjectSuccess(response: any) {
      console.log("upload successful", response);
      setNewOSCALFilePath(response["new_oscal_file"]);
      setUploadSuccessfulStatus(true);
      setStartDropping(false);
      setEndUploading(true);
    }

    function createOscalProjectFail(e: any) {
      console.log("upload failed", e);
      setUploadSuccessfulStatus(false);
      setStartDropping(false);
      setEndUploading(true);
      setShowAlert(true);
    }
    function handleGoBack() {
      setStartDropping(false);
      setEndUploading(false);
      setUploadSuccessfulStatus(false);
    }
    function handleCloseAlert() {
      setShowAlert(false);
    }
    function handleOpenFile() {
      const request_json = {
        oscal_file: newOSCALFilePath,
      };
      setUpload(true);
      setUploadNewCatalogBaseline(false);
      fetchTransaction("/get_metadata", request_json, getMetadataSuccess, getMetadataFail);
      function getMetadataSuccess(response: any) {
        console.log("newly response", response);
        const model: CatalogBaseline = {
          title: response.title,
          lastModified: response.lastModified,
          documentVersion: response.version,
          publicationDate: response.publicationDate,
          projectUUID: response.projectUUID,
          isVisible: true,
        };
        setNewOSCALModel(model);
        setOpenCatalogBaseline(true);
      }
      function getMetadataFail(e: any) {
        console.log("In FilledBoxItem: Operation fail ", e.statusText);
      }
    }
    const zeroCatalogBaseline =
      catalogIds.length === 0 && baselineIds.length === 0 && newOSCALModel === undefined;
    return (
      <>
        {!uploadSuccessful && zeroCatalogBaseline && (
          <Grid
            sx={{
              top: 260,
              left: 40,
              right: 120,
              height: 450,
              position: "absolute",
            }}
          >
            <Grid
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ height: 200, width: "100%" }}
            >
              <MainImage sx={{ height: 156, width: 150 }} src={FileIcon} />
            </Grid>
            <Grid
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ height: 40, width: "100%" }}
            >
              <Typography
                variant="h2"
                sx={{
                  height: 30,
                  position: "absolute",
                }}
              >
                No catalogs or baselines defined!
              </Typography>
            </Grid>
            <Grid
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ height: 40, width: "100%" }}
            >
              <OSCALPrimaryButton sx={{ width: 91, height: 36 }} onClick={handleUpload}>
                <Typography>UPLOAD</Typography>
              </OSCALPrimaryButton>
              <OSCALTertiaryButton
                sx={{ width: 127, height: 36 }}
                onClick={handleAddNewCatalogBaseline}
              >
                <Typography
                  sx={{
                    fontFamily: "Source Sans Pro",
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 20,
                    letterSpacing: 0,
                    textAlign: "left",
                    color: (theme) => theme.palette.secondary.main,
                  }}
                  onClick={handleAddNewCatalogBaseline}
                >
                  CREATE NEW +
                </Typography>
              </OSCALTertiaryButton>
            </Grid>
          </Grid>
        )}
        {(upload || uploadNewCatalogBaseline) && (
          <Box
            sx={{
              top: 160,
              left: 40,
              right: 120,
              height: 750,
              position: "absolute",
            }}
          >
            <Box
              sx={{
                top: 0,
                left: 0,
                height: 550,
                width: "100%",
              }}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Box
                sx={{
                  top: 20,
                  left: 0,
                  height: 400,
                  width: "100%",
                  background: (theme) => theme.palette.white.main,
                  position: "absolute",
                  border: "1xp dotted",
                  borderColor: (theme) => theme.palette.shadyBlue.main,
                }}
              >
                {!startDropping && !endUploading && !uploadSuccessful && (
                  <Grid>
                    <Grid
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: 70, width: "100%" }}
                    ></Grid>
                    <Grid
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: 150, width: "100%" }}
                    >
                      <MainImage sx={{ top: 100, width: 72 }} src={UploadIcon} />
                    </Grid>
                    <Grid
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ width: "100%", height: 30 }}
                    >
                      <Typography variant="h2">Drag and Drop Your File Here</Typography>
                    </Grid>
                    <Grid
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ width: "100%", height: 30 }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Source Sans Pro",
                          fontSize: 12,
                          fontWeight: 700,
                          color: (theme) => theme.palette.primary.main,
                        }}
                      >
                        OR
                      </Typography>
                    </Grid>
                    <Grid
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ width: "100%" }}
                    >
                      <Button
                        component="label"
                        sx={{
                          width: 200,
                          height: 30,
                          textTransform: "none",
                        }}
                      >
                        <Typography variant="h2" sx={{ textDecoration: "underline" }}>
                          Choose a File
                        </Typography>
                        <input
                          type="file"
                          hidden
                          accept="application/json"
                          onChange={onUpload}
                        ></input>
                      </Button>
                    </Grid>
                  </Grid>
                )}
                {startDropping && (
                  <Grid>
                    <Grid sx={{ height: 120, width: "100%" }}></Grid>
                    <Grid sx={{ height: 75, width: "100%" }}>
                      <MainImage
                        sx={{ position: "absolute", height: 70, left: "46.5%" }}
                        src={BlueCircle}
                        alt="Easy Dynamics Logo"
                      />

                      <MainImage
                        sx={{ height: 70, position: "absolute", left: "50%" }}
                        src={SemiCircle}
                        alt="Easy Dynamics Logo"
                      />
                    </Grid>
                    <Grid
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: 75, width: "100%" }}
                    >
                      <Typography variant="h2">Uploading ...</Typography>
                    </Grid>
                  </Grid>
                )}
                {uploadSuccessful && (
                  <Grid container>
                    <Grid sx={{ height: 150, width: "100%" }}></Grid>
                    <Grid sx={{ height: 75, width: "100%" }}>
                      <MainImage
                        sx={{
                          position: "absolute",
                          width: 72,
                          left: "46.5%",
                        }}
                        src={GreenCircle}
                        alt="Easy Dynamics Logo"
                      />
                      <Box sx={{ height: 20 }}></Box>
                      <MainImage
                        sx={{
                          position: "absolute",
                          width: 45,
                          left: "48%",
                        }}
                        src={GreenCheck}
                        alt="Easy Dynamics Logo"
                      />
                    </Grid>
                    <Grid
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: 40, width: "100%" }}
                    >
                      <Typography variant="h2">Upload Complete</Typography>
                    </Grid>
                    <Grid
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ width: "100%" }}
                    >
                      <Typography sx={{ height: 40 }}>
                        {fileName} has been successfully uploaded.
                      </Typography>
                    </Grid>
                    <Grid
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: 50, width: "100%" }}
                    >
                      <OSCALTertiaryButton onClick={loadPage} sx={{ width: 90 }}>
                        GO BACK
                      </OSCALTertiaryButton>
                      <OSCALSecondaryButton onClick={handleGoBack} x={{ width: 140 }}>
                        UPLOAD MORE FILES
                      </OSCALSecondaryButton>
                      <Box sx={{ width: 20 }}></Box>
                      <OSCALPrimaryButton onClick={handleOpenFile} x={{ width: 90 }}>
                        {" "}
                        GO TO FILE
                      </OSCALPrimaryButton>
                    </Grid>
                  </Grid>
                )}
                {!uploadSuccessful && endUploading && (
                  <Grid container>
                    <Grid sx={{ height: 150, width: "100%" }}></Grid>
                    <Grid sx={{ height: 75, width: "100%" }}>
                      <MainImage
                        sx={{
                          position: "absolute",
                          width: 72,
                          left: "46.5%",
                        }}
                        src={RedCircle}
                        alt="Easy Dynamics Logo"
                      />
                      <Box sx={{ height: 15 }}></Box>
                      <MainImage
                        sx={{
                          position: "absolute",
                          width: 43,
                          left: "48.00%",
                        }}
                        src={RedCheck}
                        alt="Easy Dynamics Logo"
                      />
                    </Grid>
                    <Grid
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: 50, width: "100%" }}
                    >
                      <Typography variant="h2">Upload Error</Typography>
                    </Grid>
                    <Grid
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: 50, width: "100%" }}
                    >
                      <Typography>{fileName} was not uploaded.</Typography>
                    </Grid>
                    <Grid
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: 50, width: "100%" }}
                    >
                      <OSCALPrimaryButton onClick={loadPage} x={{ width: 90 }}>
                        {" "}
                        GO BACK
                      </OSCALPrimaryButton>
                      <OSCALSecondaryButton onClick={handleGoBack}>
                        UPLOAD MORE FILES
                      </OSCALSecondaryButton>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Box>
            {!endUploading && (
              <Typography
                variant="h2"
                sx={{
                  top: 422,
                  left: 5,
                  position: "absolute",
                  fontWeight: 400,
                  fontSize: 16,
                }}
              >
                Accepted File Types: OSCAL Catalog or Profile in .xml or .json format only
              </Typography>
            )}
            {!uploadSuccessful && endUploading && (
              <>
                <Typography
                  variant="h2"
                  sx={{
                    top: 422,
                    left: 5,
                    position: "absolute",
                    fontWeight: 400,
                    fontSize: 16,
                  }}
                >
                  Accepted File Types: OSCAL Catalog or Profile in .xml or .json format only
                </Typography>
                {showAlert && (
                  <OSCALError
                    sx={{ top: 465, left: 0, width: 990, height: 80, position: "absolute" }}
                  >
                    <IconButton
                      onClick={handleCloseAlert}
                      sx={{
                        position: "absolute",
                        right: 5,
                        top: 3,
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography
                      variant={"h2"}
                      sx={{
                        top: 10,
                        color: (theme) => theme.palette.darkBrown.main,
                        position: "absolute",
                      }}
                    >
                      ERROR!
                    </Typography>
                    <Typography
                      sx={{
                        top: 35,
                        textAlign: "left",
                        color: (theme) => theme.palette.darkBrown.main,
                        position: "absolute",
                      }}
                    >
                      Invalid file format: only .xml or .json formats are accepted.
                    </Typography>
                  </OSCALError>
                )}
              </>
            )}
          </Box>
        )}
      </>
    );
  }

  function DeleteCatalogBaselineHug() {
    function handleDeleteModel() {
      setOpenDeleteDialog(true);
    }
    return (
      <Container sx={{ position: "absolute", width: 448, height: 36, top: 120, right: 20 }}>
        <Grid spacing={1} container>
          <Button
            disableElevation
            variant="text"
            color="primary"
            sx={{ width: 170, height: 36, color: (theme) => theme.palette.destructive.main }}
            onClick={handleDeleteModel}
          >
            <ButtonTypography> DELETE {Model.toUpperCase()}</ButtonTypography>
          </Button>
          <OSCALSecondaryButton
            sx={{ width: 170, height: 36 }}
            onClick={handleAddNewCatalogBaseline}
          >
            <ButtonTypography> PUBLISH {Model.toUpperCase()}</ButtonTypography>
          </OSCALSecondaryButton>
        </Grid>
      </Container>
    );
  }
  function handleUpload() {
    setUploadNewCatalogBaseline(true);
  }
  function HugHug() {
    if (noUploadCreateHug) return null;
    return (
      <Container sx={{ position: "absolute", width: 348, height: 36, top: 120, right: 10 }}>
        <Grid spacing={1} container>
          <OSCALTertiaryButton sx={{ width: 57, height: 36 }} onClick={handleUpload}>
            {" "}
            <ButtonTypography> UPLOAD </ButtonTypography>{" "}
          </OSCALTertiaryButton>
          <OSCALSecondaryButton
            sx={{ width: 150, height: 36 }}
            onClick={handleAddNewCatalogBaseline}
          >
            <ButtonTypography> CREATE NEW + </ButtonTypography>
          </OSCALSecondaryButton>
        </Grid>
      </Container>
    );
  }

  const handleAddNewCatalogBaseline = () => {
    setAddNewCatalogBaseline(true);
  };

  const HeaderRow: React.FC<OSCALModel> = (item) => {
    if (!openCatalogBaseline) return null;
    return (
      <>
        <Grid container direction="row">
          <Grid>
            <Typography
              sx={{
                left: 40,
                top: 162,
                fontSize: 14,
                fontFamily: "Source Sans Pro",
                fontStyle: "normal",
                fontWeight: 400,
                position: "absolute",
              }}
            >
              Document Version:
            </Typography>
          </Grid>
          <Grid>
            <Typography
              sx={{
                left: 165,
                top: 160,
                fontSize: 16,
                fontFamily: "Source Sans Pro",
                fontStyle: "normal",
                fontWeight: 700,
                position: "absolute",
              }}
            >
              {" "}
              {item.model.documentVersion}{" "}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid>
            <Typography
              sx={{
                left: 225,
                top: 162,
                fontSize: 14,
                fontFamily: "Source Sans Pro",
                fontStyle: "normal",
                fontWeight: 400,
                position: "absolute",
              }}
            >
              Last Modified:
            </Typography>
          </Grid>
          <Grid>
            <Typography
              sx={{
                left: 325,
                top: 160,
                fontSize: 16,
                fontFamily: "Source Sans Pro",
                fontStyle: "normal",
                fontWeight: 700,
                position: "absolute",
              }}
            >
              {OSCALDateTimeConversion(item.model.lastModified ?? "")}{" "}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid>
            <Typography
              sx={{
                left: 510,
                top: 162,
                fontSize: 14,
                fontFamily: "Source Sans Pro",
                fontStyle: "normal",
                fontWeight: 400,
                position: "absolute",
              }}
            >
              Publication Date:
            </Typography>
          </Grid>
          <Grid>
            <Typography
              sx={{
                left: 625,
                top: 161,
                fontSize: 14,
                fontFamily: "Source Sans Pro",
                fontStyle: "normal",
                fontWeight: 700,
                position: "absolute",
              }}
            >
              {" "}
              {OSCALDateTimeConversion(item.model.publicationDate ?? "Not published")}
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  };

  const CatalogBaselineItem: React.FC<OSCALModelMetadataInfo> = (item) => {
    function topAdjusted(title: string): string {
      if (title.length < 25) return " 5.89%";
      else return "3.00%";
    }
    const type = item.isCatalog ? "Catalog" : "Baseline";
    function handleOpenCatalogBaseline() {
      const model: CatalogBaseline = {
        title: item.title,
        lastModified: item.lastModified,
        documentVersion: item.version,
        publicationDate: item.publicationDate,
        projectUUID: item.projectUUID,
        isVisible: true,
        isCatalog: item.isCatalog,
      };
      setNewOSCALModel(model);
      setOpenCatalogBaseline(true);
    }
    const published = item.publicationDate ?? "Not published";
    const usedTitle = item.title ?? "";
    const trunckatedTitle = usedTitle.length > 60 ? usedTitle.substring(0, 59) + "..." : usedTitle;
    return (
      <ItemBox component="span">
        <CatalogTooltip title={usedTitle}>
          <Typography
            variant="h2"
            sx={{
              top: topAdjusted(item.title ?? ""),
              borderRadius: "nullpx",
              position: "absolute",
              left: "3.06%",
              right: "69.17%",
              height: 25,
              width: 320,
            }}
          >
            {trunckatedTitle}
          </Typography>
        </CatalogTooltip>
        <ItemDivider sx={{ top: usedTitle.length < 25 ? "25.91%" : "30.91%" }} />
        <Grid container direction="row">
          <Grid>
            <ItemTitle sx={{ top: usedTitle.length < 25 ? "32.69%" : "35.69%", left: 9 }}>
              {" "}
              Last Modified:{" "}
            </ItemTitle>
            <ItemResult
              sx={{
                top: usedTitle.length < 25 ? "32.70%" : "35.69%",
                left: "33%",
              }}
            >
              {" "}
              {OSCALDateTimeConversion(item.lastModified ?? "")}
            </ItemResult>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid>
            <ItemTitle sx={{ top: usedTitle.length < 25 ? "47.58%" : "49.58%", left: 9 }}>
              Document Version:
            </ItemTitle>
          </Grid>
          <Grid>
            <ItemResult sx={{ left: "42%", top: usedTitle.length < 25 ? "47.58%" : "49.58%" }}>
              {" "}
              {item.version}{" "}
            </ItemResult>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid>
            <ItemTitle sx={{ top: usedTitle.length < 25 ? "62.25%" : "64.25%", left: 9 }}>
              {" "}
              Publication Date:
            </ItemTitle>
          </Grid>
          <Grid>
            <ItemResult
              sx={{
                left: "38%",
                top: usedTitle.length < 25 ? "62.25%" : "64.25%",
              }}
            >
              {OSCALDateTimeConversion(published)}{" "}
            </ItemResult>{" "}
          </Grid>
        </Grid>
        <Container
          sx={{
            height: 39,
            width: 352,
          }}
        >
          <OSCALPrimaryButton
            sx={{
              height: 39,
              width: 331,
              left: 0,
              borderRadius: 0,
              position: "absolute",
              right: "53.33%",
              top: "78.89%",
              bottom: "35.78%",
            }}
            onClick={handleOpenCatalogBaseline}
          >
            <ButtonTypography sx={{ fontWeight: 700 }}> OPEN {type} </ButtonTypography>
          </OSCALPrimaryButton>
        </Container>
      </ItemBox>
    );
  };

  function ButtonBar() {
    return (
      <Grid
        sx={{
          flexGrow: 1,
          top: 15,
          background: (theme) => theme.palette.white.main,
          height: 20,
        }}
        container
        spacing={0}
      >
        <ButtonGroup size="small" aria-label="small button group">
          <IconButton edge="start" aria-label="menu">
            <FormatBold sx={{ border: "1px solid" }} />
          </IconButton>
          <IconButton edge="start" aria-label="menu">
            <FormatItalic sx={{ border: "1px solid" }} />
          </IconButton>
          <IconButton edge="start" aria-label="menu">
            <CodeOffSharp sx={{ border: "1px solid" }} />
          </IconButton>
          <IconButton edge="start" aria-label="menu">
            <FormatQuote sx={{ border: "1px solid" }} />
          </IconButton>
          <IconButton edge="start" aria-label="menu">
            <Subscript sx={{ border: "1px solid" }} />
          </IconButton>
          <IconButton edge="start" aria-label="menu">
            <Superscript sx={{ border: "1px solid" }} />
          </IconButton>
        </ButtonGroup>
      </Grid>
    );
  }
  const ToolBarMenu: React.FC<{ hasDropdown: boolean | null }> = (item) => {
    if (item.hasDropdown != null && item.hasDropdown) {
      return (
        <Box
          justifyContent="center"
          sx={{
            height: 12,
          }}
        >
          <Grid container spacing={0}>
            <Grid xs={5} container>
              <Container></Container>
            </Grid>
            <Grid xs={3} container>
              <Container>
                <NativeSelect
                  defaultValue={1}
                  inputProps={{
                    name: "font",
                    id: "uncontrolled-native",
                  }}
                  sx={{ width: 100, border: "1px" }}
                >
                  <option value={1}>Normal</option>
                  <option value={2}>Heading 1</option>
                  <option value={3}>Heading 2</option>
                  <option value={4}>Heading 3</option>
                  <option value={5}>Heading 4</option>
                  <option value={6}>Heading 5</option>
                  <option value={7}>Heading 6</option>
                </NativeSelect>
              </Container>
            </Grid>
            <Grid xs={4} container>
              <Box>
                <ButtonBar></ButtonBar>
              </Box>
            </Grid>
          </Grid>
        </Box>
      );
    } else {
      return (
        <Box
          justifyContent="center"
          sx={{
            height: 12,
          }}
        >
          <Grid container spacing={1}>
            <Grid xs={8}>
              <Container></Container>
            </Grid>
            <Grid xs={4}>
              <Box>
                <ButtonBar></ButtonBar>
              </Box>
            </Grid>
          </Grid>
        </Box>
      );
    }
  };

  const AddOrgAuthorDetailsDialog: React.FC<OSCALModel> = (data) => {
    Model = data.model.isCatalog ? "Catalog" : "Baseline";
    const [newOSCALFilePath, setNewOSCALFilePath] = useState("");
    if (data.startCollectingOrgDetails) contact = data.model.orgContactInfo ?? {};
    if (data.startCollectingAuthorDetails) contact = data.model.authorContactInfo ?? {};
    address = contact.address ?? {};
    const title = "Add a New " + Model;
    function handleEditOrgNameChange(event: { target: { value: string | undefined } }) {
      contact.name = event.target.value;
    }
    function handleEditAddressLine1Change(event: { target: { value: string | undefined } }) {
      address.line1 = event.target.value;
    }
    function handleEditAddressLine2Change(event: { target: { value: string | undefined } }) {
      address.line2 = event.target.value;
    }
    function handleEditOrgPhoneChange(event: { target: { value: string | undefined } }) {
      contact.phone = event.target.value;
    }
    function handleEditOrgEmailChange(event: { target: { value: string | undefined } }) {
      contact.email = event.target.value;
    }
    function handleEditCityChange(event: { target: { value: string | undefined } }) {
      address.city = event.target.value;
    }

    function handleEditStateChange(event: { target: { value: string | undefined } }) {
      address.state = event.target.value;
    }
    function handleEditZipChange(event: { target: { value: string | undefined } }) {
      address.zip = event.target.value;
    }

    const handleCloseOrgDetails = () => {
      contact.address = address;
      setAddOrgDetails(false);
      setAddNewCatalogBaseline(true);
      setOrgAddress(address);
      setOrgContact(contact);
      data.model.orgContactInfo = orgContact;
      setMainData(data.model);
      console.log("In Handle CloseOrg ", data);
    };
    const handleAddAuthorDetails = () => {
      setAddOrgDetails(false);
      setAddNewCatalogBaseline(false);
      setAddAuthorDetails(true);
      data.model.orgContactInfo = orgContact;
      setMainData(data.model);
      contact = authorContact;
      newModelCreationDone = false;
    };

    const handleCloseAuthorDetails = () => {
      contact.address = address;
      setAddOrgDetails(true);
      setAddNewCatalogBaseline(false);
      setAddAuthorDetails(false);
      setAuthorAddress(address);
      setAuthorContact(contact);
      data.model.authorContactInfo = authorContact;
      setMainData(data.model);
    };
    const handleCreateNewCatalogBaseline = () => {
      setCreatedNewCatalogBaseline(true);
      submitNewFile();
      wrapper();
      setAddOrgDetails(false);
      setAddNewCatalogBaseline(false);
      setAddAuthorDetails(false);
      setOpenCatalogBaseline(true);
      setNewOSCALModel(data.model);
      setOpenCatalogBaseline(true);
    };

    useEffect(() => {
      submitNewFile();
      wrapper();
    });
    function wrapper() {
      if (newOSCALFilePath.length > 0) {
        updateMetadata();
      }
    }
    function newFile() {
      const catalog_data = {
        uuid: window.self.crypto.randomUUID(),
        metadata: {},
        groups: [],
      };
      const catalog = {
        catalog: catalog_data,
      };
      const profile_data = {
        uuid: window.self.crypto.randomUUID(),
        metadata: {},
        import: [],
        "back-matter": {},
      };
      const profile = {
        profile: profile_data,
      };
      const catalog_file = new Blob([JSON.stringify(catalog)], { type: "application/json" });
      const profile_file = new Blob([JSON.stringify(profile)], { type: "application/json" });
      const file = data.model.isCatalog ? catalog_file : profile_file;
      return file;
    }
    function submitNewFile() {
      if (createdNewCatalogBaseline || data.model.title === undefined) return;
      const filename = newFile();
      if (filename === null) {
        return;
      }
      console.log("Main File", filename);
      fetchUploadFile(filename, uploadFileSuccess, uploadFileFail);
    }
    function uploadFileFail(error: any) {
      console.log("Failed to create new file error message:", error);
    }
    function uploadFileSuccess(response: any) {
      const filename = response["filename"];
      console.log(
        "File " + filename + " uploaded successfully. Response was " + JSON.stringify(response)
      );

      const request_json = {
        file: filename,
      };
      if (!newModelCreationDone) {
        fetchTransaction(
          "/create_oscal_project",
          request_json,
          createOscalProjectSuccess,
          createOscalProjectFail
        );
        newModelCreationDone = true;
      }
      function createOscalProjectSuccess(response: any) {
        console.log("successful creation of a new catalog/baseline", response["new_oscal_file"]);
        setNewOSCALFilePath(response["new_oscal_file"]);
      }
      function createOscalProjectFail(e: any) {
        console.log("Fail to create a new Catalog/Baseline", e.statusText);
      }
    }

    function updateMetadata() {
      const date = new Date();
      const nowDate = date.toLocaleDateString();
      const nowTime = date.toLocaleTimeString();
      console.log("Start updating the metadata of this project ", newOSCALFilePath);
      data.model.lastModified = nowDate + ", " + nowTime;
      data.model.projectUUID = getProjectUUID(newOSCALFilePath);
      const inputs = {
        oscal_file: newOSCALFilePath,
        title: data.model.title ?? "",
        last_modified: data.model.lastModified,
        version: data.model.documentVersion,
        oscal_version: "1.0.6",
        description: data.model.description ?? " ",
      };
      const operation = "/add_metadata_entries";
      console.log(JSON.stringify(inputs));
      fetchTransaction(operation, inputs, updateMetadataSuccess, updateMetadataFail);

      function updateMetadataSuccess(response: any) {
        console.log("Successful update of metadata of project ", newOSCALFilePath + " ", response);
      }
      function updateMetadataFail(e: any) {
        console.log("Fail updating metadata of ", newOSCALFilePath, e.statusText);
      }
      setCreatedNewCatalogBaseline(true);
    }
    let previousStep = "Previous";
    let nextStep = "Next";
    let handleClose: () => void = () => {};
    let handleNextStep: () => void = () => {};
    let contactInfo: ContactInfo | undefined = {};
    let agent = "";
    let step = 1;
    if (AddOrgDetails && data.startCollectingOrgDetails) {
      contactInfo = data.model.orgContactInfo;
      agent = "Organization";
      handleClose = handleCloseOrgDetails;
      handleNextStep = handleAddAuthorDetails;
      previousStep = "Previous";
      nextStep = "Next";
      step = 1;
    }
    if (AddAuthorDetails && data.startCollectingAuthorDetails) {
      contactInfo = data.model.authorContactInfo;
      agent = "Author";
      previousStep = "Previous";
      const type = data.model.isCatalog ? "Catalog" : "Baseline";
      nextStep = "Create " + type;
      handleClose = handleCloseAuthorDetails;
      handleNextStep = handleCreateNewCatalogBaseline;

      step = 2;
    }

    return (
      <Dialog
        open={data.model.isVisible}
        onClose={handleClose}
        fullWidth={true}
        sx={{ top: -30, left: 530, width: 560, height: 950 }}
      >
        <OSCALDialogTitle title={title} onClose={handleClose} />
        <DialogContent sx={{ overflow: "hidden" }}>
          <Grid container rowSpacing={2} justifyContent="center">
            <Grid item xs={12} sx={{ height: 100 }}>
              <StepperBar
                alternativeLabel
                activeStep={step}
                connector={
                  <StepConnector
                    sx={{
                      left: -165,
                      width: 170,
                      border: "1px solid",
                      borderColor: (theme) => theme.palette.secondary.main,
                    }}
                  />
                }
              >
                <Step key="catalog" sx={{ width: 40, height: 40 }}>
                  <StepItemLabel>{Model} Details</StepItemLabel>
                </Step>
                <Step key="org" sx={{ width: 40, height: 40, left: 40 }}>
                  <StepItemLabel>Org Details</StepItemLabel>
                </Step>
                <Step key="author" sx={{ width: 40, height: 40, left: 80 }}>
                  <StepItemLabel>Author Details</StepItemLabel>
                </Step>
              </StepperBar>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h2">
                Add information about the organization that owns this {Model.toLowerCase()}:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <OSCALTextField
                label={agent + " Name"}
                required={true}
                fullWidth
                id={agent + "Name"}
                onChange={handleEditOrgNameChange}
                defaultValue={contactInfo?.name}
                margin="none"
              />
              <OSCALTextField
                fullWidth
                label={agent + " Phone"}
                required={false}
                id={agent + "Phone"}
                onChange={handleEditOrgPhoneChange}
                defaultValue={contactInfo?.phone}
                margin="none"
              />
            </Grid>
            <Grid item xs={12}>
              <OSCALTextField
                fullWidth
                label={agent + " Email"}
                required={false}
                id={agent + "Email"}
                onChange={handleEditOrgEmailChange}
                defaultValue={contactInfo?.email}
              />
            </Grid>
            <Grid item xs={12}>
              <OSCALFormLabel label={agent + " Address"} required={false} />
              <SecondLabel>Address Line 1</SecondLabel>
              <TextField
                size="small"
                label=""
                fullWidth
                id={"address line 1"}
                onChange={handleEditAddressLine1Change}
                defaultValue={contactInfo?.address?.line1}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme) => theme.palette.secondary.main,
                    },
                  },
                }}
              ></TextField>
              <SecondLabel>Address Line 2</SecondLabel>
              <TextField
                fullWidth
                size="small"
                id={"address line 2"}
                onChange={handleEditAddressLine2Change}
                defaultValue={contactInfo?.address?.line2}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme) => theme.palette.secondary.main,
                    },
                  },
                }}
              />
              <SecondLabel>City</SecondLabel>
              <TextField
                defaultValue={contactInfo?.address?.city}
                fullWidth
                size="small"
                id={"city"}
                onChange={handleEditCityChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme) => theme.palette.secondary.main,
                    },
                  },
                }}
              />
              <SecondLabel>State</SecondLabel>
              <NativeSelect
                defaultValue={contactInfo?.address?.state}
                fullWidth
                id={"state"}
                size="small"
                onChange={handleEditStateChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme) => theme.palette.secondary.main,
                    },
                  },
                }}
              >
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </NativeSelect>
              <SecondLabel>ZIP</SecondLabel>
              <TextField
                defaultValue={contactInfo?.address?.zip}
                id={"zip"}
                size="small"
                onChange={handleEditZipChange}
                sx={{
                  width: 100,
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme) => theme.palette.secondary.main,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <OSCALSecondaryButton onClick={handleClose}> {previousStep} </OSCALSecondaryButton>
          <OSCALPrimaryButton onClick={handleNextStep}> {nextStep} </OSCALPrimaryButton>
        </DialogActions>
      </Dialog>
    );
  };

  function getProjectUUID(path: string): string {
    if (path.length > 0 && path.includes("/")) {
      const parts = path.split("/");
      const term = parts[1];
      if (term.length > 0 && term.includes("_")) {
        const subparts = term.split("_");
        return subparts[1];
      }
      return "";
    }
    return "";
  }

  const AddCatalogDetailsDialog: React.FC<OSCALModel> = (data) => {
    if (data.model.isCatalog !== undefined) Model = data.model.isCatalog ? "Catalog" : "Baseline";
    const [selectedCatalogBaseline, setSelectedCatalogBaseline] = useState<string>(Model);
    function handleCatalogBaselineRadioChange(event: React.ChangeEvent<HTMLInputElement>) {
      setSelectedCatalogBaseline(event.target.value);
    }

    data.model.isCatalog = selectedCatalogBaseline === "Catalog" ? true : false;
    Model = selectedCatalogBaseline;
    const handleCloseAddNewCatalogBaseline = () => {
      setAddNewCatalogBaseline(false);
      data.model.orgContactInfo = orgContact;
      setMainData(data.model);
    };
    const handleAddOrgDetails = () => {
      setAddOrgDetails(true);
      setAddNewCatalogBaseline(false);
      setAddAuthorDetails(false);
      data.model.orgContactInfo = orgContact;
      setMainData(data.model);
    };
    const title = "Add a New " + Model;
    function handleEditTitleChange(event: { target: { value: string | undefined } }) {
      data.model.title = event.target.value;
    }
    function handleEditDocumentVersionChange(event: React.ChangeEvent<HTMLInputElement>) {
      data.model.documentVersion = event.target.value;
    }
    function handleEditDescriptionChange(event: React.ChangeEvent<HTMLInputElement>) {
      data.model.description = event.target.value;
    }
    if (AddNewCatalogBaseline)
      return (
        <OSCALEditingDialog
          open={data.model.isVisible}
          onClose={handleCloseAddNewCatalogBaseline}
          fullWidth={true}
          sx={{ top: 80, left: 490, width: 600, position: "absolute" }}
        >
          <OSCALDialogTitle title={title} onClose={handleCloseAddNewCatalogBaseline} />
          <DialogContent sx={{ height: 600, overflow: "hidden" }}>
            <Grid container rowSpacing={2} justifyContent="center" sx={{ width: "100%" }}>
              <Grid item xs={12} sx={{ height: 100 }}>
                <StepperBar
                  alternativeLabel
                  sx={{ width: "100%" }}
                  connector={
                    <StepConnector
                      sx={{
                        left: -165,
                        width: 170,
                        border: "1px solid",
                        borderColor: (theme) => theme.palette.secondary.main,
                      }}
                    />
                  }
                >
                  <Step key="catalog" sx={{ width: 40, height: 40 }}>
                    <StepItemLabel>{Model} Details</StepItemLabel>
                  </Step>
                  <Step key="org" sx={{ width: 40, height: 40, left: 50 }}>
                    <StepItemLabel>Org Details</StepItemLabel>
                  </Step>
                  <Step key="author" sx={{ width: 40, height: 40, left: 100 }}>
                    <StepItemLabel>Author Details</StepItemLabel>
                  </Step>
                </StepperBar>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h2">
                  Add information about the {Model.toLowerCase()}:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <OSCALFormLabel
                  label={"Would you like to create a catalog or baseline?"}
                  required={true}
                />
                <RadioGroup
                  name="subject-radio-buttons-group"
                  value={selectedCatalogBaseline}
                  onChange={(event) => handleCatalogBaselineRadioChange(event)}
                >
                  <FormControlLabel
                    key={"subject-radio_0"}
                    value={"Catalog"}
                    control={<OSCALRadio />}
                    label={"Catalog"}
                  />
                  <FormControlLabel
                    key={"subject-radio_1"}
                    value={"Baseline"}
                    control={<OSCALRadio />}
                    label={"Baseline"}
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <OSCALTextField
                  label={Model + " Title"}
                  required={true}
                  id={"title"}
                  onChange={handleEditTitleChange}
                  defaultValue={data.model.title}
                  fullWidth
                />
                <ToolBarMenu hasDropdown={false}></ToolBarMenu>
              </Grid>
              <Grid item xs={12}>
                <OSCALTextField
                  label={"Document Version"}
                  required={true}
                  id={"document-version"}
                  onChange={handleEditDocumentVersionChange}
                  defaultValue={data.model.documentVersion}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sx={{ height: 90 }}>
                <OSCALTextField
                  label={Model + " Description "}
                  required={false}
                  multiline={true}
                  id={"Catalog-new-description"}
                  onChange={handleEditDescriptionChange}
                  defaultValue={data.model.description}
                  fullWidth
                  rows={3}
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                    },
                  }}
                />
                <ToolBarMenu hasDropdown={true}></ToolBarMenu>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <OSCALSecondaryButton onClick={handleCloseAddNewCatalogBaseline}>
              Cancel
            </OSCALSecondaryButton>
            <OSCALPrimaryButton onClick={handleAddOrgDetails}>Next</OSCALPrimaryButton>
          </DialogActions>
        </OSCALEditingDialog>
      );
    else return null;
  };
  function deleteModel(projectPath: string) {
    const request_json = {
      oscal_file: projectPath,
    };
    function deleteModelSuccess(response: any) {
      console.log("Successful deletion of the model", projectPath, response);
      ////reload the main Page
      loadPage();
    }
    function deleteModelFailed(e: any) {
      console.log(
        "Failed to delete the model",
        projectPath,
        e.statusText,
        " with request ",
        request_json
      );
    }
    fetchTransaction("/delete_oscal_project", request_json, deleteModelSuccess, deleteModelFailed);
  }
  const DeleteDialog: React.FC<OSCALModel> = (data) => {
    const [deleteText, setDeleteText] = useState("");
    function handleClose() {
      setOpenDeleteDialog(false);
    }
    function handleDeleteText(event: { target: { value: string | undefined } }) {
      setDeleteText(event.target.value ?? "");
    }
    function handleDelete() {
      if (deleteText.toLowerCase() === "delete") {
        const modelType = data.model.isCatalog ? "catalog" : "profile";
        const path = "projects/" + modelType + "_" + data.model.projectUUID + "/oscal_data.json";
        console.log(" delete file", path);
        deleteModel(path);
        //reload Data
      }
      setOpenDeleteDialog(false);
    }
    return (
      <OSCALWarningDialog open={openDeleteDialog} onClose={handleClose}>
        <OSCALDialogTitle warning={true} title={"Delete " + Model + "?"} onClose={handleClose} />
        <DialogContent>
          <Stack>
            <Typography>
              If deleted, all associated groups and controls will be <b>permanently</b> deleted. You
              cannot undo this action..
            </Typography>
            <Box padding={1} />
            <Typography>Please enter {"'delete'"} to confirm.</Typography>
            <Box padding={1} />
            <OSCALTextField
              id="delete-text"
              aria-label="Please type 'delete'"
              noLabel
              placeholder={"delete"}
              onChange={handleDeleteText}
            />
          </Stack>
        </DialogContent>
        <OSCALDialogActions>
          <OSCALTertiaryButton onClick={handleClose}>Cancel</OSCALTertiaryButton>
          <OSCALPrimaryDestructiveButton
            onClick={handleDelete}
            disabled={deleteText.toLowerCase() !== "delete"}
          >
            Delete {Model}
          </OSCALPrimaryDestructiveButton>
        </OSCALDialogActions>
      </OSCALWarningDialog>
    );
  };
  function renderHugHug() {
    if (!openCatalogBaseline) return <HugHug></HugHug>;
    else return <DeleteCatalogBaselineHug></DeleteCatalogBaselineHug>;
  }
  function renderAuthorDetailDialog() {
    if (!AddAuthorDetails) return null;

    return (
      <AddOrgAuthorDetailsDialog
        startCollectingAuthorDetails={true}
        startCollectingOrgDetails={false}
        model={mainData}
      />
    );
  }
  function renderOrgDetailsDialog() {
    if (!AddOrgDetails) return null;

    return (
      <AddOrgAuthorDetailsDialog
        startCollectingAuthorDetails={false}
        startCollectingOrgDetails={true}
        model={mainData}
      />
    );
  }
  function renderAddNewCatalogBaselineDialog() {
    if (!AddNewCatalogBaseline) return null;

    return (
      <AddCatalogDetailsDialog
        startCollectingAuthorDetails={false}
        startCollectingOrgDetails={false}
        model={mainData}
      />
    );
  }
  function renderFilledItemBox() {
    const zeroCatalogBaseline = catalogIds.length === 0 && baselineIds.length === 0;
    if (openCatalogBaseline || uploadNewCatalogBaseline || zeroCatalogBaseline) {
      if (uploadNewCatalogBaseline || zeroCatalogBaseline) return <RenderUpload></RenderUpload>;
      return null;
    }
    return (
      <RenderCatalogItems CatalogUUIDS={catalogIds} ProfileUUIDS={baselineIds}></RenderCatalogItems>
    );
  }
  const FilledBoxItem: React.FC<Project> = (project) => {
    const [metadataObject, setMetadataObject] = useState<any>({});
    useEffect(() => {
      getData();
    }, []);

    const isCatalog = project.model === "catalog" ? true : false;
    function getData() {
      const newOSCALFilePath =
        "projects/" + project.model + "_" + project.ProjectUUID + "/oscal_data.json";
      const request_json = {
        oscal_file: newOSCALFilePath,
      };

      fetchTransaction(
        "get_metadata",
        request_json,
        getCatalogMetadataSuccess,
        getCatalogMetadataFail
      );

      function getCatalogMetadataSuccess(response: any) {
        console.log("In FilledBoxItem: Successfull Call get_metadata with path");
        setMetadataObject(response);
      }
      function getCatalogMetadataFail(e: any) {
        console.log(
          "In FilledBoxItem: Operation  get_metadata failed with error ",
          e.statusText,
          " and path",
          request_json
        );
      }
    }

    return (
      <CatalogBaselineItem
        key={metadataObject.title}
        title={metadataObject.title}
        version={metadataObject["version"]}
        lastModified={metadataObject["last-modified"]}
        publicationDate={metadataObject["publication-date"]}
        projectUUID={project.ProjectUUID}
        isCatalog={isCatalog}
      ></CatalogBaselineItem>
    );
  };
  const RenderCatalogItems: React.FC<ProjectUUIDs> = (entries) => {
    console.log("In RenderCatalogItems:");
    console.log("entries", entries);
    return (
      <StackBox>
        <Stack spacing={{ xs: 10, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
          {entries.CatalogUUIDS.map((catalog) => (
            <FilledBoxItem key={catalog} ProjectUUID={catalog} model={"catalog"}></FilledBoxItem>
          ))}

          {entries.ProfileUUIDS.map((profile) => (
            <FilledBoxItem key={profile} ProjectUUID={profile} model={"profile"}></FilledBoxItem>
          ))}
        </Stack>
      </StackBox>
    );
  };
  const usedText = LabelText ?? "";
  const trunckatedTitle = usedText.length > 45 ? usedText.substring(0, 44) + "..." : usedText;
  return (
    <Container
      sx={{
        position: "absolute",
        height: "85%",
        right: 100,
        left: 323,
        top: 0,
        background: (theme) => theme.palette.backgroundGray.main,
      }}
    >
      {renderTabs({ model: createdModel })}
      <HeaderRow model={createdModel}></HeaderRow>
      <CatalogBreadCrumbsMenu model={createdModel}></CatalogBreadCrumbsMenu>
      <CatalogTooltip title={LabelText}>
        <Typography
          variant={"h1"}
          sx={{ position: "absolute", width: 700, height: 40, top: 116, left: 40 }}
        >
          {trunckatedTitle}
        </Typography>
      </CatalogTooltip>
      {renderHugHug()}
      {renderFilledItemBox()}
      {renderAddNewCatalogBaselineDialog()}
      {renderOrgDetailsDialog()}
      {renderAuthorDetailDialog()}
      <DeleteDialog model={createdModel}></DeleteDialog>
    </Container>
  );
}

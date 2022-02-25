import React, { useState, useEffect, useRef } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Split from "react-split";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import ErrorBoundary from "./ErrorBoundary";
import OSCALSsp from "./OSCALSsp";
import OSCALCatalog from "./OSCALCatalog";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import OSCALProfile from "./OSCALProfile";
import OSCALLoaderForm from "./OSCALLoaderForm";
import OSCALJsonEditor from "./OSCALJsonEditor";

const oscalObjectTypes = {
  catalog: {
    name: "Catalog",
    defaultUrl:
      "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json",
    defaultUuid: "613fca2d-704a-42e7-8e2b-b206fb92b456",
    jsonRootName: "catalog",
    restPath: "catalogs",
  },
  component: {
    name: "Component",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-content/manual-fix-of-component-paths/examples/component-definition/json/example-component.json",
    defaultUuid: "8223d65f-57a9-4689-8f06-2a975ae2ad72",
    jsonRootName: "component-definition",
    restPath: "component-definitions",
  },
  profile: {
    name: "Profile",
    defaultUrl:
      "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json",
    defaultUuid: "8b3beca1-fcdc-43e0-aebb-ffc0a080c486",
    jsonRootName: "profile",
    restPath: "profiles",
  },
  ssp: {
    name: "SSP",
    defaultUrl:
      "https://raw.githubusercontent.com/usnistgov/oscal-content/master/examples/ssp/json/ssp-example.json",
    defaultUuid: "cff8385f-108e-40a5-8f7a-82f3dc0eaba8",
    jsonRootName: "system-security-plan",
    restPath: "system-security-plans",
  },
};

const useStyles = makeStyles(() => ({
  split: {
    display: "flex",
    flexDirection: " row",
    "& > .gutter": {
      backgroundColor: "#eee",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "50%",
      "&.gutter-horizontal": {
        backgroundImage:
          "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==')",
        cursor: "col-resize",
      },
    },
  },
}));

function populatePartialPatchData(data, editedFieldJsonPath, newValue) {
  if (editedFieldJsonPath.length === 1) {
    const editData = data;
    editData[editedFieldJsonPath] = newValue;
    return;
  }

  populatePartialPatchData(
    data[editedFieldJsonPath.shift()],
    editedFieldJsonPath,
    newValue
  );
}

export default function OSCALLoader(props) {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResolutionComplete, setIsResolutionComplete] = useState(false);
  const [isRestMode, setIsRestMode] = useState(
    process.env.REACT_APP_REST_BASE_URL
  );
  const [oscalData, setOscalData] = useState([]);
  const [oscalUrl, setOscalUrl] = useState(isRestMode ? null : props.oscalUrl);
  const unmounted = useRef(false);

  const loadOscalData = (newOscalUrl) => {
    if (newOscalUrl) {
      fetch(newOscalUrl)
        .then((response) => {
          if (!response.ok) throw new Error(response.status);
          else return response.json();
        })
        .then((result) => {
          if (!unmounted.current) {
            setOscalData(result);
            setIsLoaded(true);
          }
        });
    } else {
      setIsLoaded(true);
    }
  };

  const handleRestRequest = (httpMethod, url, data) => {
    setIsLoaded(false);
    setIsResolutionComplete(false);
    const requestInfo = {
      method: httpMethod,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch(url, requestInfo)
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((result) => {
        if (!unmounted.current) {
          setOscalData(result);
          setIsLoaded(true);
        }
      });
  };

  /**
   *
   * @param partialPatchData data that will be passed into the body of the PATCH request, doesn't initially contain the updates
   * @param editedFieldJsonPath path to the field that is being updated
   * @param newValue updated value for the edited field
   * @param jsonRootName name of the JSON root object
   * @param restPath the path for the REST request
   */
  const handleRestPatch = (
    partialPatchData,
    editedFieldJsonPath,
    newValue,
    jsonRootName,
    restPath
  ) => {
    const url = `${process.env.REACT_APP_REST_BASE_URL}/${restPath}/${partialPatchData[jsonRootName].uuid}`;
    populatePartialPatchData(partialPatchData, editedFieldJsonPath, newValue);
    handleRestRequest("PATCH", url, partialPatchData);
  };

  const handleRestPut = (jsonString) => {
    handleRestRequest("PUT", oscalUrl, JSON.parse(jsonString));
  };

  const handleUrlChange = (event) => {
    setOscalUrl(event.target.value);
  };

  const handleUuidChange = (event) => {
    const newOscalUrl = `${process.env.REACT_APP_REST_BASE_URL}/${props.oscalObjectType.restPath}/${event.target.value}`;
    setOscalUrl(newOscalUrl);
    setIsLoaded(false);
    setIsResolutionComplete(false);
    loadOscalData(newOscalUrl);
  };

  const handleReloadClick = () => {
    // Only reload if we're done loading
    if (isLoaded && isResolutionComplete) {
      setIsLoaded(false);
      setIsResolutionComplete(false);
      loadOscalData(oscalUrl);
    }
  };

  const handleChangeRestMode = (event) => {
    setIsRestMode(event.target.checked);
    if (event.target.checked) {
      setOscalUrl(null);
      setIsLoaded(true);
      setIsResolutionComplete(true);
    } else {
      setIsLoaded(false);
      setIsResolutionComplete(false);
      setOscalUrl(props.oscalObjectType.defaultUrl);
      loadOscalData(props.oscalObjectType.defaultUrl);
    }
  };

  const onResolutionComplete = () => {
    setIsResolutionComplete(true);
  };

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    loadOscalData(oscalUrl);

    return () => {
      unmounted.current = true;
    };
  }, []);

  let form;
  if (props.renderForm) {
    form = (
      <OSCALLoaderForm
        oscalObjectType={props.oscalObjectType}
        oscalUrl={oscalUrl}
        onUrlChange={handleUrlChange}
        onUuidChange={handleUuidChange}
        onReloadClick={handleReloadClick}
        isRestMode={isRestMode}
        onChangeRestMode={handleChangeRestMode}
        isResolutionComplete={isResolutionComplete}
      />
    );
  }

  let result;
  if (!isLoaded) {
    result = <CircularProgress />;
  } else if (oscalUrl) {
    result = isRestMode ? (
      <Split className={classes.split} minSize={500} sizes={[50, 50]}>
        <Box>
          <OSCALJsonEditor value={oscalData} onSave={handleRestPut} />
        </Box>
        <Box>
          {props.renderer(
            isRestMode,
            oscalData,
            oscalUrl,
            onResolutionComplete,
            handleRestPatch
          )}
        </Box>
      </Split>
    ) : (
      <>
        {props.renderer(
          isRestMode,
          oscalData,
          oscalUrl,
          onResolutionComplete,
          handleRestPatch
        )}
      </>
    );
  }

  return (
    <>
      {form}
      <ErrorBoundary>{result}</ErrorBoundary>
    </>
  );
}

/**
 * Returns url parameter provided by the browser url, if it exists. If the url
 * parameter exists, we want to override the default viewer url.
 *
 * @returns The url parameter of the browser url, or null if it doesn't exist
 */
export function getRequestedUrl() {
  return new URLSearchParams(window.location.search).get("url");
}

export function OSCALCatalogLoader(props) {
  const oscalObjectType = oscalObjectTypes.catalog;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleRestPatch
  ) => (
    <OSCALCatalog
      catalog={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(data, editedField, newValue) => {
        handleRestPatch(
          data,
          editedField,
          newValue,
          oscalObjectType.jsonRootName,
          oscalObjectType.restPath
        );
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={getRequestedUrl() || oscalObjectType.defaultUrl}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}

export function OSCALSSPLoader(props) {
  const oscalObjectType = oscalObjectTypes.ssp;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleRestPatch
  ) => (
    <OSCALSsp
      system-security-plan={oscalData[oscalObjectType.jsonRootName]}
      isEditable={isRestMode}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(data, editedField, newValue) => {
        handleRestPatch(
          data,
          editedField,
          newValue,
          oscalObjectType.jsonRootName,
          oscalObjectType.restPath
        );
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={getRequestedUrl() || oscalObjectType.defaultUrl}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}

export function OSCALComponentLoader(props) {
  const oscalObjectType = oscalObjectTypes.component;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleRestPatch
  ) => (
    <OSCALComponentDefinition
      componentDefinition={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(data, editedField, newValue) => {
        handleRestPatch(
          data,
          editedField,
          newValue,
          oscalObjectType.jsonRootName,
          oscalObjectType.restPath
        );
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={getRequestedUrl() || oscalObjectType.defaultUrl}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}
export function OSCALProfileLoader(props) {
  const oscalObjectType = oscalObjectTypes.profile;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleRestPatch
  ) => (
    <OSCALProfile
      profile={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(data, editedField, newValue) => {
        handleRestPatch(
          data,
          editedField,
          newValue,
          oscalObjectType.jsonRootName,
          oscalObjectType.restPath
        );
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={getRequestedUrl() || oscalObjectType.defaultUrl}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}

import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {
  Grid,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  Chip,
  Select,
  MenuItem,
  Menu,
  Checkbox,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import TerminalIcon from "@mui/icons-material/Terminal";
import AbcIcon from "@mui/icons-material/Abc";
import ListIcon from "@mui/icons-material/List";
import DataObjectIcon from "@mui/icons-material/DataObject";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import {
  ConnectionTextField,
  SearchTextField,
  StyledIconButton,
} from "./styles";

import { SelectedValueKey } from "./SelectedValueKey";


type KeyType = "string" | "list" | "hash" | "set" | "zset";

interface KeyData {
  [keyType: string]: string[];
}

const iconMap: Record<KeyType, JSX.Element> = {
  string: <AbcIcon sx={{ mr: 1, fontSize: 18 }} />,
  list: <ListIcon sx={{ mr: 1, fontSize: 18 }} />,
  hash: <DataObjectIcon sx={{ mr: 1, fontSize: 18 }} />,
  set: <SettingsEthernetIcon sx={{ mr: 1, fontSize: 18 }} />,
  zset: <TextSnippetIcon sx={{ mr: 1, fontSize: 18 }} />,
};

const Dashboard = () => {
  const [keys, setKeys] = useState<KeyData>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [currentConnection, setCurrentConnection] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [databases, setDatabases] = useState<any>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();
  const allTypes = new Set<KeyType>(["string", "list", "hash", "set", "zset"]);
  const [selectedTypes, setSelectedTypes] = useState(allTypes);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [selectedKey, setSelectedKey] = useState<string>("");
  const [selectedKeyType, setSelectedKeyType] = useState<KeyType>("string");


  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  

  const fetchKeys = async (database:string) => {
    try {
      const dbNumber = Number(database);
      const fetchedKeys: any = await invoke("get_keys_from_database", { db: dbNumber });
      setKeys(fetchedKeys);
    } catch (error) {
      console.error("Error fetching keys:", error);
    }
  };

  useEffect(() => {
    fetchKeys(selectedDatabase || "0");
  }, [selectedDatabase]);

  const getConnectionString = async () => {
    try {
      const connection: any = await invoke("get_current_client_url_and_port");
      setCurrentConnection(connection);
    } catch (error) {
      console.error("Error fetching connection string:", error);
    }
  };

  const testRedisConnection = async () => {
    try {
      const status: any = await invoke("check_connection");
      if (status === "PONG") {
        setConnectionStatus(true);
      } else {
        setConnectionStatus(false);
      }
    } catch (error) {
      console.error("Error fetching connection string:", error);
    }
  };

  const get_all_databases = async () => {
    try {
      const databases: any = await invoke("list_databases");
      setDatabases(databases);
      if(databases.length > 0) {
        setSelectedDatabase(databases[0][0]);
      }
    } catch (error) {
      console.error("Error fetching connection string:", error);
    }
  };

  useEffect(() => {
    getConnectionString();
    testRedisConnection();
    get_all_databases();
  }, []);

  const refresh_data = async () => {
    // refresh data with get_keys_from_database
    fetchKeys(selectedDatabase || "0");
  }

const handleToggle = (keyType: KeyType) => {
  setExpanded((prevExpanded) => {
    const newExpanded = new Set(prevExpanded);
    if (newExpanded.has(keyType)) {
      newExpanded.delete(keyType);
    } else {
      newExpanded.add(keyType);
    }
    return newExpanded;
  });
};

  function isKeyType(key: string): key is KeyType {
    return ["string", "list", "hash", "set", "zset"].includes(key);
  }

  const filteredKeys = Object.entries(keys).reduce(
    (acc: KeyData, [keyType, keyList]) => {
      if (!isKeyType(keyType) || !selectedTypes.has(keyType)) {
        return acc;
      }
  
      const filteredKeyList = keyList.filter((key) =>
        key.toLowerCase().includes(search.toLowerCase())
      );
  
      if (filteredKeyList.length > 0) {
        acc[keyType] = filteredKeyList;
      }
  
      return acc;
    },
    {}
  );

  return (
    <Grid container>
      <Grid
        item
        sm={3}
        sx={{
          backgroundColor: "#28292d",
          height: "100vh",
          width: "25%",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              mr: 0,
              fontWeight: 600,
              color: "#dae0db",
            }}
          >
            DB:
          </Typography>
          <Select
            size="small"
            value={selectedDatabase}
            onChange={(event) => {
              setSelectedDatabase(event.target.value as string);
            }}
            renderValue={(selected) => selected}
            sx={{
              width: 50,
              backgroundColor: "#1f2125",
              color: "#dae0db",
              "& .MuiSelect-icon": {
                color: "#dae0db",
              },
              "& .MuiSelect-select": {
                paddingLeft: 1.2,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                fontSize: 14,
                fontWeight: 600,
              },
            }}
          >
            {databases.map((db: [string, boolean], index: number) => (
              <MenuItem key={index} value={db[0]}>
                {db[0]} {db[1] ? "(empty)" : "(data)"}
              </MenuItem>
            ))}
          </Select>
          <IconButton size="small" sx={{ color: "#dae0db" }}
            onClick={refresh_data}
          >
            <RefreshIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: "#dae0db" }}
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
          {["string", "list", "hash", "set", "zset"].map((type) => (
            <MenuItem key={type}>
              <Checkbox
                checked={selectedTypes.has(type as KeyType)}
                onChange={(event) => {
                  const newSelectedTypes = new Set(selectedTypes);
                  if (type === "all") {
                    if (event.target.checked) {
                      ["string", "list", "hash", "set", "zset"].forEach(t => newSelectedTypes.add(t as KeyType));
                    } else {
                      newSelectedTypes.clear();
                    }
                  } else {
                    if (event.target.checked) {
                      newSelectedTypes.add(type as KeyType);
                    } else {
                      newSelectedTypes.delete(type as KeyType);
                    }
                  }
                  setSelectedTypes(newSelectedTypes);
                }}
              />
              {type}
            </MenuItem>
          ))}
          </Menu>
        </Box>
        <Box sx={{ 
          overflow: "auto", 
          flexGrow: 1,
          direction: "rtl",
          "&::-webkit-scrollbar": {
            width: "4px",
            backgroundColor: "#F5F5F5",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#F90",
            borderRadius: "2px",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
            borderRadius: "5px",
          },
          "& > *": {
            direction: "ltr",
          },
          }}>
          <List>
            {Object.entries(filteredKeys).map(([keyType, keyList]) => {
              if (!isKeyType(keyType)) {
                return null;
              }

              return (
                <div key={keyType}>
                  <ListItem
                    onClick={() => {
                      handleToggle(keyType);
                    }
                    }
                    sx={{ px: 2 }}
                  >
                    <ArrowForwardIosIcon
                      sx={{
                        mr: 1,
                        transform: expanded.has(keyType) ? "rotate(90deg)" : "",
                        transition: "transform 0.2s ease-in-out",
                        fontSize: 12,
                        color: "white",
                      }}
                    />
                    <ListItemText
                      primary={keyType}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#dae0db",
                        },
                      }}
                    />
                    <ListItemText
                      primary={keyList.length}
                      sx={{
                        flexGrow: 1,
                        textAlign: "right",
                        "& .MuiListItemText-primary": {
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#dae0db",
                        },
                      }}
                    />
                  </ListItem>
                  <Divider />
                  <Collapse
                    in={expanded.has(keyType)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {keyList.map((key, index) => (
                        <React.Fragment key={`${keyType}-${index}`}>
                          {index > 0 && <Divider />}
                          <ListItem
                            onClick={() => {
                              setSelectedKey(key);
                              setSelectedKeyType(keyType);
                            }}
                            sx={{
                              pl: 5,
                              backgroundColor: selectedKey === key ? "#bcd1f5" : "#9fa0a3",
                              "&:hover": {
                                backgroundColor: "#bcd1f5",
                              },
                            }}
                          >
                            {isKeyType(keyType) && iconMap[keyType]}
                            <ListItemText
                              primary={key}
                              sx={{
                                "& .MuiListItemText-primary": {
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "black",
                                },
                              }}
                            />
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  </Collapse>
                </div>
              );
            })}
          </List>
        </Box>
        <Box
          sx={{
            p: 1,
            borderTop: 1,
            borderColor: "divider",
            width: "90%",
          }}
        >
          <SearchTextField
            hiddenLabel
            id="outlined-hidden-label-small"
            placeholder="Search"
            variant="outlined"
            size="small"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        <Grid container sx={{ height: 50 }}>
          <Grid item xs={6} sx={{ backgroundColor: "#ADD8E6" }}>
            <StyledIconButton size="small">
              <TerminalIcon />
            </StyledIconButton>
          </Grid>
          <Grid item xs={6} sx={{ backgroundColor: "#90EE90" }}>
            <StyledIconButton size="small">
              <AddIcon />
            </StyledIconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={8}
        sx={{
          ml: "25%",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "#0e0e10",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "72%",
            position: "fixed",
            zIndex: 1,
            backgroundColor: "#28292d",
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              mr: 1,
              mt: 1,
              fontWeight: 600,
              color: "#dae0db",
            }}
          >
            Connection
          </Typography>
          <ConnectionTextField
            hiddenLabel
            id="outlined-hidden-label-small"
            placeholder={currentConnection}
            size="small"
            inputProps={{ readOnly: true }}
          />
          <IconButton
            size="small"
            sx={{
              color: "#dae0db",
              ml: 2
            }}
          >
            <SettingsIcon />
          </IconButton>
          <Chip
            label={connectionStatus ? "Online" : "Offline"}
            sx={{
              backgroundColor: connectionStatus ? "#90EE90" : "#FF6347",
              color: "#333333",
              fontWeight: 600,
              height: 25,
              fontSize: 14,
              borderRadius: 2,
              mr: 2,
              ml: 2,
            }}
          />
          <IconButton
            size="small"
            sx={{
              color: "#dae0db",
            }}
            onClick={() => {
              navigate(-1);
            }}
          >
            <ExitToAppIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            width: "80%",
            backgroundColor: "#1f2125",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            justifyContent: "center",
            alignItems: "center",
            zIndex: -1,
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: "white",
            }}
          >
            <SelectedValueKey selectedKey={selectedKey} keyType={selectedKeyType} />
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Dashboard;

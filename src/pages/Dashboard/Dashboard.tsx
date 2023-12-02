import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Grid, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TerminalIcon from "@mui/icons-material/Terminal";
import { useNavigate } from "react-router-dom";
import { SearchTextField, StyledIconButton } from "./styles";
import { SelectedValueKey } from "./SelectedValueKey";
import { KeyList } from "../../components/KeyList";
import { TopBarDashboard } from "../../components/TopBarDashboard";
import { TopSideBar } from "../../components/TopSideBar";

type KeyType = "string" | "list" | "hash" | "set" | "zset" | "all";

interface KeyData {
  [keyType: string]: string[];
}

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

  const fetchKeys = async (database: string) => {
    try {
      const dbNumber = Number(database);
      const fetchedKeys: any = await invoke("get_keys_from_database", {
        db: dbNumber,
      });
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
      if (databases.length > 0) {
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
  };

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

  function handleCheckboxChange(
    type: KeyType,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const newSelectedTypes = new Set(selectedTypes);
    if (type === "all") {
      if (event.target.checked) {
        ["string", "list", "hash", "set", "zset"].forEach((t) =>
          newSelectedTypes.add(t as KeyType)
        );
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
  }

  return (
    <Grid container>
      <Grid
        item
        xs='auto'
        sm={3}
        sx={{
          backgroundColor: "#28292d",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopSideBar
          selectedDatabase={selectedDatabase}
          databases={databases}
          setSelectedDatabase={setSelectedDatabase}
          refreshData={refresh_data}
          handleMenuClick={handleClick}
          menuAnchorEl={anchorEl}
          isMenuOpen={open}
          hanldleMenuClose={handleClose}
          selectedTypes={selectedTypes}
          handleCheckboxChange={handleCheckboxChange}
        />
        <KeyList
          filteredKeys={filteredKeys}
          expanded={expanded}
          selectedkey={selectedKey}
          handleToggle={handleToggle}
          setSelected={setSelectedKey}
          setSelectedKeyType={setSelectedKeyType}
        />
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
            variant='filled'
            size="small"
            color="primary"
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
        sm={9}
        xs='auto'
        sx={{
          flex: 1,
          width: "100%",
          height: "100vh",
          backgroundColor: "#1f2125",
        }}
      >
        <TopBarDashboard
          currentConnection={currentConnection}
          connectionStatus={connectionStatus}
          handleExit={() => navigate(-1)}
        />

        <SelectedValueKey selectedKey={selectedKey} keyType={selectedKeyType} />
      </Grid>
    </Grid>
  );
};

export default Dashboard;

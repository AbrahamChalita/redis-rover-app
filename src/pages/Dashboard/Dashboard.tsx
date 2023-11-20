import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {
  Grid,
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  Chip,
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const fetchedKeys: KeyData = await invoke("get_all_keys");
        setKeys(fetchedKeys);
      } catch (error) {
        console.error("Error fetching keys:", error);
      }
    };

    fetchKeys();
  }, []);

  const handleToggle = (keyType: string) => {
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

  return (
    <Grid container >
      <Grid
        item
        sm={3}
        sx={{
          backgroundColor: "#f5f5f5",
          height: "100vh",
          width: "20%",
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
              mr: 1,
              fontWeight: 600,
            }}
          >
            DB: 0
          </Typography>
          <IconButton size="small">
            <RefreshIcon />
          </IconButton>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Box sx={{ overflow: "auto", flexGrow: 1 }}>
          <List>
            {Object.entries(keys).map(([keyType, keyList]) => {
              if (!isKeyType(keyType)) {
                return null;
              }

              return (
                <div key={keyType}>
                  <ListItem
                    onClick={() => handleToggle(keyType)}
                    sx={{ px: 2 }}
                  >
                    <ArrowForwardIosIcon
                      sx={{
                        mr: 1,
                        transform: expanded.has(keyType) ? "rotate(90deg)" : "",
                        transition: "transform 0.2s ease-in-out",
                        fontSize: 20,
                      }}
                    />
                    <ListItemText primary={keyType} />
                    <ListItemText
                      primary={keyList.length}
                      sx={{ flexGrow: 1, textAlign: "right" }}
                    />
                  </ListItem>
                  <Collapse
                    in={expanded.has(keyType)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {keyList.map((key, index) => (
                        <React.Fragment key={`${keyType}-${index}`}>
                          {index > 0 && <Divider />}
                          <ListItem sx={{ pl: 5 }}>
                            {isKeyType(keyType) && iconMap[keyType]}
                            <ListItemText primary={key} />
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
          <TextField
            hiddenLabel
            id="outlined-hidden-label-small"
            placeholder="Search"
            variant="outlined"
            size="small"
            sx={{ mb: 1, width: "100%" }}
          />
        </Box>
        <Grid container sx={{ height: 50 }}>
          <Grid item xs={6} sx={{ backgroundColor: "#ADD8E6" }}>
            <IconButton
              size="small"
              sx={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                width: "100%",
                height: "100%",
                borderRadius: 0,
              }}
            >
              <TerminalIcon />
            </IconButton>
          </Grid>
          <Grid item xs={6} sx={{ backgroundColor: "#90EE90" }}>
            <IconButton
              size="small"
              sx={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                width: "100%",
                height: "100%",
                borderRadius: 0,
              }}
            >
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={9}
        sx={{
            ml: "20%",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "77%",
            position: "fixed",
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              mr: 1,
              fontWeight: 600,
            }}
          >
            Connection
          </Typography>
          <TextField
            hiddenLabel
            id="outlined-hidden-label-small"
            placeholder="localhost"
            size="small"
            sx={{ ml: 2, flexGrow: 1, height: "2.15rem", mr: 2 }}
          />
          <IconButton size="small">
            <SettingsIcon />
          </IconButton>
          <Chip
            label="Online"
            sx={{
              backgroundColor: "#90EE90",
              color: "#333333",
              fontWeight: 600,
              height: 25,
              fontSize: 14,
              borderRadius: 2,
              mr: 2,
              ml: 2,
            }}
          />
          <IconButton size="small">
            <ExitToAppIcon 
                onClick={() => {
                    navigate(-1)
                }
            }
            />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Dashboard;

import React from "react";
import {
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Checkbox,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  TopSideBarContainer,
  TopSideBarSelect,
  TopSideBarText,
} from "./styles";

type KeyType = "string" | "list" | "hash" | "set" | "zset" | "all";

interface TopSideBarProps {
  selectedDatabase: string;
  databases: [string, boolean][];
  setSelectedDatabase: (database: string) => void;
  refreshData: () => void;
  handleMenuClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  menuAnchorEl: null | HTMLElement;
  isMenuOpen: boolean;
  hanldleMenuClose: () => void;
  selectedTypes: Set<string>;
  handleCheckboxChange: (
    type: KeyType,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const TopSideBar: React.FC<TopSideBarProps> = ({
  selectedDatabase,
  databases,
  setSelectedDatabase,
  refreshData,
  handleMenuClick,
  menuAnchorEl,
  isMenuOpen,
  hanldleMenuClose,
  selectedTypes,
  handleCheckboxChange,
}) => {
  return (
    <TopSideBarContainer>
      <TopSideBarText>DB:</TopSideBarText>
      <TopSideBarSelect
        size="small"
        value={selectedDatabase}
        onChange={(event) => {
          setSelectedDatabase(event.target.value as string);
        }}
        renderValue={(value) => (
          <Typography sx={{ color: "#dae0db" }}>{value as string}</Typography>
        )}
      >
        {databases.map((db: [string, boolean], index: number) => (
          <MenuItem key={index} value={db[0]}>
            {db[0]} {db[1] ? "(empty)" : "(data)"}
          </MenuItem>
        ))}
      </TopSideBarSelect>
      <IconButton size="small" sx={{ color: "#dae0db" }} onClick={refreshData}>
        <RefreshIcon />
      </IconButton>
      <IconButton
        size="small"
        sx={{ color: "#dae0db" }}
        onClick={handleMenuClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={hanldleMenuClose}
      >
        {["string", "list", "hash", "set", "zset"].map((type) => (
          <MenuItem key={type}>
            <Checkbox
              checked={selectedTypes.has(type as KeyType)}
              onChange={(event) => handleCheckboxChange(type as KeyType, event)}
            />
            {type}
          </MenuItem>
        ))}
      </Menu>
    </TopSideBarContainer>
  );
};

export default TopSideBar;

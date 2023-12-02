import { Box, ListItem, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export const KeyListContainer = styled(Box)`
  overflow: auto;
  flex-grow: 1;
  direction: rtl;

  &::-webkit-scrollbar {
    width: 4px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #f90;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
  }

  & > * {
    direction: ltr;
  }
`;

interface StyledArrowForwardIosIconProps {
  expanded: boolean;
}

export const StyledArrowForwardIosIcon = styled(ArrowForwardIosIcon, {
  shouldForwardProp: (prop) => prop !== "expanded",
})<StyledArrowForwardIosIconProps>`
  margin-right: 10px;
  transform: ${({ expanded }) => (expanded ? "rotate(90deg)" : "none")};
  transition: transform 0.2s ease-in-out;
  font-size: 12px;
  color: white;
`;

export const KeyListItemText = styled(ListItemText)`
  & .MuiListItemText-primary {
    font-size: 14px;
    font-weight: bold;
    color: #dae0db;
  }
`;

export const KeyListItemTextNumber = styled(ListItemText)`
  flex-grow: 1;
  text-align: right;
  & .MuiListItemText-primary {
    font-size: 14px;
    font-weight: bold;
    color: #dae0db;
  }
`;

export const ExpandedKeyListItem = styled(ListItem)`
  padding-left: 2rem;
  margin-bottom: -10px;
  padding-right: 0px;
  margin-top: -5px;
`;

interface ExpandedKeyListItemBoxProps {
  selectedkey: string;
  keyvalue: string;
  keytype: string;
}

export const ExpandedKeyListItemBox = styled(Box)<ExpandedKeyListItemBoxProps>`
  border-radius: 0.3rem;
  background-color: ${({ selectedkey, keyvalue }) => selectedkey === keyvalue ? "#bcd1f5" : "#dae0db"};
  &:hover {
    background-color: #bcd1f5;
    cursor: pointer;
  }
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: 30px;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 5px;
    background-color: ${({ keytype }) =>
      keytype === "string" ? "#FF6347" :
      keytype === "list" ? "#90EE90" :
      keytype === "hash" ? "#ADD8E6" :
      keytype === "set" ? "#FFD700" :
      "#FFA500"};
  }
`;

export const ExpandedKeyListItemText = styled(ListItemText)`
  & .MuiListItemText-primary {
    font-size: 14px;
    font-weight: bold;
    color: #000;
  }
  margin-left: 1rem;
`;

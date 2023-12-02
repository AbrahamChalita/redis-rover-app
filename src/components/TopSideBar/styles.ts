import { Box, Typography, Select } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TopSideBarContainer = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 10%;
    border-bottom: 1px solid;
    border-color: #1f2125;
`;

export const TopSideBarText = styled(Typography)`
    font-size: 16px;
    font-weight: 600;
    color: #dae0db;
    margin-right: 0;
`;

export const TopSideBarSelect = styled(Select)`
    width: 55;
    height: 30px;
    background-color: #1f2125;
    color: #dae0db;
    & .MuiSelect-select {
        padding-left: 0.5rem;
        padding-right: 0;
        padding-top: 0;
        padding-bottom: 0;
        font-size: 14px;
        font-weight: 600;
    }
    & .MuiSelect-icon {
        color: #dae0db;
    }
`;
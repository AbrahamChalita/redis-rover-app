import { Box, Chip, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TopBarContainer = styled(Box)`
    background-color: #28292d;
    height: 10%;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    display: flex;
`;

export const CurrentConnectionContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45%;
    width: 100%;
    background-color: lightgrey;
    border-radius: 0.4rem;
    margin-left: 0.5rem;
`;

export const CurrentConnectionText = styled(Typography)`
    font-size: 16px;
    margin-right: 0;
    font-weight: 500;
    color: black;
    margin-left: 1rem;
`;

interface CustomIconButtonsProps {
    hovercolor: string;
    rightmargin: string;
    leftmargin: string;
}

export const CustomIconButton = styled(IconButton)<CustomIconButtonsProps>`
    color: #dae0db;
    &:hover {
        color: ${({ hovercolor }) => hovercolor};
    }
    margin-left: ${({ leftmargin }) => leftmargin};
    margin-right: ${({ rightmargin }) => rightmargin};
`;

interface CustomChipProps {
    connectionstatus: string;
}

export const CustomChip = styled(Chip)<CustomChipProps>`
    background-color: ${({ connectionstatus }) => connectionstatus ? "#90EE90" : "#FF6347"};
    font-size: 14px;
    font-weight: 600;
    height: 25px;
    border-radius: 0.3rem;
    margin-left: 1rem;
    margin-right: 1rem;
    &:hover {
        cursor: pointer;
    }
`;


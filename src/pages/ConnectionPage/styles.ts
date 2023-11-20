import styled from "styled-components";
import { Box, Grid, TextField, Typography } from "@mui/material";


export const ContentContainer = styled.div`
    background-color: #1f2125;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const BottomBox = styled(Box)`
    position: "fixed",
    bottom: 0,
    width: "100%",
    paddingTop: 3,
    paddingBottom: 5,
    backgroundColor: "#363533"
`;

export const BottomBoxTitle = styled(Typography)`
    fontSize: 18,
    fontWeight: 600,
    textAlign: "left",
    color: "white",
    marginLeft: 5,
    marginBottom: 2,
`;

export const BottomGridContainer = styled(Grid)`
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
`;

export const BottomURLgrid = styled(Grid)`
    display: "flex",
    alignItems: "center",
`;

export const BottomURLTypography = styled(Typography)`
    fontSize: 14,
    fontWeight: 600,
    textAlign: "left",
    color: "white",
    ml: 5,
`;

export const BottomURLTextField = styled(TextField)`
    ml: 2,
    width: { xs: "80%", sm: "100%" },
    "& .MuiInputBase-input::placeholder": {
    color: "white",
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
`;




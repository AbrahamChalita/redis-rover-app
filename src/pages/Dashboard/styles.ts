import styled from 'styled-components';
import { TextField, IconButton } from '@mui/material';



export const SearchTextField = styled(TextField)`
  margin-bottom: 8px;
  width: 100%;
  & .MuiInputBase-input::placeholder {
    color: white;
  }
  & .MuiInputBase-input {
    color: white;
  }
  & .MuiOutlinedInput-notchedOutline {
    borderColor: blue;
  }
  &:hover .MuiOutlinedInput-notchedOutline {
    borderColor: blue;
  }
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    borderColor: blue;
  }
`;


export const StyledIconButton = styled(IconButton)`
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 0;
`;

export const ConnectionTextField = styled(TextField)`
  margin-left: 10px; /* ml: 2 */
  flex-grow: 1;
  height: 2.15rem;
  margin-right: 8px; /* mr: 2 */
  & .MuiInputBase-input::placeholder {
    color: white;
  }
  & .MuiOutlinedInput-notchedOutline {
    border-color: white;
  }
  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: white;
  }
`;


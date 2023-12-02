import React from 'react'
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { CurrentConnectionContainer, CurrentConnectionText, CustomChip, CustomIconButton, TopBarContainer } from './styles';

interface TopBarDashboardProps {
    currentConnection: string;
    connectionStatus: boolean;
    handleExit: () => void;
}

const TopBarDashboard: React.FC<TopBarDashboardProps> = ({ currentConnection, connectionStatus, handleExit }) => {
    return (
        <TopBarContainer>
            <CurrentConnectionContainer>
                <CurrentConnectionText>
                    {currentConnection}
                </CurrentConnectionText>
            </CurrentConnectionContainer>
                <CustomIconButton
                    size='small'
                    hovercolor='lightgrey'
                    rightmargin='0'
                    leftmargin='1rem'
                >
                    <SettingsIcon/>
                </CustomIconButton>
                <CustomChip connectionstatus={connectionStatus.toString()} label={connectionStatus ? 'Online' : 'Offline'} />
                <CustomIconButton
                    size='small'
                    hovercolor='#f44336'
                    rightmargin='1rem'
                    leftmargin='0'
                    onClick={handleExit}
                >
                    <ExitToAppIcon/>
                </CustomIconButton>
        </TopBarContainer>
    );
}

export default TopBarDashboard
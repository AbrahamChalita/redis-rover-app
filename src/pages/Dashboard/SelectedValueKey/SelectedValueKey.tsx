import React, { useState, useEffect } from 'react';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import { invoke } from '@tauri-apps/api/tauri';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

type KeyType = "string" | "list" | "hash" | "set" | "zset" | "all";

interface SelectedValueKeyProps {
    selectedKey: string;
    keyType: KeyType;
}

const SelectedValueKey: React.FC<SelectedValueKeyProps> = ({ selectedKey, keyType }) => {
    const [keyValue, setKeyValue] = useState<any>(null);

    useEffect(() => {
        if (selectedKey && keyType) {
            invoke("get_key_value", { key: selectedKey, keyType })
                .then((value) => {
                   setKeyValue(value as []);
                })
                .catch((error) => {
                    console.error("Error fetching key value:", error);
                });
        }
    }, [selectedKey, keyType]);

    const colorMap: any = {
        string: '#FF6347',
        list: '#90EE90',
        hash: '#ADD8E6',
        set: '#FFD700',
        zset: '#FFA500',
        all: '#FFA500',
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="top"
            alignItems="center"
            height='90%'  
            width='100%'
        >
            <Box
                sx={{
                    backgroundColor: 'white',
                    width: '98%',
                    marginTop: '1%',
                    height: '10%',
                    borderRadius: '5px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center', 
                }}
            >
                <Box
                    sx={{
                        flex: 1, 
                        minWidth: 0, 
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 2,
                    }}
                >
                    <Typography sx={{ marginRight: 1 }}>
                        {selectedKey || 'No Key'}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography sx={{ marginLeft: 1 }}>
                        {keyValue ? `${keyValue[1]} B` : 'No Value'}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '5px',
                            backgroundColor: colorMap[keyType],
                            marginRight: 1,
                            paddingTop: 0.6,
                            paddingBottom: 0.6,
                            paddingLeft: 2,
                            paddingRight: 2,
                        }}
                    >
                        <Typography>
                            {keyType}
                        </Typography>
                    </Box>
                    <IconButton
                        sx={{
                            '&:hover': {
                                color: 'red',
                            },
                        }}
                    >
                        <DeleteForeverIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default SelectedValueKey;

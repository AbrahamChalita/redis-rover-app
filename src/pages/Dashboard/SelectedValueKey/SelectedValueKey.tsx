import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

type KeyType = "string" | "list" | "hash" | "set" | "zset";

interface SelectedValueKeyProps {
    selectedKey: string;
    keyType: KeyType;
}

const SelectedValueKey: React.FC<SelectedValueKeyProps> = ({ selectedKey, keyType }) => {
    const [keyValue, setKeyValue] = useState<string | string[] | Record<string, string> | null>(null);

    useEffect(() => {
        if (selectedKey) {
            // Fetch the value of the key from your backend
            // Replace this with your actual API call
            // invoke('get_key_value', { key: selectedKey, type: keyType })
            //   .then(response => setKeyValue(response))
            //   .catch(error => console.error('Error fetching key value:', error));
        }
    }, [selectedKey, keyType]);


    const renderValue = () => {
        switch (keyType) {
            case "string":
                return (
                    <Box>
                        <Typography>{"Test"}</Typography>
                    </Box>
                )
            case "list":
                return (
                    <Box>
                        {keyValue && (keyValue as string[]).map((value, index) => (
                            <Typography key={index}>{value}</Typography>
                        ))}
                    </Box>
                );
            case "hash":
                return (
                    <Box>
                        {keyValue && Object.entries(keyValue as Record<string, string>).map(([key, value]) => (
                            <Typography key={key}>
                                <strong>{key}</strong>: {value}
                            </Typography>
                        ))}
                    </Box>
                );
            case "set":
                return (
                    <Box>
                        {keyValue && (keyValue as string[]).map((value, index) => (
                            <Typography key={index}>{value}</Typography>
                        ))}
                    </Box>
                );
            case "zset":
                return (
                    <Box>
                        {keyValue && (keyValue as string[]).map((value, index) => (
                            <Typography key={index}>{value}</Typography>
                        ))}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box>
            {selectedKey && (
                <Box>
                    <Typography variant="h6">{selectedKey}</Typography>
                    {renderValue()}
                </Box>
            )}
        </Box>
    );
};

export default SelectedValueKey;
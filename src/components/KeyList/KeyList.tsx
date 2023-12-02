import React from "react";
import {
  List,
  ListItem,
  Collapse,
  Divider,
} from "@mui/material";
import {
  ExpandedKeyListItem,
  ExpandedKeyListItemBox,
  ExpandedKeyListItemText,
  KeyListContainer,
  KeyListItemText,
  KeyListItemTextNumber,
  StyledArrowForwardIosIcon,
} from "./styles";

type KeyType = "string" | "list" | "set" | "zset" | "hash";

interface KeyListProps {
  filteredKeys: { [keyType: string]: string[] };
  expanded: Set<string>;
  selectedkey: string;
  handleToggle: (keyType: KeyType) => void;
  setSelected: (key: string) => void;
  setSelectedKeyType: (keyType: KeyType) => void;
}

const KeyList: React.FC<KeyListProps> = ({
  filteredKeys,
  expanded,
  selectedkey,
  handleToggle,
  setSelected,
  setSelectedKeyType,
}) => {
  function isKeyType(key: string): key is KeyType {
    return ["string", "list", "set", "zset", "hash"].includes(key);
  }

  return (
    <KeyListContainer>
      <List>
        {Object.entries(filteredKeys).map(([keyType, keyList]) => {
          if (!isKeyType(keyType)) {
            return null;
          }

          return (
            <div key={keyType}>
              <ListItem
                onClick={() => {
                  handleToggle(keyType);
                }}
                sx={{ px: 2 }}
              >
                <StyledArrowForwardIosIcon expanded={expanded.has(keyType)} />
                <KeyListItemText primary={keyType} />
                <KeyListItemTextNumber primary={keyList.length} />
              </ListItem>
              <Divider />
              <Collapse in={expanded.has(keyType)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {keyList.map((key, index) => (
                    <React.Fragment key={`${keyType}-${index}`}>
                      <ExpandedKeyListItem
                        onClick={() => {
                          setSelected(key);
                          setSelectedKeyType(keyType);
                        }}
                      >
                        <ExpandedKeyListItemBox
                          selectedkey={selectedkey}
                          keyvalue={key}
                          keytype={keyType}
                        >
                          <ExpandedKeyListItemText>
                            {key}
                          </ExpandedKeyListItemText>
                        </ExpandedKeyListItemBox>
                      </ExpandedKeyListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            </div>
          );
        })}
      </List>
    </KeyListContainer>
  );
};

export default KeyList;

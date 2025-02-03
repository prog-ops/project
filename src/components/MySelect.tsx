import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
    TextField,
    Menu,
    MenuItem,
    Chip,
    FormControl,
    Select,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    Cancel,
    CancelOutlined,
    KeyboardArrowDown,
    Search
} from "@mui/icons-material";

interface Option {
    label: string;
    value: any;
}

interface MySelectProps {
    options: Option[];
    onSelect: (selected: Option[]) => void;
    searchable?: boolean;
    zIndex?: number;
}

const MySelect: React.FC<MySelectProps> = ({
                                                                   options,
                                                                   onSelect,
                                                                   searchable = true,
                                                                   zIndex = 1001,
                                                               }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const selectRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [forceFocus, setForceFocus] = useState(false); // State to track forced focus

    const filteredOptions = options.filter(option => {
        const searchTerms = searchTerm.toLowerCase().split(/\s+/);
        return searchTerms.every(term =>
            option.label.toLowerCase().includes(term)
        );
    });

    const handleClick = () => {
        setAnchorEl(selectRef.current);
    };

    const handleSelect = (option: Option) => {
        setSelectedOptions(prev => {
            const newSelection = prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option];
            onSelect(newSelection);
            return newSelection;
        });
        setForceFocus(prev => !prev); // Force focus retention
    };

    // Modify handleSearch by adding useCallback to avoid closure on space
    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) return text;

        const terms = highlight.toLowerCase().split(/\s+/);
        let highlighted = text;

        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });

        return <span dangerouslySetInnerHTML={{__html: highlighted}}/>;
    };

    const handleChipDelete = (valueToDelete: any) => {
        setSelectedOptions(prev => {
            const newSelection = prev.filter(option => option.value !== valueToDelete);
            onSelect(newSelection);
            return newSelection;
        });
    };

    // useEffect to handle focus
    useEffect(() => {
        if (anchorEl && searchable) {
            const input = searchInputRef.current;
            if (input) {
                const timeout = setTimeout(() => {
                    input.focus();
                    input.selectionStart = input.selectionEnd = searchTerm.length; // Maintain cursor position
                }, 10);

                return () => clearTimeout(timeout);
            }
        }
    }, [anchorEl, searchTerm, searchable, forceFocus]);

    return (
        <div>
            <FormControl sx={{minWidth: 400}}>
                <Select
                    IconComponent={() => (
                        <KeyboardArrowDown
                            sx={{
                                position: 'absolute',
                                right: '8px',
                                color: 'text.secondary',
                                pointerEvents: 'none'
                            }}
                        />
                    )}
                    fullWidth
                    displayEmpty
                    multiple
                    open={false}
                    onOpen={() => setAnchorEl(selectRef.current)}
                    ref={selectRef}
                    value={selectedOptions.map(option => option.value)} // Array for multiple selections
                    onClick={handleClick}
                    renderValue={(selected) => (
                        <div style={{display: 'flex', gap: 4, flexWrap: 'wrap'}}>
                            {selected.map((value) => {
                                const option = options.find(opt => opt.value === value);
                                return (
                                    <Chip
                                        key={value}
                                        label={option?.label}
                                        onDelete={(e) => {
                                            e.stopPropagation();
                                            handleChipDelete(value);
                                        }}
                                        // onMouseDown to let chip deletable
                                        onMouseDown={(event) => {
                                            event.stopPropagation();
                                        }}
                                        deleteIcon={<CancelOutlined/>}
                                        sx={{
                                            '& .MuiChip-deleteIcon': {
                                                marginLeft: '-8px',
                                                marginRight: '4px'
                                            }
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}
                >
                    {options.map((option) => (
                        <MenuItem key={option.value} onClick={() => handleSelect(option)}>
                            {highlightText(option.label, searchTerm)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>


            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => {
                    setSearchTerm('');
                    setAnchorEl(null);
                }}
                // Prevent automatic focus management
                disableAutoFocus
                disableEnforceFocus
                disableRestoreFocus
                MenuListProps={{
                    autoFocus: false,
                    onKeyDown: (e) => e.stopPropagation()
                }}
                PaperProps={{
                    style: {
                        zIndex: zIndex,
                        // Let Menu adjust / fit its width to Select component
                        width: selectRef.current?.clientWidth,
                        maxHeight: 300,
                        marginTop: 20,
                        borderRadius: 0
                    },
                }}
            >
                {searchable && (
                    <TextField
                        inputRef={searchInputRef}
                        onChange={handleSearch}
                        placeholder="Search..."
                        fullWidth
                        variant="outlined"
                        margin="none"
                        value={searchTerm}
                        onKeyDown={(e) => {
                            // Prevent any default behavior that might close the menu
                            e.stopPropagation();
                        }}
                        InputProps={{
                            autoFocus: false, // Prevent autofocus after Select got clicked
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search
                                        fontSize="small"
                                        sx={{color: 'text.disabled'}}
                                    />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {searchTerm && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSearchTerm('');
                                                searchInputRef.current?.focus();
                                            }}
                                            sx={{padding: 0.5}}
                                        >
                                            <Cancel fontSize="small"/>
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                            sx: {
                                paddingLeft: 1,
                                '& .MuiInputBase-input': {
                                    paddingLeft: 1,
                                    caretColor: 'black',
                                }
                            }
                        }}
                        sx={{
                            transform: 'translateY(-8px)', // Remove "space" between top menu border and top of text field
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 0, // Set border radius to 0 for a rectangular border
                                '&.Mui-focused': {
                                    // Remove outline and change border color
                                    boxShadow: 'none',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'divider', // Default border color
                                        borderWidth: '1px'
                                    }
                                },
                            },
                            // Remove effect when hovering
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'divider'
                            },
                            margin: '-2px',
                            width: 'calc(100% + 4px)',
                            height: 'calc(100% + 4px)'
                        }}
                        // Prevent blur
                        onBlur={(e) => {
                            if (forceFocus) {
                                e.preventDefault();
                                searchInputRef.current?.focus();
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                )}

                {filteredOptions.map((option) => (
                    <MenuItem
                        key={option.value}
                        onClick={() => handleSelect(option)}
                        sx={{
                            whiteSpace: 'pre-wrap', // Allow text to wrap and preserve spaces
                            maxWidth: '100%',       // Prevent overflow
                            backgroundColor: selectedOptions.includes(option)
                                ? '#d5ecd7' // A bit darker light green for selected menu item
                                : 'inherit',
                            '&:hover': {
                                backgroundColor: '#e8f5e9', // Light green
                            },
                            transition: 'background-color 0.05s ease'
                        }}
                    >
                        {highlightText(option.label, searchTerm)}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default MySelect;

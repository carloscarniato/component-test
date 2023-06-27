/*
    #release notes:
        <Dropdown
            label: string                               *Button text
            options: string[]                           *Array of strings to use as options
            isSearchable: boolean                       *Enable/Disable input to filter options
            onOptionSelected: (value: string) => {}     *Function to execute on option click
            userId?: number                             *User ID to sync if needed
            key?: string                                *Key to sync with if needed
        />
*/

import React, {useState, useEffect, useMemo} from 'react';
import { httpGet, httpPatch } from 'lib/http';

export const Dropdown = ({ label, options, userId, key, onOptionSelected, isSearchable  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => options.filter(option => option.includes(searchTerm)), [searchTerm]);
  
  const onToggle = () => {
    if (!userId || !key) {
      return setIsOpen(!isOpen);
    }
      
    httpPatch('user', { [`menu-state-${key}`]: !isOpen }).then(() => setIsOpen(!isOpen))
  }

  useEffect(() => {
    if (!userId || !key) return;

    httpGet(`users/${userId}`).then(user => { 
        if (user[`menu-state-${key}`]) {
            setIsOpen(user[`menu-state-${key}`]) 
        } else {
            setIsOpen(false)
        }
    }).catch(() => setIsOpen(false));
  }, [key, userId])

  return (
    <div className="dropdown">
      <button type="button" className="dropdown-button" id="dropdownButton" aria-haspopup="true" aria-expanded={isOpen} onClick={onToggle}>{label}</button>
      <div className={`dropdown-menu dropdown-section ${isOpen ? 'dropdown-open' : ''}`} aria-labelledby='dropdownButton' role="menu">
        {
          isSearchable ? (
            <input type="text" value={searchTerm} placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)}></input>
          ) : null
        }
        <ul>
        {
            filteredData? (
                filteredData.map((value, i) => (
                    <DropdownItem key={i} onClick={() => onOptionSelected(value)}>{value}</DropdownItem>
                ))
            ) : (
                <DropdownItem>No item found</DropdownItem>
            )
        }
        </ul>
      </div>
    </div>
  );
}

const DropdownItem = ({ children, onClick }) => {
  return <li onClick={onClick}>{children}</li>;
}

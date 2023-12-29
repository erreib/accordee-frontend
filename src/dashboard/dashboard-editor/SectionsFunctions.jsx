import { useState } from 'react';
import axios from 'axios';

// useDebounce hook
export function useDebounce(callback, delay) {
    const [debounceTimer, setDebounceTimer] = useState(null);

    const debouncedFunction = (...args) => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const newTimer = setTimeout(() => {
            callback(...args);
        }, delay);

        setDebounceTimer(newTimer);
    };

    return debouncedFunction;
}

// Define debouncedUpdateSections here
export function debouncedUpdateSections(newSections, setUpdateTrigger, backendUrl, dashboardUrl) {
    const token = localStorage.getItem('token'); // Retrieve the token

    axios.post(`${backendUrl}/${dashboardUrl}/sections`, { sections: newSections }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
        // Database successfully updated
        setUpdateTrigger(prevTrigger => prevTrigger + 1);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Define handleColorChange here
export function handleColorChange(color, index, sections, setSections, setUpdateTrigger, backendUrl, dashboardUrl) {
    const newSections = [...sections];
    newSections[index].color = color.hex;
    setSections(newSections);

    const token = localStorage.getItem('token'); // Retrieve the token

    axios.post(`${backendUrl}/${dashboardUrl}/sections`, { sections: newSections }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setUpdateTrigger(prevTrigger => prevTrigger + 1);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

export function updateSectionInfoInDB(index, newSectionTitle, newContent, sections, setSections, handleSectionsChange) {
    // Step 1: Update local state immediately
    const newSections = [...sections];

    // Update the title and content if they are not undefined
    if (newSectionTitle !== undefined) {
        newSections[index].title = newSectionTitle;
    }
    if (newContent !== undefined) {
        newSections[index].content = newContent;
    }

    setSections(newSections);

    handleSectionsChange(newSections); // Using debounced function here
}

export function moveSection(fromIndex, toIndex, sections, setSections, setUpdateTrigger, backendUrl, dashboardUrl) {
    const newSections = [...sections];
    const [movedItem] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedItem);

    // Update the "order" field for each section
    newSections.forEach((section, index) => {
        section.order = index;
    });

    // Update the sections first
    setSections(newSections);

    // Then update the backend
    axios.post(`${backendUrl}/${dashboardUrl}/sections`, { sections: newSections }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(() => {
        // Once the backend is updated, then update the trigger
        setUpdateTrigger(prevTrigger => prevTrigger + 1);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export function removeSection(index, sections, setSections, setUpdateTrigger, backendUrl, dashboardUrl) {
    const token = localStorage.getItem('token');
    const newSections = sections.filter((_, i) => i !== index);

    // Update the sections first
    setSections(newSections);

    // Then update the backend
    axios.post(`${backendUrl}/${dashboardUrl}/sections`, { sections: newSections }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(() => {
        // Once the backend is updated, then update the trigger
        setUpdateTrigger(prevTrigger => prevTrigger + 1);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}




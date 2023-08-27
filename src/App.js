// src/App.js

import React, { useState } from 'react';
import './App.css';
import FamilyInput from './FamilyInput';
import FamilyTree from './FamilyTree';
import EditDialog from './EditDialog';

function App() {
  const [familyData, setFamilyData] = useState([
    { name: 'Start', parent: '', relationship: '' }, // John is the root person
  ]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editId, setEditId] = useState(null);

  const handleEditClick = (name, id, relationship) => {
    // Find the family member with the matching id
    const familyMemberToEdit = familyData.find((member) => member.id === id);

    if (familyMemberToEdit) {
      setEditName(familyMemberToEdit.name);
      setEditId(id); // Set the id
      // setEditRelationship(relationship);
      setIsEditDialogOpen(true);
    }
  };




  const handleEditSave = (newName, newRelationship) => {
    if (editId !== null) {
      // Find the family member with the matching id
      const familyMemberToEdit = familyData.find((member) => member.id === editId);

      if (familyMemberToEdit) {
        familyMemberToEdit.name = newName;
        familyMemberToEdit.relationship = newRelationship; // Update the relationship
        setFamilyData([...familyData]);
      }
    }
  };


  const handleAddFamilyMember = (member) => {
    setFamilyData([...familyData, member]);
  };

  // Create a function to generate a hierarchical tree structure
  const generateFamilyTree = () => {
    const treeData = [];

    // Create a mapping of family members by name for easy access
    const familyMap = {};

    // First, loop through the family data to create a map of family members
    familyData.forEach((member) => {
      const { name, parent, relationship } = member;
      familyMap[name] = { name, children: [], relationship };
      if (!parent) {
        treeData.push(familyMap[name]);
      }
    });

    // Then, loop through the family data again to add children to their parents
    familyData.forEach((member) => {
      const { name, parent } = member;
      if (parent && familyMap[parent]) {
        familyMap[parent].children.push(familyMap[name]);
      }
    });

    return treeData;
  };

  return (
    <div className="App">
      <h1>Family Tree Visualization</h1>
      <FamilyInput onAddFamilyMember={handleAddFamilyMember} />
      <FamilyTree
        data={generateFamilyTree()}
        onEditClick={handleEditClick} // Pass the edit function to the FamilyTree component
      />
      <EditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditSave}
        initialValue={editName}
      />
    </div>
  );
}

export default App;

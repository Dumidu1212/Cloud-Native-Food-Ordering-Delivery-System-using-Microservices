import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "../../components/restaurant/Sidebar";
import image from "../../assets/spaghetti.jpg";

const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f6fa;
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.6rem;
    color: #2c3e50;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const CategoryBtn = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: ${({ active }) => (active ? "#3498db" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  border: 1px solid ${({ active }) => (active ? "#3498db" : "#ccc")};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3498db;
    color: #fff;
  }
`;

const AddItemButton = styled.button`
  background-color: #2ecc71;
  color: white;
  margin-bottom: 2rem;
  font-size: 1rem;
  padding: 0.5rem 1.3rem;
  border-radius: 120px;
  border: none;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const MenuGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MenuItemCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const ItemName = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const ItemCategory = styled.span`
  background-color: #ecf0f1;
  color: #7f8c8d;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  text-transform: capitalize;
  position: relative;
  top: -10rem; 
`;


const ItemImage = styled.img`
  width: 100%;
  max-width: 200px;
  height: auto;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const ItemDescription = styled.p`
  color: #555;
  margin: 0.5rem 0;
`;

const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: #2ecc71;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s ease;

  &.edit {
    background-color: #3498db;
    color: white;
  }

  &.delete {
    background-color: #e74c3c;
    color: white;
  }

  &:hover {
    opacity: 0.85;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const DialogBox = styled.div`
  background: white;
  padding: 4rem;
  border-radius: 16px;
  width: 450px;
  max-width: 95%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const StyledFormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const StyledLabel = styled.label`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  display: block;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
`;

const StyledDialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const StyledButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  background-color: ${({ variant }) =>
    variant === "secondary" ? "#95a5a6" : "#3498db"};
  color: #fff;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const MenuManagement = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Spaghetti Carbonara",
      description: "Classic Italian pasta with eggs, cheese, and pancetta.",
      price: 12.99,
      category: "main",
      image: image,
    },
  ]);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
    category: "main",
    image: "",
  });

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setter((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const filteredItems = menuItems.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  const handleEditClick = (item) => {
    setEditItem({ ...item });
    setShowEditDialog(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleEditSave = () => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === editItem.id ? editItem : item))
    );
    setShowEditDialog(false);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleAddSave = () => {
    const newItemToAdd = { ...newItem, id: menuItems.length + 1 };
    setMenuItems((prev) => [...prev, newItemToAdd]);
    setShowAddDialog(false);
  };
  const handleDelete = (id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <PageWrapper>
      <Sidebar />
      <Content>
        <SectionHeader>
          <h2>Menu Management</h2>
        </SectionHeader>

        <TopBar>
          <FilterButtons>
            {["all", "appetizers", "main", "desserts", "beverages"].map(
              (cat) => (
                <CategoryBtn
                  key={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </CategoryBtn>
              )
            )}
          </FilterButtons>
          <AddItemButton onClick={() => setShowAddDialog(true)}>
            Add Item
          </AddItemButton>
        </TopBar>

        <MenuGrid>
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id}>
              {item.image && <ItemImage src={item.image} alt={item.name} />}
              <ItemHeader>
                <ItemName>{item.name}</ItemName>
                <ItemCategory>{item.category}</ItemCategory>
              </ItemHeader>
              <ItemDescription>{item.description}</ItemDescription>
              <ItemFooter>
                <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                <ItemActions>
                  <ActionButton
                    className="edit"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </ActionButton>
                  <ActionButton
                    className="delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </ActionButton>
                </ItemActions>
              </ItemFooter>
            </MenuItemCard>
          ))}
        </MenuGrid>

        {/* Edit Dialog */}
        {showEditDialog && editItem && (
          <Overlay onClick={() => setShowEditDialog(false)}>
            <DialogBox onClick={(e) => e.stopPropagation()}>
              <StyledFormGroup>
                <StyledLabel>Name</StyledLabel>
                <StyledInput
                  name="name"
                  value={editItem.name}
                  onChange={handleEditChange}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <StyledLabel>Description</StyledLabel>
                <StyledTextArea
                  name="description"
                  value={editItem.description}
                  onChange={handleEditChange}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <StyledLabel>Price</StyledLabel>
                <StyledInput
                  type="number"
                  name="price"
                  value={editItem.price}
                  onChange={handleEditChange}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <StyledLabel>Category</StyledLabel>
                <StyledInput
                  name="category"
                  value={editItem.category}
                  onChange={handleEditChange}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <StyledLabel>Upload Image</StyledLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setEditItem)}
                />
              </StyledFormGroup>
              {editItem.image && (
                <ItemImage src={editItem.image} alt="Preview" />
              )}

              <StyledDialogActions>
                <StyledButton onClick={handleEditSave}>Save</StyledButton>
                <StyledButton
                  variant="secondary"
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </StyledButton>
              </StyledDialogActions>
            </DialogBox>
          </Overlay>
        )}

        {/* Add Dialog */}
        {showAddDialog && (
          <Overlay onClick={() => setShowAddDialog(false)}>
            <DialogBox onClick={(e) => e.stopPropagation()}>
              <StyledFormGroup>
                <StyledLabel>Name</StyledLabel>
                <StyledInput
                  name="name"
                  value={newItem.name}
                  onChange={handleAddChange}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <StyledLabel>Description</StyledLabel>
                <StyledTextArea
                  name="description"
                  value={newItem.description}
                  onChange={handleAddChange}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <StyledLabel>Price</StyledLabel>
                <StyledInput
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={handleAddChange}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <StyledLabel>Category</StyledLabel>
                <StyledInput
                  name="category"
                  value={newItem.category}
                  onChange={handleAddChange}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <StyledLabel>Upload Image</StyledLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setNewItem)}
                />
              </StyledFormGroup>
              {newItem.image && <ItemImage src={newItem.image} alt="Preview" />}
              <StyledDialogActions>
                <StyledButton onClick={handleAddSave}>Add Item</StyledButton>
                <StyledButton
                  variant="secondary"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </StyledButton>
              </StyledDialogActions>
            </DialogBox>
          </Overlay>
        )}
      </Content>
    </PageWrapper>
  );
};

export default MenuManagement;

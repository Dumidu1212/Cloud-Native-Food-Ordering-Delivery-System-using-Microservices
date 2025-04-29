import React from 'react';
import styled from 'styled-components';
import Sidebar from "../../components/restaurant/Sidebar";

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f6fa;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #2c3e50;
`;

const ProfileForm = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
  padding: 4rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #dcdfe3;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: rgb(212, 158, 158);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #dcdfe3;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: rgb(212, 158, 158);
  }
`;

const SaveButton = styled.button`
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #27ae60;
  }
`;

const ProfileManagement = () => {
  return (
    <DashboardContainer>
      <Sidebar />

      <MainContent>
        <Header>
          <Title>Restaurant Profile Management</Title>
        </Header>

        <ProfileForm>
          <FormGroup>
            <Label>Restaurant Name</Label>
            <Input type="text" placeholder="Enter restaurant name" />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea placeholder="Enter restaurant description" />
          </FormGroup>

          <FormGroup>
            <Label>Address</Label>
            <Input type="text" placeholder="Enter restaurant address" />
          </FormGroup>

          <FormGroup>
            <Label>Phone Number</Label>
            <Input type="tel" placeholder="Enter phone number" />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input type="email" placeholder="Enter email address" />
          </FormGroup>

          <FormGroup>
            <Label>Opening Hours</Label>
            <Input type="text" placeholder="e.g., 9:00 AM - 10:00 PM" />
          </FormGroup>

          <FormGroup>
            <Label>Profile Image</Label>
            <Input type="file" accept="image/*" />
          </FormGroup>

          <SaveButton type="submit">Save Changes</SaveButton>
        </ProfileForm>
      </MainContent>
    </DashboardContainer>
  );
};

export default ProfileManagement;

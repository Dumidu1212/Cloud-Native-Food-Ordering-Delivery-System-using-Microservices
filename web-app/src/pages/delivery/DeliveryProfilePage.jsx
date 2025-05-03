import { useEffect, useState } from "react";
import "../../styles/pages/profilePage.css";
import { api } from "./../../api/index";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const raw = localStorage.getItem("token");

      let token = "";
      let id = "";

      try {
        const parsed = JSON.parse(raw); // ✅ only works if stored as JSON
        token = parsed.token;
        id = parsed.userId;
      } catch (err) {
        console.log("Token is already a string or malformed JSON", err);
        token = raw; // fallback
        id = localStorage.getItem("userId"); // fallback if userId was stored separately
      }

      console.log("Token (final string):", token);
      console.log("inside Delivery Home");
      console.log("userId:", id);

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const res = await api.delivery.getProfile(token);

        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(`Failed to fetch profile: ${errorMessage}`);
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-detail">
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phone}
        </p>
        <p>
          <strong>Vehicle Number:</strong> {profile.vehicleNumber}
        </p>
        <p>
          <strong>License:</strong> {profile.license}
        </p>
        <p>
          <strong>Gender:</strong> {profile.gender}
        </p>
        <p>
          <strong>Status:</strong> {profile.status}
        </p>
        <button
          className="btn btn-primary me-2"
          onClick={() => alert("Edit Profile")}
        >
          Edit Profile
        </button>
        <button
          className="btn btn-secondary me-2"
          onClick={() => alert("Change Password")}
        >
          Change Password
        </button>
        <button
          className="btn btn-danger"
          onClick={() => alert("Delete Account")}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import CustomerFields from "./role-fields/CustomerFields"
import DeliveryPersonFields from "./role-fields/DeliveryPersonFields"
import RestaurantFields from "./role-fields/RestaurantFields"
import axios from "axios"
import "../../styles/pages/registerPage.css"

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole]   = useState("")
  const [form, setForm]   = useState({
    name: "", email: "", password: "", role: "", phone: ""
  })
  const [coords, setCoords] = useState(null)       // geojson: { type:'Point', coordinates:[lng,lat] }
  const [error, setError]   = useState("")

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleRoleChange = e => {
    const r = e.target.value
    setRole(r)
    setForm(f => ({ ...f, role: r }))
    setCoords(null)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")

    // basic validation
    if (!form.name || !form.email || !form.password || !form.role) {
      return setError("Please fill in all required fields.")
    }
    if (!form.phone) {
      return setError("Please provide a phone number.")
    }
    // geo check
    if (!coords?.coordinates?.length === 2) {
      return setError("Please select your location on the map.")
    }

    // build payload per role
    const payload = { ...form }
    // everyone needs an 'address'
    payload.address = coords
    // delivery also needs a separate 'location'
    if (role === "delivery") {
      payload.location = coords
    }

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || ""
      const url     = `${baseURL}/api/auth/register`
      const res     = await axios.post(url, payload)

      if (res.status === 201) {
        alert("Registration successful — please log in.")
        navigate("/login")
      } else {
        setError("Unexpected response, please try again.")
      }
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed."
      )
    }
  }

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={role}
          onChange={handleRoleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="customer">Customer</option>
          <option value="delivery">Delivery Person</option>
          <option value="restaurant">Restaurant</option>
        </select>

        {role === "customer" && (
          <CustomerFields onLocationChange={setCoords} />
        )}
        {role === "delivery" && (
          <DeliveryPersonFields onLocationChange={setCoords} />
        )}
        {role === "restaurant" && (
          <RestaurantFields onLocationChange={setCoords} />
        )}

        <button type="submit" className="register-button">
          Register
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <button
          className="register-redirect-btn"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </p>
    </div>
  )
}

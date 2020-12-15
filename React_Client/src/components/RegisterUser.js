import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import UserService from "../services/user.service";
import CharacterDropDown from "./HooksDropDown";
import PasswordShowHide from "./PasswordShowHide";

const RegisterUser = () => {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    securityKeyword: "",
    fileUpload: "",
  };
  const formErrors = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cityId: "",
    dateOfBirth: "",
    fileUpload: "",
  };
  const [userData, setUserData] = useState(initialState);
  const [errors, setErrors] = useState(formErrors);
  const [locality, setLocality] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
    switch (name) {
      case "firstName":
        errors.firstName =
          value.length < 2
            ? "First name must be at least 2 characters long!"
            : validName.test(value)
            ? ""
            : "Name is not valid";
        break;
      case "lastName":
        errors.lastName =
          value.length < 2
            ? "Last name must be at least 2 characters long!"
            : validName.test(value)
            ? ""
            : "Name is not valid";
        break;
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        break;
      case "password":
        errors.password = validPassword.test(value)
          ? ""
          : "Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character:";
        break;
      case "confirmPassword":
        const pass1 = userData.password;
        const pass2 = userData.confirmPassword;
        errors.confirmPassword = pass1.match(pass2)
          ? ""
          : "Password do not match!";
        break;
      case "dateOfBirth":
        const permittedAge = 21;
        const totalDaysToAge = permittedAge * 365;
        errors.dateOfBirth =
          validDate(value) > totalDaysToAge
            ? ""
            : "Date of birth is not valid!";
        break;
      case "fileUpload":
        errors.fileUpload = validFileExtension.test(value)
          ? ""
          : "Invalid file type";
        break;
      default:
        break;
    }
    setErrors(errors);
  };
  const handleSubmit = (event) => {
    console.log(userData);
    console.log("C_ID: " + locality);
    event.preventDefault();
    // let formdData = new FormData();
    // formData.append("fname", "firstName");
    let data = {
      fname: userData.firstName,
      lname: userData.lastName,
      email: userData.email,
      password: userData.password,
      dob: userData.dateOfBirth,
      c_id: locality,
      certificates: userData.fileUpload,
      mothername: userData.securityKeyword,
    };
    if (validateForm(errors)) {
      UserService.createUser(data)
        .then(() => {
          console.info("Valid Form", userData.firstName);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.error("Invalid Form");
    }
  };

  return (
    <div className="signUpForm">
      <Form onSubmit={handleSubmit}>
        <h1>Create an account</h1>
        <h6>
          Already a member? <a href="./success.html"> Login here.</a>
        </h6>
        <Form.Group>
          <Form.Label>First name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
            required
            autoFocus
          />
          {errors.firstName.length > 0 && (
            <span className="error">{errors.firstName}</span>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Last name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName.length > 0 && (
            <span className="error">{errors.lastName}</span>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
          {errors.email.length > 0 && (
            <span className="error">{errors.email}</span>
          )}
        </Form.Group>
        <Form.Group>
          <PasswordShowHide onChange={handleChange} />
          {errors.password !== null && (
            <span className="error">{errors.password}</span>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="dateOfBirth"
            value={userData.dateOfBirth}
            onChange={handleChange}
            required
          />
          <small>Age must be 21 years and above.</small>
          {errors.dateOfBirth.length > 0 && (
            <p className="error">{errors.dateOfBirth}</p>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Select Locality</Form.Label>
          <CharacterDropDown getValue={(value) => setLocality(value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Upload certificate</Form.Label>
          <Form.Control
            type="file"
            name="fileUpload"
            value={userData.fileUpload}
            onChange={handleChange}
            required
          />
          <small>Upload certificate in PDF format only.</small>
          {errors.fileUpload.length > 0 && (
            <p className="error">{errors.fileUpload}</p>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Mother's Name</Form.Label>
          <Form.Control
            type="text"
            name="securityKeyword"
            value={userData.securityKeyword}
            onChange={handleChange}
            required
          />
          <small>We are collecting mother's name for security purpose.</small>
        </Form.Group>
        <Button
          as="input"
          type="submit"
          value="Create account"
          variant="success"
          block
        />
        <small>
          <p>
            By clicking Create account, I agree that:I have read and accepted
            the Terms of Use.
          </p>
        </small>
      </Form>
    </div>
  );
};
const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validName = RegExp(/^[a-z,.'-]+$/i);

const validPassword = RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/
);

//allows only pdf type file
const validFileExtension = RegExp(/^.*\.(pdf|PDF)$/);

const validDate = (date) => {
  const newDate = new Date();
  const userDate = new Date(date);
  // To calculate the time difference of two dates
  const Difference_In_Time = newDate.getTime() - userDate.getTime();
  // To calculate the no. of days between two dates
  const Difference_In_Days = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));
  // return Difference_In_Days >= totalDaysToAge ? true : false;
  return Difference_In_Days;
};

const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    // if we have an error string set valid to false
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
};

export default RegisterUser;
import React, { Component } from 'react';
import SearchBar from "../SearchBar";
import API from "../../pages/API";

class EmployeesContainer extends Component {

    state = {
        search: "",
        employees: [],
        filteredEmployees: [],
        sortAscending: true,
    };

    componentDidMount() {
        API.getEmployees()
        .then((res) => this.setState({
            employees: res.data.results, 
            filteredEmployees: res.data.results,
        }))
        .catch((err) => console.log(err));
    }

    handleInputChange = (event) => {
        const value = event.target.value;
        this.setState({ search: value });
        this.filterEmployees(value.toLowerCase().trim());
    };

    handleFormSubmit = (event) => {
        event.preventDefault();
    };

    

    render() {
        return (
        <>
            <SearchBar />
            <div className="container">
                <table className="table table-striped text-center mt-5">
                    <thead>
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col">Nane</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Email</th>
                            <th scope="col">Date of Birth</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.employees.map((employee) => {
                            const { first, last } = employee.name;
                            const fullName = `${first} ${last}`;
                            const date = new Date(employee.dob.date);
                            let dob = [];

                            dob.push(("0" + (date.getMonth() + 1)).slice(-2));
                            dob.push(("0" + date.getDate()).slice(-2));
                            dob.push(date.getFullYear());
                            dob = dob.join("-");

                            return (
                                <tr key={employee.login.uuid}>
                                    <th scope="row">
                                        <img src={employee.picture.thumbnail} alt={fullName} />
                                    </th>
                                    <td>{fullName}</td>
                                    <td>{employee.cell}</td>
                                    <td>{employee.email}</td>
                                    <td>{dob}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
        );
    }
}

export default EmployeesContainer;
import React, { Component } from 'react';
import SearchBar from "../SearchBar";
import API from "../../pages/API";

class EmployeesContainer extends Component {

    state = {
        search: "",
        employees: [],
        filteredEmployees: [],
        sortDirections: this.initialSortDirections,
    };

    get initialSortDirections() {
        return {
            name: "",
            phone: "",
            email: "",
            dob: "",
        };
    }

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

    sortBy = (key, primary = 0, secondary = 0) => {
        let sortedEmployees = this.state.filteredEmployees;
        if (this.state.sortDirections[key]) {
            this.setState({
                filteredEmployees: sortedEmployees.reverse(),
                sortDirections: {
                    ...this.initialSortDirections,
                    [key]: this.state.sortDirections[key] === "asc" ? "desc" : "asc",
                },
            });
        } else {
            sortedEmployees = this.state.filteredEmployees.sort((a, b) => {
                a = a[key];
                b = b[key];

                if (primary) {
                    if (secondary && a[primary] === b[primary]) {
                        return a[secondary].localeCompare(b[secondary]);
                    }
                    return a[primary].localeCompare(b[primary]);
                } else {
                    return a.localeCompare(b);
                }
            });
        }

        this.setState({
            filteredEmployees: sortedEmployees,
            sortDirections: {
                ...this.initialSortDirections,
                [key]: "asc",
            },
        });
    };

    filterEmployees = (input) => {
        if (input) {
            this.setState({
                filteredEmployees: this.state.employees.filter((employee) => {
                    return (
                        employee.name.first.toLowerCase().includes(input) || 
                        employee.name.last.toLowerCase().includes(input) || 
                        employee.phone.includes(input) || 
                        employee.email.includes(input) ||
                        this.formatDate(employee.dob.date).includes(input)
                    );
                }),
            });
        } else {
            this.setState({ filteredEmployees: this.state.employees });
        }
    };

    formatDate(date) {
        date = new Date(date);
        let dob = [];
        dob.push(("0" +(date.getMonth() + 1)).slice(-2));
        dob.push(("0" + date.getDate()).slice(-2));
        dob.push(date.getFullYear());

        return dob.join("-");
    }

    render() {
        return (
        <>
            <SearchBar 
                value={this.state.search}
                handleInputChange={this.handleInputChange}
                handleFormSubmit={this.handleFormSubmit}
            />
            <div className="container">
                <table className="table table-striped table-sortable text-center mt-5">
                    <thead>
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col" data-field="name" data-sortable="true">
                                <span onClick={() => this.sortBy("name", "last", "first")}>Name</span>
                            </th>
                            <th scope="col">
                                <span onClick={() => this.sortBy("phone")}>Phone</span>
                            </th>
                            <th scope="col">
                                <span onClick={() => this.sortBy("email")}>Email</span>
                            </th>
                            <th scope="col">
                                <span onClick={() => this.sortBy("dob", "date")}>Date of Birth</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filteredEmployees.map((employee) => {
                            const { first, last } = employee.name;
                            const fullName = `${first} ${last}`;

                            const dob = this.formatDate(employee.dob.date);

                            return (
                                <tr key={employee.login.uuid}>
                                    <th scope="row">
                                        <img src={employee.picture.thumbnail} alt={fullName} />
                                    </th>
                                    <td>{fullName}</td>
                                    <td>{employee.phone}</td>
                                    <td>
                                        <a href={`mailto:${employee.email}`}>{employee.email}</a>
                                    </td>
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
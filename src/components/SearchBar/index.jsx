import React from 'react';

const SearchBar = (props) => {
    return (
        <nav className="navbar navbar-light bg-light justify-content-center">
            <form className="form-inline m-2">
                <input 
                    onChange={props.handleInputChange}
                    className="form-control"
                    value={props.value}
                    name="search"
                    type="search"
                    placeholder="Search"
                    id="search"
                />
            </form>
        </nav>
    );
};

export default SearchBar;
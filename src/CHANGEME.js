import React, { Component } from 'react';
import RemineTable from './components/Table/RemineTable/RemineTable';
import api from './API';

const ApplyFilter = ({ onApply }) => (
    <div className="apply-filters">
        <button type="button" onClick={onApply}>Apply</button>
    </div>
);

const BedBathDropdown = ({
    toggleDropdown,
    countArr,
    shouldShow,
    setBedBathFilter,
    applyFilters,
    filter
}) => {
    let fromInput;
    let toInput;

    const getVals = () => ({
        fromVal: parseInt(fromInput.value, 10),
        toVal: parseInt(toInput.value, 10)
    });

    const fromUp = () => {
        const { fromVal, toVal } = getVals();
        if (fromVal < toVal) fromInput.value = fromVal + 1;
    };

    const fromDown = () => {
        const { fromVal } = getVals();
        if (fromVal) fromInput.value = fromVal - 1;
    };

    const toUp = () => {
        const { toVal } = getVals();
        toInput.value = toVal + 1;
    };

    const toDown = () => {
        const { fromVal, toVal } = getVals();
        if (toVal > fromVal) toInput.value = toVal - 1;
    };

    return shouldShow ? (
        <div className="location-filter-dropdown">
            <div className="location-filter-wrapper">
                <div className="bed-bath-filter">
                    <button
                        type="button"
                        className="adjust-quantity-button"
                        onClick={fromUp}
                    >
                        +
                    </button>
                    <div className="bed-bath-number">
                        <input
                            type="number"
                            defaultValue={filter[0]}
                            ref={(el) => { fromInput = el; }}
                        />
                    </div>
                    <button
                        type="button"
                        className="adjust-quantity-button"
                        onClick={fromDown}
                    >
                        -
                    </button>
                </div>
                <div className="bed-bath-filter">
                    <button
                        type="button"
                        className="adjust-quantity-button"
                        onClick={toUp}
                    >
                    	+
                    </button>
                    <div className="bed-bath-number">
                        <input
                            type="number"
                            defaultValue={isFinite(filter[1]) ? filter[1] : 4}
                            ref={(el) => { toInput = el; }}
                        />
                    </div>
                    <button
                        type="button"
                        className="adjust-quantity-button"
                        onClick={toDown}
                    >
                        -
                    </button>
                </div>
            </div>
            <ApplyFilter
                onApply={() => setBedBathFilter(
                    parseInt(fromInput.value, 10),
                    parseInt(toInput.value, 10),
                    () => { toggleDropdown(); applyFilters(); }
                )}
            />
        </div>
    ) : null;
};

const BuildingTypeDropdown = ({
    shouldShow,
    buildingTypes,
    applyFilters,
    types,
    onCheckboxChange,
    isChecked,
    setBuildingTypeFilter,
    selectedTypes,
    toggleDropdown,
    filter
}) => (
    shouldShow && buildingTypes.length ? (
        <div className="location-filter-dropdown">
            <div className="building-type-items">
                {buildingTypes.map(({ id, name }) => (
                    <div key={Math.random().toString()} className="building-type-item">
                        <input
                            type="checkbox"
                            id={`${id}-${name}`}
                            name={name}
                            checked={isChecked(name)}
                            onChange={onCheckboxChange(name)}
                        />
                        <label htmlFor={`${id}-${name}`}>{name}</label>
                    </div>
                ))}
            </div>
            <ApplyFilter
                onApply={() => setBuildingTypeFilter(
                    selectedTypes,
                    () => { toggleDropdown(); applyFilters(); }
                )}
            />
        </div>
    ) : null
);

class BuildingTypeDropdownContainer extends Component {
    state = {};

    componentDidMount() {
        this.setState(this.props.buildingTypes.reduce((types, { name }) => {
            types[name] = true;
            return types;
        }, {}));
        this.props.setBuildingTypeFilter(this.props.buildingTypes.map(({ name}) => name));
    }

    onCheckboxChange = name => () => this.setState({ [name]: !this.state[name] })

    isChecked = name => Boolean(this.state[name])

    render()  {
        const { buildingTypes } = this.props;
        const { onCheckboxChange, isChecked } = this;

        const types = buildingTypes.map(({ name }) => name);

        return (
            <BuildingTypeDropdown
                {...this.props}
                types={types}
                onCheckboxChange={onCheckboxChange}
                isChecked={isChecked}
                selectedTypes={Object.keys(this.state).filter(key => Boolean(this.state[key]))}
            />
        );
    }
}

const Test = ({
    toggleDropdown,
    setBedBathFilter,
    setBuildingTypeFilter,
    bedsDropdown,
    bathsDropdown,
    buildingTypeDropdown,
    buildingTypes,
    locations,
    applyFilters,
    filters
}) => (
    <div className="testContainer">
        <div className="filterContainer">
            <div className="location-filter-container">
                <button
                    type="button"
                    className={`location-filter${bedsDropdown ? ' active' : ''}`}
                    onClick={toggleDropdown('beds')}
                >
                    <span>{bedsDropdown ? 'Show locations with beds between' : 'Beds'}</span>
                </button>
                <BedBathDropdown
                    shouldShow={bedsDropdown}
                    setBedBathFilter={setBedBathFilter('beds')}
                    applyFilters={applyFilters}
                    toggleDropdown={toggleDropdown('beds')}
                    filter={filters.beds}
                />
            </div>
            <div className="location-filter-container">
                <button
                    type="button"
                    className={`location-filter${bathsDropdown ? ' active' : ''}`}
                    onClick={toggleDropdown('baths')}
                >
                    <span>{bathsDropdown ? 'Show locations with baths between' : 'Baths'}</span>
                </button>
                <BedBathDropdown
                    shouldShow={bathsDropdown}
                    setBedBathFilter={setBedBathFilter('baths')}
                    applyFilters={applyFilters}
                    toggleDropdown={toggleDropdown('baths')}
                    filter={filters.baths}
                />
            </div>
            
            <div className="location-filter-container">
                <button
                    type="button"
                    className={`location-filter${buildingTypeDropdown ? ' active' : ''}`}
                    onClick={toggleDropdown('buildingType')}
                >
                    <span>{buildingTypeDropdown ? 'Show the following buiding types' : 'Building types'}</span>
                </button>
                {buildingTypes.length ? (
                    <BuildingTypeDropdownContainer
                        shouldShow={buildingTypeDropdown}
                        buildingTypes={buildingTypes}
                        applyFilters={applyFilters}
                        setBuildingTypeFilter={setBuildingTypeFilter}
                        toggleDropdown={toggleDropdown('buildingType')}
                    />
                ) : null}
            </div>
        </div>
        <RemineTable properties={locations} />
    </div>
);

class TestContainer extends Component {
    state = {
        locations: [],
        buildingTypes: [],
        filters: {
            beds: [0, Infinity],
            baths: [0, Infinity],
            buildingTypes: []
        }
    }

    componentDidMount() {
        api.getLocations()
            .then(({ data }) => this.setState({
                ...this.state,
                locations: data,
                filteredLocations: data
            }))
            .then(() => api.getBuildingTypes())
            .then(({ data }) => this.setState({
                ...this.state,
                buildingTypes: data,
                filters: { ...this.state.filters, buildingTypes: data.map(({ name }) => name) }
            }));
    }

    setBedBathFilter = key => (from, to, cb) => this.setState({
        filters: { ...this.state.filters, [key]: [from, to] }
    }, () => cb && cb()) 

    setBuildingTypeFilter = (buildingTypes = [], cb) => this.setState({
        filters: { ...this.state.filters, buildingTypes }
    }, () => cb && cb())
   
    toggleDropdown = filterName => () => this.setState({
        [`${filterName}Dropdown`]: !this.state[`${filterName}Dropdown`]
    })

    applyFilters = () => {
        const { locations, filters } = this.state;
        this.setState({
            filteredLocations: locations
                .filter(({ beds }) =>  beds >= filters.beds[0] && beds <= filters.beds[1])
                .filter(({ baths }) => baths >= filters.baths[0] && baths <= filters.baths[1])
                .filter(({ buildingType }) => filters.buildingTypes.includes(buildingType))
        });
    }

    render() {
        return (
            <Test
                toggleDropdown={this.toggleDropdown}
                setBedBathFilter={this.setBedBathFilter}
                setBuildingTypeFilter={this.setBuildingTypeFilter}
                buildingTypeDropdown={this.state.buildingTypeDropdown}
                buildingTypes={this.state.buildingTypes}
                locations={this.state.filteredLocations}
                bedsDropdown={this.state.bedsDropdown}
                bathsDropdown={this.state.bathsDropdown}
                applyFilters={this.applyFilters}
                filters={this.state.filters}
            />
        );
    }

}

export default TestContainer;

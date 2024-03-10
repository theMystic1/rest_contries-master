import { useEffect, useState } from "react";

export const region = [
  {
    name: "Africa",
  },
  {
    name: "America",
  },
  {
    name: "Asia",
  },
  {
    name: "Europe",
  },
  {
    name: "Oceania",
  },
];

export function Filter(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [query, setQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    // Cleanup function for debounced typing
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  function handleFocus() {
    setIsFocus(true);
  }

  function handleBlur() {
    setIsFocus(false);
    setQuery("");
  }

  function handleOpenWindow(e) {
    e.preventDefault();
    setIsOpen((isOpen) => !isOpen);
  }

  function handleSearchInputChange(e) {
    const value = e.target.value;
    setQuery(value);

    // Debounce typing to limit API calls
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        if (value.length >= 3) {
          handleSearch();
        } else {
          props.setCountries(props.countriesDatas.current);
          props.setError(false);
        }
      }, 300)
    ); // Adjust debounce time as needed (in milliseconds)
  }

  async function handleSearch() {
    try {
      props.setIsLoading(true);
      const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);

      if (!res.ok) {
        if (res.status === 404) {
          props.setErrorMsg("❌ Country not found");
          props.setError(true);
          return;
        }
        props.setErrorMsg("❌ Country does not exist");
        props.setError(true);
        throw Error;
      }
      const data = await res.json();
      if (data && data.length > 0) {
        const countryData = data.map((data) => ({
          name: data.name?.common,
          population: data.population,
          capital: data.capital,
          flag: data.flags.png,
          region: data.region,
        }));

        props.setCountries(countryData);
        props.setError(false);
      } else {
        props.setCountries([]);
        props.setError(true);
      }
    } catch (error) {
      props.setError(true);
    } finally {
      props.setIsLoading(false);
    }
  }

  function handleRegion(regname) {
    setIsOpen(false);
    props.onHandleRegion(regname);
  }

  return (
    <div className="search-filter">
      {!isFocus && (
        <span className="srch-icon">
          {!props.isDark ? (
            <img src="./search-lgt.svg" alt="search" />
          ) : (
            <img src="./search.svg" alt="search" />
          )}
        </span>
      )}
      <input
        type="text"
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search for a country..."
        value={query}
        onChange={handleSearchInputChange}
      />

      <button className="filter-btn" onClick={handleOpenWindow}>
        Filter by Region
        <span className="filimage">
          {props.isDark ? (
            <img src="./chevron-up.svg" alt="down arrow" />
          ) : (
            <img src="./chevron-down-lght.svg" alt="down arrow" />
          )}
        </span>
      </button>
      {isOpen && (
        <ul className="select-region">
          {region.map((reg, i) => (
            <li key={i} onClick={() => handleRegion(reg.name)}>
              {reg.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import "./App.css";
import "./index.css";
import { OpenCountry } from "./OpenCountry";
import { Countries } from "./Countries";
import { Filter } from "./Filter";
import { Nav } from "./Nav";
import { ErrorMessage } from "./error";
import { Loader } from "./loader";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [openCountryData, setOpenCountryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function handleDarkMode(e) {
    e.preventDefault();
    setIsDark((isd) => !isd);
  }

  useEffect(
    function () {
      const body = document.querySelector("body");

      isDark
        ? body.classList.add("dark-theme")
        : body.classList.remove("dark-theme");
    },
    [isDark]
  );

  const countriesDatas = useRef([]);

  useEffect(function () {
    const controller = new AbortController();

    async function getCountries() {
      try {
        setIsLoading(true);
        const res = await fetch(`https://restcountries.com/v3.1/all`, {
          signal: controller.signal,
        });
        // console.log(res);

        if (!res.ok) {
          if (res.status === 404) {
            setCountries([]);
            setError(true);
            setErrorMsg("❌ oops countries not found");
            // throw new Error("Failed to fetch countries data");

            return;
          }
        }

        const data = await res.json();
        // console.log(data);

        const countriesData = data.map((data) => ({
          name: data.name?.common,
          officialName: data.name?.official,
          population: data.population,
          capital: data.capital,
          flag: data.flags.png,
          region: data.region,
        }));

        setCountries(countriesData);
        countriesDatas.current = countriesData;
      } catch (error) {
        if (error.name !== "AbortError") setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    getCountries();

    return function () {
      controller.abort();
    };
  }, []); // Empty dependency array ensures that this effect runs only once on mount
  // console.log(countries);

  // open window

  // const openCountryData = useRef([]);

  async function getCounryDet(cname) {
    try {
      setIsLoading(true);
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${cname}?fullText=true`
      );

      // console.log(res);

      if (!res.ok) {
        if (res.status === 404) {
          setErrorMsg("❌ oops countries not found try another one....");
          setError(true);
        }
        setErrorMsg(
          "❌ oops countries details not found try another country...."
        );
        setError(true);
      }

      const data = await res.json();

      // console.log(data, Object.values(data[0].name)[2]);

      const openContD = data?.map((data) => ({
        name: data.name?.common,
        officialName: data.name?.official,
        population: data.population,
        flag: data.flags.png,
        region: data.region,
        subregion: data.subregion,
        borders: data.borders,
        nativeName: Object.values(data.name)[
          Object.values(data.name).length - 1
        ],
        tld: data.tld,
        currency: Object.keys(data.currencies)[0],
        languages: Object.values(data.languages).join(" , "),
        capital: data.capital,
      }));

      setOpenCountryData(openContD);
      // const mieti = openContD[0].nativeName;
    } catch (error) {
      // setError(true);
      // console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // console.log(openCountryData);

  // useEffect(function () {}, []);

  function handleClck(cname) {
    getCounryDet(cname);
    setIsOpened(true);
    // console.log(cname);
  }

  function handleClickBack(e) {
    e.preventDefault();
    setIsOpened(false);
    setCountries(countries);
    setOpenCountryData([]);
  }

  async function getRegions(region) {
    try {
      setIsLoading(true);
      const res = await fetch(
        `https://restcountries.com/v3.1/region/${region}`
      );

      const data = await res.json();

      const countryData = data.map(function (data) {
        return {
          name: data.name?.common,
          population: data.population,
          capital: data.capital,
          flag: data.flags.png,
          region: data.region,
        };
      });
      setCountries(countryData);
      setError(false);
    } catch (error) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleRegion(reg) {
    getRegions(reg);
  }

  return (
    <main className="main">
      <Nav isDark={isDark} onDarkMode={handleDarkMode} />

      {!isOpened && (
        <Filter
          isDark={isDark}
          setCountries={setCountries}
          countriesData={countries}
          countriesDatas={countriesDatas}
          setError={setError}
          setErrorMsg={setErrorMsg}
          setIsLoading={setIsLoading}
          onHandleRegion={handleRegion}
        />
      )}
      {!error
        ? !isOpened &&
          !isLoading && (
            <Countries
              countries={countries}
              onHandleClick={handleClck}
              setIsLoading={setIsLoading}
            />
          )
        : !isLoading && <ErrorMessage error={errorMsg} />}

      {!isLoading && isOpened && (
        <OpenCountry
          openData={openCountryData}
          onHandleBack={handleClickBack}
          setCountries={setCountries}
          setIsLoading={setIsLoading}
          setError={setError}
          setIsOpened={setIsOpened}
        />
      )}
      {isLoading && <Loader />}
    </main>
  );
}

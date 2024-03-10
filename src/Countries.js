import { CountriesList } from "./CountriesList";

export function Countries({ countries, onHandleClick }) {
  // console.log(countries);
  return (
    <section className="countries-container">
      {countries?.map((country, index) => (
        <CountriesList
          name={country.name}
          region={country.region}
          population={country.population}
          capital={country.capital}
          flag={country.flag}
          officialName={country.officialName}
          key={index}
          onHandleClick={onHandleClick}
        />
      ))}
    </section>
  );
}

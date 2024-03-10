export function CountriesList({
  name,
  population,
  capital,
  flag,
  region,
  officialName,
  onHandleClick,
}) {
  function addCommasToNumber(number) {
    let numberString = number.toString();

    let parts = numberString.split(".");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
  }

  return (
    <article className="country-detail" onClick={() => onHandleClick(name)}>
      <span className="cnt-img">
        <img src={flag} alt="flag" />
      </span>
      <div className="details">
        <p className="country-name">{name}</p>
        <div className="detail">
          <span className="info">Population:</span>
          <span className="info-det">{addCommasToNumber(population)}</span>
        </div>
        <div className="detail">
          <span className="info">Region:</span>
          <span className="info-det">{region}</span>
        </div>
        <div className="detail">
          <span className="info">Capital:</span>
          <span className="info-det">{capital}</span>
        </div>
      </div>
    </article>
  );
}

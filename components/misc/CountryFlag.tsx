import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import countries from "./countryData";

const CountrySelector = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("IN");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div className="flex text-black justify-center items-center">
      <ReactCountryFlag
        countryCode={selectedCountry}
        svg
        style={{ width: "24px", height: "26px" }}
      />

      <select
        value={selectedCountry}
        onChange={handleChange}
        className="h-8 w-20 px-1 text-sm bg-white focus:outline-none ml-5" // Add text-sm class
      >
        {countries.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector;

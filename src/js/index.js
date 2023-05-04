import './../css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const inputSearch = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");


inputSearch.addEventListener("input", debounce((e) => {
  fetchCountries(e.target.value.trim())
    .then((countries) => renderCountryList(countries))
    .catch((error) => console.log(error));
}, DEBOUNCE_DELAY));

function getLanguages(country){
   const arr = [];
   for (const key in country.languages) {
    arr.push(country.languages[key])
   }
   return arr.join(', ');
}

function renderCountryList(countries) {
  console.log(countries);
  if(countries.length === 1) {
    countryList.remove();
    const currentCountry = countries[0];
     const markup = `<div class="flag-country">
     <div><img src="${currentCountry.flags.svg}" class="img-flag"/></div>
     <div class="country-name">${currentCountry.name.official}</div>
     </div>
     <div class="country-data"><b>Capital</b>: ${currentCountry.capital[0]}</div>
     <div class="country-data"><b>Population</b>: ${currentCountry.population}</div>
     <div class="country-data"><b>Languages</b>: ${getLanguages(currentCountry)}</div>`;
      countryInfo.innerHTML = markup;
  } else {
    const markup = countries
    .map((country) => {
      return `<li class="data-list">
      <img src="${country.flags.svg}" class="img-flag"/>
      <p class="country-name p-class"><b>${country.name.official}</b></p>
      </li>`;
    })
    .join("");
    countryList.innerHTML = markup;
  }
}

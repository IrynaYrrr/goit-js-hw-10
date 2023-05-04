import './../css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inputSearch = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");


inputSearch.addEventListener("input", debounce((e) => {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';

  const inputValue = e.target.value.trim();
  if (inputValue.length === 0) {
    return
  }
  fetchCountries(inputValue)
    .then((countries) => renderCountryList(countries))
    .catch((error) => {
      console.log(error);
      Notify.failure('Oops, there is no country with that name',  {
        width: '300px',
        position: 'center-top',
        distance: '10px',
      });
    });
}, DEBOUNCE_DELAY));

function getLanguages(country) {
  const arr = [];
  for (const key in country.languages) {
    arr.push(country.languages[key])
  }
  return arr.join(', ');
}

function renderCountryList(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.',  {
      width: '300px',
      position: 'center-top',
      distance: '10px',
    });
    return
  } else if (countries.length === 1) {
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

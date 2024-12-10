const amount = document.getElementById("amount"),
  fromCountry = document.getElementById("fromCountry"),
  toCountry = document.getElementById("toCountry"),
  selectedSymbol = document.getElementById("selectedSymbol"),
  selectedFromImg = document.getElementById("selectedFromImg"),
  selectedToImg = document.getElementById("selectedToImg"),
  rotate = document.querySelector(".dropdown i"),
  output = document.querySelector(".output");

window.addEventListener("load", () => {
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((country) => {
        if (country?.currencies != null) {
          console.log(country);
          let currencyKey = Object.keys(country.currencies)[0];
          let option1 = document.createElement("option");
          let option2 = document.createElement("option");

          option1.value = currencyKey;
          option2.value = currencyKey;

          option1.text =
            currencyKey + " - " + country.currencies[currencyKey].name;
          option2.text =
            currencyKey + " - " + country.currencies[currencyKey].name;

          option1.setAttribute(
            "data-image",
            `https://flagcdn.com/w320/${currencyKey
              .substring(0, 2)
              .toLowerCase()}.png`
          );
          option2.setAttribute(
            "data-image",
            `https://flagcdn.com/w320/${currencyKey
              .substring(0, 2)
              .toLowerCase()}.png`
          );

          option1.setAttribute(
            "data-symbol",
            country.currencies[currencyKey].symbol
          );
          option2.setAttribute(
            "data-symbol",
            country.currencies[currencyKey].symbol
          );

          option1.setAttribute(
            "data-currency",
            country.currencies[currencyKey].name
          );
          option2.setAttribute(
            "data-currency",
            country.currencies[currencyKey].name
          );

          option1.setAttribute("data-name", country.name.common);
          option2.setAttribute("data-name", country.name.common);

          fromCountry.appendChild(option1);
          toCountry.appendChild(option2);
        }
      });
      sortOptions(fromCountry);
      sortOptions(toCountry);

      fromCountry.value = "USD";
      toCountry.value = "INR";

      setCurrencySymbol();

      setSelectedCountry(fromCountry, selectedFromImg);
      setSelectedCountry(toCountry, selectedToImg);

      rotate.addEventListener("click", rotateCurrency());

      convertCurrency();
    });
});

function sortOptions(Id) {
  let options = Id.options;
  let optionArray = [];

  for (let i = 0; i < options.length; i++) {
    optionArray.push(options[i]);
  }
  optionArray = optionArray.reduce((arr, item) => {
    const removed = arr.filter((i) => i.innerText !== item.innerText);
    return [...removed, item];
  }, []);

  console.log(optionArray);

  optionArray = optionArray.sort(function (a, b) {
    return a
      .getAttribute("data-name")
      .localeCompare(b.getAttribute("data-name"));
  });
  for (let i = 0; i < options.length; i++) {
    options[i] = optionArray[i];
  }
}

function setCurrencySymbol() {
  let selectedCrSymbol =
    fromCountry.options[fromCountry.selectedIndex].getAttribute("data-symbol");
  selectedSymbol.innerHTML = selectedCrSymbol;
}

function setSelectedCountry(option, Id) {
  let selectedCrImg =
    option.options[option.selectedIndex].getAttribute("data-image");
  Id.setAttribute("src", selectedCrImg);
}

function rotateCurrency() {
  rotate.classList.toggle("rotate");

  let fromCT = fromCountry.value;
  let toCT = toCountry.value;

  fromCountry.value = toCT;
  toCountry.value = fromCT;

  setCurrencySymbol();

  setSelectedCountry(fromCountry, selectedFromImg);
  setSelectedCountry(toCountry, selectedToImg);
}

function convertCurrency() {
  fetch(
    "https://v6.exchangerate-api.com/v6/f36857f5b566fbd6ba7aa3ac/latest/" +
      fromCountry.value
  )
    .then((response) => response.json())
    .then((data1) => {
      fetch(
        "https://v6.exchangerate-api.com/v6/f36857f5b566fbd6ba7aa3ac/latest/" +
          toCountry.value
      )
        .then((response) => response.json())
        .then((data2) => {
          let exchangeRateFrom = data2.conversion_rates[fromCountry.value];
          let totalExchangeRateFrom = (
            amount.value * exchangeRateFrom
          ).toLocaleString();

          let exchangeRateTo = data1.conversion_rates[toCountry.value];
          let totalExchangeRateTo = (
            amount.value * exchangeRateTo
          ).toLocaleString();

          let selectedFromCountry =
            fromCountry.options[fromCountry.selectedIndex].getAttribute(
              "data-currency"
            );

          let selectedToCountry =
            toCountry.options[toCountry.selectedIndex].getAttribute(
              "data-currency"
            );

          let lastUpdate =
            "Last updated: " + data1.time_last_update_utc.split("00:00:01")[0];
          let nextUpdate =
            "Next update on: " +
            data1.time_next_update_utc.split("00:00:01")[0];

          let stringBuilder = "";
          stringBuilder += `<p>${amount.value} ${selectedFromCountry}</p>`;
          stringBuilder += `<p>${totalExchangeRateTo} ${selectedToCountry}</p>`;
          stringBuilder += `<p>${amount.value} ${toCountry.value} = ${totalExchangeRateFrom} ${fromCountry.value}</p>`;

          stringBuilder += `<p><span>${lastUpdate} <br> ${nextUpdate}</p>`;

          output.innerHTML = stringBuilder;
        });
    });
}

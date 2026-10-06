const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const button = document.querySelector("form button");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

button.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector(".amount input");
    let amtValue = amount.value;

    if (amtValue === "" || amtValue < 1) {
        amtValue = 1;
        amount.value = "1";
    }

    let fromCurrency = document.querySelector(".from select").value;
    let toCurrency = document.querySelector(".to select").value;

    const URL = `${BASE_URL}/${fromCurrency.toLowerCase()}.json`;

    try {
        let response = await fetch(URL);
        let data = await response.json();

        let exchangeRate =
            data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];

        let finalAmount = amtValue * exchangeRate;

        msg.innerText =
            `${amtValue} ${fromCurrency} = ${finalAmount.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        console.log("Error:", error);
        msg.innerText = "Something went wrong. Please try again.";
    }
});
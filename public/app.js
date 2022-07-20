import { toggleDisplayTextBackground } from "./changeBackground.js";
import { prepareData, displayContent } from "./prepareDataForChartAndTable.js";
import { displayLoading, hideLoading, disableButton } from "./utilityFuntions.js";

const fetchData = async (
  url,
  loaderContainer,
  errorContainerElement,
  errorMessage
) => {
  displayLoading(loaderContainer);
  return fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(`Http error: ${res.status}`);
      }
    })
    .then((res) => {
      hideLoading(loaderContainer);
      const data = res.results;
      return data;
    })
    .catch((error) => {
      console.error(error);
      errorContainerElement.innerHTML = errorMessage;
    });
};

document.querySelector(".btn-display").addEventListener("click", (event) => {
  const url = "https://randomuser.me/api/?results=1000&nat=fr&gender=male";
  const loaderContainer = document.querySelector(".loader-container");
  const errorContainerElement = document.querySelector(".placeholder");
  const errorMessage =
    "The data could not be loaded. Check internet connection.";

  fetchData(url, loaderContainer, errorContainerElement, errorMessage)
    .then((rawData) => prepareData(rawData))
    .then((preparedData) => displayContent(preparedData));

  disableButton(event.target);
});

const textElement = document.querySelector("#text-2");
toggleDisplayTextBackground(textElement);

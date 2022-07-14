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

const displayLoading = (loaderContainer) => {
  loaderContainer.style.display = "block";
};

const hideLoading = (loaderContainer) => {
  loaderContainer.style.display = "none";
};

const displayChart = (x_labels, y_labels, chartContainer) => {
  new Chart(chartContainer, {
    type: "bar",
    data: {
      labels: x_labels,
      datasets: [
        {
          label: "Number of people in a given age range",
          data: y_labels,
          backgroundColor: ["rgba(255, 159, 64, 0.2)"],
          borderColor: ["rgba(255, 159, 64, 1)"],
          borderWidth: 1,
          categoryPercentage: 1,
          barPercentage: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

const displayTable = (gridOptions, gridContainer) => {
  new agGrid.Grid(gridContainer, gridOptions);
};

const frequencies = (values, binsize) => {
  const mapped = values.map((val) => {
    return Math.ceil(val / binsize) - 1;
  });
  return mapped.reduce(function (freqs, val) {
    const bin = binsize * val;
    freqs[bin] ? freqs[bin]++ : (freqs[bin] = 1);
    return freqs;
  }, {});
};

// add background every fifth refresh
const toggleDisplayTextBackground = (textElement) => {
  const refreshCount = Number(localStorage.getItem("refresh"));
  if (refreshCount) {
    if (refreshCount % 5 == 0) {
      textElement.classList.add("bg");
    } else {
      textElement.classList.remove("bg");
    }
    localStorage.setItem("refresh", refreshCount + 1);
  } else {
    localStorage.setItem("refresh", 1);
  }
};

const prepareUserDataForChart = (data) => {
  const chartContainer = document.getElementById("myChart");
  const y = data.map((person) => person.dob.age);
  const y_frequencies = frequencies(y, 10);
  const x_labels = Object.keys(y_frequencies);
  const y_labels = Object.values(y_frequencies);
  return { x_labels, y_labels, chartContainer };
};

const prepareUserDataForTable = (data) => {
  const gridContainer = document.querySelector("#myGrid");
  const columnDefs = [
    { field: "name" },
    { field: "gender", width: 150 },
    { field: "country", width: 150 },
    { field: "age", width: 100 },
    { field: "email", width: 300 },
  ];

  const oldest = data
    .sort((personA, personB) => personB.dob.age - personA.dob.age)
    .slice(0, 10);

  // specify the data
  const rowData = oldest.map((person) => {
    return {
      name: `${person.name.first} ${person.name.last}`,
      gender: person.gender,
      country: person.location.country,
      age: person.dob.age,
      email: person.email,
    };
  });

  // let the grid know which columns and what data to use
  const gridOptions = {
    defaultColDef: {
      resizable: true,
    },
    columnDefs: columnDefs,
    rowData: rowData,
  };

  return { gridOptions, gridContainer };
};

const prepareData = (data) => {
  const userDataForChart = prepareUserDataForChart(data);
  const userDataForTable = prepareUserDataForTable(data);

  return { userDataForChart, userDataForTable };
};

const displayContent = ({ userDataForChart, userDataForTable }) => {
  const { x_labels, y_labels, chartContainer } = userDataForChart;
  displayChart(x_labels, y_labels, chartContainer);
  const { gridOptions, gridContainer } = userDataForTable;
  displayTable(gridOptions, gridContainer);
};

const disableButton = (element) => {
  element.setAttribute("disabled", "disabled");
};

document.querySelector(".btn-display").addEventListener("click", (event) => {
  const url = "https://randomuser.me/api/?results=1000&nat=fr&gender=male"
  const loaderContainer = document.querySelector(".loader-container");
  const errorContainerElement = document.querySelector(".placeholder");
  const errorMessage =
    "The data could not be loaded. Check internet connection.";

  fetchData(url, loaderContainer, errorContainerElement, errorMessage)
    .then((rawData) => prepareData(rawData))
    .then((preparedData) => displayContent(preparedData));

  disableButton(event.target);
});

const textElement = document.querySelector("#text2");
toggleDisplayTextBackground(textElement);

import { frequencies } from "./utilityFuntions.js";

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

const prepareUserDataForChart = (data) => {
  const chartContainer = document.getElementById("my-chart");
  const y = data.map((person) => person.dob.age);
  const y_frequencies = frequencies(y, 10);
  const x_labels = Object.keys(y_frequencies);
  const y_labels = Object.values(y_frequencies);
  return { x_labels, y_labels, chartContainer };
};

const prepareUserDataForTable = (data) => {
  const gridContainer = document.querySelector("#my-grid");
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

export {
  prepareData,
  displayContent
};

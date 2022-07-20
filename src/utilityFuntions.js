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

const displayLoading = (loaderContainer) => {
  loaderContainer.style.display = "block";
};

const hideLoading = (loaderContainer) => {
  loaderContainer.style.display = "none";
};

const disableButton = (element) => {
  element.setAttribute("disabled", "disabled");
};

export {
  frequencies, displayLoading, hideLoading, disableButton
}

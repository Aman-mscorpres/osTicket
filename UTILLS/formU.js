function inputTypesList() {
  return [
    {
      type: "text",
      label: "Text",
    },
    {
      type: "textarea",
      label: "Textarea",
    },
    {
      type: "number",
      label: "Number",
    },
    {
      type: "date",
      label: "Date",
    },
    {
      type: "time",
      label: "Time",
    },
    {
      type: "datetime",
      label: "Datetime",
    },
    {
      type: "checkbox",
      label: "Checkbox",
      options: [
        {
          text: "",
          value: "",
        },
      ],
    },
    {
      type: "radio",
      label: "Radio",
      options: [
        {
          text: "",
          value: "",
        },
      ],
    },
    {
      type: "select",
      label: "Select",
      options: [
        {
          text: "",
          value: "",
        },
      ],
    },
  ];
}

function checkSelectHasOptions(options) {
  return options && options.length > 0;
}

function checkCheckboxHasOptions(options) {
  return options && options.length > 0;
}

function checkRadioHasOptions(options) {
  return options && options.length > 0;
}

module.exports = { checkSelectHasOptions, checkCheckboxHasOptions, checkRadioHasOptions, inputTypesList };

import './App.css';
// Calcite Components setup
import { defineCustomElements } from '@esri/calcite-components/dist/loader';
import { setAssetPath } from '@esri/calcite-components/dist/components';
import '@esri/calcite-components/dist/calcite/calcite.css';
import { CalciteList, CalciteListItem, CalciteActionBar, CalciteAction, CalciteSelect, CalciteOption, CalciteLink, CalciteInputDatePicker, CalciteInputTimePicker, CalciteTableRow, CalciteTable, CalciteTableHeader, CalciteTableCell } from '@esri/calcite-components-react';
import React, { useState, useEffect } from 'react';

setAssetPath(window.location.href);
defineCustomElements(window);

function App() {
  const intlDateTimeFormatOptions = [
    {
      name: "weekday",
      values: ["narrow", "short", "long"],
    },
    {
      name: "era",
      values: ["narrow", "short", "long"],
    },
    {
      name: "year",
      values: ["2-digit", "numeric"],
    },
    {
      name: "month",
      values: ["2-digit", "numeric", "narrow", "short", "long"],
    },
    {
      name: "day",
      values: ["2-digit", "numeric"],
    },
    {
      name: "dayPeriod",
      values: ["narrow", "short", "long"],
    },
    {
      name: "hour",
      values: ["2-digit", "numeric"],
    },
    {
      name: "minute",
      values: ["2-digit", "numeric"],
    },
    {
      name: "second",
      values: ["2-digit", "numeric"],
    },
    {
      name: "fractionalSecondDigits",
      values: ["1", "2", "3"],
    },
    {
      name: "timeZoneName",
      values: ["short", "long"],
    },
  ];
  
  useEffect(() => {
    const defaultFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit"
    };
    const params = new URLSearchParams(window.location.search);
    if (!window.location.search) {
      setSelectedFormatOptions(defaultFormatOptions);
      return;
    }
    const newFormatOptions = {};
    params.forEach((value, key) => {
      newFormatOptions[key] = value === "undefined" ? undefined : value;
    });
    setSelectedFormatOptions(newFormatOptions);
  }, []);


  const [selectedDate, setSelectedDate] = useState(new Date());
  const language = navigator.language;
  const selectedTime = new Intl.DateTimeFormat(language, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).format(selectedDate).split(" ")[0];


  const handleDateChange = (event) => {
    const [year, month, day] = event.target.value.split("-");
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    newDate.setMonth(month - 1);
    newDate.setDate(day);
    setSelectedDate(newDate);
    logSelectedDate();
  };
  const handleTimeChange = (event) => {
    const time = event.target.value;
    const [hours, minutes, seconds] = time.split(":");
    const newDate = new Date(selectedDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(seconds);
    setSelectedDate(newDate);
    logSelectedDate();
  }

  const logSelectedDate = () => {
    console.log(selectedDate);
  };
  // end top section

  // start bottom section
  
  const [selectedFormatOptions, setSelectedFormatOptions] = useState({});

  const handleFormatSelectChange = (option, newValue) => {
    let newFormatOptions = { ...selectedFormatOptions };
    console.log(option, newValue);
    if (newValue === "undefined") {
      delete newFormatOptions[option];
    } else {
      newFormatOptions[option] = newValue;
    }
    
    setSelectedFormatOptions(newFormatOptions);
    logSelectedFormatOptions();
  }

  const logSelectedFormatOptions = () => {
    console.log(selectedFormatOptions);
  };


  const queryString = new URLSearchParams(selectedFormatOptions).toString();
  const baseUrl = "https://date-time-format-sandbox.vercel.app/";
  const fullUrl = `${baseUrl}?${queryString}`;
  const handleCopyOptions = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedFormatOptions, null, 2));
  }
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
  }

  const formattedDate = Intl.DateTimeFormat(language, selectedFormatOptions).format(selectedDate)

  return (
    <div className="App" style={{margin: "auto", width: "80%"}}>
      <h1><code>Intl.DateTimeFormat</code> Sandbox</h1>
      <p>Selected values will be affect the formating of the selected date and time above! Also, any changes you make to the selected values in the table below, will generate a easy-to-copy code-snippet below.</p>
      <p>View <CalciteLink href="https://tc39.es/ecma402/#table-datetimeformat-components" target="_blank" iconEnd="launch">ECMAScript API</CalciteLink> or <CalciteLink href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat" target="_blank" iconEnd="launch">MDN Web Docs</CalciteLink> for the most recent information.</p>

      {/* TODO: make this chunk a component? */}
      <div style={{display: "flex", gap: "1rem"}}>
        <div style={{width: "14rem"}}>
          <h3>Select the date and time</h3>
          <CalciteInputDatePicker 
            value={selectedDate}
            onCalciteInputDatePickerChange={handleDateChange}/>
          <CalciteInputTimePicker
            step="1"
            value={selectedTime}
            onCalciteInputTimePickerChange={handleTimeChange}/>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          fontSize: "1.5rem",
        }}>
          <p>{formattedDate}</p>
        </div>
      </div>

      <br/>

      <h3><code>Intl.DateTimeFormat</code> Options</h3>
      <CalciteTable caption="Intl.DateTimeFormat Options" striped>
        <CalciteActionBar slot="selection-actions">
          <CalciteAction icon="copy" text="Log Selected Options" onClick={logSelectedFormatOptions}/>
        </CalciteActionBar>
        <CalciteTableRow slot="table-header">
          <CalciteTableHeader heading="Property Name"/>
          <CalciteTableHeader heading="Possible Values" description="A value of `undefined` does not render the property"/>
          <CalciteTableHeader heading="Selected Value"/>
        </CalciteTableRow>
        {intlDateTimeFormatOptions.map((option, index) => (
          <CalciteTableRow key={index}>
            <CalciteTableCell><code>{option.name}</code></CalciteTableCell>
            <CalciteTableCell>{option.values.join(", ")}</CalciteTableCell>
            <CalciteTableCell>
              <CalciteSelect onCalciteSelectChange={(event) => {handleFormatSelectChange(option.name, event.target.value)}}>
                <CalciteOption key={0} value={"undefined"} selected={selectedFormatOptions[option.name] === undefined}>undefined</CalciteOption>
                {option.values.map((value, index) => (
                  <CalciteOption key={index} value={value} selected={selectedFormatOptions[option.name] === value}>{value}</CalciteOption>
                ))}
              </CalciteSelect>
            </CalciteTableCell>
          </CalciteTableRow>
        ))}
      </CalciteTable>

      <br/>

      <h3>Dynamic Example (Vanilla JavaScript)</h3>
      <pre style={{
        background: "#f4f4f4",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        overflowX: "auto",
      }}>
        const date = new Date("{selectedDate.toISOString()}");
        <br />
        const options = {JSON.stringify(selectedFormatOptions, null, 2)};
        <br />
        const formattedDate = new Intl.DateTimeFormat(navigator.language, options).format(date);
        <br />
        <br />
        console.log(formattedDate); // {formattedDate}
      </pre>

      <br/>

      <h3>Actions</h3>
      <CalciteList style={{ border: "thin solid black", width: "50%", marginBottom: "6rem" }}>
        <CalciteListItem
          label="Copy your `options` configuration to clipboard as JSON">
          <CalciteAction slot="actions-end" icon="copy-to-clipboard" onClick={handleCopyOptions}/>
        </CalciteListItem>
        <CalciteListItem
          label="Share your configuration as a link">
          <CalciteAction slot="actions-end" icon="copy-to-clipboard" onClick={handleCopyLink}/>
        </CalciteListItem>
      </CalciteList>
    </div>
  );
}

export default App;

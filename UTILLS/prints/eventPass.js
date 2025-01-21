module.exports = function (data, qr) {
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
    
    html { -webkit-print-color-adjust: exact; }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: sans-serif;
      }
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding-top: 100px;
        color: white;
      }
    </style>
  </head>
  <body>
    <div
      style="
        background-color: #3e97cd;
        /* padding-top: 20px; */
        padding-bottom: 100px;
      "
    >
      <div
        style="
          background-color: white;
          padding: 10px;
          display: flex;
          justify-content: center;
          width: 700px;
          padding-top: 15px;
        "
      >
      <div
        style="
          background-color: white;
          display: flex;
          justify-content: center;
          width: 100%;
        ">
      <img
          style="height: 80px"
          src="https://gttcindia.mscorpres.co.in//assets/GTTCI-LOGO.webp"
        />
      </div>
        
      </div>
      <div
        style="
          background-color: #1b5a81;
          padding: 10px;
          color: white;
          font-weight: 700;
          font-size: 42px;
          display: flex;
          justify-content: center;
        "
      >
        <p>${data["Name"]}</p>
      </div>
      <div style="display: flex; justify-content: center; margin-top: 20px">
        <p style="font-size: 18px">${data["Event Start"]} - ${data["Event End"]}</p>
      </div>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <p style="font-size: 18px; width: 60%; text-align: center; ">Location:- ${data["Address"]}  </p>
      </div>
      <div style="display: flex; justify-content: center; margin-top: 10px">
        <p style="font-size: 18px">Event Name:- ${data["Event Name"]} </p>
      </div>
      <div style="display: flex; justify-content: center; margin-top: 40px">
        <img
          style="height: 200px; width: 200px"
          src="${qr}"
          style="background-color: white"
        />
      </div>
    </div>
  </body>
</html>
    `;
};

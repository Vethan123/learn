const { PythonShell } = require('python-shell');


PythonShell.run('text.py', null, function (err, result) {
//   if (err) {
//     console.error("Error executing Python script:", err);
//     return;
//   }

//   console.log("Python script output:");
//   console.log(result.join("\n"));

    console.log("inside shell");
});

PythonShell.run('text.py', null).then(messages=>{
    console.log('finished');
    console.log(messages);
  });
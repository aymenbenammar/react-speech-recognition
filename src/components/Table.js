import { useState } from "react";
import mockdata from "../data.json";
import TableBody from "./TableBody";
import TableHead from "./TableHead";

const annyang = require('annyang');
const Table = () => {
  const [tableData, setTableData] = useState(mockdata);

  const columns = [
    { label: "Full Name", accessor: "full_name", sortable: true },
    { label: "Email", accessor: "email", sortable: false },
    { label: "Gender", accessor: "gender", sortable: true },
    { label: "Age", accessor: "age", sortable: true },
    { label: "Start date", accessor: "start_date", sortable: true },
  ];
  const stop= () =>{
    annyang.abort(); 
    console.log("stopped");
  }
  const hear = () => {
    if(annyang){
        annyang.debug();
        
        var commands={
            'Name up.' :function(){handleSorting("full_name","asc")},
            'Name down.' : function() {handleSorting("full_name","desc")},
            'Gender up.' :function(){handleSorting("gender","asc")},
            'Gender down.' : function() {handleSorting("gender","desc")},
            'Age up.' :function(){handleSorting("age","asc")},
            'Age down.' : function() {handleSorting("age","desc")},
            'Start date up.' :function(){handleSorting("start_date","asc")},
            'Start date down.' : function() {handleSorting("start_date","desc")},
            'Scroll to *section': function(tag){console.log(tag)},

        }
        
        annyang.addCommands(commands); 
  
annyang.addCallback('soundstart', function() {
    console.log('sound detected');  
  });
  annyang.addCallback('result', function() {
    console.log('sound stopped');
  });
  annyang.start();

      }
  }

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
        console.log(sortField); 
        console.log(sortOrder);
      const sorted = [...tableData].sort((a, b) => {
        if (a[sortField] === null) return 1;
        if (b[sortField] === null) return -1;
        if (a[sortField] === null && b[sortField] === null) return 0;
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
        );
      });
      setTableData(sorted);
    }
  };

  return (
    <>
      <section id="section one">
        <table className="table">
     <TableHead {...{ columns, handleSorting }} />
     <TableBody {...{ columns, tableData }} />
   </table></section>
      <button onClick={hear}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
};

export default Table;
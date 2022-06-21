import { useState } from "react";
import mockdata from "../data.json";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import { Button,Form,Row, Col,InputGroup,FormControl } from 'react-bootstrap';

const annyang = require('annyang');
const Table = () => {
  const [tableData, setTableData] = useState(mockdata);
  const [focus,setFocus]=useState("");
  const columns = [
    { label: "Full Name", accessor: "full_name", sortable: true },
    { label: "Email", accessor: "email", sortable: false },
    { label: "Gender", accessor: "gender", sortable: true },
    { label: "Age", accessor: "age", sortable: true },
    { label: "Start date", accessor: "start_date", sortable: true },
  ];
  const stop= () =>{
    annyang.pause(); 
    console.log("paused");
  }
  const resume = ()=>{
    annyang.resume();
  }
  const [bids, setBids] = useState([0]);

  const ws = new WebSocket("wss://ws.bitstamp.net");

  const api = {
    event: "bts:subscribe",
    data: { channel: "order_book_eurusd" },
  };
  
  ws.onopen = (event) => {
    ws.send(JSON.stringify(api));
   
  };
  ws.onmessage = function (event) {
    const json = JSON.parse(event.data);
    try {
      if ((json.event = "data")) {
        setBids(json.data.bids.slice(0,1));
      }
    } catch (err) {
      console.log(err);
    }
  };
  ws.onclose = function (event){
    ws.close()
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
            'Mail.': function(){document.getElementById('e-mail').focus();
                                setFocus('e-mail');
                                annyang.trigger('You just focused on mail');
                                },
            'Password.':function(){document.getElementById('password').focus();
            setFocus('password');},

            'Set :field to *text' : function(field,text){document.getElementById(field).value=text.slice(0,-1)},
            'Euro to Dollar?': function(){
              api.data.channel="order_book_eurusd";
              ws.close()
              ws.send(JSON.stringify(api));
              console.log(api)
              document.getElementById('firstamount').innerHTML="€";
              document.getElementById('secondamount').innerHTML="$";
            },
            'Bitcoin to Dollar?': function(){
              api.data.channel="order_book_btcusd";
               
              ws.send(JSON.stringify(api));
              document.getElementById('firstamount').innerHTML="BTC";
              document.getElementById('secondamount').innerHTML="$";
            }

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
      <Form>
      <Row className="mb-3">
    <Col>
      <Form.Control placeholder="E mail" id="e-mail" />
    </Col>
    <Col>
      <Form.Control placeholder="Password" id="password" />
    </Col>
  </Row>
  <Row className="mb-3">
    <Col>
    <InputGroup className="mb-3">
    <InputGroup.Text id="firstamount">€</InputGroup.Text>
    <FormControl aria-label="Amount (to the nearest dollar)" value="1" />
  </InputGroup>
    </Col>
    <Col>
    <InputGroup className="mb-3">
    <InputGroup.Text id="secondamount">$</InputGroup.Text>
    <FormControl aria-label="Amount (to the nearest dollar)" value={bids} />
  </InputGroup>
    </Col>
  </Row>
  <Row className="mb-3">
    <Col>
  <Button variant="primary" onClick={hear}>
    Start Voice Assistant
  </Button>
  </Col>
  <Col>
  <Button variant="primary" onClick={resume}>
    Resume
  </Button>
  </Col>
  <Col>
  <Button variant="primary" onClick={stop}>
    Pause
  </Button>
  </Col>
  </Row>
</Form>
    </>
  );
};

export default Table;
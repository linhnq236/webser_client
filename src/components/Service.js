import React, {useEffect, useState} from 'react';
import {URL} from './Myconnect';
import '../styles/service.css';
import CurrencyFormat from 'react-currency-format';
import Container from '@material-ui/core/Container';
import moment from 'moment';
const Service = () => {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [amount, setAmount] = useState([]);
  const [rents, setRents] = useState([]);
  const [rentYes, setRentYes] = useState([]);
  const [rentNo, setRentNo] = useState([]);
  let id = localStorage.getItem('id');
  useEffect(()=> {
    getService(id);
    getPaytherent(id);
  }, [])
  const getService = (id) => {
    let url = URL+`/api/getUseServices/${id}`;
    fetch(url)
       .then(res => res.json())
       .then(res => {
         setItems(res.data);
         setAmount(res.service_amount);
       })
       .catch((error) => {
         setError(error);
       })
       .finally(() => setLoading(false));
  }

  const getPaytherent = (id) => {
    let url = URL+`/api/getPaytheRent/${id}`;
    fetch(url)
       .then(res => res.json())
       .then(res => {
         var array_rentYes = [];
	 var array_rentNo = [];
         res.data.map((key,value)=>(
           key['status'] == 1 ? array_rentYes.push(key['money']) : array_rentNo.push(key['money'])
         ));
         setRents(res.data);
         setRentYes(array_rentYes);
         setRentNo(array_rentNo);
       })
       .catch((error) => {
         setError(error);
       })
       .finally(() => setLoading(false));
  }
  if (error) {
    return <div className="text-center">Error: {error.message}</div>;
  } else if (isLoading) {
    return <div className="text-center">Loading...</div>;
  } else {
  return(
      <>
      <Container maxWidth="md" component="main">
        <table className="table">
          <thead>
            <tr>
              <th colSpan="5" className="text-center border text-uppercase">My services are using</th>
            </tr>
            <tr>
              <th className="text-center border">Service</th>
              <th className="text-center border">Cost(vnd)</th>
              <th className="text-center border">Amount</th>
              <th className="text-center border">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((key,value)=> (
              <tr key={value}>
                  <td className="border text-center text-capitalize">{key.name}</td>
                  <td className="border text-center"><CurrencyFormat value={key.cost} displayType={'text'} thousandSeparator={true} /></td>
                  <td className="border text-center">{amount[value]}</td>
                  <td className="border text-center">{key.status === 1 ? 'Compulsory' : '	Optional'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="table">
          <thead>
            <tr className="text-center">
              <th  colSpan="5" className="tex-t-center border text-uppercase">Monthly rent</th>
            </tr>
            <tr>
              <th className="text-center border">Order</th>
              <th className="text-center border">Month</th>
              <th className="text-center border">Money(vnd)</th>
              <th className="text-center border">Date of payment</th>
              <th className="text-center border">Status</th>
            </tr>
          </thead>
          <tbody>
            {rents.map((key,value)=> (
              <tr key={value} className={key.status ===0? "":""}>
                  <td className="border text-center">{value}</td>
                  <td className="border text-center">{key.senddate}</td>
                  <td className="border text-center"><CurrencyFormat value={key.money} displayType={'text'} thousandSeparator={true} /></td>
                  <td className="border text-center">{key.receivedate}</td>
                  <td className="border text-center">{key.status ===0? "No":"Yes"}</td>
              </tr>
            ))}
              <tr className="bg-info">
                <th className="border text-center" colSpan="2">Total</th>
                <th className="border text-center" colSpan="3"><CurrencyFormat value={rentYes.reduce((totalMoney, rent) => totalMoney + rent, 0)} displayType={'text'} thousandSeparator={true} /> vnd</th>
              </tr>
 	      <tr className="bg-info">
                <th className="border text-center" colSpan="2">Still owe</th>
                <th className="border text-center" colSpan="3"><CurrencyFormat value={rentNo.reduce((totalMoney, rent) => totalMoney + rent, 0)} displayType={'text'} thousandSeparator={true} /> vnd</th>
              </tr>
          </tbody>
        </table>
      </Container>
      </>
    )
  }
}
export default Service;

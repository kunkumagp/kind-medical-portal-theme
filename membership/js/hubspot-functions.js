//function updateContact(contactId, data){
//   var requestOptions = {
//     'method': 'GET',
//     'headers': {
//       'Content-Type': 'application/json',
//     },
//   };
//   return fetch("/_hcms/api/hello", requestOptions)
//     .then(res => {
//     if(res.ok) {
//       return res.json();
//     }
//     return res.json().then(error => {
//       throw error;
//     });
//   });
//}

function updateContact(contactId, data){
  var requestOptions = {
    'method': 'PUT',
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': JSON.stringify({
      contactId: contactId,
      data: data,
    }),
  };
  return fetch(config.endpoint.updateContact, requestOptions)
    .then(res => {
    if(res.ok) {
      return res.json();
    }
    return res.json().then(error => {
      console.log(error);
      throw error;
    });
  });
}